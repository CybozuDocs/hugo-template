# Astroコンポーネント型定義の改善案

## 概要

既存のAstroコンポーネントの型定義を分析し、以下の改善を実施しました。

## 1. 共通型定義ファイルの作成

`types.ts` ファイルを作成し、プロジェクト全体で使用する共通の型定義を集約しました。

### 主な型定義

- **EnvProps**: 環境変数の型定義
- **PageProps**: ページ情報の型定義
- **PageParams**: ページパラメータの型定義
- **Translation**: 翻訳情報の型定義
- **BaseProps**: 全コンポーネント共通の基本Props
- **ReplaceParams**: パラメータ置換用の型定義

## 2. any型の排除

以下のany型を具体的な型に置き換えました：

### 変更前

```typescript
// BreadcrumbNav.astro
interface Props {
  p1: any;
  p2: any;
  env: {
    product: string;
    siteHome?: any;
  };
}

// Breadcrumb.astro
interface Props {
  env: {
    product: string;
  };
  page: any;
}
```

### 変更後

```typescript
// BreadcrumbNav.astro
import type { PageProps, EnvProps } from "./types";

interface Props {
  p1: PageProps;
  p2: PageProps;
  env: EnvProps;
}

// Breadcrumb.astro
import type { BaseProps } from "./types";

interface Props extends BaseProps {}
```

## 3. BasePropsの活用

ASTRO_PLAN.mdの設計に従い、`BaseProps`を導入してコンポーネントの型定義を統一しました。

### メリット

- コンポーネント間で一貫性のある型定義
- envとpageの構造が明確になる
- 型の再利用による保守性向上

## 4. 実装済みの改善

以下のコンポーネントの型定義を改善しました：

1. **ApplyParams.astro**: ReplaceParams型を使用
2. **ArticleNumber.astro**: BasePropsを継承
3. **Breadcrumb.astro**: BasePropsを継承
4. **BreadcrumbNav.astro**: PagePropsとEnvPropsを使用
5. **Disclaimer2.astro**: BasePropsを継承
6. **GotoTop.astro**: BasePropsを継承
7. **Title.astro**: BasePropsを継承

## 5. 今後の推奨事項

### 新規コンポーネント作成時

1. 必ず`BaseProps`を継承する
2. 追加のPropsが必要な場合は、BasePropsを拡張する
3. any型の使用を避け、具体的な型を定義する

### 例

```typescript
import type { BaseProps } from "./types";

interface Props extends BaseProps {
  // コンポーネント固有のProps
  customProp?: string;
  items?: Item[];
}
```

### 型定義の更新

今後、以下の場合にtypes.tsを更新してください：

- 新しい環境変数が追加された場合
- ページ構造に変更があった場合
- 共通で使用する新しい型が必要になった場合

## 6. 注意事項

- Wovn.astroはlangCodeのみを受け取るシンプルなコンポーネントなので、BasePropsは不要
- 一部のコンポーネントでは、使用しないenvやpageのプロパティがありますが、将来の拡張性を考慮してBasePropsを使用しています
