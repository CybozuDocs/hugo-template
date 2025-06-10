# Hugo Partials から Astro Components への移植計画

## 概要

Hugo テンプレートの `layouts/partials/` 配下にある全てのパーシャルファイルを Astro コンポーネントに移植する計画書です。
成果物は `astro/` ディレクトリに出力します。

## 移植ポリシー

### 1. i18n 関数の扱い

WOVN という外部サービスでの翻訳に切り替えます。

#### Wovn コンポーネント

```astro
---
// Wovn.astro
interface Props {
  langCode?: string;
}
const { langCode } = Astro.props;
// TODO: langCode によって wv-brk wv-brk-en を切り替える
const className = langCode === 'en' ? 'wv-brk wv-brk-en' : 'wv-brk';
---
<span class={className}><slot /></span>
```

#### 変換ルール

- 通常の箇所: `{{ i18n "sample_key" }}` → `<Wovn>i18n__sample_key</Wovn>`
- aria-label など Wovn コンポーネントが使えない箇所: `{{ i18n "sample_key" }}` → `i18n__todo__sample_key`

#### 具体的な変換例

```html
<!-- Hugo -->
<button>{{ i18n "Contact_support"}}</button>
<button aria-label='{{i18n "search"}}'>
  <!-- Astro -->
  <button><Wovn>i18n__Contact_support</Wovn></button>
  <button aria-label="i18n__todo__search"></button>
</button>
```

### 2. Hugo のサイト変数とパラメータ

全ての Hugo サイト変数は `env` プロパティでまとめて受け取ります。

#### 変換例

- `$.Site.Params.product` → `env.product`
- `$.Site.BaseURL` → `env.baseURL`
- `.Site.LanguageCode` → `env.languageCode`
- `.Site.Params.TargetRegion` → `env.targetRegion`
- `.Site.Params.template_version` → `env.templateVersion`
- `.Site.Params.meganav` → `env.meganav`
- `.Site.Params.preview_site` → `env.previewSite`
- `.Site.Params.google_search` → `env.googleSearch`
- `.Site.Params.bing_search` → `env.bingSearch`
- `.Site.Params.langSelector` → `env.langSelector`
- `.Site.Params.use_wovn` → `env.useWovn`
- `.Site.Params.data_wovnio` → `env.dataWovnio`

#### Site.Home の扱い

- `.Site.Home` → `env.siteHome`
- `.Site.Home.Sections` → `env.siteHomeSections`

### 3. Hugo のページ変数

ページ情報を含むオブジェクトを `page` プロパティとして受け取ります。

#### 変換例

- `.CurrentSection` → `page.currentSection`
- `.Parent` → `page.parent`
- `.FirstSection` → `page.firstSection`
- `.IsHome` → `page.isHome`
- `.RelPermalink` → `page.relPermalink`
- `.Title` → `page.title`
- `.Params` → `page.params`
- `.IsSection` → `page.isSection`
- `.IsAncestor` → `page.isAncestor(target)`
- `.Pages` → `page.pages`
- `.Sections` → `page.sections`
- `.Weight` → `page.weight`
- `.Content` → `page.content`
- `.Description` → `page.description`
- `.Type` → `page.type`
- `.Lang` → `page.lang`
- `.AllTranslations` → `page.allTranslations`
- `.IsTranslated` → `page.isTranslated`
- `.Translations` → `page.translations`
- `.File.ContentBaseName` → `page.fileContentBaseName`
- `.Aliases` → `page.aliases`

#### ページ関係の関数

- `.NextInSection` → `page.nextInSection`
- `.PrevInSection` → `page.prevInSection`
- `.Site.Pages.Next` → `page.siteNext`
- `.Site.Pages.Prev` → `page.sitePrev`

### 4. Hugo のコレクション操作

JavaScript の配列メソッドで実装します。

#### 変換例

