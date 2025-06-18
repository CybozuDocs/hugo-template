# Astro 開発ガイドライン

## 概要

このドキュメントは、Astro プロジェクトの開発ルールとナレッジを記録します。開発指針として参照してください。


## プロジェクト固定値

このプロジェクトでは以下の値が固定されており、分岐処理は不要です：

- **templateVersion**: `"2"` で固定
  - templateVersion=1 の古い実装は削除済み
  - 全てのコンポーネントでtemplateVersion=2を前提とした実装
  - 環境変数 `PUBLIC_TEMPLATE_VERSION` は削除済み
- **product**: `"kintone"` で固定
  - Garoon、Mailwise、Office、Remote等の他製品は対象外
  - support_guide、slash、store等の特別製品も対象外
  - kintone固有の実装を前提とした設計
  - 環境変数 `PUBLIC_PRODUCT` は削除済み

### 削除された機能

以下の機能は完全に削除され、実装時に考慮不要：

- 他製品の条件分岐処理
- templateVersion=1の古い実装
- 製品別のTOC設定
- 他製品の地域別処理

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

- **Astro コンポーネント**: PascalCase + `.astro` 拡張子
- **変更記録ファイル**: 同名 + `.md` 拡張子
- **配置場所**: `src/components/` ディレクトリ

### 1. TypeScript 型定義

#### 基本ルール: BaseProps の使用

独自の環境設定が不要なコンポーネントは必ずBasePropsを使用：

```typescript
import type { BaseProps } from './types';

interface Props extends BaseProps {}
```

#### 独自プロパティが必要な場合

以下の場合のみカスタムProps定義を許可：

```typescript
// コンポーネント固有のプロパティがある場合
interface Props {
  cursect: PageProps;  // 独自プロパティ
  env: EnvProps;       // EnvPropsは使用可能
}

// 特殊なPage型が必要な場合
interface Props extends BaseProps {
  // BasePropsを継承しつつ独自定義
}
```

#### 型安全性の確保

- 全てのコンポーネントでPropsの型定義を実装
- TypeScript interfaceを使用して型安全性を保証
- Props変更後は必ず `npm run build` でビルドテストを実行

#### any 型の禁止

- **any 型の使用は完全に禁止**
- 適切な型定義を作成し、型安全性を確保する
- 外部ライブラリの型が不明な場合は、適切なインターフェースを定義する
- unknown型や Record<string, unknown> など、より安全な型を使用する

### 2. i18n（国際化）対応

#### WOVN サービスを利用した翻訳

- **通常の箇所**: `{{ i18n "key" }}` → `<Wovn>i18n__key</Wovn>`
- **属性内**: `{{ i18n "key" }}` → `i18n__todo__key` (TODO マーク付き)

#### Wovn コンポーネントの使用

```astro
---
import Wovn from '@/components/Wovn.astro';
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

## コードフォーマット（Prettier）

### Prettier 設定

プロジェクトでは [Prettier](https://prettier.io/) を使用してコードスタイルを統一しています。

#### 設定ファイル

`.prettierrc` でAstro対応のPrettier設定を定義：

```json
{
  "plugins": ["prettier-plugin-astro"],
  "overrides": [
    {
      "files": "*.astro",
      "options": {
        "parser": "astro"
      }
    }
  ]
}
```

#### フォーマット実行

```bash
# フォーマット実行
npm run format

# フォーマットチェック（CI用）
npm run format:check
```

#### .prettierignore による除外

以下のファイル・ディレクトリはフォーマット対象外：

- `dist/` - ビルド出力
- `public/` - 静的ファイル（Hugo生成物）
- `migration-docs/` - ドキュメント内のコードブロック
- 構文エラーのあるAstroファイル

#### 部分的なフォーマット無効化

特定のコードブロックのフォーマットを無効にする場合：

```astro
{/* prettier-ignore */}
{complexCode && 
  someFunction(param1, param2, param3)
}
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
- [ ] **コードフォーマットの実行**（`npm run format` でコードスタイルを統一）
- [ ] **テストの実行と成功確認**（`npm test` で全テストがパスすることを確認）

