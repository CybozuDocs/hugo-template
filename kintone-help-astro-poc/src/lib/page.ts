import type { PageProps } from "../layouts/components/types";
import type { AstroGlobal } from "astro";
import { replaceFrontMatterComponents } from "./frontmatter-replacer";

// =============================================================================
// Page sorting utilities
// =============================================================================

/**
 * ページを weight によってソート（Hugo の ByWeight と同等）
 * 小さい weight 値が上位（昇順）
 */
export function sortPagesByWeight<T extends { weight?: number; frontmatter?: { weight?: number } }>(pages: T[]): T[] {
  return pages.sort((a, b) => {
    // frontmatter.weight または weight プロパティをチェック
    const weightA = a.frontmatter?.weight ?? a.weight ?? 0;
    const weightB = b.frontmatter?.weight ?? b.weight ?? 0;
    return weightA - weightB;
  });
}

// =============================================================================
// Internal utility functions
// =============================================================================

/**
 * パスを正規化（末尾のスラッシュを除去）
 */
export function normalizePathname(path: string): string {
  return path.replace(/\/$/, "");
}

/**
 * /k/ プレフィックスを除去
 */
export function removeKPrefix(path: string): string {
  return path.replace(/^\/k/, "");
}

/**
 * パスをセグメントに分割
 */
export function getPathSegments(path: string): string[] {
  return path.split("/").filter(Boolean);
}

/**
 * ファイルパスからページデータを作成
 */
export function createPageData(
  filepath: string,
  module: Record<string, unknown>,
): PageProps {
  const rawFrontmatter = (module.frontmatter as Record<string, unknown>) || {};
  
  // FrontMatter内のコンポーネント風文字列を実際のenv値に置換
  const frontmatter = replaceFrontMatterComponents(rawFrontmatter);

  // パスから情報を抽出（テスト用パスにも対応）
  let urlPath = filepath;
  if (filepath.includes("/src/lib/__tests__/page/_dummy-contents")) {
    // テスト用パスの場合
    urlPath = filepath
      .replace("/src/lib/__tests__/page/_dummy-contents", "")
      .replace(/\.(md|mdx)$/, "")
      .replace(/\/index$/, "");
  } else {
    // 本番用パスの場合
    urlPath = filepath
      .replace("/src/pages", "")
      .replace(/\.(md|mdx)$/, "")
      .replace(/\/index$/, "");
  }

  const pathSegments = getPathSegments(urlPath);
  const lang = pathSegments[0] || "ja";

  // FrontMatterから取得した値（デフォルト値を含む）
  const frontmatterData = {
    title: (frontmatter.title as string) || "",
    titleUs: (frontmatter.title_us as string) || undefined,
    titleCn: (frontmatter.title_cn as string) || undefined,
    description: (frontmatter.description as string) || "",
    weight: (frontmatter.weight as number) || 0,
    type: (frontmatter.type as string) || "",
    disabled: (frontmatter.disabled as string[]) || [],
    aliases: Array.isArray(frontmatter.aliases)
      ? (frontmatter.aliases as string[])
      : typeof frontmatter.aliases === "string"
        ? [frontmatter.aliases]
        : [],
    labels: (frontmatter.labels as string[]) || [],
  };

  return {
    // パスから計算される値（frontmatterのisHomeを優先）
    isHome: frontmatter.isHome === true || urlPath === "" || urlPath === "/",
    isSection:
      filepath.endsWith("/index.mdx") || filepath.endsWith("/index.md"),
    relPermalink: "/k" + urlPath,
    permalink: "/k" + urlPath,
    lang: lang,

    // FrontMatterから取得した値
    frontmatter: frontmatterData,

    // 階層構造
    sections: [],
    pages: [],
    parent: undefined, // 後で設定

    // セクション内ナビゲーション（後で設定）
    nextInSection: undefined,
    prevInSection: undefined,
  };
}

/**
 * ページファイルかどうかを判定
 */
export function isValidPageFile(filepath: string): boolean {
  return !filepath.includes("/_data/");
}

/**
 * 最も近い親セクションを検索
 */
export function findParentSection(
  pathSegments: string[],
  sectionsByPath: Map<string, PageProps>,
  startIndex: number = 1,
): PageProps | undefined {
  for (let i = pathSegments.length - 1; i >= startIndex; i--) {
    const parentPath = "/" + pathSegments.slice(0, i).join("/");
    if (sectionsByPath.has(parentPath)) {
      return sectionsByPath.get(parentPath);
    }
  }
  return undefined;
}

