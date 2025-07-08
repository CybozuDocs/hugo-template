# Hugo から Astro へのマイグレーションルール

## 概要

このドキュメントは、Hugo テンプレートから Astro コンポーネントへの移行作業時に守るべきルールと注意点を記録します。

## 重要なマイグレーション制約（最優先ルール）

### 破壊的変更の禁止

**最重要**: 既存の構造やDOM構造を勝手に変更することは基本的に禁止です。

#### 厳守事項
- **独自判断での構造変更禁止**: 仮に一時的な実装だとしても、既存の構造を変更してはいけません
- **事前確認必須**: 構造変更が必要な場合は、必ずユーザーに確認を取ってください
- **許可なしでの変更禁止**: 許可が取れない限り、そういった対応は禁止です

#### 具体例
```astro
<!-- ❌ 禁止: 既存のTreeNavMainMenu呼び出しを勝手に変更 -->
{entries.map((entry) => (
  <li><a href={entry.relPermalink}>{entry.title}</a></li>
))}

<!-- ✅ 正しい: 既存構造を保持 -->
{entries.map((entry) => (
  <TreeNavMainMenu curnode={entry} target={page} />
))}
```

#### 変更が許可される場合
1. ユーザーから明示的に指示された場合
2. 事前に確認を取り、許可を得た場合
3. 既存機能の完全な保持が保証される場合

#### 違反時の対応
- 即座に元の構造に戻す
- 変更理由を明確に記録
- 再発防止策を実装

## FrontMatter内コンポーネント文字列の置換

### 自動置換処理

FrontMatter内のコンポーネント風文字列（`<ComponentName />`）は、page.tsで自動的に実際のenv値に置換されます。

#### 対応コンポーネント（8つ）

以下のコンポーネントのみが自動置換の対象です：

```typescript
// 対応コンポーネント一覧
Kintone: "kintone",                       // <Kintone /> → env.kintone
CybozuCom: "cybozuCom",                   // <CybozuCom /> → env.cybozuCom
Store: "store",                           // <Store /> → env.store
Slash: "slash",                           // <Slash /> → env.slash
SlashUi: "slashUi",                       // <SlashUi /> → env.slashUi
Service: "service",                       // <Service /> → env.service
SlashAdministrators: "slashAdministrators", // <SlashAdministrators /> → env.slashAdministrators
SlashHelp: "slashHelp",                   // <SlashHelp /> → env.slashHelp
```

#### 置換対象フィールド

- `title`
- `description` 
- `aliases`（配列内の各要素）
- その他の文字列フィールド

#### 未対応コンポーネントの扱い

**対象外のコンポーネント風文字列は無視され、そのまま表示されます。**

```yaml
# 例：意図的なコンポーネント風文字列
title: "React component <Yeah /> の使い方"
description: "<CustomComponent /> を活用しよう"
```

これらは置換されず、そのまま表示されます：
- `React component <Yeah /> の使い方`
- `<CustomComponent /> を活用しよう`

#### エラーハンドリング

**対応済みコンポーネントでenv値が未設定の場合、ビルドエラーとなります：**

```bash
# env.kintoneが未設定の場合
Error: Environment value not set for component 'Kintone' (env key: 'kintone')
```

これにより設定ミスを即座に検知できます。

#### 使用例

```yaml
---
title: "<Kintone /> の基本操作"           # → "kintone の基本操作"
description: "<Service /> ヘルプ"        # → "cybozu.com ヘルプ"  
labels:
  - "<Store />"                         # → "サイボウズドットコム ストア"
  - "<Yeah />"                          # → "<Yeah />" (そのまま)
---
```

#### 実装ファイル

- `src/lib/component-mapping.ts`：コンポーネントとenv値のマッピング、対応チェック
- `src/lib/frontmatter-replacer.ts`：置換処理のロジック
- `src/lib/page.ts`：FrontMatter読み込み時の置換適用

## Partials移行時の重要ルール

### 1. コンポーネント名の対応規則

Hugoのpartial名とAstroコンポーネント名は正確に対応させる：

- `disclaimer2.html` → `Disclaimer2.astro`
- `pagenav.html` → `PageNav.astro`
- スペースがある場合は除去: `[PAGE NAV PARTIAL]` → `pagenav.html`