### コードレビュー観点

1. **型安全性**: TypeScript 型定義の適切性
2. **Props 設計**: 再利用性と保守性を考慮した設計
3. **パフォーマンス**: 不要な再計算や再レンダリングの回避
4. **アクセシビリティ**: セマンティック HTML と ARIA 属性の適切な使用
5. **コードの可読性**: 命名規則とコメントの適切性
6. **テスタビリティ**: テストしやすい構造の実装

## 設計パターン

### Props パターン

```typescript
// 基本パターン
interface BaseProps {
  env: EnvProps; // サイト設定値
  page: PageProps; // ページ情報
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

#### .env ファイル構成

Astro の標準的な環境変数システムを使用（多リージョン・単一言語版）：

#### リージョン別ファイル構成

```bash
# メイン設定ファイル
.env                # デフォルト設定
.env.jp             # 日本リージョン
.env.jp_staging     # 日本リージョン（staging）
.env.us             # アメリカリージョン
.env.us_staging     # アメリカリージョン（staging）
.env.cn             # 中国リージョン
.env.cn_staging     # 中国リージョン（staging）
```

### 2. 環境変数処理 (src/lib/env.ts)

`buildEnvConfig`関数で.env ファイルの環境変数を読み込み：

```typescript
export const buildEnvConfig = (options: {
  languageCode?: string;
  targetRegion?: string;
  useWovn?: boolean;
  meganav?: boolean;
} = {}) => {
  // 環境変数から設定オブジェクトを構築
  return {
    // 基本設定
    baseURL: import.meta.env.PUBLIC_BASE_URL || "",
    domain: import.meta.env.PUBLIC_DOMAIN || "",
    targetRegion: targetRegion || import.meta.env.PUBLIC_TARGET_REGION || "JP",
    // その他の設定...
  };
};
```

#### リージョン別設定例

```bash
# .env.jp （日本リージョン）
PUBLIC_BASE_URL=https://jp.cybozu.help/k/
PUBLIC_TARGET_REGION=JP
PUBLIC_KINTONE=kintone
PUBLIC_SERVICE=cybozu.com
PUBLIC_GOOGLE_SEARCH=true
PUBLIC_MEGANAV=false

# .env.us （アメリカリージョン）
PUBLIC_BASE_URL=https://get.kintone.help/k/
PUBLIC_TARGET_REGION=US
PUBLIC_KINTONE=Kintone  # 大文字Kのブランディング
PUBLIC_SERVICE=Kintone
PUBLIC_GOOGLE_SEARCH=true
PUBLIC_MEGANAV=true     # アメリカのみ有効

# .env.cn （中国リージョン）
PUBLIC_BASE_URL=https://help.cybozu.cn/k/
PUBLIC_TARGET_REGION=CN
PUBLIC_KINTONE=kintone
PUBLIC_SERVICE=cybozu.cn
PUBLIC_BING_SEARCH=true  # 中国はBing検索
PUBLIC_MEGANAV=false

# 全リージョン共通：日本語設定
PUBLIC_DEFAULT_CONTENT_LANGUAGE=ja
PUBLIC_LANGUAGE_CODE=ja-jp
PUBLIC_PRODUCT_NAME=kintone
PUBLIC_HELP=ヘルプ

# 他言語設定 - コメントアウト
# PUBLIC_PRODUCT_NAME_EN=kintone
# PUBLIC_HELP_EN=Help
```

#### 命名規則

- **PUBLIC\_** プレフィックス: クライアント側でアクセス可能な環境変数
- **大文字スネークケース**: PUBLIC_VARIABLE_NAME
- **リージョン設定**: ファイル名で管理（.env.jp, .env.us, .env.cn）
- **日本語設定**: 接尾辞なし（シンプルなキー名）
- **他言語設定**: コメントアウト状態で保持

### 1. TypeScript 型定義 (env.d.ts)

```typescript
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_BASE_URL: string;
  readonly PUBLIC_DOMAIN: string;
  readonly PUBLIC_TARGET_REGION: "JP" | "US" | "CN";
  readonly PUBLIC_KINTONE: string;
  // ... 他の環境変数

  [key: string]: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

