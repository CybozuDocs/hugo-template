/**
 * Integration Tests for Full Conversion Pipeline
 * Using Node.js Test Runner
 */

import { test, describe } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Import the main conversion function
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('Integration Tests - Full Conversion Pipeline', () => {
  
  describe('Real File Conversion', () => {
    test('should successfully convert start/_index.md', async () => {
      // Use dynamic import to load conversion functions
      const { transformShortcodesInContent, transformImagesToComponents, applyPostProcessingFixes, generateImportStatements } = await import('../src/lib/string-transformer.js');
      const { parseFrontMatter, addLayoutToFrontMatter, combineFrontMatterAndContent } = await import('../src/lib/frontmatter.js');
      
      const sourceFile = '/Users/mugi/ghq/github.com/CybozuDocs/kintone/content/ja/start/_index.md';
      
      try {
        const sourceContent = await readFile(sourceFile, 'utf-8');
        const usedComponents = new Set<string>();
        
        // Parse FrontMatter
        const { frontmatter, content } = parseFrontMatter(sourceContent);
        
        // Add layout
        const enhancedFrontmatter = addLayoutToFrontMatter(frontmatter, true);
        
        // Transform shortcodes
        const shortcodeResult = transformShortcodesInContent(content, usedComponents);
        
        // Transform images
        const imageResult = transformImagesToComponents(shortcodeResult.transformedContent, usedComponents);
        
        // Apply post-processing
        const postProcessedContent = applyPostProcessingFixes(imageResult.transformedContent);
        
        // Generate imports
        const imports = generateImportStatements(usedComponents);
        
        // Combine everything
        const finalContent = combineFrontMatterAndContent(
          enhancedFrontmatter,
          imports,
          postProcessedContent
        );
        
        // Verify results
        assert.ok(finalContent.includes('layout: "@/layouts/SectionLayout.astro"'), 'Should have SectionLayout for index file');
        assert.ok(finalContent.includes('<Kintone />'), 'Should transform kintone shortcode');
        assert.ok(finalContent.includes('import Kintone from "@/components/Kintone.astro";'), 'Should generate import statement');
        assert.strictEqual(shortcodeResult.errors.length, 0, 'Should have no transformation errors');
        
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
          console.log('⚠️  Source file not found, skipping real file test');
          return;
        }
        throw error;
      }
    });

    test('should successfully convert whatskintone.md with complex content', async () => {
      const { transformShortcodesInContent, transformImagesToComponents, applyPostProcessingFixes, generateImportStatements } = await import('../src/lib/string-transformer.js');
      const { parseFrontMatter, addLayoutToFrontMatter, combineFrontMatterAndContent } = await import('../src/lib/frontmatter.js');
      
      const sourceFile = '/Users/mugi/ghq/github.com/CybozuDocs/kintone/content/ja/start/whatskintone.md';
      
      try {
        const sourceContent = await readFile(sourceFile, 'utf-8');
        const usedComponents = new Set<string>();
        
        // Full conversion pipeline
        const { frontmatter, content } = parseFrontMatter(sourceContent);
        const enhancedFrontmatter = addLayoutToFrontMatter(frontmatter, false);
        const shortcodeResult = transformShortcodesInContent(content, usedComponents);
        const imageResult = transformImagesToComponents(shortcodeResult.transformedContent, usedComponents);
        const postProcessedContent = applyPostProcessingFixes(imageResult.transformedContent);
        const imports = generateImportStatements(usedComponents);
        const finalContent = combineFrontMatterAndContent(enhancedFrontmatter, imports, postProcessedContent);
        
        // Verify complex transformations
        assert.ok(finalContent.includes('<Enabled regions={["JP"]}>'), 'Should transform enabled2 JP');
        assert.ok(finalContent.includes('<Enabled regions={["US", "CN"]}>'), 'Should transform enabled2 US CN');
        assert.ok(finalContent.includes('<Heading level={2}'), 'Should transform headers');
        assert.ok(finalContent.includes('<Img src='), 'Should transform images');
        assert.ok(finalContent.includes('<Reference>'), 'Should transform reference');
        
        // Verify FrontMatter preservation
        assert.ok(finalContent.includes('title: "{{< kintone >}}とは？"'), 'Should preserve FrontMatter shortcode');
        
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
          console.log('⚠️  Source file not found, skipping real file test');
          return;
        }
        throw error;
      }
    });

    test('should handle numbered list indentation correctly', async () => {
      const { applyPostProcessingFixes } = await import('../src/lib/string-transformer.js');
      
      const testContent = `1. First step:
  <Img src="/image1.png" alt="Step 1" />

2. Second step:
  <Img src="/image2.png" alt="Step 2" />
   * Sub item
  <Img src="/image3.png" alt="Step 2 sub" />

Normal paragraph:
  <Img src="/normal.png" alt="Normal" />`;
      
      const result = applyPostProcessingFixes(testContent);
      
      // Should fix numbered list images to 3-space indent
      assert.ok(result.includes('1. First step:\n   <Img src="/image1.png"'), 'Should fix first image');
      assert.ok(result.includes('2. Second step:\n   <Img src="/image2.png"'), 'Should fix second image');
      assert.ok(result.includes('   <Img src="/image3.png"'), 'Should fix sub-item image');
      
      // Should leave normal paragraph as 2-space indent
      assert.ok(result.includes('Normal paragraph:\n  <Img src="/normal.png"'), 'Should preserve normal indent');
    });
  });

  describe('Component Import Generation', () => {
    test('should generate correct imports for all used components', async () => {
      const { generateImportStatements } = await import('../src/lib/string-transformer.js');
      
      const usedComponents = new Set(['kintone', 'enabled2', 'Img', 'Heading']);
      const imports = generateImportStatements(usedComponents);
      
      assert.ok(imports.some(imp => imp.includes('import Kintone from "@/components/Kintone.astro";')), 'Should import Kintone');
      assert.ok(imports.some(imp => imp.includes('import Enabled from "@/components/Enabled.astro";')), 'Should import Enabled');
      assert.ok(imports.some(imp => imp.includes('import Img from "@/components/Img.astro";')), 'Should import Img');
      assert.ok(imports.some(imp => imp.includes('import Heading from "@/components/Heading.astro";')), 'Should import Heading');
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid YAML gracefully', async () => {
      const { parseFrontMatter } = await import('../src/lib/frontmatter.js');
      
      const invalidContent = `---
title: "Valid"
invalid: [unclosed array
weight: 100
---

Content here`;
      
      try {
        const result = parseFrontMatter(invalidContent);
        // Should not reach here if YAML is truly invalid
        assert.fail('Should have thrown an error for invalid YAML');
      } catch (error) {
        assert.ok(error instanceof Error, 'Should throw an Error');
        assert.ok((error as Error).message.includes('Failed to parse FrontMatter YAML'), 'Should have descriptive error message');
      }
    });

    test('should handle content without FrontMatter', async () => {
      const { parseFrontMatter } = await import('../src/lib/frontmatter.js');
      
      const contentOnly = 'Just some content without frontmatter';
      const result = parseFrontMatter(contentOnly);
      
      assert.strictEqual(result.frontmatter.title, null, 'Should have null title');
      assert.strictEqual(result.frontmatter.weight, null, 'Should have null weight');
      assert.strictEqual(result.content, 'Just some content without frontmatter', 'Should preserve content');
    });
  });

  describe('Performance', () => {
    test('should process large content efficiently', async () => {
      const { transformShortcodesInContent } = await import('../src/lib/string-transformer.js');
      
      // Create a large content with many shortcodes
      const largeContent = Array(1000).fill('Text with {{< kintone >}} shortcode. ').join('\n');
      const usedComponents = new Set<string>();
      
      const startTime = Date.now();
      const result = transformShortcodesInContent(largeContent, usedComponents);
      const endTime = Date.now();
      
      const processingTime = endTime - startTime;
      
      assert.ok(processingTime < 1000, `Should process large content quickly (took ${processingTime}ms)`);
      assert.ok(result.transformedContent.includes('<Kintone />'), 'Should transform all shortcodes');
      assert.strictEqual(result.errors.length, 0, 'Should have no errors');
    });
  });
});