/**
 * 再帰的にページを検索
 */
export function findPageInTree(
  pages: PageProps[],
  targetPath: string,
): PageProps | undefined {
  for (const page of pages) {
    // relPermalink を正規化して比較
    const normalizedPermalink = normalizePathname(page.relPermalink);

    if (normalizedPermalink === targetPath) {
      return page;
    }

    // sections 内を検索
    if (page.sections && page.sections.length > 0) {
      const found = findPageInTree(page.sections, targetPath);
      if (found) return found;
    }

    // pages 内を検索
    if (page.pages && page.pages.length > 0) {
      const found = findPageInTree(page.pages, targetPath);
      if (found) return found;
    }
  }
  return undefined;
}

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

// =============================================================================
// Public API functions (exported)
// =============================================================================

/**
 * サイトのホームページ情報を取得
 * Hugo の .Site.Home に対応
 */
export function getSiteHome(): PageProps {
  // TODO: 実際のサイトホーム情報を実装
  return {
    isHome: true,
    isSection: false,
    relPermalink: "/",
    permalink: "/",
    lang: "ja",
    frontmatter: {
      title: "kintone ヘルプ",
      titleUs: undefined,
      titleCn: undefined,
      description: "",
      weight: 0,
      type: "",
      disabled: [],
      aliases: [],
      labels: [],
    },
  };
}

/**
 * ページ読み込みとページデータの作成
 */
export function loadAllPages(): {
  allPagesData: PageProps[];
  sectionsMap: Map<string, PageProps>;
} {
  // テスト環境では異なるパスを使用
  const isTest = import.meta.env.VITEST || import.meta.env.NODE_ENV === "test";

  let modules: Record<string, any>;

  if (isTest) {
    // テスト用のダミーコンテンツを読み込み
    modules = import.meta.glob(
      "/src/lib/__tests__/page/_dummy-contents/**/*.{md,mdx}",
      {
        eager: true,
      },
    );
  } else {
    // 本番用のページを読み込み
    modules = import.meta.glob("/src/pages/**/*.{md,mdx,astro}", {
      eager: true,
    });
  }

  const allPages = Object.entries(modules);

  const sectionsMap = new Map<string, PageProps>();
  const allPagesData: PageProps[] = [];

  // 各ファイルを処理してページデータを構築
  for (const [filepath, module] of allPages) {
    if (!isValidPageFile(filepath)) continue;

    const pageData = createPageData(
      filepath,
      module as Record<string, unknown>,
    );
    allPagesData.push(pageData);

    // セクションページの場合、sectionsMapに追加
    if (pageData.isSection) {
      const pathWithoutPrefix = removeKPrefix(pageData.relPermalink);
      const pathSegments = getPathSegments(pathWithoutPrefix);
      const sectionKey = pathSegments.slice(1).join("/"); // セクション階層全体をキーにする

      // 言語ルートページ（/ja/, /en/ など）の場合、sectionKeyが空文字列になるため特別扱い
      if (sectionKey || pathSegments.length === 1) {
        const key = sectionKey || pathSegments[0]; // 言語ルートページの場合は言語コードをキーにする
        sectionsMap.set(key, pageData);
      }
    }
  }

  return { allPagesData, sectionsMap };
}

/**
 * セクションをパスでインデックス化
 */
function indexSectionsByPath(
  sectionsMap: Map<string, PageProps>,
): Map<string, PageProps> {
  const sectionsByPath = new Map<string, PageProps>();

  for (const section of sectionsMap.values()) {
    const pathWithoutPrefix = removeKPrefix(section.relPermalink);
    sectionsByPath.set(pathWithoutPrefix, section);
  }

  return sectionsByPath;
}

/**
 * ページの親子関係を設定
 */
function assignPageParents(
  allPagesData: PageProps[],
  sectionsByPath: Map<string, PageProps>,
): void {
  for (const pageData of allPagesData) {
    if (!pageData.isSection && !pageData.isHome) {
      const pathWithoutPrefix = removeKPrefix(pageData.relPermalink);
      const pathSegments = getPathSegments(pathWithoutPrefix);

      const parentSection = findParentSection(pathSegments, sectionsByPath);

      if (parentSection) {
        if (!parentSection.pages) parentSection.pages = [];
        parentSection.pages.push(pageData);
        pageData.parent = parentSection;
      }
    }
  }
}

