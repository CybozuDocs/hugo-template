# Hugo → Astro 変換スクリプト作業履歴

## 作業指示

**日時**: 2025-01-01
**指示内容**: kintone-help-astro-poc/migration-scripts/convert_prompt.md に書かれている内容をよく読み、作業を実施してください

## 作業概要

Hugo のコンテンツを、すべて Astro に対応した *.mdx ファイルに変換するスクリプトを作成する作業です。

## 要求仕様の確認

### convert_prompt.md からの主要要求事項

1. **TypeScript で実行可能な形式**
   - tsx で直接実行可能
   - 型安全（any の利用回避、型アサーション極力回避）
   - Class は使わず、type を優先使用

2. **CLI オプション対応**
   - 入力ファイルのディレクトリ、出力先のディレクトリ
   - 変換対象のフィルタリング機能（パスの部分一致）
   - 画像パスのprefix変換機能（例: "/k/" → "/k/kintone/"）

3. **ファイル名変換**
   - `_index.md` → `index.mdx` （アンダースコア除去）

4. **重要事項**
   - 仕様が満たせなくなる可能性がある場合には、必ずユーザーに確認を取る
   - 意思決定を勝手に行わない

5. **変換対象**
   - 変換元: `/Users/mugi/ghq/github.com/CybozuDocs/kintone/content/ja/` 配下の *.md
   - 変換先: `kintone-help-astro-poc/src/pages/ja/` 配下に同一構造で変換

## 事前調査結果

### 1. migration-docs のルール確認 ✅
- rules.md: Astro 開発の永続的ルール
- migrate-rules.md: 移行時の特別ルール
- migrate-memo.md: 移行進捗状況

### 2. Hugo ショートコードと Astro コンポーネント対応関係調査 ✅

#### 主要な変換パターン
- **アドモニション系**: `{{< hint >}}` → `<Hint>` (slot使用)
- **単純置換系**: `{{< kintone >}}` → `<Kintone />` 
- **属性付き系**: `{{< screen src="..." >}}` → `<Screen src="..." />`
- **画像記法**: `![alt](src)` → `<Img src="..." alt="..." />`

#### 対応済みコンポーネント数
- **アドモニション系**: 6個（Hint, Note, Warning, Reference等）
- **単純テキスト置換**: 9個（Kintone, Service, CorpName等）
- **属性必須**: 2個（Screen, Heading）
- **高機能**: 複数（Info, Tile系、ナビゲーション系等）

### 3. 手動移行済みファイル分析 ✅

#### FrontMatter 変換パターン
```yaml
# 追加必須
layout: "@/layouts/PageLayout.astro"  # または SectionLayout.astro

# 既存フィールド保持
title: "..."
weight: 100
aliases: "/ja/id/..."
disabled: ["US", "CN"]
```

#### 画像記法変換
```markdown
<!-- Hugo -->
![スクリーンショット](/k/img-ja/sample.png)

<!-- Astro -->
<Img src="/k/img-ja/sample.png" alt="スクリーンショット" />
```

#### インポート文パターン
```typescript
import Img from "@/components/Img.astro";
import Hint from "@/components/Hint.astro";
// 使用するコンポーネントのみ
```

## 実装プラン策定 ✅

### Phase 1: 基本変換機能（必須）
1. CLI インターフェース実装
2. ファイル操作（ディレクトリ探索、ファイル読み書き）
3. FrontMatter 処理（layout フィールド追加）
4. 画像記法変換（`![](src)` → `<Img>`）

### Phase 2: ショートコード変換（重要）
1. 単純置換型ショートコードの変換
2. コンテンツ包含型の変換 
3. 属性付きショートコードの変換

### Phase 3: 高度な機能（最適化）
1. 見出し変換（`## title {#id}` → `<Heading>`）
2. インポート文の最適化
3. エラーハンドリングの強化

## 実装完了 ✅

ユーザーからの承認を受けて実装を開始し、すべての機能が正常に動作することを確認しました。

### 実装した機能

#### Phase 1: 基本変換機能（完了）
1. **CLI インターフェース** ✅
   - 入力/出力ディレクトリ指定
   - フィルタリング機能（パス部分一致）
   - 画像パス prefix 変換機能
   - ヘルプ表示

2. **ファイル操作機能** ✅
   - 再帰的なディレクトリ探索
   - `_index.md` → `index.mdx` 変換
   - ディレクトリ構造の保持

3. **FrontMatter 処理** ✅
   - YAML パーサー実装
   - layout フィールドの自動追加
   - 配列形式の適切な処理

4. **画像記法変換** ✅
   - `![alt](src)` → `<Img src="..." alt="..." />` 変換
   - title 属性サポート
   - 自動インポート文生成
   - パス prefix 置換機能

#### Phase 2: ショートコード変換（完了）
1. **単純置換型ショートコード** ✅
   - 23個のコンポーネントに対応
   - `{{< kintone >}}` → `<Kintone />` など

2. **コンテンツ包含型** ✅
   - `{{< hint >}}content{{< /hint >}}` → `<Hint>content</Hint>`
   - enabled/disabled2 での属性サポート

3. **属性付きショートコード** ✅
   - screen, heading, info 等の属性変換
   - 地域設定の配列変換

### テスト結果

#### 1. 基本変換テスト
```bash
npx tsx migrate-scripts/convert-content.ts test-content test-output
```
- **結果**: 2ファイル処理、変換率100%
- **確認**: FrontMatter、画像、ショートコードすべて正常変換

#### 2. 画像パス変換テスト
```bash
npx tsx migrate-scripts/convert-content.ts --image-path-from "/k/" --image-path-to "/k/kintone/" test-content test-output
```
- **結果**: パス変換 `/k/img-ja/sample.png` → `/k/kintone/img-ja/sample.png`

#### 3. フィルタリングテスト
```bash
npx tsx migrate-scripts/convert-content.ts -f "sample" test-content test-output-filtered
```
- **結果**: 1ファイルのみ処理（sample.md）

### 作成したファイル

```
kintone-help-astro-poc/migrate-scripts/
├── convert-content.ts          # メインスクリプト（実行可能）
├── types.ts                   # 型定義
├── cli.ts                     # CLI インターフェース
├── file-utils.ts              # ファイル操作関数
├── frontmatter-processor.ts   # FrontMatter処理
├── image-processor.ts         # 画像記法変換
└── shortcode-processor.ts     # ショートコード変換
```

### 技術仕様達成状況

- [x] TypeScript + tsx での実行
- [x] 型安全性（any型回避、適切な型定義）
- [x] Class を使わない設計
- [x] CLI オプション全対応
- [x] `_index.md` → `index.mdx` 変換
- [x] ファイル構造保持
- [x] エラーハンドリング

### 使用方法

```bash
# 基本的な変換
npx tsx migrate-scripts/convert-content.ts <入力ディレクトリ> <出力ディレクトリ>

# フィルタリング付き
npx tsx migrate-scripts/convert-content.ts -f "start/" -i ./content -o ./pages

# 画像パス変換付き
npx tsx migrate-scripts/convert-content.ts \
  --image-path-from "/k/" \
  --image-path-to "/k/kintone/" \
  ./content ./pages

# ヘルプ表示
npx tsx migrate-scripts/convert-content.ts --help
```

## 作業ディレクトリ
- 場所: `kintone-help-astro-poc/migration-docs/0034_content-to-mdx-script/`
- 作成ファイル: `plan.md`, `prompt.md`（このファイル）

## 完了日時
2025-01-01 - Hugo から Astro への変換スクリプト実装完了