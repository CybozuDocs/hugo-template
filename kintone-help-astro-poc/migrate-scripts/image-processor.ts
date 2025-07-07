import type { ImageMatch, ConversionResult, PathReplacement } from "./types.js";

// Regular expression to match markdown image syntax
// ![alt text](src "optional title")
// Allow leading whitespace and brackets in alt text
const IMAGE_REGEX = /(\s*)!\[(.*?)\]\(([^)]+?)(?:\s+"([^"]*)")?\)/g;

export function processImages(
  content: string,
  imagePathPrefix?: PathReplacement,
): ConversionResult {
  const imports: string[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];
  let hasImages = false;

  // Reset regex state
  IMAGE_REGEX.lastIndex = 0;

  const processedContent = content.replace(
    IMAGE_REGEX,
    (match, whitespace, alt, src, title) => {
      try {
        hasImages = true;

        // Apply path prefix replacement if specified
        let processedSrc = src;
        if (imagePathPrefix && src.includes(imagePathPrefix.from)) {
          processedSrc = src.replace(imagePathPrefix.from, imagePathPrefix.to);
        }

        // Generate Img component with preserved whitespace
        const imgComponent = generateImgComponent(alt, processedSrc, title);
        return whitespace + imgComponent;
      } catch (error) {
        errors.push(`Failed to process image: ${match} - ${error}`);
        return match; // Return original if processing fails
      }
    },
  );

  // Add Img import if images were found
  if (hasImages) {
    imports.push('import Img from "@/components/Img.astro";');
  }

  return {
    converted: hasImages,
    imports,
    content: processedContent,
    errors,
    warnings,
  };
}

export function generateImgComponent(
  alt: string,
  src: string,
  title?: string,
): string {
  const attributes: string[] = [
    `src="${src}"`,
    `alt="${escapeAttribute(alt)}"`,
  ];

  if (title) {
    attributes.push(`title="${escapeAttribute(title)}"`);
  }

  return `<Img ${attributes.join(" ")} />`;
}

export function extractImages(content: string): ImageMatch[] {
  const matches: ImageMatch[] = [];
  let match;

  // Reset regex state
  IMAGE_REGEX.lastIndex = 0;

  while ((match = IMAGE_REGEX.exec(content)) !== null) {
    matches.push({
      fullMatch: match[0],
      alt: match[2] || "",
      src: match[3],
      title: match[4],
    });
  }

  return matches;
}

export function validateImagePath(src: string): boolean {
  // Basic validation for image paths
  if (!src || src.trim() === "") {
    return false;
  }

  // Check for common image extensions
  const validExtensions = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"];
  const hasValidExtension = validExtensions.some((ext) =>
    src.toLowerCase().includes(ext),
  );

  if (!hasValidExtension) {
    return false;
  }

  return true;
}

export function escapeAttribute(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function processImagePathInList(content: string): string {
  // Handle images in list items with proper indentation
  const lines = content.split("\n");
  const processedLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if current line is a numbered list item
    const numberedListMatch = line.match(/^(\s*)(\d+)\.\s/);

    if (numberedListMatch) {
      const listBaseIndent = numberedListMatch[1].length;
      const listContentIndent = listBaseIndent + 3; // "1. " = 3 characters

      processedLines.push(line);

      // Check subsequent lines for continuation of this list item
      let j = i + 1;
      while (j < lines.length) {
        const nextLine = lines[j];

        // If next line is empty, include it and continue
        if (nextLine.trim() === "") {
          processedLines.push(nextLine);
          j++;
          continue;
        }

        // If next line starts a new list item, stop processing this item
        const nextListMatch = nextLine.match(/^(\s*)(\d+)\.\s/);
        if (nextListMatch && nextListMatch[1].length === listBaseIndent) {
          break;
        }

        // If next line is indented content (including images)
        const nextLineIndent = nextLine.match(/^(\s*)/)?.[1]?.length || 0;

        // If it's an Img component that needs proper indentation
        if (nextLine.includes("<Img") && nextLineIndent < listContentIndent) {
          // Adjust indentation to match list content
          const adjustedLine = " ".repeat(listContentIndent) + nextLine.trim();
          processedLines.push(adjustedLine);
        } else if (nextLineIndent >= 2) {
          // Other indented content
          processedLines.push(nextLine);
        } else {
          // Not part of this list item anymore
          break;
        }

        j++;
      }

      i = j - 1; // Update main loop counter
    } else {
      processedLines.push(line);
    }
  }

  return processedLines.join("\n");
}
