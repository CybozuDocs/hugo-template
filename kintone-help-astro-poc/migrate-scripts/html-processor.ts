import type { ConversionResult } from './types.js';

export function processHtml(content: string): ConversionResult {
  const imports: string[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];
  let hasChanges = false;
  
  let processedContent = content;
  
  // Fix self-closing tags
  processedContent = fixSelfClosingTags(processedContent);
  
  // Fix text and closing tag on same line
  processedContent = fixTextWithClosingTag(processedContent);
  
  // Fix HTML tag formatting for Astro compatibility
  processedContent = fixHtmlTagFormatting(processedContent);
  
  // Check if any changes were made
  hasChanges = processedContent !== content;
  
  return {
    converted: hasChanges,
    imports,
    content: processedContent,
    errors,
    warnings,
  };
}

function fixSelfClosingTags(content: string): string {
  let processedContent = content;
  
  // Convert <br> to <br />
  // Handle both <br> and <br> with any whitespace/attributes
  processedContent = processedContent.replace(/<br\s*\/?>/gi, '<br />');
  
  // Fix malformed </br> tags to <br />
  processedContent = processedContent.replace(/<\/br\s*>/gi, '<br />');
  
  return processedContent;
}

function fixHtmlTagFormatting(content: string): string {
  // Tags that need formatting when they have content on the same line
  const tagsToFormat = [
    'td', 'th',           // Table cells
    'ul', 'ol',           // Lists
    'li',                 // List items
    'div', 'section',     // Block containers
    'blockquote',         // Quotes
    'figure', 'figcaption', // Figure elements
    'header', 'footer',   // Semantic sections
    'nav', 'aside',       // Navigation/sidebar
    'article', 'main',    // Content sections
  ];
  
  let processedContent = content;
  
  // Process each tag type
  for (const tag of tagsToFormat) {
    processedContent = formatHtmlTag(processedContent, tag);
  }
  
  return processedContent;
}

function formatHtmlTag(content: string, tagName: string): string {
  const lines = content.split('\n');
  const result: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if this line contains an opening tag
    const tagOpenRegex = new RegExp(`^(\\s*)<${tagName}([^>]*)>(.*)$`);
    const match = line.match(tagOpenRegex);
    
    if (match && !line.includes(`</${tagName}>`)) {
      // Found opening tag, now find the corresponding closing tag
      const tagIndent = match[1];
      const attributes = match[2];
      const contentAfterTag = match[3];
      const openingTag = `<${tagName}${attributes}>`;
      
      // Find the closing tag
      let closingTagLine = -1;
      let nestedLevel = 1;
      
      for (let j = i + 1; j < lines.length; j++) {
        const checkLine = lines[j];
        // Count opening and closing tags to handle nesting
        const openTags = (checkLine.match(new RegExp(`<${tagName}[^>]*>`, 'g')) || []).length;
        const closeTags = (checkLine.match(new RegExp(`</${tagName}>`, 'g')) || []).length;
        
        nestedLevel += openTags - closeTags;
        
        if (nestedLevel === 0) {
          closingTagLine = j;
          break;
        }
      }
      
      if (closingTagLine !== -1) {
        // Format the tag content
        result.push(tagIndent + openingTag);
        
        // Add initial content if any
        if (contentAfterTag.trim()) {
          result.push(tagIndent + '  ' + contentAfterTag.trim());
        }
        
        // Add all lines between opening and closing tags
        for (let k = i + 1; k < closingTagLine; k++) {
          const contentLine = lines[k];
          if (contentLine.trim()) {
            // Calculate proper indentation for nested content
            const contentIndent = tagIndent + '  ';
            const trimmedContent = contentLine.trim();
            result.push(contentIndent + trimmedContent);
          } else {
            result.push(''); // Preserve empty lines
          }
        }
        
        // Handle the closing tag line
        const closingLine = lines[closingTagLine];
        const closingTagIndex = closingLine.indexOf(`</${tagName}>`);
        if (closingTagIndex > 0) {
          const beforeClosing = closingLine.substring(0, closingTagIndex).trim();
          if (beforeClosing) {
            result.push(tagIndent + '  ' + beforeClosing);
          }
        }
        
        result.push(tagIndent + `</${tagName}>`);
        
        // Skip to after the closing tag
        i = closingTagLine;
        continue;
      }
    }
    
    // Check for malformed tags that might need fixing
    const unbalancedOpenRegex = new RegExp(`^(\\s*)<${tagName}([^>]*)>(?![\\s\\S]*</${tagName}>)`);
    const unbalancedMatch = line.match(unbalancedOpenRegex);
    if (unbalancedMatch) {
      // This is an unclosed opening tag - might be self-closing or malformed
      const indent = unbalancedMatch[1];
      const attrs = unbalancedMatch[2];
      
      // If it's a void element like br, hr, img, etc., make it self-closing
      const voidElements = ['br', 'hr', 'img', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr'];
      if (voidElements.includes(tagName.toLowerCase())) {
        result.push(indent + `<${tagName}${attrs} />`);
        continue;
      }
    }
    
    // Regular line processing
    result.push(line);
  }
  
  return result.join('\n');
}

function fixTextWithClosingTag(content: string): string {
  // Tags that commonly have this issue
  const tagsToFix = ['ul', 'ol', 'li', 'td', 'th', 'div', 'p'];
  
  let processedContent = content;
  
  for (const tag of tagsToFix) {
    // Match lines that have text followed by a closing tag
    // Pattern: any text + whitespace + closing tag
    const regex = new RegExp(`^(.*\\S)\\s+(</${tag}>)\\s*$`, 'gm');
    
    processedContent = processedContent.replace(regex, (match, textPart, closingTag) => {
      // Split text and closing tag into separate lines
      // Preserve the indentation from the original line
      const indent = match.match(/^(\s*)/)?.[1] || '';
      return `${textPart}\n${indent}${closingTag}`;
    });
  }
  
  return processedContent;
}