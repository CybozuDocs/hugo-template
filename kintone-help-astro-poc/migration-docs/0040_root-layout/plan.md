# RootLayout.astro 作成プラン

## 概要

layouts/index.html をベースに、Astro の RootLayout.astro を作成します。これは、kintone ヘルプサイトのトップページ（ホームページ）のレイアウトを担当する重要なコンポーネントです。

## 分析結果

### 元ファイル（layouts/index.html）の主要機能

1. **templateVersion=2 固定**: 新ルールにより templateVersion=2 のみ対応
2. **トップページ専用検索機能**: 「ようこそ!キーワードを入力してください」メッセージ付き
3. **カテゴリ別メニュー**: CSVファイルから読み込んだデータを元に動的構築
4. **リージョン別データ**: JP, US, CN の3リージョンに対応
5. **メガナビゲーション**: US リージョンのみ有効
6. **付録情報**: 別途 CSV データから読み込み

### 参考ファイルとの違い

- **PageLayout.astro**: 記事ページ用、slot でコンテンツを受け取る
- **SectionLayout.astro**: セクション一覧ページ用、子ページリストを表示
- **RootLayout.astro**: ホームページ用、CSV データから動的にメニューを生成

## 実装プラン

### 1. ファイル構造

```
kintone-help-astro-poc/src/layouts/RootLayout.astro
```

### 2. 主要コンポーネント

#### 2.1 共通レイアウト部分
- PageLayout.astro, SectionLayout.astro と共通する部分を統合
- Head, Header, Footer などの共通コンポーネント使用

#### 2.2 トップページ専用部分
- **検索ボックス**: 「ようこそ!キーワードを入力してください」メッセージ
- **メインメニュー**: home.ts からのデータ読み込み
- **付録情報**: homeAppendix.ts からのデータ読み込み

### 3. データ処理

#### 3.1 CSVデータの代替
- 元: CSVファイルからの動的読み込み
- 新: home.ts, homeAppendix.ts からの型安全な読み込み

#### 3.2 リージョン別データ取得
```typescript
import { homeData } from '../pages/_data/home.ts';
import { homeAppendixData } from '../pages/_data/homeAppendix.ts';

const regionData = homeData[env.targetRegion]; // 'JP' | 'US' | 'CN'
const appendixData = homeAppendixData[env.targetRegion];
```

### 4. 実装手順

#### Phase 1: 基本構造の作成
1. ファイル作成と基本的なHTMLタグ構造
2. 共通コンポーネント（Head, Header, Footer等）の統合
3. 型定義の実装

#### Phase 2: 検索機能の実装
1. トップページ専用検索ボックスの実装
2. ウェルカムメッセージの多言語対応（WOVN使用）

#### Phase 3: メインメニューの実装
1. home.ts からのデータ読み込み
2. カテゴリ別メニューの動的生成
3. ページリンクの処理（外部リンク対応）
4. パーティション（区切り）の実装

#### Phase 4: 付録情報の実装
1. homeAppendix.ts からのデータ読み込み
2. 付録カテゴリの動的生成
3. 外部リンクの処理

#### Phase 5: 統合とテスト
1. 全体的な動作確認
2. DOM 構造の保持確認
3. CSS クラス名の一致確認

### 5. 型定義

```typescript
import type { MarkdownLayoutProps } from "astro";

type Props = MarkdownLayoutProps<{}>;
```

### 6. 重要な注意事項

#### 6.1 DOM 構造の保持
- 元の HTML 構造を正確に保持
- CSS クラス名の完全一致
- セマンティック HTML の維持

#### 6.2 固定値の活用
- templateVersion=2 で固定（条件分岐不要）
- product="kintone" で固定

#### 6.3 リージョン別処理
- env.targetRegion による分岐
- US リージョンのみメガナビゲーション有効

#### 6.4 外部リンクの処理
- https:// で始まる URL は外部リンクとして処理
- 相対パスは内部リンクとして処理

### 7. テスト項目

