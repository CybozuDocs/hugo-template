# Title 変更記録

元ファイル: `layouts/partials/title.html`

## 関数・変数の置換

| Hugo                              | Astro                      | 備考                         |
| --------------------------------- | -------------------------- | ---------------------------- |
| `{{- $target := .Title }}`        | `let target = page.title;` | 変数宣言の構文変更           |
| `.Site.Params.TargetRegion`       | `env.targetRegion`         | env プロパティに集約         |
| `.Params.title_us`                | `page.params.title_us`     | page プロパティに集約        |
| `.Params.title_cn`                | `page.params.title_cn`     | page プロパティに集約        |
| `{{- if and (eq ...) }}`          | `if (... === "US" && ...)` | 条件分岐の構文変更           |
| `{{- partial "applyparams" ...}}` | `<ApplyParams ... />`      | コンポーネント呼び出しに変更 |

## TODO

- [ ] ApplyParams コンポーネントの実装が必要

## 構造の変化

- Hugo の partial 呼び出しから Astro コンポーネントのインポートと使用に変更
- `dict` による引数渡しから Props による引数渡しに変更

## その他の差分

### 空白制御

- Hugo の `{{-` と `-}}` による空白制御は不要になった

### 変数のスコープ

- Hugo のテンプレート変数から JavaScript の変数に変更

## 外部依存

- ApplyParams コンポーネントに依存

## 注意事項

- タイトルの決定ロジックは元の動作を完全に再現
- 地域別タイトル（US、CN）の優先順位を維持
