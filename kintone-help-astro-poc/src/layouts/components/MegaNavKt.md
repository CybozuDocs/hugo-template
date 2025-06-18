# MegaNavKt 変更記録

元ファイル: `layouts/partials/meganav_kt.html`

## 関数・変数の置換

| Hugo                               | Astro                              | 備考                        |
| ---------------------------------- | ---------------------------------- | --------------------------- |
| `{{ i18n "Document_type" }}`       | `i18n__todo__Document_type`        | aria-label内のためTODO      |
| `{{ i18n "Tab_menu" }}`            | `i18n__todo__Tab_menu`             | aria-label内のためTODO      |
| `$.Site.Params.product`            | `env.product`                      | env プロパティに集約        |
| `$.Site.Params.TargetRegion`       | `env.targetRegion`                 | env プロパティに集約        |
| `$.Lang`                           | `page.lang`                        | page プロパティ             |
| `$.IsHome`                         | `page.isHome`                      | page プロパティ             |
| `$.Params.type`                    | `page.params?.type`                | page プロパティ             |
| `.RelPermalink`                    | `page.relPermalink`                | page プロパティ             |
| `resources.Get`                    | `getMenuData()`                    | 簡易実装（要改善）          |
| `transform.Unmarshal`              | JavaScript配列操作                 | CSV解析の代替               |
| `slice`                            | `配列リテラル []`                  | JavaScript の配列           |
| `append`                           | `...スプレッド演算子`              | JavaScript の配列操作       |
| `index $r 0`                       | `配列[インデックス]`               | JavaScript の配列アクセス   |
| `printf "%d" $tabnum`              | `tabnum.toString()`                | JavaScript の文字列変換     |
| `strings.TrimSuffix ".html"`       | `.replace(/\.html$/, '')`          | JavaScript の正規表現       |
| `split $baseurl "/"`               | `baseurl.split('/')`               | JavaScript の文字列メソッド |
| `len $baseparts`                   | `baseparts.length`                 | JavaScript のプロパティ     |
| `strings.Count $menuhref $baseurl` | `includes()`                       | 簡易実装                    |
| `add $menuid 1`                    | `menuid++`                         | JavaScript の演算子         |
| `seq $panelcnt`                    | `Array.from({ length: panelcnt })` | JavaScript の配列生成       |
| `range $i, $curpan := seq`         | `map((_, i) => {...})`             | JavaScript の配列メソッド   |

## TODO

- [ ] CSVファイルの実際の読み込み処理を実装
- [ ] aria-label内のi18n対応
- [ ] menuitems\_\*.csvファイルの動的読み込み
- [ ] エラーハンドリングの追加
- [ ] warnf 相当の警告処理の実装

## 構造の変化

### CSVファイル処理の簡易実装

- Hugo の `resources.Get` + `transform.Unmarshal` → `getMenuData()` 関数による簡易実装
- 実際のCSVファイル読み込みは後日実装が必要

### 複雑なループ処理の関数化

- Hugo の複雑な `range` ループ → `generateMenuItems()` / `generatePanelContent()` 関数
- 可読性とメンテナンス性の向上

### Scratch変数の代替

- Hugo の暗黙的な変数管理 → JavaScript のローカル変数
- より明示的な状態管理

## その他の差分

### 配列操作の変更

- Hugo の `slice` + `append` → JavaScript の配列リテラルとスプレッド演算子
- より自然な配列操作

### 文字列処理の変更

- Hugo の `strings.*` 関数群 → JavaScript の文字列メソッドと正規表現
- より柔軟な文字列操作

### 条件分岐の最適化

- 複雑な条件式をより読みやすい形に分割
- early return パターンの活用

## 外部依存

### Font Awesome

- `fas fa-chevron-down` アイコンの使用

### CSVデータファイル

- `menuitems_*.csv` ファイル（言語・地域別）
- 現在は簡易実装で代替

## 注意事項

- 現在の実装は簡易版のため、実際のCSVファイル読み込み処理が必要
- メニューデータのフォールバック処理を実装する必要がある
- アクセシビリティ属性（role, aria-\*）を適切に維持
- JavaScript での動的な動作（タブ切り替え等）は別途実装が必要
