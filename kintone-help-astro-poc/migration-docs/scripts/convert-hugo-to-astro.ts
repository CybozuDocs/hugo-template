#!/usr/bin/env -S deno run --allow-read --allow-write

/**
 * Hugo to Astro MDX 変換スクリプト
 * 
 * Hugo の Markdown コンテンツを Astro MDX 形式に変換します。
 * 22種類の Shortcode、20種類の FrontMatter プロパティに対応。
 * 
 * 使用例:
 * deno run --allow-read --allow-write convert-hugo-to-astro.ts --target admin/app_admin
 * deno run --allow-read --allow-write convert-hugo-to-astro.ts --files "start/whatskintone.md" --dry-run
 */

// Deno 型定義
/// <reference lib="deno.ns" />

import { parse as parseArgs } from "https://deno.land/std@0.208.0/flags/mod.ts";
import { parse as parseYaml, stringify as stringifyYaml } from "https://deno.land/std@0.208.0/yaml/mod.ts";
import { join, dirname, relative } from "https://deno.land/std@0.208.0/path/mod.ts";
import { expandGlob } from "https://deno.land/std@0.208.0/fs/mod.ts";
import { ensureDir } from "https://deno.land/std@0.208.0/fs/mod.ts";

// === 型定義 ===

interface CliOptions {
  "source-dir"?: string;
  "target-dir"?: string;
  target?: string;
  files?: string;
  exclude?: string;
  include?: string;
  depth?: number;
  "dry-run"?: boolean;
  verbose?: boolean;
  force?: boolean;
  backup?: boolean;
  parallel?: number;
  "skip-shortcodes"?: boolean;
  "skip-images"?: boolean;
  "skip-headings"?: boolean;
  "only-frontmatter"?: boolean;
  help?: boolean;
}

interface FrontMatter {
  title?: string;
  weight?: number;
  aliases?: string;
  disabled?: string[] | string;
  description?: string;
  labels?: number[];
  type?: string;
  // 印刷用プロパティ
  title2?: string;
  company?: string;
  version?: string;
  chapter1?: string;
  chapter2?: string;
  index?: string;
  page?: string;
  issue?: string;
  issuedate?: string;
  update?: string;
  updatedate?: string;
  // タイポ修正用
  weght?: number;
  decription?: string;
  [key: string]: unknown;
}

interface ConversionResult {
  success: boolean;
  inputFile: string;
  outputFile: string;
  error?: string;
  shortcodesConverted: number;
  imagesConverted: number;
  headingsConverted: number;
}

interface ConversionStats {
  totalFiles: number;
  successfulFiles: number;
  failedFiles: number;
  totalShortcodes: number;
  totalImages: number;
  totalHeadings: number;
  processingTime: number;
}

// === 設定 ===

// Shortcode 変換マッピング（使用頻度順）
const SHORTCODE_MAPPINGS = {
  // 高頻度 Shortcode（100回以上）
  "kintone": { component: "Kintone", selfClosing: true, count: 1888 },
  "wv_brk": { component: "Wovn", selfClosing: false, count: 1112 },
  "note": { component: "Note", selfClosing: false, count: 676 },
  "enabled2": { component: "Enabled", selfClosing: false, count: 332, hasParams: true },
  "reference": { component: "Reference", selfClosing: false, count: 307 },
  "slash": { component: "Slash", selfClosing: true, count: 207 },
  "slash_ui": { component: "SlashUi", selfClosing: true, count: 177 },
  "hint": { component: "Hint", selfClosing: false, count: 156 },
  
  // 中低頻度 Shortcode（50回未満）
  "warning": { component: "Warning", selfClosing: false, count: 84 },
  "cybozu_com": { component: "CybozuCom", selfClosing: true, count: 41 },
  "graynote": { component: "Graynote", selfClosing: false, count: 38 },
  "subtitle": { component: "Subtitle", selfClosing: false, count: 21 },
  "store": { component: "Store", selfClosing: true, count: 20 },
  "service": { component: "Service", selfClosing: true, count: 18 },
  "listsummary": { component: "Listsummary", selfClosing: false, count: 16 },
  "disabled2": { component: "Disabled2", selfClosing: false, count: 16, hasParams: true },
  "slash_help": { component: "SlashHelp", selfClosing: true, count: 11 },
  "devnet_top": { component: "DevnetTop", selfClosing: true, count: 5 },
  "slash_administrators": { component: "SlashAdministrators", selfClosing: true, count: 5 },
  "devnet_name": { component: "DevnetName", selfClosing: true, count: 2 },
  "CorpName": { component: "CorpName", selfClosing: true, count: 1 },
};

