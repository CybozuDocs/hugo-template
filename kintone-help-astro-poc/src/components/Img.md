# Img コンポーネント変更記録

元ファイル: `layouts/_default/_markup/render-image.html`

## 概要

Hugo のマークダウン画像レンダラーロジックを Astro コンポーネントとして実装。product="kintone" 固定化により大幅な簡素化を実現。

## 関数・変数の置換

| Hugo | Astro | 備考 |
|------|-------|------|
| `.Destination` | `props.src` | 画像のURL |
| `.Text` | `props.alt` | alt属性 |
| `.Title` | `props.title` | title属性（省略可能） |
| `$.Page.Site.Params.product` | 削除 | kintone固定により不要 |
| `$simple` 変数 | `isSimple` | boolean型で実装 |

## 構造の変化

### 削除された製品分岐
product="kintone" 固定化により以下の分岐処理を完全削除：

```html
<!-- 削除された Hugo 分岐処理 -->
{{- if and (eq .Page.Site.Params.product "Garoon") (in .Destination "/common/icon/") }}
{{- else if or (eq .Page.Site.Params.product "Mailwise") (eq .Page.Site.Params.product "Remote") }}
{{- else if eq .Page.Site.Params.product "Office" }}
```

### 簡素化された判定ロジック

**Hugo（複雑）**:
```html
{{- $simple := "false" }}
{{- if and (eq .Page.Site.Params.product "Garoon") (in .Destination "/common/icon/") }}
    {{- $simple = "true" }}
{{- else if or (eq .Page.Site.Params.product "Mailwise") (eq .Page.Site.Params.product "Remote") }}
    {{- if in .Destination "/common/img/" }}
        {{- $simple = "true" }}
    {{- end }}
{{- else if eq .Page.Site.Params.product "Office" }}
    {{- if or (in .Destination "/common/img/") (in .Destination "/common/icon/") }}
        {{- $simple = "true" }}
    {{- end }}
{{- else if (in .Destination "/img/") }}
    {{- $simple = "true" }}
{{- end }}
```

**Astro（簡素）**:
```typescript
// product="kintone"固定により他製品分岐は削除
const isSimple = src.includes("/img/");
```

## Props 設計

```typescript
interface Props {
  src: string;      // 必須: 画像URL
  alt: string;      // 必須: alt属性
  title?: string;   // 省略可能: title属性
}
```

### Props 最適化
- 必要最小限のプロパティのみ定義
- BaseProps は使用せず、完全に独立したコンポーネント
- 環境変数への依存なし

## DOM 構造の保持

**Simple 画像** (`/img/` パス):
```html
<img src="..." alt="..." title="..." role="img" />
```

**Screenshot 画像** (その他):
```html
<img class="screenshot" src="..." alt="..." data-action="zoom" role="img" />
```

## 簡素化による効果

1. **コード量削減**: 20行 → 11行（45%削減）
2. **複雑性削除**: 製品分岐による条件処理の完全排除
3. **保守性向上**: 単一責任の明確なコンポーネント
4. **再利用性**: マークダウン以外でも使用可能

## 使用例

```astro
---
import Img from '@/components/Img.astro';
---

<!-- Simple画像（/img/パス） -->
<Img src="/img/icon.png" alt="アイコン" />

<!-- Screenshot画像（その他のパス） -->
<Img src="/images/screenshot.png" alt="スクリーンショット" title="画面例" />
```

## TODO

なし（実装完了）

## 注意事項

- product固定化により、将来的に他製品サポートが必要な場合は分岐ロジックの追加が必要
- `/img/` パス判定は文字列 includes() で実装（Hugo の `in` 関数と同等）
- title 属性は省略可能として適切に実装済み

### リスト項目内での使用時の注意点

リスト項目内で `<Img>` コンポーネントを使用する場合、適切なインデントが必要です。

**❌ 間違った例**:
```markdown
1. テキスト
  <Img src="/k/img-ja/sample.png" alt="ALTテキスト" />
  説明テキスト
```

**✅ 正しい例**:
```markdown
1. テキスト
   <Img src="/k/img-ja/sample.png" alt="ALTテキスト" />
   説明テキスト
```

**ルール**: 
- 番号付きリスト（`1. `）の場合: 3つのスペースでインデント
- 箇条書きリスト（`- `）の場合: 2つのスペースでインデント
- リスト項目のマーカー（`1. ` や `- `）の文字数に合わせてスペース数を調整する

## テスト結果

- ✅ TypeScript 型チェック通過
- ✅ npm run build 成功（1.68秒、エラーなし）
- ✅ DOM 構造の完全保持確認