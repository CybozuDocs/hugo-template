# Footer2Disclaimer 変更記録

元ファイル: `layouts/partials/footer2.html` (define "disclaimer"部分) と `layouts/partials/footer_gr6.html` (define "disclaimer"部分)

## 関数・変数の置換

| Hugo | Astro | 備考 |
| ---- | ----- | ---- |
| `{{ partial "disclaimer_pdf_url" (dict "languageCode" .languageCode )}}` | インライン実装 | PDF URL決定ロジックを統合 |
| `{{ i18n "MT_Disclaimer" }}` | `<Wovn>i18n__MT_Disclaimer</Wovn>` | WOVN対応 |
| `.languageCode` | `languageCode` | Propsとして受け取り |

## TODO

- [ ] PDF URLの管理方法の検討（設定ファイル化など）

## 構造の変化

### defineからコンポーネントへの分離

- Hugo の `define "disclaimer"` を独立したAstroコンポーネントとして実装
- Footer2とFooterGr6の両方で共通利用

### partialの統合

- `partial "disclaimer_pdf_url"` 呼び出し → ロジックを直接統合
- 別コンポーネントを呼び出す代わりに、同一コンポーネント内で処理

## その他の差分

### 使用箇所

- Footer2: フッターのメガメニュー内
- FooterGr6: フッターのメガメニュー内（同じ）

### HTML構造

- `<li class="footer-mega-list-item">` として出力
- Font AwesomeのPDFアイコン付き

## 外部依存

### 外部リンク

- cybozu.co.jpのPDFファイル（英語版・中国語版）

### CSS

- Font Awesomeアイコンを使用

## 注意事項

- Footer2とFooterGr6で共通のコンポーネントとして設計
- PDF URLがハードコードされているため、将来的には設定ファイル化を検討
- リスト項目として設計されているため、親要素で`<ul>`が必要