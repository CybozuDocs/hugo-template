# Disclaimer3 変更記録

元ファイル: `layouts/partials/disclaimer3.html`

## 関数・変数の置換

| Hugo                                                                                                                                                              | Astro                              | 備考                           |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | ------------------------------ |
| `{{ partial "disclaimer_pdf_url" (dict "languageCode" $.Site.LanguageCode )}}`                                                                                    | インライン実装                     | PDF URL決定ロジックを統合      |
| `{{ printf "<li><a href=\"%s\" target=\"_blank\">%s</a><i class=\"far fa-file-pdf index-pdf\" aria-hidden=\"true\"></i></li>" $pdf_url (i18n "MT_Disclaimer") }}` | JSX構造                            | HTMLをJSXで構築                |
| `{{ i18n "MT_Disclaimer" }}`                                                                                                                                      | `<Wovn>i18n__MT_Disclaimer</Wovn>` | WOVN対応                       |
| `{{ return $html }}`                                                                                                                                              | 直接出力                           | コンポーネントが直接HTMLを返す |
| `$.Site.LanguageCode`                                                                                                                                             | `env.languageCode`                 | envプロパティに集約            |

## TODO

- [ ] PDF URLの管理方法の検討（設定ファイル化など）

## 構造の変化

### returnパターンからコンポーネント出力へ

- Hugo の `return $html` → Astroコンポーネントが直接JSXを出力
- 文字列構築 → JSX構造での実装

### partialの統合

- Hugo の `partial "disclaimer_pdf_url"` 呼び出し → ロジックを直接統合
- 別コンポーネントを呼び出す代わりに、同一コンポーネント内で処理

### 文字列テンプレートからJSXへ

- Hugo の `printf` による文字列構築 → JSXによる構造化された出力

## その他の差分

### HTML構造

- Hugo: 文字列として構築されたHTML
- Astro: JSX形式での構造化されたHTML

### 変数の扱い

- Hugo: `$pdf_url` 変数
- Astro: `pdfUrl` 変数（camelCase）

## 外部依存

### スクリプトの読み込み

- Font Awesomeアイコンを使用

### 外部リンク

- cybozu.co.jpのPDFファイルにリンク

## 注意事項

- 元のコンポーネントは文字列を返していたが、Astroでは構造化されたHTMLを直接出力
- リスト項目（`<li>`）として設計されているため、親要素で`<ul>`または`<ol>`が必要
