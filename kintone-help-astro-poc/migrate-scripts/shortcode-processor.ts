import type { ConversionResult, ShortcodeMapping, ShortcodeMatch } from './types.js';

// Hugo shortcode to Astro component mappings
export const SHORTCODE_MAPPINGS: ShortcodeMapping = {
  // Simple replacements (no attributes, no content)
  simple: {
    'admin_button_label': 'AdminButtonLabel',
    'kintone': 'Kintone',
    'service': 'Service',
    'corpname': 'CorpName',
    'cybozu_com': 'CybozuCom',
    'devnet_name': 'DevnetName',
    'devnet_top': 'DevnetTop',
    'store': 'Store',
    'slash': 'Slash',
    'logo': 'Logo',
    'slash_administrators': 'SlashAdministrators',
    'slash_help': 'SlashHelp',
    'slash_service_name': 'SlashServiceName',
    'slash_ui': 'SlashUi',
    'slash_ui_administrators': 'SlashUiAdministrators',
    'audit_start': 'AuditStart',
    'audit_end': 'AuditEnd',
    'id_search_msg': 'IdSearchMsg',
  },
  
  // Content wrappers (with slot)
  content: {
    'hint': 'Hint',
    'note': 'Note',
    'warning': 'Warning',
    'reference': 'Reference',
    'graynote': 'Graynote',
    'annotation': 'Annotation',
    'subnavi': 'Subnavi',
    'subnavi2': 'Subnavi2',
    'subtitle': 'Subtitle',
    'topics': 'Topics',
    'anchorstep2': 'Anchorstep2',
    'stepindex2': 'Stepindex2',
    'proc1': 'Proc1',
    'proc2': 'Proc2',
    'paramdata': 'Paramdata',
    'listsummary': 'Listsummary',
    'listtext': 'Listtext',
    'tile2': 'Tile2',
    'wv_brk': 'Wovn',
    'enabled': 'Enabled',
    'enabled2': 'Enabled',
    'disabled2': 'Disabled2',
  },
  
  // Components with attributes
  attributes: {
    'screen': ['src', 'alt'],
    'enabled': ['regions'],
    'enabled2': ['regions'],
    'disabled2': ['regions'],
    'heading': ['level', 'id', 'class'],
    'tile_img': ['src', 'alt'],
    'tile_img3': ['src', 'alt'],
    'info': ['outer_color', 'fontawesome_icon', 'icon_color', 'inner_color'],
    'wv_brk': ['langCode'],
  },
};

export function processShortcodes(content: string): ConversionResult {
  const imports = new Set<string>();
  const errors: string[] = [];
  const warnings: string[] = [];
  let hasChanges = false;
  
  let processedContent = content;
  
  // Process simple shortcodes first
  processedContent = processSimpleShortcodes(processedContent, imports, errors);
  
  // Process content shortcodes
  processedContent = processContentShortcodes(processedContent, imports, errors);
  
  // Process attribute shortcodes
  processedContent = processAttributeShortcodes(processedContent, imports, errors);
  
  hasChanges = imports.size > 0;
  
  return {
    converted: hasChanges,
    imports: Array.from(imports),
    content: processedContent,
    errors,
    warnings,
  };
}

function processSimpleShortcodes(
  content: string,
  imports: Set<string>,
  errors: string[]
): string {
  let processed = content;
  
  for (const [shortcode, component] of Object.entries(SHORTCODE_MAPPINGS.simple)) {
    const regex = new RegExp(`\\{\\{<\\s*${shortcode}\\s*>\\}\\}`, 'g');
    const replacement = `<${component} />`;
    
    if (regex.test(processed)) {
      processed = processed.replace(regex, replacement);
      imports.add(`import ${component} from "@/components/${component}.astro";`);
    }
  }
  
  return processed;
}

