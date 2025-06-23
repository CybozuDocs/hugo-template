# Hint.astro コンポーネント実装プラン

## 概要

Hugo の `layouts/shortcodes/hint.html` ショートコードを Astro コンポーネント `kintone-help-astro-poc/src/components/Hint.astro` として移植する。

## 元ファイル分析

### layouts/shortcodes/hint.html の構造

```html
<aside class="admonition hint">
  <div class="admonition-alt">
{{- if and (ne .Site.Params.product "Garoon") (ne .Site.Params.product "Mailwise") (ne .Site.Params.product "Office") (ne .Site.Params.product "Remote")}}
    <i class="fas fa-lightbulb" aria-hidden="true"></i>
{{- end }}
    <span class="admonition-alt-text">{{ i18n "Title_tips" }}</span>
  </div>
  <div class="admonition-content">{{ printf "%s" .Inner | markdownify }}</div>
</aside>
```

### 主要機能の分析

1. **DOM構造**: `aside.admonition.hint` > `div.admonition-alt` + `div.admonition-content`
2. **アイコン表示**: Font Awesome `fas fa-lightbulb`、他製品では非表示
3. **i18n**: `{{ i18n "Title_tips" }}` によるタイトル翻訳
4. **内容**: `{{ .Inner | markdownify }}` でMarkdown内容を処理

### 固定値適用による簡素化

- **product="kintone"固定**: 他製品条件を削除、アイコンは常に表示
- **templateVersion="2"固定**: バージョン分岐は不要

## 実装方針

### 1. DOM構造の保持

元のHugo構造を正確に再現：

```astro
<aside class="admonition hint">
  <div class="admonition-alt">
    <i class="fas fa-lightbulb" aria-hidden="true"></i>
    <span class="admonition-alt-text"><Wovn>i18n__Title_tips</Wovn></span>
  </div>
  <div class="admonition-content">
    <slot />
  </div>
</aside>
```

### 2. Props設計

最小限のPropsによる簡素化：

```typescript
// Props不要（最大限簡素化）
// slot による内容表示
```

### 3. i18n対応

```
{{ i18n "Title_tips" }} → <Wovn>i18n__Title_tips</Wovn>
```

### 4. 製品分岐の削除

```html
<!-- 元の条件分岐削除 -->
{{- if and (ne .Site.Params.product "Garoon") ... }}

<!-- 簡素化: kintone固定でアイコン常に表示 -->
<i class="fas fa-lightbulb" aria-hidden="true"></i>
```

## 実装手順

### 1. Hint.astro作成

- DOM構造の正確な再現
- Font Awesome アイコンの配置
- WOVN翻訳コンポーネントの統合
- slotによる内容表示

### 2. 型安全性確保

- Props不要（最大限簡素化アプローチ）
- import文なし（外部依存なし）

### 3. 品質確保

- ビルドテスト実行
- DOM構造の確認
- アクセシビリティ属性の保持

## 期待される成果

### 1. 機能

- ヒント情報を表示するアドモニションボックス
- Font Awesome電球アイコン付きの視覚的強調
- WOVN翻訳による多言語対応

### 2. アーキテクチャ

- Props最小化による高い再利用性
- 外部依存なしによる独立性
- Hugo構造との完全な互換性

### 3. 保守性

- シンプルな実装による理解しやすさ
- 条件分岐削除による保守性向上
- 統一的なアドモニション形式

## 参考コンポーネント

- **Reference.astro**: 類似のアドモニション実装
- **Wovn.astro**: i18n翻訳パターン
- その他のProps最適化済みコンポーネント

## リスク・注意点

1. **DOM構造の変更禁止**: 元構造の正確な保持
2. **文言追加禁止**: 勝手な文言追加は厳禁
3. **アクセシビリティ**: aria-hidden属性の保持
4. **Font Awesome依存**: CSSが読み込まれている前提

## 完了条件

- [ ] Hint.astroファイル作成完了
- [ ] ビルドテスト成功
- [ ] 変更記録ファイル（Hint.md）作成
- [ ] DOM構造の正確性確認
- [ ] アクセシビリティ属性保持確認