### 2. DOM構造の厳密な保持

**最重要ルール**: 元のHTML構造を正確に再現し、勝手な文言追加は禁止

```astro
<!-- ❌ 間違い: 勝手な文言追加 -->
<Wovn>翻訳に関する免責事項</Wovn>

<!-- ✅ 正しい: 元の構造を保持 -->
<div id="disclaimer2" class="disclaimer-note">
</div>
```

### 3. templateVersionの扱い

- templateVersion=2のみ存在するため、バージョン分岐は不要
- Footer2.astroは標準のFooter.astroとして扱う

### 4. product と templateVersion の固定化ルール

**2025年1月から適用**: templateVersionとproductは固定値として扱う

- `templateVersion`: 常に"2"として扱い、条件分岐を削除
- `product`: 常に"kintone"として扱い、他製品の処理を削除
- 環境変数 `PUBLIC_TEMPLATE_VERSION`, `PUBLIC_PRODUCT` は使用禁止
- 型定義にも含めない（EnvProps, ImportMetaEnv等）

#### 削除対象の処理

```astro
<!-- ❌ 削除対象: templateVersion条件分岐 -->
{env.templateVersion === "2" && (
  <button>...</button>
)}

<!-- ✅ 修正後: 常に表示 -->
<button>...</button>

<!-- ❌ 削除対象: product条件分岐 -->
{env.product === "kintone" && <Component />}
{["Garoon", "Mailwise", "Office", "Remote"].includes(env.product) && <Component />}

<!-- ✅ 修正後: kintone前提の処理のみ -->
<Component />
```

#### 削除対象の製品

以下の製品に関する処理はすべて削除：

- Garoon
- Mailwise  
- Office
- Remote
- support_guide
- store系製品

## 移行作業の基本原則

### 1. 段階的アプローチ

- プレースホルダーとして基本実装を行い、後から機能を追加
- 複雑なコンポーネントは分割して移行

### 2. 変更記録の徹底

各コンポーネントの移行時には必ず `.md` ファイルを作成：

```markdown
# {ComponentName} 変更記録

元ファイル: `layouts/partials/{filename}.html`

## 関数・変数の置換

| Hugo | Astro | 備考 |
|------|-------|------|

## TODO

- [ ] 未実装機能

## 構造の変化

## その他の差分

## 外部依存

## 注意事項
```

### 3. 型安全性の確保

- すべてのコンポーネントでPropsの型定義を実装
- TypeScript interfaceを使用して型安全性を保証

## Hugo特有の構文の変換規則

### 1. テンプレート関数

```
{{ define "name" }} → 個別のAstroコンポーネントとして分離
{{ template "name" . }} → <ComponentName {props} />
{{ partial "name" . }} → <ComponentName {props} />
```

### 2. 変数参照

```
$.Site.Params.xxx → env.xxx
.Params.xxx → page.params.xxx
.Site.xxx → env.xxx
```

### 3. 制御構文

```
{{ if condition }} → {condition && (...)}
{{ range .Items }} → {items.map(item => (...))}
{{ with .Variable }} → {variable && (...)}
```

## 移行時の確認事項

### 必須チェックリスト

- [ ] 元のHTML構造が保持されているか
- [ ] 文言の勝手な追加がないか
- [ ] TypeScript型定義が適切か
- [ ] 変更記録ファイルを作成したか
- [ ] TODOコメントを適切に記載したか

### 移行困難な要素の扱い

1. **属性内のi18n**: `i18n__todo__` プレフィックスを付けて後回し
2. **複雑な再帰処理**: 専用の設計を検討
3. **外部API連携**: 環境変数経由で設定

## ドキュメント更新ルール

### 作業開始時

1. `migration-docs/{4桁の連番}_{作業名}/` ディレクトリを作成
2. `plan.md` に詳細な実行計画を記載
3. Todoリストに必要なタスクを登録

### 作業中

- 重要な発見や課題は随時 `migrate-memo.md` に記録
- 新しいルールが確立されたら `migrate-rules.md` に追加

### 作業完了時

