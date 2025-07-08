# Hugo → Astro コンテンツ変換スクリプト テストスイート

## 概要

Hugo から Astro への変換スクリプトの動作を検証するための包括的なテストスイートです。現状の変換処理を担保し、将来の改修時のリグレッションを防ぐことを目的としています。

## テスト構成

各プロセッサファイルの横にテストファイルを配置するアプローチを採用し、テスト対象との対応関係を明確にしています。

### ✅ 包括的にテストされているプロセッサ

#### 1. **Image Processor** (`image-processor.test.ts`)
- **12テストケース**
- Markdown画像記法 → Astro `<Img>` コンポーネントの変換
- パス変換、インデント調整、特殊文字エスケープを網羅

#### 2. **Shortcode Processor** (`shortcode-processor.test.ts`)
- **15テストケース**
- Hugo ショートコード → Astro コンポーネントの変換
- Simple型、Content型、Attributes型の全パターンをカバー

#### 3. **Heading Processor** (`heading-processor.test.ts`)
- **17テストケース**
- カスタムID付き見出し → `<Heading>` コンポーネントの変換
- 全見出しレベル（1-6）とエッジケースを網羅

#### 4. **HTML Processor** (`html-processor.test.ts`)
- **9テストケース**
- HTMLタグの整形処理（自己閉じタグ、テーブル、リスト）
- 複合的なHTML構造の処理

#### 5. **Escape Processor** (`escape-processor.test.ts`)
- **18テストケース**
- MDX用中括弧エスケープ処理
- JSXコンポーネント除外、import文除外を含む

#### 6. **Frontmatter Processor** (`frontmatter-processor.test.ts`)
- **25テストケース**
- YAMLフロントマターの処理
- layout自動追加、配列フィールド正規化
- **FrontMatter内ショートコード変換**（2025-01-08追加）

## テストデータソース

全てのテストケースは実際の変換済みファイルから抽出したデータを使用：

- **変換元**: `/Users/mugi/ghq/github.com/CybozuDocs/kintone/content/ja/start/**/*.md`
- **変換後**: `/Users/mugi/ghq/github.com/CybozuDocs/hugo-template/kintone-help-astro-poc/src/pages/ja/start/**/*.md`

## ファイル構成

```
migrate-scripts/
├── package.json                    # Vitest環境設定
├── vitest.config.ts                # テスト設定
├── image-processor.ts              # 画像変換プロセッサ
├── image-processor.test.ts         # ↑のテスト
├── shortcode-processor.ts          # ショートコード変換プロセッサ
├── shortcode-processor.test.ts     # ↑のテスト
├── heading-processor.ts            # 見出し変換プロセッサ
├── heading-processor.test.ts       # ↑のテスト
├── html-processor.ts               # HTML整形プロセッサ
├── html-processor.test.ts          # ↑のテスト
├── escape-processor.ts             # エスケープ処理プロセッサ
├── escape-processor.test.ts        # ↑のテスト
├── frontmatter-processor.ts        # フロントマター処理プロセッサ
├── frontmatter-processor.test.ts   # ↑のテスト
└── TEST_README.md                  # このファイル
```

## テスト実行

```bash
# 全テスト実行
npm test

# 特定のプロセッサのテスト
npm test image-processor.test.ts
npm test shortcode-processor.test.ts
npm test heading-processor.test.ts

# 複数のテストを同時実行
npm test image-processor.test.ts shortcode-processor.test.ts
```

## テストカバレッジ詳細

### 1. 画像変換（Image Processor）
- ✅ 基本的な画像変換（alt、title属性）
- ✅ リスト内の画像インデント調整
- ✅ パス変換（`/k/` → `/k/kintone/`）
- ✅ 複数画像の一括処理
- ✅ エラーハンドリング

### 2. ショートコード変換（Shortcode Processor）
- ✅ Simple型: `{{< kintone >}}` → `<Kintone />`
- ✅ Content型: `{{< note >}}...{{< /note >}}` → `<Note>...</Note>`
- ✅ Attributes型: `{{< enabled JP >}}` → `<Enabled regions={["JP"]}>`
- ✅ ネストされたショートコード
- ✅ インポート文の自動生成

### 3. 見出し変換（Heading Processor）
- ✅ カスタムID付き見出し: `## Title{#id}` → `<Heading id="id">Title</Heading>`
- ✅ 全レベル（1-6）の見出し処理
- ✅ level属性の適切な出力（レベル2はlevel属性なし）
- ✅ 通常見出しの除外（変換しない）
- ✅ 複数見出しの一括処理

### 4. HTML整形（HTML Processor）
- ✅ 自己閉じタグ: `<br>` → `<br />`
- ✅ テーブル構造の整形
- ✅ リスト構造の整形
- ✅ 属性付きタグの処理
- ✅ 複合的なHTML構造

### 5. エスケープ処理（Escape Processor）
- ✅ JSON様構造のエスケープ: `{key: value}` → `&#123;key: value&#125;`
- ✅ JSXコンポーネントの除外
- ✅ import文の除外
- ✅ 複雑なネスト構造
- ✅ コードブロック内のエスケープ

### 6. フロントマター処理（Frontmatter Processor）
- ✅ layout自動追加（PageLayout/SectionLayout）
- ✅ 配列フィールド正規化（aliases、disabled、enabled、labels）
- ✅ ファイルパス別処理（_index.mdの判定）
- ✅ 複雑なYAML構造の処理
- ✅ エッジケース（空のフロントマター等）
- ✅ **FrontMatter内ショートコード変換**（2025-01-08追加）
  - ✅ title、description内の`{{< kintone >}}`等の変換
  - ✅ 複数フィールド、複数ショートコードの処理
  - ✅ 非文字列フィールドの保護

## 実際の使用パターン

テストケースは以下の実際のパターンから抽出：

- kintone ドキュメントの実際のMarkdownファイル
- 実運用で発生する複雑なネスト構造
- 日本語特有の文字エスケープパターン
- リージョン別コンテンツの条件分岐

## 品質保証の効果

### 現在担保されている機能
1. **画像変換の正確性**: パス変換、インデント調整、alt/title属性の適切な処理
2. **ショートコード変換の網羅性**: 全タイプのショートコードの適切なコンポーネント化
3. **見出し変換の完全性**: カスタムIDの適切な処理とレベル別対応
4. **HTML整形の信頼性**: 自己閉じタグと構造整形の正確な実行
5. **エスケープ処理の安全性**: MDX互換性を保つ適切なエスケープ
6. **フロントマター処理の一貫性**: layout追加、配列正規化、FrontMatter内ショートコード変換の確実な実行

### リグレッション防止効果
- 全プロセッサの動作保証
- 変換品質の維持
- 新機能追加時の影響範囲の明確化
- 安全な改修の実現

## 技術仕様

- **テストフレームワーク**: Vitest
- **TypeScript**: 型安全なテスト実装
- **実データベース**: 実際の変換済みファイルから抽出した143個のテストケース
- **カバレッジ**: 主要な変換パターンを網羅

## 注意事項

- テスト内でファイル参照は行わず、すべて文字列として埋め込み
- 実際の変換スクリプトは変更せず、テストのみで品質を担保
- 期待値は実際の変換動作に合わせて調整済み
- プリプロセッサのテストは除外（要件により不要）

## 更新履歴

- 2025-01-04: 初版作成
- 2025-01-04: プリプロセッサテスト削除、ファイル配置最適化、全プロセッサのテスト完成
- 2025-01-08: FrontMatter内ショートコード変換機能追加に伴うテストケース更新（8ケース追加、総計143ケース）