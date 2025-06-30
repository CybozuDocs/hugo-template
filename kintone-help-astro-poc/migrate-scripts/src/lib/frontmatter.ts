/**
 * FrontMatter processing utilities
 * Following convert_prompt.md requirement: "FrontMatter を保持すること"
 */

import { load as yamlLoad, dump as yamlDump } from 'js-yaml';
import type { FrontMatterData } from '../types/conversion.js';

/**
 * Parse FrontMatter from markdown content
 * Returns both parsed data and content without frontmatter
 */
export function parseFrontMatter(content: string): {
  readonly frontmatter: FrontMatterData;
  readonly content: string;
} {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
  const match = frontmatterRegex.exec(content);
  
  if (!match) {
    return {
      frontmatter: createEmptyFrontMatter(),
      content: content.trim()
    } as const;
  }
  
  const yamlContent = match[1];
  const markdownContent = match[2];
  
  if (yamlContent === undefined || markdownContent === undefined) {
    throw new Error('Failed to extract frontmatter and content from match');
  }
  
  try {
    const parsed = yamlLoad(yamlContent) as Record<string, unknown>;
    const frontmatter = validateAndTransformFrontMatter(parsed);
    
    return {
      frontmatter,
      content: markdownContent.trim()
    } as const;
  } catch (error) {
    throw new Error(`Failed to parse FrontMatter YAML: ${String(error)}`);
  }
}

/**
 * Create empty frontmatter structure
 */
function createEmptyFrontMatter(): FrontMatterData {
  return {
    title: null,
    weight: null,
    aliases: null,
    type: null,
    layout: null
  } as const;
}

/**
 * Validate and transform raw YAML data to FrontMatterData
 */
function validateAndTransformFrontMatter(raw: Record<string, unknown>): FrontMatterData {
  const frontmatter: Record<string, unknown> = { ...raw };
  
  // Validate and transform known fields
  frontmatter['title'] = typeof raw['title'] === 'string' ? raw['title'] : null;
  frontmatter['weight'] = typeof raw['weight'] === 'number' ? raw['weight'] : null;
  frontmatter['type'] = typeof raw['type'] === 'string' ? raw['type'] : null;
  frontmatter['layout'] = typeof raw['layout'] === 'string' ? raw['layout'] : null;
  
  // Handle aliases - preserve original format (single string vs array)
  if (typeof raw['aliases'] === 'string') {
    frontmatter['aliases'] = raw['aliases']; // Keep as single string
  } else if (Array.isArray(raw['aliases'])) {
    const validAliases = raw['aliases'].filter((item): item is string => typeof item === 'string');
    if (validAliases.length === 1) {
      frontmatter['aliases'] = validAliases[0]; // Convert single-item array to string
    } else {
      frontmatter['aliases'] = validAliases; // Keep as array for multiple items
    }
  } else {
    frontmatter['aliases'] = null;
  }
  
  return frontmatter as FrontMatterData;
}

/**
 * Add layout field to frontmatter based on file type
 * Following requirement: layout フィールド追加
 */
export function addLayoutToFrontMatter(
  frontmatter: FrontMatterData,
  isIndexFile: boolean
): FrontMatterData {
  // Don't override existing layout
  if (frontmatter.layout) {
    return frontmatter;
  }
  
  const layout = isIndexFile 
    ? '@/layouts/SectionLayout.astro'  // _index.md files use SectionLayout
    : '@/layouts/PageLayout.astro';    // regular pages use PageLayout
  
  return {
    ...frontmatter,
    layout
  } as const;
}

/**
 * Serialize frontmatter back to YAML string
 */
export function serializeFrontMatter(frontmatter: FrontMatterData): string {
  // Filter out null values for cleaner output
  const filtered = Object.fromEntries(
    Object.entries(frontmatter).filter(([, value]) => value !== null)
  );
  
  try {
    const yamlString = yamlDump(filtered, {
      indent: 2,
      lineWidth: -1,  // No line wrapping
      noRefs: true,   // No YAML references
      sortKeys: false, // Preserve key order
      quotingType: '"', // Use double quotes consistently
      forceQuotes: true // Force quotes for strings
    });
    
    return `---\n${yamlString}---\n`;
  } catch (error) {
    throw new Error(`Failed to serialize FrontMatter: ${String(error)}`);
  }
}

/**
 * Combine frontmatter and content into complete MDX
 */
export function combineFrontMatterAndContent(
  frontmatter: FrontMatterData,
  imports: readonly string[],
  content: string
): string {
  const frontmatterYaml = serializeFrontMatter(frontmatter);
  
  let result = frontmatterYaml;
  
  // Add imports after frontmatter
  if (imports.length > 0) {
    result += '\n';
    result += imports.join('\n');
    result += '\n';
  }
  
  // Add content
  result += '\n';
  result += content;
  
  // Ensure file ends with newline
  if (!result.endsWith('\n')) {
    result += '\n';
  }
  
  return result;
}