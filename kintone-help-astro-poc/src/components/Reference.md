# Reference.astro 変更記録

元ファイル: `layouts/shortcodes/reference.html`

## 概要

Hugo ショートコードの `reference.html` を Astro コンポーネントに移行。参考情報を表示するアドモニション（注意書き）ボックスの実装。

## 関数・変数の置換

| Hugo | Astro | 備考 |
|------|-------|------|
| `{{ i18n "Title_references" }}` | `<Wovn>i18n__Title_references</Wovn>` | WOVN翻訳サービス使用 |
| `{{ printf "%s" .Inner \| markdownify }}` | `<slot />` | Astroの標準Slot機能 |

## 構造の変化

### 元の実装（Hugo）
```html
<aside class="admonition reference">
  <div class="admonition-alt">
    <i class="fas fa-info-circle fa-fw" aria-hidden="true"></i>
    <span>{{ i18n "Title_references" }}</span>
  </div>
  <div class="admonition-content">{{ printf "%s" .Inner | markdownify }}</div>
</aside>
```

### 新しい実装（Astro）
```astro
---
import Wovn from './Wovn.astro';
---

<aside class="admonition reference">
  <div class="admonition-alt">
    <i class="fas fa-info-circle fa-fw" aria-hidden="true"></i>
    <span><Wovn>i18n__Title_references</Wovn></span>
  </div>
  <div class="admonition-content"><slot /></div>
</aside>
```

## 機能の詳細

### 1. アドモニションボックス
- **CSS クラス**: `admonition reference`
- **役割**: 参考情報を視覚的に区別して表示

### 2. ヘッダー部分（admonition-alt）
- **アイコン**: Font Awesome `fa-info-circle` 
- **タイトル**: "参考" の多言語対応
- **WOVN統合**: `i18n__Title_references` キーによる翻訳

### 3. コンテンツ部分（admonition-content）
- **Slot機能**: 子要素の内容をそのまま表示
- **Markdown対応**: Astroのコンテンツ処理に依存

## 使用方法

```astro
<Reference>
  参考情報の内容をここに記述
</Reference>
```

## 外部依存

- **Wovn.astro**: 翻訳機能提供
- **Font Awesome**: アイコン表示（既存CSS前提）

## 注意事項

- DOM構造は元のHugoテンプレートと完全に一致
- CSS クラス名も変更なし
- アクセシビリティ属性（`aria-hidden`）も保持
- 文言の追加や変更は行わず、元の仕様を厳密に再現