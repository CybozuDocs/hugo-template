# Disclaimer 変更記録

元ファイル: `layouts/partials/disclaimer.html`

## 関数・変数の置換

| Hugo                                                                           | Astro                              | 備考                      |
| ------------------------------------------------------------------------------ | ---------------------------------- | ------------------------- |
| `{{ partial "disclaimer_pdf_url" (dict "languageCode" $.Site.LanguageCode )}}` | インライン実装                     | PDF URL決定ロジックを統合 |
| `{{ i18n "MT_Disclaimer" }}`                                                   | `<Wovn>i18n__MT_Disclaimer</Wovn>` | WOVN対応                  |
| `$.Site.LanguageCode`                                                          | `env.languageCode`                 | envプロパティに集約       |

## TODO

- [ ] PDF URLの管理方法の検討（設定ファイル化など）

## 構造の変化

### partialの統合

- Hugo の `partial "disclaimer_pdf_url"` 呼び出し → ロジックを直接統合
- 別コンポーネントを呼び出す代わりに、同一コンポーネント内で処理

### 条件分岐の変更

- Hugo の `or (eq $languageCode "zh-cn") (eq $languageCode "zh-jp")`
- Astro: `env.languageCode === "zh-cn" || env.languageCode === "zh-jp"`

## その他の差分

### URL処理

- Hugo: `{{$pdf_url}}`
- Astro: `{pdfUrl}`（JSX内での変数展開）

## 外部依存

### スクリプトの読み込み

- Font Awesomeアイコンを使用

### 外部リンク

- cybozu.co.jpのPDFファイルにリンク

## 注意事項

- PDF URLがハードコードされているため、URL変更時の対応が必要
- 中国語の判定ロジックが元コードから継承されている
