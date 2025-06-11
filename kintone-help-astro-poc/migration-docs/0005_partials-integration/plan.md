# Partials コンポーネント統合計画

## 概要
PageLayout.astro の未実装 partials コンポーネント（ダミーテキスト状態）を、実際のコンポーネントに置き換える作業

## 現状分析

### PageLayout.astro の未実装部分
- `[ANNOUNCEMENT BANNER PARTIAL]` (89行目)  
- `[HEADER PARTIAL]` (92行目)
- `[MEGANAV PARTIAL]` (99行目) 
- `[TREENAV3 PARTIAL (JSON)]` (106行目)
- `[TREENAV PARTIAL]` (108行目)
- `[DISCLAIMER PARTIAL]` (113行目)
- `[DISCLAIMER2 PARTIAL]` (115行目)
- `[LATEST PAGE GUIDE PARTIAL]` (117行目)
- `[BREADCRUMB PARTIAL]` (120行目)
- `[ARTICLE LINK TEMPLATE]` (126行目)
- `[ARTICLE NUMBER TEMPLATE]` (131行目)
- `[HEADER LABEL TEMPLATE]` (135行目)
- `[RELATED PARTIAL]` (141行目)
- `[PAGE NAV PARTIAL]` (143行目)
- `[TREE NAV TOGGLE PARTIAL]` (156行目)
- `[GO TO TOP PARTIAL]` (157行目)
- `[SUPPORT INQUIRY PARTIAL]` (160行目)
- `[ENQUETE PARTIAL]` (163行目)
- `[FOOTER PARTIAL]` (164行目)

### 利用可能なコンポーネント
- Enabled.astro
- Heading.astro
- Kintone.astro
- Reference.astro
- Wovn.astro

## 実装方針

### フェーズ1: 明確に対応できるコンポーネント
以下は既存コンポーネントで明確に対応可能：
- `Wovn.astro` → `[DISCLAIMER2 PARTIAL]` (WOVN関連の免責事項)
- `Reference.astro` → `[RELATED PARTIAL]` (関連情報)
- `Kintone.astro` → 製品名表示系の partial

### フェーズ2: 条件判定が必要なコンポーネント
以下はpropsの詳細確認が必要：
- `Enabled.astro` → 有効化状態に基づく表示制御
- `Heading.astro` → ヘッダー関連の表示

### 実装済み
- `[DISCLAIMER2 PARTIAL]` → `Disclaimer2.astro`
- `[RELATED PARTIAL]` → `Related.astro` (コメントアウト)
- `[FOOTER PARTIAL]` → `Footer.astro` (Footer2からリネーム)

### フェーズ3: スキップ対象
以下は現在の利用可能コンポーネントでは対応困難なためスキップ：
- `[ANNOUNCEMENT BANNER PARTIAL]`
- `[HEADER PARTIAL]`
- `[MEGANAV PARTIAL]`
- `[TREENAV3 PARTIAL (JSON)]`
- `[TREENAV PARTIAL]`
- `[DISCLAIMER PARTIAL]`
- `[LATEST PAGE GUIDE PARTIAL]`
- `[BREADCRUMB PARTIAL]`
- `[ARTICLE LINK TEMPLATE]`
- `[ARTICLE NUMBER TEMPLATE]`
- `[HEADER LABEL TEMPLATE]`
- `[PAGE NAV PARTIAL]`
- `[TREE NAV TOGGLE PARTIAL]`
- `[GO TO TOP PARTIAL]`
- `[SUPPORT INQUIRY PARTIAL]`
- `[ENQUETE PARTIAL]`

## 作業手順

1. 各コンポーネントの interface を確認
2. フェーズ1の確実な対応から実装
3. フェーズ2は props 確認後に判定
4. 実装が困難なものはスキップし、今後の課題として記録

## 期待される成果

- 少なくとも2-3個のpartialsを実際のコンポーネントに置き換え
- どのコンポーネントがどの用途に使えるかの知見獲得
- 今後の移行作業で必要となる新規コンポーネントの特定

## 対応困難なコンポーネントの詳細分析

### 最高難易度（専門的な新規開発が必要）

#### 1. [TREENAV PARTIAL] / [TREENAV3 PARTIAL (JSON)]
**課題**: 
- 再帰的なページ階層処理
- 動的な目次（TOC）生成と見出し抽出
- jsTreeとの連携による複雑な状態管理

**解決方法**: 
- Astroでの再帰コンポーネント設計
- MarkdownのAST解析によるTOC生成
- フロントエンドでの階層状態管理ライブラリ

#### 2. [HEADER PARTIAL]
**課題**: 
- 製品別・地域別の複雑な条件分岐
- Google検索API統合
- 動的検索フォーム生成

**解決方法**: 
- 製品・地域設定の統一的な管理システム
- 検索API統合ライブラリ
- レスポンシブ対応のヘッダーコンポーネント

#### 3. [ANNOUNCEMENT BANNER PARTIAL]
**課題**: 
- CSVファイルの動的読み込み
- マークダウン変換機能
- 多言語対応システム

**解決方法**: 
- Astroでの動的データ読み込み機能
- Markdown処理ライブラリ統合
- 国際化システムの構築

### 中難易度（既存技術で対応可能）

#### 4. [BREADCRUMB PARTIAL]
**課題**: 再帰的な階層処理によるパンくず生成
**解決方法**: Astroでの階層データ処理、URL解析

#### 5. [FOOTER PARTIAL] ※実装済み
**課題**: CSVデータ処理、条件分岐
**現状**: Footer2.astroをFooter.astroにリネームして使用（CSVデータ読み込み部分はTODO）

#### 6. [LATEST PAGE GUIDE PARTIAL]
**課題**: 多言語ページ間の関連付け
**解決方法**: URL解析とページ関連性の判定ロジック

### 低難易度（簡単な移植で対応可能）

#### 7. [MEGANAV PARTIAL]
**課題**: 地域別コンポーネント切り替え
**解決方法**: 動的コンポーネント読み込み

#### 8. [DISCLAIMER PARTIAL]
**課題**: 最小限（多言語対応、PDF URL生成）
**解決方法**: 国際化対応、URL生成ロジック

#### 9. [ARTICLE LINK TEMPLATE] / [ARTICLE NUMBER TEMPLATE] / [HEADER LABEL TEMPLATE]
**課題**: 基本的な文字列操作・スタイル生成
**解決方法**: 文字列処理とCSS生成

#### 10. [PAGE NAV PARTIAL] / [TREE NAV TOGGLE PARTIAL] / [GO TO TOP PARTIAL]
**課題**: 基本的なナビゲーション機能
**解決方法**: JavaScript連携、アイコン統合

#### 11. [SUPPORT INQUIRY PARTIAL] / [ENQUETE PARTIAL]
**課題**: 外部サービス統合
**解決方法**: HubSpot統合、JavaScript連携

## 技術的共通課題と解決策

### 1. 多言語対応システム
**現状**: Hugo i18n → WOVN移行済み
**必要対応**: すべてのコンポーネントでWOVN統合

### 2. 動的データ処理
**課題**: CSVファイル読み込み、URL解析
**解決策**: Astroでのファイル処理API、URL操作ライブラリ

### 3. 再帰処理
**課題**: ナビゲーション階層、パンくず生成
**解決策**: Astroでの再帰コンポーネント設計パターン

### 4. 外部API統合
**課題**: Google検索、HubSpot、WOVN等
**解決策**: 統合ライブラリ、環境変数管理

### 5. JavaScript連携
**課題**: フロントエンド機能との連携
**解決策**: Astroのクライアントサイド統合機能