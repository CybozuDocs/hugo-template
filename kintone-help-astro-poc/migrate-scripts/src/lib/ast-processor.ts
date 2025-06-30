/**
 * AST processing for Markdown to MDX conversion
 * Addressing convert_prompt.md concern: "Markdown として Parse し、MDX として出力するため、それぞれで異なる AST を用いる可能性がある"
 */

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkStringify from 'remark-stringify';
import type { Root } from 'mdast';
import { VFile } from 'vfile';
import type { AstTransformResult } from '../types/conversion.js';

/**
 * Create Astro-compatible markdown processor for AST parsing
 * Following Astro's @astrojs/markdown-remark approach
 */
export function createMarkdownProcessor() {
  return unified()
    .use(remarkParse)
    .use(remarkFrontmatter, ['yaml'])
    .use(remarkGfm);  // GitHub Flavored Markdown (Astro default)
}

/**
 * Create MDX output processor
 */
export function createMdxProcessor() {
  return unified()
    .use(remarkFrontmatter, ['yaml'])  // Handle yaml nodes
    .use(remarkStringify, {
      bullet: '-',
      emphasis: '_',
      fences: true,
      incrementListMarker: true,
      listItemIndent: 'one',
      rule: '-',
      strong: '*',
      tightDefinitions: true
    });
}

/**
 * Test Markdown to MDX AST conversion feasibility
 * This addresses the key concern from convert_prompt.md
 */
export async function testAstConversion(markdownContent: string): Promise<{
  readonly success: boolean;
  readonly originalAst: Root | null;
  readonly convertedContent: string | null;
  readonly errors: readonly string[];
}> {
  const errors: string[] = [];
  
  try {
    // Step 1: Parse Markdown content to AST
    const processor = createMarkdownProcessor();
    const ast = processor.parse(markdownContent) as Root;
    
    if (!ast) {
      errors.push('Failed to parse Markdown content to AST');
      return { success: false, originalAst: null, convertedContent: null, errors };
    }
    
    // Step 2: Verify AST structure
    if (ast.type !== 'root') {
      errors.push(`Expected root AST node, got: ${ast.type}`);
      return { success: false, originalAst: ast, convertedContent: null, errors };
    }
    
    // Step 3: Convert AST back to Markdown (as proof of concept)
    const mdxProcessor = createMdxProcessor();
    const result = mdxProcessor.stringify(ast);
    
    return {
      success: true,
      originalAst: ast,
      convertedContent: result,
      errors: []
    } as const;
    
  } catch (error) {
    errors.push(`AST conversion failed: ${String(error)}`);
    return {
      success: false,
      originalAst: null,
      convertedContent: null,
      errors
    } as const;
  }
}

/**
 * Basic AST transformation test with Hugo shortcode detection
 */
export async function testShortcodeDetection(content: string): Promise<{
  readonly shortcodesFound: readonly string[];
  readonly textNodes: number;
  readonly success: boolean;
  readonly errors: readonly string[];
}> {
  const errors: string[] = [];
  const shortcodesFound: string[] = [];
  let textNodeCount = 0;
  
  try {
    const processor = createMarkdownProcessor();
    const ast = processor.parse(content) as Root;
    
    // Walk through AST to find text nodes with shortcodes
    function visitNode(node: unknown): void {
      if (typeof node !== 'object' || node === null) {
        return;
      }
      
      const typedNode = node as { type?: string; value?: string; children?: unknown[] };
      
      if (typedNode.type === 'text' && typeof typedNode.value === 'string') {
        textNodeCount++;
        
        // Look for Hugo shortcodes in text nodes
        const shortcodeRegex = /\{\{<\s*([^>]+?)\s*>\}\}/g;
        let match;
        while ((match = shortcodeRegex.exec(typedNode.value)) !== null) {
          const shortcodeName = match[1];
          if (shortcodeName) {
            shortcodesFound.push(shortcodeName);
          }
        }
      }
      
      if (Array.isArray(typedNode.children)) {
        typedNode.children.forEach(visitNode);
      }
    }
    
    visitNode(ast);
    
    return {
      shortcodesFound,
      textNodes: textNodeCount,
      success: true,
      errors: []
    } as const;
    
  } catch (error) {
    errors.push(`Shortcode detection failed: ${String(error)}`);
    return {
      shortcodesFound: [],
      textNodes: 0,
      success: false,
      errors
    } as const;
  }
}

/**
 * Process markdown content and return transformed AST
 * This is the main function for actual conversion
 */
export async function processMarkdownToMdx(
  content: string,
  sourcePath: string
): Promise<AstTransformResult> {
  const errors: string[] = [];
  const warnings: string[] = [];
  const usedComponents = new Set<string>();
  
  try {
    // Parse markdown to AST
    const processor = createMarkdownProcessor();
    const ast = processor.parse(content) as Root;
    
    if (!ast) {
      errors.push('Failed to parse content to AST');
      return {
        ast: { type: 'root', children: [] },
        usedComponents,
        errors,
        warnings
      } as const;
    }
    
    // TODO: Add AST transformations here (shortcodes, images, etc.)
    // For now, just return the original AST as proof of concept
    
    return {
      ast,
      usedComponents,
      errors,
      warnings
    } as const;
    
  } catch (error) {
    errors.push(`Processing failed: ${String(error)}`);
    return {
      ast: { type: 'root', children: [] },
      usedComponents,
      errors,
      warnings
    } as const;
  }
}