- [ ] 基本的な HTML 構造が正しく出力される
- [ ] 検索ボックスが正しく表示される
- [ ] リージョン別データが正しく読み込まれる
- [ ] カテゴリ別メニューが正しく生成される
- [ ] 外部リンクが正しく処理される
- [ ] 付録情報が正しく表示される
- [ ] CSS クラス名が元のファイルと一致する
- [ ] メガナビゲーションが US リージョンのみ表示される

## 固定値による失われる機能・表示の分析

### 1. product="kintone" 固定により失われる機能

#### 1.1 他製品の処理（削除される機能）

**slash/support_guide/store の場合の処理**:
- リモートJSONデータ取得: `https://{domain}/k/{lang}/toppage.json`
- 外部kintoneサイトからの動的データ取得機能
- JSONベースの構造化データ処理

**失われる具体的な機能**:
1. **リモートデータ連携**: 外部サイトからのJSONデータ取得
2. **動的コンテンツ**: 外部サイトの更新に自動追従
3. **JSONベースの構造**: より柔軟なデータ構造
4. **item_jaonly フラグ**: 日本語限定アイテムの表示制御

#### 1.2 support_guide 専用の特別処理

**ウェルカムメッセージの違い**:
- 通常: "Welcome! Enter_keywords"
- support_guide: "Welcome"のみ

**言語制限**:
- es/th言語での特別処理（`$makecopy = false`）

#### 1.3 影響評価

**正の影響**:
- 実装の単純化
- ローカルファイルベースの高速処理
- 型安全性の向上

**負の影響**:
- 外部データ連携機能の消失
- 動的コンテンツ更新の不可
- 製品間の機能統一性の低下

### 2. templateVersion="2" 固定により失われる機能

#### 2.1 templateVersion="1" の処理（削除される機能）

**バージョン1の表示構造**:
```html
<div class="eye-catching">
  <div class="hero" style="background-image: url('images/hero_common.png');"></div>
</div>
<main class="main">
  <article class="article home-article">
    <div class="wrapper">
      <div class="welcome_message">Welcome</div>
      <div class="search-wrap">
        <!-- 基本的な検索フォーム -->
      </div>
      <nav class="col-flex">
        {{ .Content }}
      </nav>
    </div>
  </article>
</main>
```

**失われる機能**:
1. **ヒーロー画像**: `images/hero_common.png` を使用した視覚的なヘッダー
2. **静的コンテンツ**: `.Content` による静的コンテンツ表示
3. **preview_site モード**: プレビュー用の特別表示
4. **シンプルな検索フォーム**: より基本的な検索UI

#### 2.2 影響評価

**正の影響**:
- 最新バージョンの機能に集中
- 複雑な条件分岐の削除
- 保守性の向上

**負の影響**:
- レガシーサポートの停止
- 古いデザインへの回帰不可
- 簡素な UI オプションの消失

### 3. 移行時の対応方針

#### 3.1 削除される機能の記録

**削除対象**:
- product="slash", "support_guide", "store" の処理
- templateVersion="1" の処理
- リモートJSONデータ取得機能
- 外部サイト連携機能

**保持される機能**:
- product="kintone" の処理
- templateVersion="2" の処理
- CSVベースのデータ処理
- 地域別設定対応

#### 3.2 実装時の注意点

1. **削除処理の明確化**: 削除される機能を明確にコメントで記録
2. **型安全性の確保**: 削除により単純化された型定義
3. **テストの簡素化**: 削除された条件分岐のテスト削除

## 予想される課題

1. **CSV データの型変換**: 元の CSV データから TS データへの正確な変換
2. **複雑なループ処理**: Hugo の range 処理を Astro の map に変換
3. **条件分岐の処理**: 多重条件分岐の Astro での実装
4. **ページ階層の処理**: allPages からのページ検索ロジック
5. **削除機能の影響**: 他製品サポートの完全削除による互換性問題

## 成功基準

1. 元の layouts/index.html と同等の DOM 構造を生成
2. 全リージョン（JP, US, CN）で正しく動作
3. TypeScript による型安全性の確保
4. 外部データファイル（home.ts, homeAppendix.ts）の正しい活用
5. 移行ルールの完全準拠