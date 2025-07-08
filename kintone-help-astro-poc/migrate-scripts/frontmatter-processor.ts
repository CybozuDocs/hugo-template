import type { FileContent, FrontMatterData } from "./types.js";
import { SHORTCODE_MAPPINGS } from "./shortcode-processor.js";

const FRONTMATTER_DELIMITER = "---";

export function parseFrontMatter(content: string): FileContent {
  const lines = content.split("\n");

  if (lines[0] !== FRONTMATTER_DELIMITER) {
    // No frontmatter, return content as-is
    return {
      frontmatter: {},
      content: content,
    };
  }

  let frontmatterEndIndex = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === FRONTMATTER_DELIMITER) {
      frontmatterEndIndex = i;
      break;
    }
  }

  if (frontmatterEndIndex === -1) {
    throw new Error("Invalid frontmatter: missing closing delimiter");
  }

  const frontmatterLines = lines.slice(1, frontmatterEndIndex);
  const contentLines = lines.slice(frontmatterEndIndex + 1);

  const frontmatter = parseYaml(frontmatterLines.join("\n"));
  const bodyContent = contentLines.join("\n");

  return {
    frontmatter,
    content: bodyContent,
  };
}

export function stringifyFrontMatter(
  frontmatter: Record<string, unknown>,
  content: string,
): string {
  const yamlContent = stringifyYaml(frontmatter);

  return [
    FRONTMATTER_DELIMITER,
    yamlContent,
    FRONTMATTER_DELIMITER,
    content,
  ].join("\n");
}

export function addLayoutField(
  frontmatter: Record<string, unknown>,
  isIndexFile: boolean,
): Record<string, unknown> {
  const result = { ...frontmatter };

  if (!result.layout) {
    result.layout = isIndexFile
      ? "@/layouts/SectionLayout.astro"
      : "@/layouts/PageLayout.astro";
  }

  return result;
}

export function processFrontMatter(
  frontmatter: Record<string, unknown>,
  isIndexFile: boolean,
): Record<string, unknown> {
  let processed = { ...frontmatter };

  // Process shortcodes in frontmatter values
  processed = processFrontMatterShortcodes(processed);

  // Add layout field
  processed = addLayoutField(processed, isIndexFile);

  // Ensure arrays are properly formatted
  if (processed.disabled && Array.isArray(processed.disabled)) {
    processed.disabled = [...processed.disabled];
  }

  if (processed.aliases) {
    if (typeof processed.aliases === "string") {
      processed.aliases = [processed.aliases];
    } else if (Array.isArray(processed.aliases)) {
      processed.aliases = [...processed.aliases];
    }
  }

  return processed;
}

/**
 * Process shortcodes in frontmatter values
 * Converts Hugo shortcodes like {{< kintone >}} to Astro components like <Kintone />
 */
function processFrontMatterShortcodes(
  frontmatter: Record<string, unknown>,
): Record<string, unknown> {
  const processed: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(frontmatter)) {
    if (typeof value === "string") {
      processed[key] = processShortcodesInString(value);
    } else {
      processed[key] = value;
    }
  }

  return processed;
}

/**
 * Process shortcodes in a string value
 * Only handles simple shortcodes (no attributes, no content)
 */
function processShortcodesInString(text: string): string {
  let processed = text;

  // Process simple shortcodes only
  for (const [shortcode, component] of Object.entries(
    SHORTCODE_MAPPINGS.simple,
  )) {
    const regex = new RegExp(`\\{\\{<\\s*${shortcode}\\s*>\\}\\}`, "g");
    const replacement = `<${component} />`;

    if (regex.test(processed)) {
      processed = processed.replace(regex, replacement);
    }
  }

  return processed;
}

// Simple YAML parser for basic frontmatter
function parseYaml(yamlContent: string): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const lines = yamlContent.split("\n").filter((line) => line.trim());

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    // Handle arrays
    if (trimmed.startsWith("-")) {
      // This is part of an array, handle it with the previous key
      continue;
    }

    const colonIndex = trimmed.indexOf(":");
    if (colonIndex === -1) continue;

    const key = trimmed.slice(0, colonIndex).trim();
    const value = trimmed.slice(colonIndex + 1).trim();

    // Parse the value
    result[key] = parseYamlValue(value, yamlContent, key);
  }

  return result;
}

function parseYamlValue(
  value: string,
  fullContent: string,
  key: string,
): unknown {
  // Handle quoted strings
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  // Handle arrays
  if (value === "" || value === "[]") {
    // Look for array items in following lines
    const lines = fullContent.split("\n");
    const keyLineIndex = lines.findIndex((line) => line.includes(`${key}:`));
    const arrayItems: string[] = [];

    for (let i = keyLineIndex + 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line.startsWith("-")) break;

      const item = line.slice(1).trim();
      if (item.startsWith('"') && item.endsWith('"')) {
        arrayItems.push(item.slice(1, -1));
      } else {
        arrayItems.push(item);
      }
    }

    return arrayItems;
  }

  // Handle numbers
  if (/^\d+$/.test(value)) {
    return parseInt(value, 10);
  }

  // Handle booleans
  if (value === "true") return true;
  if (value === "false") return false;

  // Return as string
  return value;
}

// Simple YAML stringifier
function stringifyYaml(obj: Record<string, unknown>): string {
  const lines: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      if (value.length === 0) {
        lines.push(`${key}: []`);
      } else {
        lines.push(`${key}:`);
        for (const item of value) {
          lines.push(`  - "${item}"`);
        }
      }
    } else if (typeof value === "string") {
      lines.push(`${key}: "${value}"`);
    } else {
      lines.push(`${key}: ${value}`);
    }
  }

  return lines.join("\n");
}
