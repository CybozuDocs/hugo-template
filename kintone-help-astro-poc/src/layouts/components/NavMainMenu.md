# NavMainMenu 変更記録

元ファイル: `layouts/partials/nav.html` の `define "mainmenu"` 部分

## 関数・変数の置換

| Hugo                                            | Astro                                                  | 備考                      |
| ----------------------------------------------- | ------------------------------------------------------ | ------------------------- |
| `.target`                                       | `target`                                               | Props として受け取り      |
| `.curnode`                                      | `curnode`                                              | Props として受け取り      |
| `.IsSection`                                    | `curnode.isSection`                                    | page プロパティ           |
| `.IsHome`                                       | `curnode.isHome`                                       | page プロパティ           |
| `.Site.RegularPages`                            | `env.siteHome?.pages`                                  | 簡易実装                  |
| `.Pages`                                        | `curnode.pages`                                        | page プロパティ           |
| `.Sections`                                     | `curnode.sections`                                     | page プロパティ           |
| `.Params.disabled`                              | `curnode.params?.disabled`                             | page プロパティ           |
| `.Site.Params.TargetRegion`                     | `env.targetRegion`                                     | env プロパティ            |
| `.IsAncestor $target`                           | `curnode.isAncestor?.(target)`                         | 関数として実装            |
| `.RelPermalink`                                 | `curnode.relPermalink`                                 | page プロパティ           |
| `partial "title" .`                             | `<Title page={curnode} env={env} />`                   | コンポーネント呼び出し    |
| `.Scratch.Set` / `.Scratch.Get`                 | `let entries = []`                                     | JavaScript 変数           |
| `union`                                         | `[...pages, ...sections]`                              | スプレッド演算子          |
| `cond`                                          | `条件演算子 ?:`                                        | JavaScript の条件演算子   |
| `where .Site.RegularPages "Section" ""`         | `pages.filter(p => p.sections === "")`                 | 簡易実装                  |
| `add (len $pages) (len .Sections)`              | `(pages.length \|\| 0) + (sections?.length \|\| 0)`    | JavaScript の演算         |
| `in .Params.disabled .Site.Params.TargetRegion` | `curnode.params?.disabled?.includes(env.targetRegion)` | JavaScript の配列メソッド |

## TODO

- [ ] `where .Site.RegularPages "Section" ""` の正確な実装
- [ ] isAncestor 関数の実装確認
- [ ] sections プロパティの型定義確認

## 構造の変化

### 再帰的なコンポーネント

- Hugo の `template "mainmenu"` 再帰呼び出し → Astro コンポーネントの自己再帰
- 同じコンポーネント内で自分自身を呼び出す構造

### Scratch変数の代替

- Hugo の `.Scratch` → JavaScript のローカル変数 `entries`
- Set/Get パターン → 直接的な変数操作

### 条件分岐の明確化

- Hugo の `with` → JavaScript の条件分岐と early return
- より明確な制御フロー

## その他の差分

### null 安全性

- optional chaining (`?.`) を多用して null/undefined エラーを防止
- デフォルト値の設定（`|| 0`, `|| []` など）

### CSS クラスの動的生成

- テンプレートリテラルとJavaScript の条件演算子を使用
- より読みやすい条件付きクラス名の生成

## 外部依存

### Font Awesome

- `fa-chevron-down` / `fa-chevron-right` アイコンの使用

## 注意事項

- このコンポーネントは自分自身を再帰的に呼び出すため、無限ループの可能性に注意
- disabled の場合は `null` を返却してレンダリングをスキップ
- isSection の場合とページの場合で異なる処理フローを持つ
