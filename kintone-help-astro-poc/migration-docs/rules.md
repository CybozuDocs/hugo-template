# Astro 開発ガイドライン

## 概要

このドキュメントは、Astro プロジェクトの開発ルールとナレッジを記録します。開発指針として参照してください。

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

複雑なコンポーネントは責任に応じて適切に分割する。各コンポーネントは単一の責任を持つよう設計する。

## 実装ルール

### 1. ファイル構成・命名規則

- **Astroコンポーネント**: PascalCase + `.astro` 拡張子
- **変更記録ファイル**: 同名 + `.md` 拡張子
- **配置場所**: `src/components/` ディレクトリ


### 1. TypeScript 型定義

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

### 2. i18n（国際化）対応

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

- **プロジェクト概要**: `CLAUDE.md`

## 環境変数管理

### 1. 環境変数ファイル構成

#### .env ファイル
Astro の標準的な環境変数システムを使用：

```bash
# サイト基本設定
PUBLIC_BASE_URL=https://jp.cybozu.help/k/
PUBLIC_TEMPLATE_VERSION=2
PUBLIC_PRODUCT=kintone

# 言語別設定（接尾辞で管理）
PUBLIC_PRODUCT_NAME_JA=kintone
PUBLIC_PRODUCT_NAME_EN=kintone
PUBLIC_HELP_JA=ヘルプ
PUBLIC_HELP_EN=Help
```

#### 命名規則
- **PUBLIC_** プレフィックス: クライアント側でアクセス可能な環境変数
- **大文字スネークケース**: PUBLIC_VARIABLE_NAME
- **言語接尾辞**: _JA, _EN, _ZH, _ZH_TW

### 1. TypeScript 型定義 (env.d.ts)

```typescript
/// <reference types="astro/client" />

interface ImportMetaEnv {
  // サイト基本設定
  readonly PUBLIC_BASE_URL: string;
  readonly PUBLIC_TEMPLATE_VERSION: string;
  // ... 他の環境変数
  
  // 動的に生成される言語固有の設定用
  [key: string]: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

### 2. 環境変数ローダー (src/lib/env.ts)

#### 基本構成
```typescript
// 言語固有の環境変数を取得
export const getLocalizedEnvValue = (key: string, langCode: string): string => {
  const langSuffix = langCode.toUpperCase().replace('-', '_');
  const localizedKey = `PUBLIC_${key}_${langSuffix}`;
  const defaultKey = `PUBLIC_${key}_JA`; // デフォルトは日本語
  
  return import.meta.env[localizedKey] || 
         import.meta.env[defaultKey] || 
         import.meta.env[`PUBLIC_${key}`] || '';
};

// 環境変数から設定オブジェクトを構築
export const buildEnvConfig = (options: {
  languageCode?: string;
  product?: string;
  targetRegion?: string;
  useWovn?: boolean;
  meganav?: boolean;
} = {}) => {
  // ... 実装
};

// 型定義のエクスポート
export type EnvConfig = ReturnType<typeof buildEnvConfig>;
```

### 3. コンポーネントでの使用パターン

#### レイアウトコンポーネント
```astro
---
import { buildEnvConfig } from "../lib/env.js";

const envConfig = buildEnvConfig({
  languageCode,
  product,
  targetRegion,
  useWovn,
  meganav
});
---

<Head env={envConfig} page={Astro.url} />
```

#### 子コンポーネント
```astro
---
interface Props {
  env: {
    product: string;
    baseURL: string;
    // 必要なプロパティのみ定義
  };
}

const { env } = Astro.props;
---

<div>{env.product}</div>
```

### 4. 環境変数のベストプラクティス

#### デフォルト値の設定
```typescript
// 環境変数が未定義の場合は空文字列を返す
const value = import.meta.env.PUBLIC_SOME_VALUE || '';

// 言語固有の値が見つからない場合は日本語設定をフォールバック
const localizedValue = getLocalizedEnvValue('PRODUCT_NAME', langCode);
```

#### ブール値の扱い
```typescript
// 文字列として保存されるため、明示的な変換が必要
const isEnabled = import.meta.env.PUBLIC_FEATURE_FLAG === 'true';
```

#### 配列やオブジェクトの扱い
```typescript
// JSON 文字列として保存し、パース
const colors = JSON.parse(import.meta.env.PUBLIC_LABEL_COLORS || '[]');
```

## DOM構造の保持原則

Astroコンポーネントは元のHTML構造を正確に保持する必要があります：

- 不要な wrapper 要素の追加を避ける
- 元の class 名と id を維持
- セマンティックHTMLを遵守

## 更新履歴

- 2024年12月 - 初版作成
- 2025年1月 - 環境変数管理セクション追加