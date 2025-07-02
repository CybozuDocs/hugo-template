import type { ConversionResult } from './types.js';

// Regular expression to match markdown headings with custom IDs
// ## Title {#custom-id}
const HEADING_REGEX = /^(#{1,6})\s+(.+?)\s*\{#([^}]+)\}/gm;

export function processHeadings(content: string): ConversionResult {
  const imports: string[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];
  let hasHeadings = false;
  
  const processedContent = content.replace(HEADING_REGEX, (match, hashes, title, id) => {
    try {
      hasHeadings = true;
      
      // Count the number of # to determine heading level
      const level = hashes.length;
      
      // Clean up the title (remove any extra whitespace)
      const cleanTitle = title.trim();
      
      // Generate Heading component
      const headingComponent = generateHeadingComponent(level, id, cleanTitle);
      return headingComponent;
    } catch (error) {
      errors.push(`Failed to process heading: ${match} - ${error}`);
      return match; // Return original if processing fails
    }
  });
  
  // Add Heading import if headings were found
  if (hasHeadings) {
    imports.push('import Heading from "@/components/Heading.astro";');
  }
  
  return {
    converted: hasHeadings,
    imports,
    content: processedContent,
    errors,
    warnings,
  };
}

export function generateHeadingComponent(
  level: number,
  id: string,
  title: string
): string {
  const attributes: string[] = [];
  
  // Only include level if it's not the default (2)
  if (level !== 2) {
    attributes.push(`level={${level}}`);
  }
  
  attributes.push(`id="${escapeAttribute(id)}"`);
  
  return `<Heading ${attributes.join(' ')}>${escapeContent(title)}</Heading>`;
}

export function extractHeadings(content: string): Array<{
  fullMatch: string;
  level: number;
  title: string;
  id: string;
}> {
  const matches: Array<{
    fullMatch: string;
    level: number;
    title: string;
    id: string;
  }> = [];
  let match;
  
  // Reset regex state
  HEADING_REGEX.lastIndex = 0;
  
  while ((match = HEADING_REGEX.exec(content)) !== null) {
    matches.push({
      fullMatch: match[0],
      level: match[1].length,
      title: match[2].trim(),
      id: match[3],
    });
  }
  
  return matches;
}

function escapeAttribute(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeContent(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}