# AnchorLink2 変更記録

元ファイル: `layouts/partials/anchorlink2.html`

## 関数・変数の置換

| Hugo                           | Astro                                | 備考                           |
| ------------------------------ | ------------------------------------ | ------------------------------ |
| `{{ i18n "Copy_perma_link" }}` | `i18n__todo__Copy_perma_link`        | title属性内のため TODO         |
| `{{ i18n "Link_was_copied" }}` | `<Wovn>i18n__Link_was_copied</Wovn>` | WOVN 対応                      |
| `{{$ti.Level}}`                | `{ti.Level}`                         | Props から直接参照             |
| `{{$ti.Anchor}}`               | `{ti.Anchor}`                        | Props から直接参照             |
| `{{$ti.Text \| safeHTML}}`     | `${safeHTML(ti.Text)}`               | safeHTML関数として実装         |
| `{{ if eq $ti.Level 2 }}`      | `{ti.Level === 2 && (...)}`          | JavaScript の条件式            |
| `{{ if .ids }}`                | `{ids && (...)}`                     | JavaScript の条件式            |
| `define "anchorlink2"`         | コンポーネント化                     | Astro コンポーネントとして実装 |
| `idpath="{{.al}}"`             | `data-idpath={al}`                   | データ属性として変更           |

## TODO

- [ ] title属性の i18n 対応方法の検討
- [ ] safeHTML 関数の実装確認（現在は passthrough）
- [ ] TocItem インターフェースの完全な定義

## 構造の変化

### define からコンポーネントへ

- Hugo の `define "anchorlink2"` → 独立した Astro コンポーネント
- 呼び出し方法が `{{ template "anchorlink2" ... }}` から `<AnchorLink2 ... />` に変更

### 動的なHTMLタグの生成

- Hugo の `<h{{$ti.Level}}>` → Astro の `<Fragment set:html={...}>` を使用
- 動的なタグ名の生成にテンプレートリテラルを使用

### 属性名の変更

- `idpath` → `data-idpath`（カスタム属性として明確化）

## その他の差分

### 属性の扱い

- `ti.Attributes` をオプショナルとして定義
- optional chaining (`?.`) を使用した安全なアクセス
- デフォルト値として空文字列を設定

### 型定義

- `TocItem` インターフェースを定義してti プロパティの型を明確化
- Props インターフェースで各プロパティの型を定義

## 外部依存

### Font Awesome

- `<i class="fas fa-link">` アイコンの使用

## 注意事項

- `set:html` ディレクティブはサニタイズされないため、信頼できるコンテンツのみで使用すること
- `idpath` を `data-idpath` に変更したため、JavaScriptでの参照時は `dataset.idpath` でアクセスする必要がある
