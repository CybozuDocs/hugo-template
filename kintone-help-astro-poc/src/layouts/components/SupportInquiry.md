# SupportInquiry 変更記録

元ファイル: `layouts/partials/support_inquiry.html`

## 関数・変数の置換

| Hugo                          | Astro                                | 備考     |
| ----------------------------- | ------------------------------------ | -------- |
| `{{ i18n "Contact_support"}}` | `<Wovn>i18n__Contact_support</Wovn>` | WOVN対応 |

## TODO

なし

## 構造の変化

### スクリプトの処理

- `is:inline` ディレクティブを追加してHubSpotスクリプトの適切な実行を保証

## その他の差分

### スクリプト実行

- Astro: `is:inline` でブラウザでの直接実行を指定

## 外部依存

### HubSpot

- HubSpot のCTAボタン機能
- HubSpot の埋め込みスクリプト（1857320.js）

### CSS

- Font Awesomeアイコン（ヘッドセット）

## 注意事項

- HubSpotの特定のCTAボタンID（187693642597）がハードコード
- HubSpotスクリプトIDが固定値（1857320）
- サポート問い合わせ機能のため、HubSpotの設定が必要