function processContentShortcodes(
  content: string,
  imports: Set<string>,
  errors: string[]
): string {
  let processed = content;
  
  for (const [shortcode, component] of Object.entries(SHORTCODE_MAPPINGS.content)) {
    // Special handling for wv_brk (inline shortcode)
    if (shortcode === 'wv_brk') {
      const regex = new RegExp(
        `\\{\\{<\\s*${shortcode}(\\s+[^>]*)?\\s*>\\}\\}([\\s\\S]*?)\\{\\{<\\s*/${shortcode}\\s*>\\}\\}`,
        'g'
      );
      
      const matches = Array.from(processed.matchAll(regex));
      
      if (matches.length > 0) {
        for (const match of matches) {
          const fullMatch = match[0];
          const innerContent = match[2];
          const replacement = `<Wovn>${innerContent}</Wovn>`;
          
          processed = processed.replace(fullMatch, replacement);
          imports.add(`import ${component} from "@/components/${component}.astro";`);
        }
      }
    } else {
      // Match opening and closing tags with content, handling attributes and preserving indentation
      const regex = new RegExp(
        `^(\\s*)\\{\\{<\\s*${shortcode}(\\s+[^>]*)?\\s*>\\}\\}([\\s\\S]*?)^(\\s*)\\{\\{<\\s*/${shortcode}\\s*>\\}\\}`,
        'gm'
      );
      
      const matches = Array.from(processed.matchAll(regex));
      
      if (matches.length > 0) {
        for (const match of matches) {
          const fullMatch = match[0];
          const indent = match[1]; // Capture leading whitespace
          const attributeString = match[2];
          const innerContent = match[3];
          const closingIndent = match[4]; // Capture closing tag indent (but use opening indent for consistency)
          
          // Only adjust content indentation for problematic cases
          // Check if any line in the content has insufficient indentation
          const hasProblematicIndentation = checkForProblematicIndentation(innerContent, indent);
          const adjustedInnerContent = hasProblematicIndentation 
            ? adjustContentIndentation(innerContent, indent)
            : innerContent;
          
          // Handle special cases and attributes
          let replacement;
          if (attributeString && (shortcode === 'enabled' || shortcode === 'enabled2' || shortcode === 'disabled2')) {
            // Handle attributes for enabled/disabled2
            try {
              const attributes = parseAttributes(attributeString.trim());
              let astroAttributes = '';
              if (attributes.regions) {
                const regions = attributes.regions.split(',').map(r => r.trim());
                astroAttributes = ` regions={[${regions.map(r => `"${r}"`).join(', ')}]}`;
              }
              replacement = `${indent}<${component}${astroAttributes}>${adjustedInnerContent}${indent}</${component}>`;
            } catch (error) {
              replacement = `${indent}<${component}>${adjustedInnerContent}${indent}</${component}>`;
            }
          } else {
            replacement = `${indent}<${component}>${adjustedInnerContent}${indent}</${component}>`;
          }
          
          processed = processed.replace(fullMatch, replacement);
          imports.add(`import ${component} from "@/components/${component}.astro";`);
        }
      }
    }
  }
  
  return processed;
}

function processAttributeShortcodes(
  content: string,
  imports: Set<string>,
  errors: string[]
): string {
  let processed = content;
  
  for (const [shortcode, allowedAttrs] of Object.entries(SHORTCODE_MAPPINGS.attributes)) {
    const component = getComponentName(shortcode);
    
    // Match shortcodes with attributes
    const regex = new RegExp(
      `\\{\\{<\\s*${shortcode}\\s+([^>]+)\\s*>\\}\\}`,
      'g'
    );
    
    const matches = Array.from(processed.matchAll(regex));
    
    if (matches.length > 0) {
      for (const match of matches) {
        const fullMatch = match[0];
        const attributeString = match[1];
        
        try {
          const attributes = parseAttributes(attributeString);
          const astroAttributes = convertToAstroAttributes(attributes, allowedAttrs);
          const replacement = `<${component}${astroAttributes} />`;
          
          processed = processed.replace(fullMatch, replacement);
          imports.add(`import ${component} from "@/components/${component}.astro";`);
        } catch (error) {
          errors.push(`Failed to process shortcode ${shortcode}: ${error}`);
        }
      }
    }
  }
  
  return processed;
}

function getComponentName(shortcode: string): string {
  // Convert shortcode name to component name
  return shortcode
    .split('_')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function parseAttributes(attributeString: string): Record<string, string> {
  const attributes: Record<string, string> = {};
  
  // Handle key="value" and key=value patterns
  const attrRegex = /(\w+)=(?:"([^"]*)"|'([^']*)'|([^\s]+))/g;
  let match;
  
  while ((match = attrRegex.exec(attributeString)) !== null) {
    const key = match[1];
    const value = match[2] || match[3] || match[4];
    attributes[key] = value;
  }
  
  // Handle space-separated region values (for enabled/enabled2/disabled2)
  // If no key=value pairs found, treat as regions
  if (Object.keys(attributes).length === 0) {
    const trimmed = attributeString.trim();
    if (trimmed) {
      // Split by whitespace and treat as regions
      const regions = trimmed.split(/\s+/).filter(r => r.length > 0);
      if (regions.length > 0) {
        attributes.regions = regions.join(',');
      }
    }
  }
  
  return attributes;
}

function convertToAstroAttributes(
  attributes: Record<string, string>,
  allowedAttrs: string[]
): string {
  const astroAttrs: string[] = [];
  
  for (const [key, value] of Object.entries(attributes)) {
    if (allowedAttrs.includes(key)) {
      // Handle special cases
      if (key === 'regions') {
        // Convert regions to array format
        const regions = value.split(',').map(r => r.trim());
        astroAttrs.push(`${key}={[${regions.map(r => `"${r}"`).join(', ')}]}`);
      } else if (key === 'level') {
        // Numbers should not be quoted
        astroAttrs.push(`${key}={${value}}`);
      } else {
        astroAttrs.push(`${key}="${value}"`);
      }
    }
  }
  
  return astroAttrs.length > 0 ? ' ' + astroAttrs.join(' ') : '';
}

