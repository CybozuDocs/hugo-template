# Header コンポーネント統合プラン

## 作業概要

PageLayout.astro の `[HEADER PARTIAL]` プレースホルダーを、既存の `src/layouts/components/Header.astro` コンポーネントに置き換える。

## 現状分析

### PageLayout.astro の現在の状況
- 103行目に `<div>[HEADER PARTIAL]</div>` というプレースホルダーが存在
- Header.astro コンポーネントは `src/layouts/components/Header.astro` に既に実装済み

### Header.astro コンポーネントの仕様
- Props: `env` と `page` オブジェクトを受け取る
- 主要機能:
  - ロゴ表示（画像/テキスト）
  - 検索ボックス（SearchBox コンポーネント使用）
  - 言語セレクター（LangSelector コンプーネント使用）
  - ヘッダークラスの動的決定
  - テンプレートバージョン対応

### 既存の依存関係
- SearchBox.astro コンポーネント
- LangSelector.astro コンポーネント
- Wovn.astro コンポーネント（import済みだが未使用）

## プロパティ渡しの懸念点分析

### 1. 必要なプロパティの対応状況

#### env オブジェクト
Header.astro が要求するプロパティ:
- `meganav` ✅ PageLayout で `envConfig.meganav` として利用可能
- `targetRegion` ✅ `envConfig.targetRegion` として利用可能
- `product` ✅ `envConfig.product` として利用可能
- `templateVersion` ✅ `envConfig.templateVersion` として利用可能
- `baseURL` ✅ `envConfig.baseURL` として利用可能
- `logo` ⚠️ 未確認 - `envConfig.logo` の設定状況要確認
- `productName` ✅ `envConfig.productName` として利用可能
- `help` ✅ `envConfig.help` として利用可能
- `previewSite` ⚠️ 未確認 - `envConfig.previewSite` の設定状況要確認
- `googleSearch` ⚠️ 未確認 - `envConfig.googleSearch` の設定状況要確認
- `searchAll` ⚠️ 未確認 - `envConfig.searchAll` の設定状況要確認
- `langSelector` ⚠️ 未確認 - `envConfig.langSelector` の設定状況要確認

#### page オブジェクト
Header.astro が要求するプロパティ:
- `isHome` ✅ `pageData.isHome` として利用可能
- `lang` ⚠️ `pageData.lang` は設定済みだが、Header では `page.lang` として参照
- `allTranslations` ❌ PageLayout では未設定
- `isTranslated` ❌ PageLayout では未設定
- `params` ✅ `pageData.params` として利用可能
- `scratch` ❌ PageLayout では未設定、Header.md でTODO記載済み

### 2. 重要な欠損プロパティ

#### allTranslations
- Header.astro で言語セレクター表示判定に使用
- `page.allTranslations.length` で言語数を取得
- 現在 PageLayout では未設定

#### isTranslated  
- 言語セレクター表示の条件判定に使用
- `page.isTranslated && env.langSelector` で表示制御

#### scratch.sitename
- ロゴテキスト表示時に使用
- Header.md で TODO として記載済み

## 実装プラン

### Phase 1: 基本統合
1. PageLayout.astro でHeader.astroコンポーネントをimport
2. `[HEADER PARTIAL]` プレースホルダーを `<Header>` コンポーネント呼び出しに置換
3. 基本的な env, page プロパティを渡す

### Phase 2: 欠損プロパティの対応
1. **allTranslations の仮実装**
   - 空配列で初期化、必要に応じて多言語対応時に実装
   
2. **isTranslated の仮実装**
   - false で固定、多言語対応時に適切な判定ロジックを実装
   
3. **env プロパティの拡張**
   - logo, previewSite, googleSearch, searchAll, langSelector の設定確認・追加

### Phase 3: エラーハンドリング
1. 必須プロパティの型安全性確保
2. デフォルト値の適切な設定
3. エラー時のフォールバック処理

## 作業手順

### Step 1: env設定の確認と拡張
- `src/lib/env.ts` の `buildEnvConfig` 関数を確認
- 不足している環境変数設定を追加

### Step 2: page オブジェクトの拡張
- PageLayout.astro の pageData に不足プロパティを追加
- 仮実装として適切なデフォルト値を設定

### Step 3: Header コンポーネントの統合
- import文の追加
- プレースホルダーの置換
- プロパティの受け渡し

### Step 4: 動作確認と調整
- コンパイルエラーの解消
- 実際の表示確認
- 必要に応じて型定義の調整

## リスク要因

### 1. 依存コンポーネントの未実装
- SearchBox.astro の動作状況
- LangSelector.astro の動作状況

### 2. 環境変数の不足
- Logo パス、検索設定等の環境変数が未設定の可能性

### 3. 型の不整合
- Header.astro の Props 型定義と実際の受け渡しデータの不一致

## 成功基準

1. PageLayout.astro から Header.astro コンポーネントが正常に呼び出される
2. TypeScript の型エラーが発生しない
3. Header の基本機能（ロゴ、検索ボックス等）が表示される
4. 既存の Header.astro の機能が破綻しない

## 注意事項

- Header.md の TODO項目（scratch.sitename等）は本作業では対応せず、将来のタスクとして残す
- 多言語関連機能（allTranslations, isTranslated）は仮実装に留める
- 段階的な実装により、部分的な機能不全があっても基本統合を優先する