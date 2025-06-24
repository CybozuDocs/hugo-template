# AnnouncementBanner 統合作業計画

## 作業目的

AnnouncementBanner と MakeAnnounceBanner の分離設計を見直し、1つのコンポーネントに統合する。

## 作業内容

### 1. 現状の問題

- AnnouncementBanner と MakeAnnounceBanner が分離されている
- MakeAnnounceBanner 相当の機能を AnnouncementBanner で直接表示する必要がある
- Props 設計を見直して、オブジェクト形式で受け取る仕様に変更
- CSV ファイル読み込みは未使用のため削除

### 2. 実装変更点

#### Props 設計の変更
- `msg` プロパティを省略可能で追加
- `defaultMessage` を配列からオブジェクトに変更
- CSV ファイル読み込み関連のコードを削除

#### コンポーネント統合
- MakeAnnounceBanner.astro の DOM 構造を AnnouncementBanner.astro に移植
- Font Awesome アイコン表示機能を統合
- WOVN 翻訳機能を統合
- マークダウン処理機能を統合

### 3. 作業手順

1. 現在の AnnouncementBanner.astro と MakeAnnounceBanner.astro の実装確認
2. Props 型定義の変更（配列 → オブジェクト）
3. MakeAnnounceBanner の DOM 構造を AnnouncementBanner に統合
4. CSV ファイル読み込み関連コードの削除
5. 不要になった MakeAnnounceBanner.astro の削除確認（ユーザー指示待ち）

### 4. 品質確保

- 既存の DOM 構造を保持
- 破壊的変更を避ける
- TypeScript 型安全性を維持
- BaseProps の使用継続

### 5. 完了条件

- AnnouncementBanner.astro が MakeAnnounceBanner 相当の機能を含む
- Props がオブジェクト形式で受け取れる
- CSV ファイル読み込みコードが削除されている
- 型エラーがない
- 既存機能が保持されている