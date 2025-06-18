# Related 変更記録

元ファイル: `layouts/partials/related.html`

## 関数・変数の置換

| Hugo                                                   | Astro                                    | 備考                       |
| ------------------------------------------------------ | ---------------------------------------- | -------------------------- |
| `{{ .Site.RegularPages.Related . \| first 5 }}`        | 未実装                                   | TODO: Related機能の実装    |
| `{{ $.Scratch.Set "pagecnt" 0}}`                       | `validPages.length`                      | カウント処理を配列長に変更 |
| `{{ $.Scratch.Add "pagecnt" 1}}`                       | `filter()` の結果                        | 配列フィルタリングで代替   |
| `{{ $.Scratch.Get "pagecnt" }}`                        | `sortedPages.length > 0`                 | 配列長チェック             |
| `{{ in .Params.disabled $.Site.Params.TargetRegion }}` | `disabled.includes(env.targetRegion)`    | 配列包含チェック           |
| `{{ $related.ByWeight }}`                              | `sort((a, b) => a.weight - b.weight)`    | 重み付けソート             |
| `{{ gt ($.Scratch.Get "pagecnt") 0}}`                  | `shouldDisplay`                          | 条件チェック               |
| `{{ partial "title" . }}`                              | `<Title env={env} page={relatedPage} />` | コンポーネント呼び出し     |
| `{{ i18n "See_also" }}`                                | `<Wovn>i18n__See_also</Wovn>`            | WOVN対応                   |
| `{{ .RelPermalink }}`                                  | `relatedPage.relPermalink`               | プロパティアクセス         |

## TODO

- [ ] Hugo の Related 機能（類似記事検索）の実装
- [ ] regularPages データの適切な取得方法

## 構造の変化

### Scratch変数からJavaScript配列処理へ

- Hugo の Scratch による手動カウント → JavaScript の配列メソッド
- 段階的な処理（カウント→チェック→表示）→ 一連の配列処理

### Related機能の代替実装

- Hugo の `.Site.RegularPages.Related` → 簡易実装（TODO）
- 関連記事の検索アルゴリズムは未実装

### コンポーネント統合

- `partial "title"` → Title コンポーネントの呼び出し

## その他の差分

### 配列処理

- Hugo: `range`, `in`, `ByWeight`, `first`
- Astro: `filter()`, `includes()`, `sort()`, `slice()`

### 条件分岐

- Hugo: Scratch変数による条件管理
- Astro: 配列の状態による条件分岐

### 重み付けソート

- Hugo: `ByWeight` メソッド
- Astro: カスタムソート関数

## 外部依存

### コンポーネント

- Title コンポーネント（タイトル表示）

## 注意事項

- Hugo の Related 機能は複雑なアルゴリズムを使用しているため、完全な実装が必要
- regularPages データの取得方法を検討する必要
- 関連記事の検索精度は元の実装に依存
- disabled パラメータによる地域別フィルタリングを維持
