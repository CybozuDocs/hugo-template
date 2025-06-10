# MegaNav 変更記録

元ファイル: `layouts/partials/meganav.html`

## 関数・変数の置換

| Hugo | Astro | 備考 |
| ---- | ----- | ---- |
| `$.Site.Params.TargetRegion` | `env.targetRegion` | env プロパティに集約 |
| `{{ if eq $.Site.Params.TargetRegion "US" }}` | `{env.targetRegion === "US" ? (...) : (...)}` | JavaScript の条件演算子 |
| `{{ partial "meganav_kt" . }}` | `<MegaNavKt env={env} page={page} />` | コンポーネント呼び出し |
| `{{ partial "meganav_gr" . }}` | `<MegaNavGr env={env} page={page} />` | コンポーネント呼び出し |

## TODO

なし

## 構造の変化

### partial 呼び出しの変更
- Hugo の `partial` 関数 → Astro コンポーネントのインポートと使用
- コンテキスト (`.`) の受け渡し → 明示的な Props の受け渡し

### 条件分岐の簡略化
- Hugo の `if-else-end` → JavaScript の三項演算子
- より簡潔な条件分岐

## その他の差分

### Props の明示的な受け渡し
- Hugo の `.` による暗黙的なコンテキスト受け渡し → `env={env} page={page}` による明示的な Props 受け渡し

## 外部依存

### 依存コンポーネント
- `MegaNavKt.astro` - kintone（US）用メガナビゲーション
- `MegaNavGr.astro` - Garoon用メガナビゲーション

## 注意事項

- 地域によってメガナビゲーションの表示が完全に異なる
- 依存する MegaNavKt と MegaNavGr コンポーネントが適切に実装されている必要がある