- `.Pages.ByWeight` → `pages.sort((a, b) => a.weight - b.weight)`
- `union` → `[...array1, ...array2]` または `Array.from(new Set([...array1, ...array2]))`
- `where .Site.RegularPages "Section" ""` → `regularPages.filter(p => p.section === "")`
- `first 5` → `slice(0, 5)`
- `len` → `.length`
- `add` → `+`
- `sub` → `-`
- `index` → `array[index]`
- `range` → `Array.from({ length: n }, (_, i) => i)`
- `seq` → `Array.from({ length: n }, (_, i) => i + 1)`

### 5. Hugo のリソース管理

CSV や JSON ファイルはビルド時に静的に解決します。

#### 実装方法

```astro
---
// Astro のトップレベルで import
import csvData from '../data/icon_images.csv';
// または
const csvData = await import('../data/icon_images.csv');
---
```

#### CSV パース処理

Hugo の `transform.Unmarshal` に相当する処理を実装：

```javascript
// CSV を配列に変換
const parseCSV = (csvText, delimiter = ",") => {
  return csvText
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => line.split(delimiter));
};
```

### 6. Hugo のテンプレート機能

`define` / `template` は個別の Astro コンポーネントとして実装します。

#### 変換例

- `{{ define "mainmenu" }}` → 別ファイル `TreeNavMainMenu.astro` として実装
- `{{ template "mainmenu" ... }}` → `<TreeNavMainMenu ... />`
- `{{ block "main" . }}` → `<slot />` または名前付きスロット

### 7. partial の呼び出し

各パーシャルを Astro コンポーネントとして実装し、import して使用します。

#### 変換例

- `{{ partial "title" . }}` → `<Title page={page} env={env} />`
- `{{ partial "applyparams" (dict "target" $target "params" .Site.Params) }}` → `<ApplyParams target={target} params={env} />`

### 8. Hugo の文字列処理

JavaScript の文字列メソッドで実装します。

#### 変換例

- `strings.TrimPrefix "pid=\"" .` → `str.replace(/^pid="/, '')`
- `strings.TrimSuffix "\"" $anc` → `str.replace(/"$/, '')`
- `strings.TrimLeft "[" $paramfilter` → `str.replace(/^\[/, '')`
- `strings.TrimRight "]" $paramfilter` → `str.replace(/\]$/, '')`
- `strings.Trim $value "'"` → `value.replace(/^'|'$/g, '')`
- `split . " "` → `str.split(' ')`
- `replaceRE "{{<\\s*kintone\\s*>}}" $params.kintone $target` → `target.replace(/{{<\s*kintone\s*>}}/g, params.kintone)`
- `printf "%s %s" $var1 $var2` → `` `${var1} ${var2}` ``
- `safeHTML` → そのまま出力（Astro では自動的に安全）
- `relURL` → 相対 URL 処理関数を実装
- `hasPrefix` → `str.startsWith()`
- `hasSuffix` → `str.endsWith()`
- `strings.Count` → `(str.match(/pattern/g) || []).length`

### 9. Hugo の条件分岐とループ

JavaScript の制御構文と JSX の条件レンダリングを使用します。

#### 変換例

- `{{ range .Items }}` → `{items.map((item) => ())}`
- `{{ range $idx, $value := .Items }}` → `{items.map((value, idx) => ())}`
- `{{ if condition }}` → `{condition && ()}`
- `{{ if condition }}...{{ else }}...{{ end }}` → `{condition ? () : ()}`
- `{{ with .Variable }}` → `{variable && ()}`
- `{{ if eq .Type "value" }}` → `{type === "value" && ()}`
- `{{ if ne .Type "value" }}` → `{type !== "value" && ()}`
- `{{ if gt .Value 0 }}` → `{value > 0 && ()}`
- `{{ if ge .Value 0 }}` → `{value >= 0 && ()}`
- `{{ if lt .Value 0 }}` → `{value < 0 && ()}`
- `{{ if le .Value 0 }}` → `{value <= 0 && ()}`
- `{{ if and cond1 cond2 }}` → `{cond1 && cond2 && ()}`
- `{{ if or cond1 cond2 }}` → `{(cond1 || cond2) && ()}`
- `{{ if in .Array "value" }}` → `{array.includes("value") && ()}`

