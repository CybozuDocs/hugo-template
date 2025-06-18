# TreeNavStatic 変更記録

元ファイル: `layouts/partials/treenav_static.html`

## 関数・変数の置換

| Hugo                      | Astro                                                           | 備考                      |
| ------------------------- | --------------------------------------------------------------- | ------------------------- |
| `$.Site.Home.Sections`    | `env.siteHomeSections`                                          | env プロパティに集約      |
| `$entries.ByWeight`       | `entries.sort((a, b) => (a.weight \|\| 0) - (b.weight \|\| 0))` | JavaScript のソート       |
| `template "staticmenu"`   | `<TreeNavStaticMenu ... />`                                     | 独立したコンポーネント    |
| `range $entries.ByWeight` | `sortedEntries.map((entry) => (...))`                           | JavaScript の配列メソッド |

## TODO

なし

## 構造の変化

### define の分離

- `define "staticmenu"` → `TreeNavStaticMenu.astro` として分離
- 再帰的な構造を維持しつつコンポーネント化

### 変数の管理

- Hugo の `$target` → Props として明示的に渡す
- `dict` による変数受け渡し → Props インターフェース

## その他の差分

### ソート処理

- Hugo の `ByWeight` → JavaScript の `sort()` メソッド
- weight が undefined の場合のデフォルト値を 0 に設定

### 配列操作

- Hugo の `range` → JavaScript の `map`
- より自然な配列処理

## 外部依存

なし（純粋なナビゲーション表示）

## 注意事項

- TreeNavと異なり、jsTreeライブラリは使用しない
- 静的なHTMLのみでナビゲーションを実現
- よりシンプルな構造のため、動的な開閉機能なし

## TreeNavとの違い

- jsTree機能なし
- TOC機能なし
- シンプルな階層表示のみ
- より軽量な実装
