# TreeNav 変更記録

元ファイル: `layouts/partials/treenav.html`

## 関数・変数の置換

| Hugo                             | Astro                                                           | 備考                        |
| -------------------------------- | --------------------------------------------------------------- | --------------------------- |
| `$.Site.Home.Sections`           | `env.siteHomeSections`                                          | env プロパティに集約        |
| `$.Site.Params.template_version` | `env.templateVersion`                                           | env プロパティに集約        |
| `$.Site.Params.toc_in_tree`      | `env.tocInTree`                                                 | env プロパティに集約        |
| `$.Site.Params.product`          | `env.product`                                                   | env プロパティに集約        |
| `$.Site.Params.TargetRegion`     | `env.targetRegion`                                              | env プロパティに集約        |
| `$.Site.Params.preview_site`     | `env.previewSite`                                               | env プロパティに集約        |
| `.CurrentSection.Section`        | `page.currentSection?.sections`                                 | page プロパティ             |
| `.RelPermalink`                  | `page.relPermalink`                                             | page プロパティ             |
| `.Parent`                        | `page.parent`                                                   | page プロパティ             |
| `.FirstSection`                  | `page.firstSection`                                             | page プロパティ             |
| `.Pages`                         | `page.pages`                                                    | page プロパティ             |
| `.Sections`                      | `page.sections`                                                 | page プロパティ             |
| `slice`                          | `配列リテラル []`                                               | JavaScript の配列           |
| `range $lastpage`                | `for...of` ループ                                               | JavaScript の制御構文       |
| `in $.RelPermalink .`            | `page.relPermalink.includes(.)`                                 | JavaScript の文字列メソッド |
| `partial "title" .`              | `<Title page={.} env={env} />`                                  | コンポーネント呼び出し      |
| `template "mainmenu"`            | `<TreeNavMainMenu ... />`                                       | 独立したコンポーネント      |
| `(.Pages \| union .Sections)`    | `[...pages, ...sections]`                                       | スプレッド演算子            |
| `$entries.ByWeight`              | `entries.sort((a, b) => (a.weight \|\| 0) - (b.weight \|\| 0))` | JavaScript のソート         |

## TODO

- [ ] findRE の完全な実装（現在は簡易実装）
- [ ] TOC生成の最適化
- [ ] 複雑な階層構造の処理改善
- [ ] ulopen フラグの正確な実装

## 構造の変化

### define の分離

- `define "mainmenu"` → `TreeNavMainMenu.astro` として分離
- `define "treeitem"` → `TreeNavTreeItem.astro` として分離
- 再帰的な構造を維持しつつコンポーネント化

### TOC処理の簡素化

- Hugo の `findRE` → JavaScript の `match()` メソッド（簡易実装）
- 複雑なループ処理を配列のmapに変更

### 製品別設定の関数化

- 各製品のlastpagesを`getLastPagesByProduct()`関数で管理
- switch文による明確な分岐

## その他の差分

### 複雑な条件分岐の整理

- Hugo の入れ子になった条件分岐 → JavaScript の早期リターンパターン
- `shouldRenderSection`/`shouldRenderPage`フラグによる制御

### 変数の管理

- Hugo の複数の変数（$link1, $title1, $link2, $title2等）→ JavaScript のオブジェクト
- より構造化されたデータ管理

### 階層構造の処理

- `$parenttree`フラグ → `parenttree`変数
- 親子関係の判定ロジックをより明確に

## 外部依存

### jsTree

- `data-jstree`属性を使用したツリー表示ライブラリ
- opened/selected状態の管理

### Font Awesome

- `fas fa-times` アイコンの使用

## 注意事項

- 元のファイルが261行と非常に複雑だったため、機能を段階的に実装
- TOC生成は簡易実装のため、完全な互換性のためには追加実装が必要
- jsTreeライブラリとの連携を前提とした実装
- 再帰的なコンポーネント構造のため、無限ループに注意が必要