1. `prompt.md` に作業履歴を作成
2. `migrate-memo.md` を更新（概要、学習事項、課題）
3. `migrate-rules.md` を更新（新ルール）
4. `rules.md` を更新（Astro開発の永続的ルール）

## 環境変数変換ルール

### Toml から Astro環境変数への変換

#### 基本変換規則

```
Hugo Toml → Astro 環境変数
baseurl → PUBLIC_BASE_URL
params.template_version → PUBLIC_TEMPLATE_VERSION
params.product → PUBLIC_PRODUCT
params.domain → PUBLIC_DOMAIN
params.kintone → PUBLIC_KINTONE
```

#### 機能フラグの変換

```
params.langSelector → PUBLIC_LANG_SELECTOR
params.meganav → PUBLIC_MEGANAV
params.json_tree → PUBLIC_JSON_TREE
params.use_wovn → PUBLIC_USE_WOVN
params.google_search → PUBLIC_GOOGLE_SEARCH
params.bing_search → PUBLIC_BING_SEARCH
```

#### 言語別設定の変換

```
languages.ja.params.product_name → PUBLIC_PRODUCT_NAME_JA
languages.en.params.help → PUBLIC_HELP_EN
languages.zh.params.* → PUBLIC_*_ZH
languages.zh-tw.params.* → PUBLIC_*_ZH_TW
```

#### JSON配列の扱い

```
params.label_colors → PUBLIC_LABEL_COLORS (JSON文字列として保持)
params.google_search_tabs → PUBLIC_GOOGLE_SEARCH_TABS_* (言語別)
```

### 地域・環境別設定の注意点

#### 中国 (CN)
- Bing検索を使用
- cybozu.cnドメイン・サービス
- 多言語対応（4言語）

#### 日本 (JP)
- Google検索を使用
- cybozu.comドメイン・サービス
- ラベル色設定あり

#### アメリカ (US)
- メガナビゲーション有効
- Kintoneブランディング（大文字K）
- サポート問い合わせURL設定

#### ステージング環境
- WOVN設定有効
- 異なるベースURL
- 一部本番と異なる言語設定

## 多リージョン・単一言語設定の管理

### 環境変数の簡素化ルール

リージョンを維持しつつ言語は日本語に統一し、環境変数管理を簡素化：

#### 言語接尾辞の整理

```
# 旧設定（多言語対応）
PUBLIC_PRODUCT_NAME_JA=kintone
PUBLIC_HELP_JA=ヘルプ

# 新設定（日本語特化）
PUBLIC_PRODUCT_NAME=kintone
PUBLIC_HELP=ヘルプ
```

#### リージョン設定の維持と言語設定の統一

- **リージョンファイルの有効化**: .env.us, .env.cn 等を有効な状態で維持
- **言語設定のコメントアウト**: 各ファイル内の英語・中国語設定のみコメントアウト
- **リージョン固有設定の保持**: ドメイン、ブランディング、機能フラグは各リージョンで維持

```bash
# .env.us （アメリカリージョン）
# リージョン設定は有効
PUBLIC_BASE_URL=https://get.kintone.help/k/
PUBLIC_TARGET_REGION=US
PUBLIC_KINTONE=Kintone  # アメリカブランディング
PUBLIC_MEGANAV=true     # アメリカ固有機能

# 言語設定は日本語に統一
PUBLIC_DEFAULT_CONTENT_LANGUAGE=ja
PUBLIC_LANGUAGE_CODE=ja-jp
PUBLIC_PRODUCT_NAME=Kintone  # _JA接尾辞を削除
PUBLIC_HELP=ヘルプ

# 他言語設定はコメントアウト
# PUBLIC_PRODUCT_NAME_EN=Kintone
# PUBLIC_HELP_EN=Help
```

#### env.ts の簡素化

```typescript
// 削除: 多言語対応関数
export const getLocalizedEnvValue = (key: string, langCode: string) => {
  // ... 複雑な言語判定ロジック
};

// 変更: 直接環境変数参照
export const buildEnvConfig = () => {
  return {
    productName: import.meta.env.PUBLIC_PRODUCT_NAME || '',
    help: import.meta.env.PUBLIC_HELP || '',
    // ...
  };
};
```

### 多リージョン・単一言語アーキテクチャのメリット

