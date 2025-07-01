// Hugo to Astro conversion script types

export type ConversionConfig = {
  inputDir: string;
  outputDir: string;
  filter?: string;
  imagePathPrefix?: PathReplacement;
};

export type PathReplacement = {
  from: string;
  to: string;
};

export type FileContent = {
  frontmatter: Record<string, unknown>;
  content: string;
};

export type ConversionResult = {
  converted: boolean;
  imports: string[];
  content: string;
  errors: string[];
  warnings: string[];
};

export type ProcessingStats = {
  totalFiles: number;
  processedFiles: number;
  convertedFiles: number;
  skippedFiles: number;
  errors: number;
};

export type ShortcodeMapping = {
  simple: Record<string, string>;
  content: Record<string, string>;
  attributes: Record<string, string[]>;
};

export type FrontMatterData = {
  title?: string;
  weight?: number;
  aliases?: string | string[];
  disabled?: string[];
  type?: string;
  layout?: string;
  [key: string]: unknown;
};

export type ImageMatch = {
  fullMatch: string;
  alt: string;
  src: string;
  title?: string;
};

export type ShortcodeMatch = {
  fullMatch: string;
  name: string;
  attributes?: Record<string, string>;
  content?: string;
};