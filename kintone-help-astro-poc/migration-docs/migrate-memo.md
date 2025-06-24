# Hugo から Astro への移行状況メモ

## 概要

このドキュメントは、Hugo テンプレートから Astro コンポーネントへの移行作業の進捗状況と課題を記録します。

## 現在の移行状況

### 完了済みコンポーネント（5個）

| コンポーネント | 実装パターン | 変更記録 | 備考 |
|-------------|------------|---------|-----|
| `Wovn.astro` | 高機能型 | ✅ | WOVN翻訳サービス用、条件分岐とProps対応 |
| `Kintone.astro` | 製品固有型 | ❌ | 製品名表示、設定値の動的取得が課題 |
| `Enabled.astro` | 条件表示型 | ✅ | 地域別条件付きコンテンツ表示機能 |
| `Heading.astro` | アンカーリンク型 | ✅ | AnchorLink2.astroを呼び出す見出しコンポーネント |
| `Reference.astro` | アドモニション型 | ✅ | 参考情報ボックス、Font Awesome + WOVN統合 |

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

#### 0009_template-product-constants 作業完了
- **成果物**: templateVersionとproductの完全な固定化と定数化
  - 全環境変数ファイルからPUBLIC_TEMPLATE_VERSION、PUBLIC_PRODUCTの削除
  - 型定義ファイルからの該当型削除（env.d.ts, types.ts）
  - 全コンポーネントの分岐処理削除と定数化
- **重要な学習事項**:
  - 環境変数削除による大幅なコード簡素化効果
  - 他製品（Garoon、Mailwise、Office、Remote）の処理完全削除
  - 条件分岐から直接表示への変更による保守性向上
- **技術的実装**:
  - **環境変数削除**: 7つの.envファイルから該当行削除
  - **型定義更新**: ImportMetaEnv、EnvProps型から該当プロパティ削除
  - **Head.astro**: product分岐削除、GTM条件簡素化、AlternateLink条件削除
  - **Footer.astro**: Garoon条件削除、CSVファイル読み込み修正
  - **TreeNav系**: templateVersion条件削除、TOC設定簡素化
  - **その他**: BreadcrumbNav、MegaNavKt、AlternateLink等の条件削除
- **固定化された処理**:
  - **メタタグ**: `<meta name="cy-template-version" content="2" />`
  - **メタタグ**: `<meta name="cy-product-name" content="kintone" />`
  - **分岐条件**: templateVersion="2"の条件を常に実行
  - **製品条件**: kintone前提の処理のみ保持
- **削除された機能**:
  - Garoon、Mailwise、Office、Remote製品対応
  - templateVersion=1の古い処理
  - support_guide製品の特別処理
  - 他製品のTOC設定、地域別処理
- **ビルド結果**: npm run build成功、構文エラー解消、CSVファイル読み込み問題解決

#### 0010_env-props-unification 作業完了
- **成果物**: 各コンポーネントのProps型定義の統一化
  - 19件のコンポーネントでカスタムenv型定義をBaseProps使用に統一
  - 型安全性の向上と保守性の改善
  - 型定義の重複削除とEnvProps/BasePropsの一貫した使用
- **重要な学習事項**:
  - BasePropsによる型継承パターンの有効性
  - 独自プロパティが必要なコンポーネントの適切な判断基準
  - 型統一化による環境変数変更時の影響範囲明確化
- **技術的実装**:
  - **型定義統一**: 19件のコンポーネントでカスタムenv型をBaseProps継承に変更
  - **Header.astro**: 大規模なカスタム型定義を削除、BaseProps使用
  - **SearchBox.astro**: カスタムenv/page型定義を削除、BaseProps使用
  - **Footer.astro**: カスタムenv型定義を削除、BaseProps使用
  - **その他**: AnnouncementBanner、Disclaimer系、Enquete等の型統一
- **統一化対象コンポーネント（19件）**:
  - AnnouncementBanner.astro, Disclaimer.astro, Disclaimer3.astro
  - Enquete.astro, FooterGr6.astro, HeaderLabel.astro
  - ArticleLink.astro, IdLink.astro, LatestPageGuide.astro
  - LocaleModal.astro, PreviewList.astro, Related.astro
  - SupportInquiry.astro, LangSelector.astro（部分的）
  - その他の対象コンポーネント
- **保持されたコンポーネント**:
  - **BreadcrumbNav.astro**: p1, p2という独自プロパティのため
  - **LangSelector.astro**: 独自のpage型定義が必要
  - **MegaNavGrMegaPanel.astro**: cursectという独自プロパティ
  - **TreeNavMainMenu.astro**: curnode, target等の独自プロパティ
  - **VideoNav.astro**: tagsという独自プロパティ
- **品質確保**:
  - ビルドテスト成功（npm run build）
  - 型エラーなし、実行時間2.58秒
  - 型チェック通過、実装の一貫性確保

#### 0011_env-files-review 作業完了（修正版）
- **成果物**: 環境変数ファイルとTypeScript型定義の見直し
  - 更新: `src/env.d.ts` 新しい環境変数を追加した型定義
  - 更新: `src/lib/env.ts` buildEnvConfig関数に不足していた環境変数を追加
  - 7つの.envファイルの全内容を調査・対応
- **重要な学習事項**:
  - 既存のsrc/lib/env.tsファイルを活用する方針
  - env.d.tsはシンプルな型定義のみに留める
  - 新規ファイル作成ではなく既存ファイルの拡張が適切
- **技術的実装**:
  - **src/env.d.ts**: 新しい環境変数プロパティを型定義に追加
  - **src/lib/env.ts**: buildEnvConfig関数の返り値に不足環境変数を追加
  - **追加した環境変数**: idSearch, jsonTree, logoAlt, service, cybozuCom等