1. **リージョン特化の維持**: 各市場固有のビジネスロジックを保持
2. **言語コードの簡素化**: 言語分岐処理の削除
3. **メンテナンス性の向上**: 必要な設定のみ管理
4. **パフォーマンスの向上**: 不要な言語判定処理の削除
5. **スケーラビリティ**: 新しいリージョン追加が容易
6. **間違いの減少**: 複雑な設定でのヒューマンエラーを防止

## CSVファイル読み込みルール

### 1. ファイル配置規則

CSVファイルは `src/pages/_data/csv/` 配下に配置し、リージョン別に管理：

```
src/pages/_data/csv/
├── links.JP.csv  - 日本リージョン用
├── links.US.csv  - アメリカリージョン用
└── links.CN.csv  - 中国リージョン用
```

### 2. CSV読み込み実装パターン

```typescript
// env.targetRegionに基づく動的ファイルパス
const csvPath = `/src/pages/_data/csv/links.${env.targetRegion}.csv`;
const csvContent = await import(/* @vite-ignore */ csvPath + '?raw');

// CSVパース処理
const lines = csvContent.default.split('\n');
const footerData = lines
  .filter((line: string) => line.trim())
  .map((line: string) => {
    // カンマ区切りパース（クォート対応）
    // ...
  });
```

### 3. CSVデータ処理ルール

#### データ分類ルール
- **ID=999**: リーガルメニュー（法的リンク）
- **ID=1-4**: メガメニュー（カテゴリ別）
- **フィールド構成**: カテゴリID, テキスト, URL, ステータス/target

#### エラーハンドリング
- CSVファイル読み込みエラーは適切にキャッチし、コンソール警告を出力
- データが存在しない場合は空配列でフォールバック

## Props型定義統一化ルール

### 1. BaseProps使用の必須化

**ルール**: 独自の環境設定が不要なコンポーネントは必ずBasePropsを使用する

```typescript
// ❌ 独自env型定義は禁止
interface Props {
  env: {
    baseURL: string;
    languageCode: string;
    // ...
  };
  page: {
    isHome: boolean;
    // ...
  };
}

// ✅ BasePropsを使用
import type { BaseProps } from './types';

interface Props extends BaseProps {}
```

### 2. 独自プロパティが必要な場合の判断基準

以下の場合のみカスタムProps定義を許可：

- コンポーネント固有のプロパティがある場合（例：BreadcrumbNav.astroのp1, p2）
- 特殊なPage型が必要な場合（例：LangSelector.astroのtranslations）
- 第三者によるコンポーネント固有パラメータ（例：VideoNav.astroのtags）

```typescript
// ✅ 独自プロパティありの場合
interface Props {
  cursect: PageProps;  // 独自プロパティ
  env: EnvProps;       // EnvPropsは使用可能
}

// ✅ 特殊なPage型の場合
interface Props extends BaseProps {
  // BasePropsを継承しつつ独自のpage型定義
}
```

### 3. 型統一化の確認方法

Props定義変更後は必ずビルドテストを実行：

```bash
npm run build
```

型エラーがないことを確認してから作業完了とする。

### 4. 既存の良い実装パターンの維持

以下のコンポーネントは既に適切な型設計されており、参考とする：

- **TreeNavMainMenu.astro**: EnvPropsと独自プロパティの組み合わせ
- **BreadcrumbNav.astro**: 特殊なプロパティ構造の実装
- **MegaNavGrMegaPanel.astro**: 階層データの適切な型定義

### 5. 型定義の保守性向上効果

統一化により以下の効果を期待：

- 環境変数変更時の影響範囲の明確化
- 型安全性の向上
- コンポーネント間の一貫性確保
- 重複コードの削除

### 6. Props最適化による簡素化ルール

**ルール**: 使用していないPropsは積極的に削除し、コンポーネントを簡素化する

#### 削除対象の判断基準
- Props定義はしているが、実際のDOM構造やロジックで使用していない
- BasePropsを継承しているが、pageやenvを使用していない
- 型定義のみ存在し、実装で参照されていない

