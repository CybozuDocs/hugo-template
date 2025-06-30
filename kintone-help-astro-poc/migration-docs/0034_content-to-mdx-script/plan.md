# Hugo → Astro MDX 変換スクリプト 実装計画

## プロジェクト概要

Hugo コンテンツ（781個のMarkdownファイル）をすべて Astro 対応の MDX ファイルに変換するAST ベースの TypeScript スクリプトを作成する。

## 技術要件

### 必須仕様
- **AST ベース解析**: MarkdownとMDXの構文解析
- **TypeScript**: 型安全性確保、any型禁止、Classなし、type優先
- **FrontMatter保持**: 元のメタデータを維持
- **ディレクトリ構造維持**: 同一構造で変換
- **ファイル名変換**: `_index.md` → `index.mdx`, 他は `.md` → `.mdx`

## 変換対象と構造

### 入力
- **ソース**: `/Users/mugi/ghq/github.com/CybozuDocs/kintone/content/ja/`
- **ファイル数**: 781個のMarkdownファイル
- **階層**: 複雑なディレクトリ構造

### 出力
- **出力先**: `kintone-help-astro-poc/src/pages/ja/`
- **形式**: MDXファイル（.mdx拡張子）
- **Layout追加**: FrontMatterにlayoutフィールド追加

## 主要変換ルール

### 1. FrontMatter変換
```yaml
# 入力 (_index.md)
---
title: "スタートガイド"
weight: 100
aliases: /ja/id/040130
---

# 出力 (index.mdx)
---
title: "スタートガイド"
weight: 100
aliases: /ja/id/040130
layout: "@/layouts/SectionLayout.astro"  # _index.md の場合
# または
layout: "@/layouts/PageLayout.astro"    # 通常ページの場合
---
```

### 2. ショートコード変換マッピング

#### 高頻度ショートコード (調査結果ベース)
| Hugo ショートコード | 頻度 | Astro 変換 | コンポーネント |
|---|---|---|---|
| `{{< wv_brk >}}text{{< /wv_brk >}}` | 4,314回 | `text` | WOVNで削除 |
| `{{< kintone >}}` | 1,915回 | `<Kintone />` | ✅ 存在 |
| `{{< note >}}...{{< /note >}}` | 674回 | `<Note>...</Note>` | ✅ 存在 |
| `{{< enabled2 JP CN >}}...{{< /enabled2 >}}` | 337回 | `<Enabled>...</Enabled>` | ✅ 存在 |
| `{{< reference >}}...{{< /reference >}}` | 307回 | `<Reference>...</Reference>` | ✅ 存在 |
| `{{< hint >}}...{{< /hint >}}` | 156回 | `<Hint>...</Hint>` | ✅ 存在 |
| `{{< warning >}}...{{< /warning >}}` | 89回 | `<Warning>...</Warning>` | ✅ 存在 |

#### その他のショートコード
- `{{< slash >}}` → `<Slash />`
- `{{< service >}}` → `<Service />`
- `{{< graynote >}}...{{< /graynote >}}` → `<Graynote>...</Graynote>`

### 3. 画像変換
```markdown
# 入力
![スクリーンショット：説明](/k/img-ja/sample.png)

# 出力
<Img src="/k/kintone/img-ja/sample.png" alt="スクリーンショット：説明" />
```

### 4. import文生成
使用するコンポーネントを自動検出してimport文を生成:
```typescript
import Hint from "@/components/Hint.astro";
import Img from "@/components/Img.astro";
import Kintone from "@/components/Kintone.astro";
import Note from "@/components/Note.astro";
```

## Astro準拠のAST変換アーキテクチャ

### Astro公式アプローチに基づく設計
Astro の `@astrojs/markdown-remark` パッケージと同じ remark/rehype エコシステムを使用:

### 使用ライブラリ (Astro準拠)
```typescript
// Astroと同じMarkdown処理基盤
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';  // Astroでデフォルト有効

// MDX処理 (Astro互換)
import remarkMdx from 'remark-mdx';
import { remarkShiki } from '@astrojs/markdown-remark';  // Astro同等のシンタックスハイライト

// rehypeプラグイン (Astro準拠)
import rehypeStringify from 'rehype-stringify';

// FrontMatter処理
import yaml from 'js-yaml';
import { VFile } from 'vfile';
```

### Astro MDX 処理フロー
1. **Astro準拠の解析** → `@astrojs/markdown-remark` と同等のパイプライン
2. **remark プラグインチェーン** → FrontMatter → GFM → カスタム変換
3. **ショートコード→コンポーネント変換** → remarkプラグインとして実装
4. **rehype変換** → HTML AST → Astroコンポーネント埋め込み
5. **MDX統合** → Astro互換のMDX出力
6. **import文生成** → Astro MDXファイルのimportパターンに準拠

