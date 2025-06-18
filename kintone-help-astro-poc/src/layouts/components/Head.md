# Head 変更記録

元ファイル: `layouts/partials/head.html`

## 関数・変数の置換

| Hugo                                        | Astro                                                     | 備考                   |
| ------------------------------------------- | --------------------------------------------------------- | ---------------------- |
| `{{.Site.LanguageCode}}`                    | `env.languageCode`                                        | envプロパティに集約    |
| `{{ eq .Site.Params.use_wovn true }}`       | `env.useWovn`                                             | 条件分岐               |
| `{{ split .Site.BaseURL "/" }}`             | `env.baseURL.split('/')`                                  | 配列分割               |
| `{{ sub (len $baseUrl) 2 }}`                | `baseUrlParts.length - 2`                                 | 配列長計算             |
| `{{ now.Format "20060102" }}`               | `new Date().toISOString().slice(0, 10).replace(/-/g, '')` | 日付フォーマット       |
| `{{ partial "title" . }}`                   | Title コンポーネント                                      | TODO: 実装             |
| `{{ partial "applyparams" }}`               | ApplyParams コンポーネント                                | TODO: 実装             |
| `{{ strings.TrimLeft " " $sitename }}`      | `sitename.trim()`                                         | 文字列トリム           |
| `{{ printf "%s \| %s" $title $sitename }}`  | `` `${title} \| ${sitename}` ``                           | 文字列テンプレート     |
| `{{ split .Content "\n" }}`                 | `page.content.split('\\n')`                               | 文字列分割             |
| `{{ strings.TrimLeft "<p>" . }}`            | `.replace(/^<p>/, '')`                                    | 文字列置換             |
| `{{ i18n "og_desc1" . }}`                   | `i18n__todo__og_desc1`                                    | TODO: i18n実装         |
| `{{ relURL }}`                              | 相対URL処理                                               | TODO: 実装             |
| `{{ eq hugo.Environment "staging" }}`       | 環境判定                                                  | TODO: 実装             |
| `{{ split . "," }}`                         | `.split(',')`                                             | カンマ分割             |
| `{{ printf "%s?%s" "file.css" $buildnum }}` | `` `file.css?${buildnum}` ``                              | キャッシュバスティング |
| `{{ template "gtm" dict "key" "GTM-XXX" }}` | `<Gtm key="GTM-XXX" />`                                   | コンポーネント呼び出し |
| `{{ strings.Count $target $curpage }}`      | `currentPage.includes(targetPath)`                        | 文字列検索             |

## TODO

- [ ] Title コンポーネントからのタイトル取得
- [ ] ApplyParams コンポーネントの説明文処理との統合
- [ ] i18n キーの実装
- [ ] relURL相当の処理の実装
- [ ] hugo.Environment相当の環境判定
- [ ] Zendeskチャットメニューの完全実装
- [ ] 本番環境判定の実装

## 構造の変化

### HTMLドキュメント構造

- Hugo: パーシャルとして使用
- Astro: 完全なHTMLドキュメント構造を出力

### コンポーネント統合

- `partial "title"` → Title コンポーネントのimport
- `partial "applyparams"` → ApplyParams コンポーネントのimport
- `partial "alternatelink"` → AlternateLink コンポーネントのimport
- `template "gtm"` → Gtm コンポーネントのimport

### 関数化

- サイト名生成処理を関数に分離
- タイトル生成処理を関数に分離
- 説明文生成処理を関数に分離
- チャット設定処理を関数に分離

## その他の差分

### 日付処理

- Hugo: `now.Format "20060102"`
- Astro: JavaScript の Date オブジェクトによる処理

### 配列操作

- Hugo: `split`, `index`, `len`, `sub`
- Astro: JavaScript の標準的な配列メソッド

### 文字列処理

- Hugo: `strings.TrimLeft`, `strings.TrimRight`, `strings.Count`
- Astro: JavaScript の文字列メソッド

### 条件分岐

- Hugo: 複雑なネストした条件分岐
- Astro: JSX の条件レンダリング

## 外部依存

### CSS フレームワーク

- Font Awesome 5.15.4
- Adobe Typekit（US地域のみ）

### JavaScript ライブラリ

- jQuery 3.7.0
- jsTree 3.3.12
- Vue.js 3.5.8（特定ページのみ）

### 外部サービス

- WOVN.io（翻訳サービス）
- Google Tag Manager（複数コンテナ）
- OneTrust CookiePro（US地域の本番環境のみ）
- Zendesk チャット

## 注意事項

- WOVNの設定は動的なURLパス処理が必要
- 複数のGTMコンテナが設定されている
- US地域でのみCookie同意機能が有効
- テンプレートバージョンによってCSS/JSの読み込みが変わる
- チャット機能は特定のページパスでのみ有効
