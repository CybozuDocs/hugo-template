# Hugo to Astro MDX 変換スクリプト

Hugo の Markdown コンテンツを Astro MDX 形式に変換するスクリプトです。

## 特徴

- **22種類の Shortcode** を Astro コンポーネントに変換
- **20種類の FrontMatter プロパティ** を適切に処理
- **画像記法**と**見出し記法**の自動変換（末尾スペース除去）
- **ファイル名変換**（`_index.md` → `index.mdx`）
- **Import 文**の自動生成
- **段階的変換**機能（特定ディレクトリ、特定ファイルのみ変換）
- **並列処理**による高速変換
- **Dry-run モード**で事前確認可能

## 必要環境

- [Deno](https://deno.land/) 1.x 以上

## 使用方法

### 基本使用法

```bash
deno run --allow-read --allow-write convert-hugo-to-astro.ts \
  --source-dir "/path/to/hugo/content/ja" \
  --target-dir "/path/to/astro/src/pages/ja"
```

### オプション

#### 必須オプション

- `--source-dir <path>`: Hugo コンテンツのソースディレクトリ
- `--target-dir <path>`: Astro MDX の出力ディレクトリ

#### 対象絞り込みオプション

- `--target <path>`: 特定ディレクトリのみ変換
- `--files <files>`: 特定ファイルのみ変換（カンマ区切り）
- `--exclude <pattern>`: 除外パターン（glob形式）
- `--include <pattern>`: 包含パターン（glob形式）
- `--depth <number>`: ディレクトリ探索の深さ制限

#### 実行制御オプション

- `--dry-run`: 実際の変換は行わず、対象ファイルのみ表示
- `--verbose`: 詳細ログ出力
- `--force`: 既存ファイルを強制上書き
- `--backup`: 変換前にバックアップ作成
- `--parallel <number>`: 並列処理数指定（デフォルト: 4）

#### 変換制御オプション

- `--skip-shortcodes`: Shortcode変換をスキップ
- `--skip-images`: 画像変換をスキップ
- `--skip-headings`: 見出し変換をスキップ
- `--only-frontmatter`: FrontMatterのみ変換

## 使用例

### 1. 段階的変換（推奨ワークフロー）

```bash
# 1. 特定ディレクトリで事前確認
deno run --allow-read --allow-write convert-hugo-to-astro.ts \
  --source-dir "./content/ja" \
  --target-dir "./src/pages/ja" \
  --target start --dry-run

# 2. FrontMatterのみテスト変換
deno run --allow-read --allow-write convert-hugo-to-astro.ts \
  --source-dir "./content/ja" \
  --target-dir "./src/pages/ja" \
  --target start --only-frontmatter --backup

# 3. 段階的に機能追加
deno run --allow-read --allow-write convert-hugo-to-astro.ts \
  --source-dir "./content/ja" \
  --target-dir "./src/pages/ja" \
  --target start --skip-images

# 4. 完全変換
deno run --allow-read --allow-write convert-hugo-to-astro.ts \
  --source-dir "./content/ja" \
  --target-dir "./src/pages/ja" \
  --target start
```

### 2. 特定ファイルのテスト

```bash
# 手動変換済みファイルで動作確認
deno run --allow-read --allow-write convert-hugo-to-astro.ts \
  --source-dir "./content/ja" \
  --target-dir "./src/pages/ja" \
  --files "start/whatskintone.md" --dry-run --verbose
```

### 3. 除外パターンの使用

```bash
# ログディレクトリを除外
deno run --allow-read --allow-write convert-hugo-to-astro.ts \
  --source-dir "./content/ja" \
  --target-dir "./src/pages/ja" \
  --target admin --exclude "*/log/*"
```

### 4. 大量ファイルの並列処理

```bash
# 8並列で高速処理
deno run --allow-read --allow-write convert-hugo-to-astro.ts \
  --source-dir "./content/ja" \
  --target-dir "./src/pages/ja" \
  --parallel 8 --force
```

## 変換内容

### Shortcode 変換

| Hugo Shortcode | Astro Component | 使用頻度 |
|----------------|-----------------|----------|
| `{{< kintone >}}` | `<Kintone />` | 1,888回 |
| `{{< wv_brk >}}...{{< /wv_brk >}}` | `<Wovn>...</Wovn>` | 1,112回 |
| `{{< note >}}...{{< /note >}}` | `<Note>...</Note>` | 676回 |
| `{{< enabled2 JP >}}...{{< /enabled2 >}}` | `<Enabled for="JP">...</Enabled>` | 332回 |
| `{{< reference >}}...{{< /reference >}}` | `<Reference>...</Reference>` | 307回 |
| `{{< slash >}}` | `<Slash />` | 207回 |
| `{{< slash_ui >}}` | `<SlashUi />` | 177回 |
| `{{< hint >}}...{{< /hint >}}` | `<Hint>...</Hint>` | 156回 |
| `{{< warning >}}...{{< /warning >}}` | `<Warning>...</Warning>` | 84回 |
| その他13種類 | 対応するコンポーネント | - |

### FrontMatter 変換

```yaml
# 変換前（Hugo）
---
title: "{{< kintone >}}とは？"
weight: 100
aliases: /ja/id/040145
disabled: [US,CN]
weght: 200  # タイポ修正
---

# 変換後（Astro）
---
title: "<Kintone />とは？"
weight: 100
aliases: /ja/id/040145
disabled: [US,CN]
weight: 200
layout: "@/layouts/PageLayout.astro"
---
```

### 画像・見出し・ファイル名変換

```markdown
# 画像変換
![スクリーンショット](/k/img-ja/example.png)
↓
<Img src="/k/kintone/img-ja/example.png" alt="スクリーンショット" />

# 見出し変換（末尾スペース自動除去）
## 見出し {#heading-id}
↓
<Heading id="heading-id">見出し</Heading>

# ファイル名変換
_index.md → index.mdx
example.md → example.mdx
```

### 自動 Import 生成

```typescript
import Kintone from "@/components/Kintone.astro";
import Note from "@/components/Note.astro";
import Img from "@/components/Img.astro";
import Heading from "@/components/Heading.astro";
```

## 出力レポート

### 小規模テスト例（17ファイル）
```
Hugo to Astro MDX Converter
===========================

Source: /Users/mugi/ghq/github.com/CybozuDocs/kintone/content/ja
Target: kintone-help-astro-poc/src/pages/ja

対象ファイル: 17個

🔄 変換を開始します...

✅ start/whatskintone.md → start/whatskintone.mdx
✅ start/add_employee_app.md → start/add_employee_app.mdx
✅ start/add_employee_phone.md → start/add_employee_phone.mdx

📊 変換結果:
- 総ファイル数: 17
- 成功: 17 (100.0%)
- 失敗: 0 (0.0%)
- Shortcode変換: 58回
- 画像変換: 8回
- 見出し変換: 48回
- 処理時間: 0.10秒
```

### 大規模テスト例（48ファイル）
```
Hugo to Astro MDX Converter
===========================

Source: /Users/mugi/ghq/github.com/CybozuDocs/kintone/content/ja
Target: kintone-help-astro-poc/src/pages/ja

対象ファイル: 48個

🔄 変換を開始します...

✅ admin/_index.md → admin/_index.mdx
✅ admin/sys_admin/_index.md → admin/sys_admin/_index.mdx
✅ admin/sys_admin/confirm_sys_admin.md → admin/sys_admin/confirm_sys_admin.mdx

📊 変換結果:
- 総ファイル数: 48
- 成功: 48 (100.0%)
- 失敗: 0 (0.0%)
- Shortcode変換: 569回
- 画像変換: 88回
- 見出し変換: 974回
- 処理時間: 0.13秒
```

## トラブルシューティング

### よくあるエラー

1. **ディレクトリが見つからない**
   ```
   ❌ ソースディレクトリが見つかりません: ./content/ja
   ```
   → パスが正しいか確認してください

2. **ファイルが既に存在する**
   ```
   ❌ ファイルが既に存在します（--force で強制上書き）
   ```
   → `--force` オプションを使用するか、`--backup` でバックアップしてください

3. **権限エラー**
   ```
   Permission denied
   ```
   → `--allow-read --allow-write` が指定されているか確認してください

### デバッグ

詳細なログを出力するには `--verbose` オプションを使用：

```bash
deno run --allow-read --allow-write convert-hugo-to-astro.ts \
  --source-dir "./content/ja" \
  --target-dir "./src/pages/ja" \
  --target start --verbose
```

## 開発者向け情報

### アーキテクチャ

- **シングルファイル構成**: すべての機能を1つのTSファイルに集約
- **Deno標準ライブラリ**: 外部依存なしでポータブル
- **型安全**: TypeScriptによる厳密な型チェック
- **非同期処理**: 大量ファイルの効率的な並列処理

### 拡張方法

新しいShortcodeを追加する場合、`SHORTCODE_MAPPINGS` に追加：

```typescript
const SHORTCODE_MAPPINGS = {
  // 既存のマッピング...
  "new_shortcode": { 
    component: "NewComponent", 
    selfClosing: true, 
    count: 0 
  },
};
```

### 最新のアップデート

- **v1.1** (2024): 見出し変換で末尾スペース自動除去
- **v1.1** (2024): `_index.md` → `index.mdx` ファイル名変換対応
- **v1.0** (2024): 初回リリース - 22種類Shortcode対応