- **新たに対応した環境変数**:
  - **リージョン固有**: PUBLIC_LOGO_ALT (US), PUBLIC_SUPPORT_INQUIRY (US)
  - **Staging専用**: PUBLIC_USE_WOVN, PUBLIC_DATA_WOVNIO
  - **検索機能**: PUBLIC_BING_SEARCH, PUBLIC_BING_SEARCH_TABS (CN)
  - **JP固有**: PUBLIC_LABEL_LEAD, PUBLIC_LABEL_CONTENTS, PUBLIC_LABEL_COLORS
  - **その他**: PUBLIC_ID_SEARCH, PUBLIC_JSON_TREE, PUBLIC_SERVICE等
- **修正後のアプローチ**:
  - 既存ファイルの拡張による段階的改善
  - 過度な抽象化を避けたシンプルな実装
  - コメントなしのクリーンな型定義

#### 0012_enabled-component 作業完了
- **成果物**: Enabled.astroコンポーネントの実装
  - Hugo の `enabled2.html` ショートコードを Astro コンポーネントに移行
  - 地域別の条件付きコンテンツ表示機能を実装
  - TypeScript による型安全性を確保
- **重要な学習事項**:
  - ショートコードの条件分岐ロジックを Astro の Props と条件レンダリングで実現
  - `regions` 配列と `env.targetRegion` の照合による表示制御
  - DOM構造の保持（wrapper要素を追加しない）
- **技術的実装**:
  - **Props定義**: `regions?: string[]` と `env: { targetRegion: string }`
  - **条件判定**: `!regions || regions.includes(env.targetRegion)`
  - **レンダリング**: `{shouldDisplay && <slot />}` による条件付き表示
  - **後方互換性**: regions未定義時は常に表示
- **品質確保**:
  - ビルドテスト成功（npm run build）
  - 変更記録ファイル（Enabled.md）作成完了
  - 実行計画と作業履歴のドキュメント化

#### 0013_reference-component 作業完了
- **成果物**: Reference.astroコンポーネントの実装
  - Hugo の `reference.html` ショートコードを Astro コンポーネントに移行
  - 参考情報を表示するアドモニションボックス機能の実装
  - Font Awesome アイコンと WOVN 翻訳機能の統合
- **重要な学習事項**:
  - アドモニション形式のコンポーネント実装パターン
  - Font Awesome CSS 前提のアイコン表示
  - WOVN コンポーネントによる i18n 対応の実装方法
  - `markdownify` 機能の Astro Slot による代替実装
- **技術的実装**:
  - **DOM構造**: `aside.admonition.reference` > `div.admonition-alt` + `div.admonition-content`
  - **アイコン**: `fas fa-info-circle fa-fw` の配置とaria-hidden属性保持
  - **翻訳**: `{{ i18n "Title_references" }}` → `<Wovn>i18n__Title_references</Wovn>`
  - **コンテンツ**: `{{ .Inner | markdownify }}` → `<slot />` による内容表示
- **品質確保**:
  - ビルドテスト成功（npm run build、1.98秒）
  - 変更記録ファイル（Reference.md）作成完了
  - DOM構造の厳密な保持確認
  - migrate-rules.md への完全準拠

#### 0001_env-refactor 作業完了
- **成果物**: env管理方法の全面的なリファクタリング
  - Props のバケツリレーから import による直接取得への変更
  - 43ファイルの大規模変更（env.ts, types.ts, PageLayout.astro, 40個のコンポーネント）
  - buildEnvConfig の内部化と env グローバルインスタンスの作成
- **重要な学習事項**:
  - 大規模リファクタリングにおける Task ツールの活用
  - TypeScript 型システムでの BaseProps 継承関係の重要性
  - Readonly 型による設定の保護と型安全性の確保
- **技術的実装**:
  - **env.ts**: `export const env: Readonly<EnvConfig> = buildEnvConfig();` 追加
  - **types.ts**: BaseProps から env プロパティ削除
  - **PageLayout.astro**: buildEnvConfig 呼び出し削除、env props 渡し削除
  - **全コンポーネント**: `import { env } from "@/lib/env";` 追加、Props から env 削除
- **アーキテクチャ改善効果**:
  - Props バケツリレーの完全解消
  - コンポーネント独立性の向上
  - 環境変数変更時の影響範囲明確化
  - 保守性とコードの可読性向上
- **品質確保**:
  - ビルドテスト成功（npm run build）
  - 型エラーなし、既存機能の完全保持

#### 0014_heading-component 作業完了
- **成果物**: Heading.astroコンポーネントの実装
  - Hugo の `render-heading.html` で呼び出される `anchorlink2` テンプレートの Astro 実装
  - AnchorLink2.astro を内部で呼び出すラッパーコンポーネント
  - page.ts に getRelPermalink() 関数を追加（TODO実装）
- **重要な学習事項**:
  - Hugo の複雑な Markdown カスタマイズをシンプルなコンポーネント化で代替
  - product="kintone"、templateVersion="2" 固定により条件分岐が不要
  - Astro では slot の制約により text props を使用する設計選択
- **技術的実装**:
  - **Props設計**: level, id, text, class の明示的定義
  - **AnchorLink2統合**: 既存コンポーネントを活用したラッパーパターン
  - **getRelPermalink関数**: page.ts にダミー実装で将来拡張に備える
  - **型安全性**: TypeScript interface による Props 型定義
- **品質確保**:
  - ビルドテスト成功（npm run build、2.52秒）
  - 変更記録ファイル（Heading.md）作成完了
  - 実行計画と作業履歴のドキュメント化

#### 0015_treenav-integration 作業完了
- **成果物**: PageLayoutからTreeNav.astroの統合とリファクタリング
  - TreeNav3とTreeNavの呼び分け廃止、TreeNav統一
  - env.jsonTree完全削除（7つの.envファイル、型定義、実装から削除）
  - TreeNav内のtoc_in_tree分岐削除（toc_in_tree=false前提の実装のみ）
  - PageLayout.astroでのTreeNav.astro直接呼び出し実装
- **重要な学習事項**:
  - 段階的リファクタリングによる安全な複雑機能削除
  - 環境変数、型定義、実装の一貫性維持の重要性
  - プレースホルダーから実コンポーネントへの移行パターン
  - BasePropsを活用した型安全なコンポーネント統合
