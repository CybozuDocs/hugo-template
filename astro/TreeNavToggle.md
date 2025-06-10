# TreeNavToggle 変更記録

元ファイル: `layouts/partials/treenav_toggle.html`

## 関数・変数の置換

| Hugo | Astro | 備考 |
| ---- | ----- | ---- |
| `{{i18n "Side_navigation_show"}}` | `i18n__todo__Side_navigation_show` | title属性内のためTODO |
| `{{i18n "Side_navigation_hide"}}` | `i18n__todo__Side_navigation_hide` | title属性内のためTODO |

## TODO

- [ ] title属性の i18n 対応方法の検討

## 構造の変化

なし（非常にシンプルなコンポーネント）

## その他の差分

### Props の定義
- BasePropsを継承しているが、実際にはenvやpageは使用していない
- 将来的な拡張性のために保持

### i18n の制限
- title属性内でのi18n使用のため、現在はプレースホルダー文字列

## 外部依存

### Font Awesome
- `<i class="fas fa-chevron-right">` / `<i class="fas fa-chevron-left">` アイコンの使用

### JavaScript
- ボタンのクリックイベント処理は別途JavaScript実装が必要
- `#treenav-show` / `#treenav-hide` IDによる制御

## 注意事項

- 非常にシンプルなUI要素
- 実際の機能はJavaScriptで実装される想定
- アクセシビリティ対応のため `aria-hidden="true"` を適切に使用

## 用途

- サイドナビゲーションの表示/非表示を制御するトグルボタン
- ユーザビリティ向上のためのUI要素
- レスポンシブデザインでの使用を想定