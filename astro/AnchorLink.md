# AnchorLink 変更記録

元ファイル: `layouts/partials/anchorlink.html`

## 関数・変数の置換

| Hugo | Astro | 備考 |
| ---- | ----- | ---- |
| `{{ i18n "Permalink" }}` | `<Wovn>i18n__Permalink</Wovn>` | WOVN 対応 |
| `{{$id}}` | `{id}` | Props から直接参照 |
| `{{$level}}` | `{level}` | Props から直接参照 |
| `{{$title \| safeHTML}}` | `${safeHTML(title)}` | safeHTML関数として実装 |
| `{{ printf "%s#%s" $link $id \| safeURL}}` | `{`${link}#${id}`}` | テンプレートリテラル |
| `{{ if and (le $level 5) (ne $link "") }}` | `{level <= 5 && link !== "" && (...)}` | JavaScript の条件式 |
| `define "anchorlink"` | コンポーネント化 | Astro コンポーネントとして実装 |

## TODO

- [ ] safeHTML 関数の実装確認（現在は passthrough）
- [ ] 属性の型定義をより厳密にする

## 構造の変化

### define からコンポーネントへ
- Hugo の `define "anchorlink"` → 独立した Astro コンポーネント
- 呼び出し方法が `{{ template "anchorlink" ... }}` から `<AnchorLink ... />` に変更

### 動的なHTMLタグの生成
- Hugo の `<h{{$level}}>` → Astro の `<Fragment set:html={...}>` を使用
- 動的なタグ名の生成にテンプレートリテラルを使用

## その他の差分

### 属性の扱い
- `attributes` をオプショナルなPropsとして定義
- デフォルト値を空オブジェクトに設定
- `attributes.class` のnullish合体演算子による処理

### イベントハンドラ
- `onclick` 属性がそのまま使用可能（Astro は HTML 属性をサポート）

## 外部依存

### Font Awesome
- `<i class="fas fa-link">` アイコンの使用

## 注意事項

- `set:html` ディレクティブはサニタイズされないため、信頼できるコンテンツのみで使用すること
- `safeHTML` 関数は現在 passthrough として実装されているが、必要に応じてサニタイズ処理を追加