function checkForProblematicIndentation(content: string, baseIndent: string): boolean {
  // If baseIndent is empty, no indentation issues possible
  if (baseIndent.length === 0) {
    return false;
  }
  
  const lines = content.split('\n');
  let hasContentWithoutIndent = false;
  let hasContentWithIndent = false;
  
  for (const line of lines) {
    // Skip empty lines
    if (line.trim() === '') {
      continue;
    }
    
    // Calculate current indentation
    const currentIndentMatch = line.match(/^(\s*)/);
    const currentIndent = currentIndentMatch ? currentIndentMatch[1] : '';
    
    if (currentIndent.length === 0) {
      hasContentWithoutIndent = true;
    } else if (currentIndent.length > 0) {
      hasContentWithIndent = true;
    }
  }
  
  // Only consider it problematic if we have a mixed situation:
  // - Some content with no indentation AND the base tag has indentation
  // - This indicates the content needs to be adjusted to match the tag's level
  // BUT: if ALL content has no indentation, it might be intentional (like warning/hint content)
  // So we need a more nuanced check: only if baseIndent > 0 AND we have content that starts at 0 indent
  // AND that content should logically be indented (like content inside an indented Note)
  
  // For now, be very conservative: only adjust if baseIndent > 0 and we have unindented content
  // that appears to be problematic (like when the opening tag itself is indented significantly)
  return baseIndent.length > 0 && hasContentWithoutIndent && baseIndent.length >= 3;
}

function adjustContentIndentation(content: string, baseIndent: string): string {
  // Don't adjust if baseIndent is empty (no indentation needed)
  if (baseIndent.length === 0) {
    return content;
  }
  
  const lines = content.split('\n');
  const adjustedLines: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Handle empty lines
    if (line.trim() === '') {
      // Check if this empty line is between a list item and its immediate sub-content
      if (i > 0 && i + 1 < lines.length) {
        const prevLine = lines[i - 1].trim();
        const nextLineRaw = lines[i + 1];
        const nextLine = nextLineRaw.trim();
        
        // If previous line is a list item and next line is indented content (link or text), skip this empty line
        if (prevLine.startsWith('* ') && nextLine.length > 0 && !nextLine.startsWith('* ') && (nextLine.startsWith('[') || nextLineRaw.startsWith('  ') || nextLineRaw.startsWith('\t'))) {
          continue;
        }
      }
      
      adjustedLines.push('');
      continue;
    }
    
    // Calculate current indentation
    const currentIndentMatch = line.match(/^(\s*)/);
    const currentIndent = currentIndentMatch ? currentIndentMatch[1] : '';
    const trimmedLine = line.trim();
    
    // Only adjust lines that have insufficient indentation (strictly less than baseIndent length)
    if (currentIndent.length < baseIndent.length) {
      // Determine the appropriate indentation based on content type
      let newIndent: string;
      
      // Check if this is a list item or sub-item
      if (trimmedLine.startsWith('* ')) {
        // List items should align with the opening tag (same as baseIndent)
        newIndent = baseIndent;
      } else {
        // Check the context: if the previous non-empty line was a list item,
        // this should be indented as a sub-item
        let isSubItem = false;
        for (let j = adjustedLines.length - 1; j >= 0; j--) {
          const prevLine = adjustedLines[j].trim();
          if (prevLine === '') continue; // Skip empty lines
          if (prevLine.startsWith('* ')) {
            isSubItem = true;
          }
          break; // Found the first non-empty previous line
        }
        
        if (isSubItem && trimmedLine.startsWith('[')) {
          // Link lines that are sub-items should be indented 2 spaces more than baseIndent
          newIndent = baseIndent + '  ';
        } else {
          // Regular content should be indented one space more than baseIndent
          newIndent = baseIndent + ' ';
        }
      }
      
      adjustedLines.push(newIndent + trimmedLine);
    } else {
      // Keep the line as is - it already has sufficient indentation
      adjustedLines.push(line);
    }
  }
  
  // Remove consecutive empty lines while preserving single empty lines
  let result = adjustedLines.join('\n');
  
  // Remove triple or more newlines, replace with double newlines
  result = result.replace(/\n\n\n+/g, '\n\n');
  
  // Remove empty lines between list items and their sub-content
  result = result.replace(/(\n\s*\*[^\n]*)\n\n(\s+\[[^\]]+\])/g, '$1\n$2');
  
  return result;
}

function findNextNonEmptyLine(lines: string[], startIndex: number): number {
  for (let i = startIndex + 1; i < lines.length; i++) {
    if (lines[i].trim() !== '') {
      return i;
    }
  }
  return -1;
}


export function extractShortcodes(content: string): ShortcodeMatch[] {
  const matches: ShortcodeMatch[] = [];
  
  // Extract all Hugo shortcodes for analysis
  const shortcodeRegex = /\{\{<\s*(\w+)(?:\s+([^>]*))?\s*>\}\}(?:[\s\S]*?\{\{<\s*\/\1\s*>\}\})?/g;
  let match;
  
  while ((match = shortcodeRegex.exec(content)) !== null) {
    const name = match[1];
    const attributeString = match[2];
    
    const shortcodeMatch: ShortcodeMatch = {
      fullMatch: match[0],
      name,
    };
    
    if (attributeString) {
      try {
        shortcodeMatch.attributes = parseAttributes(attributeString);
      } catch (error) {
        // Ignore parsing errors for analysis
      }
    }
    
    matches.push(shortcodeMatch);
  }
  
  return matches;
}