#### 最適化パターン
```typescript
// ❌ 最適化前: 不要なProps定義
interface Props extends BaseProps {}
const { page } = Astro.props;

// ✅ 最適化後: 必要なもののみ
import { env } from "@/lib/env";
// Props定義なし
```

#### 適用例
- **SupportInquiry.astro**: BaseProps完全削除（Props不要）
- **Enquete.astro**: BaseProps削除、envのみ直接import
- **LocaleModal.astro**: BaseProps完全削除（最大限簡素化、条件分岐は親で処理）

### 7. 地域限定機能の実装ルール

**ルール**: 地域限定機能は親コンポーネントで条件分岐し、子コンポーネントは最大限シンプル化する

#### 実装パターン
```astro
<!-- ✅ 正しい: 親コンポーネント側で条件分岐 -->
{env.targetRegion === "US" && <LocaleModal />}

<!-- ❌ 間違い: 子コンポーネント内で条件分岐 -->
// LocaleModal.astro内で env.targetRegion 判定
```

#### 地域限定機能の特徴
- アメリカリージョン限定: LocaleModal、SupportInquiry
- 中国リージョン限定: Bing検索、cybozu.cn設定
- 日本リージョン限定: ラベル色設定、Google検索

#### 最適化効果
- 子コンポーネントの完全な地域非依存化
- 条件ロジックの一元管理
- Props削除による性能向上

### 8. コンポーネント内条件判定パターン

**ルール**: 環境変数に依存する表示条件はコンポーネント内部で判定可能

#### 実装パターン（2025年1月追加）
```astro
<!-- ArticleLink.astro/ArticleNumber.astro の例 -->
---
import { env } from "@/lib/env";

interface Props {
  aliases: string[];
  // 必要最小限のプロパティのみ
}

const { aliases } = Astro.props;

// コンポーネント内部で条件判定
if (!env.idSearch || aliases.length === 0) {
  return null;
}
---
```

#### 親コンポーネントの簡素化
```astro
<!-- 修正前: 親で条件判定 -->
{env.idSearch && currentPage.frontmatter.aliases.length > 0 && (
  <ArticleLink page={currentPage} />
)}

<!-- 修正後: 無条件で呼び出し -->
<ArticleLink 
  aliases={currentPage.frontmatter.aliases}
  relPermalink={currentPage.relPermalink}
  fileContentBaseName={currentPage.fileContentBaseName}
/>
```

#### 適用基準
- 環境変数による表示制御が必要な場合
- データの存在チェックが必要な場合
- コンポーネントの責任範囲内の条件判定

## env 管理の大規模リファクタリングルール

### 1. env のグローバル化原則

**ルール**: Props によるバケツリレーを避け、必要に応じて直接 import する

```typescript
// ❌ 旧方式: Props でのバケツリレー
interface Props extends BaseProps {
  env: EnvProps;
  page: PageProps;
}
const { env, page } = Astro.props;

// ✅ 新方式: 直接 import
import { env } from "@/lib/env";
interface Props extends BaseProps {
  page: PageProps;
}
const { page } = Astro.props;
```

### 2. env.ts の実装パターン

```typescript
// buildEnvConfig を内部で呼び出し
export const env: Readonly<EnvConfig> = buildEnvConfig();

// 外部からは env のみをエクスポート
// buildEnvConfig は直接呼び出し禁止
```

### 3. 大規模リファクタリング時の注意点

#### 段階的実行の重要性
1. env.ts の修正（グローバルインスタンス作成）
2. 全コンポーネントの型定義修正
3. Props 削除と import 追加
4. PageLayout の修正（最終段階）

#### 型定義の整合性確保
- BaseProps から env プロパティを削除
- カスタム Props 定義からも env を削除
- 一貫した import パターンの適用

#### 品質確保
- 各段階でのビルドテスト実行
- 型エラーの段階的解消
- 既存機能の完全保持

### 4. コンポーネント間の依存関係変更

```astro
<!-- ❌ 旧方式: env props の連鎖 -->
<PageLayout>
  <Header env={env} page={page}>
    <SearchBox env={env} page={page} />
  </Header>
</PageLayout>

<!-- ✅ 新方式: 各コンポーネントで直接 import -->
<PageLayout>
  <Header page={page}>
    <SearchBox page={page} />
  </Header>
</PageLayout>
```

