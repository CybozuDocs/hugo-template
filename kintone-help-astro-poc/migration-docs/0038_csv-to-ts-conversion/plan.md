# CSV to TypeScript 変換作業計画

## 概要

CSVファイルをTypeScriptファイルに変換し、リージョン別に分かれていたデータを単一ファイルに統合する作業です。

## 対象ファイル

### 入力（CSVファイル）
- `kintone-help-astro-poc/src/pages/_data/csv/home.CN.csv`
- `kintone-help-astro-poc/src/pages/_data/csv/home.JP.csv`
- `kintone-help-astro-poc/src/pages/_data/csv/home.US.csv`
- `kintone-help-astro-poc/src/pages/_data/csv/home_apx.CN.csv`
- `kintone-help-astro-poc/src/pages/_data/csv/home_apx.JP.csv`
- `kintone-help-astro-poc/src/pages/_data/csv/home_apx.US.csv`
- `kintone-help-astro-poc/src/pages/_data/csv/links.CN.csv`
- `kintone-help-astro-poc/src/pages/_data/csv/links.JP.csv`
- `kintone-help-astro-poc/src/pages/_data/csv/links.US.csv`

### 出力（TypeScriptファイル）
- `kintone-help-astro-poc/src/pages/_data/home.ts`
- `kintone-help-astro-poc/src/pages/_data/homeAppendix.ts`
- `kintone-help-astro-poc/src/pages/_data/links.ts`

## データ構造分析

### menuItems.ts（参考実装）
- MenuItemData型：`{ id: string; title: string; url: string; }`
- 単一配列として export

### home.csv（3カラムフォーマット）
- カラム1: type (category/page/partition)
- カラム2: icon (categoryの場合) / URL (pageの場合) / 空 (partitionの場合)
- カラム3: title (categoryの場合) / 空 (page/partitionの場合)

### home_apx.csv（3カラムフォーマット）
- カラム1: type (category/link)
- カラム2: title
- カラム3: icon (categoryの場合) / URL (linkの場合)

### links.csv（4カラムフォーマット）
- カラム1: カテゴリID
- カラム2: タイトル
- カラム3: URL（空の場合はカテゴリヘッダー）
- カラム4: 空（未使用）

## 実装計画

### 1. 型定義の設計

#### home.ts用の型定義
```typescript
export type HomeItemType = 'category' | 'page' | 'partition';

export interface HomeItem {
  type: HomeItemType;
  icon?: string;
  title?: string;
  url?: string;
}

export interface HomeData {
  JP: HomeItem[];
  US: HomeItem[];
  CN: HomeItem[];
}
```

#### homeAppendix.ts用の型定義
```typescript
export type HomeAppendixItemType = 'category' | 'link';

export interface HomeAppendixItem {
  type: HomeAppendixItemType;
  title: string;
  icon?: string;
  url?: string;
}

export interface HomeAppendixData {
  JP: HomeAppendixItem[];
  US: HomeAppendixItem[];
  CN: HomeAppendixItem[];
}
```

#### links.ts用の型定義
```typescript
export interface LinkItem {
  categoryId: string;
  title: string;
  url?: string;
}

export interface LinksData {
  JP: LinkItem[];
  US: LinkItem[];
  CN: LinkItem[];
}
```

### 2. CSVパース処理

1. 各CSVファイルを読み込み
2. 改行で分割し、空行を除去
3. カンマで分割（クォート対応は不要と判断：データに含まれていない）
4. 各データ型に合わせてオブジェクトに変換

### 3. データ統合

1. リージョン別（JP/US/CN）にデータを格納
2. 単一のオブジェクトとして export

### 4. ファイル生成

1. TypeScriptファイルとして出力
2. 適切なフォーマットで記述

## 実装手順

1. home.csv ファイルの変換
   - 3つのリージョンファイルを読み込み
   - HomeData型のオブジェクトに統合
   - home.ts として出力

2. home_apx.csv ファイルの変換
   - 3つのリージョンファイルを読み込み
   - HomeAppendixData型のオブジェクトに統合
   - homeAppendix.ts として出力

3. links.csv ファイルの変換
   - 3つのリージョンファイルを読み込み
   - LinksData型のオブジェクトに統合
   - links.ts として出力

## 検証項目

- [ ] 型定義が適切に設定されているか
- [ ] 全てのデータが正しく変換されているか
- [ ] リージョン別のデータが正しく統合されているか
- [ ] TypeScriptファイルがビルドエラーなくコンパイルできるか
- [ ] 既存のmenuItems.tsと同様の構造になっているか

## 注意事項

- CSVデータにカンマを含む値は存在しないため、単純なカンマ分割で対応
- 空文字列は undefined として扱わず、そのまま保持
- ファイル名の変更: home_apx → homeAppendix