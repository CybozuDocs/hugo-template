# Enquete 変更記録

元ファイル: `layouts/partials/enquete.html`

## 関数・変数の置換

| Hugo                                                                | Astro                                                                                                         | 備考                       |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | -------------------------- |
| `{{ if ne $.Site.Params.preview_site true }}`                       | `{!env.previewSite && (...)}`                                                                                 | 条件付きレンダリング       |
| `{{ i18n "Was_it_helpful" }}`                                       | `<Wovn>i18n__Was_it_helpful</Wovn>`                                                                           | WOVN対応                   |
| `{{ i18n "Close" }}`                                                | `i18n__todo__Close`                                                                                           | title属性内のためTODO      |
| `{{ i18n "Yes" }}`                                                  | `<Wovn>i18n__Yes</Wovn>`                                                                                      | WOVN対応（テキスト部分）   |
| `{{ i18n "Yes" }}`                                                  | `i18n__todo__Yes`                                                                                             | aria-label属性内のためTODO |
| `{{ i18n "No" }}`                                                   | `<Wovn>i18n__No</Wovn>`                                                                                       | WOVN対応（テキスト部分）   |
| `{{ i18n "No" }}`                                                   | `i18n__todo__No`                                                                                              | aria-label属性内のためTODO |
| `{{ now.Format "2006010203" }}`                                     | `new Date().toISOString().slice(0, 10).replace(/-/g, '') + new Date().getHours().toString().padStart(2, '0')` | 日付フォーマット           |
| `{{ printf "%s?%s" "javascripts/enquete.js" $buildnum \| relURL }}` | `` `javascripts/enquete.js?${buildnum}` ``                                                                    | URL構築                    |
| `$.Site.Params.preview_site`                                        | `env.previewSite`                                                                                             | envプロパティに集約        |

## TODO

- [ ] title属性とaria-label属性のi18n対応方法の検討
- [ ] relURL相当の処理の実装（現在は相対パス）
- [ ] 日付フォーマット処理の最適化

## 構造の変化

### 条件分岐の変更

- Hugo の `{{ if ne $.Site.Params.preview_site true }}...{{ end }}`
- Astro: `{!env.previewSite && (...)}`（JSXの条件レンダリング）

### スクリプト読み込みの統合

- Hugo: 条件分岐の外でスクリプトタグ
- Astro: 条件分岐内にスクリプトタグも含める（Fragmentで包む）

## その他の差分

### 日付処理

- Hugo: `now.Format "2006010203"`
- Astro: JavaScript の Date オブジェクトと文字列操作

### URL処理

- Hugo: `relURL` フィルター
- Astro: 相対パス（TODO: 適切な処理が必要）

### 属性値の重複使用

- 同じi18nキーが異なる場所（テキストとaria-label）で使用されている

## 外部依存

### スクリプト

- `javascripts/enquete.js` を読み込み
- ビルド番号による キャッシュバスティング

### CSS

- Font Awesomeアイコンを使用

## 注意事項

- プレビューサイトでは表示されない機能
- スクリプトファイルとの連携が必要（JavaScript側の実装に依存）
- アンケート機能のため、バックエンドとの連携も想定される