### 5. リファクタリングの効果と検証

#### 期待される効果
- Props バケツリレーの完全解消
- コンポーネント独立性の向上
- 保守性とコードの可読性向上
- 環境変数変更時の影響範囲明確化

#### 検証方法
- ビルドテストによる構文エラー確認
- 型チェックによる型安全性確認
- 既存機能の動作確認

## Astro.globとimport.meta.globの使い分けルール

### import.meta.globの推奨

**ルール**: Astro.globは非推奨のため、import.meta.globを使用する

```typescript
// ❌ 非推奨: Astro.glob（将来削除予定）
const pages = await Astro.glob('/src/pages/**/*.{md,mdx,astro}');

// ✅ 推奨: import.meta.glob
const modules = import.meta.glob('/src/pages/**/*.{md,mdx,astro}', { eager: true });
const pages = Object.entries(modules);
```

### 実装時の注意点

#### 型安全性の確保
- any型の使用は完全に禁止
- フロントマターの型キャストは適切に実施
- Record<string, unknown>による安全な型定義

```typescript
// ✅ 正しい型安全な実装
const frontmatter = (module as { frontmatter?: Record<string, unknown> }).frontmatter || {};
const title = (frontmatter.title as string) || '無題';
const weight = (frontmatter.weight as number) || 0;
```

#### コンポーネントの自己参照

再帰的なコンポーネントではAstro.selfを使用：

```astro
<!-- ❌ インポートエラーが発生 -->
import TreeNavMainMenu from './TreeNavMainMenu.astro';
<TreeNavMainMenu curnode={entry} target={target} />

<!-- ✅ Astro.selfで自己参照 -->
<Astro.self curnode={entry} target={target} />
```

## WOVN統合による翻訳関連プロパティ削除ルール

### Hugo多言語機能からWOVN統合への移行

**ルール**: WOVN翻訳サービス利用により、Hugo固有の翻訳機能は全て削除対象

#### 削除対象のプロパティ
- `page.isTranslated`: 翻訳先コンテンツの有無判定（WOVN使用により不要）
- `page.siteLanguage`: FW側の言語設定（WOVN初期化により不要）
- `page.allTranslations`: 全翻訳バージョンの一覧（WOVN使用により不要）
- `page.translations`: 翻訳リンク情報（WOVN使用により不要）
- `scratch.sitename`: サイト名（利用箇所なしで削除）

#### 削除理由
- **WOVN外部サービス委譲**: 翻訳状態管理をWOVNサービスに委譲
- **FW負荷削減**: フレームワーク側での言語処理が不要
- **アーキテクチャ簡素化**: Hugo多言語システムの完全除去

#### 対応パターン
```astro
<!-- ❌ 削除対象: Hugo翻訳機能の使用 -->
{page.isTranslated && <div>翻訳あり</div>}
{page.allTranslations.map(...)}
{page.siteLanguage === 'ja' && <Component />}

<!-- ✅ 修正後: WOVN前提またはリージョン判定 -->
{env.targetRegion === 'JP' && <Component />}
<Wovn>i18n__translatable_text</Wovn>
```

#### PageLayoutでの実装変更
- 独自pageDataオブジェクトの削除
- 翻訳関連プロパティ設定の除去
- WOVN統合を前提とした設計への統一

## マークダウン画像記法から Img コンポーネントへの変換ルール

### 基本変換パターン

Hugo のマークダウン画像記法を Astro の `<Img>` コンポーネントに変換する際の統一ルール：

```markdown
<!-- ❌ 変換前: マークダウン記法 -->
![alt属性のテキスト](/path/to/image.png)

<!-- ✅ 変換後: Imgコンポーネント -->
<Img src="/path/to/image.png" alt="alt属性のテキスト" />
```

### 必須作業

1. **import文の追加**: 各MDXファイルに `import Img from "@/components/Img.astro";` を追加
2. **全置換実行**: ファイル内の全ての `![alt](src)` パターンを `<Img src="..." alt="..." />` に変換

### リスト項目内での使用時の重要な注意点

**最重要**: リスト項目内で `<Img>` コンポーネントを使用する場合、適切なインデントが必須

#### インデントルール

