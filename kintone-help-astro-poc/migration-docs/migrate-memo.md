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