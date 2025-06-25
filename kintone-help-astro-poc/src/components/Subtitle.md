# Subtitle.astro 変更記録

元ファイル: `layouts/shortcodes/subtitle.html`

## 関数・変数の置換

| Hugo | Astro | 備考 |
|------|-------|------|
| `{{ .Inner }}` | `<slot />` | ショートコード内容を Astro slot で表示 |

## Props 設計

```typescript
// Props 不要（単純なラッパー）
```

## DOM 構造の変化

なし（完全に同じ構造を保持）

```html
<!-- Hugo/Astro 共通 -->
<div class="admonition-title">
  [内容]
</div>
```

## 実装パターン

- **Props最適化**: Props不要の最大簡素化
- **単純ラッパー**: admonition-title クラス付きの div でコンテンツをラップ
- **Slot活用**: Hugo の `.Inner` を Astro の `<slot />` で代替

## 類似コンポーネントとの比較

| コンポーネント | クラス名 | 用途 | 実装パターン |
|---------------|----------|------|-------------|
| **Annotation.astro** | annotation | 注釈表示 | 同一（divラッパー） |
| **Listsummary.astro** | listsummary | リスト要約 | 同一（divラッパー） |
| **Graynote.astro** | graynote | グレー背景注記 | 同一（divラッパー） |
| **Subtitle.astro** | admonition-title | 小見出し表示 | 同一（divラッパー） |

## アドモニション系との関係

**重要**: `admonition-title` クラスはアドモニション系コンポーネント（Warning, Info等）のタイトル部分と同じクラス名

### アドモニション内での使用例
```astro
<!-- アドモニション内のタイトル部分 -->
<div class="admonition-alt">
  <i class="fas fa-info-circle" aria-hidden="true"></i>
  <span><div class="admonition-title">タイトル</div></span>
</div>
```

### 単独コンポーネントとしての使用
```astro
<!-- Subtitle.astro として独立使用 -->
<Subtitle>小見出しテキスト</Subtitle>
```

## リスクが考えられる箇所

- **スタイル競合**: アドモニション系の `admonition-title` と同じクラス名による意図しないスタイル適用
- **CSS依存**: `.admonition-title` クラスのスタイル定義に依存
- **用途混同**: アドモニションタイトルと小見出しの使い分け

## TODO

- [ ] アドモニション系コンポーネントとのスタイル競合確認
- [ ] 独立した小見出し用クラス（例：`.subtitle`）への変更検討

## その他留意点として記録しておくこと

### 移行前後の比較
```html
<!-- Hugo -->
{{< subtitle >}}
小見出しテキスト
{{< /subtitle >}}

<!-- Astro -->
<Subtitle>
小見出しテキスト
</Subtitle>
```

### 使用方法
```astro
---
import Subtitle from '@/components/Subtitle.astro';
---

<Subtitle>
  セクションの小見出し
</Subtitle>
```

### CSS クラス名の考慮事項
```css
.admonition-title {
  /* アドモニション系と共有のスタイル */
  font-weight: bold;
  margin-bottom: 0.5rem;
  /* 小見出しとしても適切なスタイル */
}
```

### アドモニション系での使用との違い
- **アドモニション内**: アイコンと組み合わせてタイトル表示
- **Subtitle**: 単独で小見出しとして使用
- **スタイル**: 同じクラスのため見た目は統一される

### 代替実装案
```astro
<!-- より明確な独立クラスを使用する案 -->
<div class="subtitle">
  <slot />
</div>
```

### 用途の推測
- 記事内のセクション見出し
- 手順説明での小タイトル  
- 補足説明の見出し
- アドモニション風の見た目が必要な小見出し

### 依存関係
- CSS スタイル定義（.admonition-title クラス）

### テスト要件
- [ ] 小見出しとしての適切な表示確認
- [ ] アドモニション系コンポーネントとのスタイル整合性確認
- [ ] CSS スタイルの適用確認
- [ ] MDXファイル内での使用テスト

### 関連コンポーネント
- Warning.astro, Info.astro, Reference.astro, Hint.astro, Note.astro（admonition-title クラス使用）
- Annotation.astro, Listsummary.astro, Graynote.astro（類似の単純ラッパー）