### カスタムremarkプラグイン実装
```typescript
// Hugo ショートコード変換をremarkプラグインとして実装
export function remarkHugoShortcodes(): Plugin {
  return (tree: Root, file: VFile) => {
    visit(tree, 'text', (node: Text, index: number, parent: Parent) => {
      // Hugo {{< >}} パターンを検出してAstroコンポーネントに変換
    });
  };
}

// 画像変換プラグイン
export function remarkImageToComponent(): Plugin {
  return (tree: Root, file: VFile) => {
    visit(tree, 'image', (node: Image) => {
      // Markdown画像をAstro Imgコンポーネントに変換
    });
  };
}
```

### 型定義
```typescript
type HugoShortcode = {
  name: string;
  params?: string[];
  content?: string;
  selfClosing: boolean;
};

type ConversionResult = {
  content: string;
  imports: Set<string>;
  errors: string[];
};

type FileProcessResult = {
  inputPath: string;
  outputPath: string;
  success: boolean;
  imports: string[];
  errors: string[];
};
```

## スクリプト構成

### ディレクトリ構造
```
kintone-help-astro-poc/
├── migrate-scripts/
│   ├── convert-to-mdx.ts        # メインスクリプト
│   ├── lib/
│   │   ├── ast-transformers.ts  # AST変換ロジック
│   │   ├── shortcode-parser.ts  # ショートコード解析
│   │   ├── component-mapper.ts  # コンポーネントマッピング
│   │   ├── frontmatter.ts       # FrontMatter処理
│   │   └── file-utils.ts        # ファイル操作
│   ├── types/
│   │   └── conversion.ts        # 型定義
│   └── package.json             # 依存関係
```

### 主要モジュール詳細 (Astro準拠設計)

#### 1. convert-to-mdx.ts (メインスクリプト)
```typescript
// Astro MDX パイプライン使用
export async function convertAllFiles(): Promise<void>
export async function convertSingleFile(inputPath: string): Promise<FileProcessResult>

// Astro互換の処理パイプライン
export function createAstroMdxProcessor(): Processor {
  return unified()
    .use(remarkParse)
    .use(remarkFrontmatter, ['yaml'])
    .use(remarkGfm)  // Astroデフォルト
    .use(remarkHugoShortcodes)  // カスタムプラグイン
    .use(remarkImageToComponent)  // カスタムプラグイン
    .use(remarkMdx)  // MDX変換
    .use(rehypeStringify);
}
```

#### 2. remark-plugins.ts (Astro準拠プラグイン)
```typescript
// remark プラグインとしてショートコード変換実装
export function remarkHugoShortcodes(): Plugin<[], Root>
export function remarkImageToComponent(): Plugin<[], Root>
export function remarkAstroImports(): Plugin<[], Root>

// unist-util-visit を使用したAST操作
import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Root, Text, Image } from 'mdast';
```

#### 3. mdx-component-generator.ts (MDXコンポーネント生成)
```typescript
// Astro MDXファイル生成
export function generateMdxWithImports(
  frontmatter: string,
  content: string,
  imports: string[]
): string

// import文の適切な配置 (Astro MDXパターン)
export function generateAstroImports(components: Set<string>): string[]
```

#### 4. astro-component-mapper.ts (Astro固有マッピング)
```typescript
// Astro コンポーネントパスマッピング
export const ASTRO_COMPONENT_MAPPING: Record<string, AstroComponentInfo>

type AstroComponentInfo = {
  importPath: string;           // "@/components/Kintone.astro"
  selfClosing: boolean;         // <Kintone /> vs <Note>...</Note>
  propsMapping?: Record<string, string>;  // Hugo パラメータ → Astro props
}
```

## 実装段階

### Phase 1: 基盤実装 (convert_prompt.md要件対応)
1. **プロジェクト初期化**
   - `kintone-help-astro-poc/migrate-scripts/` ディレクトリ作成 ✅
   - TypeScript設定（strict設定、any型禁止）
   - 依存ライブラリインストール（Astro準拠）
   - 厳密な型定義（type優先、interface最小限）

2. **ファイル操作基盤**
   - ディレクトリ走査（`/Users/mugi/ghq/github.com/CybozuDocs/kintone/content/ja/`）
   - 出力先（`kintone-help-astro-poc/src/pages/ja/`）への変換
   - `_index.md` → `index.mdx` 変換ロジック

### Phase 2: AST変換エンジン (懸念事項対応)
1. **Markdown→MDX AST相互変換の実証**
   - 簡単なテストケースでの変換可能性検証
   - mdast → mdxast 変換パターンの確立
   - ショートコード検出・分割アルゴリズムの実装

2. **FrontMatter処理**
   - YAML解析・保持（要件：FrontMatter保持）
   - Layout自動判定・追加
   - 既存メタデータの完全保持

### Phase 3: 変換ルール実装 (手動移行パターン準拠)
1. **既存手動移行ファイルとの一致性確保**
   - `content/ja/start/` パターンとの比較検証
   - 変換結果の差分チェック機能
   - 手動移行品質との一致性担保

