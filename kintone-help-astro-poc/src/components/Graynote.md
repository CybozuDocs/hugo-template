# Graynote.astro 変更記録

元ファイル: `layouts/shortcodes/graynote.html`

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
<div class="graynote">
  [内容]
</div>
```

## 実装パターン

- **Props最適化**: Props不要の最大簡素化
- **単純ラッパー**: graynote クラス付きの div でコンテンツをラップ
- **Slot活用**: Hugo の `.Inner | markdownify` を Astro の `<slot />` で代替

## 類似コンポーネントとの比較

| コンポーネント | クラス名 | 用途 | 実装パターン |
|---------------|----------|------|-------------|
| **Annotation.astro** | annotation | 注釈表示 | 同一（divラッパー） |
| **Listsummary.astro** | listsummary | リスト要約 | 同一（divラッパー） |
| **Graynote.astro** | graynote | グレー背景注記 | 同一（divラッパー） |

## リスクが考えられる箇所

- **Markdown処理**: Hugo の `markdownify` 機能は Astro では自動処理されるため、MDX ファイル内での使用時に差異が生じる可能性
- **スタイル依存**: `.graynote` クラスのCSS定義に依存（グレー背景スタイル）
- **アドモニションとの混同**: Warning/Info等のアドモニションと異なる構造

## TODO

なし（実装完了）

## その他留意点として記録しておくこと

### 移行前後の比較
```html
<!-- Hugo -->
{{< graynote >}}
グレー背景で表示する注記
{{< /graynote >}}

<!-- Astro -->
<Graynote>
グレー背景で表示する注記
</Graynote>
```

### 使用方法
```astro
---
import Graynote from '@/components/Graynote.astro';
---

<Graynote>
  グレー背景で表示したい注記内容
</Graynote>
```

### アドモニション系との違い
- **アドモニション系**: `aside.admonition.{type}` 構造、アイコン・タイトル付き
- **Graynote**: シンプルな `div.graynote` 構造、装飾なし

### CSS スタイル要件
```css
.graynote {
  background-color: #f5f5f5; /* グレー背景 */
  padding: 1rem;
  border-radius: 4px;
  /* その他必要なスタイル */
}
```

### 用途の推測
- 補足説明の表示
- 重要度が中程度の情報
- 目立たせたいがアラートではない内容
- 背景色による視覚的区別が必要な注記

### Annotation.astro との使い分け
- **Annotation**: 一般的な注釈（背景色なし）
- **Graynote**: グレー背景付きの注記（視覚的強調）

### 依存関係
- CSS スタイル定義（.graynote クラス）

### テスト要件
- [ ] MDXファイル内での正常な表示を確認
- [ ] HTMLファイル内でのテキスト表示を確認
- [ ] CSS スタイルの適用確認（グレー背景）
- [ ] Annotation.astro との表示差異の確認

### 関連ファイル
- CSS/SCSS ファイルでの `.graynote` クラス定義
- MDX ファイルでの使用例
- Annotation.astro, Listsummary.astro（類似実装パターン）