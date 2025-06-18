# Gtm 変更記録

元ファイル: `layouts/partials/gtm.html`

## 関数・変数の置換

| Hugo                 | Astro    | 備考                        |
| -------------------- | -------- | --------------------------- |
| `{{.key \| safeJS}}` | `gtmKey` | define:varsで安全に変数注入 |

## TODO

なし

## 構造の変化

### defineからコンポーネントへの変更

- Hugo の `define "gtm"` を独立したAstroコンポーネントとして実装
- Propsインターフェースを定義してkeyを受け取る形に変更

### スクリプト実行の安全性

- Hugo の `safeJS` フィルター → Astro の `define:vars` ディレクティブ
- `is:inline` でブラウザでの実行を保証

## その他の差分

### 変数注入方法

- Hugo: テンプレート内での直接埋め込み
- Astro: `define:vars` による安全な変数注入

## 外部依存

### Google Tag Manager

- Google Tag Manager スクリプトを読み込み
- GTMコンテナIDが必要

## 注意事項

- Google Tag Manager の設定が正しく行われている前提
- `is:inline` によりサーバーサイドで実行されずブラウザで実行される
- セキュリティ上、keyの値は信頼できるソースから取得する必要