### 10. 外部スクリプトの扱い

必要に応じて `is:inline` ディレクティブを使用します。

#### 実装例

```astro
<script is:inline>
  // GTM, Zendesk, HubSpot などのスクリプト
</script>
```

#### 動的スクリプトの扱い

```astro
<!-- Hugo -->
<script src="https://www.gstatic.com/prose/brand.js" targetId="{{$logoplace}}" hl="{{$glang}}"></script>

<!-- Astro -->
<script is:inline src="https://www.gstatic.com/prose/brand.js" data-target-id={logoplace} data-hl={glang}></script>
```

### 11. Vue.js の使用箇所

Astro の動的な部分として実装します。

#### 変換例（videonav.html）

```html
<!-- Hugo -->
<li v-for="tag in tags" :key="tag.key">
  <input
    type="checkbox"
    v-bind:id="'video-filter-'+tag.key"
    v-on:click="changetag()"
  />
  <label v-bind:for="'video-filter-'+tag.key">[[tag.text]]</label>
</li>

<!-- Astro -->
{tags.map((tag) => (
<li key="{tag.key}">
  <input
    type="checkbox"
    id="{`video-filter-${tag.key}`}"
    onClick="{changetag}"
  />
  <label htmlFor="{`video-filter-${tag.key}`}">{tag.text}</label>
</li>
))}
```

### 12. 正規表現による HTML パース

- 呼び出し元のコンテンツに依存する場合: `headings` を Props で受け取る
- それ以外: 正規表現でパース

#### TOC 生成の例

```javascript
// Hugo の findRE に相当
const findHeadings = (content, regex) => {
  const matches = content.match(new RegExp(regex, "g")) || [];
  return matches;
};
```

### 13. Hugo 特有の変数・関数

#### Scratch の扱い

```javascript
// Hugo: .Scratch.Set "key" value
// Astro: let scratchData = {}; scratchData.key = value;

// Hugo: .Scratch.Get "key"
// Astro: scratchData.key

// Hugo: .Scratch.Add "count" 1
// Astro: scratchData.count = (scratchData.count || 0) + 1;
```

#### 日付処理

```javascript
// Hugo: now.Format "20060102"
// Astro: new Date().toISOString().slice(0, 10).replace(/-/g, '')
```

#### URL 処理

```javascript
// Hugo: urls.Parse $.Site.BaseURL
// Astro: new URL(env.baseURL)
```

## 変更記録ファイルの作成ルール

各 Astro コンポーネントと同じディレクトリに、同名の `.md` ファイルを作成して変更内容を記録します。

### ファイル名規則

- コンポーネント: `ComponentName.astro`
- 変更記録: `ComponentName.md`

### 記録する内容

#### 1. 関数・変数の置換対応表

```markdown
## 関数・変数の置換

| Hugo                    | Astro                    | 備考                  |
| ----------------------- | ------------------------ | --------------------- |
| `{{ i18n "key" }}`      | `<Wovn>i18n__key</Wovn>` | WOVN 対応             |
| `$.Site.Params.product` | `env.product`            | env プロパティに集約  |
| `.IsHome`               | `page.isHome`            | page プロパティに集約 |
```

#### 2. TODO リスト

```markdown
## TODO

- [ ] langCode によって wv-brk クラスを切り替える処理の実装
- [ ] CSV データの読み込み処理の最適化
- [ ] エラーハンドリングの追加
```

#### 3. 構造の変化