### 2. 環境変数ローダー (src/lib/env.ts)

直接環境変数を参照するシンプルな構成：

```typescript
export const buildEnvConfig = (
  options: {
    languageCode?: string;
    targetRegion?: string;
    useWovn?: boolean;
    meganav?: boolean;
  } = {}
) => {
  return {
    languageCode: languageCode || import.meta.env.PUBLIC_LANGUAGE_CODE || 'ja-jp',
    productName: import.meta.env.PUBLIC_PRODUCT_NAME || '',
    help: import.meta.env.PUBLIC_HELP || '',
    baseURL: import.meta.env.PUBLIC_BASE_URL || '',
    targetRegion: targetRegion || import.meta.env.PUBLIC_TARGET_REGION || 'JP',
    // その他すべての環境変数...
  };
};

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

#### デフォルト値の設定（簡素化版）

```typescript
// 環境変数が未定義の場合は空文字列を返す
const value = import.meta.env.PUBLIC_SOME_VALUE || "";

// 日本語特化により直接参照が可能
const productName = import.meta.env.PUBLIC_PRODUCT_NAME || '';
const help = import.meta.env.PUBLIC_HELP || '';
```

#### ブール値の扱い

```typescript
// 文字列として保存されるため、明示的な変換が必要
const isEnabled = import.meta.env.PUBLIC_FEATURE_FLAG === "true";
```

#### 配列やオブジェクトの扱い

```typescript
// JSON 文字列として保存し、パース
const colors = JSON.parse(import.meta.env.PUBLIC_LABEL_COLORS || "[]");
const searchTabs = JSON.parse(import.meta.env.PUBLIC_GOOGLE_SEARCH_TABS_JA || "[]");
```

### 5. リージョン・環境別設定の管理

#### ファイル構成（程定使用中）

**全リージョン稼働中**:
- `.env` - メイン設定（デフォルト）
- `.env.jp` - 日本リージョンプロダクション環境
- `.env.jp_staging` - 日本リージョンステージング環境
- `.env.us` - アメリカリージョンプロダクション環境
- `.env.us_staging` - アメリカリージョンステージング環境
- `.env.cn` - 中国リージョンプロダクション環境
- `.env.cn_staging` - 中国リージョンステージング環境

#### リージョン別の特性保持

```typescript
// 日本リージョン (.env.jp)
PUBLIC_TARGET_REGION=JP
PUBLIC_KINTONE=kintone
PUBLIC_SERVICE=cybozu.com
PUBLIC_GOOGLE_SEARCH=true
PUBLIC_MEGANAV=false

// アメリカリージョン (.env.us)
PUBLIC_TARGET_REGION=US
PUBLIC_KINTONE=Kintone  # 大文字Kブランディング
PUBLIC_SERVICE=Kintone
PUBLIC_GOOGLE_SEARCH=true
PUBLIC_MEGANAV=true     # アメリカのみ有効

// 中国リージョン (.env.cn)
PUBLIC_TARGET_REGION=CN
PUBLIC_KINTONE=kintone
PUBLIC_SERVICE=cybozu.cn
PUBLIC_BING_SEARCH=true  # 中国はBing検索
PUBLIC_MEGANAV=false

// 全リージョン共通: 日本語統一
PUBLIC_DEFAULT_CONTENT_LANGUAGE=ja
PUBLIC_LANGUAGE_CODE=ja-jp
PUBLIC_PRODUCT_NAME=kintone
PUBLIC_HELP=ヘルプ

