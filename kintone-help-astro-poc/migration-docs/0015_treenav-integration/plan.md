# TreeNav統合実行プラン

## 作業概要

PageLayoutからTreeNav.astroを呼び出せるようにする段階的な実装。TreeNavは非常に複雑なコンポーネントのため、段階的アプローチを採用する。

## 確定済み仕様変更

### 1. TreeNav呼び分け廃止
- **現状**: PageLayoutでTreeNav3とTreeNavの呼び分けが存在
- **変更**: TreeNav3は廃止し、必ずTreeNavを呼び出す
- **影響**: envからjsonTreeプロパティを削除

### 2. toc_in_tree分岐削除
- **現状**: TreeNav内でtoc_in_treeによる分岐が存在
- **変更**: toc_in_tree=falseまたは未設定の場合のロジックのみ残す
- **影響**: TOCのツリー内表示機能を削除

## 段階的実行プラン

### 第1段階: リファクタリング（仕様変更の適用）

#### 1-1. 現状調査
- [ ] 既存のTreeNav3、TreeNavコンポーネントの実装確認
- [ ] PageLayoutでの呼び分けロジック調査
- [ ] envのjsonTreeプロパティ使用箇所調査
- [ ] TreeNav内のtoc_in_tree分岐処理調査

#### 1-2. envからjsonTree削除
- [ ] env.d.ts, env.ts, types.tsからjsonTree関連削除
- [ ] 全.envファイルからPUBLIC_JSON_TREE削除
- [ ] 関連するコンポーネントでのjsonTree参照削除

#### 1-3. TreeNav内toc_in_tree分岐削除
- [ ] TreeNav.astroのtoc_in_tree分岐処理を削除
- [ ] toc_in_tree=false時の処理のみ残す
- [ ] 関連するTOC表示ロジックの整理

#### 1-4. TreeNav3の廃止準備
- [ ] TreeNav3.astroコンポーネントの使用箇所確認
- [ ] TreeNav3の機能をTreeNavに統合する必要性の確認

### 第2段階: PageLayout統合

#### 2-1. PageLayout修正
- [ ] [TREE NAV PARTIAL]プレースホルダーの実装調査
- [ ] TreeNav.astroコンポーネント呼び出しの実装
- [ ] Props定義と型安全性の確保

#### 2-2. TreeNav.astroコンポーネント確認
- [ ] 既存のTreeNav.astroの実装状況確認
- [ ] 必要なPropsの定義と型安全性
- [ ] 依存関係の解決（TreeNavMainMenu等）

#### 2-3. 動作確認
- [ ] ビルドテスト実行
- [ ] 基本的な表示確認
- [ ] 型エラーの解消

### 第3段階: 品質確保とドキュメント化

#### 3-1. 最終確認
- [ ] 全体的な動作テスト
- [ ] 未使用コードの削除
- [ ] 型定義の整合性確認

#### 3-2. ドキュメント更新
- [ ] prompt.md作成（作業履歴）
- [ ] migrate-memo.md更新（学習事項、課題）
- [ ] migrate-rules.md更新（新ルール）
- [ ] rules.md更新（永続ルール）

## 技術的考慮事項

### 重要な制約
1. **DOM構造の保持**: 既存のHTML構造を厳密に保持
2. **段階的実装**: 複雑さを考慮して段階的に進める
3. **型安全性**: TypeScript型定義の確実な実装
4. **既存機能保持**: 削除される機能以外は完全保持

### 予想される課題
1. **TreeNavの複雑性**: 再帰処理やAJAX機能が含まれる
2. **依存関係**: TreeNavMainMenu等の子コンポーネントとの整合性
3. **パフォーマンス**: JSONデータの処理方法

### 回避策
1. **TODO実装**: 複雑な部分は一旦TODOで仮実装
2. **既存ファイル活用**: 可能な限り既存の実装を参考にする
3. **段階的テスト**: 各段階でビルドテストを実行

## 成功基準

### 第1段階完了基準
- [ ] npm run build成功
- [ ] jsonTree関連コードの完全削除
- [ ] toc_in_tree分岐の完全削除
- [ ] 型エラーなし

### 第2段階完了基準
- [ ] PageLayoutからTreeNav.astro呼び出し成功
- [ ] 基本的なTreeNav表示確認
- [ ] Props型定義完了

### 最終完了基準
- [ ] 全機能の動作確認
- [ ] ドキュメント更新完了
- [ ] 品質基準達成

## 備考

この作業はTreeNavという最も複雑なコンポーネントの統合作業です。無理をせず、段階的にアプローチして確実に進めることが重要です。