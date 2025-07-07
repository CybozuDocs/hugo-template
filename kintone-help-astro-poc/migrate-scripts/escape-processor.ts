import type { ConversionResult } from "./types.js";

export function processEscaping(content: string): ConversionResult {
  const imports: string[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];
  let hasChanges = false;

  let processedContent = content;

  // Escape curly braces in content that's not inside JSX components
  // This prevents MDX from trying to parse JSON objects as JSX expressions
  processedContent = escapeCurlyBracesInText(processedContent);

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

function escapeCurlyBracesInText(content: string): string {
  const lines = content.split("\n");
  const processedLines: string[] = [];

  for (const line of lines) {
    // Skip lines that contain JSX components (start with <)
    if (line.trim().startsWith("<") && line.trim().includes(">")) {
      processedLines.push(line);
      continue;
    }

    // Skip lines that are import statements
    if (line.trim().startsWith("import ")) {
      processedLines.push(line);
      continue;
    }

    // Skip lines that are frontmatter (between ---)
    if (line.trim() === "---") {
      processedLines.push(line);
      continue;
    }

    // Process regular content lines
    let processedLine = line;

    // Use a more comprehensive approach to escape JSON-like structures
    // This will find and escape complex nested JSON patterns
    processedLine = escapeNestedJsonStructures(processedLine);

    processedLines.push(processedLine);
  }

  return processedLines.join("\n");
}

function escapeNestedJsonStructures(text: string): string {
  // Find JSON-like structures and escape them
  // This uses a more sophisticated approach to handle nested structures

  let result = text;
  let changed = true;

  // Keep applying replacements until no more changes occur
  while (changed) {
    const before = result;

    // Match JSON objects with colons (key:value patterns)
    result = result.replace(/\{([^{}]*:[^{}]*)\}/g, (match, content) => {
      // Don't escape if this looks like JSX props syntax
      if (
        content.includes("={") ||
        content.includes('["') ||
        content.includes("]}")
      ) {
        return match;
      }
      return `&#123;${content}&#125;`;
    });

    // Match nested structures like {key: {nested: value}}
    result = result.replace(
      /\{([^{}]*\{[^{}]*\}[^{}]*)\}/g,
      (match, content) => {
        return `&#123;${content.replace(/\{/g, "&#123;").replace(/\}/g, "&#125;")}&#125;`;
      },
    );

    changed = before !== result;
  }

  return result;
}
