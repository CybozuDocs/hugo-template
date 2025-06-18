import type { PageProps } from "../layouts/components/types";
import type { AstroGlobal } from "astro";

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
  const frontmatter = (module.frontmatter as Record<string, unknown>) || {};

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

  return {
    isHome: urlPath === "" || urlPath === "/",
    isSection:
      filepath.endsWith("/index.mdx") || filepath.endsWith("/index.md"),
    title: (frontmatter.title as string) || "",
    titleUs: (frontmatter.title_us as string) || undefined,
    titleCn: (frontmatter.title_cn as string) || undefined,
    description: (frontmatter.description as string) || "",
    relPermalink: "/k" + urlPath,
    permalink: "/k" + urlPath,
    lang: lang,
    weight: (frontmatter.weight as number) || 0,
    params: (frontmatter.params as Record<string, unknown>) || {},
    sections: [],
    pages: [],
    parent: undefined, // 後で設定
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
    title: "kintone ヘルプ",
    titleUs: undefined,
    titleCn: undefined,
    relPermalink: "/",
    permalink: "/",
    lang: "ja",
    weight: 0,
    params: {},
  };
}

/**
 * ページ読み込みとページデータの作成
 */
function loadAllPages(): {
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

      if (sectionKey) {
        sectionsMap.set(sectionKey, pageData);
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
      section.pages.sort((a, b) => (a.weight || 0) - (b.weight || 0));
    }

    // セクションのサブセクションを weight でソート
    if (section.sections) {
      section.sections.sort((a, b) => (a.weight || 0) - (b.weight || 0));
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

  // トップレベルのセクションのみを返す（親がホームのもの）
  const topLevelSections = Array.from(sectionsMap.values())
    .filter((section) => section.parent === homeData)
    .sort((a, b) => (a.weight || 0) - (b.weight || 0));

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
    throw new Error(`ページが見つかりません: ${currentPath}`);
  }

  return foundPage;
}
