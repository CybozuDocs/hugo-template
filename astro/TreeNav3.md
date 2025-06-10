# TreeNav3 変更記録

元ファイル: `layouts/partials/treenav3.html`

## 関数・変数の置換

| Hugo | Astro | 備考 |
| ---- | ----- | ---- |
| `$.Site.Params.template_version` | `env.templateVersion` | env プロパティに集約 |
| `{{ if eq $.Site.Params.template_version "2" }}` | `{env.templateVersion === "2" && (...)}` | JavaScript の条件式 |

## TODO

なし（非常にシンプルなコンポーネント）

## 構造の変化

### 条件分岐の簡略化
- Hugo の `if-end` → JavaScript の `&&` 演算子
- より簡潔な条件付きレンダリング

## その他の差分

### Props の最小化
- `page` プロパティは未使用のため削除
- `env` のみを使用

## 外部依存

### Font Awesome
- `<i class="fas fa-times">` アイコンの使用

## 注意事項

- 空のツリーナビゲーション構造のみ提供
- JavaScript によって動的にコンテンツが追加される前提
- テンプレートバージョン2でのみモバイル用クローズボタンを表示

## 用途

- 動的にツリーナビゲーションを生成する際のベース構造
- JavaScriptライブラリ（jsTreeなど）による後からの内容追加を想定
- 最小限のHTML構造のみを提供