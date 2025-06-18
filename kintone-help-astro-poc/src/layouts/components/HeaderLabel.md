# HeaderLabel 変更記録

元ファイル: `layouts/partials/headerlabel.html`

## 関数・変数の置換

| Hugo                                    | Astro                     | 備考                 |
| --------------------------------------- | ------------------------- | -------------------- |
| `{{ .Params.labels }}`                  | `page.params.labels`      | pageプロパティに集約 |
| `{{ $.Site.Params.label_colors }}`      | `env.labelColors`         | envプロパティに集約  |
| `{{ $.Site.Params.label_lead }}`        | `env.labelLead`           | envプロパティに集約  |
| `{{ $.Site.Params.label_contents }}`    | `env.labelContents`       | envプロパティに集約  |
| `{{ range $labels }}`                   | `labels.map()`            | 配列反復             |
| `{{ int . }}`                           | `parseInt(label)`         | 型変換               |
| `{{ sub $labelidx 1 }}`                 | `parseInt(label) - 1`     | インデックス調整     |
| `{{ index $label_contents $labelidx }}` | `labelContents[labelidx]` | 配列インデックス     |
| `{{ index $label_colors $labelidx }}`   | `labelColors[labelidx]`   | 配列インデックス     |

## TODO

なし

## 構造の変化

### defineからコンポーネントへの変更

- Hugo の `define "headerlabel"` を独立したAstroコンポーネントとして実装
- Propsインターフェースを定義して必要なデータを受け取る形に変更

### データ処理の改善

- ラベルデータの前処理を追加（存在しないラベルのフィルタリング）
- 1-based indexから0-based indexへの変換を明確化

### 条件分岐の最適化

- 複数の条件チェックを統合
- 早期リターンによるネストの回避

## その他の差分

### 型変換

- Hugo: `{{ int . }}`
- Astro: `parseInt(label)`

### 配列操作

- Hugo: `{{ range }}`, `{{ index }}`
- Astro: `map()`, 配列インデックス

### フィルタリング

- Astro: `filter(Boolean)` で無効なラベルを除外

## 外部依存

なし

## 注意事項

- ラベルの設定がない場合は何も表示しない
- ラベル番号は1-basedで指定されるが、配列は0-basedで処理
- カラー設定がない場合でもラベルは表示される（背景色なし）
