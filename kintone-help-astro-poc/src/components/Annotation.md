# Annotation.astro 変更記録

元ファイル: `layouts/shortcodes/annotation.html`

## 関数・変数の置換

| Hugo | Astro | 備考 |
|------|-------|------|
| `{{.Inner \| markdownify}}` | `<slot />` | ショートコード内容を Astro slot で表示 |

## Props 設計

```typescript
// Props 不要（単純なラッパー）
```

## DOM 構造の変化

なし（完全に同じ構造を保持）

```html
<!-- Hugo/Astro 共通 -->
<div class="annotation">
  [内容]
</div>
```

## 実装パターン

- **Props最適化**: Props不要の最大簡素化
- **単純ラッパー**: annotation クラス付きの div でコンテンツをラップ
- **Slot活用**: Hugo の `.Inner | markdownify` を Astro の `<slot />` で代替

## リスクが考えられる箇所

- **Markdown処理**: Hugo の `markdownify` 機能は Astro では自動処理されるため、MDX ファイル内での使用時に差異が生じる可能性
- **スタイル依存**: `.annotation` クラスのCSS定義に依存（CSS未確認）

## TODO

なし（実装完了）

## その他留意点として記録しておくこと

### 移行前後の比較
```html
<!-- Hugo -->
{{< annotation >}}
注釈内容
{{< /annotation >}}

<!-- Astro -->
<Annotation>
注釈内容
</Annotation>
```

### 使用方法
```astro
---
import Annotation from '@/components/Annotation.astro';
---

<Annotation>
  注釈として表示したい内容
</Annotation>
```

### Markdown処理の違い
- **Hugo**: `markdownify` 関数で明示的にMarkdown処理
- **Astro**: MDXファイル内では自動的にMarkdown処理される
- **影響**: 通常のHTMLファイルでMarkdown記法を使用する場合は手動処理が必要

### CSS 依存関係
- `.annotation` クラスのスタイル定義が必要
- 注釈表示に適したスタイル（背景色、パディング等）の確認要

### テスト要件
- [ ] MDXファイル内での正常な表示を確認
- [ ] HTMLファイル内でのテキスト表示を確認
- [ ] CSS スタイルの適用確認

### 関連ファイル
- CSS/SCSS ファイルでの `.annotation` クラス定義
- MDX ファイルでの使用例