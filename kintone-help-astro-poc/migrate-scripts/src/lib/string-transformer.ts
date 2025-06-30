/**
 * String-based transformation for Hugo shortcodes to Astro components
 * Following user approval for string-based approach for shortcode replacement
 */

import type { HugoShortcode } from '../types/conversion.js';
import { getComponentInfo, shouldRemoveShortcode, getAllAvailableComponents } from './component-mapper.js';

/**
 * Transform Hugo shortcodes in content string to Astro components
 * Note: FrontMatter shortcodes are intentionally NOT converted per user request
 */
export function transformShortcodesInContent(
  content: string,
  usedComponents: Set<string>
): {
  readonly transformedContent: string;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  let transformedContent = content;
  
  // Split content into FrontMatter and body
  const frontmatterMatch = /^---\n([\s\S]*?)\n---\n(.*)$/s.exec(content);
  if (frontmatterMatch) {
    const frontmatter = frontmatterMatch[1];
    const body = frontmatterMatch[2];
    
    // Transform only the body content (not FrontMatter)
    const transformedBody = transformContentBody(body, usedComponents, errors);
    transformedContent = `---\n${frontmatter}\n---\n${transformedBody}`;
  } else {
    // No frontmatter, transform entire content
    transformedContent = transformContentBody(content, usedComponents, errors);
  }
  
  return {
    transformedContent,
    errors,
    warnings
  } as const;
}

/**
 * Transform content body (excluding FrontMatter)
 */
function transformContentBody(
  content: string,
  usedComponents: Set<string>,
  errors: string[]
): string {
  let transformedContent = content;
  
  // Find all shortcodes in body content (headers should be processed separately)
  const shortcodes = findAllShortcodes(transformedContent);
  
  // Process in reverse order to maintain positions
  const shortcodesCopy = [...shortcodes];
  for (const shortcode of shortcodesCopy.reverse()) {
    try {
      const replacement = transformSingleShortcode(shortcode, usedComponents);
      
      if (replacement !== null) {
        // Replace the shortcode with the component
        const before = transformedContent.substring(0, shortcode.startPos);
        const after = transformedContent.substring(shortcode.endPos);
        transformedContent = before + replacement + after;
      }
    } catch (error) {
      errors.push(`Failed to transform shortcode ${shortcode.name}: ${String(error)}`);
    }
  }
  
  return transformedContent;
}

/**
 * Apply post-processing fixes for Astro-specific formatting
 */
export function applyPostProcessingFixes(content: string): string {
  let result = content;
  
  // Fix: Numbered List内の<Img>コンポーネントのインデントを3スペースに調整
  result = fixNumberedListImageIndentation(result);
  
  // Fix: Numbered List内のコンポーネントを適切な構造に修正
  result = fixNumberedListComponents(result);
  
  return result;
}

/**
 * Fix indentation for <Img> components inside numbered lists
 * Astro requires 3 spaces for list item content, but our standard is 2 spaces
 */
function fixNumberedListImageIndentation(content: string): string {
  const lines = content.split('\n');
  const result: string[] = [];
  let inNumberedListItem = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if this line starts a numbered list item
    if (/^\d+\.\s/.test(line)) {
      inNumberedListItem = true;
      result.push(line);
      continue;
    }
    
    // Check if we're no longer in a numbered list item
    if (inNumberedListItem && line.length > 0 && !line.startsWith('  ')) {
      inNumberedListItem = false;
    }
    
    // If we're in a numbered list item and this is an <Img> component with 2-space indent
    if (inNumberedListItem && /^  <Img\s/.test(line)) {
      // Change 2-space indent to 3-space indent for Astro compatibility
      result.push('   ' + line.substring(2));
    } else {
      result.push(line);
    }
  }
  
  return result.join('\n');
}

/**
 * Fix component structure inside numbered lists for MDX compatibility
 */
function fixNumberedListComponents(content: string): string {
  const lines = content.split('\n');
  const result: string[] = [];
  let i = 0;
  
  while (i < lines.length) {
    const line = lines[i];
    
    // Check if this line is a numbered list item with component indentation issue
    if (/^\d+\.\s/.test(line)) {
      result.push(line);
      i++;
      
      // Look ahead for indented components that should be moved outside the list
      while (i < lines.length) {
        const nextLine = lines[i];
        
        // If we hit a component that starts with 3+ spaces (problematic MDX structure)
        if (/^\s{3,}<[A-Z]/.test(nextLine)) {
          // Move this component outside the list structure
          // First, add an empty line to close the list item
          if (result[result.length - 1].trim() !== '') {
            result.push('');
          }
          
          // Add the component without excessive indentation
          result.push(nextLine.replace(/^\s+/, ''));
          i++;
          
          // Continue collecting related content
          while (i < lines.length && (lines[i].startsWith('  ') || lines[i].trim() === '')) {
            const contentLine = lines[i];
            if (contentLine.trim() === '') {
              result.push('');
            } else {
              // Remove excessive indentation but preserve structure
              result.push(contentLine.replace(/^\s{2,}/, ''));
            }
            i++;
          }
          
          // Add another empty line before next content
          result.push('');
          break;
        } else if (/^\s{2,}/.test(nextLine) || nextLine.trim() === '') {
          // Regular indented content or empty line - keep as is
          result.push(nextLine);
          i++;
        } else {
          // Non-indented line - we're out of this list item
          break;
        }
      }
    } else {
      result.push(line);
      i++;
    }
  }
  
  return result.join('\n');
}

