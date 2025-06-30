# Hugo to Astro MDX Converter

Hugo content を Astro MDX ファイルに変換する AST ベースのスクリプトです。

## 機能

- **FrontMatter 保持**: 既存の FrontMatter を保持し、layout フィールドを追加
- **ショートコード変換**: Hugo ショートコードを Astro コンポーネントに変換
- **画像変換**: Markdown 画像記法を Img コンポーネントに変換
- **ヘッダー変換**: Markdown ヘッダーを Heading コンポーネントに変換
- **インデント修正**: Numbered List 内の Img コンポーネントのインデントを Astro 仕様に調整
- **Import 自動生成**: 使用されたコンポーネントの import 文を自動生成

## 使用方法

### 開発環境のセットアップ

```bash
npm install
```

### 基本的な変換

```bash
# テストモード（ja/start ディレクトリの 17 ファイルを変換）
npm run convert:test

# 全ファイル変換
npm run convert:all

# 特定ディレクトリ変換
npm run convert:dir
```

### テスト実行

```bash
# 全テスト実行
npm test

# ウォッチモードでテスト
npm run test:watch

# TypeScript チェック
npm run build

# Lint
npm run lint

# フォーマット
npm run format
```

## テスト構成

### Unit Tests (`test/conversion.test.ts`)

- **FrontMatter Processing**: YAML パース、レイアウト追加、シリアライズ
- **Shortcode Transformation**: kintone、enabled2 などのショートコード変換
- **Image Transformation**: Markdown 画像から Img コンポーネントへの変換
- **Header Transformation**: Markdown ヘッダーから Heading コンポーネントへの変換
- **Post-Processing**: Numbered List のインデント修正
- **Edge Cases**: エラーハンドリング、エッジケース

### Integration Tests (`test/integration.test.ts`)

- **Real File Conversion**: 実際のファイルを使った完全な変換パイプラインテスト
- **Component Import Generation**: import 文の自動生成テスト
- **Error Handling**: エラーハンドリングテスト
- **Performance**: 大量コンテンツの処理性能テスト

## 変換仕様

### ショートコード変換

| Hugo ショートコード | Astro コンポーネント |
|---|---|
| `{{< kintone >}}` | `<Kintone />` |
| `{{< enabled2 JP CN >}}...{{< /enabled2 >}}` | `<Enabled regions={["JP", "CN"]}>...</Enabled>` |
| `{{< note >}}...{{< /note >}}` | `<Note>...</Note>` |
| `{{< hint >}}...{{< /hint >}}` | `<Hint>...</Hint>` |

### 画像変換

```markdown
![Alt text](/path/to/image.png)
```
↓
```mdx
<Img src="/path/to/image.png" alt="Alt text" />
```

### ヘッダー変換

```markdown
## Title{#my-id}
```
↓
```mdx
<Heading level={2} id="my-id">Title</Heading>
```

### インデント修正

Numbered List 内の画像コンポーネントは Astro の要求に合わせて 3 スペースインデントに自動調整されます：

```markdown
1. Step description:
  <Img src="/image.png" alt="Step" />
```
↓
```mdx
1. Step description:
   <Img src="/image.png" alt="Step" />
```

## ディレクトリ構造

```
src/
├── convert-to-mdx.ts          # メイン変換スクリプト
├── lib/
│   ├── string-transformer.ts  # ショートコード・画像・ヘッダー変換
│   ├── frontmatter.ts         # FrontMatter 処理
│   ├── component-mapper.ts    # コンポーネントマッピング
│   └── file-utils.ts          # ファイル操作ユーティリティ
├── types/
│   └── conversion.ts          # 型定義
test/
├── conversion.test.ts         # Unit テスト
└── integration.test.ts        # Integration テスト
```

## 技術詳細

- **言語**: TypeScript (strict mode)
- **テストフレームワーク**: Node.js Test Runner
- **AST 処理**: unified.js、remark エコシステム
- **YAML 処理**: js-yaml
- **ファイル操作**: Node.js fs/promises

## パフォーマンス

- **17 ファイル変換**: ~100ms
- **大量コンテンツ処理**: 1000 個のショートコードを含むコンテンツを 1 秒以内で処理
- **成功率**: 100% （ja/start ディレクトリの全 17 ファイル）

## エラーハンドリング

- 不正な YAML: 詳細なエラーメッセージを表示
- 存在しないファイル: graceful に処理
- 不正なショートコード: 元のまま保持
- TypeScript 型安全性: strict mode で型エラーを防止