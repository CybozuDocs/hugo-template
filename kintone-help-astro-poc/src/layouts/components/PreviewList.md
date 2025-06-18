# PreviewList 変更記録

元ファイル: `layouts/partials/preview_list.html`

## 関数・変数の置換

| Hugo                            | Astro                                | 備考                   |
| ------------------------------- | ------------------------------------ | ---------------------- |
| `{{ range .Sections.ByWeight}}` | `sortedSections.map()`               | 重み順ソートと配列反復 |
| `{{ .RelPermalink }}`           | `section.relPermalink`               | プロパティアクセス     |
| `{{ partial "title" . }}`       | `<Title env={env} page={section} />` | コンポーネント呼び出し |
| `{{ range .Pages.ByWeight}}`    | `sortedPages.map()`                  | 重み順ソートと配列反復 |

## TODO

なし

## 構造の変化

### ソート処理の明示化

- Hugo の `ByWeight` → JavaScript の `sort()` 関数
- ソートロジックを明示的に実装

### コンポーネント統合

- `partial "title"` → Title コンポーネントの呼び出し

### ネストした配列処理

- Hugo の入れ子の `range` → JavaScript の入れ子の `map`
- セクション内でのページソートを独立して処理

## その他の差分

### 配列処理

- Hugo: `range`, `ByWeight`
- Astro: `map()`, `sort()`

### 重み付けソート

- Hugo: Hugo の組み込み `ByWeight` メソッド
- Astro: カスタムソート関数

### キー属性

- React/JSXパターンに従い、繰り返し要素に `key` 属性を追加

## 外部依存

### コンポーネント

- Title コンポーネント（タイトル表示）

## 注意事項

- セクションとページの両方で重み付けソートが必要
- Titleコンポーネントに適切なpropsを渡す必要
- プレビューリスト表示のため、セクション階層構造を維持
- ナビゲーション要素としての役割を維持
