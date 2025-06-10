# ApplyParams 変更記録

元ファイル: `layouts/partials/applyparams.html`

## 関数・変数の置換

| Hugo                                     | Astro                                     | 備考                         |
| ---------------------------------------- | ----------------------------------------- | ---------------------------- |
| `{{- $params := .params }}`              | `const { params } = Astro.props;`         | Props からの取得に変更       |
| `{{- $target := .target }}`              | `const { target } = Astro.props;`         | Props からの取得に変更       |
| `replaceRE "pattern" replacement string` | `string.replace(/pattern/g, replacement)` | 正規表現置換の構文変更       |
| `{{- return ( $t14 \| safeHTML ) }}`     | `{result}`                                | Astro では自動的に安全な出力 |

## TODO

- [ ] パラメータの値が undefined の場合の処理を確認
- [ ] 置換パターンの正確性を実際のデータで検証

## 構造の変化

### 置換処理の実装方法

- Hugo: 各置換を個別の変数（$t1〜$t14）に代入
- Astro: 配列とループを使用して効率的に処理

### エラーハンドリング

- undefined チェックを追加して、パラメータが存在しない場合も安全に処理

## その他の差分

### 正規表現パターン

- Hugo の `{{<\\s*kintone\\s*>}}` を JavaScript の `/{{<\s*kintone\s*>}}/g` に変換
- バックスラッシュのエスケープが不要に

### 出力方法

- Hugo の `safeHTML` フィルターは不要（Astro では自動的に安全）

## 外部依存

なし

## 注意事項

- 置換順序は元の実装と同じ順序を維持（重要）
- グローバルフラグ（`g`）を使用して、すべての出現箇所を置換
- パラメータが undefined の場合は置換をスキップ
