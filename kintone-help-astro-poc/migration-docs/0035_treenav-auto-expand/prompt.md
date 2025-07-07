# TreeNav 自動展開機能の調査

## ユーザーからの指示

> SectionLayout.astro において、TreeNavを表示していますが、移植前の場合、画面遷移時に、現在ページに相当するTreeNavのコンテンツが自動的に展開されるようになっています。しかし、刷新後のものだと正正常に展開されません。この原因を調べてほしい。

## 追加情報

> 移植前は、画面表示後にJSで展開されるような動作っぽかったです。kintone-help-astro-poc/public/javascripts/application.js などが怪しいので、一応その観点でも見てほしい。

## 追加要求

> isAncestorですが、PagePropsには保持せずに、単純な関数として２つのページを受け取って判断する関数にしてほしい

## 問題の原因特定

### 根本原因
TreeNavMainMenu.astroの40行目で`curnode.isAncestor?.(target)`が使用されているが、`isAncestor`メソッドが未実装のため、現在ページまでのパスを正しく判定できない。

## 最終実装（関数ベース）

### 1. `isAncestor`純粋関数の実装
`src/lib/page.ts`に純粋関数として実装：

```typescript
/**
 * 指定されたページが現在のページの祖先かどうかを判定
 * Hugo の .IsAncestor に対応
 * @param currentPage 現在のページ
 * @param targetPage 判定対象のページ
 * @returns 指定されたページが祖先の場合true
 */
export function isAncestor(currentPage: PageProps, targetPage: PageProps): boolean {
  // 同じページの場合は祖先ではない
  if (currentPage.relPermalink === targetPage.relPermalink) {
    return false;
  }

  // パスを正規化して比較
  let currentPath = normalizePathname(removeKPrefix(currentPage.relPermalink));
  let targetPath = normalizePathname(removeKPrefix(targetPage.relPermalink));

  // ホームページ（"/"）の場合の特別処理
  if (targetPage.isHome) {
    targetPath = "";
  }
  if (currentPage.isHome) {
    currentPath = "";
  }

  // ホームページから他のページへの関係はfalse（ホームページは他のページの祖先ではない）
  if (targetPage.isHome && !currentPage.isHome) {
    return false;
  }

  // 他のページからホームページへの関係もfalse
  if (!targetPage.isHome && currentPage.isHome) {
    return false;
  }

  // currentPathがtargetPathの子パスかどうかを判定
  // 例: targetPath="/ja/app", currentPath="/ja/app/form" の場合、targetはcurrentの祖先
  if (targetPath === "") {
    return false; // ルートパスは他のページの祖先ではない
  }
  
  return currentPath.startsWith(targetPath + "/");
}
```

### 2. TreeNavMainMenuでの使用
`src/layouts/components/TreeNavMainMenu.astro`で関数をインポートして使用：

```typescript
import { getSiteHome, isAncestor } from "@/lib/page";

// opened/selected の判定
if (isAncestor(target, curnode) || curnode === target) {
  opened = true;
}
```

### 3. 型定義からメソッド削除
`src/layouts/components/types.ts`からisAncestorメソッドを削除：

```typescript
export interface PageProps {
  // ... 他のプロパティ
  // isAncestor?: (target: PageProps) => boolean; // 削除
}
```

### 4. PageProps作成時の簡素化
`createPageData`と`getSiteHome`関数からisAncestorメソッドの設定を削除し、シンプルなオブジェクトとして実装。

## テスト結果

### 関数ベーステスト
全36テストが成功：
- `isAncestor`関数のユニットテスト: 7個
- 既存機能テスト: 29個
- PagePropsインスタンスメソッドテストは削除（関数ベースのため不要）

### ビルド結果
Astroビルドが成功し、TreeNavMainMenu.astroで`isAncestor(target, curnode)`の呼び出しが正常に動作。

## 最終的な設計の利点

1. **関数型アプローチ**: 副作用のない純粋関数として実装
2. **再利用性**: PagePropsに依存しない独立した関数
3. **テスタビリティ**: 簡単にユニットテストが可能
4. **保守性**: オブジェクトにメソッドを追加する必要がない
5. **TypeScript親和性**: 型安全性を保ちながらシンプルな実装

TreeNavの自動展開問題は、純粋関数ベースのアプローチで完全に解決されました。