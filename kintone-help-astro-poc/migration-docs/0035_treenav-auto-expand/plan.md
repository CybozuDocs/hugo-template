# TreeNav 自動展開機能の調査計画

## 問題の概要
SectionLayout.astro において、TreeNavを表示していますが、移植前の場合、画面遷移時に、現在ページに相当するTreeNavのコンテンツが自動的に展開されるようになっています。しかし、刷新後のものだと正常に展開されません。

## 調査の観点
1. **Hugo版（移植前）の動作分析**
   - Hugo版のTreeNavの構造とdata-jstree属性の設定
   - application.js等でのJSTree初期化処理
   - 現在ページの自動展開ロジック

2. **Astro版（移植後）の動作分析**
   - Astro版のTreeNavの構造とdata-jstree属性の設定
   - JavaScriptによる展開処理の有無
   - 現在ページの判定と展開状態の設定

3. **問題の特定**
   - TreeNavMainMenu.astroでのopened判定ロジック
   - data-jstree属性の正確な設定
   - JavaScript初期化処理の実行確認

## 調査対象ファイル
- **Hugo版**:
  - `/layouts/partials/treenav.html`
  - `/static/javascripts/application.js`
  - その他JSTreeに関連するJavaScriptファイル

- **Astro版**:
  - `/kintone-help-astro-poc/src/layouts/components/TreeNav.astro`
  - `/kintone-help-astro-poc/src/layouts/components/TreeNavMainMenu.astro`
  - `/kintone-help-astro-poc/public/javascripts/application.js`
  - `/kintone-help-astro-poc/src/lib/page.ts`の`isAncestor`メソッド

## 期待される成果
- 移植前後でのTreeNav自動展開動作の違いを特定
- 問題の根本原因を明確化
- 修正案の提示