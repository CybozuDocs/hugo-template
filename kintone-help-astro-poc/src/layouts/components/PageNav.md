# PageNav 変更記録

元ファイル: `layouts/partials/pagenav.html`

## 関数・変数の置換

| Hugo | Astro | 備考 |
| ---- | ----- | ---- |
| `{{ i18n "Previous_page" }}` | `<Wovn>i18n__Previous_page</Wovn>` | WOVN 対応 |
| `{{ i18n "Next_page" }}` | `<Wovn>i18n__Next_page</Wovn>` | WOVN 対応 |
| `.NextInSection` | `page.nextInSection` | page プロパティ |
| `.PrevInSection` | `page.prevInSection` | page プロパティ |
| `.Permalink` | `.permalink` | プロパティ名 |
| `{{ with }}` | `{variable && (...)}` | JavaScript の条件式 |

## TODO

なし

## 構造の変化

### 条件分岐の変更
- Hugo の `{{ with }}` → JavaScript の `&&` 演算子
- より簡潔な条件付きレンダリング

## その他の差分

### プロパティ名の統一
- Hugo の `.Permalink` → Astro の `.permalink`（小文字）
- 型定義に合わせた命名規則

## 外部依存

### Font Awesome
- `<i class="fas fa-caret-left">` / `<i class="fas fa-caret-right">` アイコンの使用

## 注意事項

- nextInSection/prevInSection が存在しない場合は何も表示されない
- ページナビゲーションは現在のセクション内でのみ動作