// === ユーティリティ関数 ===

function showHelp() {
  console.log(`
Hugo to Astro MDX 変換スクリプト

使用法:
  deno run --allow-read --allow-write convert-hugo-to-astro.ts [オプション]

必須オプション:
  --source-dir <path>       Hugo コンテンツのソースディレクトリ
  --target-dir <path>       Astro MDX の出力ディレクトリ

対象絞り込みオプション:
  --target <path>           特定ディレクトリのみ変換
  --files <files>           特定ファイルのみ変換（カンマ区切り）
  --exclude <pattern>       除外パターン（glob形式）
  --include <pattern>       包含パターン（glob形式）
  --depth <number>          ディレクトリ探索の深さ制限

実行制御オプション:
  --dry-run                 実際の変換は行わず、対象ファイルのみ表示
  --verbose                 詳細ログ出力
  --force                   既存ファイルを強制上書き
  --backup                  変換前にバックアップ作成
  --parallel <number>       並列処理数指定

変換制御オプション:
  --skip-shortcodes         Shortcode変換をスキップ
  --skip-images             画像変換をスキップ
  --skip-headings           見出し変換をスキップ
  --only-frontmatter        FrontMatterのみ変換

使用例:
  deno run --allow-read --allow-write convert-hugo-to-astro.ts \\
    --source-dir "/path/to/hugo/content/ja" \\
    --target-dir "/path/to/astro/src/pages/ja" \\
    --target admin/app_admin

  deno run --allow-read --allow-write convert-hugo-to-astro.ts \\
    --source-dir "./content/ja" \\
    --target-dir "./src/pages/ja" \\
    --files "start/whatskintone.md" --dry-run
`);
}

function log(message: string, verbose = false) {
  if (!verbose || options.verbose) {
    console.log(message);
  }
}

function error(message: string) {
  console.error(`❌ ${message}`);
}

function success(message: string) {
  console.log(`✅ ${message}`);
}

// === FrontMatter 処理 ===

function parseFrontMatter(content: string): { frontMatter: FrontMatter; body: string } {
  const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  
  if (!frontMatterMatch) {
    return { frontMatter: {}, body: content };
  }

  try {
    const frontMatter = parseYaml(frontMatterMatch[1]) as FrontMatter;
    const body = frontMatterMatch[2];
    return { frontMatter, body };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    throw new Error(`FrontMatter解析エラー: ${errorMessage}`);
  }
}

function fixFrontMatterTypos(frontMatter: FrontMatter): FrontMatter {
  const fixed = { ...frontMatter };
  
  // タイポ修正
  if (fixed.weght !== undefined) {
    fixed.weight = fixed.weght;
    delete fixed.weght;
  }
  
  if (fixed.decription !== undefined) {
    fixed.description = fixed.decription;
    delete fixed.decription;
  }
  
  // disabled プロパティの配列形式統一
  if (typeof fixed.disabled === 'string') {
    fixed.disabled = [fixed.disabled];
  }
  
  return fixed;
}

function convertFrontMatter(frontMatter: FrontMatter): FrontMatter {
  const converted = fixFrontMatterTypos(frontMatter);
  
  // title 内の shortcode 変換
  if (converted.title && typeof converted.title === 'string') {
    converted.title = converted.title.replace(/\{\{<\s*kintone\s*>\}\}/g, '<Kintone />');
    converted.title = converted.title.replace(/\{\{%\s*kintone\s*%\}\}/g, '<Kintone />'); // 誤記修正
  }
  
  // layout 追加
  converted.layout = "@/layouts/PageLayout.astro";
  
  return converted;
}

