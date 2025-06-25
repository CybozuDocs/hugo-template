# SectionLayout.astro 実装プラン

## 作業概要

**移行対象**: `layouts/_default/section.html` → `kintone-help-astro-poc/src/layouts/SectionLayout.astro`
**参考ファイル**: `kintone-help-astro-poc/src/layouts/PageLayout.astro` (single.html から移植済み)

Hugo におけるセクションページ用のデフォルトレイアウトを Astro コンポーネントとして移植する。

## 実装すべき主要機能

### 1. セクションページリスト機能（section.html 固有の核心機能）

#### Hugo 実装の分析（54-76行目）
```hugo
{{- $pages := (.Pages | union .Sections) }}
{{- $disppage := 0 }}
{{- range $pages.ByWeight }}
    {{- if in .Params.disabled $.Site.Params.TargetRegion}}
    {{- else }}
        {{- $disppage = (add $disppage 1) }}
    {{- end }}
{{- end }}
{{- if gt $disppage 0 }}
<nav class="section-pagelist">
    <div class="section-pagelist-heading">{{ i18n "Articles_in_this_category" }}</div>
    <ul>
      {{- range $pages.ByWeight }}
        {{- if in .Params.disabled $.Site.Params.TargetRegion}}
        {{- else}}
        <li><a href="{{ .RelPermalink}}">{{safeHTML .Params.Pre}}{{ partial "title" . }}{{safeHTML .Params.Post}}</a></li>
        {{- end}}
      {{- end}}
    </ul>
</nav>
{{- end }}
```

#### Astro 実装方針
- `currentPage.pages` と `currentPage.sections` の統合
- weight順ソート（lib/page.ts の assignSectionNavigation 参考）
- `env.targetRegion` による disabled フィルタリング
- "Articles_in_this_category" i18n ラベル（`<Wovn>` コンポーネント使用）
- Pre/Post SafeHTML 処理（実装時は TODO として記録）

### 2. TOC 表示条件の制御

#### Hugo 実装の分析（54行目、80-86行目）
```hugo
{{- if ne $.Site.Params.toc_in_tree true -}}
    <!-- セクションページリスト表示 -->
{{- end }}
...
{{- if ne $.Site.Params.toc_in_tree true -}}
<div class="sidebar-wrap">
    <nav id="rightside-bar">
        <h2 class="toc-title">{{ i18n "In_this_article" }}</h2>
    </nav>
</div>
{{- end }}
```

#### Astro 実装方針
- `env.tocInTree` に相当する環境変数の確認・追加
- 条件付きレンダリングによる適切な制御

### 3. Article 要素の内容構造

#### 差異の分析
- **PageLayout.astro**: `<slot />` で Markdown コンテンツを表示
- **section.html**: `{{ .Content }}` でセクション説明 + セクションページリストを外側で表示

#### Astro 実装方針
- article 要素内は `<slot />` でセクション説明を表示
- セクションページリストは article 要素の外側（main 要素内）に配置

## 実装手順

### Step 1: 基本構造の実装
1. PageLayout.astro を SectionLayout.astro にコピー
2. Props 型定義の調整（必要に応じて）
3. 基本的な DOM 構造の確認

### Step 2: セクションページリスト機能の実装
1. 子ページ・セクション統合ロジックの実装
2. weight順ソート機能の実装
3. disabled フィルタリング機能の実装
4. DOM 構造の構築（nav.section-pagelist）

### Step 3: TOC 表示条件の実装
1. 環境変数の確認・追加（必要に応じて）
2. 条件付きレンダリングの実装
3. サイドバー表示制御の実装

### Step 4: 品質確保
1. ビルドテスト実行
2. DOM 構造の Hugo template との比較確認
3. TypeScript 型エラーの解消

## 設計方針

### DOM 構造の完全保持
- Hugo template と同等の構造維持を最優先
- CSS クラス名の正確な再現
- セマンティック HTML の遵守

### PageLayout.astro パターンの継承
- 既存の設計パターンを踏襲
- Props 設計の一貫性維持
- import 文の構造統一

### 段階的実装
- 基本構造 → セクションページリスト → TOC制御 の順序
- 各段階でのビルドテスト実行
- TODO マークによる将来実装項目の明示

## 移行規則の適用

### migrate-rules.md の重要ルール
- **破壊的変更の禁止**: DOM構造の勝手な変更は禁止
- **Props型定義統一化**: BaseProps の適切な使用
- **WOVN統合**: `{{ i18n "key" }}` → `<Wovn>i18n__key</Wovn>`
- **固定値前提**: templateVersion="2", product="kintone" 固定

### rules.md の開発ルール
- **TypeScript 型安全性**: 適切な interface 定義
- **any 型の禁止**: 型安全性の確保
- **コードフォーマット**: Prettier による統一

## 予想される課題と対処方針

### 課題1: 子ページ・セクション統合ロジック
- **対処**: lib/page.ts の既存関数（getSiteHomeSections）を参考に実装
- **備考**: `.Pages | union .Sections` の正確な再現が重要

### 課題2: Pre/Post SafeHTML 処理
- **対処**: 初期実装では TODO として記録、将来実装
- **備考**: 現在の kintone コンテンツでは使用例が少ない

### 課題3: 環境変数の不足
- **対処**: 必要に応じて env.ts と .env ファイルに追加
- **備考**: tocInTree 相当の設定が必要になる可能性

## 成功基準

1. **ビルドテスト通過**: npm run build でエラーなし
2. **DOM構造一致**: Hugo template と同等の構造
3. **型安全性確保**: TypeScript エラーなし
4. **既存機能保持**: PageLayout.astro で確立された機能の維持
5. **セクションページリスト動作**: 子ページ・セクションの適切な表示

## 次のステップ

1. 詳細分析の完了
2. SectionLayout.astro の基本実装
3. セクションページリスト機能の実装
4. 品質確保とテスト
5. ドキュメント更新