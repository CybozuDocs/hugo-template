# Hugo から Astro への移行ルール・開発ガイドライン

## 概要

このドキュメントは、Hugo テンプレートから Astro コンポーネントへの移行作業で確立された開発ルールとナレッジを記録します。移行完了後も Astro プロジェクトの開発指針として参照できます。

## コンポーネント設計原則

### 1. コンポーネント分類

#### 基本コンポーネント
- **用途**: 単一責任の機能を持つ再利用可能なコンポーネント
- **例**: `Wovn.astro`, `Title.astro`, `GotoTop.astro`

#### レイアウトコンポーネント
- **用途**: ページ構造やナビゲーションを担当
- **例**: `Header.astro`, `Footer.astro`, `Nav.astro`

#### 複合コンポーネント
- **用途**: 複数の機能を組み合わせた高機能コンポーネント
- **例**: `TreeNav.astro`, `MegaNav.astro`, `SearchBox.astro`

### 2. コンポーネント分割規則

Hugo の `define`/`template` は個別の Astro コンポーネントに分割：

```astro
<!-- Hugo -->
{{ define "mainmenu" }}...{{ end }}
{{ template "mainmenu" . }}

<!-- Astro -->
<!-- TreeNavMainMenu.astro として分離 -->
<TreeNavMainMenu {env} {page} />
```

## 実装ルール

### 1. ファイル構成・命名規則

- **Astroコンポーネント**: PascalCase + `.astro` 拡張子
- **変更記録ファイル**: 同名 + `.md` 拡張子
- **配置場所**: `src/components/` ディレクトリ

### 2. 変更記録ファイル

移行時には各コンポーネントに対応する `.md` ファイルを作成し、変更内容を記録する：

```markdown
# {ComponentName} 変更記録

元ファイル: `layouts/partials/{filename}.html`

## 関数・変数の置換

| Hugo | Astro | 備考 |
|------|-------|------|

## TODO

- [ ] 未実装機能

## 構造の変化

## その他の差分

## 外部依存

## 注意事項
```

### 3. TypeScript 型定義

すべてのコンポーネントで Props の型定義を実装：

```typescript
interface Props {
  env?: {
    product?: string;
    baseURL?: string;
    languageCode?: string;
    // 必要なプロパティを追加
  };
  page?: {
    isHome?: boolean;
    title?: string;
    relPermalink?: string;
    // 必要なプロパティを追加
  };
  // コンポーネント固有のプロパティ
}
```

### 4. i18n（国際化）対応

#### WOVN サービスを利用した翻訳

- **通常の箇所**: `{{ i18n "key" }}` → `<Wovn>i18n__key</Wovn>`
- **属性内**: `{{ i18n "key" }}` → `i18n__todo__key` (TODO マーク付き)

#### Wovn コンポーネントの使用

```astro
---
import Wovn from './Wovn.astro';
---

<button><Wovn>i18n__Contact_support</Wovn></button>
<button aria-label="i18n__todo__search">
```

### 5. Hugo 変数のマッピング

#### env プロパティ（サイト設定値）

```typescript
// Hugo → Astro
$.Site.Params.product → env.product
$.Site.BaseURL → env.baseURL
.Site.LanguageCode → env.languageCode
.Site.Params.TargetRegion → env.targetRegion
```

#### page プロパティ（ページ情報）

```typescript
// Hugo → Astro
.IsHome → page.isHome
.Title → page.title
.RelPermalink → page.relPermalink
.Parent → page.parent
.CurrentSection → page.currentSection
```

### 6. テンプレート構文の変換

#### 条件分岐

```astro
<!-- Hugo -->
{{ if condition }}...{{ else }}...{{ end }}

<!-- Astro -->
{condition ? (
  <div>...</div>
) : (
  <div>...</div>
)}

<!-- Hugo -->
{{ with .Variable }}...{{ end }}

<!-- Astro -->
{variable && (
  <div>...</div>
)}
```

#### ループ処理

```astro
<!-- Hugo -->
{{ range .Items }}
  <div>{{ . }}</div>
{{ end }}

<!-- Astro -->
{items.map((item) => (
  <div key={item.id}>{item}</div>
))}
```

