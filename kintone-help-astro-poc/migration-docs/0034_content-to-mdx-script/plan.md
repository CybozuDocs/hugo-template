# Hugo to Astro MDX 変換スクリプト実装計画（更新版）

## 概要

Hugo の Markdown コンテンツ（776ファイル、`/Users/mugi/ghq/github.com/CybozuDocs/kintone/content/ja/` 配下）を Astro MDX 形式（`kintone-help-astro-poc/src/pages/ja/` 配下）に自動変換するスクリプトを作成します。

網羅的調査により、22種類の Shortcode（6000回以上使用）と13種類の印刷用 FrontMatter プロパティが発見されました。

## 変換要件

### 1. ディレクトリ構造

- 元：`/Users/mugi/ghq/github.com/CybozuDocs/kintone/content/ja/`（776ファイル）
- 先：`kintone-help-astro-poc/src/pages/ja/`
- ディレクトリ構造は維持
- ファイル拡張子を `.md` → `.mdx` に変更

### 2. FrontMatter の変換

#### 基本プロパティ

```yaml
# Hugo (元)
---
title: "{{< kintone >}}とは？"
weight: 100
aliases: /ja/id/040145
disabled: [US, CN]
description: "アプリやスペースの説明文"
labels: [2, 3]
type: "series"
---
# Astro (変換後)
---
title: "<Kintone />とは？"
weight: 100
aliases: /ja/id/040145
disabled: [US, CN]
description: "アプリやスペースの説明文"
labels: [2, 3]
type: "series"
layout: "@/layouts/PageLayout.astro"
---
```

#### 印刷用プロパティ（13ファイル限定）

```yaml
# 印刷用ページには以下も含まれる
title2: "データの検索"
company: "サイボウズ株式会社"
version: "2025年4月版"
chapter1: ""
chapter2: "章"
index: "目次"
page: "ページ"
issue: "発行日"
issuedate: "2025年4月1日"
update: "更新日"
updatedate: ""
```

#### タイポ修正

- `weght` → `weight`（2件）
- `decription` → `description`（1件）
- `disabled: US` → `disabled: [US]`（1件）

### 3. 必要な import 文の自動追加

使用されているコンポーネントに応じて自動的に import を追加：

```javascript
// 基本コンポーネント
import Kintone from "@/components/Kintone.astro";
import Enabled from "@/components/Enabled.astro";
import Disabled2 from "@/components/Disabled2.astro";
import Heading from "@/components/Heading.astro";
import Reference from "@/components/Reference.astro";
import Img from "@/components/Img.astro";
import Hint from "@/components/Hint.astro";
import Note from "@/components/Note.astro";
import Warning from "@/components/Warning.astro";
import Wovn from "@/components/Wovn.astro";

// 製品名・サービス名コンポーネント
import Slash from "@/components/Slash.astro";
import SlashUi from "@/components/SlashUi.astro";
import CybozuCom from "@/components/CybozuCom.astro";
import Store from "@/components/Store.astro";
import Service from "@/components/Service.astro";
import CorpName from "@/components/CorpName.astro";

// 装飾コンポーネント
import Graynote from "@/components/Graynote.astro";
import Subtitle from "@/components/Subtitle.astro";
import Listsummary from "@/components/Listsummary.astro";

// 外部リンクコンポーネント
import DevnetTop from "@/components/DevnetTop.astro";
import DevnetName from "@/components/DevnetName.astro";
import SlashHelp from "@/components/SlashHelp.astro";
import SlashAdministrators from "@/components/SlashAdministrators.astro";
```

### 4. 網羅的 Shortcode 変換パターン

#### 高頻度 Shortcode（100回以上）

| Hugo Shortcode                               | 使用回数 | Astro Component                             |
| -------------------------------------------- | -------- | ------------------------------------------- |
| `{{< kintone >}}`                            | 1,888回  | `<Kintone />`                               |
| `{{< wv_brk >}}...{{< /wv_brk >}}`           | 1,112回  | `<Wovn>...</Wovn>`                          |
| `{{< note >}}...{{< /note >}}`               | 676回    | `<Note>...</Note>`                          |
| `{{< enabled2 JP >}}...{{< /enabled2 >}}`    | 146回    | `<Enabled for="JP">...</Enabled>`           |
| `{{< enabled2 US >}}...{{< /enabled2 >}}`    | 96回     | `<Enabled for="US">...</Enabled>`           |
| `{{< enabled2 US CN >}}...{{< /enabled2 >}}` | 14回     | `<Enabled for={["US", "CN"]}>...</Enabled>` |
| `{{< reference >}}...{{< /reference >}}`     | 307回    | `<Reference>...</Reference>`                |
| `{{< slash >}}`                              | 207回    | `<Slash />`                                 |
| `{{< slash_ui >}}`                           | 177回    | `<SlashUi />`                               |
| `{{< hint >}}...{{< /hint >}}`               | 156回    | `<Hint>...</Hint>`                          |

