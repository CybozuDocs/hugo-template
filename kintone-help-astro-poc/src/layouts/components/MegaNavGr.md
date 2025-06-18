# MegaNavGr 変更記録

元ファイル: `layouts/partials/meganav_gr.html`

## 関数・変数の置換

| Hugo                                    | Astro                                                           | 備考                        |
| --------------------------------------- | --------------------------------------------------------------- | --------------------------- |
| `{{ i18n "Document_type" }}`            | `i18n__todo__Document_type`                                     | aria-label内のためTODO      |
| `{{ i18n "By_features" }}`              | `<Wovn>i18n__By_features</Wovn>`                                | WOVN 対応                   |
| `{{ i18n "Header_nav_faq" }}`           | `<Wovn>i18n__Header_nav_faq</Wovn>`                             | WOVN 対応                   |
| `$.Site.Home.Sections`                  | `env.siteHomeSections`                                          | env プロパティに集約        |
| `$.Site.BaseURL`                        | `env.baseURL`                                                   | env プロパティに集約        |
| `$.Site.Params.faq_link`                | `env.faqLink`                                                   | env プロパティに集約        |
| `.FirstSection`                         | `page.firstSection`                                             | page プロパティ             |
| `.CurrentSection`                       | `entry.currentSection`                                          | page プロパティ             |
| `.IsHome`                               | `page.isHome`                                                   | page プロパティ             |
| `.Params.type`                          | `page.params?.type`                                             | page プロパティ             |
| `.Params.weight`                        | `entry.params?.weight`                                          | page プロパティ             |
| `.Params.nolink`                        | `page.params?.nolink`                                           | page プロパティ             |
| `.RelPermalink`                         | `entry.relPermalink`                                            | page プロパティ             |
| `newScratch` / `.scratch.Set/.Get`      | JavaScript変数とgetSecondSection関数                            | 関数化                      |
| `template "getsecond"`                  | `getSecondSection()`                                            | JavaScript関数として実装    |
| `template "sectbar"`                    | `<MegaNavGrSectBar ... />`                                      | 独立したコンポーネント      |
| `template "megapanel"`                  | `<MegaNavGrMegaPanel ... />`                                    | 独立したコンポーネント      |
| `template "titleicon"`                  | `<MegaNavGrTitleIcon ... />`                                    | 独立したコンポーネント      |
| `$entries.ByWeight`                     | `entries.sort((a, b) => (a.weight \|\| 0) - (b.weight \|\| 0))` | JavaScript のソート         |
| `resources.Get` / `transform.Unmarshal` | `getIconFromCSV()`                                              | 簡易実装（要改善）          |
| `urls.Parse`                            | `new URL()`                                                     | JavaScript のURL API        |
| `range $entries.ByWeight`               | `sortedEntries.map((entry) => (...))`                           | JavaScript の配列メソッド   |
| `len $rootsect.Pages`                   | `rootsect?.pages?.length \|\| 0`                                | JavaScript のプロパティ     |
| `gt $seconditems 0`                     | `seconditems > 0`                                               | JavaScript の比較演算子     |
| `in $rootsect "video"`                  | `rootsect.relPermalink?.includes("video")`                      | JavaScript の文字列メソッド |
| `add $menuid 1`                         | `menuid += 1`                                                   | JavaScript の演算子         |

## TODO

- [ ] 実際のCSVファイル（common/csv/icon_images.csv）からの読み込み処理を実装
- [ ] aria-label内のi18n対応
- [ ] エラーハンドリングの追加（warnf相当）
- [ ] より精密なSecond Section判定ロジック

## 構造の変化

### define の分離

- `define "getsecond"` → `MegaNavGrGetSecond.astro`（JavaScript関数として実装）
- `define "sectbar"` → `MegaNavGrSectBar.astro` として分離
- `define "megapanel"` → `MegaNavGrMegaPanel.astro` として分離
- `define "titleicon"` → `MegaNavGrTitleIcon.astro` として分離

### Scratch変数の代替

- Hugo の `newScratch` + `Set/Get` → JavaScript のローカル変数と関数
- より明示的な状態管理

### CSVファイル処理の簡易実装

- Hugo の `resources.Get` + `transform.Unmarshal` → `getIconFromCSV()` 関数による簡易実装
- 実際のCSVファイル読み込みは後日実装が必要

## その他の差分

### 複雑な条件分岐の整理

- Hugo の入れ子になった条件分岐 → JavaScript の配列メソッドと早期リターン
- より読みやすい制御フロー

### URL処理

- Hugo の `urls.Parse` → JavaScript の `URL` constructor
- より標準的なURL処理

### 配列操作の変更

- Hugo の `range` → JavaScript の `map` + `filter`
- より柔軟な配列操作

## 外部依存

### Font Awesome

- 多数のアイコンクラスを使用
- `fas fa-external-link-alt`, `fas fa-chevron-down`, `far fa-circle` など

### CSVデータファイル

- `common/csv/icon_images.csv` ファイル（現在は簡易実装で代替）
- アイコンマッピング情報

## 注意事項

- 現在の実装は簡易版のため、実際のCSVファイル読み込み処理が必要
- アイコンマッピングはハードコードされており、実際のデータで置き換えが必要
- 複雑な階層構造とタブ機能を含むため、JavaScript での動的な動作が前提
- アクセシビリティ属性（role, aria-\*）を適切に維持

## MegaNavKt との違い

- Garoon用の特化された機能（Second Section判定など）
- CSVファイルからのアイコン読み込み
- より複雑な階層構造の処理
- タブバーとパネルの組み合わせ
