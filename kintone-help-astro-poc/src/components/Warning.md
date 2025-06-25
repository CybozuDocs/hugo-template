# Warning.astro 変更記録

元ファイル: `layouts/shortcodes/warning.html`

## 関数・変数の置換

| Hugo | Astro | 備考 |
|------|-------|------|
| `{{ i18n "Title_caution" }}` | `<Wovn>i18n__Title_caution</Wovn>` | WOVN翻訳コンポーネントで表示 |
| `{{ printf "%s" .Inner \| markdownify }}` | `<slot />` | ショートコード内容を Astro slot で表示 |
| product条件分岐 | 削除（常に表示） | product="kintone" 固定によりアイコン常時表示 |

## Props 設計

```typescript
// Props 不要（アドモニション統一パターン）
```

## product 固定化による簡素化

### 移行前（Hugo）
```hugo
{{- if and (ne .Site.Params.product "Garoon") (ne .Site.Params.product "Mailwise") (ne .Site.Params.product "Office") (ne .Site.Params.product "Remote") }}
  <i class="fas fa-exclamation-circle" aria-hidden="true"></i>
{{- end }}
```

### 移行後（Astro）
```astro
<!-- product="kintone" 固定により常に表示 -->
<i class="fas fa-exclamation-circle" aria-hidden="true"></i>
```

## DOM 構造の変化

なし（完全に同じ構造を保持）

```html
<!-- Hugo/Astro 共通 -->
<aside class="admonition warning">
  <div class="admonition-alt">
    <i class="fas fa-exclamation-circle" aria-hidden="true"></i>
    <span>[警告タイトル]</span>
  </div>
  <div class="admonition-content">
    [内容]
  </div>
</aside>
```

## 実装パターン

- **アドモニション統一**: Reference.astro, Hint.astro, Note.astro と同じ構造パターン
- **Props最適化**: Props不要の最大簡素化
- **Font Awesome統合**: `fas fa-exclamation-circle` アイコン使用
- **WOVN翻訳統合**: `i18n__Title_caution` パターン活用

## リスクが考えられる箇所

- **CSS依存**: `.admonition.warning` クラスのスタイル定義に依存
- **Font Awesome依存**: Font Awesome CSS/JSの読み込み必須
- **WOVN翻訳**: `Title_caution` キーの翻訳設定必須
- **product固定化**: 他製品用に最適化されたコンテンツでの表示確認要

## TODO

なし（実装完了）

## その他留意点として記録しておくこと

### 移行前後の比較
```html
<!-- Hugo -->
{{< warning >}}
警告内容
{{< /warning >}}

<!-- Astro -->
<Warning>
警告内容
</Warning>
```

### 使用方法
```astro
---
import Warning from '@/components/Warning.astro';
---

<Warning>
  警告として表示したい内容
</Warning>
```

### アドモニション統一パターンの継承
- **構造**: `aside.admonition.{type}` > `div.admonition-alt` + `div.admonition-content`
- **アイコン**: Font Awesome アイコンの aria-hidden 属性保持
- **翻訳**: WOVN コンポーネントによる `i18n__Title_*` パターン
- **コンテンツ**: slot による内容表示

### 他のアドモニション系との差異
| コンポーネント | クラス | アイコン | タイトルキー |
|---------------|--------|----------|-------------|
| Warning.astro | warning | fa-exclamation-circle | Title_caution |
| Reference.astro | reference | fa-info-circle | Title_references |
| Hint.astro | hint | fa-lightbulb | Title_tips |
| Note.astro | note | fa-pencil-alt | Title_note |

### product 固定化の効果
- **Garoon/Mailwise/Office/Remote**: これらの製品では元々アイコンが非表示
- **kintone**: 元々アイコンが表示される製品
- **固定化後**: product="kintone" により常にアイコン表示（元の kintone 動作を保持）

### 依存関係
- Wovn.astro（翻訳コンポーネント）
- Font Awesome CSS/JS（アイコン表示）
- CSS スタイル定義（.admonition.warning クラス）

### テスト要件
- [ ] 警告アイコンの正しい表示確認
- [ ] Title_caution の適切な翻訳表示確認
- [ ] CSS スタイルの適用確認（警告色、背景等）
- [ ] MDX ファイル内での使用テスト
- [ ] アクセシビリティ（スクリーンリーダー対応）確認

### 関連コンポーネント
- Reference.astro, Hint.astro, Note.astro（同パターンのアドモニション）
- Wovn.astro（翻訳機能）
- Info.astro, Graynote.astro（次の実装対象アドモニション）