# PageNav2 変更記録

元ファイル: `layouts/partials/pagenav2.html`

## 関数・変数の置換

| Hugo                                   | Astro                                      | 備考                    |
| -------------------------------------- | ------------------------------------------ | ----------------------- |
| `{{ i18n "Previous_page" }}`           | `<Wovn>i18n__Previous_page</Wovn>`         | WOVN 対応               |
| `{{ i18n "Next_page" }}`               | `<Wovn>i18n__Next_page</Wovn>`             | WOVN 対応               |
| `.Site.Pages.Next .`                   | `page.siteNext`                            | page プロパティ         |
| `.Site.Pages.Prev .`                   | `page.sitePrev`                            | page プロパティ         |
| `.Permalink`                           | `.permalink`                               | プロパティ名            |
| `.IsHome`                              | `.isHome`                                  | プロパティ名            |
| `{{ if eq (.Site.Pages.Next .) nil }}` | `{page.siteNext === null ? (...) : (...)}` | JavaScript の条件演算子 |
| `{{ if ne (.Site.Pages.Prev .) nil }}` | `{page.sitePrev !== null && ...}`          | JavaScript の論理演算子 |
| `{{ if ne .IsHome true }}`             | `{!page.sitePrev.isHome && (...)}`         | JavaScript の否定演算子 |

## TODO

なし

## 構造の変化

### 条件分岐の複雑化対応

- Hugo の複雑な `if-else` 構造 → JavaScript の条件演算子と論理演算子の組み合わせ
- null チェックの明示的な実装

### 空要素の扱い

- Hugo の空の `<div class="pagination-previous"></div>` → そのまま維持
- レイアウト保持のための空要素

## その他の差分

### kintone tutorial の特別な処理

- home page が表示されない仕様をコメントとして記載
- `!page.sitePrev.isHome` での条件分岐で実装

### aria-hidden 属性

- アクセシビリティ対応のため `aria-hidden="true"` を維持

## 外部依存

### Font Awesome

- `<i class="fas fa-caret-left">` / `<i class="fas fa-caret-right">` アイコンの使用

## 注意事項

- PageNav との違いは、セクション内ナビゲーション (.NextInSection) ではなく、サイト全体のページナビゲーション (.Site.Pages.Next/Prev) を使用すること
- null と undefined の区別に注意が必要
- kintone tutorial のホームページは Next ナビゲーションに表示されない仕様
