import type { ConversionResult } from './types.js';

export function processHtml(content: string): ConversionResult {
  const imports: string[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];
  let hasChanges = false;
  
  let processedContent = content;
  
  // Fix self-closing tags
  processedContent = fixSelfClosingTags(processedContent);
  
  // Fix table cell formatting
  processedContent = fixTableCellFormatting(processedContent);
  
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
  // Convert <br> to <br />
  // Handle both <br> and <br> with any whitespace/attributes
  return content.replace(/<br\s*\/?>/gi, '<br />');
}

function fixTableCellFormatting(content: string): string {
  const lines = content.split('\n');
  const result: string[] = [];
  let inTableCell = false;
  let cellContent: string[] = [];
  let cellIndent = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if we're starting a table cell with content on the same line
    const tdStartMatch = line.match(/^(\s*)<td[^>]*>(.+)$/);
    if (tdStartMatch && !line.includes('</td>')) {
      // Multi-line table cell detected
      inTableCell = true;
      cellIndent = tdStartMatch[1];
      const cellTag = line.substring(0, line.indexOf('>') + 1);
      
      result.push(cellIndent + cellTag);
      
      // Start collecting cell content
      cellContent = [];
      const contentAfterTag = tdStartMatch[2];
      if (contentAfterTag.trim()) {
        cellContent.push(contentAfterTag);
      }
      continue;
    }
    
    // Check if we're ending a table cell
    if (inTableCell && line.includes('</td>')) {
      // Add remaining content before </td>
      const beforeClosing = line.substring(0, line.indexOf('</td>')).trim();
      if (beforeClosing) {
        cellContent.push(beforeClosing);
      }
      
      // Output formatted cell content
      for (const contentLine of cellContent) {
        result.push(cellIndent + '  ' + contentLine.trim());
      }
      
      // Add closing tag
      result.push(cellIndent + '</td>');
      
      // Reset state
      inTableCell = false;
      cellContent = [];
      continue;
    }
    
    // If we're inside a table cell, collect the content
    if (inTableCell) {
      cellContent.push(line.trim());
      continue;
    }
    
    // Regular line processing
    result.push(line);
  }
  
  return result.join('\n');
}