/**
 * Find all Hugo shortcodes in content
 */
function findAllShortcodes(content: string): readonly HugoShortcode[] {
  const shortcodes: HugoShortcode[] = [];
  
  // First, find all paired shortcodes: {{< name >}}...{{< /name >}}
  const pairedPattern = /\{\{<\s*([^>\s\/]+)([^>]*?)>\}\}([\s\S]*?)\{\{<\s*\/\1\s*>\}\}/g;
  let match;
  
  while ((match = pairedPattern.exec(content)) !== null) {
    const name = match[1];
    const paramsStr = match[2];
    const innerContent = match[3];
    const startPos = match.index || 0;
    const endPos = startPos + match[0].length;
    
    if (name) {
      shortcodes.push({
        name: name.trim(),
        params: parseParams(paramsStr?.trim() || ''),
        content: innerContent?.trim() || null,
        selfClosing: false,
        startPos,
        endPos
      });
    }
  }
  
  // Then find self-closing shortcodes: {{< name params >}}
  // Exclude ranges already covered by paired shortcodes
  const pairedRanges = shortcodes.map(sc => ({ start: sc.startPos, end: sc.endPos }));
  
  const selfClosingPattern = /\{\{<\s*([^>\s]+)([^>]*?)>\}\}/g;
  
  while ((match = selfClosingPattern.exec(content)) !== null) {
    const startPos = match.index || 0;
    const endPos = startPos + match[0].length;
    
    // Skip if this position is within a paired shortcode
    const isWithinPaired = pairedRanges.some(range => 
      startPos >= range.start && endPos <= range.end
    );
    
    if (!isWithinPaired) {
      const name = match[1];
      const paramsStr = match[2];
      
      if (name) {
        shortcodes.push({
          name: name.trim(),
          params: parseParams(paramsStr?.trim() || ''),
          content: null,
          selfClosing: true,
          startPos,
          endPos
        });
      }
    }
  }
  
  // Sort by start position for processing
  return shortcodes.sort((a, b) => a.startPos - b.startPos);
}

/**
 * Parse shortcode parameters
 */
function parseParams(paramsStr: string): readonly string[] {
  if (!paramsStr) {
    return [];
  }
  
  // Handle quoted and unquoted parameters
  const params: string[] = [];
  const regex = /(?:"([^"]+)"|'([^']+)'|(\S+))/g;
  let match;
  
  while ((match = regex.exec(paramsStr)) !== null) {
    const param = match[1] || match[2] || match[3];
    if (param) {
      params.push(param);
    }
  }
  
  return params;
}

/**
 * Process nested shortcodes in wv_brk content
 */
function processNestedShortcodes(content: string, usedComponents: Set<string>): string {
  let transformedContent = content;
  
  // Find all shortcodes in the content
  const shortcodes = findAllShortcodes(transformedContent);
  
  // Process in reverse order to maintain positions
  const shortcodesCopy = [...shortcodes];
  for (const shortcode of shortcodesCopy.reverse()) {
    try {
      const replacement = transformSingleShortcode(shortcode, usedComponents);
      
      if (replacement !== null) {
        // Replace the shortcode with the component
        const before = transformedContent.substring(0, shortcode.startPos);
        const after = transformedContent.substring(shortcode.endPos);
        transformedContent = before + replacement + after;
      }
    } catch (error) {
      // Skip errors in nested processing
      continue;
    }
  }
  
  return transformedContent;
}

/**
 * Transform a single shortcode to Astro component
 */
function transformSingleShortcode(
  shortcode: HugoShortcode,
  usedComponents: Set<string>
): string | null {
  
  // Handle special removal cases (wv_brk)
  if (shouldRemoveShortcode(shortcode.name)) {
    if (shortcode.name === 'wv_brk') {
      // Remove wv_brk wrapper, but recursively process inner content
      const innerContent = shortcode.content || '';
      if (innerContent.includes('{{<')) {
        // Process nested shortcodes in the content
        return processNestedShortcodes(innerContent, usedComponents);
      }
      return innerContent;
    }
    return ''; // Remove entirely
  }
  
  // Get component mapping
  const componentInfo = getComponentInfo(shortcode.name);
  if (!componentInfo) {
    // Unknown shortcode, leave as-is for now
    return null;
  }
  
  // Track component usage
  usedComponents.add(shortcode.name);
  
  // Extract component name from import path
  const componentName = extractComponentName(componentInfo.importPath);
  
  // Generate component based on type
  if (componentInfo.selfClosing) {
    // Self-closing: <Kintone />
    const props = generateProps(shortcode.name, shortcode.params);
    return `<${componentName}${props} />`;
  } else {
    // With children: <Note>content</Note>
    const props = generateProps(shortcode.name, shortcode.params);
    let children = shortcode.content || '';
    
    // Recursively transform shortcodes within the children content
    if (children) {
      const childTransform = transformContentBody(children, usedComponents, []);
      children = childTransform;
    }
    
    // For multi-line content, format with proper indentation
    if (children.includes('\n')) {
      // Multi-line content: format with newlines and proper closing tag
      const indentedChildren = children.split('\n')
        .map(line => line.length > 0 ? `  ${line}` : line) // Indent non-empty lines
        .join('\n');
      return `<${componentName}${props}>\n${indentedChildren}\n</${componentName}>`;
    } else {
      // Single line content: inline format
      return `<${componentName}${props}>${children}</${componentName}>`;
    }
  }
}

