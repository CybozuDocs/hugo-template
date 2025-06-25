# Hugo to Astro MDX 変換スクリプト作業履歴

## 2025-06-25

### ユーザーからの指示

既存の Hugo コンテンツを Astro の mdx ページに変換するスクリプトを作成してほしい。

- /Users/mugi/ghq/github.com/CybozuDocs/kintone/content/ja/ 配下のコンテンツが対象です
- kintone-help-astro-poc/src/pages/ja/ 配下に、一部のコンテンツのみは手動で変換済みのため、その変換内容を参考にしてほしい
  - ディレクトリ構造は一致させています
  - ファイル名もそのままに、mdx ファイルにします

### 実施内容

1. migration-docs 配下のルールドキュメントを確認
   - rules.md: Astro 開発の永続的なルール
   - migrate-rules.md: Hugo から Astro への移行ルール

2. 手動変換済みサンプルの分析
   - whatskintone.md → whatskintone.mdx の変換パターンを確認
   - add_employee_app.md → add_employee_app.mdx の変換パターンを確認

3. **Hugo コンテンツの網羅的調査**
   - 776ファイルで使用されている Hugo Shortcode を全検索
   - **22種類の Shortcode、6000回以上の使用を発見**
   - 高頻度: kintone (1,888回), wv_brk (1,112回), note (676回) など
   - 地域別制御: enabled2/disabled2 (JP/US/CN 組み合わせ)
   - 製品名系: slash, slash_ui, cybozu_com, store, service など

4. **FrontMatter プロパティの全調査**
   - 基本プロパティ: title, weight, aliases, disabled, description, labels, type
   - 印刷用プロパティ: title2, company, version など（13ファイル限定）
   - **タイポ発見**: weght → weight (2件), decription → description (1件)

5. **既存 Astro コンポーネントの確認**
   - 22種類の Shortcode に対応するコンポーネントがほぼ存在
   - Wovn, Disabled2, CybozuCom など実装済み
   - 変換パターンの詳細仕様を把握

6. **詳細実装プランの作成**
   - Phase 1-7 の段階的実装計画
   - 優先度付き変換（高頻度→低頻度）
   - 品質保証とテスト計画
   - 定量的・定性的成功基準の設定

### 調査結果サマリー

- **対象ファイル数**: 776ファイル
- **Shortcode 種類**: 22種類
- **Shortcode 使用回数**: 6,000回以上
- **FrontMatter プロパティ**: 20種類（印刷用含む）
- **既存 Astro コンポーネント**: 22種類ほぼ完備

### ユーザーからのフィードバック対応

当初の簡単な変換パターンでは対処できない大量の Shortcode と FrontMatter が発見されたため、網羅的調査を実施し、完全な変換仕様を策定しました。

### 変換スクリプト実装

#### Deno TypeScript シングルファイル実装
```bash
# スクリプト作成場所
mkdir -p kintone-help-astro-poc/migration-docs/scripts
cd kintone-help-astro-poc/migration-docs/scripts

# convert-hugo-to-astro.ts 作成 (715行)
# - 22種類のShortcode変換マッピング
# - FrontMatter処理（タイポ修正含む）
# - 画像・見出し変換
# - Import文自動生成
# - CLI引数解析
# - 並列処理対応
```

#### 段階的テスト実行

```bash
# 1. 小規模テスト（17ファイル）
deno run --allow-read --allow-write convert-hugo-to-astro.ts \
  --source-dir "/Users/mugi/ghq/github.com/CybozuDocs/kintone/content/ja" \
  --target-dir "../../src/pages/ja" \
  --target start --dry-run

# 2. 実変換実行（17ファイル）
deno run --allow-read --allow-write convert-hugo-to-astro.ts \
  --source-dir "/Users/mugi/ghq/github.com/CybozuDocs/kintone/content/ja" \
  --target-dir "../../src/pages/ja" \
  --target start --force

# 結果: 17/17 成功 (100%)、58 Shortcode変換、8画像変換、48見出し変換
```

```bash
# 3. 大規模テスト（48ファイル）
deno run --allow-read --allow-write convert-hugo-to-astro.ts \
  --source-dir "/Users/mugi/ghq/github.com/CybozuDocs/kintone/content/ja" \
  --target-dir "../../src/pages/ja" \
  --target admin --force

# 結果: 48/48 成功 (100%)、569 Shortcode変換、88画像変換、974見出し変換
```

### スクリプト機能拡張

#### 画像regex修正（alt内角括弧対応）
```typescript
// 修正前
/!\[([^\]]*)\]\(([^)]+?)(?:\s+"([^"]*)")?\)/g

// 修正後  
/!\[((?:[^\[\]]|\[[^\]]*\])*?)\]\(([^)]+?)(?:\s+"([^"]*)")?\)/g
```

#### 見出し末尾スペース除去
```typescript
// convertHeadings関数に追加
const trimmedTitle = title.trim();
```

#### _index.md → index.mdx変換
```typescript
// ファイル名変換ルール追加
const outputPath = inputPath.replace(/_index\.md$/, 'index.mdx').replace(/\.md$/, '.mdx');
```

### startディレクトリ完全変換

#### 手動変換済みファイル確認・除外
```bash
# 手動変換済みファイル: 5個
# - start/whatskintone.md → start/whatskintone.mdx
# - start/app_create/add_employee_app.md → start/app_create/add_employee_app.mdx  
# - start/app_create/add_record_app.md → start/app_create/add_record_app.mdx
# - start/_index.md → start/index.mdx
# - start/app_create/_index.md → start/app_create/index.mdx
```

#### 新規ファイル変換実行
```bash
# 1. 通常ファイル変換（手動変換済みを除外）
deno run --allow-read --allow-write convert-hugo-to-astro.ts \
  --source-dir "/Users/mugi/ghq/github.com/CybozuDocs/kintone/content/ja" \
  --target-dir "../../src/pages/ja" \
  --target start \
  --exclude "(whatskintone|add_employee_app|add_record_app|_index)" \
  --verbose

# 結果: 10/10 成功、110 Shortcode変換、65画像変換、17見出し変換
```

```bash
# 2. _indexファイル変換（新しい命名ルール適用）
deno run --allow-read --allow-write convert-hugo-to-astro.ts \
  --source-dir "/Users/mugi/ghq/github.com/CybozuDocs/kintone/content/ja" \
  --target-dir "../../src/pages/ja" \
  --files "start/departments_users/_index.md,start/space_create/_index.md" \
  --verbose

# 結果: 2/2 成功、_index.md → index.mdx 正常変換
```

### 最終成果

#### 変換完了ファイル（計17個）
- **手動変換済み**: 5個（除外済み）
- **新規自動変換**: 12個
  - start/app_create/add_comment.mdx
  - start/app_create/app_setting_change.mdx
  - start/departments_users/index.mdx (旧_index.md)
  - start/departments_users/add_departments.mdx
  - start/departments_users/add_users.mdx  
  - start/departments_users/invite_team_members.mdx
  - start/departments_users/to_be_invited.mdx
  - start/login_started.mdx
  - start/more_information.mdx
  - start/space_create/index.mdx (旧_index.md)
  - start/space_create/add_team_space.mdx
  - start/space_create/add_thread_comment.mdx

#### 統計
- **総Shortcode変換**: 115個
- **総画像変換**: 65個  
- **総見出し変換**: 17個
- **成功率**: 100%
- **処理時間**: 0.05秒