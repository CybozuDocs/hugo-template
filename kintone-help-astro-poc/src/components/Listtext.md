# Listtext.astro 変更記録

元ファイル: `layouts/shortcodes/listtext.html`

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
<div class="listtext">
  [内容]
</div>
```

## 実装パターン

- **Props最適化**: Props不要の最大簡素化
- **単純ラッパー**: listtext クラス付きの div でコンテンツをラップ
- **Slot活用**: Hugo の `.Inner | markdownify` を Astro の `<slot />` で代替

## 類似コンポーネントとの比較

| コンポーネント | クラス名 | 用途 | 実装パターン |
|---------------|----------|------|-------------|
| **Annotation.astro** | annotation | 注釈表示 | 同一（divラッパー） |
| **Listsummary.astro** | listsummary | リスト要約 | 同一（divラッパー） |
| **Graynote.astro** | graynote | グレー背景注記 | 同一（divラッパー） |
| **Subtitle.astro** | admonition-title | 小見出し表示 | 同一（divラッパー） |
| **Listtext.astro** | listtext | リストテキスト表示 | 同一（divラッパー） |

## リスクが考えられる箇所

- **Markdown処理**: Hugo の `markdownify` 機能は Astro では自動処理されるため、MDX ファイル内での使用時に差異が生じる可能性
- **スタイル依存**: `.listtext` クラスのCSS定義に依存
- **用途特定**: リストテキストという名前だが、具体的な用途やスタイルが不明

## TODO

なし（実装完了）

## その他留意点として記録しておくこと

### 移行前後の比較
```html
<!-- Hugo -->
{{< listtext >}}
リストテキスト内容
{{< /listtext >}}

<!-- Astro -->
<Listtext>
リストテキスト内容
</Listtext>
```

### 使用方法
```astro
---
import Listtext from '@/components/Listtext.astro';
---

<Listtext>
  リストテキストとして表示したい内容
</Listtext>
```

### 単純ラッパー系コンポーネントのパターン統一

5つの類似コンポーネントが同じ実装パターンを使用：

```astro
<!-- 共通パターン -->
<div class="[クラス名]">
  <slot />
</div>
```

### 用途の推測
- リスト形式でのテキスト表示
- 箇条書き内容の装飾
- 特定のスタイルが必要なテキストブロック
- リスト項目の説明文

### CSS スタイル要件
```css
.listtext {
  /* リストテキスト特有のスタイル */
  line-height: 1.6;
  margin: 0.5rem 0;
  /* その他必要なスタイル */
}
```

### Listsummary.astro との使い分け
- **Listsummary**: リスト要約（まとめ）
- **Listtext**: リストテキスト（詳細・説明）

### Markdown処理の考慮
- **Hugo**: `markdownify` で明示的にMarkdown処理
- **Astro**: MDXファイル内では自動処理
- **影響**: 通常のHTMLファイルでMarkdown記法を使用する場合は手動処理が必要

### 依存関係
- CSS スタイル定義（.listtext クラス）

### テスト要件
- [ ] MDXファイル内での正常な表示を確認
- [ ] HTMLファイル内でのテキスト表示を確認
- [ ] CSS スタイルの適用確認
- [ ] Listsummary.astro との表示差異の確認
- [ ] リスト形式コンテンツでの適用確認

### 関連ファイル
- CSS/SCSS ファイルでの `.listtext` クラス定義
- MDX ファイルでの使用例
- Annotation.astro, Listsummary.astro, Graynote.astro, Subtitle.astro（類似実装パターン）