```markdown
## 構造の変化

### Hugo の define/template 分離

- `define "mainmenu"` → `TreeNavMainMenu.astro` として分離
- `define "treeitem"` → `TreeNavTreeItem.astro` として分離

### 条件分岐の変更

- Hugo の `with` による null チェック → JavaScript の `&&` 演算子
- Hugo の `range` → JavaScript の `map` 関数
```

#### 4. 細かい差分

```markdown
## その他の差分

### 属性名の変更

- `aria-hideen` → `aria-hidden` (タイポ修正)
- `for` → `htmlFor` (React/JSX 仕様)

### 空白・改行の扱い

- Hugo テンプレートの `{{-` と `-}}` による空白制御 → Astro では明示的に制御

### デフォルト値

- Hugo: `{{ .Params.value | default "default" }}`
- Astro: `const value = page.params.value || "default"`
```

#### 5. 外部依存の変更

```markdown
## 外部依存

### スクリプトの読み込み

- HubSpot スクリプト: `is:inline` ディレクティブを使用
- Google Tag Manager: 動的な値の渡し方を data 属性に変更

### CSS クラスの動的生成

- Hugo: `{{ if condition }}class-name{{ end }}`
- Astro: `className={condition ? 'class-name' : ''}`
```

### 記録ファイルのテンプレート

```markdown
# [コンポーネント名] 変更記録

元ファイル: `layouts/partials/[ファイル名].html`

## 関数・変数の置換

| Hugo | Astro | 備考 |
| ---- | ----- | ---- |
|      |       |      |

## TODO

- [ ]

## 構造の変化

###

## その他の差分

###

## 外部依存

###

## 注意事項

-
```

## 移植対象ファイル一覧

以下の 41 ファイルを移植します：

### 基本コンポーネント

1. `alternatelink.html` → `AlternateLink.astro` + `AlternateLink.md`
2. `anchorlink.html` → `AnchorLink.astro` + `AnchorLink.md`
3. `anchorlink2.html` → `AnchorLink2.astro` + `AnchorLink2.md`
4. `announcementbanner.html` → `AnnouncementBanner.astro` + `AnnouncementBanner.md`
5. `applyparams.html` → `ApplyParams.astro` + `ApplyParams.md`
6. `articlelink.html` → `ArticleLink.astro` + `ArticleLink.md`
7. `articlenumber.html` → `ArticleNumber.astro` + `ArticleNumber.md`
8. `breadcrumb.html` → `Breadcrumb.astro` + `Breadcrumb.md`
9. `disclaimer.html` → `Disclaimer.astro` + `Disclaimer.md`
10. `disclaimer2.html` → `Disclaimer2.astro` + `Disclaimer2.md`
11. `disclaimer3.html` → `Disclaimer3.astro` + `Disclaimer3.md`
12. `disclaimer_pdf_url.html` → `DisclaimerPdfUrl.astro` + `DisclaimerPdfUrl.md`
13. `enquete.html` → `Enquete.astro` + `Enquete.md`
14. `gototop.html` → `GotoTop.astro` + `GotoTop.md`
15. `gtm.html` → `Gtm.astro` + `Gtm.md`
16. `head.html` → `Head.astro` + `Head.md`
17. `header.html` → `Header.astro` + `Header.md`
18. `headerlabel.html` → `HeaderLabel.astro` + `HeaderLabel.md`
19. `idlink.html` → `IdLink.astro` + `IdLink.md`
20. `langselector.html` → `LangSelector.astro` + `LangSelector.md`
21. `latestpageguide.html` → `LatestPageGuide.astro` + `LatestPageGuide.md`
22. `localemodal.html` → `LocaleModal.astro` + `LocaleModal.md`
23. `related.html` → `Related.astro` + `Related.md`
24. `searchbox.html` → `SearchBox.astro` + `SearchBox.md`
25. `support_inquiry.html` → `SupportInquiry.astro` + `SupportInquiry.md`
26. `title.html` → `Title.astro` + `Title.md`
27. `videonav.html` → `VideoNav.astro` + `VideoNav.md`