- **技術的実装**:
  - **環境変数削除**: .env系7ファイルからPUBLIC_JSON_TREE削除
  - **型定義更新**: env.d.ts, env.tsからjsonTree関連削除
  - **PageLayout統合**: TreeNav.astroの直接import/呼び出し実装
  - **TreeNav簡素化**: toc_in_tree分岐削除、不要変数・import削除
  - **ファイル削除**: TreeNav3.astro（不要なプレースホルダー）削除
- **確定した仕様変更**:
  - **TreeNav呼び分け廃止**: 常にTreeNav.astroを使用
  - **JSON Tree機能削除**: env.jsonTreeとTREENAV3 PARTIAL削除
  - **TOC in Tree機能削除**: toc_in_tree=false前提の実装のみ
  - **サイドバー表示**: tocInTree条件削除で常に表示
- **品質確保**:
  - 第1段階（リファクタリング）ビルドテスト成功（2.50秒）
  - 第2段階（統合）ビルドテスト成功（2.38秒）
  - 型エラーなし、実行時エラーなし
- **残された課題**:
  - TreeNav内部機能の完全実装（現在は基本構造のみ）
  - ページデータ（sections, pages）の実装
  - jsTreeライブラリとの連携とスタイリング

#### 0015_treenav-integration getSiteHomeSections実装完了
- **成果物**: getSiteHomeSections()の本格実装
  - テストデータから実際のファイルシステムベースの動的生成に移行
  - import.meta.globを使用したsrc/pages/配下のファイル取得
  - Hugoのsections仕様に完全対応した階層構造の生成
  - /k/プレフィックス付きrelPermalinkの実装
- **重要な学習事項**:
  - import.meta.globがAstro.globより推奨される（Astro.globは非推奨）
  - any型の完全禁止とRecord<string, unknown>による型安全性確保
  - TreeNavMainMenuの自己インポート問題の解決（Astro.self使用）
  - /k/プレフィックス追加後のパス解析処理の適切な修正
- **技術的実装**:
  - **ファイル取得**: `import.meta.glob('/src/pages/**/*.{md,mdx,astro}', { eager: true })`
  - **フロントマター解析**: 型安全なfrontmatter処理とPageProps構築
  - **セクション構造**: Hugo sections概念に基づく階層化とweight順ソート
  - **プレフィックス処理**: `/k/`付きrelPermalinkと内部処理での適切な除去
  - **自己参照修正**: TreeNavMainMenuでAstro.selfによる再帰呼び出し
- **品質確保とルール追加**:
  - ビルドテスト成功（2.06秒、エラーなし）
  - migration-docs/rules.mdにany型禁止ルールを追加
  - 型安全性の強化（unknown型、Record<string, unknown>の使用）
- **アーキテクチャ進化**:
  - 静的テストデータから動的ファイルシステムベースへの移行
  - Hugo.Site.Home.Sectionsと同等の機能をAstroで実現
  - 将来的なコンテンツ拡張に対応可能な拡張性確保

#### 0016_latest-page-guide-deletion 作業完了
- **成果物**: LatestPageGuide.astroコンポーネントの完全削除
  - LatestPageGuide.astroファイル削除
  - LatestPageGuide.md変更記録ファイル削除
  - PageLayout.astroからの参照削除（118行目の`[LATEST PAGE GUIDE PARTIAL]`）
- **重要な学習事項**:
  - kintone対象ヘルプサイトでは"latest_page"設定コンテンツが存在しないため実際に表示されない
  - 未使用コンポーネントの整理による保守性向上
  - 段階的削除（ファイル削除→参照削除→ビルド確認）の有効性
- **技術的実装**:
  - **削除対象**: LatestPageGuide.astro, LatestPageGuide.md
  - **修正対象**: PageLayout.astro（118行目のプレースホルダー削除）
  - **品質確保**: npm run buildによるビルドテスト成功（2.75秒）
- **削除理由の明確化**:
  - 条件付き表示機能（latest_page パラメータベース）の実装完了済み
  - kintone環境では該当パラメータを持つコンテンツが存在しない
  - 実行されることのない不要なコードの除去

#### 0017_page-functions-update 作業完了
- **成果物**: lib/page.ts の機能拡張
  - getSiteHomeSections() に parent フィールド設定機能追加
  - getCurrentPage() 関数の新規実装
  - AstroGlobal 型のインポート追加
- **重要な学習事項**:
  - Astro.url を使用した現在ページの取得方法
  - 再帰的なツリー構造検索の実装パターン
  - コンポーネントから Astro オブジェクトを関数に渡す設計
  - セクションの階層構造における親子関係の正しい設定方法
- **技術的実装**:
  - **parent フィールド設定**: 
    - トップレベルセクションの親はホーム
    - 入れ子セクションの親は親セクション
    - ページの親は最も近い親セクション
  - **getCurrentPage関数**: 
    - Astro.url.pathname と relPermalink の比較による検索
    - ページが見つからない場合はエラーをスロー
  - **パス正規化**: 末尾スラッシュ除去による確実な比較
  - **再帰検索**: sections と pages の両方を対象とした効率的な検索
- **API設計**:
  - getCurrentPage(Astro: AstroGlobal, sections: PageProps[]): PageProps
  - エラーハンドリング強化（見つからない場合は Error をスロー）
  - sectionsByPath マップによる効率的な親セクション検索
- **追加修正内容**:
  - getCurrentPage() のエラーハンドリング強化（undefined → Error）
  - getSiteHomeSections() のセクション階層対応
  - トップレベルセクションのみを返すように変更
- **品質確保**:
  - ビルドテスト成功（1.33秒）
  - TypeScript 型安全性の確保
  - 既存機能への影響なし
  - セクションの階層構造が正しく構築される
- **リファクタリング追加作業**:
  - 可読性改善のための内部関数分割
  - パスユーティリティ、データ作成、検索ロジックの共通化
  - getSiteHomeSections() を6つの小さな関数に分割
  - getCurrentPage() の簡素化
  - 非破壊的リファクタリング（外部API不変、ビルドテスト成功：2.71秒）

