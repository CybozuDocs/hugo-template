# HeaderLabel コンポーネント統合の実行プラン

## 概要

PageLayout.astro の `[HEADER LABEL TEMPLATE]` プレースホルダーを実際の HeaderLabel.astro コンポーネントで置き換え、コンポーネント自体をリファクタリングします。

## 目標

1. HeaderLabel.astro のリファクタリング（Props最適化）
2. PageLayout.astro での HeaderLabel.astro 統合
3. 表示条件の適切な処理

## 作業手順

### 1. HeaderLabel.astro のリファクタリング

#### 現在の問題点
- BaseProps を継承しているが、page全体を受け取っている
- 表示条件がPageLayout側とコンポーネント内で重複している

#### 修正内容
- Props を `labels: string[]` のみに簡素化
- 表示条件（labels.length > 0）をコンポーネント内に移動
- BaseProps から独自Propsに変更

#### 実装パターン
```typescript
interface Props {
  labels: string[];
}

const { labels } = Astro.props;

// コンポーネント内で条件判定
const shouldRender = labels && labels.length > 0 && labelContents;
```

### 2. PageLayout.astro での統合

#### 変更箇所
- import文の追加：`import HeaderLabel from "./components/HeaderLabel.astro";`
- プレースホルダー置換：`[HEADER LABEL TEMPLATE]` → `<HeaderLabel labels={currentPage.frontmatter.labels} />`
- 外部条件分岐の削除：`{currentPage.frontmatter.labels.length > 0 && (...)}` → 直接呼び出し

#### DOM構造の保持
- 元の Hugo テンプレートの構造を正確に再現
- ラベル表示ロジックの完全保持
- CSS クラス名とスタイルの維持

### 3. 品質確保

#### ビルドテスト
- `npm run build` で構文エラーの確認
- TypeScript 型エラーの解消

#### 機能テスト
- ラベル表示の動作確認
- 条件分岐の正確性確認

## 期待される効果

1. **Props最適化**: 不要なBaseProps削除による簡素化
2. **責任分離**: 表示条件判定をコンポーネント内に集約
3. **再利用性向上**: 必要最小限のPropsによる汎用性
4. **保守性向上**: 明確なインターフェース定義

## リスク管理

- DOM構造の変更なし（元の構造を厳密に保持）
- 既存機能の完全保持
- 段階的変更による安全性確保

## 確認項目

- [ ] HeaderLabel.astro のProps最適化完了
- [ ] PageLayout.astro での統合完了
- [ ] ビルドテスト成功
- [ ] 型エラーなし
- [ ] ドキュメント更新完了