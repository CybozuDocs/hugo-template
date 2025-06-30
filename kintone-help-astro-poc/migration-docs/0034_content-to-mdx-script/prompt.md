# 0034_content-to-mdx-script 作業履歴

## 作業概要

Hugo のコンテンツをすべて Astro に対応した *.mdx ファイルに変換するスクリプトを作成する。

## ユーザーからの指示

### 初回指示 (2025年1月)

```
ultrathink

@convert_prompt.md の内容を隅々まで読み、
MDX変換スクリプトを作成してください。
```

### convert_prompt.md の要件

#### スクリプトが満たすべき仕様

- AST ベースで解析を行うこと
  - Astro における Markdown および MDX 処理を参考に行う
    https://deepwiki.com/withastro/astro/4.2-markdown-and-mdx-processing
- TypeScript で実行可能な形式とすること
  - 型安全とすること。any の利用は避ける。型アサーションも極力利用しない。
  - Class は使わないこと
  - 型は type を優先して使うこと。interface はやむを得ない場合のみ利用する。
- FrontMatter を保持すること
- `kintone-help-astro-poc/` ディレクトリ配下に、`migrate-scripts/` ディレクトリを作成し、その中にスクリプトを配置すること

#### 重要事項

- これらの仕様が満たせなくなる可能性がある場合には、必ずユーザーに確認を取ること
- 意思決定を勝手に行わないこと。提案を心がけ、ユーザーと協力して望ましいものを作り上げること

#### 変換対象に関する情報

- 変換元: /Users/mugi/ghq/github.com/CybozuDocs/kintone/content/ja/ 配下の *.md コンテンツを対象とする
- 変換先: kintone-help-astro-poc/src/pages/ja/ 配下に、同一のディレクトリ構造、ファイル名を維持して変換する
- _index.md については、`_` を除去し、index.mdx とする

#### Astro 用のコンテンツの変換

- Hugo のショートコードは、すべて Astro のコンポーネントに置き換えること
  - ショートコードに対応するコンポーネントは kintone-help-astro-poc/src/components/ に存在する

#### 現時点で判明している懸念事項

- Markdown として Parse し、MDX として出力するため、それぞれで異なる AST を用いる可能性がある
  - 相互変換が可能かどうかが不明である
  - ショートコード部分を、AST を前提として変換できるかが不明である

#### 作業前に確認する項目

- content/ja/start/ 配下のコンテンツは、一部手動で移行が完了しています。それらも参考にすること

## 作業ログ

### 事前調査 (2025年1月)

1. **既存移行作業の確認**
   - migration-docs ディレクトリ構造を確認
   - 最新の migration-rules.md と rules.md を確認
   - 手動移行済みの content/ja/start/ ディレクトリを確認

2. **変換パターンの解析**
   - 手動移行済みファイルの分析結果：
     - FrontMatter: 基本的に保持、`layout` フィールドを追加
     - _index.md → index.mdx、通常 .md → .mdx
     - ショートコード変換: `{{< kintone >}}` → `<Kintone />`
     - 画像変換: `![alt](src)` → `<Img src="..." alt="..." />`
     - import文の追加: 使用するコンポーネントを上部にimport
     - リスト項目内画像のインデント: 適切なスペース数でインデント

3. **変換対象の確認**
   - /Users/mugi/ghq/github.com/CybozuDocs/kintone/content/ja/ の大量のMarkdownファイル
   - 複雑なディレクトリ構造と多数のファイル

### 作業ディレクトリ準備 (2025年1月)

- migration-docs/0034_content-to-mdx-script/ ディレクトリ作成完了
- prompt.md 作成中

## 次のステップ

1. plan.md の作成（詳細な実装計画）
2. 変換対象とパターンの詳細分析
3. AST ベースのスクリプト設計
4. ユーザーへのプラン提示と許可確認