2. **ショートコード→コンポーネント変換**
   - 8種類の主要ショートコード対応
   - コンポーネントマッピング（`kintone-help-astro-poc/src/components/` 利用）
   - 入れ子ショートコードの適切な処理

3. **画像・import文変換**
   - Markdown画像→Imgコンポーネント
   - 使用コンポーネント自動検出
   - import文の適切な配置

### Phase 4: 品質保証・テスト
1. **convert_prompt.md 要件への適合性検証**
   - AST ベース解析の動作確認
   - TypeScript型安全性（any型なし）の検証
   - 全ファイル（781個）の変換成功率測定

2. **既存手動移行との一致性テスト**
   - `content/ja/start/` との比較
   - 差分レポート生成
   - 品質基準達成の確認

## 技術的課題と対応策 (convert_prompt.md 懸念事項への対応)

### 1. **最重要課題**: Markdown → MDX AST相互変換問題
**懸念事項 (convert_prompt.md)**: 
> Markdown として Parse し、MDX として出力するため、それぞれで異なる AST を用いる可能性がある

**課題の詳細**: 
- Markdown AST (mdast) と MDX AST (mdxast) の構造差分
- Hugo ショートコードが Markdown テキストノード内に存在
- MDX では JSX 要素として表現する必要

**対応策**:
```typescript
// 段階的変換アプローチ
1. Markdown AST でショートコード検出・抽出
2. テキストノード分割（ショートコード前後）
3. ショートコード部分を MDX JSX ノードに変換
4. 再結合して MDX AST 構築

// 実装例
function convertShortcodeToMdxJsx(shortcode: HugoShortcode): MdxJsxFlowElement {
  return {
    type: 'mdxJsxFlowElement',
    name: shortcode.astroComponent,
    attributes: shortcode.props,
    children: shortcode.content ? parseMarkdown(shortcode.content) : []
  };
}
```

### 2. AST 変換の技術的複雑性
**課題**: Markdown テキストノード内のショートコード検出と分割
**対応**:
- 正規表現による事前検出 → AST ノード位置特定
- `unist-util-visit` による段階的変換
- 変換前後の AST 構造検証

### 3. 既存手動移行パターンとの一致性確保
**convert_prompt.md要件**: 
> content/ja/start/ 配下のコンテンツは、一部手動で移行が完了しています。それらも参考にすること

**対応**: 手動移行済みファイルのパターン解析結果を変換ルールに適用
```typescript
// 検証済み変換パターン
- {{< kintone >}} → <Kintone />
- {{< note >}}...{{< /note >}} → <Note>...</Note>
- ![alt](src) → <Img src="..." alt="..." />
- リスト内画像のインデント保持
- import文の自動生成と配置
```

### 4. 型安全性とTypeScript要件の厳格な遵守
**convert_prompt.md要件**:
- any 型禁止、型アサーション極力回避
- Class 不使用、type 優先

**対応**:
```typescript
// 厳密な型定義
type MdastNode = import('mdast').Node;
type MdxNode = import('mdast-util-mdx').Node;

type ConversionContext = {
  readonly sourceFile: string;
  readonly targetFile: string;
  readonly usedComponents: ReadonlySet<string>;
  readonly errors: readonly string[];
};

// any型回避パターン
function isTextNode(node: MdastNode): node is import('mdast').Text {
  return node.type === 'text';
}
```

### 5. Astro MDX 互換性の確保
**課題**: 生成されたMDXがAstroで正しく処理されること  
**対応**: `@astrojs/markdown-remark` と同じremark/rehypeプラグインチェーンを使用

## 実行方法

### 開発時
```bash
cd kintone-help-astro-poc/migrate-scripts
npm install
npm run convert:test  # テストファイルのみ
npm run convert:all   # 全ファイル変換
```

### 変換オプション
```bash
# 特定ディレクトリのみ
npm run convert -- --dir=start

# 差分更新のみ
npm run convert -- --incremental

# ドライランモード
npm run convert -- --dry-run
```

## 成功の判定基準

1. **変換成功率**: 95%以上のファイルが正常変換
2. **構文エラーなし**: 生成されたMDXファイルがAstroでビルド可能
3. **コンテンツ保持**: 元の内容が適切に変換されている
4. **パフォーマンス**: 全ファイル変換が10分以内
5. **手動検証**: 数十ファイルの目視確認で品質確認

## リスク要因と緩和策

### 高リスク
- **未知のショートコード**: 調査漏れのショートコード → 段階的実装・ログ出力
- **AST変換の複雑性**: 変換ロジックの複雑化 → 単体テスト・段階実装

### 中リスク  
- **パフォーマンス**: 大量ファイル処理 → 並列化・最適化
- **メモリ使用量**: AST処理でのメモリ不足 → ストリーミング処理

### 低リスク
- **ファイルパス**: パス変換ミス → テストケース充実
- **エラーハンドリング**: 部分的失敗 → 詳細ログ・リトライ機能

この計画に基づき、段階的にスクリプトを実装していきます。