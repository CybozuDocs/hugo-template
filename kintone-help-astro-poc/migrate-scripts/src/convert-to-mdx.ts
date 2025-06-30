#!/usr/bin/env node
/**
 * Main Hugo to Astro MDX conversion script
 * Following all convert_prompt.md requirements
 */

import { Command } from 'commander';
import { 
  findMarkdownFiles, 
  createPathMapping, 
  readFileContent, 
  writeFileContent,
  shouldProcessFile,
  validateConfig
} from './lib/file-utils.js';
import { parseFrontMatter, addLayoutToFrontMatter, combineFrontMatterAndContent } from './lib/frontmatter.js';
import { transformShortcodesInContent, transformImagesToComponents, generateImportStatements } from './lib/string-transformer.js';
import type { ConversionConfig, FileProcessResult, ConversionProgress, ImagePathTransform } from './types/conversion.js';

/**
 * Convert a single file from Hugo Markdown to Astro MDX
 */
async function convertSingleFile(
  sourcePath: string,
  targetPath: string,
  isIndexFile: boolean,
  config?: ConversionConfig
): Promise<FileProcessResult> {
  const usedComponents = new Set<string>();
  const errors: string[] = [];
  const warnings: string[] = [];
  let bytesProcessed = 0;
  
  try {
    // Read source file
    const sourceContent = await readFileContent(sourcePath);
    bytesProcessed = Buffer.byteLength(sourceContent, 'utf8');
    
    // Parse frontmatter
    const { frontmatter, content } = parseFrontMatter(sourceContent);
    
    // Add layout field
    const enhancedFrontmatter = addLayoutToFrontMatter(frontmatter, isIndexFile);
    
    // Transform headers first (before shortcodes to handle headers with shortcodes)
    const { transformHeadersToComponents } = await import('./lib/string-transformer.js');
    const headerTransformedContent = transformHeadersToComponents(content, usedComponents);
    
    if (sourcePath.includes('ai/_index.md')) {
      console.log('DEBUG ai/_index.md header transformation:');
      console.log('Original content length:', content.length);
      console.log('Transformed content length:', headerTransformedContent.length);
      console.log('Before:', content.substring(2000, 2200));
      console.log('After:', headerTransformedContent.substring(2000, 2200));
      
      // Search for the specific header line in both
      const originalHeaderMatch = content.match(/## \{\{< kintone >\}\} AIラボのサポート\{#ai_index_40\}/);
      const transformedHeaderMatch = headerTransformedContent.match(/## \{\{< kintone >\}\} AIラボのサポート\{#ai_index_40\}/);
      const headingMatch = headerTransformedContent.match(/<Heading level=\{2\} id="ai_index_40">/);
      
      console.log('Original has header:', !!originalHeaderMatch);
      console.log('Transformed still has header:', !!transformedHeaderMatch);
      console.log('Transformed has Heading component:', !!headingMatch);
    }
    
    // Transform shortcodes
    const shortcodeResult = transformShortcodesInContent(headerTransformedContent, usedComponents);
    errors.push(...shortcodeResult.errors);
    warnings.push(...shortcodeResult.warnings);
    
    // Transform images
    const imageResult = transformImagesToComponents(
      shortcodeResult.transformedContent, 
      usedComponents,
      config?.imagePathTransform
    );
    errors.push(...imageResult.errors);
    
    // Apply post-processing fixes (e.g., numbered list indentation)
    const { applyPostProcessingFixes } = await import('./lib/string-transformer.js');
    const postProcessedContent = applyPostProcessingFixes(imageResult.transformedContent);
    
    // Generate imports
    const imports = generateImportStatements(usedComponents);
    
    // Combine everything
    const finalContent = combineFrontMatterAndContent(
      enhancedFrontmatter,
      imports,
      postProcessedContent
    );
    
    // Write target file
    await writeFileContent(targetPath, finalContent);
    
    return {
      inputPath: sourcePath,
      outputPath: targetPath,
      success: errors.length === 0,
      imports: Array.from(imports),
      errors,
      warnings,
      bytesProcessed
    } as const;
    
  } catch (error) {
    errors.push(`Conversion failed: ${String(error)}`);
    return {
      inputPath: sourcePath,
      outputPath: targetPath,
      success: false,
      imports: [],
      errors,
      warnings,
      bytesProcessed
    } as const;
  }
}

/**
 * Convert files in a specific directory
 */
async function convertSpecificDirectory(config: ConversionConfig, dirName: string): Promise<void> {
  console.log(`🚀 Starting Hugo to Astro MDX conversion for ${dirName}...\\n`);
  
  // Validate configuration
  const validation = await validateConfig(config);
  if (!validation.valid) {
    console.error('❌ Configuration validation failed:');
    validation.errors.forEach(error => console.error(`  ${error}`));
    process.exit(1);
  }
  
  // Find all markdown files and filter for specific directory
  console.log(`📂 Scanning source directory: ${config.sourceDir}`);
  const allFiles = await findMarkdownFiles(config.sourceDir);
  const markdownFiles = allFiles.filter(file => {
    const relativePath = file.replace(config.sourceDir + '/', '');
    return relativePath.startsWith(dirName + '/');
  });
  
  console.log(`📊 Found ${markdownFiles.length} markdown files in ${dirName}\\n`);
  
  // Create progress tracker
  const progress: ConversionProgress = {
    total: markdownFiles.length,
    processed: 0,
    successful: 0,
    failed: 0,
    skipped: 0,
    startTime: Date.now()
  };
  
  // Process files (rest same as convertAllFiles)
  const results: FileProcessResult[] = [];
  
  for (const sourcePath of markdownFiles) {
    const mapping = createPathMapping(sourcePath, config.sourceDir, config.targetDir);
    
    // Convert file
    if (config.verbose) {
      console.log(`🔄 Converting: ${mapping.sourcePath.split('/').slice(-3).join('/')}`);
    }
    
    if (!config.dryRun) {
      const result = await convertSingleFile(
        mapping.sourcePath,
        mapping.targetPath,
        mapping.isIndexFile,
        config
      );
      
      results.push(result);
      
      if (result.success) {
        progress.successful++;
      } else {
        progress.failed++;
        console.error(`❌ Failed: ${mapping.sourcePath.split('/').slice(-3).join('/')}`);
        result.errors.forEach(error => console.error(`  ${error}`));
      }
    }
    
    progress.processed++;
  }
  
  // Final report (same as convertAllFiles)
  console.log('\\n📊 Conversion Summary:');
  console.log(`  Total files: ${progress.total}`);
  console.log(`  Processed: ${progress.processed}`);
  console.log(`  Successful: ${progress.successful}`);
  console.log(`  Failed: ${progress.failed}`);
  console.log(`  Skipped: ${progress.skipped}`);
  
  const totalBytes = results.reduce((sum, r) => sum + r.bytesProcessed, 0);
  console.log(`  Total data processed: ${(totalBytes / 1024 / 1024).toFixed(2)} MB`);
  
  const elapsed = (Date.now() - progress.startTime) / 1000;
  console.log(`  Total time: ${elapsed.toFixed(2)}s`);
  
  // Component usage statistics
  const allComponents = new Set<string>();
  results.forEach(r => r.imports.forEach(imp => {
    const match = /import\\s+(\\w+)/.exec(imp);
    if (match?.[1]) {
      allComponents.add(match[1]);
    }
  }));
  
  console.log(`  Components used: [${Array.from(allComponents).sort().join(', ')}]`);
  
  if (progress.failed > 0) {
    console.log('\\n❌ Some files failed to convert. Check error messages above.');
    process.exit(1);
  } else {
    console.log('\\n✅ All files converted successfully!');
  }
}

/**
 * Convert all files in batch
 */
async function convertAllFiles(config: ConversionConfig): Promise<void> {
  console.log('🚀 Starting Hugo to Astro MDX conversion...\n');
  
  // Validate configuration
  const validation = await validateConfig(config);
  if (!validation.valid) {
    console.error('❌ Configuration validation failed:');
    validation.errors.forEach(error => console.error(`  ${error}`));
    process.exit(1);
  }
  
  // Find all markdown files
  console.log(`📂 Scanning source directory: ${config.sourceDir}`);
  const markdownFiles = await findMarkdownFiles(config.sourceDir);
  console.log(`📊 Found ${markdownFiles.length} markdown files\n`);
  
  // Create progress tracker
  const progress: ConversionProgress = {
    total: markdownFiles.length,
    processed: 0,
    successful: 0,
    failed: 0,
    skipped: 0,
    startTime: Date.now()
  };
  
  // Process files
  const results: FileProcessResult[] = [];
  
  for (const sourcePath of markdownFiles) {
    const mapping = createPathMapping(sourcePath, config.sourceDir, config.targetDir);
    
    // Check if file should be processed (incremental mode)
    if (config.incremental) {
      const shouldProcess = await shouldProcessFile(
        mapping.sourcePath,
        mapping.targetPath,
        config.incremental
      );
      
      if (!shouldProcess) {
        progress.skipped++;
        if (config.verbose) {
          console.log(`⏭️  Skipped: ${mapping.sourcePath.split('/').slice(-3).join('/')}`);
        }
        continue;
      }
    }
    
    // Convert file
    if (config.verbose) {
      console.log(`🔄 Converting: ${mapping.sourcePath.split('/').slice(-3).join('/')}`);
    }
    
    if (!config.dryRun) {
      const result = await convertSingleFile(
        mapping.sourcePath,
        mapping.targetPath,
        mapping.isIndexFile,
        config
      );
      
      results.push(result);
      
      if (result.success) {
        progress.successful++;
      } else {
        progress.failed++;
        console.error(`❌ Failed: ${mapping.sourcePath.split('/').slice(-3).join('/')}`);
        result.errors.forEach(error => console.error(`  ${error}`));
      }
    }
    
    progress.processed++;
    
    // Show progress
    if (progress.processed % 50 === 0 || progress.processed === progress.total) {
      const elapsed = (Date.now() - progress.startTime) / 1000;
      const rate = progress.processed / elapsed;
      console.log(`📈 Progress: ${progress.processed}/${progress.total} (${Math.round(rate)} files/sec)`);
    }
  }
  
  // Final report
  console.log('\n📊 Conversion Summary:');
  console.log(`  Total files: ${progress.total}`);
  console.log(`  Processed: ${progress.processed}`);
  console.log(`  Successful: ${progress.successful}`);
  console.log(`  Failed: ${progress.failed}`);
  console.log(`  Skipped: ${progress.skipped}`);
  
  const totalBytes = results.reduce((sum, r) => sum + r.bytesProcessed, 0);
  console.log(`  Total data processed: ${(totalBytes / 1024 / 1024).toFixed(2)} MB`);
  
  const elapsed = (Date.now() - progress.startTime) / 1000;
  console.log(`  Total time: ${elapsed.toFixed(2)}s`);
  
  // Component usage statistics
  const allComponents = new Set<string>();
  results.forEach(r => r.imports.forEach(imp => {
    const match = /import\s+(\w+)/.exec(imp);
    if (match?.[1]) {
      allComponents.add(match[1]);
    }
  }));
  
  console.log(`  Components used: [${Array.from(allComponents).sort().join(', ')}]`);
  
  if (progress.failed > 0) {
    console.log('\n❌ Some files failed to convert. Check error messages above.');
    process.exit(1);
  } else {
    console.log('\n✅ All files converted successfully!');
  }
}

/**
 * Test mode - convert a few sample files
 */
async function testMode(): Promise<void> {
  console.log('🧪 Running in test mode on all ja/start files...\n');
  
  // Find all markdown files in ja/start directory
  const { findMarkdownFiles } = await import('./lib/file-utils.js');
  const sourceDir = '/Users/mugi/ghq/github.com/CybozuDocs/kintone/content/ja';
  const allFiles = await findMarkdownFiles(sourceDir);
  const testFiles = allFiles.filter(file => file.includes('/start/'));
  
  console.log(`📊 Found ${testFiles.length} files in ja/start directory\n`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const testFile of testFiles) {
    try {
      console.log(`🔍 Testing: ${testFile.split('/').slice(-3).join('/')}`);
      
      const mapping = createPathMapping(
        testFile,
        '/Users/mugi/ghq/github.com/CybozuDocs/kintone/content/ja',
        'kintone-help-astro-poc/src/pages/ja'
      );
      
      const result = await convertSingleFile(
        mapping.sourcePath,
        mapping.targetPath,
        mapping.isIndexFile
      );
      
      if (result.success) {
        successCount++;
        console.log(`  ✅ Success: ${result.success}`);
        console.log(`  📦 Components: [${result.imports.map(imp => {
          const match = /import\s+(\w+)/.exec(imp);
          return match?.[1] || 'Unknown';
        }).join(', ')}]`);
      } else {
        errorCount++;
        console.log(`  ❌ Failed: ${result.success}`);
      }
      
      if (result.errors.length > 0) {
        console.log(`  ❌ Errors: ${result.errors.join(', ')}`);
      }
      
      if (result.warnings.length > 0) {
        console.log(`  ⚠️  Warnings: ${result.warnings.join(', ')}`);
      }
      
      console.log('');
    } catch (error) {
      errorCount++;
      console.error(`❌ Test failed for ${testFile}: ${String(error)}\n`);
    }
  }
  
  // Print summary
  console.log('📋 Test Summary:');
  console.log('='.repeat(50));
  console.log(`✅ Successful: ${successCount}/${testFiles.length}`);
  console.log(`❌ Failed: ${errorCount}/${testFiles.length}`);
  console.log(`🎯 Success Rate: ${((successCount / testFiles.length) * 100).toFixed(1)}%`);
}

/**
 * Main CLI function
 */
async function main(): Promise<void> {
  const program = new Command();
  
  program
    .name('convert-to-mdx')
    .description('Convert Hugo content to Astro MDX files')
    .version('1.0.0');
  
  program
    .option('--all', 'Convert all files')
    .option('--test', 'Run in test mode (convert sample files)')
    .option('--dir <directory>', 'Convert specific directory')
    .option('--incremental', 'Only convert files that have changed')
    .option('--dry-run', 'Show what would be converted without actually converting')
    .option('--verbose', 'Show detailed progress')
    .option('--source <path>', 'Source directory path', '/Users/mugi/ghq/github.com/CybozuDocs/kintone/content/ja')
    .option('--target <path>', 'Target directory path', 'kintone-help-astro-poc/src/pages/ja')
    .option('--img-path-from <prefix>', 'Image path prefix to replace (e.g., "/k/")')
    .option('--img-path-to <prefix>', 'Image path prefix replacement (e.g., "/k/kintone/")');
  
  program.parse();
  
  const options = program.opts();
  
  // Build image path transform configuration if both options are provided
  let imagePathTransform: ConversionConfig['imagePathTransform'];
  if (options['imgPathFrom'] && options['imgPathTo']) {
    imagePathTransform = {
      from: options['imgPathFrom'],
      to: options['imgPathTo']
    };
  }
  
  if (options['test']) {
    await testMode();
    return;
  }
  
  if (options['all']) {
    const config: ConversionConfig = {
      sourceDir: options['source'],
      targetDir: options['target'],
      dryRun: options['dryRun'] || false,
      incremental: options['incremental'] || false,
      verbose: options['verbose'] || false,
      testMode: false,
      maxConcurrency: 10,
      imagePathTransform
    };
    
    await convertAllFiles(config);
    return;
  }
  
  if (options['dir']) {
    const dirName = options['dir'];
    const config: ConversionConfig = {
      sourceDir: options['source'],
      targetDir: options['target'],
      dryRun: options['dryRun'] || false,
      incremental: options['incremental'] || false,
      verbose: options['verbose'] || false,
      testMode: false,
      maxConcurrency: 10,
      filterDir: dirName,  // Add filter for specific directory
      imagePathTransform
    };
    
    await convertSpecificDirectory(config, dirName);
    return;
  }
  
  // Show help if no action specified
  program.help();
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}