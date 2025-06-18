# page.ts 関数更新作業の実行プラン

## 作業概要

lib/page.ts に以下の機能を追加・修正します：
1. getSiteHomeSections() にparentフィールドを設定
2. getCurrentPage() 関数を新規作成

## 実装内容

### 1. getSiteHomeSections() の修正

#### 修正内容
- 各ページとセクションに parent フィールドを設定
- セクションの親はホームページ（getSiteHome()）
- ページの親は所属するセクション

#### 実装詳細
```typescript
// ホームデータを取得
const homeData = getSiteHome();

// ページデータ構築時に parent: undefined を追加
parent: undefined, // 後で設定

// ページの親をセクションに設定
pageData.parent = section;

// セクションの親をホームに設定
section.parent = homeData;
```

### 2. getCurrentPage() 関数の新規作成

#### 機能概要
- getSiteHomeSections() の結果から現在レンダリング中のページを検索
- Astro.url を使用して現在のパスを取得
- 再帰的にツリー構造を検索してページを特定

#### 実装詳細
```typescript
export function getCurrentPage(
  Astro: AstroGlobal,
  sections: PageProps[]
): PageProps | undefined
```

- Astro グローバルオブジェクトを引数で受け取る
- 現在のURLパスとページのrelPermalinkを比較
- ホームページ、セクション、通常ページすべてに対応
- 見つからない場合は undefined を返す

## 技術的考慮点

### 1. TypeScript 型定義
- AstroGlobal 型を astro パッケージからインポート
- PageProps の parent フィールドは既に型定義に存在

### 2. パス比較の正規化
- 末尾のスラッシュを除去して比較
- /k/ プレフィックスを考慮した処理

### 3. 再帰検索の実装
- sections と pages の両方を再帰的に検索
- 効率的な検索アルゴリズムの実装

## 品質確保

- ビルドテストの実行
- 型エラーがないことの確認
- 既存機能への影響がないことの確認