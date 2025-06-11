# Hugo から Astro への移行状況メモ

## 概要

このドキュメントは、Hugo テンプレートから Astro コンポーネントへの移行作業の進捗状況と課題を記録します。

## 現在の移行状況

### 完了済みコンポーネント（5個）

| コンポーネント | 実装パターン | 変更記録 | 備考 |
|-------------|------------|---------|-----|
| `Wovn.astro` | 高機能型 | ✅ | WOVN翻訳サービス用、条件分岐とProps対応 |
| `Kintone.astro` | 製品固有型 | ❌ | 製品名表示、設定値の動的取得が課題 |
| `Enabled.astro` | 基本ラッパー型 | ❌ | 将来的な機能追加予定のプレースホルダー |
| `Heading.astro` | 基本ラッパー型 | ❌ | 将来的な機能追加予定のプレースホルダー |
| `Reference.astro` | 基本ラッパー型 | ❌ | 将来的な機能追加予定のプレースホルダー |

### 移行予定コンポーネント（41個）

元 Hugo partials の移行は `migrate-partials/plan.md` に詳細が記載されています。

## 実装パターンの分析

### 1. 基本ラッパー型（3コンポーネント）

**現在の実装**:
```astro
<div><slot /></div>
```

**特徴**:
- 最もシンプルな実装
- 将来的な機能追加予定のプレースホルダー
- 現状では差別化されていない

**該当コンポーネント**: `Enabled.astro`, `Heading.astro`, `Reference.astro`

### 2. 製品固有型（1コンポーネント）

**現在の実装**:
```astro
---
// TODO: 旧実装では {{$.Site.Params.kintone}} を利用。それを再現する
---

<span>kintone</span>
```

**特徴**:
- Hugo の設定値参照をハードコードで暫定対応
- 設定値の動的取得への対応が必要

**該当コンポーネント**: `Kintone.astro`

### 3. 高機能型（1コンポーネント）

**現在の実装**:
```astro
---
interface Props {
  langCode?: string;
}

const { langCode } = Astro.props;
const className = langCode === 'en' ? 'wv-brk wv-brk-en' : 'wv-brk';
---

<span class={className}><slot /></span>
```

**特徴**:
- TypeScript interface 定義
- Props の受け取りと条件分岐処理
- 外部サービス（WOVN）との連携

**該当コンポーネント**: `Wovn.astro`

## 課題と改善点

### 現在の課題

1. **変更記録ファイルの不足**: 4つのコンポーネントで未作成
   - `Enabled.md`
   - `Heading.md` 
   - `Kintone.md`
   - `Reference.md`

2. **設定値の動的取得**: ハードコードからの脱却が必要
   - `Kintone.astro` の製品名が固定値

3. **基本ラッパーの差別化**: 同じ実装のコンポーネントの整理
   - 3つのコンポーネントが同一実装

### 改善計画

1. **段階的な機能実装**
   - プレースホルダーから実機能への移行
   - 具体的な用途に応じた実装の追加

2. **設定システムの構築**
   - env プロパティによる動的設定の実現
   - ハードコードされた値の排除

3. **ドキュメント整備**
   - すべてのコンポーネントの変更記録作成
   - TODOリストの管理

4. **テストの導入**
   - 描画結果の比較テスト実装
   - Props の妥当性検証

## 移行作業の優先順位

### 第1段階: 基盤整備
- [ ] 不足している変更記録ファイルの作成
- [ ] 基本ラッパー型コンポーネントの具体的な機能実装
- [ ] 設定値の動的取得システムの構築

### 第2段階: 中核コンポーネント移行
- [ ] `Title.astro`, `ApplyParams.astro` などの基本コンポーネント
- [ ] `GotoTop.astro`, `Disclaimer2.astro` などのシンプルコンポーネント
- [ ] `ArticleNumber.astro`, `Breadcrumb.astro` などの中程度の複雑さ

### 第3段階: 高機能コンポーネント移行
- [ ] `TreeNav.astro`, `MegaNav*.astro` などの複雑なナビゲーション
- [ ] `Head.astro`, `SearchBox.astro` などの高機能コンポーネント
- [ ] `Footer.astro`, `Header.astro` などのレイアウトコンポーネント

## 移行済みコンポーネントの詳細

### Wovn.astro
- **機能**: WOVN翻訳サービス用ラッパーコンポーネント
- **Props**: `langCode?: string`
- **特記事項**: 言語コードに応じたCSSクラスの切り替え
- **変更記録**: ✅ 完了済み