#### 中低頻度 Shortcode（50回未満）

| Hugo Shortcode                               | 使用回数 | Astro Component                               |
| -------------------------------------------- | -------- | --------------------------------------------- |
| `{{< warning >}}...{{< /warning >}}`         | 84回     | `<Warning>...</Warning>`                      |
| `{{< cybozu_com >}}`                         | 41回     | `<CybozuCom />`                               |
| `{{< graynote >}}...{{< /graynote >}}`       | 38回     | `<Graynote>...</Graynote>`                    |
| `{{< subtitle >}}...{{< /subtitle >}}`       | 21回     | `<Subtitle>...</Subtitle>`                    |
| `{{< store >}}`                              | 20回     | `<Store />`                                   |
| `{{< service >}}`                            | 18回     | `<Service />`                                 |
| `{{< listsummary >}}...{{< /listsummary >}}` | 16回     | `<Listsummary>...</Listsummary>`              |
| `{{< disabled2 US >}}...{{< /disabled2 >}}`  | 14回     | `<Disabled2 regions={["US"]}>...</Disabled2>` |
| `{{< slash_help >}}`                         | 11回     | `<SlashHelp />`                               |
| `{{< devnet_top >}}`                         | 5回      | `<DevnetTop />`                               |
| `{{< slash_administrators >}}`               | 5回      | `<SlashAdministrators />`                     |
| `{{< devnet_name >}}`                        | 2回      | `<DevnetName />`                              |
| `{{< CorpName >}}`                           | 1回      | `<CorpName />`                                |

#### 特殊パターン

- `{{% kintone %}}` → `<Kintone />`（誤記の修正）
- 地域別表示制御：`enabled2`、`disabled2` に `JP US CN` の組み合わせ対応

### 5. 画像パスの変換

```markdown
# Hugo

![alt](/k/img-ja/example.png)

# Astro（リスト内の場合、適切なインデント）

1. テキスト
   <Img src="/k/kintone/img-ja/example.png" alt="alt" />
```

### 6. 見出しの変換

```markdown
# Hugo

## 見出し{#id}

### 見出し{#id}

# Astro

<Heading id="id">見出し</Heading>
<Heading level={3} id="id">見出し</Heading>
```

### 7. 特殊ケースの処理

- リスト内での画像：番号付きリストは3スペース、箇条書きは2スペースでインデント
- 複数の shortcode が入れ子になっている場合の正しい処理
- title 属性付き画像の変換
- FrontMatter のタイポ修正
- 印刷用プロパティの保持

## 実装計画（更新版）

### Phase 1: 基本構造とファイル処理

1. **コマンドライン引数解析**（commander.js）
2. **対象ファイル絞り込み**（glob パターンマッチング）
3. ファイルの読み込みと書き込み処理
4. ディレクトリ構造の維持とファイル拡張子変更（`.md` → `.mdx`）
5. FrontMatter の解析と変換（gray-matter 使用）
6. 印刷用プロパティの特別処理（13ファイル限定）
7. タイポ修正（`weght` → `weight`、`decription` → `description`）

### Phase 2: 高頻度 Shortcode 変換の実装（優先度高）

1. `{{< kintone >}}`（1,888回）→ `<Kintone />`
2. `{{< wv_brk >}}...{{< /wv_brk >}}`（1,112回）→ `<Wovn>...</Wovn>`
3. `{{< note >}}...{{< /note >}}`（676回）→ `<Note>...</Note>`
4. `{{< enabled2 [地域] >}}...{{< /enabled2 >}}`（332回）→ `<Enabled for="[地域]">...</Enabled>`
5. `{{< reference >}}...{{< /reference >}}`（307回）→ `<Reference>...</Reference>`

