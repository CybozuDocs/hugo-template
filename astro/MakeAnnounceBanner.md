# MakeAnnounceBanner 変更記録

元ファイル: `layouts/partials/announcementbanner.html` (define "makeannouncebanner"部分)

## 関数・変数の置換

| Hugo | Astro | 備考 |
| ---- | ----- | ---- |
| `{{ index . 0 }}` | `data[0]` | 配列インデックスアクセス |
| `{{ index . 1 }}` | `data[1]` | 配列インデックスアクセス |
| `{{ index . 2 }}` | `data[2]` | 配列インデックスアクセス |
| `{{ index . 3 }}` | `data[3]` | 配列インデックスアクセス |
| `{{ index . 4 }}` | `data[4]` | 配列インデックスアクセス |
| `{{ index . 5 }}` | `data[5]` | 配列インデックスアクセス |
| `{{ with $bg_color }}background-color: {{ . }};{{ end }}` | `${bgColor ? `background-color: ${bgColor};` : ''}` | 条件付きスタイル |
| `{{ with $icon_color }}color: {{ . }};{{ end }}` | `${iconColor ? `color: ${iconColor};` : ''}` | 条件付きスタイル |
| `{{ with $title }}...{{ end }}` | `{title && (...)}` | 条件付きレンダリング |
| `{{ $text | markdownify }}` | `{processMarkdown(text)}` | マークダウン処理 |
| `{{ i18n "Announcement_button_close" }}` | `i18n__todo__Announcement_button_close` | title属性内のためTODO |
| `{{ i18n "Close" }}` | `<Wovn>i18n__Close</Wovn>` | WOVN対応 |

## TODO

- [ ] markdownify機能の完全実装（現在は簡易実装）
- [ ] title属性のi18n対応方法の検討

## 構造の変化

### defineからコンポーネントへの分離

- Hugo の `define "makeannouncebanner"` を独立したAstroコンポーネントとして実装
- Propsインターフェースを定義してデータを受け取る形に変更

### 条件分岐の変更

- Hugo の `with` による null チェック → JavaScript の `&&` 演算子と三項演算子
- テンプレート内での条件分岐 → JSXでの条件レンダリング

## その他の差分

### 属性名の変更

- 特になし

### HTMLレンダリング

- Hugo: `{{ $text | markdownify }}`
- Astro: `set:html={processMarkdown(text)}`（安全なHTML出力）

### デフォルト値の扱い

- Hugoの`with`ディレクティブ → JavaScriptの条件演算子

## 外部依存

### スクリプトの読み込み

- Font Awesomeアイコンを使用

### CSS クラスの動的生成

- テンプレートリテラルを使用した動的クラス名生成

## 注意事項

- マークダウン処理機能の完全実装が必要
- HTML出力時のXSS対策は Astro の `set:html` で対応