function stringifyFrontMatter(frontMatter: FrontMatter): string {
  return stringifyYaml(frontMatter, { skipInvalid: true }).trim();
}

// === Shortcode 変換 ===

function convertShortcodes(content: string): { content: string; count: number } {
  let convertedContent = content;
  let totalCount = 0;

  // 各 shortcode を使用頻度順に変換
  for (const [shortcode, config] of Object.entries(SHORTCODE_MAPPINGS)) {
    const { content: newContent, count } = convertSingleShortcode(convertedContent, shortcode, config);
    convertedContent = newContent;
    totalCount += count;
    
    if (count > 0) {
      log(`  ${shortcode}: ${count}回変換`, true);
    }
  }

  return { content: convertedContent, count: totalCount };
}

function convertSingleShortcode(
  content: string,
  shortcode: string,
  config: { component: string; selfClosing: boolean; hasParams?: boolean }
): { content: string; count: number } {
  let convertedContent = content;
  let count = 0;

  if (config.selfClosing) {
    // 単独型 shortcode: {{< kintone >}} → <Kintone />
    const regex = new RegExp(`\\{\\{<\\s*${shortcode}\\s*>\\}\\}`, 'g');
    convertedContent = convertedContent.replace(regex, () => {
      count++;
      return `<${config.component} />`;
    });
    
    // 誤記修正: {{% kintone %}} → <Kintone />
    const incorrectRegex = new RegExp(`\\{\\{%\\s*${shortcode}\\s*%\\}\\}`, 'g');
    convertedContent = convertedContent.replace(incorrectRegex, () => {
      count++;
      return `<${config.component} />`;
    });
  } else {
    // ブロック型 shortcode
    if (config.hasParams && (shortcode === 'enabled2' || shortcode === 'disabled2')) {
      convertedContent = convertEnabledDisabledShortcode(convertedContent, shortcode, config);
    } else {
      // 通常のブロック型: {{< note >}}...{{< /note >}} → <Note>...</Note>
      const regex = new RegExp(
        `\\{\\{<\\s*${shortcode}\\s*>\\}\\}([\\s\\S]*?)\\{\\{<\\s*/${shortcode}\\s*>\\}\\}`,
        'g'
      );
      convertedContent = convertedContent.replace(regex, (match, innerContent) => {
        count++;
        return `<${config.component}>${innerContent}</${config.component}>`;
      });
    }
  }

  return { content: convertedContent, count };
}

function convertEnabledDisabledShortcode(
  content: string,
  shortcode: string,
  _config: { component: string }
): string {
  // enabled2/disabled2 の地域パラメータ処理
  const regex = new RegExp(
    `\\{\\{<\\s*${shortcode}\\s+([^>]+)>\\}\\}([\\s\\S]*?)\\{\\{<\\s*/${shortcode}\\s*>\\}\\}`,
    'g'
  );
  
  return content.replace(regex, (_match, params, innerContent) => {
    const regions = params.trim().split(/\s+/);
    
    let propValue: string;
    if (regions.length === 1) {
      propValue = `"${regions[0]}"`;
    } else {
      propValue = `{[${regions.map(r => `"${r}"`).join(', ')}]}`;
    }
    
    if (shortcode === 'enabled2') {
      return `<Enabled for=${propValue}>${innerContent}</Enabled>`;
    } else {
      return `<Disabled2 regions=${propValue}>${innerContent}</Disabled2>`;
    }
  });
}

// === 画像変換 ===

