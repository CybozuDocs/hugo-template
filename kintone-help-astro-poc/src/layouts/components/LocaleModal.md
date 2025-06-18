# LocaleModal 変更記録

元ファイル: `layouts/partials/localemodal.html`

## 関数・変数の置換

| Hugo                                            | Astro                                     | 備考                   |
| ----------------------------------------------- | ----------------------------------------- | ---------------------- |
| `{{ i18n "Locale_modal_message" \| safeHTML }}` | `<Wovn>i18n__Locale_modal_message</Wovn>` | WOVN対応、HTML安全出力 |
| `{{ i18n "Yes" }}`                              | `<Wovn>i18n__Yes</Wovn>`                  | WOVN対応               |
| `{{ i18n "No" }}`                               | `<Wovn>i18n__No</Wovn>`                   | WOVN対応               |

## TODO

なし

## 構造の変化

なし（シンプルな構造のため変更最小限）

## その他の差分

### 属性名の修正

- Hugo: `aria-moda="true"` → Astro: `aria-modal="true"`（タイポ修正）

### HTML出力の安全性

- Hugo: `| safeHTML` フィルター
- Astro: Wovnコンポーネント内で安全に処理される想定

## 外部依存

### JavaScript

- モーダルの表示/非表示制御（別途実装される想定）

### CSS

- モーダルのスタイリング

## 注意事項

- `aria-moda` のタイポを修正（元コードの問題）
- モーダルの動作はJavaScriptで制御される想定
- `safeHTML` の機能はWovnコンポーネントで適切に処理される必要
