# Listsummary.astro 変更記録

元ファイル: `layouts/shortcodes/listsummary.html`

## 関数・変数の置換

| Hugo | Astro | 備考 |
|------|-------|------|
| `{{ .Inner \| markdownify }}` | `<slot />` | ショートコード内容を Astro slot で表示 |

## Props 設計

```typescript
// Props 不要（単純なラッパー）
```

## DOM 構造の変化

なし（完全に同じ構造を保持）

```html
<!-- Hugo/Astro 共通 -->
<div class="listsummary">
  [内容]
</div>
```

## 実装パターン

- **Props最適化**: Props不要の最大簡素化
- **単純ラッパー**: listsummary クラス付きの div でコンテンツをラップ
- **Slot活用**: Hugo の `.Inner | markdownify` を Astro の `<slot />` で代替

## リスクが考えられる箇所

- **Markdown処理**: Hugo の `markdownify` 機能は Astro では自動処理されるため、MDX ファイル内での使用時に差異が生じる可能性
- **スタイル依存**: `.listsummary` クラスのCSS定義に依存（CSS未確認）
- **用途特定**: リスト要約という名前だが、具体的な用途やスタイルが不明

## TODO

なし（実装完了）

## その他留意点として記録しておくこと

### 移行前後の比較
```html
<!-- Hugo -->
{{< listsummary >}}
リスト要約内容
{{< /listsummary >}}

<!-- Astro -->
<Listsummary>
リスト要約内容
</Listsummary>
```

### 使用方法
```astro
---
import Listsummary from '@/components/Listsummary.astro';
---

<Listsummary>
  リスト要約として表示したい内容
</Listsummary>
```

### Annotation.astro との類似性
- 実装パターンは Annotation.astro と同一
- クラス名のみが異なる（`.annotation` vs `.listsummary`）
- 用途の違いによるCSS定義の差異の可能性

### CSS 依存関係
- `.listsummary` クラスのスタイル定義が必要
- リスト要約表示に適したスタイル（枠線、背景色等）の確認要

### テスト要件
- [ ] MDXファイル内での正常な表示を確認
- [ ] HTMLファイル内でのテキスト表示を確認
- [ ] CSS スタイルの適用確認
- [ ] Annotation との表示差異の確認

### 関連ファイル
- CSS/SCSS ファイルでの `.listsummary` クラス定義
- MDX ファイルでの使用例
- Annotation.astro（類似実装パターン）