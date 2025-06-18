# AnnouncementBanner 変更記録

元ファイル: `layouts/partials/announcementbanner.html`

## 関数・変数の置換

| Hugo                                     | Astro                                   | 備考                       |
| ---------------------------------------- | --------------------------------------- | -------------------------- |
| `{{ i18n "Unsupported_browser" }}`       | `i18n__Unsupported_browser`             | 静的文字列として処理       |
| `{{ i18n "Unsupported_message" }}`       | `i18n__Unsupported_message`             | 静的文字列として処理       |
| `{{ i18n "Close" }}`                     | `<Wovn>i18n__Close</Wovn>`              | WOVN対応                   |
| `{{ i18n "Announcement_button_close" }}` | `i18n__todo__Announcement_button_close` | title属性内のためTODO      |
| `$.Lang`                                 | `env.lang`                              | envプロパティに集約        |
| `$.Site.Params.TargetRegion`             | `env.targetRegion`                      | envプロパティに集約        |
| `os.FileExists`                          | 未実装                                  | TODO: ファイル存在チェック |
| `resources.Get`                          | 未実装                                  | TODO: CSVリソース読み込み  |
| `transform.Unmarshal`                    | 未実装                                  | TODO: CSV解析              |
| `markdownify`                            | `processMarkdown()`                     | 簡易実装、要改善           |

## TODO

- [ ] CSVファイルの動的読み込み処理の実装
- [ ] os.FileExistsに相当するファイル存在チェック機能
- [ ] resources.Getに相当するリソース読み込み機能
- [ ] transform.Unmarshalに相当するCSV解析機能
- [ ] markdownify機能の完全実装
- [ ] title属性のi18n対応方法の検討

## 構造の変化

### define/template分離

- `define "makeannouncebanner"` → `MakeAnnounceBanner.astro`として分離
- メインコンポーネントから分離されたコンポーネントをimportして使用

### 条件分岐の変更

- Hugo の `with` による null チェック → JavaScript の `&&` 演算子
- Hugo の `range` → JavaScript の `map` 関数

## その他の差分

### 属性名の変更

- 特になし

### 空白・改行の扱い

- Hugo テンプレートの `{{-` と `-}}` による空白制御 → Astro では明示的に制御

### デフォルト値

- Hugo: `{{ with $bg_color }}background-color: {{ . }};{{ end }}`
- Astro: `${bgColor ? `background-color: ${bgColor};` : ''}`

## 外部依存

### スクリプトの読み込み

- Font Awesomeアイコンを使用

### CSS クラスの動的生成

- Hugo: `class="announcement-banner {{ $key }}"`
- Astro: `class={`announcement-banner ${key}`}`

## 注意事項

- CSVファイルの読み込み処理は現在未実装
- マークダウン処理は簡易実装のため、完全なMarkdown対応が必要
- ファイル存在チェック機能の実装が必要
