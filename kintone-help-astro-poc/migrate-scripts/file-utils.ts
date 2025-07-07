import { readdir, readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { join, dirname, extname, basename, relative } from "node:path";
import type { ConversionConfig } from "./types.js";

export async function findMarkdownFiles(
  inputDir: string,
  filter?: string,
): Promise<string[]> {
  const files: string[] = [];

  async function walk(dir: string): Promise<void> {
    try {
      const entries = await readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = join(dir, entry.name);

        if (entry.isDirectory()) {
          await walk(fullPath);
        } else if (entry.isFile() && entry.name.endsWith(".md")) {
          if (!filter || fullPath.includes(filter)) {
            files.push(fullPath);
          }
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not read directory ${dir}:`, error);
    }
  }

  await walk(inputDir);
  return files;
}

export function getOutputPath(
  inputPath: string,
  inputDir: string,
  outputDir: string,
): string {
  const relativePath = relative(inputDir, inputPath);
  const dir = dirname(relativePath);
  const fileName = basename(relativePath, ".md");

  // Handle _index.md -> index.mdx conversion
  const outputFileName =
    fileName === "_index" ? "index.mdx" : `${fileName}.mdx`;

  return join(outputDir, dir, outputFileName);
}

export async function ensureDirectoryExists(filePath: string): Promise<void> {
  const dir = dirname(filePath);
  try {
    await mkdir(dir, { recursive: true });
  } catch (error) {
    // Ignore error if directory already exists
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") {
      throw error;
    }
  }
}

export async function readMarkdownFile(filePath: string): Promise<string> {
  try {
    return await readFile(filePath, "utf-8");
  } catch (error) {
    throw new Error(`Failed to read file ${filePath}: ${error}`);
  }
}

export async function writeMarkdownFile(
  filePath: string,
  content: string,
): Promise<void> {
  try {
    await ensureDirectoryExists(filePath);
    await writeFile(filePath, content, "utf-8");
  } catch (error) {
    throw new Error(`Failed to write file ${filePath}: ${error}`);
  }
}

export async function getFileStats(filePath: string): Promise<{
  size: number;
  modified: Date;
}> {
  try {
    const stats = await stat(filePath);
    return {
      size: stats.size,
      modified: stats.mtime,
    };
  } catch (error) {
    throw new Error(`Failed to get stats for file ${filePath}: ${error}`);
  }
}

export function shouldSkipFile(
  filePath: string,
  config: ConversionConfig,
): boolean {
  // Skip if filter is specified and doesn't match
  if (config.filter && !filePath.includes(config.filter)) {
    return true;
  }

  // Skip non-markdown files
  if (!filePath.endsWith(".md")) {
    return true;
  }

  return false;
}