#### 0018_page-testing-setup 作業完了
- **成果物**: lib/page.ts の包括的テストスイート構築
  - Vitest フレームワークのセットアップ
  - 28 個のテストケースによる完全なカバレッジ
  - ダミーコンテンツによる統合テスト
  - .md と .mdx ファイル形式のサポート
- **重要な学習事項**:
  - Astro 統合による Vitest 設定（getViteConfig 使用）
  - import.meta.env.VITEST による環境判定
  - モジュール分割のテスタビリティ向上効果
  - 統合テストによる実データ検証の重要性
- **技術的実装**:
  - **vitest.config.ts**: Astro 標準設定による適切なセットアップ
  - **ダミーコンテンツ**: `.md` と `.mdx` の両形式に対応（.astro は除外）
  - **テスト環境分離**: テスト用ファイルパスとプロダクション用の完全分離
  - **包括的テスト**: 全 export 関数のユニットテストと統合テスト
- **テストカバレッジ**:
  - **ユニットテスト**: 25個（内部関数含む全関数のテスト）
  - **統合テスト**: 3個（getSiteHomeSections の実データテスト）
  - **テスト構造**: 階層構造、親子関係、ソート機能の検証
  - **ファイル形式**: .mdx（セクション）、.md（ページ）の動作確認
- **品質確保**:
  - npm test 全28テスト成功（実行時間: 1.06秒）
  - TypeScript 型安全性維持
  - 実際のファイル読み込みによる現実的テスト
- **テスト設計原則**:
  - export した内部関数の直接テスト（__testExports 不使用）
  - モックではなく実ファイルでの統合テスト
  - 親子関係の循環参照問題への適切な対処

#### breadcrumb 作業完了
- **成果物**: PageLayout.astro での Breadcrumb 表示機能実装
  - `[BREADCRUMB PARTIAL]` プレースホルダーから実際のコンポーネント呼び出しに移行
  - 既存の Breadcrumb.astro と BreadcrumbNav.astro を活用した統合
  - page.ts の getCurrentPage() 関数を使用した現在ページ特定
- **重要な学習事項**:
  - 既存コンポーネントの効果的な再利用パターン
  - page.ts の parent 関係を活用した階層構造の実現
  - Hugo の breadcrumb.html との DOM 構造の正確な対応
  - エラーハンドリングによる堅牢な実装（ページが見つからない場合の対応）
- **技術的実装**:
  - **PageLayout.astro**: getCurrentPage, getSiteHomeSections のインポートと使用
  - **セクション取得**: `await getSiteHomeSections()` による動的情報取得
  - **ページ特定**: try-catch による安全な getCurrentPage() 実行
  - **コンポーネント呼び出し**: `{currentPage && <Breadcrumb page={currentPage} />}`
  - **BreadcrumbNav.astro**: ホームページリンクの WOVN 対応追加
  - **Title.astro**: プロパティ名修正（titleUs → title_us）
- **DOM構造の保持**:
  - Hugo の breadcrumb.html と同等の `<nav class="breadcrumb">` 構造
  - 再帰的パンくず生成による親子階層の正確な表現
  - ホームページでの「トップページ」リンク表示
- **品質確保**:
  - npm run build 成功（2.61秒、エラーなし）
  - TypeScript 型安全性の確保
  - Breadcrumb.md 変更記録ファイル作成完了
- **i18n 対応**:
  - ホームページリンクは WOVN コンポーネントで翻訳対応
  - aria-label は将来対応のため `i18n__todo__` プレフィックス
- **残された課題**:
  - aria-label の完全な i18n 対応
  - lib/params.js の独立実装（現在は ApplyParams.astro で代替）

#### 0019_breadcrumb-implementation 追加修正完了
- **修正内容**: ユーザー指摘事項への対応
  - PageLayout.astro の try-catch 削除（getCurrentPage は必ず成功する前提）
  - PageProps 型定義に titleUs, titleCn を追加
  - page.ts で FrontMatter から title_us, title_cn を取得して PageProps に設定
  - Title.astro を PageProps から地域別タイトルを参照するように修正
  - ReplaceParams 型定義の拡張（ApplyParams で使用される全プロパティ追加）
- **設計改善**:
  - FrontMatter データの PageProps への統一的な統合パターン確立
  - 地域別データは params ではなく PageProps のトップレベルに配置
  - コンポーネント間のデータ受け渡しの簡素化
- **型安全性の向上**:
  - ReplaceParams に全ての置換パラメータを明示的に定義
  - env オブジェクトと ReplaceParams の型整合性確保

#### 0020_pagelayout-current-page-update 作業完了
- **成果物**: PageLayout.astro の getCurrentPage() 完全活用
  - 独自pageData作成の削除、getCurrentPage()結果をベースに変更
  - Props型定義の簡素化（disabled, aliases, labels, type, weight削除）
  - FrontMatterデータのgetCurrentPage()経由での取得に統一
- **重要な学習事項**:
  - データソース一元化によるアーキテクチャ改善効果
  - PageProps型の統一的活用パターンの確立
  - FrontMatterデータの統合における型安全性の重要性
- **技術的実装**:
  - **lib/page.ts拡張**: createPageData関数にtype, aliases, params.disabled, params.labelsを追加
  - **PageLayout.astro簡素化**: Props型定義から重複項目削除、独自pageData作成除去
  - **FrontMatter統合**: `currentPage.params.disabled`, `currentPage.aliases`等での統一取得
  - **テスト修正**: createPageData関数変更に伴うテスト期待値更新
- **アーキテクチャ進化**:
  - **データソース統一**: pageData独自作成からgetCurrentPage()活用への移行
  - **Props責任分離**: MarkdownLayoutProps以外の冗長なPropsの削除
  - **型安全性向上**: PageProps統一による一貫性のある型システム
