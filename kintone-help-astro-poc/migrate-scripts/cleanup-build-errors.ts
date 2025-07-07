#!/usr/bin/env deno run --allow-run --allow-read --allow-write

/**
 * Astro ビルドエラーを起こすファイルを自動削除するスクリプト
 *
 * 安全のため、kintone-help-astro-poc/src/pages/ja 配下のファイルのみ削除対象とする
 */

const ASTRO_PROJECT_DIR = "./kintone-help-astro-poc";
const SAFE_DELETE_PATH =
  "/Users/mugi/ghq/github.com/CybozuDocs/hugo-template/kintone-help-astro-poc/src/pages/ja";
const MAX_ITERATIONS = 50; // 無限ループ防止

interface BuildResult {
  success: boolean;
  errorFiles: string[];
  output: string;
}

async function runBuild(): Promise<BuildResult> {
  console.log("🔨 Astro ビルドを実行中...");

  const command = new Deno.Command("npm", {
    args: ["run", "build", "--", "--verbose"],
    cwd: ASTRO_PROJECT_DIR,
    stdout: "piped",
    stderr: "piped",
  });

  const { code, stdout, stderr } = await command.output();
  const output =
    new TextDecoder().decode(stdout) + new TextDecoder().decode(stderr);

  console.log("ビルド出力:", output);

  if (code === 0 && output.includes("[build] ✓ Completed")) {
    return {
      success: true,
      errorFiles: [],
      output,
    };
  }

  // エラーファイルのパスを抽出
  const errorFiles = extractErrorFiles(output);

  return {
    success: false,
    errorFiles,
    output,
  };
}

function extractErrorFiles(output: string): string[] {
  const files: string[] = [];
  const lines = output.split("\n");

  for (const line of lines) {
    // "file: " で始まる行からファイルパスを抽出
    const fileMatch = line.match(/file:\s+(.+\.mdx?):/);
    if (fileMatch) {
      const filePath = fileMatch[1];
      if (filePath.startsWith(SAFE_DELETE_PATH)) {
        files.push(filePath);
      }
    }

    // "Location:" の次の行からもファイルパスを抽出
    const locationMatch = line.match(/^\s+(.+\.mdx?):\d+:\d+$/);
    if (locationMatch) {
      const filePath = locationMatch[1];
      if (filePath.startsWith(SAFE_DELETE_PATH)) {
        files.push(filePath);
      }
    }

    // Rollup import resolve エラーからファイルパスを抽出
    const rollupMatch = line.match(/from\s+"(.+\.mdx?)"/);
    if (rollupMatch) {
      const filePath = rollupMatch[1];
      if (filePath.startsWith(SAFE_DELETE_PATH)) {
        files.push(filePath);
      }
    }
  }

  // 重複を除去
  return [...new Set(files)];
}

async function deleteFile(filePath: string): Promise<boolean> {
  try {
    // 安全チェック: 指定されたパス配下のファイルかどうか
    if (!filePath.startsWith(SAFE_DELETE_PATH)) {
      console.log(`⚠️  安全のため削除をスキップ: ${filePath}`);
      return false;
    }

    // ファイルが存在するかチェック
    const fileInfo = await Deno.stat(filePath);
    if (!fileInfo.isFile) {
      console.log(`⚠️  ファイルではないため削除をスキップ: ${filePath}`);
      return false;
    }

    await Deno.remove(filePath);
    console.log(`🗑️  削除完了: ${filePath}`);
    return true;
  } catch (error) {
    console.log(`❌ 削除に失敗: ${filePath} - ${error.message}`);
    return false;
  }
}

async function main() {
  console.log("🚀 ビルドエラーファイル削除スクリプトを開始");
  console.log(`📁 安全削除対象パス: ${SAFE_DELETE_PATH}`);
  console.log(`🔄 最大反復回数: ${MAX_ITERATIONS}`);
  console.log("");

  let iteration = 0;
  let totalDeletedFiles = 0;

  while (iteration < MAX_ITERATIONS) {
    iteration++;
    console.log(`\n=== 反復 ${iteration} / ${MAX_ITERATIONS} ===`);

    const result = await runBuild();

    if (result.success) {
      console.log("✅ ビルドが成功しました！");
      console.log(`🎉 合計 ${totalDeletedFiles} 個のファイルを削除しました`);
      break;
    }

    if (result.errorFiles.length === 0) {
      console.log("⚠️  エラーファイルが特定できませんでした");
      console.log("ビルド出力:", result.output);
      break;
    }

    console.log(`📋 エラーファイル数: ${result.errorFiles.length}`);

    let deletedInThisIteration = 0;
    for (const filePath of result.errorFiles) {
      const deleted = await deleteFile(filePath);
      if (deleted) {
        deletedInThisIteration++;
        totalDeletedFiles++;
      }
    }

    if (deletedInThisIteration === 0) {
      console.log("⚠️  削除可能なファイルがありませんでした");
      break;
    }

    console.log(`📊 この反復で削除: ${deletedInThisIteration} 個`);

    // 少し待機してから次の反復へ
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  if (iteration >= MAX_ITERATIONS) {
    console.log("⚠️  最大反復回数に達しました");
    console.log("手動でエラーを確認してください");
  }

  console.log("\n🏁 スクリプト終了");
}

if (import.meta.main) {
  main().catch(console.error);
}