function convertImages(content: string): { content: string; count: number } {
  let count = 0;
  
  // 画像記法: ![alt](src) → <Img src="src" alt="alt" />
  // title 属性付き: ![alt](src "title") → <Img src="src" alt="alt" title="title" />
  // alt テキスト内の [ ] に対応: 最短マッチでより厳密に
  const imageRegex = /!\[((?:[^\[\]]|\[[^\]]*\])*?)\]\(([^)]+?)(?:\s+"([^"]*)")?\)/g;
  
  const convertedContent = content.replace(imageRegex, (_match, alt, src, title) => {
    count++;
    
    // パスの変換: /k/img-ja/ → /k/kintone/img-ja/
    const convertedSrc = src.replace(/^\/k\/img-ja\//, '/k/kintone/img-ja/');
    
    let imgTag = `<Img src="${convertedSrc}" alt="${alt}"`;
    if (title) {
      imgTag += ` title="${title}"`;
    }
    imgTag += ' />';
    
    return imgTag;
  });

  return { content: convertedContent, count };
}

// === 見出し変換 ===

function convertHeadings(content: string): { content: string; count: number } {
  let count = 0;
  
  // 見出し記法: ## 見出し{#id} → <Heading id="id">見出し</Heading>
  // ### 見出し{#id} → <Heading level={3} id="id">見出し</Heading>
  const headingRegex = /^(#{2,6})\s+(.+?)\{#([^}]+)\}\s*$/gm;
  
  const convertedContent = content.replace(headingRegex, (_match, hashes, title, id) => {
    count++;
    const level = hashes.length;
    const trimmedTitle = title.trim();
    
    if (level === 2) {
      return `<Heading id="${id}">${trimmedTitle}</Heading>`;
    } else {
      return `<Heading level={${level}} id="${id}">${trimmedTitle}</Heading>`;
    }
  });

  return { content: convertedContent, count };
}

// === Import 文生成 ===

function generateImports(content: string): string {
  const imports: string[] = [];
  const componentSet = new Set<string>();

  // 使用されているコンポーネントを検出
  for (const [_shortcode, config] of Object.entries(SHORTCODE_MAPPINGS)) {
    const componentRegex = new RegExp(`<${config.component}(?:\\s|>|/>)`, 'g');
    if (componentRegex.test(content)) {
      componentSet.add(config.component);
    }
  }

  // Img コンポーネント
  if (/<Img\s/.test(content)) {
    componentSet.add('Img');
  }

  // Heading コンポーネント
  if (/<Heading\s/.test(content)) {
    componentSet.add('Heading');
  }

  // import 文を生成（アルファベット順）
  const sortedComponents = Array.from(componentSet).sort();
  for (const component of sortedComponents) {
    imports.push(`import ${component} from "@/components/${component}.astro";`);
  }

  return imports.join('\n');
}

// === ファイル処理 ===

async function findTargetFiles(options: CliOptions, sourceDir: string): Promise<string[]> {
  const files: string[] = [];

  if (options.files) {
    // 特定ファイル指定
    const fileList = options.files.split(',').map(f => f.trim());
    for (const file of fileList) {
      const fullPath = join(sourceDir, file);
      try {
        const stat = await Deno.stat(fullPath);
        if (stat.isFile && file.endsWith('.md')) {
          files.push(file);
        }
      } catch {
        error(`ファイルが見つかりません: ${file}`);
      }
    }
  } else {
    // ディレクトリ探索
    const targetPath = options.target ? join(sourceDir, options.target) : sourceDir;
    const globPattern = join(targetPath, "**/*.md");
    
    for await (const entry of expandGlob(globPattern)) {
      if (entry.isFile) {
        const relativePath = relative(sourceDir, entry.path);
        
        // 除外パターンチェック
        if (options.exclude && new RegExp(options.exclude.replace(/\*/g, '.*')).test(relativePath)) {
          continue;
        }
        
        // 包含パターンチェック
        if (options.include && !new RegExp(options.include.replace(/\*/g, '.*')).test(relativePath)) {
          continue;
        }
        
        // 深度チェック
        if (options.depth) {
          const depth = relativePath.split('/').length - 1;
          if (depth > options.depth) {
            continue;
          }
        }
        
        files.push(relativePath);
      }
    }
  }

  return files.sort();
}

async function convertFile(inputPath: string, options: CliOptions, sourceDir: string, targetDir: string): Promise<ConversionResult> {
  const fullInputPath = join(sourceDir, inputPath);
  // _index.md → index.mdx の変換ルール
  const outputPath = inputPath.replace(/_index\.md$/, 'index.mdx').replace(/\.md$/, '.mdx');
  const fullOutputPath = join(targetDir, outputPath);

  try {
    // ファイル読み込み
    const content = await Deno.readTextFile(fullInputPath);
    
    // FrontMatter 解析
    const { frontMatter, body } = parseFrontMatter(content);
    log(`  FrontMatter解析完了: ${Object.keys(frontMatter).length}個のプロパティ`, true);
    
    // FrontMatter 変換
    const convertedFrontMatter = convertFrontMatter(frontMatter);
    
    let convertedBody = body;
    let shortcodesConverted = 0;
    let imagesConverted = 0;
    let headingsConverted = 0;

    // Shortcode 変換
    if (!options["skip-shortcodes"] && !options["only-frontmatter"]) {
      const shortcodeResult = convertShortcodes(convertedBody);
      convertedBody = shortcodeResult.content;
      shortcodesConverted = shortcodeResult.count;
    }

    // 画像変換
    if (!options["skip-images"] && !options["only-frontmatter"]) {
      const imageResult = convertImages(convertedBody);
      convertedBody = imageResult.content;
      imagesConverted = imageResult.count;
    }

    // 見出し変換
    if (!options["skip-headings"] && !options["only-frontmatter"]) {
      const headingResult = convertHeadings(convertedBody);
      convertedBody = headingResult.content;
      headingsConverted = headingResult.count;
    }

    // Import 文生成
    const imports = !options["only-frontmatter"] ? generateImports(convertedBody) : '';

    // 最終コンテンツ生成
    const finalContent = [
      '---',
      stringifyFrontMatter(convertedFrontMatter),
      '---',
      '',
      imports,
      imports ? '' : undefined,
      convertedBody
    ].filter(line => line !== undefined).join('\n');

    // ファイル書き込み
    if (!options["dry-run"]) {
      await ensureDir(dirname(fullOutputPath));
      
      // バックアップ作成
      if (options.backup) {
        try {
          await Deno.stat(fullOutputPath);
          await Deno.copyFile(fullOutputPath, `${fullOutputPath}.backup`);
        } catch {
          // ファイルが存在しない場合は無視
        }
      }
      
      // 既存ファイルチェック
      if (!options.force) {
        try {
          await Deno.stat(fullOutputPath);
          throw new Error('ファイルが既に存在します（--force で強制上書き）');
        } catch (err) {
          if (!(err instanceof Deno.errors.NotFound)) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            throw new Error(errorMessage);
          }
        }
      }
      
      await Deno.writeTextFile(fullOutputPath, finalContent);
    }

    return {
      success: true,
      inputFile: inputPath,
      outputFile: outputPath,
      shortcodesConverted,
      imagesConverted,
      headingsConverted
    };
    
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      inputFile: inputPath,
      outputFile: outputPath,
      error: errorMessage,
      shortcodesConverted: 0,
      imagesConverted: 0,
      headingsConverted: 0
    };
  }
}

