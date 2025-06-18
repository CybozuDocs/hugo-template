# AlternateLink 変更記録

元ファイル: `layouts/partials/alternatelink.html`

## 関数・変数の置換

| Hugo                                | Astro                          | 備考                              |
| ----------------------------------- | ------------------------------ | --------------------------------- |
| `$.Site.Params.product`             | `env.product`                  | env プロパティに集約              |
| `$.Site.Params.TargetRegion`        | `env.targetRegion`             | env プロパティに集約              |
| `.Site.Params.domain`               | `env.domain`                   | env プロパティに集約              |
| `$.Site.Params.service_type_id`     | `env.serviceTypeId`            | env プロパティに集約              |
| `.Params.disabled`                  | `page.params.disabled`         | page プロパティに集約             |
| `$.AllTranslations`                 | `page.allTranslations`         | page プロパティに集約             |
| `.Lang`                             | `translation.lang`             | 各翻訳オブジェクトのプロパティ    |
| `.RelPermalink`                     | `translation.relPermalink`     | 各翻訳オブジェクトのプロパティ    |
| `$.RelPermalink`                    | `page.relPermalink`            | page プロパティ                   |
| `slice`                             | `配列リテラル []`              | JavaScript の配列                 |
| `range`                             | `map()`                        | JavaScript の配列メソッド         |
| `if in $disabled .`                 | `disabled.includes(region)`    | JavaScript の配列メソッド         |
| `split $.RelPermalink "/"`          | `page.relPermalink.split("/")` | JavaScript の文字列メソッド       |
| `index $.Site.Data "language_list"` | `import from JSON`             | 静的インポート                    |
| `add $idx 1`                        | `idx++`                        | JavaScript の演算子               |
| `len`                               | `.length`                      | JavaScript のプロパティ           |
| `printf`                            | `テンプレートリテラル`         | JavaScript のテンプレートリテラル |

## TODO

- [ ] language_list.json のインポートパスの確認
- [ ] 型定義の更なる改善（any型の排除）

## 構造の変化

### 条件分岐の変更

- Hugo の `{{- if }}...{{- else if }}...{{- end }}` → JavaScript の `if-else` 文
- Hugo の `range` による反復処理 → JavaScript の `map()` と JSX

### 即時実行関数の使用

- `curRegion === "us"` の処理で即時実行関数を使用してスコープを管理

## その他の差分

### 空白・改行の扱い

- Hugo テンプレートの `{{-` と `-}}` による空白制御 → Astro では React Fragment (`<>...</>`) を使用

### null の返却

- 条件に合わない場合は `null` を返却してレンダリングをスキップ

## 外部依存

### JSONデータの読み込み

- `language_list.json` を静的にインポート
- Hugo の `$.Site.Data` アクセス → ES6 の `import` 文

## 注意事項

- `allTranslations` が undefined の場合を考慮して `?.` (optional chaining) を使用
- `disabled` のデフォルト値を空配列に設定
