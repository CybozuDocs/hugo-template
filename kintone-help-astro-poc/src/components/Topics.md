# Topics.astro 変更記録

元ファイル: layouts/shortcodes/topics.html

## 関数・変数の置換

| Hugo | Astro | 備考 |
|------|-------|------|
| `{{.Get "title"}}` | `{title}` | Props経由 |
| `{{.Get "file"}}` | `{file}` | Props経由 |
| `{{range $i, $r := getCSV "," (.Get "file")}}` | `csvData.map((row, index))` | CSVループ処理 |
| `{{index $r 0}}` | `row[0]` | テキスト列 |
| `{{index $r 1}}` | `row[1]` | URL列 |
| `{{if eq $i 3}}` | `index === 3` | 4番目の判定 |
| `getCSV "," (.Get "file")` | `parseCSV(file)` | CSV読み込み関数 |

## Props 設計

```typescript
export interface Props {
  title: string;
  file: string;
}
```

## DOM 構造の変化

なし - 元のHTML構造を完全保持

## TODO

なし（実装完了）

## 注意事項

- CSV外部ファイル読み込み機能あり
- 最初の4項目と5項目以降を分割表示
- ビルド時にCSVファイルを解析
- 複数パス対応（src/pages/_data/csv/, public/, 絶対パス）
- Hugo getCSV をNode.js readFileSync で再現