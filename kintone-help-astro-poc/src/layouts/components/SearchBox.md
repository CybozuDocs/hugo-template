# SearchBox 変更記録

元ファイル: `layouts/partials/searchbox.html`

## 関数・変数の置換

| Hugo | Astro | 備考 |
| ---- | ----- | ---- |
| `{{ slice }}` | `[]` | 空配列初期化 |
| `{{ eq .Site.Params.google_search true }}` | `env.googleSearch` | envプロパティに集約 |
| `{{ eq .Site.Params.bing_search true }}` | `env.bingSearch` | envプロパティに集約 |
| `{{ .Site.Params.google_search_tabs }}` | `env.googleSearchTabs` | envプロパティに集約 |
| `{{ .Site.Params.bing_search_tabs }}` | `env.bingSearchTabs` | envプロパティに集約 |
| `{{ gt ( $paramfilter \| len ) 0 }}` | `paramFilter.length > 0` | 文字列長チェック |
| `{{ strings.TrimLeft "[" $paramfilter }}` | `paramFilter.replace(/^\\[/, '')` | 文字列前方削除 |
| `{{ strings.TrimRight "]" $paramfilter }}` | `paramFilter.replace(/\\]$/, '')` | 文字列後方削除 |
| `{{ split $paramfilter "," }}` | `trimmed.split(',')` | 文字列分割 |
| `{{ i18n "Search_example" }}` | `i18n__todo__Search_example` | placeholder内のためTODO |
| `{{ i18n "Enter_keywords" }}` | `i18n__todo__Enter_keywords` | placeholder内のためTODO |
| `{{ or .IsHome (eq .Params.type "search_result") }}` | `page.isHome \|\| page.params.type === "search_result"` | 論理演算 |
| `{{ printf "%s %s" $buttonstyle "search-filter-current-top" }}` | `buttonstyle += " search-filter-current-top"` | 文字列結合 |
| `{{ i18n "Search_filter" }}` | `i18n__todo__Search_filter` | title属性内のためTODO |
| `{{ strings.Trim (index $filter 0) "'" }}` | `filter[0]?.replace(/^'\|'$/g, '') \|\| ''` | 文字列トリム |
| `{{ range $idx, $value := $filter }}` | `filter.map((value, idx) => ())` | 配列反復 |
| `{{ printf "%s%s" $classname " search-filter-selected" }}` | `` `${classname} search-filter-selected` `` | 文字列結合 |
| `{{ i18n "search_word" }}` | `i18n__todo__search_word` | aria-label内のためTODO |
| `{{ i18n "search" }}` | `i18n__todo__search` | title/aria-label内のためTODO |
| `{{ i18n "search_bing" }}` | `<Wovn>i18n__search_bing</Wovn>` | WOVN対応 |
| `{{ i18n "search_bing_legal" }}` | `<Wovn>i18n__search_bing_legal</Wovn>` | WOVN対応 |

## TODO

- [ ] placeholder、title、aria-label属性のi18n対応方法の検討
- [ ] 検索フィルター機能のJavaScript実装との連携

## 構造の変化

### 配列処理の最適化

- Hugo の複数ステップによるフィルター構築 → JavaScript の配列メソッド
- 条件分岐による配列要素処理 → map関数での一括処理

### 文字列処理の改善

- Hugo の `strings.TrimLeft/Right` → JavaScript の正規表現置換
- 段階的な文字列処理 → チェーンメソッド

### スクリプト属性の変更

- Hugo: `targetId="{{$logoplace}}" hl="{{$glang}}"`
- Astro: `data-target-id={logoplace} data-hl={glang}`（カスタム属性）

## その他の差分

### 条件分岐の最適化

- Hugo: 複数の if 文 → Astro: 論理演算子による短縮記法
- クラス名の動的生成をテンプレートリテラルで簡略化

### 配列アクセスの安全性

- Hugo: `{{ index $filter 0 }}`
- Astro: `filter[0]?.replace() || ''`（オプショナルチェイニング）

### 文字列トリム

- Hugo: `{{ strings.Trim $value "'" }}`
- Astro: `value.replace(/^'|'$/g, '')`（正規表現による両端削除）

## 外部依存

### スクリプト

- Google Search の prose/brand.js（Google検索有効時）

### CSS

- 検索ボックスのスタイリング
- フィルター機能のスタイリング

### JavaScript

- 検索フィルター機能の動作
- 検索実行機能

## 注意事項

- 多くのi18nキーがplaceholder、title、aria-label内で使用されているため対応が必要
- Google検索スクリプトの属性名変更（targetId → data-target-id）
- 検索フィルター機能はJavaScriptでの実装が必要
- Bing検索とGoogle検索で異なる動作が想定される