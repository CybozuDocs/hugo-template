# TreeNavStaticMenu 変更記録

元ファイル: `layouts/partials/treenav_static.html` の `define "staticmenu"` 部分

## 関数・変数の置換

| Hugo                            | Astro                                                           | 備考                     |
| ------------------------------- | --------------------------------------------------------------- | ------------------------ |
| `.target`                       | `target`                                                        | Props として受け取り     |
| `.curnode`                      | `curnode`                                                       | Props として受け取り     |
| `.IsSection`                    | `curnode.isSection`                                             | page プロパティ          |
| `.RelPermalink`                 | `curnode.relPermalink`                                          | page プロパティ          |
| `.Pages`                        | `curnode.pages`                                                 | page プロパティ          |
| `.Sections`                     | `curnode.sections`                                              | page プロパティ          |
| `partial "title" . \| safeHTML` | `<Title page={curnode} env={env} />`                            | コンポーネント呼び出し   |
| `(.Pages \| union .Sections)`   | `[...(curnode.pages \|\| []), ...(curnode.sections \|\| [])]`   | スプレッド演算子         |
| `$entries.ByWeight`             | `entries.sort((a, b) => (a.weight \|\| 0) - (b.weight \|\| 0))` | JavaScript のソート      |
| `template "staticmenu"`         | `<TreeNavStaticMenu ... />`                                     | コンポーネントの自己再帰 |
| `with $curnode`                 | 条件分岐と早期リターン                                          | より明確な制御フロー     |

## TODO

なし

## 構造の変化

### return文の除去

- Hugo の `template` 再帰呼び出し → Astro コンポーネントの自己再帰
- フロントマター内のreturn文を条件付きレンダリングに変更

### 処理の分岐明確化

- セクション処理とページ処理を明確に分離
- `shouldRenderSection`/`shouldRenderPage`フラグによる制御

### 配列操作の変更

- Hugo の `union` → JavaScript のスプレッド演算子
- より自然な配列操作

## その他の差分

### 条件分岐の簡素化

- Hugo の複雑な `if-else-end` → JavaScript の条件演算子
- より読みやすい条件分岐

### CSS クラスの動的生成

- selected状態に応じたクラス名の動的生成
- より明確な状態管理

### null安全性

- optional chaining (`?.`) を使用
- デフォルト値の設定（`|| []`, `|| 0` など）

## 外部依存

なし（純粋なナビゲーション表示）

## 注意事項

- このコンポーネントは自分自身を再帰的に呼び出すため、無限ループの可能性に注意
- 静的表示のため、TreeNavMainMenuよりもシンプル
- jsTreeのような動的機能は含まない
- current状態の表示のみサポート
