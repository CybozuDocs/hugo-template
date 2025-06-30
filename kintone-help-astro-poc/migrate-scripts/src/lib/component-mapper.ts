/**
 * Component mapping for Hugo shortcodes to Astro components
 * Following convert_prompt.md requirement: "ショートコードに対応するコンポーネントは kintone-help-astro-poc/src/components/ に存在する"
 */

import type { AstroComponentInfo } from '../types/conversion.js';

/**
 * Mapping from Hugo shortcodes to Astro components
 * Based on survey of 781 markdown files and existing components
 */
export const SHORTCODE_MAPPING: ReadonlyMap<string, AstroComponentInfo> = new Map([
  // Most frequent shortcodes
  ['kintone', {
    importPath: '@/components/Kintone.astro',
    selfClosing: true,
    propsMapping: null
  }],
  
  ['note', {
    importPath: '@/components/Note.astro',
    selfClosing: false,
    propsMapping: null
  }],
  
  ['hint', {
    importPath: '@/components/Hint.astro',
    selfClosing: false,
    propsMapping: null
  }],
  
  ['warning', {
    importPath: '@/components/Warning.astro',
    selfClosing: false,
    propsMapping: null
  }],
  
  ['reference', {
    importPath: '@/components/Reference.astro',
    selfClosing: false,
    propsMapping: null
  }],
  
  // Service-related shortcodes
  ['slash', {
    importPath: '@/components/Slash.astro',
    selfClosing: true,
    propsMapping: null
  }],
  
  ['service', {
    importPath: '@/components/Service.astro',
    selfClosing: true,
    propsMapping: null
  }],
  
  ['store', {
    importPath: '@/components/Store.astro',
    selfClosing: true,
    propsMapping: null
  }],
  
  // Other components
  ['graynote', {
    importPath: '@/components/Graynote.astro',
    selfClosing: false,
    propsMapping: null
  }],
  
  ['info', {
    importPath: '@/components/Info.astro',
    selfClosing: false,
    propsMapping: null
  }],
  
  // Special handling shortcodes
  ['enabled2', {
    importPath: '@/components/Enabled.astro',
    selfClosing: false,
    propsMapping: null  // Will handle regions specially
  }]
]);

/**
 * Special shortcodes that should be removed (WOVN handles these)
 */
export const REMOVE_SHORTCODES = new Set(['wv_brk']);

/**
 * Get Astro component info for a Hugo shortcode
 */
export function getComponentInfo(shortcodeName: string): AstroComponentInfo | null {
  return SHORTCODE_MAPPING.get(shortcodeName) || null;
}

/**
 * Check if shortcode should be removed entirely
 */
export function shouldRemoveShortcode(shortcodeName: string): boolean {
  return REMOVE_SHORTCODES.has(shortcodeName);
}

/**
 * Generate import statement for a component
 */
export function generateImportStatement(componentInfo: AstroComponentInfo): string {
  const componentName = extractComponentName(componentInfo.importPath);
  return `import ${componentName} from "${componentInfo.importPath}";`;
}

/**
 * Extract component name from import path
 */
function extractComponentName(importPath: string): string {
  const match = /\/([^/]+)\.astro$/.exec(importPath);
  return match?.[1] || 'UnknownComponent';
}

/**
 * Generate all required import statements
 */
export function generateAllImports(usedComponents: ReadonlySet<string>): readonly string[] {
  const imports: string[] = [];
  
  for (const componentName of usedComponents) {
    const info = getComponentInfo(componentName);
    if (info) {
      const importStatement = generateImportStatement(info);
      if (!imports.includes(importStatement)) {
        imports.push(importStatement);
      }
    }
  }
  
  return imports.sort(); // Sort for consistency
}

/**
 * Convert Hugo shortcode parameters to Astro component props
 */
export function convertShortcodeParams(
  shortcodeName: string,
  params: readonly string[]
): string {
  // Handle special cases
  if (shortcodeName === 'enabled2') {
    // enabled2 JP CN -> regions={["JP", "CN"]}
    if (params.length > 0) {
      const regions = params.map(p => `"${p}"`).join(', ');
      return ` regions={[${regions}]}`;
    }
  }
  
  // For most components, no props needed
  return '';
}

/**
 * Get all available component names
 */
export function getAllAvailableComponents(): readonly string[] {
  return Array.from(SHORTCODE_MAPPING.keys()).sort();
}