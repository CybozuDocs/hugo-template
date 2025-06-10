# Footer 変更記録

元ファイル: `layouts/partials/footer.html`

## 関数・変数の置換

| Hugo | Astro | 備考 |
| ---- | ----- | ---- |
| `{{ if ne $.Site.Params.preview_site true }}` | `if (env.previewSite) return null` | 早期リターンパターン |
| `{{ if eq $.Site.Params.id_search true }}` | `env.idSearch` | 条件分岐 |
| `{{ urls.Parse $.Site.BaseURL }}` | `new URL(env.baseURL)` | URL解析 |
| `{{ hasPrefix $u.Path "/g/" }}` | `basePath.startsWith('/g/')` | 文字列前方一致 |
| `{{ partial "footer2.html" . }}` | `<Footer2 env={env} page={page} />` | コンポーネント呼び出し |
| `{{ resources.Get $p }}` | 未実装 | TODO: CSVリソース読み込み |
| `{{ transform.Unmarshal }}` | 未実装 | TODO: CSV解析 |
| `{{ len $r }}` | `row.length` | 配列長取得 |
| `{{ index $r 0 }}` | `row[0]` | 配列インデックス |
| `{{ path.Base $target }}` | `href.split('/').pop()` | ファイル名取得 |
| `{{ strings.Count "search_id" $href }}` | `href.includes("search_id")` | 文字列検索 |
| `{{ i18n "Help_site" }}` | `<Wovn>i18n__Help_site</Wovn>` | WOVN対応 |
| `{{ i18n "Footer_copyright" }}` | `<Wovn>i18n__Footer_copyright</Wovn>` | WOVN対応 |
| `{{ printf "%s" "javascripts/geolocation.js" \| relURL }}` | `"javascripts/geolocation.js"` | 相対URL（簡易実装） |

## TODO

- [ ] CSVファイルの動的読み込み処理の実装
- [ ] resources.Getに相当するリソース読み込み機能
- [ ] transform.Unmarshalに相当するCSV解析機能
- [ ] relURL相当の処理の実装
- [ ] hugo.Environment相当の環境判定

## 構造の変化

### 条件分岐の早期リターン

- Hugo: ネストした条件分岐
- Astro: 早期リターンパターンでネストを回避

### コンポーネント分離

- Footer2コンポーネントを別ファイルに分離
- 条件に応じて適切なコンポーネントを返す

### データ処理の分離

- `processFooterData` 関数でデータ処理ロジックを分離
- CSVデータの構造を JavaScript オブジェクトに変換

## その他の差分

### URL処理

- Hugo: `urls.Parse`とフィールドアクセス
- Astro: JavaScript の `URL` オブジェクト

### 配列操作

- Hugo: `index`, `len`
- Astro: 配列インデックス、`.length`

### 文字列処理

- Hugo: `hasPrefix`, `strings.Count`
- Astro: `startsWith()`, `includes()`

## 外部依存

### スクリプト

- `javascripts/geolocation.js`（US地域のみ）

### CSS

- Font Awesomeアイコンを使用

### 外部サービス

- CookiePro（US地域の本番環境のみ）

## 注意事項

- CSVファイルの読み込み処理は現在未実装
- プレビューサイトでは表示されない機能
- US地域のみCookieSettings機能が有効