/**
 * セクションの親子関係を設定
 */
function assignSectionParents(
  sectionsMap: Map<string, PageProps>,
  sectionsByPath: Map<string, PageProps>,
  homeData: PageProps,
): void {
  for (const section of sectionsMap.values()) {
    const pathWithoutPrefix = removeKPrefix(section.relPermalink);
    const pathSegments = getPathSegments(pathWithoutPrefix);

    if (pathSegments.length <= 2) {
      // トップレベルのセクション（例: /ja/start）の親はホーム
      section.parent = homeData;
    } else {
      // 入れ子のセクション（例: /ja/start/subsection）の親は親セクション
      const parentSection = findParentSection(pathSegments, sectionsByPath, 2);

      if (parentSection) {
        section.parent = parentSection;
        if (!parentSection.sections) parentSection.sections = [];
        parentSection.sections.push(section);
      } else {
        // 親セクションが見つからない場合はホームを親とする
        section.parent = homeData;
      }
    }
  }
}

/**
 * ページとセクションをソート
 */
function sortPagesAndSections(sectionsMap: Map<string, PageProps>): void {
  for (const section of sectionsMap.values()) {
    // セクションのページを weight でソート
    if (section.pages) {
      section.pages.sort((a, b) => a.frontmatter.weight - b.frontmatter.weight);
    }

    // セクションのサブセクションを weight でソート
    if (section.sections) {
      section.sections.sort(
        (a, b) => a.frontmatter.weight - b.frontmatter.weight,
      );
    }
  }
}

/**
 * Hugo の NextInSection/PrevInSection ロジックを実装
 * セクション内のページの前後関係を設定する
 * 
 * Hugo の仕様:
 * - weight 降順でソート（数値が大きいほど上位）
 * - NextInSection: 次のページ（weight順序で下位）
 * - PrevInSection: 前のページ（weight順序で上位）
 */
function assignSectionNavigation(sectionsMap: Map<string, PageProps>): void {
  for (const section of sectionsMap.values()) {
    if (!section.pages || section.pages.length <= 1) {
      continue; // ページが1個以下の場合はナビゲーション設定不要
    }

    // Hugo の仕様に合わせて weight 降順でソート
    const sortedPages = [...section.pages].sort(
      (a, b) => b.frontmatter.weight - a.frontmatter.weight
    );

    // 各ページに前後ページを設定
    for (let i = 0; i < sortedPages.length; i++) {
      const currentPage = sortedPages[i];
      
      // NextInSection: 配列内で次のページ（weight順序で下位）
      if (i + 1 < sortedPages.length) {
        currentPage.nextInSection = sortedPages[i + 1];
      }
      
      // PrevInSection: 配列内で前のページ（weight順序で上位）
      if (i - 1 >= 0) {
        currentPage.prevInSection = sortedPages[i - 1];
      }
    }
  }
}

/**
 * サイトホームのセクション一覧を取得
 * Hugo の .Site.Home.Sections に対応
 */
