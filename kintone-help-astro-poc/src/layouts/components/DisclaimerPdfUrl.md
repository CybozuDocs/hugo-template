# DisclaimerPdfUrl 変更記録

元ファイル: `layouts/partials/disclaimer_pdf_url.html`

## 関数・変数の置換

| Hugo                                                             | Astro                                                    | 備考                   |
| ---------------------------------------------------------------- | -------------------------------------------------------- | ---------------------- |
| `{{ .languageCode }}`                                            | `languageCode`                                           | Props として受け取り   |
| `{{ or (eq $languageCode "zh-cn") (eq $languageCode "zh-jp") }}` | `languageCode === "zh-cn" \|\| languageCode === "zh-jp"` | 論理演算子の変更       |
| `{{ return $pdf_url }}`                                          | `export { pdfUrl }`                                      | モジュールエクスポート |

## TODO

- [ ] より良いエクスポート方法の検討
- [ ] 設定ファイルからのURL管理への移行

## 構造の変化

### returnからexportへ

- Hugo の `return` → ES6モジュールの `export`
- 文字列返却 → エクスポートされた変数

### 使用パターンの変更

- Hugo: `{{ partial "disclaimer_pdf_url" (dict "languageCode" $.Site.LanguageCode )}}`
- Astro: 他のコンポーネント内で直接ロジックを実装する方向に変更

## その他の差分

### 条件分岐

- Hugo: `{{ if or (eq $languageCode "zh-cn") (eq $languageCode "zh-jp") }}`
- Astro: `if (languageCode === "zh-cn" || languageCode === "zh-jp")`

### 変数初期化

- Hugo: 条件分岐内で再代入
- Astro: let宣言で初期値設定後、条件分岐で変更

## 外部依存

### 外部リンク

- cybozu.co.jpのPDFファイル（英語版・中国語版）

## 注意事項

- このコンポーネントは実際にはユーティリティ関数として機能
- 実装では他のコンポーネント（Disclaimer, Disclaimer3）でロジックを直接統合
- PDF URLがハードコードされているため、将来的には設定ファイル化を検討