### Kintone.astro
- **機能**: kintone製品名の表示
- **Props**: なし（現在はハードコード）
- **課題**: 設定値の動的取得が未実装
- **変更記録**: ❌ 未作成

### その他のコンポーネント
- **Enabled.astro, Heading.astro, Reference.astro**
- **現状**: 基本的なラッパーのみ実装
- **課題**: 具体的な機能と用途が未定義
- **変更記録**: ❌ 未作成

## 学習とナレッジ

### 移行作業で得られた知見

1. **TypeScript型定義の重要性**
   - Propsの型安全性が開発効率を向上させる
   - インターフェースの適切な設計が再利用性に影響

2. **WOVNサービスとの統合**
   - 外部翻訳サービスとの連携パターンが確立
   - 言語固有のスタイリング対応が必要

3. **段階的移行の有効性**
   - プレースホルダーからの段階的実装が現実的
   - 基本構造の確立後に詳細機能を追加

### 次のステップ

1. **Hugo partials 移行の本格開始**
   - `migrate-partials/plan.md` に基づく体系的な移行
   - 41個のpartialsファイルの順次変換

2. **品質管理体制の確立**
   - テスト環境の構築
   - レビュープロセスの標準化

3. **ドキュメント体系の完成**
   - 各コンポーネントの使用方法ドキュメント
   - API仕様書の整備

## 参考情報

- **開発ルール**: `rules.md`
- **移行計画詳細**: `migrate-partials/plan.md`
- **移行用プロンプト**: `migrate-partials/prompt.md`
- **プロジェクト概要**: `../CLAUDE.md`

## 更新履歴

- 2024年12月 - 初版作成（移行初期段階の状況記録）
- 2025年1月 - Partials統合作業の完了を反映
- 2025年1月 - 環境変数ファイル拡張作業の完了を反映
- 2025年1月 - Footer.astro CSVファイル読み込み機能実装完了を反映

### 2025年1月更新内容

#### 0005_partials-integration 作業完了
- **実装済みコンポーネント**: 
  - Disclaimer2.astro（DISCLAIMER2 PARTIAL）
  - Related.astro（RELATED PARTIAL）※コメントアウト
  - Footer.astro（FOOTER PARTIAL）※Footer2からリネーム
- **重要な学習事項**:
  - partial名とコンポーネント名の正確な対応が必要（例：disclaimer2.html → Disclaimer2.astro）
  - DOM構造の厳密な保持（文言の勝手な追加は禁止）
  - templateVersion=2のみ存在するため、Footer2を標準のFooterとして使用
- **判明した課題**:
  - 最高難易度: TreeNav、Header、AnnouncementBanner（再帰処理、API統合が必要）
  - 中難易度: Breadcrumb、LatestPageGuide（階層処理が必要）
  - 低難易度: MegaNav、各種小コンポーネント（単純な移植で対応可能）

#### 0006_env-files-extension 作業完了
- **成果物**: 5つの追加環境変数ファイル
  - `.env.cn` - 中国向けプロダクション環境
  - `.env.cn_staging` - 中国向けステージング環境
  - `.env.jp_staging` - 日本向けステージング環境
  - `.env.us` - アメリカ向けプロダクション環境
  - `.env.us_staging` - アメリカ向けステージング環境
- **重要な学習事項**:
  - 地域別ブランディング差異（中国・日本: kintone、アメリカ: Kintone）
  - 検索機能の地域差（中国: Bing、日本・アメリカ: Google）
  - WOVN翻訳サービスの使用パターン（staging環境で有効化）
  - メガナビゲーションの地域別設定（アメリカのみ有効）
- **環境変数変換の確立**:
  - HugoのToml形式からAstro環境変数への変換ルールが確立
  - `PUBLIC_`プレフィックスと言語サフィックス（`_JA`, `_EN`等）の命名規則
  - JSON配列形式の適切な保持方法

#### 0006_env-files-extension 作業の修正完了
- **成果物**: 環境変数ファイルの整理とenv.tsの簡素化（リージョン維持版）
  - リージョン設定（jp, us, cn）の維持と有効化
  - 言語設定の日本語統一（_JP/_JA接尾辞削除）
  - 英語・中国語設定のコメントアウト
  - env.tsの多言語対応ロジックを削除