// 他言語設定 - コメントアウト
# PUBLIC_PRODUCT_NAME_EN=Kintone
# PUBLIC_HELP_EN=Help
```

## DOM 構造の保持原則

Astro コンポーネントは元の HTML 構造を正確に保持する必要があります：

- 不要な wrapper 要素の追加を避ける
- 元の class 名と id を維持
- セマンティック HTML を遵守

## データファイル管理

### CSVファイル読み込み

Astroでの静的ファイル読み込みパターン：

```typescript
// Viteの?rawインポートを使用
const csvPath = `/src/pages/_data/csv/filename.${region}.csv`;
const csvContent = await import(/* @vite-ignore */ csvPath + '?raw');

// CSVパース（カンマ区切り、クォート対応）
const data = csvContent.default.split('\n')
  .filter((line: string) => line.trim())
  .map((line: string) => {
    // カンマ区切りパーサーロジック
  });
```

#### CSVファイル管理原則

1. **リージョン別管理**: `filename.{region}.csv` の命名規則
2. **型安全性**: `string[][]` で型定義
3. **エラーハンドリング**: 適切なフォールバック処理
4. **パフォーマンス**: 静的インポートによる最適化

## env 管理ルール

### 1. 環境変数のグローバル化原則

環境設定は Props の受け渡しではなく、直接 import で取得する：

```astro
---
import { env } from "@/lib/env";

interface Props {
  page: PageProps;
  // env は含めない
}

const { page } = Astro.props;
// env.targetRegion などを直接使用
---
```

### 2. env の型安全性

- env は `Readonly<EnvConfig>` として定義
- 実行時の変更を防止
- TypeScript による型安全性を確保

### 3. 設定の一元管理

- buildEnvConfig は env.ts 内部でのみ呼び出し
- 外部からは env インスタンスのみを参照
- 設定の変更時は env.ts のみを修正

### 4. Props の簡素化

- BaseProps は page のみを含む
- 環境設定は Props に含めない
- コンポーネント間の依存関係を削減

## FrontMatter データの設計原則

### データ構造の分離

- FrontMatter 由来の値は `frontmatter` プロパティに集約
- 計算値（isHome, isSection 等）は PageProps のトップレベルに配置
- 重複プロパティは排除し、データ構造を明確化

### FrontMatter プロパティの設計

```typescript
export interface PageProps {
  // 計算値（パスから計算される値）
  isHome: boolean;
  isSection: boolean;
  relPermalink: string;
  permalink?: string;
  lang: string;

  // FrontMatter から取得した値
  frontmatter: {
    title: string;
    titleUs?: string;
    titleCn?: string;
    description: string;
    weight: number;
    type: string;
    disabled: string[];
    aliases: string[];
    labels: string[];
  };

  // 階層構造
  sections: PageProps[];
  pages: PageProps[];
  parent?: PageProps;
}
```

### コンポーネントでのアクセスパターン

```astro
<!-- FrontMatter 値への統一アクセス -->
<h1>{page.frontmatter.title}</h1>
<p>{page.frontmatter.description}</p>

<!-- 計算値への直接アクセス -->
{page.isHome && <div>ホームページ</div>}
```

### 型安全性の確保

- `[key: string]: unknown` の使用を禁止
- 意図しないプロパティアクセスを防止
- すべてのプロパティを明示的に定義
- デフォルト値設定により `?` オプショナルマーカーを最小化

### パラメータ置換の型安全性

- ApplyParams で使用される全てのパラメータは ReplaceParams 型に明示的に定義
- env オブジェクトを渡す場合は型整合性を確保

## 更新履歴

- 2024 年 12 月 - 初版作成
- 2025 年 1 月 - 環境変数管理セクション追加
- 2025 年 1 月 - 地域・環境別設定管理ルールを追加
- 2025 年 1 月 - 多リージョン・単一言語アーキテクチャに伴う環境変数管理の更新
- 2025 年 1 月 - データファイル管理（CSV読み込み）セクション追加
- 2025 年 1 月 - env管理ルール追加（グローバル化原則の確立）
- 2025 年 1 月 - FrontMatterデータのPageProps統合とApplyParams型定義を追加
