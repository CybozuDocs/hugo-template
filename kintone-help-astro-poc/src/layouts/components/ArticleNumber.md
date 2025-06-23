# ArticleNumber 変更記録

元ファイル: `layouts/partials/articlenumber.html`

## 関数・変数の置換

| Hugo                                       | Astro                               | 備考                      |
| ------------------------------------------ | ----------------------------------- | ------------------------- |
| `{{- define "articlenumber" }}`            | コンポーネントファイルとして分離    | define は不要に           |
| `{{- $alias := index .Params.aliases 0 }}` | `const alias = aliases[0];`         | Props から直接受け取り    |
| `split $alias "/"`                         | `alias.split('/')`                  | 文字列分割の構文変更      |
| `index $a1 (sub (len $a1) 1)`              | `parts[parts.length - 1]`           | 配列の最後の要素取得      |
| `{{ i18n "Article_number" }}`              | `<Wovn>i18n__Article_number</Wovn>` | WOVN コンポーネントを使用 |

## TODO

- [x] aliases が存在しない場合の表示確認
- [x] 複数の aliases がある場合の動作確認

## 構造の変化

### define から独立コンポーネントへ

- Hugo の `define` ブロックから独立した Astro コンポーネントに変更
- 呼び出し側で直接インポートして使用

### エラーハンドリングの追加

- aliases が存在しない場合の null チェックを追加
- docid が空の場合は何も表示しない

### Props最適化（2025年1月更新）

- BasePropsからカスタムPropsへ変更（aliasesのみを受け取る）
- 条件判定をコンポーネント内部に移動（env.idSearchとaliases.lengthチェック）

## その他の差分

### 条件付きレンダリング

- `{docid && (...)}` を使用して、docid が存在する場合のみ表示

## 外部依存

- Wovn コンポーネント（i18n 対応）

## 注意事項

- Hugo では `define` で定義されていたが、Astro では独立したコンポーネントとして実装
- aliases の最初の要素から記事番号を抽出するロジックは維持