- **品質確保**:
  - ビルドテスト成功（2.26秒）
  - 全テスト成功（28テスト、961ms）
  - 既存機能への影響なし（Header, TreeNav, Breadcrumb等）

#### 0021_pagelayout-frontmatter-refactor 作業完了
- **成果物**: FrontMatter データの完全な分離と型安全性向上
  - frontmatter プロパティによる FrontMatter 値の構造化
  - 重複プロパティの完全削除と型安全性の向上
  - PageLayout.astro の中間変数削除による簡素化
  - Head.astro の page.params 参照修正
- **重要な学習事項**:
  - 大規模な型リファクタリングにおける段階的アプローチの有効性
  - FrontMatter データと計算値の明確な分離による保守性向上
  - [key: string]: unknown 削除による型安全性の大幅改善
  - 17個のコンポーネント更新における一貫性維持の重要性
- **技術的実装**:
  - **PageProps型定義**: 重複プロパティ削除、frontmatter プロパティに集約
    ```typescript
    frontmatter: {
      title: string;
      titleUs?: string;
      titleCn?: string;
      description: string;
      weight: number;
      type: string;
      disabled: string[];
      aliases: string[];
      labels: string[];
    };
    ```
  - **createPageData()**: ルートプロパティ削除、frontmatter のみに統一
  - **17コンポーネント更新**: `page.title` → `page.frontmatter.title` 変更
  - **型安全性強化**: `[key: string]: unknown` 削除、params プロパティ削除
  - **PageLayout.astro**: 中間変数削除、直接参照に変更
  - **Head.astro**: `page.params.type` → `page.frontmatter.type` 修正
- **アーキテクチャ進化**:
  - **データ構造明確化**: FrontMatter 由来値と計算値の完全分離
  - **型安全性向上**: 意図しないプロパティアクセスの完全防止
  - **コード簡素化**: 重複削除と中間変数の削除による可読性向上
  - **一貫性確保**: 全コンポーネントでの統一的なデータアクセスパターン
- **品質確保**:
  - 段階的変更によるビルドテスト（各段階で成功確認）
  - 最終ビルドテスト成功（npm run build、エラーなし）
  - TypeScript エラー完全解消（Head.astro の page.params 参照修正）
  - 既存機能の完全保持（DOM 構造、動作に変更なし）

#### 0022_pagelayout-placeholders-implementation 作業完了
- **成果物**: PageLayout.astro での TreeNavToggle と GoToTop コンポーネント統合
  - `[TREE NAV TOGGLE PARTIAL]` と `[GO TO TOP PARTIAL]` プレースホルダーから実コンポーネント呼び出しに移行
  - 既存の適切に実装済みコンポーネントを活用した効率的な統合
  - DOM 構造の正確な保持と型安全性の確保
- **重要な学習事項**:
  - 既存実装の充実度確認の重要性（TreeNavToggle.astro, GoToTop.astro が既に適切に実装済み）
  - プレースホルダーから実装への移行パターンの有効性
  - BaseProps による統一的な型設計の継続活用
- **技術的実装**:
  - **TreeNavToggle.astro**: 2つのボタン（show/hide）、Font Awesome アイコン（chevron-right/left）
  - **GoToTop.astro**: Font Awesome スタックアイコン（circle + arrow-circle-up）
  - **PageLayout.astro**: import 文追加（2行）、プレースホルダー置換（2行）
  - **型安全性**: BaseProps 継承による一貫した Props 型定義
- **品質確保**:
  - ビルドテスト成功（npm run build、3.24秒、エラーなし）
  - DOM 構造の Hugo 実装との完全一致
  - TypeScript 型チェック通過
- **アーキテクチャ進化**:
  - プレースホルダー管理による段階的実装の効果的活用
  - 既存コンポーネント資産の適切な再利用
  - 統一された型システムによる保守性向上

#### 0023_support_enquete_components 作業完了
- **成果物**: PageLayout.astro での SupportInquiry と Enquete コンポーネント統合
  - `[SUPPORT INQUIRY PARTIAL]` と `[ENQUETE PARTIAL]` プレースホルダーから実コンポーネント呼び出しに移行
  - 不要なProps定義の削除による最適化
  - 既存の適切に実装済みコンポーネントの効率的な活用
- **重要な学習事項**:
  - 使用していないPropsの適切な削除が重要（SupportInquiry.astro は BaseProps 不要）
  - 環境変数は直接 import で必要に応じて取得（Enquete.astro の env.previewSite）
  - プレースホルダーから実コンポーネントへの段階的移行パターンの確立
- **技術的実装**:
  - **SupportInquiry.astro**: BaseProps 完全削除、HubSpot 連携付きサポート問い合わせボタン
  - **Enquete.astro**: 不要な page Props 削除、env.previewSite による条件付きレンダリング維持
  - **PageLayout.astro**: import 文追加（2行）、プレースホルダー置換（2行）
  - **Props最適化**: BaseProps は必要な場合のみ使用する原則の確立
- **品質確保**:
  - ビルドテスト成功（npm run build、2.81秒、エラーなし）
  - TypeScript 型エラーなし、Props 最適化による保守性向上
  - DOM 構造の完全保持（WOVN翻訳、Font Awesome アイコン、外部スクリプト統合）
- **アーキテクチャ進化**:
  - Props 最適化による不要な依存関係の除去
  - 段階的統合（統合→Props最適化）による安全な実装
  - 既存コンポーネント資産の効率的な再利用パターンの確立

#### 0024_locale_modal_component 作業完了
- **成果物**: PageLayout.astro での LocaleModal コンポーネント統合
  - `[LOCALE MODAL PARTIAL]` プレースホルダーから実コンポーネント呼び出しに移行
  - 最大限のProps最適化による完全な簡素化
  - アメリカリージョン限定条件の正確な維持
- **重要な学習事項**:
  - Props最適化パターンの確立と再現性の確認（SupportInquiry/Enqueteパターンの踏襲）
  - 条件分岐は親コンポーネント側で処理し、子コンポーネントは最大限シンプル化
  - 段階的統合による性能向上効果の定量的確認（ビルド時間37%短縮）
