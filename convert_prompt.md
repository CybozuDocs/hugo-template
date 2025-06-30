Hugo のコンテンツを、すべて Astro に対応した \*.mdx ファイルに変換するスクリプトを作成してください。

### スクリプトが満たすべき仕様

- AST ベースで解析を行うこと
  - Astro における Markdown および MDX 処理を参考に行う
    https://deepwiki.com/withastro/astro/4.2-markdown-and-mdx-processing
- TypeScript で実行可能な形式とすること
  - 型安全とすること。any の利用は避ける。型アサーションも極力利用しない。
  - Class は使わないこと
  - 型は type を優先して使うこと。interface はやむを得ない場合のみ利用する。
- FrontMatter を保持すること
- `kintone-help-astro-poc/` ディレクトリ配下に、`migrate-scripts/` ディレクトリを作成し、その中にスクリプトを配置すること

### 重要事項

- これらの仕様が満たせなくなる可能性がある場合には、必ずユーザーに確認を取ること
- 意思決定を勝手に行わないこと。提案を心がけ、ユーザーと協力して望ましいものを作り上げること

### 変換対象に関する情報

- 変換元: /Users/mugi/ghq/github.com/CybozuDocs/kintone/content/ja/ 配下の \*.md コンテンツを対象とする
- 変換先: kintone-help-astro-poc/src/pages/ja/ 配下に、同一のディレクトリ構造、ファイル名を維持して変換する
- _index.md については、`_` を除去し、index.mdx とする

### Astro 用のコンテンツの変換

- Hugo のショートコードは、すべて Astro のコンポーネントに置き換えること
  - ショートコードに対応するコンポーネントは kintone-help-astro-poc/src/components/ に存在する

### 現時点で判明している懸念事項

- Markdown として Parse し、MDX として出力するため、それぞれで異なる AST を用いる可能性がある
  - 相互変換が可能かどうかが不明である
  - ショートコード部分を、AST を前提として変換できるかが不明である

### 作業前に確認する項目

- content/ja/start/ 配下のコンテンツは、一部手動で移行が完了しています。それらも参考にすること

---

まずはプランニングから行ってください。
詳細に実装計画を立ててください。
