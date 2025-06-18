# FooterGr6 変更記録

元ファイル: `layouts/partials/footer_gr6.html`

## 関数・変数の置換

| Hugo                                      | Astro                                               | 備考                          |
| ----------------------------------------- | --------------------------------------------------- | ----------------------------- |
| `{{ $sep := "\t" }}`                      | `const sep = "\t"`                                  | 区切り文字定数                |
| `{{ $legal_menu := slice }}`              | `const legalMenu: string[] = []`                    | 配列初期化                    |
| `{{ $mega_menus := dict }}`               | `const megaMenus: { [key: string]: string[] } = {}` | オブジェクト初期化            |
| `{{ split $p "/" }}`                      | `footerLinksPath.split('/')`                        | パス分割処理                  |
| `{{ printf "%s/%s/%s" }}`                 | テンプレートリテラル                                | パス再構築                    |
| `{{ resources.Get $p }}`                  | 未実装                                              | TODO: CSVリソース読み込み     |
| `{{ transform.Unmarshal }}`               | 未実装                                              | TODO: CSV解析                 |
| `{{ printf "%s%s%s" }}`                   | テンプレートリテラル                                | 文字列結合（footer2より短い） |
| `{{ $legal_menu \| append $item }}`       | `legalMenu.push(item)`                              | 配列追加                      |
| `{{ merge $mega_menus }}`                 | `megaMenus[id] = menuItems`                         | オブジェクト更新              |
| `{{ range $index, $val := $mega_menus }}` | `Object.entries(megaMenus).map()`                   | オブジェクト反復              |
| `{{ split $r $sep }}`                     | `r.split(sep)`                                      | 文字列分割                    |
| `{{ template "disclaimer" }}`             | `<Footer2Disclaimer />`                             | コンポーネント呼び出し        |
| `{{ i18n "Footer_copyright" }}`           | `<Wovn>i18n__Footer_copyright</Wovn>`               | WOVN対応                      |

## TODO

- [ ] CSVファイルの動的読み込み処理の実装
- [ ] resources.Getに相当するリソース読み込み機能
- [ ] transform.Unmarshalに相当するCSV解析機能
- [ ] パス変換処理（remove later部分）の永続化判断

## 構造の変化

### defineからコンポーネントへの分離

- `define "disclaimer"` → `Footer2Disclaimer.astro`として分離（Footer2と共通）
- テンプレート呼び出し → コンポーネントimport

### パス変換処理の実装

- `remove later` コメント部分のパス変換処理を実装
- `csv/lang/file.csv` → `lang/csv/file.csv` の変換

### HTMLタグの違い

- Footer2: `<h2 class="footer-mega-list-title">`
- FooterGr6: `<div class="footer-mega-list-title">`（タグが異なる）

## その他の差分

### データ形式の違い

- Footer2: 4カラム形式（target情報含む）
- FooterGr6: 3カラム形式（targetなし）

### プロダクト条件の違い

- Footer2: Garoon製品の場合のみdisclaimer挿入
- FooterGr6: 製品条件なしでdisclaimer挿入

### フルサイズ条件

- Footer2: `page.isHome || basePath.startsWith('/k/')`
- FooterGr6: `page.isHome` のみ

## 外部依存

### CSS

- Font Awesomeアイコンを使用

### データファイル

- CSVファイルの読み込み（パス変換あり）

## 注意事項

- CSVファイルの読み込み処理は現在未実装
- Footer2との差分（HTMLタグ、データ形式）に注意
- パス変換処理は一時的な対応（remove later）
