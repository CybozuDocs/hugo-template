/**
 * File operation utilities for Hugo to Astro MDX conversion
 * Following convert_prompt.md requirements for strict TypeScript
 */

import { readdir, readFile, writeFile, mkdir, stat } from 'fs/promises';
import { join, dirname, basename, extname, relative } from 'path';
import { glob } from 'glob';
import type { PathMapping, ConversionConfig } from '../types/conversion.js';

/**
 * Get all Markdown files from the source directory
 * Following requirement: "/Users/mugi/ghq/github.com/CybozuDocs/kintone/content/ja/ 配下の *.md コンテンツを対象とする"
 */
export async function findMarkdownFiles(sourceDir: string): Promise<readonly string[]> {
  try {
    const pattern = join(sourceDir, '**/*.md');
    const files = await glob(pattern, { 
      ignore: ['**/node_modules/**', '**/.*'],
      absolute: true 
    });
    return files.sort();
  } catch (error) {
    throw new Error(`Failed to find Markdown files in ${sourceDir}: ${String(error)}`);
  }
}

/**
 * Convert file path from Hugo source to Astro target
 * Following requirements:
 * - 変換先: kintone-help-astro-poc/src/pages/ja/ 配下に、同一のディレクトリ構造、ファイル名を維持して変換する
 * - _index.md については、`_` を除去し、index.mdx とする
 */
export function createPathMapping(
  sourcePath: string, 
  sourceDir: string, 
  targetDir: string
): PathMapping {
  const relativePath = relative(sourceDir, sourcePath);
  const dir = dirname(relativePath);
  const name = basename(relativePath, '.md');
  
  // Handle _index.md -> index.mdx conversion
  const isIndexFile = name === '_index';
  const targetName = isIndexFile ? 'index.mdx' : `${name}.mdx`;
  
  const targetPath = join(targetDir, dir, targetName);
  
  return {
    sourcePath,
    targetPath,
    isIndexFile
  } as const;
}

/**
 * Ensure target directory exists
 */
export async function ensureDirectory(filePath: string): Promise<void> {
  const dir = dirname(filePath);
  try {
    await mkdir(dir, { recursive: true });
  } catch (error) {
    throw new Error(`Failed to create directory ${dir}: ${String(error)}`);
  }
}

/**
 * Read file content safely
 */
export async function readFileContent(filePath: string): Promise<string> {
  try {
    const content = await readFile(filePath, 'utf8');
    return content;
  } catch (error) {
    throw new Error(`Failed to read file ${filePath}: ${String(error)}`);
  }
}

/**
 * Write file content safely
 */
export async function writeFileContent(filePath: string, content: string): Promise<void> {
  try {
    await ensureDirectory(filePath);
    await writeFile(filePath, content, 'utf8');
  } catch (error) {
    throw new Error(`Failed to write file ${filePath}: ${String(error)}`);
  }
}

/**
 * Check if file exists and get stats
 */
export async function getFileStats(filePath: string): Promise<{
  readonly exists: boolean;
  readonly size: number;
  readonly mtime: Date;
} | null> {
  try {
    const stats = await stat(filePath);
    return {
      exists: true,
      size: stats.size,
      mtime: stats.mtime
    } as const;
  } catch {
    return {
      exists: false,
      size: 0,
      mtime: new Date(0)
    } as const;
  }
}

/**
 * Check if file should be processed (for incremental mode)
 */
export async function shouldProcessFile(
  sourcePath: string,
  targetPath: string,
  incremental: boolean
): Promise<boolean> {
  if (!incremental) {
    return true;
  }
  
  const sourceStats = await getFileStats(sourcePath);
  const targetStats = await getFileStats(targetPath);
  
  if (!sourceStats?.exists) {
    return false;
  }
  
  if (!targetStats?.exists) {
    return true;
  }
  
  // Process if source is newer than target
  return sourceStats.mtime > targetStats.mtime;
}

/**
 * Get all path mappings for conversion
 */
export async function getAllPathMappings(config: ConversionConfig): Promise<readonly PathMapping[]> {
  const markdownFiles = await findMarkdownFiles(config.sourceDir);
  const mappings = markdownFiles.map(sourcePath => 
    createPathMapping(sourcePath, config.sourceDir, config.targetDir)
  );
  
  return mappings;
}

/**
 * Validate configuration paths
 */
export async function validateConfig(config: ConversionConfig): Promise<{
  readonly valid: boolean;
  readonly errors: readonly string[];
}> {
  const errors: string[] = [];
  
  // Check if source directory exists
  const sourceStats = await getFileStats(config.sourceDir);
  if (!sourceStats?.exists) {
    errors.push(`Source directory does not exist: ${config.sourceDir}`);
  }
  
  // Check if target directory parent exists (we'll create the target itself)
  const targetParent = dirname(config.targetDir);
  const targetParentStats = await getFileStats(targetParent);
  if (!targetParentStats?.exists) {
    errors.push(`Target parent directory does not exist: ${targetParent}`);
  }
  
  return {
    valid: errors.length === 0,
    errors
  } as const;
}