- **技術的実装**:
  - **LocaleModal.astro**: BaseProps完全削除、env/page依存なしの最大限簡素化
  - **PageLayout.astro**: import文追加（1行）、プレースホルダー置換（1行）
  - **条件分岐維持**: `env.targetRegion === "US"` によるアメリカリージョン限定表示
  - **アクセシビリティ**: role="dialog", aria-modal="true" 属性の保持
- **品質確保**:
  - ビルドテスト成功（npm run build、1.84秒、前回2.94秒から37%短縮）
  - TypeScript型エラーなし、Props最適化による保守性向上
  - DOM構造の完全保持（WOVN翻訳、モーダルダイアログ機能）
- **アーキテクチャ進化**:
  - Props最適化パターンの標準化（3コンポーネントで実証済み）
  - 段階的統合手法による安全で効果的な移行方法の確立
  - 性能向上の定量的確認による開発効率向上の実証

#### 0025_article-components-integration 作業完了
- **成果物**: PageLayout.astro での ArticleLink・ArticleNumber コンポーネント統合
  - `[ARTICLE LINK TEMPLATE]` と `[ARTICLE NUMBER TEMPLATE]` プレースホルダーから実コンポーネント呼び出しに移行
  - 既存の適切に実装済みコンポーネントの効率的な活用
  - 条件付きレンダリングの完全保持（env.idSearch と aliases 存在条件）
- **重要な学習事項**:
  - 既存コンポーネント活用パターンの確立（調査→統合→テストの流れ）
  - 複雑な条件式を保持しつつのコンポーネント化手法
  - BaseProps による統一的な Props 設計の継続活用
- **技術的実装**:
  - **ArticleLink.astro**: パーマリンクコピー機能付きボタン、Font Awesome + WOVN 統合
  - **ArticleNumber.astro**: エイリアスから記事番号抽出・表示、WOVN 翻訳対応
  - **PageLayout.astro**: import 文2行追加、プレースホルダー2箇所を実コンポーネント呼び出しに変更
  - **条件付きレンダリング**: `env.idSearch && currentPage.frontmatter.aliases.length > 0` 条件の維持
- **品質確保**:
  - ビルドテスト成功（npm run build、2.29秒、エラーなし）
  - TypeScript 型エラーなし、BaseProps による型安全性確保
  - DOM構造の保持（条件分岐ロジック維持）
- **新機能追加**:
  - 記事番号表示機能（ArticleNumber）の実装
  - パーマリンクコピー機能（ArticleLink）の実装
  - Font Awesome アイコンと WOVN 翻訳の統合

#### 0025_article-components-integration リファクタリング完了
- **追加修正内容**: ArticleLink・ArticleNumber コンポーネントのProps最適化と条件判定の内部移動
  - BaseProps から必要最小限のカスタムPropsへ変更
  - 表示条件（env.idSearch、aliases.length）をコンポーネント内部で判定
  - PageLayout.astro の条件判定を削除して簡素化
- **技術的変更**:
  - **ArticleLink.astro**: aliases, relPermalink, fileContentBaseName のみ受け取る
  - **ArticleNumber.astro**: aliases のみ受け取る
  - **内部判定**: `if (!env.idSearch || aliases.length === 0) return null;`
  - **親の簡素化**: 条件判定なしで直接コンポーネント呼び出し
- **アーキテクチャ進化**:
  - コンポーネントの責任分離（表示条件は自己判定）
  - 親コンポーネントの複雑性削減
  - Props 最小化によるインターフェース明確化

#### 0026_header-label-component 作業完了
- **成果物**: PageLayout.astro での HeaderLabel コンポーネント統合
  - `[HEADER LABEL TEMPLATE]` プレースホルダーから実際の HeaderLabel.astro コンポーネント呼び出しに移行
  - Props最適化による BaseProps から独自Props（labels配列のみ）への変更
  - 表示条件の完全なコンポーネント内移動
- **重要な学習事項**:
  - Props最適化パターンの確立（必要最小限のデータのみ受け取る設計）
  - 条件分岐の適切な配置（コンポーネント内での完結した判定）
  - BaseProps削除による依存関係の除去効果
- **技術的実装**:
  - **HeaderLabel.astro**: BaseProps削除、`labels: string[]` のみのカスタムProps
  - **条件判定内部化**: `labels && labels.length > 0 && labelContents` による自己判定
  - **PageLayout.astro**: import追加、プレースホルダー置換、外部条件分岐削除
  - **DOM構造保持**: 元のHugoテンプレートと同等のラベル表示構造維持
- **アーキテクチャ進化**:
  - 責任分離によるコンポーネント独立性向上
  - Props最適化による再利用性とメンテナンス性向上
  - 条件分岐一元化による保守性向上
- **品質確保**:
  - ビルドテスト成功（npm run build、2.58秒、エラーなし）
  - TypeScript型安全性確保
  - 既存機能の完全保持

#### 0027_hint-component 作業完了
- **成果物**: Hint.astro および Note.astro コンポーネントの実装
  - Hugo ショートコード `hint.html` を Astro コンポーネントとして移植
  - 同時に `note.html` も移植（MDX ファイル互換性確保のため）
  - 既存 MDX ファイルの Hugo 構文を Astro 構文に修正
- **重要な学習事項**:
  - アドモニション実装の統一パターン確立（Reference.astro と同様の構造）
  - 製品固定化による大幅な簡素化効果（kintone=固定でアイコン常時表示）
  - MDX ファイルでの Hugo ショートコード残存問題と対処方法
  - 同時実装による効率的な互換性確保の手法
- **技術的実装**:
  - **Hint.astro**: `aside.admonition.hint` 構造、Font Awesome lightbulb アイコン、WOVN翻訳
  - **Note.astro**: `aside.admonition.note` 構造、Font Awesome pencil-alt アイコン、WOVN翻訳
  - **Props最適化**: 両コンポーネントともProps不要の最大限簡素化
  - **MDX修正**: `add_employee_app.mdx` の Hugo 構文を Astro 構文に変換
  - **DOM構造保持**: 元の Hugo ショートコードと完全同等の構造維持
