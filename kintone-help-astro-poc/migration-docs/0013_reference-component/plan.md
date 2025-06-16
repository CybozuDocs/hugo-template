# Reference.astro 実装計画

## 概要

現在ダミー実装となっている `Reference.astro` を `layouts/shortcodes/reference.html` をもとに完成させる。

## 元ファイルの分析

### Hugo ショートコード: `layouts/shortcodes/reference.html`

```html
<aside class="admonition reference">
  <div class="admonition-alt">
    <i class="fas fa-info-circle fa-fw" aria-hidden="true"></i>
    <span>{{ i18n "Title_references" }}</span>
  </div>
  <div class="admonition-content">{{ printf "%s" .Inner | markdownify }}</div>
</aside>
```

### 機能分析

1. **HTML構造**: `aside` 要素による参考情報ボックス
2. **CSS クラス**: `admonition reference`
3. **アイコン**: Font Awesome の `fa-info-circle`
4. **タイトル**: i18n による多言語対応（`Title_references`）
5. **コンテンツ**: MarkdownifyによるInner contentの表示

### 現在の実装状況

```astro
<div><slot /></div>
```

基本的なラッパーのみ実装済み。

## 実装方針

### 1. DOM構造の厳密な保持

migrate-rules.md に従い、元のHTML構造を正確に再現：

- `<aside class="admonition reference">` 構造の保持
- `admonition-alt` と `admonition-content` の分離維持
- Font Awesome アイコンの配置保持

### 2. i18n 対応

- `{{ i18n "Title_references" }}` → `<Wovn>i18n__Title_references</Wovn>`
- Wovn コンポーネントを使用した翻訳機能実装

### 3. Markdown対応

- `.Inner | markdownify` → `<slot />` による内容表示
- Astroの標準的なSlot機能を使用

### 4. TypeScript型定義

- 基本的な Props 設定は不要（slot のみ使用）
- BaseProps は不要（環境設定参照なし）

## 実装ステップ

### ステップ1: HTML構造の実装

1. `aside` 要素の基本構造作成
2. CSS クラス `admonition reference` の設定
3. `admonition-alt` と `admonition-content` の分離

### ステップ2: アイコンとタイトルの実装

1. Font Awesome アイコン `fa-info-circle` の配置
2. Wovn コンポーネントによるタイトル表示
3. アクセシビリティ属性の保持

### ステップ3: コンテンツ表示の実装

1. `<slot />` による内容表示
2. Markdownify相当の機能確認

### ステップ4: 品質確保

1. ビルドテストの実行
2. DOM構造の確認
3. 変更記録ファイルの作成

## 期待される結果

### 完成後のコンポーネント

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

### 品質基準

- ✅ DOM構造の完全な保持
- ✅ Font Awesome アイコンの正確な配置
- ✅ Wovn による翻訳機能
- ✅ Slot による内容表示
- ✅ ビルドテスト成功

## 注意事項

### migrate-rules.md 準拠

1. **DOM構造の厳密な保持**: 元のHTML構造を正確に再現
2. **文言の勝手な追加禁止**: i18nキーをそのまま使用
3. **CSS クラス名の維持**: `admonition reference` を保持
4. **アクセシビリティ属性の保持**: `aria-hidden="true"` を維持

### 実装上の配慮

1. **外部依存の最小化**: Font Awesome は既存CSS前提
2. **型安全性の確保**: 必要最小限の Props 定義
3. **再利用性の確保**: 汎用的なショートコード実装

## 成果物

1. **Reference.astro**: 完成したコンポーネント
2. **Reference.md**: 変更記録ファイル
3. **ビルドテスト**: `npm run build` 成功確認