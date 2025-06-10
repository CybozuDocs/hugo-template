# Nav 変更記録

元ファイル: `layouts/partials/nav.html`

## 関数・変数の置換

| Hugo | Astro | 備考 |
| ---- | ----- | ---- |
| `$.Site.Home.Sections` | `env.siteHomeSections` | env プロパティに集約 |
| `$entries.ByWeight` | `entries.sort((a, b) => (a.weight \|\| 0) - (b.weight \|\| 0))` | JavaScript のソート |
| `template "mainmenu"` | `<NavMainMenu ... />` | 独立したコンポーネント |
| `range` | `map()` | JavaScript の配列メソッド |

## TODO

- [ ] siteHomeSections の型定義確認
- [ ] isAncestor 関数の実装確認

## 構造の変化

### define の分離
- `define "mainmenu"` → `NavMainMenu.astro` として分離
- 再帰的な構造を維持しつつコンポーネント化

### 変数の管理
- Hugo の `.target` → Props として明示的に渡す
- `dict` による変数受け渡し → Props インターフェース

## その他の差分

### ソート処理
- Hugo の `ByWeight` → JavaScript の `sort()` メソッド
- weight が undefined の場合のデフォルト値を 0 に設定

## 外部依存

### Font Awesome
- `<i class="fa fa-chevron-down">` / `<i class="fa fa-chevron-right">` アイコンの使用

## 注意事項

- 再帰的なコンポーネント構造のため、NavMainMenu コンポーネントが自分自身を呼び出す
- disabled チェックの結果、何も表示しない場合は `null` を返却