// === メイン処理 ===

async function main() {
  const args = parseArgs(Deno.args);
  const options = args as CliOptions;

  if (options.help) {
    showHelp();
    Deno.exit(0);
  }

  // 必須オプションチェック
  if (!options["source-dir"] || !options["target-dir"]) {
    error("--source-dir と --target-dir は必須です");
    console.log("\nヘルプを表示するには --help オプションを使用してください");
    Deno.exit(1);
  }

  const sourceDir = options["source-dir"]!;
  const targetDir = options["target-dir"]!;

  console.log('Hugo to Astro MDX Converter');
  console.log('===========================\n');
  console.log(`Source: ${sourceDir}`);
  console.log(`Target: ${targetDir}\n`);

  // ディレクトリ存在チェック
  try {
    const sourceStat = await Deno.stat(sourceDir);
    if (!sourceStat.isDirectory) {
      throw new Error("ソースパスがディレクトリではありません");
    }
  } catch {
    error(`ソースディレクトリが見つかりません: ${sourceDir}`);
    Deno.exit(1);
  }

  // 対象ファイル検索
  log('対象ファイルを検索中...');
  const targetFiles = await findTargetFiles(options, sourceDir);
  
  if (targetFiles.length === 0) {
    error('変換対象のファイルが見つかりませんでした');
    Deno.exit(1);
  }

  log(`対象ファイル: ${targetFiles.length}個`);
  if (options.verbose) {
    targetFiles.forEach(file => log(`  - ${file}`, true));
  }

  if (options["dry-run"]) {
    console.log('\n📋 Dry-run モード: 以下のファイルが変換対象です');
    targetFiles.forEach(file => console.log(`  ${file} → ${file.replace(/\.md$/, '.mdx')}`));
    Deno.exit(0);
  }

  // 変換処理
  console.log('\n🔄 変換を開始します...\n');
  const startTime = Date.now();
  const results: ConversionResult[] = [];

  const parallel = options.parallel || 4;
  for (let i = 0; i < targetFiles.length; i += parallel) {
    const batch = targetFiles.slice(i, i + parallel);
    const batchResults = await Promise.all(
      batch.map((file: string) => convertFile(file, options, sourceDir, targetDir))
    );
    
    results.push(...batchResults);
    
    // 進捗表示
    for (const result of batchResults) {
      if (result.success) {
        success(`${result.inputFile} → ${result.outputFile}`);
        if (options.verbose) {
          log(`    Shortcodes: ${result.shortcodesConverted}, Images: ${result.imagesConverted}, Headings: ${result.headingsConverted}`, true);
        }
      } else {
        error(`${result.inputFile} (${result.error})`);
      }
    }
  }

  // 統計情報
  const endTime = Date.now();
  const stats: ConversionStats = {
    totalFiles: results.length,
    successfulFiles: results.filter(r => r.success).length,
    failedFiles: results.filter(r => !r.success).length,
    totalShortcodes: results.reduce((sum, r) => sum + r.shortcodesConverted, 0),
    totalImages: results.reduce((sum, r) => sum + r.imagesConverted, 0),
    totalHeadings: results.reduce((sum, r) => sum + r.headingsConverted, 0),
    processingTime: (endTime - startTime) / 1000
  };

  console.log('\n📊 変換結果:');
  console.log(`- 総ファイル数: ${stats.totalFiles}`);
  console.log(`- 成功: ${stats.successfulFiles} (${(stats.successfulFiles / stats.totalFiles * 100).toFixed(1)}%)`);
  console.log(`- 失敗: ${stats.failedFiles} (${(stats.failedFiles / stats.totalFiles * 100).toFixed(1)}%)`);
  console.log(`- Shortcode変換: ${stats.totalShortcodes}回`);
  console.log(`- 画像変換: ${stats.totalImages}回`);
  console.log(`- 見出し変換: ${stats.totalHeadings}回`);
  console.log(`- 処理時間: ${stats.processingTime.toFixed(2)}秒`);

  // エラーファイルのレポート
  const failedFiles = results.filter(r => !r.success);
  if (failedFiles.length > 0) {
    console.log('\n❌ 変換に失敗したファイル:');
    failedFiles.forEach(result => {
      console.log(`  ${result.inputFile}: ${result.error}`);
    });
    
    // エラーログ保存
    const errorLog = failedFiles.map(r => `${r.inputFile}: ${r.error}`).join('\n');
    await Deno.writeTextFile('conversion-errors.log', errorLog);
    console.log('\n詳細なエラーログ: conversion-errors.log');
  }

  if (stats.failedFiles > 0) {
    Deno.exit(1);
  }
}

// グローバル変数として options を定義
let options: CliOptions = {};

if ((import.meta as any).main) {
  // コマンドライン引数を解析してグローバル変数に設定
  options = parseArgs(Deno.args) as CliOptions;
  
  try {
    await main();
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    error(`予期しないエラー: ${errorMessage}`);
    Deno.exit(1);
  }
}