### Phase 3: 中低頻度 Shortcode 変換の実装

1. 製品名・サービス名系（`slash`、`slash_ui`、`cybozu_com`、`store`、`service`）
2. コンテンツ装飾系（`warning`、`hint`、`graynote`、`subtitle`、`listsummary`）
3. 地域別非表示制御（`disabled2`）
4. 外部リンク系（`devnet_top`、`devnet_name`、`slash_help`、`slash_administrators`）
5. 特殊パターン（`CorpName`、`{{% kintone %}}` 誤記修正）

### Phase 4: Markdown 記法の変換

1. 画像記法の変換（Markdown → `<Img>` コンポーネント）
2. 見出し記法の変換（`## 見出し{#id}` → `<Heading>` コンポーネント）
3. リスト内画像のインデント調整

### Phase 5: Import 文の自動生成

1. 使用されているコンポーネントの検出（22種類対応）
2. 必要な import 文の生成と挿入
3. 未使用 import の削除

### Phase 6: エッジケースとエラーハンドリング

1. 入れ子構造の正確な処理
2. 地域別表示制御の複雑なパターン（`JP US CN` 組み合わせ）
3. title 属性付き画像の変換
4. バリデーションとエラーレポート

### Phase 7: バッチ処理と品質保証

1. 776ファイルの一括処理
2. 変換結果の詳細レポート生成
3. 変換失敗ファイルの詳細ログ
4. 統計情報（変換率、各 Shortcode の処理状況）

## スクリプト仕様

### コマンドライン引数

```bash
# 基本使用法
node convert-hugo-to-astro.js [options]

# 使用例
node convert-hugo-to-astro.js --target admin/app_admin
node convert-hugo-to-astro.js --target admin --exclude "*/log/*"
node convert-hugo-to-astro.js --files "start/whatskintone.md,start/app_create/index.md"
node convert-hugo-to-astro.js --dry-run --verbose
```

### オプション仕様

#### 対象絞り込みオプション

| オプション            | 説明                                 | 例                                      |
| --------------------- | ------------------------------------ | --------------------------------------- |
| `--target <path>`     | 特定ディレクトリのみ変換             | `admin/app_admin`                       |
| `--files <files>`     | 特定ファイルのみ変換（カンマ区切り） | `start/whatskintone.md,admin/_index.md` |
| `--exclude <pattern>` | 除外パターン（glob形式）             | `"*/log/*"`, `"*/_index.md"`            |
| `--include <pattern>` | 包含パターン（glob形式）             | `"*/admin/*"`                           |
| `--depth <number>`    | ディレクトリ探索の深さ制限           | `2` (最大2階層まで)                     |

#### 実行制御オプション

| オプション            | 説明                                     | 用途                |
| --------------------- | ---------------------------------------- | ------------------- |
| `--dry-run`           | 実際の変換は行わず、対象ファイルのみ表示 | 事前確認            |
| `--verbose`           | 詳細ログ出力                             | デバッグ            |
| `--force`             | 既存ファイルを強制上書き                 | 再実行時            |
| `--backup`            | 変換前にバックアップ作成                 | 安全性確保          |
| `--parallel <number>` | 並列処理数指定                           | `4` (4ファイル並列) |

#### 変換制御オプション

| オプション           | 説明                    | 用途                |
| -------------------- | ----------------------- | ------------------- |
| `--skip-shortcodes`  | Shortcode変換をスキップ | FrontMatterのみ変換 |
| `--skip-images`      | 画像変換をスキップ      | Shortcodeのみ変換   |
| `--skip-headings`    | 見出し変換をスキップ    | 部分変換            |
| `--only-frontmatter` | FrontMatterのみ変換     | 段階的移行          |

### 使用例詳細

#### 1. 特定ディレクトリの段階的変換

```bash
# admin 配下のみ変換
node convert-hugo-to-astro.js --target admin

# admin/app_admin 配下のみ変換
node convert-hugo-to-astro.js --target admin/app_admin

# start 配下、ただし app_create は除外
node convert-hugo-to-astro.js --target start --exclude "*/app_create/*"
```

#### 2. 特定ファイルのテスト変換

```bash
# 手動変換済みファイルで動作確認
node convert-hugo-to-astro.js --files "start/whatskintone.md" --dry-run

# 複数ファイルを指定
node convert-hugo-to-astro.js --files "start/whatskintone.md,start/app_create/index.md"
```

