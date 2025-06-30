/**
 * Hugo to Astro MDX conversion types
 * Strict TypeScript types following convert_prompt.md requirements:
 * - No any type usage
 * - Type over interface preference
 * - No classes
 */

import type { Root, Text, Image } from 'mdast';
import type { VFile } from 'vfile';

/** Hugo shortcode representation */
export type HugoShortcode = {
  readonly name: string;
  readonly params: readonly string[];
  readonly content: string | null;
  readonly selfClosing: boolean;
  readonly startPos: number;
  readonly endPos: number;
};

/** Astro component mapping information */
export type AstroComponentInfo = {
  readonly importPath: string;  // "@/components/Kintone.astro"
  readonly selfClosing: boolean;  // <Kintone /> vs <Note>...</Note>
  readonly propsMapping: ReadonlyMap<string, string> | null;  // Hugo params -> Astro props
};

/** Conversion context for processing a single file */
export type ConversionContext = {
  readonly sourceFile: string;
  readonly targetFile: string;
  readonly usedComponents: ReadonlySet<string>;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
};

/** Result of converting a single file */
export type FileProcessResult = {
  readonly inputPath: string;
  readonly outputPath: string;
  readonly success: boolean;
  readonly imports: readonly string[];
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
  readonly bytesProcessed: number;
};

/** Result of AST transformation */
export type AstTransformResult = {
  readonly ast: Root;
  readonly usedComponents: ReadonlySet<string>;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
};

/** FrontMatter data structure */
export type FrontMatterData = {
  readonly title: string | null;
  readonly weight: number | null;
  readonly aliases: string | readonly string[] | null;  // Allow both single string and array
  readonly type: string | null;
  readonly layout: string | null;
  readonly [key: string]: unknown;
};

/** Configuration for the conversion process */
export type ConversionConfig = {
  readonly sourceDir: string;
  readonly targetDir: string;
  readonly dryRun: boolean;
  readonly incremental: boolean;
  readonly verbose: boolean;
  readonly testMode: boolean;
  readonly maxConcurrency: number;
};

/** Progress tracking for batch conversion */
export type ConversionProgress = {
  total: number;
  processed: number;
  successful: number;
  failed: number;
  skipped: number;
  readonly startTime: number;
};

/** File path mapping for conversion */
export type PathMapping = {
  readonly sourcePath: string;
  readonly targetPath: string;
  readonly isIndexFile: boolean;  // _index.md -> index.mdx
};

/** Type guards for safe type checking */
export type TypeGuards = {
  isTextNode: (node: unknown) => node is Text;
  isImageNode: (node: unknown) => node is Image;
  isRootNode: (node: unknown) => node is Root;
  isValidShortcode: (text: string) => boolean;
};

/** Remark plugin type for Hugo shortcode conversion */
export type RemarkPlugin<T extends readonly unknown[] = readonly []> = 
  (this: import('unified').Processor, ...settings: T) => void | import('unified').Transformer<Root, Root>;

/** MDX JSX Element representation for converted components */
export type MdxJsxElement = {
  readonly type: 'mdxJsxFlowElement' | 'mdxJsxTextElement';
  readonly name: string | null;
  readonly attributes: readonly MdxJsxAttribute[];
  readonly children: readonly unknown[];
};

/** MDX JSX Attribute for component props */
export type MdxJsxAttribute = {
  readonly type: 'mdxJsxAttribute';
  readonly name: string;
  readonly value: string | boolean | null;
};