- **番号付きリスト** (`1. `): 3つのスペースでインデント
- **箇条書きリスト** (`- `): 2つのスペースでインデント  
- **ルール**: リスト項目のマーカー文字数に合わせてスペース数を調整

#### 正しいインデント例

```markdown
<!-- ✅ 正しい: 番号付きリスト -->
1. テキスト
   <Img src="/k/img-ja/sample.png" alt="ALTテキスト" />
   説明テキスト

<!-- ✅ 正しい: 箇条書きリスト -->
- テキスト
  <Img src="/k/img-ja/sample.png" alt="ALTテキスト" />
  説明テキスト
```

#### 間違ったインデント例

```markdown
<!-- ❌ 間違い: インデント不足 -->
1. テキスト
  <Img src="/k/img-ja/sample.png" alt="ALTテキスト" />
  説明テキスト
```

**問題**: インデントが不正だとリスト内項目として認識されず、Markdown構造が破綻する

### title属性の扱い

マークダウン記法で title 属性が指定されていた場合は適切に変換：

```markdown
<!-- 変換前: title属性あり -->
![alt text](/path/image.png "タイトル")

<!-- 変換後: titleプロパティで指定 -->
<Img src="/path/image.png" alt="alt text" title="タイトル" />
```

### 変換時のチェック項目

- [ ] 全ての `![alt](src)` パターンが変換済み
- [ ] import文が適切に追加済み
- [ ] リスト項目内の画像インデントが正しい
- [ ] ビルドエラーが発生しない
- [ ] DOM構造が維持されている

## 更新履歴

- 2025年1月 - 初版作成（rules.mdから移行関連情報を分離）
- 2025年1月 - 環境変数変換ルールを追加
- 2025年1月 - 多リージョン・単一言語設定の管理ルールを追加
- 2025年1月 - CSVファイル読み込みルールを追加
- 2025年1月 - Props型定義統一化ルールを追加
- 2025年1月 - env管理の大規模リファクタリングルールを追加
- 2025年1月 - Astro.globとimport.meta.globの使い分けルールを追加
- 2025年1月 - getCurrentPage()活用によるページデータ統一ルールを追加
- 2025年1月 - WOVN統合による翻訳関連プロパティ削除ルールを追加
- 2025年1月 - マークダウン画像記法からImgコンポーネントへの変換ルールを追加

## getCurrentPage() 活用によるページデータ統一ルール

### 1. pageData独自作成の禁止

**ルール**: ページレイアウトコンポーネントでの独自pageDataオブジェクト作成を避け、getCurrentPage()の結果を活用する

```typescript
// ❌ 禁止: 独自pageData作成
const pageData = {
  isHome: isHomePage(Astro.url.pathname),
  title: frontmatter.title || "",
  // ... 独自実装
};

// ✅ 推奨: getCurrentPage()結果の活用
const currentPage = getCurrentPage(Astro, sections);
const pageData = {
  ...currentPage,
  // 必要な追加プロパティのみ補完
};
```

### 2. FrontMatterデータのgetCurrentPage()経由取得

**ルール**: disabled, aliases, labels, type, weight等のFrontMatterデータは、Propsではなくgetcurrpage()結果から取得する

```typescript
// ❌ 旧方式: Props経由での取得
type Props = MarkdownLayoutProps<{}> & {
  disabled?: string[];
  aliases?: string[];
  labels?: string[];
};

// ✅ 新方式: getCurrentPage()結果からの取得
const currentPage = getCurrentPage(Astro, sections);
const disabled = currentPage.params.disabled as string[] || [];
const aliases = currentPage.aliases || [];
const labels = currentPage.params.labels as string[] || [];
```

### 3. PageProps型統一の維持

**ルール**: ページデータの型はPagePropsに統一し、コンポーネント間での一貫性を保つ

```typescript
// ✅ PageProps型に必要なプロパティを追加
export interface PageProps {
  type?: string;
  aliases?: string[];
  params: {
    disabled?: string[];
    labels?: string[];
    [key: string]: any;
  };
}
```

### 4. データソース一元化の維持

**効果**: 
- 重複実装の削除
- 型安全性の向上
- 保守性の改善
- 一貫性のあるアーキテクチャ