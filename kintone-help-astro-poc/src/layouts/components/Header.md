# Header 変更記録

元ファイル: `layouts/partials/header.html`

## 関数・変数の置換

| Hugo                                                 | Astro                                    | 備考                    |
| ---------------------------------------------------- | ---------------------------------------- | ----------------------- |
| `{{ and .IsHome (ne .Site.Params.meganav true) }}`   | `page.isHome && !env.meganav`            | 論理演算子              |
| `{{ slice "kintone" "slash" ... }}`                  | `["kintone", "slash", ...]`              | 配列リテラル            |
| `{{ in $v2_list $.Site.Params.product }}`            | `v2List.includes(env.product)`           | 配列包含チェック        |
| `{{ len $.AllTranslations }}`                        | `page.allTranslations.length`            | 配列長取得              |
| `{{ printf "%s/" $.Lang }}`                          | `` `${page.lang}/` ``                    | 文字列テンプレート      |
| `{{ split $.Site.BaseURL "/" }}`                     | `env.baseURL.split('/')`                 | 文字列分割              |
| `{{ sub ($urlparts \| len ) 2 }}`                    | `urlparts.length - 2`                    | 算術演算                |
| `{{ index $urlparts $product_pos }}`                 | `urlparts[productPos]`                   | 配列インデックス        |
| `{{ printf "/%s/" (index $urlparts $product_pos) }}` | `` `/${urlparts[productPos]}/` ``        | 文字列テンプレート      |
| `{{ $.Scratch.Get "sitename" }}`                     | `page.scratch?.sitename`                 | TODO: Scratch実装       |
| `{{ partial "searchbox" . }}`                        | `<SearchBox env={env} page={page} />`    | コンポーネント呼び出し  |
| `{{ partial "langselector" . }}`                     | `<LangSelector env={env} page={page} />` | コンポーネント呼び出し  |
| `{{ urls.Parse $.Site.BaseURL }}`                    | URLパース（使用箇所で削除）              | 簡略化                  |
| `{{ i18n "search_word" }}`                           | `i18n__todo__search_word`                | aria-label内のためTODO  |
| `{{ i18n "Enter_keywords" }}`                        | `i18n__todo__Enter_keywords`             | placeholder内のためTODO |
| `{{ i18n "search" }}`                                | `i18n__todo__search`                     | aria-label内のためTODO  |
| `{{ relURL }}`                                       | 相対URL処理                              | 簡易実装                |

## TODO

- [ ] page.scratch.sitename の実装
- [ ] aria-label、placeholder属性のi18n対応方法の検討
- [ ] relURL相当の処理の実装

## 構造の変化

### 条件分岐の統合

- 複数のif文を統合してヘッダークラス決定ロジックを簡略化
- サーチボックス表示判定の条件を関数的に処理

### コンポーネント分離

- `partial "searchbox"` → SearchBox コンポーネント
- `partial "langselector"` → LangSelector コンポーネント

### スクリプト属性の変更

- Hugo: `targetId="headerSearchBox_input" hl="{{$glang}}"`
- Astro: `data-target-id="headerSearchBox_input" data-hl={glang}`（カスタム属性）

## その他の差分

### 配列操作

- Hugo: `slice`, `in`, `len`, `index`
- Astro: JavaScript の標準配列メソッド

### 文字列処理

- Hugo: `split`, `printf`
- Astro: JavaScript の文字列メソッド

### 言語コード変換

- 条件分岐で言語コードを Google 用に変換

### ロゴ表示ロジック

- 画像使用とテキスト使用の条件分岐を明確化

## 外部依存

### スクリプト

- Google Search の prose/brand.js（Google検索有効時）

### CSS

- Font Awesomeアイコンを使用（ハンバーガーメニュー）

## 注意事項

- Scratchの実装が必要（サイト名の取得）
- SearchBoxとLangSelectorコンポーネントの実装が必要
- Google検索スクリプトの属性名変更（targetId → data-target-id）
- テンプレートバージョンによって検索ボックスの実装が異なる