- **重要な学習事項**:
  - リージョンと言語の適切な分離（リージョン固有設定は維持、言語のみ統一）
  - 各リージョンの特性保持（US: Kintoneブランディング、CN: Bing検索、JP: Google検索）
  - getLocalizedEnvValue関数の削除で直接的な環境変数取得に変更
  - 英語・中国語設定はコメントアウトで将来の復活が容易
- **アーキテクチャの進化**:
  - 多リージョン・単一言語アーキテクチャの確立
  - リージョン固有のビジネスロジックと言語ロジックの分離
  - コード簡素化とメンテナンス性の向上

#### 0007_footer-csv-implementation 作業完了
- **成果物**: Footer.astroでのCSVファイル読み込み機能実装
  - リージョン別CSVファイル読み分け（links.JP.csv, links.US.csv, links.CN.csv）
  - ViteのESMインポートを使用したCSV読み込み
  - 適切なTypeScript型定義と型安全性の確保
- **重要な学習事項**:
  - Viteの`?raw`インポートによる静的ファイル読み込み
  - カンマ区切りCSVパーサーの実装（クォート対応）
  - `env.targetRegion`を使用した動的ファイルパス生成
  - 元のHugo実装（footer2.html）との構造的な一致保持
- **技術的実装**:
  - CSVデータの型を`string[][]`で定義
  - ID=999: リーガルメニュー、ID=1-4: メガメニューの分類ロジック
  - target属性の型制約とValidation
  - エラーハンドリングとフォールバック処理

#### 0008_header-component-integration 作業完了
- **成果物**: PageLayout.astroでのHeader.astroコンポーネント統合
  - `[HEADER PARTIAL]` プレースホルダーから実際のHeader.astroコンポーネント呼び出しに移行
  - 型安全性を確保したプロパティ受け渡しの実装
  - SearchBox.astro、LangSelector.astro との依存関係の解決
- **重要な学習事項**:
  - コンポーネント統合時の型整合性の重要性（子コンポーネントの型定義事前確認）
  - 段階的実装アプローチの有効性（完全機能実装よりも型安全性優先）
  - 仮実装による基本統合の実現（TODO付きで将来実装を明示）
- **技術的実装**:
  - `buildEnvConfig`関数の拡張（Header.astro, SearchBox.astro, LangSelector.astro用プロパティ追加）
  - `pageData`オブジェクトの拡張（allTranslations, isTranslated, scratch, siteLanguage等の仮実装）
  - Header.astro Props型定義の拡張（LangSelector、SearchBox向け型情報統合）
  - 型エラー解消（重複プロパティ、未使用変数、script属性警告の対応）
- **仮実装として残った課題**:
  - 多言語関連機能（allTranslations, isTranslated, translations）の本格実装
  - scratch.sitename の適切なサイト名取得ロジック
  - 新規環境変数（logo, previewSite, googleSearch等）の実際の.envファイル設定
- **影響範囲**:
  - ✅ PageLayout.astro: Header統合完了
  - ✅ Header.astro: 型定義拡張完了  
  - ✅ src/lib/env.ts: 環境変数設定拡張完了

#### 0008_header-component-integration 固定値対応完了
- **成果物**: templateVersion=2、product="kintone"の固定化による簡素化
  - env.tsからproduct, templateVersionパラメータを削除（固定値前提）
  - Header.astroの不要な分岐処理削除（v2Prod判定、templateVersion分岐等）
  - SearchBox.astroのproduct関連分岐削除（support_guide判定等）
- **重要な学習事項**:
  - 固定値前提によるコード簡素化の効果（分岐削除、型定義簡素化）
  - shouldUseImage常にtrue化によるロゴ表示ロジックの単純化
  - templateVersion=1の古い検索ボックス実装完全削除
- **技術的実装**:
  - buildEnvConfig関数のproductパラメータ削除
  - Header.astro Props型定義からproduct, templateVersion削除
  - SearchBox.astro Props型定義からproduct削除
  - サーチボックス表示判定の簡素化（v2Prod条件削除）
  - ベースURL計算の簡素化（support_guide判定削除）
- **固定値前提による簡素化**:
  - **templateVersion**: 常に"2"、分岐処理削除
  - **product**: 常に"kintone"、他製品の条件削除
  - **shouldUseImage**: 常にtrue（kintoneまたはUSで常に画像使用）
  - **v2Prod**: 削除（kintoneは常にv2対象）