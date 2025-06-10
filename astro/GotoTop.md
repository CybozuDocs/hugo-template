# GotoTop 変更記録

元ファイル: `layouts/partials/gototop.html`

## 関数・変数の置換

| Hugo                        | Astro                        | 備考                    |
| --------------------------- | ---------------------------- | ----------------------- |
| `{{i18n "Go_back_to_top"}}` | `i18n__todo__Go_back_to_top` | title 属性内のため TODO |

## TODO

- [ ] title 属性の i18n 対応方法の検討

## 構造の変化

なし

## その他の差分

なし

## 外部依存

- Font Awesome のアイコンを使用
  - `fa-stack`: スタック用のコンテナクラス
  - `fas fa-circle fa-stack-2x`: 背景の円アイコン
  - `fas fa-arrow-circle-up fa-stack-1x`: 上向き矢印アイコン

## 注意事項

- シンプルなコンポーネントのため、env や page プロパティは使用していない
- title 属性内の i18n は WOVN コンポーネントを使用できないため、TODO として記録