### フッター系

28. `footer.html` → `Footer.astro` + `Footer.md`
29. `footer2.html` → `Footer2.astro` + `Footer2.md`
30. `footer_gr6.html` → `FooterGr6.astro` + `FooterGr6.md`

### ナビゲーション系

31. `nav.html` → `Nav.astro` + `Nav.md`
32. `pagenav.html` → `PageNav.astro` + `PageNav.md`
33. `pagenav2.html` → `PageNav2.astro` + `PageNav2.md`
34. `preview_list.html` → `PreviewList.astro` + `PreviewList.md`
35. `treenav.html` → `TreeNav.astro` + `TreeNav.md`
36. `treenav2.html` → `TreeNav2.astro` + `TreeNav2.md`
37. `treenav3.html` → `TreeNav3.astro` + `TreeNav3.md`
38. `treenav_static.html` → `TreeNavStatic.astro` + `TreeNavStatic.md`
39. `treenav_toggle.html` → `TreeNavToggle.astro` + `TreeNavToggle.md`

### メガナビゲーション系

40. `meganav.html` → `MegaNav.astro` + `MegaNav.md`
41. `meganav_gr.html` → `MegaNavGr.astro` + `MegaNavGr.md`
42. `meganav_kt.html` → `MegaNavKt.astro` + `MegaNavKt.md`

## コンポーネント分割計画

### TreeNav 関連

- `TreeNav.astro` (メインコンポーネント)
  - `TreeNavMainMenu.astro` (`define "mainmenu"` から分離)
  - `TreeNavTreeItem.astro` (`define "treeitem"` から分離)

### TreeNavStatic 関連

- `TreeNavStatic.astro` (メインコンポーネント)
  - `TreeNavStaticMenu.astro` (`define "staticmenu"` から分離)

### MegaNavGr 関連

- `MegaNavGr.astro` (メインコンポーネント)
  - `MegaNavGrGetSecond.astro` (`define "getsecond"` から分離)
  - `MegaNavGrSectBar.astro` (`define "sectbar"` から分離)
  - `MegaNavGrMegaPanel.astro` (`define "megapanel"` から分離)
  - `MegaNavGrTitleIcon.astro` (`define "titleicon"` から分離)

### その他の分離コンポーネント

- `Breadcrumb.astro` → `BreadcrumbNav.astro` (`define "breadcrumbnav"` から分離)
- `AnnouncementBanner.astro` → `MakeAnnounceBanner.astro` (`define "makeannouncebanner"` から分離)
- `Footer2.astro` / `FooterGr6.astro` → `FooterDisclaimer.astro` (`define "disclaimer"` から分離)
- `Nav.astro` → `NavMainMenu.astro` (`define "mainmenu"` から分離)

### 共通コンポーネント

- `Wovn.astro` (i18n 用ラッパーコンポーネント)

## Props インターフェース設計

### 基本的な Props 構造

