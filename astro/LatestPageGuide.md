# LatestPageGuide 変更記録

元ファイル: `layouts/partials/latestpageguide.html`

## 関数・変数の置換

| Hugo | Astro | 備考 |
| ---- | ----- | ---- |
| `{{ isset .Params "latest_page" }}` | `page.params.latestPage` | パラメータ存在チェック |
| `{{ .Params.latest_page }}` | `page.params.latestPage` | pageプロパティに集約 |
| `{{ split $url "/" }}` | `latestPageUrl.split('/')` | 文字列分割 |
| `{{ index $urlParts 2 }}` | `urlParts[2] \|\| ''` | 配列インデックス |
| `{{ ne $newPageLang .Lang }}` | `newPageLang === page.lang` | 条件比較（反転） |
| `{{ eq $newPageLang "ja" }}` | `newPageLang === 'ja'` | 文字列比較 |
| `{{ i18n $langPageKey }}` | `i18n__${langPageKey}` | TODO: 動的i18n実装 |
| `{{ i18n "This_page_is_not_latest" }}` | `<Wovn>i18n__This_page_is_not_latest</Wovn>` | WOVN対応 |
| `{{ i18n "Latest_page_is_1" }}` | `<Wovn>i18n__Latest_page_is_1</Wovn>` | WOVN対応 |
| `{{ i18n "Latest_page_is_2" }}` | `<Wovn>i18n__Latest_page_is_2</Wovn>` | WOVN対応 |
| `{{ ne $langPage "" }}` | i18n実装後に対応 | TODO: 空文字チェック |

## TODO

- [ ] 動的i18nキーの実装（`i18n $langPageKey`相当）
- [ ] i18n値の空文字チェック機能

## 構造の変化

### 早期リターンパターン

- Hugo: ネストした条件分岐
- Astro: 早期リターンによる条件チェックの簡略化

### 条件分岐の最適化

- 複数の条件を順次チェックし、該当しない場合は早期リターン
- ネストの深い条件分岐を平坦化

## その他の差分

### パラメータ名の変更

- Hugo: `latest_page`
- Astro: `latestPage`（camelCase）

### 配列アクセスの安全性

- Hugo: `{{ index $urlParts 2 }}`
- Astro: `urlParts[2] || ''`（デフォルト値付き）

### 条件の反転

- Hugo: `{{ ne $newPageLang .Lang }}`（異なる場合）
- Astro: `newPageLang === page.lang`で同じ場合をチェックして早期リターン

## 外部依存

なし

## 注意事項

- 動的i18nキーの処理が現在未実装
- 言語判定ロジックがja/enのみ対応
- i18n値の空文字チェックが現在未実装
- URLの構造（3番目の要素が言語コード）に依存