# PageLayout.astro getCurrentPage対応 実行プラン

## 作業概要

PageLayout.astroにおいて、現在独自でpageDataとして作成している部分を、getCurrentPage()で取得した値を使用するように変更する。また、Props で受け取っていた disabled, aliases, labels, type, weight を getCurrentPage() 経由で FrontMatter から参照するように修正する。

## 現状分析

### PageLayout.astroの現在の実装

1. **独自pageData作成箇所（50-76行目）**:
   ```typescript
   const pageData = {
     isHome: isHomePage(Astro.url.pathname),
     isSection: false,
     title: frontmatter.title || "",
     description: frontmatter.description,
     permalink: permalinks.permalink,
     relPermalink: permalinks.relPermalink,
     weight: weight,
     params: {
       type: type,
       nolink: false,
     },
     // ... その他の仮実装
   };
   ```

2. **Props定義（18-29行目）**:
   ```typescript
   type Props = MarkdownLayoutProps<{
     title?: string;
     description?: string;
     weight?: number;
   }> & {
     disabled?: string[];
     aliases?: string[];
     labels?: string[];
     type?: string;
     weight?: number;
   };
   ```

3. **getCurrentPage()の使用（47行目）**:
   ```typescript
   const currentPage = getCurrentPage(Astro, sections);
   ```

### getCurrentPage()の返す型（PageProps）

lib/page.tsのcreatePageData関数で構築される：
- `title`, `titleUs`, `titleCn`
- `description`
- `relPermalink`, `permalink`
- `weight`
- `params` (frontmatter.paramsから取得)
- `isHome`, `isSection`
- `lang`

## 実行計画

### 第1段階: Props型定義の更新

1. **Props型からFrontMatter取得項目を削除**
   - `disabled`, `aliases`, `labels`, `type`, `weight` を削除
   - これらはfrontmatterから直接取得するため不要

2. **Props分割代入の修正**
   - 削除されたPropsの参照を修正
   - frontmatterから直接取得するように変更

### 第2段階: pageDataの置き換え

1. **getCurrentPage()の結果をベースにする**
   - 現在のpageData独自作成部分を削除
   - getCurrentPage()で取得したcurrentPageをベースとして使用

2. **不足プロパティの追加**
   - getCurrentPage()の結果に不足している項目を補完
   - Header.astro等で必要な追加プロパティを維持

### 第3段階: FrontMatterデータの活用

1. **lib/page.tsのPageProps型拡張確認**
   - `disabled`, `aliases`, `labels`, `type` がPagePropsに含まれているか確認
   - 不足している場合は型定義とcreatePageData関数を拡張

2. **FrontMatterからの取得処理**
   - PageLayout.astroでcurrentPageから必要な値を取得
   - disabled チェック等の既存ロジックを維持

## 技術的考慮事項

### 型安全性
- PageProps型に必要なプロパティが全て定義されているか確認
- TypeScriptエラーが発生しないよう型整合性を保つ

### 既存機能の保持
- Breadcrumb用のcurrentPage使用は継続（121行目）
- Header, TreeNav等のコンポーネントへのprops渡しは維持
- disabled地域チェック機能（79行目）の継続

### パフォーマンス
- getCurrentPage()の2回呼び出しを避ける（現在47行目で1回実行済み）
- 必要に応じてcurrentPageから派生データを作成

## 実装順序

1. lib/page.tsのPageProps型確認・拡張
2. PageLayout.astroのProps型定義修正
3. pageData作成部分の置き換え
4. FrontMatterデータ取得の実装
5. ビルドテスト・動作確認

## 期待される効果

- pageDataの独自作成が不要になり、一元的なデータソースを利用
- FrontMatterから直接データを取得する一貫性のあるアーキテクチャ
- getCurrentPage()の活用により、ページデータ管理の統一化

## リスク

- PageProps型に不足プロパティがある場合の型エラー
- 既存コンポーネントとの互換性問題
- パフォーマンスへの影響