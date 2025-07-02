# Hugo to Astro Migration Scripts

Hugo形式のMarkdownファイルをAstro MDX形式に変換するためのスクリプト群です。

## 機能

- **フロントマター変換**: Hugo形式からAstro形式への変換
- **ショートコード変換**: Hugo shortcodesをAstroコンポーネントに変換
- **画像パス変換**: 画像パスのプレフィックス置換
- **HTMLタグ整形**: Astro/MDX互換のためのHTML構造調整
- **エスケープ処理**: MDXパース用の文字エスケープ
- **プリプロセッサ**: ファイル固有の例外処理

## 基本的な使い方

### 基本的な変換

```bash
npx tsx migrate-scripts/convert-content.ts <入力ディレクトリ> <出力ディレクトリ>
```

### 画像パス置換付きの変換

```bash
npx tsx migrate-scripts/convert-content.ts \
  --image-path-from "/k/" \
  --image-path-to "/k/kintone/" \
  /path/to/hugo/content \
  /path/to/astro/pages
```

### フィルタリング変換

```bash
npx tsx migrate-scripts/convert-content.ts \
  --filter "app/form" \
  ./content \
  ./pages
```

### プリプロセッサ付き変換

```bash
npx tsx migrate-scripts/convert-content.ts \
  --preprocessor migrate-scripts/preprocessors/kintone-preprocessors.js \
  --image-path-from "/k/" \
  --image-path-to "/k/kintone/" \
  ./content \
  ./pages
```

## 実際のコマンド例

### kintoneヘルプの変換例

**重要**: 今後、特別な指示がない限りは常にプリプロセッサを指定して実行してください。

#### 標準的な変換（プリプロセッサ付き・推奨）
```bash
npx tsx migrate-scripts/convert-content.ts \
  --preprocessor migrate-scripts/preprocessors/kintone-preprocessors.js \
  --image-path-from "/k/" \
  --image-path-to "/k/kintone/" \
  <入力ディレクトリ> \
  <出力ディレクトリ>
```

#### messageディレクトリの変換
```bash
npx tsx migrate-scripts/convert-content.ts \
  --preprocessor migrate-scripts/preprocessors/kintone-preprocessors.js \
  --image-path-from "/k/" \
  --image-path-to "/k/kintone/" \
  "/Users/mugi/ghq/github.com/CybozuDocs/kintone/content/ja/message" \
  "/Users/mugi/ghq/github.com/CybozuDocs/hugo-template/kintone-help-astro-poc/src/pages/ja/message"
```

#### appactionディレクトリの変換
```bash
npx tsx migrate-scripts/convert-content.ts \
  --preprocessor migrate-scripts/preprocessors/kintone-preprocessors.js \
  --image-path-from "/k/" \
  --image-path-to "/k/kintone/" \
  "/Users/mugi/ghq/github.com/CybozuDocs/kintone/content/ja/app/appaction" \
  "/Users/mugi/ghq/github.com/CybozuDocs/hugo-template/kintone-help-astro-poc/src/pages/ja/app/appaction"
```

#### basic_errorディレクトリの変換
```bash
npx tsx migrate-scripts/convert-content.ts \
  --preprocessor migrate-scripts/preprocessors/kintone-preprocessors.js \
  --image-path-from "/k/" \
  --image-path-to "/k/kintone/" \
  "/Users/mugi/ghq/github.com/CybozuDocs/kintone/content/ja/app/form/autocalc/basic_error" \
  "/Users/mugi/ghq/github.com/CybozuDocs/hugo-template/kintone-help-astro-poc/src/pages/ja/app/form/autocalc/basic_error"
```

#### app/ 配下全体の変換
```bash
npx tsx migrate-scripts/convert-content.ts \
  --preprocessor migrate-scripts/preprocessors/kintone-preprocessors.js \
  --image-path-from "/k/" \
  --image-path-to "/k/kintone/" \
  "/Users/mugi/ghq/github.com/CybozuDocs/kintone/content/ja/app" \
  "/Users/mugi/ghq/github.com/CybozuDocs/hugo-template/kintone-help-astro-poc/src/pages/ja/app"
```

## オプション

| オプション | 短縮形 | 説明 |
|-----------|--------|------|
| `--input-dir` | `-i` | 入力ディレクトリ（Hugoマークダウンファイル） |
| `--output-dir` | `-o` | 出力ディレクトリ（Astro MDXファイル） |
| `--filter` | `-f` | ファイルパスパターンでフィルタリング |
| `--image-path-from` | | 画像パス置換の元パス |
| `--image-path-to` | | 画像パス置換の先パス |
| `--preprocessor` | `-p` | プリプロセッサ設定ファイル |
| `--help` | `-h` | ヘルプ表示 |

## アーキテクチャ

### 変換パイプライン

