# LangSelector 変更記録

元ファイル: `layouts/partials/langselector.html`

## 関数・変数の置換

| Hugo                                            | Astro                                | 備考                         |
| ----------------------------------------------- | ------------------------------------ | ---------------------------- |
| `{{ .Site.Language.LanguageName }}`             | `page.siteLanguage.languageName`     | pageプロパティに集約         |
| `{{ range .Translations }}`                     | `page.translations.map()`            | 配列反復                     |
| `{{ .Site.LanguageCode }}`                      | `translation.siteLanguageCode`       | 翻訳オブジェクトのプロパティ |
| `{{ .RelPermalink }}`                           | `translation.relPermalink`           | 翻訳オブジェクトのプロパティ |
| `{{ eq .Site.Params.use_wovn true }}`           | `env.useWovn`                        | envプロパティに集約          |
| `{{ split .RelPermalink "/" }}`                 | `page.relPermalink.split('/')`       | 文字列分割                   |
| `{{ index .Site.Data "language_list" }}`        | `env.languageData`                   | envプロパティに集約          |
| `{{ range $additionalLangs.languages }}`        | `env.languageData.languages.map()`   | 配列反復                     |
| `{{ $urlParts \| len }}`                        | `urlParts.length`                    | 配列長取得                   |
| `{{ printf "%s/%s" $newTarget $languageCode }}` | `` `${newTarget}/${languageCode}` `` | 文字列テンプレート           |
| `{{ add $idx 1 }}`                              | `idx++` または `forEach` の index    | インデックス増加             |
| `{{ hasSuffix $newTarget ".html" }}`            | `newTarget.endsWith('.html')`        | 文字列末尾チェック           |
| `{{ hasSuffix $newTarget "/" }}`                | `newTarget.endsWith('/')`            | 文字列末尾チェック           |

## TODO

- [ ] language_list データの読み込み処理の実装
- [ ] URL構築ロジックの最適化

## 構造の変化

### データ処理の分離

- WOVN言語リストの処理を `processWovnLanguages` 関数に分離
- 複雑なURL構築ロジックを独立した処理として実装

### 変数管理の改善

- Hugo の複数の変数 → 構造化されたオブジェクト配列
- インデックス管理を JavaScript の標準的な方法に変更

### 条件分岐の最適化

- URL末尾調整の条件分岐を簡略化

## その他の差分

### 配列処理

- Hugo: `{{ range }}`, `{{ index }}`
- Astro: `map()`, `forEach()`, 配列インデックス

### 文字列処理

- Hugo: `split`, `printf`, `hasSuffix`
- Astro: `split()`, テンプレートリテラル, `endsWith()`

### ループとインデックス

- Hugo: 手動でのインデックス管理（`{{ add $idx 1 }}`）
- Astro: `forEach` の組み込みインデックス使用

### URL構築

- Hugo: 文字列結合による段階的構築
- Astro: 同様の仕組みを関数内で実装

## 外部依存

### データファイル

- `data/language_list.json`（WOVN用言語リスト）

### CSS

- Font Awesomeアイコンを使用

### JavaScript

- 言語選択の動作（別途実装される想定）

## 注意事項

- WOVN使用時のURL構築ロジックが複雑
- 翻訳データの構造がHugoとAstroで異なる可能性
- カスタム属性（`desturl`）はJavaScriptで使用される
- アクセシビリティ属性（ARIA）を適切に維持
