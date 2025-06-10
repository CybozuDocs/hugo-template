# Footer2 変更記録

元ファイル: `layouts/partials/footer2.html`

## 関数・変数の置換

| Hugo | Astro | 備考 |
| ---- | ----- | ---- |
| `{{ $sep := "\t" }}` | `const sep = "\t"` | 区切り文字定数 |
| `{{ $legal_menu := slice }}` | `const legalMenu: string[] = []` | 配列初期化 |
| `{{ $mega_menus := dict }}` | `const megaMenus: { [key: string]: string[] } = {}` | オブジェクト初期化 |
| `{{ resources.Get $p }}` | 未実装 | TODO: CSVリソース読み込み |
| `{{ transform.Unmarshal }}` | 未実装 | TODO: CSV解析 |
| `{{ printf "%s%s%s%s%s" }}` | テンプレートリテラル | 文字列結合 |
| `{{ $legal_menu \| append $item }}` | `legalMenu.push(item)` | 配列追加 |
| `{{ merge $mega_menus }}` | `megaMenus[id] = menuItems` | オブジェクト更新 |
| `{{ urls.Parse $.Site.BaseURL }}` | `new URL(env.baseURL)` | URL解析 |
| `{{ hasPrefix $u.Path "/k/" }}` | `basePath.startsWith('/k/')` | 文字列前方一致 |
| `{{ range $index, $val := $mega_menus }}` | `Object.entries(megaMenus).map()` | オブジェクト反復 |
| `{{ split $r $sep }}` | `r.split(sep)` | 文字列分割 |
| `{{ eq $status "jaonly" }}` | `status === "jaonly"` | 文字列比較 |
| `{{ i18n "Only_ja" }}` | `<Wovn>i18n__Only_ja</Wovn>` | WOVN対応 |
| `{{ template "disclaimer" }}` | `<Footer2Disclaimer />` | コンポーネント呼び出し |
| `{{ i18n "Footer_copyright" }}` | `<Wovn>i18n__Footer_copyright</Wovn>` | WOVN対応 |

## TODO

- [ ] CSVファイルの動的読み込み処理の実装
- [ ] resources.Getに相当するリソース読み込み機能
- [ ] transform.Unmarshalに相当するCSV解析機能
- [ ] hugo.Environment相当の環境判定

## 構造の変化

### defineからコンポーネントへの分離

- `define "disclaimer"` → `Footer2Disclaimer.astro`として分離
- テンプレート呼び出し → コンポーネントimport

### データ処理の分離

- CSVデータの処理ロジックを関数として分離
- Hugo の変数操作 → JavaScript のオブジェクト/配列操作

### 条件分岐の変更

- Hugo の `range` → JavaScript の `map` と `forEach`
- Hugo の `if` → JSX の条件レンダリング

## その他の差分

### 配列・オブジェクト操作

- Hugo: `slice`, `dict`, `append`, `merge`
- Astro: JavaScript の標準的な配列・オブジェクト操作

### 文字列処理

- Hugo: `printf`, `split`
- Astro: テンプレートリテラル、`split()`

### URL処理

- Hugo: `urls.Parse`
- Astro: JavaScript の `URL` オブジェクト

## 外部依存

### スクリプト

- `javascripts/geolocation.js`（US地域のみ）

### CSS

- Font Awesomeアイコンを使用

### 外部サービス

- CookiePro（US地域の本番環境のみ）

## 注意事項

- CSVファイルの読み込み処理は現在未実装
- フルサイズ表示の判定ロジックがFooterと異なる
- disclaimerの挿入条件がGaroonとFooterGr6で異なる