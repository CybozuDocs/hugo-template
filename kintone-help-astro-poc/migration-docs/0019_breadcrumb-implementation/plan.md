# Breadcrumb 表示実装プラン

## 作業概要

PageLayout.astro の TODOになっているBreadcrumbを表示する機能を実装します。
現在ページの情報は、page.ts の関数を使って取得できる状況です。

## 現在の状況

### PageLayout.astro の状況
- 122行目: `<div>[BREADCRUMB PARTIAL]</div>` でプレースホルダー状態
- pageData オブジェクトが構築済み（50-77行目）
- page.ts からの関数インポートが必要

### page.ts の状況
- `getCurrentPage(Astro, sections)` 関数が実装済み
- `getSiteHomeSections()` 関数が実装済み
- パンくずに必要な parent 関係も設定済み

## 実装方針

### 1. Breadcrumb.astro コンポーネントの作成

#### Props 設計
```typescript
interface Props extends BaseProps {
  page: PageProps;  // 現在のページ情報
}
```

#### 機能要件
- 現在ページから parent を辿ってパンくずリストを生成
- ホームページへのリンクを含む階層構造の表示
- Hugo の breadcrumb.html partial と同等の DOM 構造を保持

### 2. PageLayout.astro の修正

#### 必要な変更
1. `getCurrentPage` 関数のインポート追加
2. `getSiteHomeSections` を使用してセクション情報取得
3. 現在ページの特定
4. Breadcrumb.astro コンポーネントの呼び出し

## 実装手順

### Step 1: 既存の Hugo breadcrumb.html を調査
- layouts/partials/breadcrumb.html の構造確認
- DOM 構造とクラス名の把握
- i18n 対応箇所の特定

### Step 2: Breadcrumb.astro の実装
- BaseProps を継承した Props 定義
- parent を辿るパンくずリスト生成ロジック
- Hugo と同等の DOM 構造実装
- WOVN による i18n 対応

### Step 3: PageLayout.astro の統合
- page.ts 関数のインポート
- セクション情報の取得
- 現在ページの特定
- Breadcrumb コンポーネントの呼び出し

### Step 4: 変更記録とテスト
- Breadcrumb.md 変更記録ファイル作成
- ビルドテスト実行
- DOM 構造の検証

## 技術的考慮事項

### 型安全性
- BaseProps の継承によるコード統一
- PageProps の parent 関係を活用
- TypeScript による型チェック

### パフォーマンス
- getSiteHomeSections の実行は PageLayout で1回のみ
- パンくず生成は軽量な parent 辿りロジック

### i18n 対応
- ホームリンクのテキストは Wovn コンポーネントで対応
- 属性内のテキストは `i18n__todo__` プレフィックス対応

### DOM 構造の保持
- 元の Hugo breadcrumb.html と同じ構造を維持
- 勝手な要素追加や変更は行わない
- セマンティックなHTML構造の維持

## 期待される成果物

1. **Breadcrumb.astro** - パンくず表示コンポーネント
2. **Breadcrumb.md** - 変更記録ファイル
3. **PageLayout.astro** - Breadcrumb 統合済み
4. **ビルドテスト成功** - npm run build でエラーなし

## リスク要因と対策

### リスク: Hugo breadcrumb.html の複雑性
- **対策**: 段階的実装（基本構造→詳細機能）

### リスク: parent 関係の不整合
- **対策**: page.ts のテストで parent 関係を検証済み

### リスク: セクション取得のパフォーマンス
- **対策**: 必要時のみ実行、結果のキャッシュ化検討

## 作業完了の判定基準

- [ ] Breadcrumb.astro の実装完了
- [ ] PageLayout.astro の統合完了
- [ ] npm run build の成功
- [ ] Breadcrumb.md の作成完了
- [ ] DOM 構造の Hugo との一致確認