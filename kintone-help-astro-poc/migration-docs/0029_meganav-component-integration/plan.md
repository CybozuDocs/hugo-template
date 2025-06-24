# MegaNavコンポーネント統合作業計画

## 作業概要

MegaNavコンポーネントの統合と簡素化を行います。

### 目標

- MegaNavKtとMegaNavGrの2つに分岐しているが、実際にはMegaNavGrは不要なので削除
- MegaNavKtの内容を、MegaNavコンポーネントの内容にする
- 従来MegaNavコンポーネント内でやっていた env.targetRegion === "US" の分岐を削除

## 作業手順

### 1. 現在の実装調査
- [ ] MegaNav.astro の現在の実装を確認
- [ ] MegaNavKt.astro の実装を確認
- [ ] MegaNavGr.astro の実装を確認

### 2. 統合作業
- [ ] MegaNavGr.astro を削除
- [ ] MegaNavKt.astro の内容をMegaNav.astro に移行
- [ ] MegaNav.astro 内の env.targetRegion === "US" 分岐を削除

### 3. 参照の更新
- [ ] MegaNavGr.astro への参照がないことを確認
- [ ] MegaNavKt.astro への参照を確認

### 4. 品質確認
- [ ] ビルドテストの実行
- [ ] TypeScript型エラーがないことを確認

## 根拠

- MegaNavコンポーネントを利用する PageLayout 側で、env.meganav による判定が入っており、これが USリージョンでしか有効化されないため、MegaNavコンポーネント内での分岐は不要
- MegaNavGrはGaroon用だが、product="kintone"固定によりGaroon対応は不要

## 想定される影響

- MegaNavGr.astro への既存参照がある場合、削除が必要
- env.targetRegion による条件分岐がPageLayout側で適切に処理されているかの確認が必要

## 注意事項

- 実際の配備作業は行わない（コンポーネント自体の修正のみ）
- DOM構造の変更は最小限に留める
- 既存機能の保持を最優先とする