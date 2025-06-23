# LOCALE MODAL PARTIAL コンポーネント統合実行計画

## 概要

PageLayout.astro 内の `[LOCALE MODAL PARTIAL]` プレースホルダーを、既存のコンポーネントでの正式実装に置き換える。

## 作業手順

### 1. 現状分析（10分）

#### 1.1 PageLayout.astro の現状確認
- LOCALE MODAL PARTIAL プレースホルダーの位置と条件確認
- 条件分岐: `{env.targetRegion === "US" && <div>[LOCALE MODAL PARTIAL]</div>}`
- アメリカリージョン限定での表示

#### 1.2 既存コンポーネントの確認
- LocaleModal.astro コンポーネントの実装状況確認
- Props定義、DOM構造、依存関係の分析
- 不要なPropsの特定

### 2. Props 分析と調整（10分）

#### 2.1 Props 要求事項の確認
- LocaleModal.astro の現在のProps定義
- BasePropsの使用状況
- 実際に使用されているプロパティの特定

#### 2.2 Props最適化
- 前回のSupportInquiry/Enqueteの経験を活用
- 使用されていないPropsの削除
- 必要な環境変数のみの直接import

### 3. コンポーネント統合実装（10分）

#### 3.1 LocaleModal.astro の統合
- PageLayout.astro へのimport追加
- プレースホルダーから実コンポーネント呼び出しへの置換
- 条件付きレンダリング（US地域限定）の維持

#### 3.2 Props調整の適用
- 不要なProps定義の削除
- 必要に応じた環境変数の直接import
- 型安全性の確保

### 4. 品質確保（5分）

#### 4.1 ビルドテスト
- npm run build による構文エラー確認
- TypeScript型エラーの解消

#### 4.2 DOM構造確認
- 元のHugo実装との構造一致確認
- アメリカリージョン限定条件の正確な維持

## 期待される成果物

1. **PageLayout.astro の更新**
   - LocaleModal.astro のimport追加
   - プレースホルダーの実コンポーネント呼び出しへの置換

2. **LocaleModal.astro の最適化**
   - 不要なProps定義の削除
   - 必要に応じた環境変数の直接import
   - 型安全性の向上

3. **品質確保**
   - npm run build 成功
   - TypeScript型エラー解消
   - DOM構造と条件分岐の保持

## 前回作業の学習事項活用

### SupportInquiry/Enquete作業からの知見
- 使用していないPropsの積極的な削除
- BasePropsは必要な場合のみ使用
- 環境変数は直接importで取得
- 段階的統合（統合→Props最適化）の安全性

### Props最適化パターン
```typescript
// 最適化前（推定）
interface Props extends BaseProps {}
const { page } = Astro.props;

// 最適化後（想定）
import { env } from "@/lib/env";
// Props定義なし、必要な環境変数のみ直接使用
```

## リスクと対策

### リスク1: 地域限定条件の誤実装
- **対策**: `env.targetRegion === "US"` 条件の正確な維持
- **対策**: アメリカリージョンでの動作確認

### リスク2: Props最適化の影響
- **対策**: 前回パターンの踏襲（段階的実装）
- **対策**: 各段階でのビルドテスト実行

## 参照ドキュメント

- `migration-docs/0023_support_enquete_components/`: 前回作業の成果
- `migration-docs/rules.md`: Props最適化ルール（新規追加済み）
- `migration-docs/migrate-rules.md`: Props最適化による簡素化ルール

## 注意事項

- **条件分岐の維持**: アメリカリージョン限定表示の正確な保持
- **前回パターンの踏襲**: 実証済みの最適化手法の活用
- **段階的実装**: 統合→Props最適化の安全な順序