```typescript
interface EnvProps {
  // 基本設定
  product: string;
  productName: string;
  baseURL: string;
  domain: string;
  languageCode: string;
  targetRegion: string;

  // テンプレート設定
  templateVersion: string;
  meganav: boolean;
  previewSite: boolean;

  // 検索設定
  googleSearch: boolean;
  googleSearchTabs?: string;
  bingSearch: boolean;
  bingSearchTabs?: string;
  searchAll?: string;
  idSearch: boolean;

  // その他の設定
  langSelector: boolean;
  useWovn: boolean;
  dataWovnio?: string;
  tocInTree: boolean;
  help: string;
  serviceType?: string;
  serviceTypeId?: string;
  staging?: string;

  // リソースパス
  logo?: string;
  favicon?: string;
  ogImg?: string;
  footerLinks?: string;
  customCss?: string;

  // チャット設定
  chat?: string;
  chatMenuPrefix?: string;

  // ラベル設定
  labelColors?: string[];
  labelLead?: string;
  labelContents?: string[];

  // サイト構造
  siteHome: any;
  siteHomeSections: any[];

  // FAQ リンク
  faqLink?: string;
}

interface PageProps {
  // 基本情報
  isHome: boolean;
  isSection: boolean;
  title: string;
  description?: string;
  relPermalink: string;
  permalink: string;
  type?: string;
  lang: string;
  weight: number;

  // ページ階層
  currentSection: any;
  parent?: any;
  firstSection: any;

  // パラメータ
  params: {
    weight?: number;
    disabled?: string[];
    nolink?: boolean;
    titleUs?: string;
    titleCn?: string;
    labels?: string[];
    latestPage?: string;
    [key: string]: any;
  };

  // コンテンツ
  content?: string;

  // ナビゲーション
  pages: any[];
  sections: any[];
  nextInSection?: any;
  prevInSection?: any;
  siteNext?: any;
  sitePrev?: any;

  // 翻訳
  isTranslated: boolean;
  allTranslations: any[];
  translations: any[];

  // ファイル情報
  fileContentBaseName?: string;
  aliases?: string[];

  // 関数
  isAncestor: (target: any) => boolean;
}

interface BaseProps {
  env: EnvProps;
  page: PageProps;
}
```

### コンポーネント固有の Props

各コンポーネントは `BaseProps` を拡張して、必要な追加 Props を定義します。

```typescript
// 例: TreeNav の Props
interface TreeNavProps extends BaseProps {
  entries?: any[];
  needtoc?: boolean;
  tocregex?: string;
}
```

## 実装上の注意事項

1. **必須 Props と省略可能 Props の区別**

   - TypeScript の型定義で `?` を適切に使用
   - デフォルト値が必要な場合は Astro の Props デフォルト値機能を使用

2. **描画結果の同一性**

   - HTML 構造、クラス名、属性は完全に一致させる
   - 空白や改行も可能な限り維持
   - Hugo の `{{-` と `-}}` による空白制御に注意

3. **動的な値の扱い**

   - すべての動的な値は Props 経由で受け取る
   - ハードコードされた値は避ける

4. **エラーハンドリング**

   - Hugo の `with` に相当する null チェックを実装
   - 配列やオブジェクトの存在確認を適切に行う
   - `undefined` や `null` の場合のフォールバック処理

5. **パフォーマンス考慮**

   - 大量のデータを扱う場合は、適切なメモ化を検討
   - 不要な再計算を避ける

6. **アクセシビリティ**
   - ARIA 属性の適切な使用
   - セマンティックな HTML 構造の維持

## 実装順序の推奨

1. **共通コンポーネント**: `Wovn.astro`
2. **基本コンポーネント**: `Title.astro`, `ApplyParams.astro`
3. **シンプルなコンポーネント**: `GotoTop.astro`, `Disclaimer2.astro`, `ArticleNumber.astro`
4. **中程度の複雑さ**: `Breadcrumb.astro`, `PageNav.astro`, `Related.astro`
5. **複雑なコンポーネント**: `TreeNav.astro`, `MegaNav*.astro`, `Head.astro`, `SearchBox.astro`

## テスト方針

1. 各コンポーネントの単体テスト
2. Props の型チェック
3. 描画結果の比較テスト（Hugo の出力と Astro の出力を比較）
4. i18n キーの置換が正しく行われているかの確認
5. 変更記録ファイルの内容確認

## 品質チェックリスト

- [ ] すべての i18n キーが適切に変換されているか
- [ ] env と page の Props が正しく渡されているか
- [ ] HTML 構造が元のテンプレートと一致しているか
- [ ] CSS クラス名が正確に移植されているか
- [ ] JavaScript の動作が正しく再現されているか
- [ ] 変更記録ファイルが作成され、内容が適切か
- [ ] TODO 項目が記録されているか
- [ ] エラーハンドリングが適切に実装されているか