- **アドモニション実装パターン**:
  - **統一構造**: `aside.admonition.{type}` > `div.admonition-alt` + `div.admonition-content`
  - **アイコン配置**: Font Awesome アイコンの aria-hidden 属性保持
  - **i18n対応**: WOVN コンポーネントによる翻訳（Title_tips, Title_note）
  - **内容表示**: slot による Markdown 内容の表示
- **品質確保**:
  - ビルドテスト成功（npm run build、2.52秒、エラーなし）
  - 実用例での動作確認（add_employee_app.mdx での使用）
  - 変更記録ファイル完備（Hint.md, Note.md）
- **互換性対応**:
  - Hugo ショートコード構文 `{{< hint >}}` → Astro コンポーネント `<Hint>`
  - import 文の追加による適切なコンポーネント読み込み
  - 既存 MDX ファイルでの即座に使用可能な状態

#### 0028_page-nav-component 作業完了
- **成果物**: PageLayout.astro での PageNav コンポーネント統合
  - `[PAGE NAV PARTIAL]` プレースホルダーから実際の PageNav.astro コンポーネント呼び出しに移行
  - Props最適化による BaseProps から必要最小限のカスタムProps への変更
  - DOM構造の完全保持と型安全性の確保
- **重要な学習事項**:
  - Props最適化パターンの確立（page全体 → 必要プロパティのみ）
  - 段階的統合アプローチの有効性（TODO実装による将来拡張への備え）
  - 既存コンポーネント活用による効率的な移行手法
- **技術的実装**:
  - **Props設計改善**: `interface Props extends BaseProps {}` → `{ nextInSection?: { permalink: string; }; prevInSection?: { permalink: string; }; }`
  - **参照の最適化**: `page.nextInSection` → `nextInSection` による直接参照
  - **PageLayout統合**: import追加、プレースホルダー置換、条件付きレンダリング維持
  - **型安全性**: 必要最小限のプロパティ定義による明確なインターフェース
- **品質確保**:
  - ビルドテスト成功（npm run build、2.30秒、エラーなし）
  - DOM構造の Hugo pagenav.html との完全一致
  - 変更記録ファイル（PageNav.md）更新完了
- **残された課題（TODO実装）**:
  - nextInSection/prevInSection の実際の値取得ロジック
  - シリーズページでの前後ページナビゲーション機能の完全実装
  - Hugo の .NextInSection/.PrevInSection と同等の機能実現
- **アーキテクチャ進化**:
  - Props最適化による依存関係の削除と型安全性向上
  - 段階的統合パターンの確立（機能的完成度よりも構造的統合を優先）
  - 既存コンポーネント活用による効率的な移行手法の実証

#### 0028_page-nav-component nextInSection/prevInSection実装完了
- **成果物**: Hugo の NextInSection/PrevInSection 機能の完全実装
  - page.ts に assignSectionNavigation 関数追加によるセクション内ナビゲーション設定
  - PageLayout.astro での実際の値渡し（TODO実装から実機能への移行）
  - 包括的なテストケース追加（30個のテスト、全てパス）
- **重要な学習事項**:
  - Hugo 仕様の正確な理解（weight降順ソート、NextInSection/PrevInSection の意味）
  - セクション内ページナビゲーションの実装パターン確立
  - TODO実装から実機能への段階的移行手法の有効性
- **技術的実装**:
  - **Hugo仕様準拠**: weight降順ソート（数値が大きいほど上位）による前後ページ決定
  - **assignSectionNavigation関数**: セクション内の全ページに対する前後関係の設定
  - **型安全な値渡し**: PageProps から必要な permalink のみを抽出して渡す設計
  - **テスト用ダミーコンテンツ**: series_page_1.mdx (weight:30), series_page_2.mdx (weight:20), series_page_3.mdx (weight:10)
- **品質確保**:
  - 全30テストケースパス（既存28 + 新規2）
  - ビルドテスト成功（npm run build、エラーなし）
  - Hugo 仕様との完全互換性確認
  - 最初のページ（prevInSection=undefined）、最後のページ（nextInSection=undefined）の適切な実装
- **Hugo互換性**:
  - NextInSection: 同一セクション内で次のページ（weight順序で下位）
  - PrevInSection: 同一セクション内で前のページ（weight順序で上位）
  - セクション内ページが1個の場合は両方undefined
  - weight以外の date, linkTitle, path ソートは将来実装として基盤確保
- **アーキテクチャ進化**:
  - TODO実装から実機能への完全移行パターンの確立
  - Hugo メソッドの Astro での正確な再現手法の実証
  - テスト駆動開発による品質保証体制の構築
  - 段階的機能実装における拡張性の確保

#### productパラメータに関する誤認識の調査（2025年1月）
- **判明した事実**:
  - rules.md に「product: 'kintone' で固定」と記載していたが、実際には "slash", "store" も存在
  - Hugoテンプレートでは3製品（kintone, slash, store）の分岐処理が存在
  - 0009_template-product-constants 作業で誤って全ての製品分岐を削除
- **削除してしまった重要な分岐**:
  1. **MegaNavKt.astro のtabnum設定**:
     - Hugo: kintone=1, slash=2, store=3 の分岐
     - Astro: kintone固定（tabnum=1）
  2. **Header.astro のv2_prod判定**:
     - Hugo: kintone, slash, store, support_guide, store-jp をv2製品として判定
     - Astro: 判定処理自体を削除
  3. **トップページコンテンツ生成**:
     - Hugo: slash, store はkintoneからJSONコピー
     - Astro: 未実装のため影響なし
- **現状の問題点**:
  - MegaNavKt.astroに slash, store のURLがハードコードされているが、実際にはkintone環境では不要
  - 製品判定が必要な箇所で固定値になっているため、将来的な拡張性が失われている