/**
 * Extract component name from import path
 */
function extractComponentName(importPath: string): string {
  const match = /\/([^/]+)\.astro$/.exec(importPath);
  return match?.[1] || 'UnknownComponent';
}

/**
 * Transform markdown headers to Heading components
 */
export function transformHeadersToComponents(
  content: string,
  usedComponents: Set<string>
): string {
  // Pattern for markdown headers with optional IDs: ## Title{#id}
  // Also match headers with shortcodes/components like ## {{< kintone >}} title{#id}
  const headerPattern = /^(#{1,6})\s+(.*?)(?:\{#([^}]+)\})?$/gm;
  
  return content.replace(headerPattern, (match, hashes, title, id) => {
    const level = hashes.length;
    const trimmedTitle = title.trim();
    
    // Track Heading component usage
    usedComponents.add('Heading');
    
    if (id) {
      return `<Heading level={${level}} id="${id}">${trimmedTitle}</Heading>`;
    } else {
      return `<Heading level={${level}}>${trimmedTitle}</Heading>`;
    }
  });
}

/**
 * Generate props string for component
 */
function generateProps(shortcodeName: string, params: readonly string[]): string {
  if ((shortcodeName === 'enabled2' || shortcodeName === 'disabled2') && params.length > 0) {
    // enabled2 JP CN -> regions={["JP", "CN"]}
    // disabled2 US CN -> regions={["US", "CN"]}
    const regions = params.map(p => `"${p}"`).join(', ');
    return ` regions={[${regions}]}`;
  }
  
  // Most components don't need props
  return '';
}

/**
 * Transform markdown images to Img components
 */
export function transformImagesToComponents(
  content: string,
  usedComponents: Set<string>,
  imagePathTransform?: { from: string; to: string }
): {
  readonly transformedContent: string;
  readonly errors: readonly string[];
} {
  const errors: string[] = [];
  let transformedContent = content;
  
  // Pattern for markdown images: ![alt](src)
  const imagePattern = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const images: Array<{
    match: string;
    alt: string;
    src: string;
    index: number;
  }> = [];
  
  let match;
  while ((match = imagePattern.exec(content)) !== null) {
    const fullMatch = match[0];
    const alt = match[1] || '';
    const src = match[2];
    const index = match.index || 0;
    
    if (src) {
      images.push({
        match: fullMatch,
        alt,
        src,
        index
      });
    }
  }
  
  // Replace in reverse order to maintain positions
  for (const image of images.reverse()) {
    try {
      // Track Img component usage
      usedComponents.add('Img');
      
      // Apply path transformation if configured
      let transformedSrc = image.src;
      if (imagePathTransform && transformedSrc.startsWith(imagePathTransform.from)) {
        transformedSrc = transformedSrc.replace(imagePathTransform.from, imagePathTransform.to);
      }
      
      // Generate Img component
      const replacement = `<Img src="${transformedSrc}" alt="${image.alt}" />`;
      
      const before = transformedContent.substring(0, image.index);
      const after = transformedContent.substring(image.index + image.match.length);
      transformedContent = before + replacement + after;
    } catch (error) {
      errors.push(`Failed to transform image ${image.src}: ${String(error)}`);
    }
  }
  
  return {
    transformedContent,
    errors
  } as const;
}

/**
 * Generate import statements for used components
 */
export function generateImportStatements(usedComponents: ReadonlySet<string>): readonly string[] {
  const imports: string[] = [];
  
  for (const componentName of Array.from(usedComponents).sort()) {
    if (componentName === 'Img') {
      // Special case for Img component
      imports.push('import Img from "@/components/Img.astro";');
      continue;
    }
    
    if (componentName === 'Heading') {
      // Special case for Heading component
      imports.push('import Heading from "@/components/Heading.astro";');
      continue;
    }
    
    const componentInfo = getComponentInfo(componentName);
    if (componentInfo) {
      const name = extractComponentName(componentInfo.importPath);
      imports.push(`import ${name} from "${componentInfo.importPath}";`);
    }
  }
  
  return imports;
}