#### 3. 安全な実行

```bash
# 事前確認（何が変換されるかチェック）
node convert-hugo-to-astro.js --target admin --dry-run --verbose

# バックアップ付きで実行
node convert-hugo-to-astro.js --target admin --backup

# 既存ファイルがある場合も強制実行
node convert-hugo-to-astro.js --target admin --force
```

#### 4. 段階的変換

```bash
# Phase 1: FrontMatterのみ変換
node convert-hugo-to-astro.js --target admin --only-frontmatter

# Phase 2: 高頻度Shortcodeを追加
node convert-hugo-to-astro.js --target admin --skip-images --skip-headings

# Phase 3: 完全変換
node convert-hugo-to-astro.js --target admin
```

### 出力レポート

```bash
# 実行結果例
Hugo to Astro MDX Converter
===========================

Target: /content/ja/admin/app_admin
Files found: 12 files
Excluded: 0 files

Processing...
✓ admin/app_admin/_index.md → admin/app_admin/_index.mdx
✓ admin/app_admin/confirm_app_license.md → admin/app_admin/confirm_app_license.mdx
✗ admin/app_admin/complex_file.md (Error: Complex shortcode nesting)

Summary:
- Total files: 12
- Successfully converted: 11 (91.7%)
- Failed: 1 (8.3%)
- Shortcodes converted: 156/160 (97.5%)
- Processing time: 2.3 seconds

Failed files saved to: conversion-errors.log
```

## 技術的実装詳細

### 使用する技術スタック

- **Node.js**: ES2022 モジュール
- **commander.js**: コマンドライン引数解析
- **gray-matter**: FrontMatter 解析（YAML対応）
- **glob**: ファイルパターンマッチング
- **正規表現エンジン**: 複雑な Shortcode パターンマッチング
- **fs/promises**: 非同期ファイル操作（大量ファイル対応）
- **path**: ディレクトリ構造の正確な再現

### 変換ロジックの設計

1. **優先順位付き変換**: 高頻度→低頻度の順で処理
2. **状態管理**: 変換済み Shortcode の追跡
3. **インデント保持**: リスト内要素の適切な配置
4. **エスケープ処理**: 特殊文字の適切な処理

### エラーハンドリング

- **段階的処理**: 個別ファイルエラーでも続行
- **詳細ログ**: ファイル名、行番号、エラー内容
- **統計情報**: 成功率、各変換パターンの処理状況
- **ロールバック機能**: 変換失敗時の原因調査用

## 品質保証とテスト

### テスト計画

1. **単体テスト**: 各 Shortcode 変換パターンの個別検証
2. **統合テスト**: 複数 Shortcode 組み合わせの動作確認
3. **リグレッションテスト**: 手動変換済みサンプルとの比較
4. **パフォーマンステスト**: 776ファイル一括処理の性能評価

### 品質チェック項目

- [ ] 全 22種類の Shortcode が正しく変換される
- [ ] FrontMatter プロパティの完全性（タイポ修正含む）
- [ ] Import 文の適切な生成（重複なし）
- [ ] ディレクトリ構造の正確な再現
- [ ] 変換後の Astro ビルドエラー無し

## 予想される課題と対策

### 技術的課題

1. **複雑な入れ子構造**: パーサーの状態管理で対応
2. **地域別制御の複雑性**: 設定パターンのマッピング表作成
3. **大量ファイル処理**: 並列処理とメモリ最適化
4. **文字エンコーディング**: UTF-8 統一とBOM対応

### 運用上の課題

1. **変換精度の保証**: サンプルファイルとの詳細比較
2. **パフォーマンス**: 処理時間の許容範囲設定
3. **エラー処理**: 失敗原因の特定と修正指針

## 成功基準

### 定量的基準

- [ ] 変換成功率: 95%以上（736ファイル以上）
- [ ] Shortcode 変換精度: 99%以上（5,940回以上）
- [ ] 処理時間: 10分以内（776ファイル）
- [ ] メモリ使用量: 2GB以内

### 定性的基準

- [ ] Astro プロジェクトでビルドエラー無し
- [ ] 表示結果が Hugo 版と視覚的に同等
- [ ] 手動変換済みサンプルと完全一致
- [ ] 移行ルールドキュメントとの整合性
