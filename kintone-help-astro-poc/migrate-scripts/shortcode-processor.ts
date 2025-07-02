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
              replacement = `${indent}<${component}${astroAttributes}>${innerContent}${indent}</${component}>`;
            } catch (error) {
              replacement = `${indent}<${component}>${innerContent}${indent}</${component}>`;
            }
          } else {
            replacement = `${indent}<${component}>${innerContent}${indent}</${component}>`;
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