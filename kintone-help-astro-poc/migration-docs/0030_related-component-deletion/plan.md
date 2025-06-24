# Related コンポーネント削除計画

## 概要

Hugo の Related Content 機能が使用されていないことが判明したため、Related.astro コンポーネントを削除します。

## 背景

調査により以下が判明しました：

1. Hugo の設定ファイルに related 設定が存在しない（デフォルト設定で動作）
2. コンテンツに tags, keywords, categories が設定されていない
3. Related Content を表示するための必要条件を満たしていない
4. 実際に表示されることがない機能である

## 削除対象

### 1. ファイル削除
- `src/components/Related.astro`
- `src/components/Related.md`（変更記録ファイル）

### 2. 参照削除
- `src/layouts/PageLayout.astro` からの Related コンポーネントの参照とインポート

## 実行手順

1. Related.astro ファイルを削除
2. Related.md 変更記録ファイルを削除
3. PageLayout.astro から以下を削除：
   - import 文
   - コンポーネント呼び出し（コメントアウトされている箇所）
4. ビルドテストを実行して動作確認

## 期待される効果

- 未使用コードの削除によるコードベースの簡素化
- 保守性の向上
- ビルド時間の短縮（わずかだが改善）

## リスク評価

- **リスクレベル**: 低
- **理由**: 
  - 既にコメントアウトされており、実際に使用されていない
  - Hugo 側でも機能していないことが確認済み
  - 削除しても既存機能に影響なし

## ロールバック手順

万が一問題が発生した場合：
1. Git で変更を revert
2. ビルドテストを再実行

## 完了条件

- [ ] Related.astro ファイルが削除されている
- [ ] Related.md ファイルが削除されている
- [ ] PageLayout.astro から参照が削除されている
- [ ] npm run build が成功する
- [ ] エラーや警告が発生しない