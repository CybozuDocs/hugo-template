#!/usr/bin/env tsx

import { basename, dirname } from 'node:path';
import { parseCliArgs } from './cli.js';
import {
  findMarkdownFiles,
  getOutputPath,
  readMarkdownFile,
  writeMarkdownFile,
  shouldSkipFile,
} from './file-utils.js';
import {
  parseFrontMatter,
  stringifyFrontMatter,
  processFrontMatter,
} from './frontmatter-processor.js';
import { processImages, processImagePathInList } from './image-processor.js';
import { processShortcodes } from './shortcode-processor.js';
import { processHeadings } from './heading-processor.js';
import type { ConversionConfig, ProcessingStats, ConversionResult } from './types.js';

async function main(): Promise<void> {
  try {
    const config = parseCliArgs();
    console.log('🚀 Starting Hugo to Astro content conversion...');
    console.log(`📁 Input: ${config.inputDir}`);
    console.log(`📁 Output: ${config.outputDir}`);
    
    if (config.filter) {
      console.log(`🔍 Filter: ${config.filter}`);
    }
    
    if (config.imagePathPrefix) {
      console.log(`🖼️  Image path: ${config.imagePathPrefix.from} → ${config.imagePathPrefix.to}`);
    }
    
    const stats = await convertFiles(config);
    printStats(stats);
    
    console.log('✅ Conversion completed successfully!');
  } catch (error) {
    console.error('❌ Conversion failed:', error);
    process.exit(1);
  }
}

async function convertFiles(config: ConversionConfig): Promise<ProcessingStats> {
  const stats: ProcessingStats = {
    totalFiles: 0,
    processedFiles: 0,
    convertedFiles: 0,
    skippedFiles: 0,
    errors: 0,
  };
  
  // Find all markdown files
  console.log('🔍 Finding markdown files...');
  const files = await findMarkdownFiles(config.inputDir, config.filter);
  stats.totalFiles = files.length;
  
  if (files.length === 0) {
    console.warn('⚠️  No markdown files found');
    return stats;
  }
  
  console.log(`📄 Found ${files.length} markdown files`);
  
  // Process each file
  for (const inputFile of files) {
    try {
      if (shouldSkipFile(inputFile, config)) {
        stats.skippedFiles++;
        continue;
      }
      
      const success = await convertFile(inputFile, config);
      stats.processedFiles++;
      
      if (success) {
        stats.convertedFiles++;
      }
      
      // Show progress
      if (stats.processedFiles % 10 === 0) {
        console.log(`📊 Progress: ${stats.processedFiles}/${files.length} files processed`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${inputFile}:`, error);
      stats.errors++;
    }
  }
  
  return stats;
}

async function convertFile(inputFile: string, config: ConversionConfig): Promise<boolean> {
  // Read file content
  const content = await readMarkdownFile(inputFile);
  
  // Parse frontmatter and content
  const { frontmatter, content: bodyContent } = parseFrontMatter(content);
  
  // Determine if this is an index file
  const isIndexFile = basename(inputFile) === '_index.md';
  
  // Process frontmatter
  const processedFrontMatter = processFrontMatter(frontmatter, isIndexFile);
  
  // Collect all imports and process content
  const allImports = new Set<string>();
  let processedContent = bodyContent;
  let hasChanges = false;
  
  // Process images
  const imageResult = processImages(processedContent, config.imagePathPrefix);
  if (imageResult.converted) {
    processedContent = imageResult.content;
    imageResult.imports.forEach(imp => allImports.add(imp));
    hasChanges = true;
  }
  
  // Process shortcodes
  const shortcodeResult = processShortcodes(processedContent);
  if (shortcodeResult.converted) {
    processedContent = shortcodeResult.content;
    shortcodeResult.imports.forEach(imp => allImports.add(imp));
    hasChanges = true;
  }
  
  // Process headings
  const headingResult = processHeadings(processedContent);
  if (headingResult.converted) {
    processedContent = headingResult.content;
    headingResult.imports.forEach(imp => allImports.add(imp));
    hasChanges = true;
  }
  
  // Fix image indentation in lists
  processedContent = processImagePathInList(processedContent);
  
  // Generate final content
  const finalContent = generateFinalContent(
    processedFrontMatter,
    Array.from(allImports),
    processedContent
  );
  
  // Determine output path
  const outputPath = getOutputPath(inputFile, config.inputDir, config.outputDir);
  
  // Write converted file
  await writeMarkdownFile(outputPath, finalContent);
  
  // Report conversion details
  if (hasChanges || allImports.size > 0) {
    console.log(`✅ Converted: ${inputFile} → ${outputPath}`);
    if (allImports.size > 0) {
      console.log(`   📦 Imports: ${Array.from(allImports).length} components`);
    }
  } else {
    console.log(`📝 Processed: ${inputFile} → ${outputPath}`);
  }
  
  return true;
}

function generateFinalContent(
  frontmatter: Record<string, unknown>,
  imports: string[],
  content: string
): string {
  const parts: string[] = [];
  
  // Add frontmatter
  const frontmatterContent = stringifyFrontMatter(frontmatter, '');
  parts.push(frontmatterContent.replace(/\n$/, '')); // Remove trailing newline
  
  // Add imports if any
  if (imports.length > 0) {
    parts.push('');
    parts.push(imports.sort().join('\n'));
  }
  
  // Add content
  parts.push('');
  parts.push(content);
  
  return parts.join('\n');
}

function printStats(stats: ProcessingStats): void {
  console.log('\n📊 Conversion Statistics:');
  console.log(`   📄 Total files found: ${stats.totalFiles}`);
  console.log(`   ✅ Files processed: ${stats.processedFiles}`);
  console.log(`   🔄 Files converted: ${stats.convertedFiles}`);
  console.log(`   ⏭️  Files skipped: ${stats.skippedFiles}`);
  console.log(`   ❌ Errors: ${stats.errors}`);
  
  if (stats.processedFiles > 0) {
    const conversionRate = Math.round((stats.convertedFiles / stats.processedFiles) * 100);
    console.log(`   📈 Conversion rate: ${conversionRate}%`);
  }
}

// Helper function for debugging
export function analyzeFile(filePath: string): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const content = await readMarkdownFile(filePath);
      const { frontmatter, content: bodyContent } = parseFrontMatter(content);
      
      console.log('📋 File Analysis:', filePath);
      console.log('📝 FrontMatter:', frontmatter);
      console.log('🖼️  Images found:', processImages(bodyContent).imports.length > 0);
      console.log('🔧 Shortcodes found:', processShortcodes(bodyContent).imports.length > 0);
      
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

// Run main function if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}