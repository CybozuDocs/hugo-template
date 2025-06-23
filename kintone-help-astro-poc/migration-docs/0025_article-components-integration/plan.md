# ArticleLink・ArticleNumber コンポーネント統合計画

## 概要

PageLayout.astro の ARTICLE LINK TEMPLATE および ARTICLE NUMBER TEMPLATE のダミーテキスト部分に、実際のコンポーネントを適用する作業。

## 現状確認

### ダミーテキスト部分の位置
- **98行目**: `<div>[ARTICLE LINK TEMPLATE]</div>`
- **103行目**: `<div>[ARTICLE NUMBER TEMPLATE]</div>`

### 使用するコンポーネント
- **ArticleLink.astro**: `/kintone-help-astro-poc/src/layouts/components/ArticleLink.astro` に存在（実装済み）
- **ArticleNumber.astro**: `/kintone-help-astro-poc/src/layouts/components/ArticleNumber.astro` に存在（実装済み）

## 実行計画

### 1. 事前調査 ✅
- [x] PageLayout.astro の該当箇所確認
- [x] コンポーネントの存在確認
- [x] 実装状況の確認

### 2. コンポーネント統合
- [ ] PageLayout.astro にコンポーネントのインポート文を追加
- [ ] ダミーテキストを実際のコンポーネント呼び出しに置き換え

### 3. 品質確保
- [ ] ビルドテスト実行（npm run build）
- [ ] TypeScript型エラーの確認と修正

### 4. ドキュメント化
- [ ] prompt.md 作成（作業履歴）
- [ ] migrate-memo.md 更新（概要、学習事項）

## 技術的詳細

### 必要な修正内容

1. **インポート文の追加**:
   ```astro
   import ArticleLink from '@/components/ArticleLink.astro';
   import ArticleNumber from '@/components/ArticleNumber.astro';
   ```

2. **ダミーテキストの置き換え**:
   ```astro
   // 修正前
   <div>[ARTICLE LINK TEMPLATE]</div>
   
   // 修正後
   <ArticleLink page={currentPage} />
   ```

   ```astro
   // 修正前
   <div>[ARTICLE NUMBER TEMPLATE]</div>
   
   // 修正後
   <ArticleNumber page={currentPage} />
   ```

### コンポーネントの要件確認

両コンポーネントは BaseProps を使用する設計：
- `page: PageProps` を受け取る
- 既存の `currentPage` 変数を使用可能

## 想定される課題

1. **Props の型整合性**: コンポーネントが期待する Props と PageLayout.astro が提供するデータの整合性
2. **DOM構造の変化**: ダミーテキストから実コンポーネントへの変更による出力の変化

## 品質基準

- [ ] npm run build が成功する
- [ ] TypeScript 型エラーがない
- [ ] 既存機能に影響しない
- [ ] DOM構造が適切に保持される

## 作業時間見積もり

- コンポーネント統合: 15分
- ビルドテスト・修正: 10分
- ドキュメント作成: 15分
- **合計**: 約40分

## 参考情報

- **migrate-rules.md**: 移行時の注意点とルール
- **rules.md**: Astro開発の永続的ルール
- **既存実装**: ArticleLink.astro, ArticleNumber.astro の実装内容