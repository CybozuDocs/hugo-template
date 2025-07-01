import { parseArgs } from 'node:util';
import type { ConversionConfig, PathReplacement } from './types.js';

export function parseCliArgs(): ConversionConfig {
  const { values, positionals } = parseArgs({
    args: process.argv.slice(2),
    options: {
      'input-dir': {
        type: 'string',
        short: 'i',
      },
      'output-dir': {
        type: 'string',
        short: 'o',
      },
      'filter': {
        type: 'string',
        short: 'f',
      },
      'image-path-from': {
        type: 'string',
      },
      'image-path-to': {
        type: 'string',
      },
      'help': {
        type: 'boolean',
        short: 'h',
      },
    },
    allowPositionals: true,
  });

  if (values.help) {
    showHelp();
    process.exit(0);
  }

  const inputDir = values['input-dir'] || positionals[0];
  const outputDir = values['output-dir'] || positionals[1];

  if (!inputDir || !outputDir) {
    console.error('Error: Both input-dir and output-dir are required.');
    showHelp();
    process.exit(1);
  }

  const config: ConversionConfig = {
    inputDir,
    outputDir,
  };

  if (values.filter) {
    config.filter = values.filter;
  }

  if (values['image-path-from'] && values['image-path-to']) {
    config.imagePathPrefix = {
      from: values['image-path-from'],
      to: values['image-path-to'],
    };
  }

  return config;
}

function showHelp(): void {
  console.log(`
Hugo to Astro Content Converter

Usage:
  tsx convert-content.ts [options] <input-dir> <output-dir>

Options:
  -i, --input-dir <dir>      Input directory containing Hugo markdown files
  -o, --output-dir <dir>     Output directory for converted Astro MDX files
  -f, --filter <pattern>     Filter files by path pattern (partial match)
  --image-path-from <path>   Source path prefix for image path replacement
  --image-path-to <path>     Target path prefix for image path replacement
  -h, --help                 Show this help message

Examples:
  # Basic conversion
  tsx convert-content.ts /path/to/hugo/content /path/to/astro/pages

  # With filtering
  tsx convert-content.ts -f "start/" -i ./content -o ./pages

  # With image path replacement
  tsx convert-content.ts \\
    --image-path-from "/k/" \\
    --image-path-to "/k/kintone/" \\
    ./content ./pages
`);
}