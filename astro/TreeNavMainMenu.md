# TreeNavMainMenu 変更記録

元ファイル: `layouts/partials/treenav.html` の `define "mainmenu"` 部分

## 関数・変数の置換

| Hugo | Astro | 備考 |
| ---- | ----- | ---- |
| `.target` | `target` | Props として受け取り |
| `.curnode` | `curnode` | Props として受け取り |
| `.needtoc` | `needtoc` | Props として受け取り |
| `.tocregex` | `tocregex` | Props として受け取り |
| `.IsSection` | `curnode.isSection` | page プロパティ |
| `.Type` | `curnode.type` | page プロパティ |
| `.Params.disabled` | `curnode.params?.disabled` | page プロパティ |
| `.Site.Params.TargetRegion` | `env.targetRegion` | env プロパティ |
| `.IsHome` | `curnode.isHome` | page プロパティ |
| `.Site.RegularPages` | `env.siteHome?.pages` | 簡易実装 |
| `.Pages` | `curnode.pages` | page プロパティ |
| `.Sections` | `curnode.sections` | page プロパティ |
| `.IsAncestor` | `curnode.isAncestor?.(target)` | 関数として実装 |
| `.RelPermalink` | `curnode.relPermalink` | page プロパティ |
| `.Content` | `curnode.content` | page プロパティ |
| `findRE $tocregex $cont` | `curnode.content.match(new RegExp(tocregex, 'g'))` | JavaScript の正規表現 |
| `cond .IsHome` | `curnode.isHome ? ... : ...` | JavaScript の条件演算子 |
| `where .Site.RegularPages "Section" ""` | `pages.filter(p => p.sections === "")` | 簡易実装 |
| `add (len $pages) (len .Sections)` | `(pages.length \|\| 0) + (sections?.length \|\| 0)` | JavaScript の演算 |
| `len $tocs` | `tocs.length` | JavaScript のプロパティ |
| `in .Params.disabled .Site.Params.TargetRegion` | `curnode.params?.disabled?.includes(env.targetRegion)` | JavaScript の配列メソッド |

## TODO

- [ ] `where .Site.RegularPages "Section" ""` の正確な実装
- [ ] findRE の完全互換実装
- [ ] isAncestor 関数の実装確認

## 構造の変化

### return文の除去
- Hugo の `template` 再帰呼び出し → Astro コンポーネントの自己再帰
- フロントマター内のreturn文を条件付きレンダリングに変更

### TOC処理の簡素化
- Hugo の複雑な見出し抽出ロジック → JavaScript の正規表現match
- ループカウンターや前後の要素管理を配列のindexで代替

### 条件分岐の明確化
- セクション処理とページ処理を明確に分離
- `shouldRenderSection`/`shouldRenderPage`フラグによる制御

## その他の差分

### data-jstree属性の扱い
- Hugo の文字列結合 → JavaScript のテンプレートリテラル
- undefined の場合の適切な処理

### 配列操作の変更
- Hugo の `union` → JavaScript のスプレッド演算子
- より自然な配列操作

### null安全性
- optional chaining (`?.`) を多用
- デフォルト値の設定（`|| []`, `|| 0` など）

## 外部依存

### jsTree
- `data-jstree`属性による状態管理
- opened/selected状態の制御

## 注意事項

- このコンポーネントは自分自身を再帰的に呼び出すため、無限ループの可能性に注意
- disabled や特定のタイプの場合は何もレンダリングしない
- TOC生成は現在簡易実装のため、より精密な実装が必要