1. **プリプロセッサ** (`preprocessor.ts`) - ファイル固有の前処理
2. **フロントマター処理** (`frontmatter-processor.ts`) - メタデータ変換
3. **画像処理** (`image-processor.ts`) - 画像パス置換とコンポーネント化
4. **ショートコード処理** (`shortcode-processor.ts`) - shortcode→コンポーネント変換
5. **見出し処理** (`heading-processor.ts`) - Heading コンポーネント化
6. **HTML処理** (`html-processor.ts`) - Astro互換HTML整形
7. **エスケープ処理** (`escape-processor.ts`) - MDXパース用エスケープ

### ファイル構成

```
migrate-scripts/
├── README.md                    # このファイル
├── convert-content.ts           # メインスクリプト
├── cli.ts                      # CLI引数解析
├── types.ts                    # TypeScript型定義
├── file-utils.ts               # ファイル操作ユーティリティ
├── preprocessor.ts             # プリプロセッサ機能
├── frontmatter-processor.ts    # フロントマター変換
├── image-processor.ts          # 画像処理
├── shortcode-processor.ts      # ショートコード変換
├── heading-processor.ts        # 見出し処理
├── html-processor.ts           # HTML整形
├── escape-processor.ts         # エスケープ処理
└── preprocessors/
    └── kintone-preprocessors.js # kintone固有のプリプロセッサ
```

## 変換ルール

### フロントマター変換

**Hugo形式:**
```yaml
---
title: "ページタイトル"
weight: 100
aliases: /ja/id/123456
---
```

**Astro形式:**
```yaml
---
title: "ページタイトル"
weight: 100
aliases:
  - "/ja/id/123456"
layout: "@/layouts/PageLayout.astro"
---
```

### ショートコード変換

| Hugoショートコード | Astroコンポーネント |
|-------------------|-------------------|
| `{{< img src="..." alt="..." />}}` | `<Img src="..." alt="..." />` |
| `{{< heading id="..." >}}見出し{{< /heading >}}` | `<Heading id="...">見出し</Heading>` |
| `{{< note >}}内容{{< /note >}}` | `<Note>内容</Note>` |
| `{{< warning >}}内容{{< /warning >}}` | `<Warning>内容</Warning>` |
| `{{< enabled JP CN >}}` | `<Enabled regions={["JP","CN"]}>` |

### 画像変換

**Hugo形式:**
```markdown
![alt text](/k/img/example.png)
```

**Astro形式:**
```astro
<Img src="/k/kintone/img/example.png" alt="alt text" />
```

### HTML整形

Astro/MDXと互換性のあるHTML構造に変換：

- `<br>` → `<br />`（自己終了タグ化）
- 複数行にわたるHTMLタグの適切なインデント
- ネストされたリスト構造の整形

## プリプロセッサ

ファイル固有の例外処理を別ファイルで定義できます。

### kintone用プリプロセッサ

kintoneヘルプ変換用のプリプロセッサが `migrate-scripts/preprocessors/kintone-preprocessors.js` に用意されています。このファイルには以下の修正が含まれています：

- `autocalc_format.md` のHTMLエスケープ問題の修正
  - `<td style="text-align: center;"><</td>` → `<td style="text-align: center;">&lt;</td>`
  - `<td style="text-align: center;"><=</td>` → `<td style="text-align: center;">&lt;=</td>`
  - `<td style="text-align: center;"><></td>` → `<td style="text-align: center;">&lt;&gt;</td>`
  - 比較演算子リスト内の `<`, `>`, `<=`, `>=`, `<>` のエスケープ

### プリプロセッサの使い方

**推奨**: kintoneヘルプの変換では常にプリプロセッサを指定してください。

```bash
npx tsx migrate-scripts/convert-content.ts \
  --preprocessor migrate-scripts/preprocessors/kintone-preprocessors.js \
  --image-path-from "/k/" \
  --image-path-to "/k/kintone/" \
  <入力ディレクトリ> \
  <出力ディレクトリ>
```

### プリプロセッサのカスタマイズ例

```javascript
// migrate-scripts/preprocessors/custom-preprocessors.js
export default {
  rules: [
    {
      filePath: "path/to/problematic/file.md",
      transform: (content) => {
        // カスタム変換処理
        return content.replaceAll('問題のあるパターン', '修正されたパターン');
      }
    }
  ]
};
```

## トラブルシューティング

### MDXパースエラー

MDXパーサーでエラーが出る場合は、プリプロセッサで該当ファイルの問題箇所を修正してください。

### HTML構造エラー

Astroで「Expected a closing tag」エラーが出る場合は、HTML処理モジュールが対象タグを処理するかを確認してください。

### 画像パス問題

画像が表示されない場合は、`--image-path-from` と `--image-path-to` オプションを確認してください。

## 開発・カスタマイズ

### 新しいショートコードの追加

`shortcode-processor.ts` の `SHORTCODE_MAPPINGS` に追加：

```typescript
const SHORTCODE_MAPPINGS: ShortcodeMapping = {
  simple: {
    'newshortcode': 'NewComponent',
  },
  // ...
};
```

### 新しいプリプロセッサルールの追加

`preprocessors/kintone-preprocessors.js` の `rules` 配列に追加：

```javascript
{
  filePath: "path/to/problematic/file.md",
  transform: (content) => {
    return content.replace(/problem/g, 'solution');
  }
}
```