export async function getSiteHomeSections(): Promise<PageProps[]> {
  const homeData = getSiteHome();

  // ページデータ読み込み
  const { allPagesData, sectionsMap } = loadAllPages();

  // セクションのインデックス化
  const sectionsByPath = indexSectionsByPath(sectionsMap);

  // 親子関係の設定
  assignPageParents(allPagesData, sectionsByPath);
  assignSectionParents(sectionsMap, sectionsByPath, homeData);

  // ソート処理
  sortPagesAndSections(sectionsMap);

  // セクション内ナビゲーションの設定
  assignSectionNavigation(sectionsMap);

  // トップレベルのセクションのみを返す（親がホームのもの）
  // ただし、言語ルートページ（/ja/, /en/ など）は除外する
  const topLevelSections = Array.from(sectionsMap.values())
    .filter((section) => {
      if (section.parent !== homeData) return false;
      
      // 言語ルートページかどうかを判定
      const pathWithoutPrefix = removeKPrefix(section.relPermalink);
      const pathSegments = getPathSegments(pathWithoutPrefix);
      
      // パスが /ja や /en などの言語ルートページの場合は除外
      if (pathSegments.length === 1) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => a.frontmatter.weight - b.frontmatter.weight);

  return topLevelSections;
}

/**
 * サイト内の全ページ一覧を取得
 * Hugo の .Site.RegularPages に対応
 */
export function getRegularPages(): PageProps[] {
  // TODO: 実際のサイト内ページ一覧を実装
  return [];
}

/**
 * ページの相対パーマリンクを取得
 * Hugo の .Page.RelPermalink に対応
 * @returns 相対パーマリンク
 */
export function getRelPermalink(): string {
  // TODO: 実際の相対パーマリンク生成ロジックを実装
  // 現在はダミー値を返す
  return "/dummy-permalink";
}

/**
 * 現在レンダリング中のページを取得
 * getSiteHomeSections() の結果から、現在の URL に一致するページを検索して返す
 * @param Astro - Astro グローバルオブジェクト
 * @param sections - getSiteHomeSections() の実行結果
 * @returns 現在のページデータ
 * @throws ページが見つからない場合はエラーをスロー
 */
export function getCurrentPage(
  Astro: AstroGlobal,
  sections: PageProps[],
): PageProps {
  const currentPath = Astro.url.pathname;

  // ホームページかどうかをチェック
  if (currentPath === "/" || currentPath === "/k/" || currentPath === "/k") {
    return getSiteHome();
  }

  // パスを正規化（末尾のスラッシュを除去）
  const normalizedPath = normalizePathname(currentPath);

  // sections から検索
  const foundPage = findPageInTree(sections, normalizedPath);

  if (!foundPage) {
    // 言語ルートページ（/k/ja/, /k/en/ など）の場合は直接 sectionsMap から検索
    const pathWithoutPrefix = removeKPrefix(normalizedPath);
    const pathSegments = getPathSegments(pathWithoutPrefix);
    
    if (pathSegments.length === 1) {
      // 言語ルートページの可能性がある場合、全ページから検索
      const { sectionsMap } = loadAllPages();
      const languageRootPage = sectionsMap.get(pathSegments[0]);
      
      if (languageRootPage) {
        return languageRootPage;
      }
    }
    
    throw new Error(`ページが見つかりません: ${currentPath}`);
  }

  return foundPage;
}

// =============================================================================
// Page utility functions (moved from RootLayout)
// =============================================================================

/**
 * DropdownChild型定義
 */
export interface DropdownChild {
  title: string;
  relPermalink: string;
}

/**
 * aliasからページを検索
 * @param alias 検索するalias
 * @param allPages 検索対象のページ配列
 * @returns 見つかったページまたはundefined
 */
export function findPageByAlias(alias: string, allPages: PageProps[]): PageProps | undefined {
  return allPages.find(page => 
    page.frontmatter.aliases && page.frontmatter.aliases.includes(alias)
  );
}

/**
 * ページが子ページを持つかどうかを判定
 * @param page 判定対象のページ
 * @returns 子ページを持つ場合true
 */
export function hasChildPages(page: PageProps): boolean {
  const hasRegularPages = Boolean(page.pages && page.pages.length > 0);
  const hasSections = Boolean(page.sections && page.sections.length > 0);
  return hasRegularPages || hasSections;
}

/**
 * ページ配列を再帰的に収集してフラットな配列に変換
 * @param pages 収集対象のページ配列
 * @returns フラットなページ配列
 */
export function collectPagesRecursively(pages: PageProps[]): PageProps[] {
  const result: PageProps[] = [];
  
  function collectPages(pages: PageProps[]): void {
    for (const page of pages) {
      result.push(page);
      if (page.pages) collectPages(page.pages);
      if (page.sections) collectPages(page.sections);
    }
  }
  
  collectPages(pages);
  return result;
}

/**
 * ドロップダウン用の子ページ配列を構築
 * Hugoと同じ動作：親ページを最初に配置し、その後に子ページを追加
 * @param resolvedPage 親ページ
 * @returns ドロップダウン用の子ページ配列
 */
export function buildDropdownChildren(resolvedPage: PageProps): DropdownChild[] {
  const allChildren: PageProps[] = [];
  
  // 親ページ自体を最初に追加（Hugoと同じ動作）
  allChildren.push(resolvedPage);
  
  // 通常のページを追加
  if (resolvedPage.pages) {
    allChildren.push(...resolvedPage.pages);
  }
  
  // セクションページを追加
  if (resolvedPage.sections) {
    allChildren.push(...resolvedPage.sections);
  }
  
  return allChildren.map(page => ({
    title: page.frontmatter.title || '',
    relPermalink: page.relPermalink
  }));
}
