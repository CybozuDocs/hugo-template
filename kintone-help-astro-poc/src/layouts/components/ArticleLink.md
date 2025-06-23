# ArticleLink 変更記録

元ファイル: `layouts/partials/articlelink.html`

## 関数・変数の置換

| Hugo                                                         | Astro                                                        | 備考                  |
| ------------------------------------------------------------ | ------------------------------------------------------------ | --------------------- |
| `{{ index .Params.aliases 0 }}`                              | `aliases[0] \|\| ''`                                         | 配列の最初の要素取得  |
| `{{ split $alias "/" }}`                                     | `alias.split('/')`                                           | 文字列分割            |
| `{{ index $a1 (sub (len $a1) 1) }}`                          | `a1[a1.length - 1] \|\| ''`                                  | 配列の最後の要素取得  |
| `{{ strings.TrimRight ".html" .Page.RelPermalink }}`         | `relPermalink.replace(/\.html$/, '')`                        | 文字列の末尾削除      |
| `{{ strings.TrimRight .File.ContentBaseName $relpath }}`     | `relpath.replace(new RegExp(fileContentBaseName + '$'), '')` | 文字列の末尾削除      |
| `{{ printf "%s%sid/%s.html" .Site.BaseURL $relpath $docid}}` | `` `${env.baseURL}${relpath}id/${docid}.html` ``             | 文字列テンプレート    |
| `{{ i18n "Copy_perma_link" }}`                               | `i18n__todo__Copy_perma_link`                                | title属性内のためTODO |
| `{{ i18n "Link_was_copied" }}`                               | `<Wovn>i18n__Link_was_copied</Wovn>`                         | WOVN対応              |
| `.Site.BaseURL`                                              | `env.baseURL`                                                | envプロパティに集約   |
| `.Page.RelPermalink`                                         | `relPermalink`                                               | Propsで直接受け取り   |
| `.File.ContentBaseName`                                      | `fileContentBaseName`                                        | Propsで直接受け取り   |
| `.Params.aliases`                                            | `aliases`                                                    | Propsで直接受け取り   |

## TODO

- [x] title属性のi18n対応方法の検討
- [x] エラーハンドリングの追加（aliases配列が空の場合など）

## 構造の変化

### defineからコンポーネントへの変更

- Hugo の `define "articlelink"` を独立したAstroコンポーネントとして実装
- Propsインターフェースを定義して必要なデータを受け取る形に変更

### Props最適化（2025年1月更新）

- BasePropsからカスタムPropsへ変更（必要なプロパティのみを受け取る）
- 条件判定をコンポーネント内部に移動（env.idSearchとaliases.lengthチェック）

### 関数処理の変更

- Hugo の `sub (len $a1) 1` → JavaScript の `a1.length - 1`
- Hugo の `strings.TrimRight` → JavaScript の `replace` メソッド
- Hugo の `printf` → JavaScript のテンプレートリテラル

## その他の差分

### 配列アクセスの安全性

- Hugo: `{{ index .Params.aliases 0 }}`
- Astro: `page.params.aliases?.[0] || ''`（オプショナルチェイニング使用）

### 正規表現の使用

- Hugo: `strings.TrimRight`
- Astro: `replace(/\.html$/, '')`（正規表現による末尾マッチ）

## 外部依存

### スクリプトの読み込み

- Font Awesomeアイコンを使用

### カスタム属性

- `idpath` 属性はそのまま維持

## 注意事項

- aliases配列が存在しない場合のエラーハンドリングが必要
- `idpath` 属性はJavaScriptで使用される可能性があるため、値の形式を維持