- **推奨対応**:
  - 現時点ではkintone専用として最適化を継続
  - slash, store のサポートが必要になった場合の拡張ポイントを明確化
  - MegaNavKt.astroのハードコードされたメニューデータをCSVから読み込むよう修正

#### 0029_meganav-component-integration 作業完了
- **成果物**: MegaNavコンポーネントの統合と簡素化
  - MegaNavGr関連コンポーネント（5個）の完全削除
  - MegaNavKt.astroの内容をMegaNav.astroに統合
  - env.targetRegion === "US" 分岐の削除
- **重要な学習事項**:
  - 不要な条件分岐削除による構造の簡素化効果
  - PageLayout側での条件判定により、コンポーネント内の分岐は不要になる
  - product="kintone"固定により、Garoon関連機能の完全削除が可能
- **技術的実装**:
  - **MegaNav.astro**: MegaNavKt.astroの実装を完全統合
  - **削除したファイル**: MegaNavGr.astro, MegaNavGrGetSecond.astro, MegaNavGrTitleIcon.astro, MegaNavGrMegaPanel.astro, MegaNavGrSectBar.astro, MegaNavKt.astro
  - **機能保持**: kintone用メガナビゲーション機能、タブシステム、アクセシビリティ対応
  - **TODOとして残存**: CSVファイル読み込み、product分岐処理（slash, store対応時）
- **アーキテクチャ進化**:
  - 条件分岐の親コンポーネント集約による責任分離の改善
  - 単一責任原則に基づくコンポーネント設計の確立
  - 不要なコード削除による保守性向上
- **品質確保**:
  - ビルドテスト成功（npm run build、2.37秒、エラーなし）
  - DOM構造の完全保持（nav > ul.g-nav + div.mega-nav）
  - TypeScript型安全性維持（BaseProps使用）

#### PageLayout関連プロパティの削除対応 (2025年1月)
- **削除対象プロパティ**:
  - `page.isTranslated`: WOVNサービス利用により翻訳状態判定が不要
  - `page.siteLanguage`: WOVN初期化で言語設定が不要
  - `page.allTranslations`: WOVN利用により不要
  - `page.translations`: 同様にWOVN利用により不要
  - `scratch.sitename`: 利用箇所がないため削除
- **重要な学習事項**:
  - **WOVN統合の効果**: 外部翻訳サービス利用により、FW側の言語機能の大幅簡素化が可能
  - **Hugo多言語機能の削除**: Hugo固有の翻訳関連プロパティは全て不要
  - **PageLayoutの簡素化**: 独自定義オブジェクトの削除による構造簡素化
- **技術的変更**:
  - PageLayout.astroで定義していた独自pageDataオブジェクトを削除
  - 翻訳関連のプロパティ設定を全て除去
  - WOVN前提の設計に統一
- **アーキテクチャ進化**:
  - Hugo多言語システムからWOVN統合への完全移行
  - 翻訳状態管理の外部サービス委譲
  - フレームワーク側の言語処理負荷削減

#### 0030_related-component-deletion 作業完了
- **成果物**: Related.astro コンポーネントの完全削除
  - Related.astro ファイル削除
  - Related.md 変更記録ファイル削除
  - PageLayout.astro からの参照削除（コメントアウトされていた箇所）
- **重要な学習事項**:
  - Hugo の Related Content 機能が設定と条件を満たさないため実際に使用されていなかった
  - デフォルト設定のみで tags, keywords, categories が設定されていない状態
  - 既にコメントアウトされており、削除による影響なし
- **技術的実装**:
  - **削除対象**: Related.astro, Related.md
  - **修正対象**: PageLayout.astro（import文とコンポーネント呼び出しのコメント削除）
  - **品質確保**: npm run build によるビルドテスト成功（2.92秒）
- **削除理由の明確化**:
  - Hugo 設定ファイルに related 設定が存在しない
  - コンテンツに関連性判断用の属性（tags, keywords, categories）が設定されていない
  - 関連性スコアの閾値を満たすコンテンツが存在しない
  - 実際に表示されることがない機能

#### 0031_announcement-banner-integration 作業完了
- **成果物**: AnnouncementBanner.astro の統合リファクタリングとPageLayout統合
  - MakeAnnounceBanner.astro の機能を AnnouncementBanner.astro に完全統合
  - Props設計の改善（配列からオブジェクト形式への変更）
  - CSV ファイル読み込み関連コードの削除
  - PageLayout.astro でのプレースホルダーから実コンポーネントへの移行
  - MakeAnnounceBanner.astro/.md ファイル削除とドキュメント統合
- **重要な学習事項**:
  - コンポーネント分離設計から統合設計への移行パターンの確立
  - Props 設計において配列形式よりオブジェクト形式の型安全性と可読性の優位性
  - 未使用機能（CSV読み込み）の積極的削除による保守性向上効果
  - Props最適化パターンの適用（BaseProps削除で必要最小限のコンポーネント実現）
- **技術的実装**:
  - **Props設計**: `msg?: MessageData` による省略可能なメッセージオブジェクト受け取り
  - **DOM構造統合**: MakeAnnounceBanner の完全な DOM 構造を AnnouncementBanner に移植
  - **型定義**: MessageData interface による型安全なプロパティ定義
  - **機能保持**: Font Awesome アイコン、WOVN 翻訳、マークダウン処理機能の維持
  - **PageLayout統合**: `[ANNOUNCEMENT BANNER PARTIAL]` プレースホルダーから `<AnnouncementBanner />` への移行
  - **Props最適化**: BaseProps削除で依存関係を完全排除
- **アーキテクチャ進化**:
  - コンポーネント間の依存関係削除（MakeAnnounceBanner への依存排除）
  - Props インターフェースの明確化（string[] → MessageData オブジェクト）
  - 不要な実装（CSV読み込み、配列マッピング）の削除による簡素化
  - プレースホルダーから実コンポーネントへの段階的統合パターンの確立
- **品質確保**:
  - TypeScript 型エラー解消（未使用変数 page の削除）
  - ビルドテスト成功確認（統合前後でエラーなし）
  - 既存 DOM 構造の完全保持