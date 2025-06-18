# Breadcrumb 変更記録

元ファイル: `layouts/partials/breadcrumb.html`

## 実装概要

PageLayout.astro の `[BREADCRUMB PARTIAL]` プレースホルダーを実際の Breadcrumb.astro コンポーネント呼び出しに置き換え、パンくずリスト機能を実装しました。

## 対応したコンポーネント

### 主要なコンポーネント
- **Breadcrumb.astro**: 既存実装を活用
- **BreadcrumbNav.astro**: Hugo の breadcrumbnav テンプレートに対応
- **Title.astro**: Hugo の title partial に対応
- **ApplyParams.astro**: Hugo の applyparams partial に対応

### PageLayout.astro の変更

#### インポートの追加
```typescript
import { getCurrentPage, getSiteHomeSections } from "../lib/page";
import Breadcrumb from "./components/Breadcrumb.astro";
```

#### セクション情報取得とページ特定
```typescript
// サイトのセクション情報を取得
const sections = await getSiteHomeSections();

// 現在ページを特定（Breadcrumb用）
let currentPage;
try {
  currentPage = getCurrentPage(Astro, sections);
} catch (error) {
  // ページが見つからない場合はpageDataをフォールバックとして使用
  currentPage = null;
}
```

#### プレースホルダーの置換
```astro
<!-- 変更前 -->
<div>[BREADCRUMB PARTIAL]</div>

<!-- 変更後 -->
{currentPage && <Breadcrumb page={currentPage} />}
```

## Hugo構文の置換

| Hugo | Astro | 備考 |
|------|-------|------|
| `{{ template "breadcrumbnav" (dict "p1" . "p2" .) }}` | `<BreadcrumbNav p1={page} p2={page} />` | 再帰的パンくず生成 |
| `{{ i18n "Bread_crumb" }}` | `aria-label="i18n__todo__Bread_crumb"` | 属性内i18n（TODO） |
| `{{ i18n "Top_page" }}` | `<Wovn>i18n__Top_page</Wovn>` | WOVN翻訳サービス |
| `{{ partial "title" .p1 }}` | `<Title page={item} />` | タイトル表示コンポーネント |
| `.Parent` | `page.parent` | 親ページ参照 |
| `.RelPermalink` | `page.relPermalink` | 相対パーマリンク |
| `.IsHome` | `page.isHome` | ホームページ判定 |

## BreadcrumbNav.astro の改善

### ホームページリンクの対応
```astro
{item.isHome ? (
  <Wovn>i18n__Top_page</Wovn>
) : (
  <Title page={item} />
)}
```

### 製品固定化による簡素化
- product="kintone" 固定により Garoon 等の分岐処理を削除
- templateVersion="2" 固定により古いバージョン対応を削除

## Title.astro の修正

### プロパティ名の修正
```typescript
// 修正前
if (env.targetRegion === "US" && page.params.titleUs) {
  target = page.params.titleUs;
}

// 修正後  
if (env.targetRegion === "US" && page.params.title_us) {
  target = page.params.title_us as string;
}
```

## 外部依存

### 必要なコンポーネント
- `Wovn.astro`: WOVN翻訳サービスラッパー
- `ApplyParams.astro`: パラメータ置換処理

### 必要な関数
- `getCurrentPage()`: 現在ページの特定
- `getSiteHomeSections()`: サイトセクション情報取得

## DOM構造の保持

Hugo の breadcrumb.html と同等の DOM 構造を維持：
```html
<nav class="breadcrumb" role="navigation" aria-label="...">
  <ul class="breadcrumbs">
    <li>
      <a href="...">...</a>
    </li>
    <!-- 現在ページ（リンクなし） -->
    <li>
      ...
    </li>
  </ul>
</nav>
```

## TODO

- [ ] aria-label の i18n 対応（`i18n__todo__Bread_crumb`）
- [ ] lib/params.js の実装（現在はApplyParamsで代替）

## テスト結果

- ✅ `npm run build` 成功（2.61秒）
- ✅ 型エラーなし
- ✅ DOM構造保持確認済み

## 注意事項

- 現在ページが取得できない場合、パンくずは表示されません
- page.ts の parent 関係設定が適切に動作することが前提
- ホームページでは「トップページ」として WOVN 翻訳が適用されます