#### 文字列処理

```javascript
// Hugo → JavaScript
strings.TrimPrefix "prefix" . → str.replace(/^prefix/, '')
strings.TrimSuffix "suffix" . → str.replace(/suffix$/, '')
split . " " → str.split(' ')
printf "%s %s" $var1 $var2 → `${var1} ${var2}`
replaceRE "pattern" $replacement $target → target.replace(/pattern/g, replacement)
hasPrefix → str.startsWith()
hasSuffix → str.endsWith()
```

#### コレクション操作

```javascript
// Hugo → JavaScript
.Pages.ByWeight → pages.sort((a, b) => a.weight - b.weight)
union → [...array1, ...array2] または Array.from(new Set([...array1, ...array2]))
where .Site.RegularPages "Section" "" → regularPages.filter(p => p.section === "")
first 5 → slice(0, 5)
len → .length
add → +
sub → -
index → array[index]
range → Array.from({ length: n }, (_, i) => i)
seq → Array.from({ length: n }, (_, i) => i + 1)
```

## 外部サービス統合

### WOVN 翻訳サービス

WOVN.io を使用した多言語対応：

```astro
---
interface Props {
  langCode?: string;
}

const { langCode } = Astro.props;
const className = langCode === 'en' ? 'wv-brk wv-brk-en' : 'wv-brk';
---

<span class={className}><slot /></span>
```

### 外部スクリプトの扱い

```astro
<!-- 静的スクリプト -->
<script is:inline>
  // GTM, Zendesk, HubSpot などのスクリプト
</script>

<!-- 動的パラメータ付きスクリプト -->
<script is:inline src="https://example.com/script.js" data-param={dynamicValue}></script>
```

## 品質管理・開発指針

### 開発時のチェック項目

- [ ] TypeScript interface の適切な定義
- [ ] 必要十分な Props の設計
- [ ] HTML 構造とセマンティクスの維持
- [ ] CSS クラス名の一貫性
- [ ] アクセシビリティ（ARIA 属性）の考慮
- [ ] エラーハンドリングの実装
- [ ] パフォーマンスの考慮（メモ化など）

### コードレビュー観点

1. **型安全性**: TypeScript 型定義の適切性
2. **Props 設計**: 再利用性と保守性を考慮した設計
3. **パフォーマンス**: 不要な再計算や再レンダリングの回避
4. **アクセシビリティ**: セマンティックHTML と ARIA 属性の適切な使用
5. **コードの可読性**: 命名規則とコメントの適切性
6. **テスタビリティ**: テストしやすい構造の実装

## 設計パターン

### Props パターン

```typescript
// 基本パターン
interface BaseProps {
  env: EnvProps;    // サイト設定値
  page: PageProps;  // ページ情報
}

// 拡張パターン
interface ComponentProps extends BaseProps {
  // コンポーネント固有のプロパティ
  customProp?: string;
}
```

### 条件レンダリングパターン

```astro
<!-- null チェック -->
{variable && (
  <div>{variable}</div>
)}

<!-- 三項演算子 -->
{condition ? (
  <div>A</div>
) : (
  <div>B</div>
)}

<!-- 配列レンダリング -->
{items.map((item, index) => (
  <div key={item.id || index}>{item.name}</div>
))}
```

### エラーハンドリングパターン

```astro
---
// Props の validation
const { items = [], fallbackText = "No items" } = Astro.props;

// 安全な配列操作
const safeItems = Array.isArray(items) ? items : [];
---

{safeItems.length > 0 ? (
  <ul>
    {safeItems.map(item => (
      <li key={item.id}>{item.name}</li>
    ))}
  </ul>
) : (
  <p>{fallbackText}</p>
)}
```

## 参考情報

- **移行状況**: `migration-docs/migrate-memo.md`
- **移行計画**: `migration-docs/migrate-partials/plan.md`
- **プロジェクト概要**: `CLAUDE.md`

## 更新履歴

- 2024年12月 - 初版作成（Hugo → Astro 移行ルール確立）