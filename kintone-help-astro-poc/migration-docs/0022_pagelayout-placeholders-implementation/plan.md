# PageLayout プレースホルダー実装計画

## 概要

PageLayout.astro で現在プレースホルダーとなっている TreeNavToggle と GoToTop の Partial 部分を、仮実装からちゃんとした実装に変更する作業を行います。

## 作業対象

### 対象コンポーネント

1. **TreeNavToggle** - ツリーナビゲーションの開閉ボタン
2. **GoToTop** - ページトップへ戻るボタン

### 現在の状況調査

- PageLayout.astro での実装状況確認
- Hugo の元実装（treenav_toggle.html, gototop.html）の調査
- 既存の関連コンポーネントとの整合性確認

## 実行計画

### フェーズ1: 調査・準備（作業開始）

1. **現状確認**
   - PageLayout.astro で TreeNavToggle と GoToTop の現在の実装状況を確認
   - プレースホルダーか仮実装かを判定

2. **元実装調査**
   - Hugo partials の treenav_toggle.html と gototop.html を調査
   - DOM 構造、CSS クラス、JavaScript 連携を把握
   - 必要な Props や環境変数を特定

3. **関連コンポーネント確認**
   - 既存の TreeNav.astro との関連性確認
   - CSS や JavaScript ファイルとの依存関係確認

### フェーズ2: コンポーネント実装

4. **TreeNavToggle.astro 実装**
   - Hugo の treenav_toggle.html を Astro コンポーネントに移行
   - TypeScript 型定義の実装
   - Props の設計と実装
   - DOM 構造の正確な保持

5. **GoToTop.astro 実装**
   - Hugo の gototop.html を Astro コンポーネントに移行
   - TypeScript 型定義の実装
   - Props の設計と実装
   - DOM 構造の正確な保持

### フェーズ3: 統合・テスト

6. **PageLayout.astro 更新**
   - プレースホルダーまたは仮実装から実際のコンポーネント呼び出しに変更
   - 適切な Props の受け渡し実装
   - import 文の追加

7. **ビルドテスト**
   - npm run build による構文チェック
   - TypeScript エラーの解消
   - 既存機能への影響確認

### フェーズ4: ドキュメント作成

8. **変更記録作成**
   - TreeNavToggle.md と GoToTop.md の作成
   - Hugo からの変更点記録
   - TODO 項目の明記

9. **作業履歴作成**
   - prompt.md の作成
   - 作業内容と結果の記録

10. **ドキュメント更新**
    - migrate-memo.md の学習事項追加
    - migrate-rules.md の必要に応じたルール追加
    - rules.md の永続的ルール追加

## 設計原則

### DOM 構造の保持

- 元の Hugo パーシャルの HTML 構造を正確に再現
- CSS クラス名と ID の維持
- JavaScript との連携を考慮した属性保持

### 型安全性

- BaseProps を使用した統一的な型設計
- 必要に応じて独自 Props の追加
- TypeScript interface による型定義

### WOVN 対応

- i18n が必要な文言は Wovn コンポーネントを使用
- 属性内の翻訳は `i18n__todo__` プレフィックス

### 環境変数活用

- env からの設定値取得
- リージョン別の条件分岐対応

## 想定される技術的課題

1. **JavaScript 連携**
   - TreeNavToggle の開閉動作
   - GoToTop のスクロール制御

2. **CSS 依存関係**
   - 既存のスタイリングとの整合性
   - レスポンシブ対応

3. **アクセシビリティ**
   - ARIA 属性の適切な実装
   - キーボード操作対応

## 成功基準

- [ ] npm run build が成功する
- [ ] DOM 構造が元の Hugo 実装と一致する
- [ ] TypeScript エラーがない
- [ ] 変更記録ファイルが作成される
- [ ] 既存機能に影響がない

## リスク管理

### 潜在的リスク

1. **JavaScript 依存** - 外部 JavaScript との連携が必要な場合
2. **CSS 競合** - 既存スタイルとの不整合
3. **複雑な条件分岐** - 多数のプロパティや環境変数依存

### 対応策

- 段階的実装（基本機能→詳細機能）
- エラーハンドリングの実装
- フォールバック機能の準備

## 参考情報

- **開発ルール**: migration-docs/rules.md
- **移行ルール**: migration-docs/migrate-rules.md
- **プロジェクト概要**: CLAUDE.md
- **BaseProps 型**: src/lib/types.ts