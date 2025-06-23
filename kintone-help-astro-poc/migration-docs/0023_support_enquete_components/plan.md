# SUPPORT INQUIRY PARTIAL および ENQUETE PARTIAL コンポーネント統合実行計画

## 概要

PageLayout.astro 内の `[SUPPORT INQUIRY PARTIAL]` および `[ENQUETE PARTIAL]` プレースホルダーを、既存のコンポーネントでの正式実装に置き換える。

## 作業手順

### 1. 現状分析（15分）

#### 1.1 PageLayout.astro の現状確認
- SUPPORT INQUIRY PARTIAL と ENQUETE PARTIAL プレースホルダーの位置と文脈確認
- 周辺のDOM構造の把握

#### 1.2 既存コンポーネントの確認
- SupportInquiry.astro コンポーネントの実装状況
- Enquete.astro コンポーネントの実装状況  
- 各コンポーネントのProps定義と要求事項

### 2. Props 分析と調整（15分）

#### 2.1 Props 要求事項の確認
- SupportInquiry.astro の現在のProps定義
- Enquete.astro の現在のProps定義
- PageLayout.astro から渡せるデータの確認

#### 2.2 不要なProps の特定と修正
- 使用されていないPropsの特定
- BasePropsパターンへの統一化検討
- 型安全性の確保

### 3. コンポーネント統合実装（20分）

#### 3.1 SupportInquiry.astro の統合
- PageLayout.astro へのimport追加
- プレースホルダーから実コンポーネント呼び出しへの置換
- 適切なPropsの受け渡し

#### 3.2 Enquete.astro の統合
- PageLayout.astro へのimport追加
- プレースホルダーから実コンポーネント呼び出しへの置換
- 適切なPropsの受け渡し

### 4. 品質確保（10分）

#### 4.1 ビルドテスト
- npm run build による構文エラー確認
- TypeScript型エラーの解消

#### 4.2 DOM構造確認
- 元のHugo実装との構造一致確認
- 不要なwrapper要素の除去確認

## 期待される成果物

1. **PageLayout.astro の更新**
   - SupportInquiry.astro, Enquete.astro のimport追加
   - 2つのプレースホルダーの実コンポーネント呼び出しへの置換

2. **コンポーネントProps調整（必要に応じて）**
   - SupportInquiry.astro のProps最適化
   - Enquete.astro のProps最適化
   - BasePropsパターンの適用

3. **品質確保**
   - npm run build 成功
   - TypeScript型エラー解消
   - DOM構造の保持

## リスクと対策

### リスク1: 既存コンポーネントのProps要求が複雑
- **対策**: BasePropsパターンでの統一化
- **対策**: 不要なPropsの削除と簡素化

### リスク2: DOM構造の破綻
- **対策**: Hugo実装との厳密な比較
- **対策**: wrapper要素の追加回避

### リスク3: TypeScript型エラー
- **対策**: 段階的な型修正
- **対策**: 各段階でのビルドテスト実行

## 参照ドキュメント

- `migration-docs/rules.md`: Astro開発ガイドライン
- `migration-docs/migrate-rules.md`: マイグレーションルール  
- `migration-docs/migrate-memo.md`: 過去の学習事項

## 注意事項

- **破壊的変更の禁止**: 既存のDOM構造や動作を変更しない
- **BaseProps優先**: 独自Props定義よりもBaseProps使用を優先
- **段階的実装**: 一度に多くの変更を行わず、段階的に進める