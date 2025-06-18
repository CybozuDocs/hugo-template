import type { PageProps } from "../layouts/components/types";
import type { AstroGlobal } from "astro";

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
    relPermalink: "/",
    permalink: "/",
    lang: "ja",
    weight: 0,
    params: {},
  };
}

/**
 * サイトホームのセクション一覧を取得
 * Hugo の .Site.Home.Sections に対応
 */
export async function getSiteHomeSections(): Promise<PageProps[]> {
  // import.meta.glob を使って src/pages/ 配下のすべてのファイルを取得
  const modules = import.meta.glob("/src/pages/**/*.{md,mdx,astro}", {
    eager: true,
  });
  const allPages = Object.entries(modules);

  const sectionsMap = new Map<string, PageProps>();
  const allPagesData: PageProps[] = [];
  const homeData = getSiteHome();

  // 各ファイルを処理してページデータを構築
  for (const [filepath, module] of allPages) {
    // _data ディレクトリは除外
    if (filepath.includes("/_data/")) continue;

    const frontmatter =
      (module as { frontmatter?: Record<string, unknown> }).frontmatter || {};

    // パスから情報を抽出
    const urlPath = filepath
      .replace("/src/pages", "")
      .replace(/\.(md|mdx|astro)$/, "")
      .replace(/\/index$/, "");

    const pathSegments = urlPath.split("/").filter(Boolean);
    const lang = pathSegments[0] || "ja";
    const sectionName = pathSegments[1];

    // ページデータを構築
    const pageData: PageProps = {
      isHome: urlPath === "" || urlPath === "/",
      isSection:
        filepath.endsWith("/index.mdx") || filepath.endsWith("/index.md"),
      title: (frontmatter.title as string) || "",
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

    allPagesData.push(pageData);

    // セクションページの場合、sectionsMapに追加
    if (pageData.isSection && sectionName) {
      sectionsMap.set(sectionName, pageData);
    }
  }

  // 階層的なセクション構造を構築するためのマップ
  const sectionsByPath = new Map<string, PageProps>();

  // セクションをパスでインデックス化
  for (const section of sectionsMap.values()) {
    const pathWithoutPrefix = section.relPermalink.replace(/^\/k/, "");
    sectionsByPath.set(pathWithoutPrefix, section);
  }

  // 各ページを適切なセクションに配置し、親を設定
  for (const pageData of allPagesData) {
    if (!pageData.isSection && !pageData.isHome) {
      // /k/ プレフィックスを除去してパスを解析
      const pathWithoutPrefix = pageData.relPermalink.replace(/^\/k/, "");
      const pathSegments = pathWithoutPrefix.split("/").filter(Boolean);
      
      // 最も近い親セクションを探す（深い階層から順に探す）
      let parentSection: PageProps | undefined;
      for (let i = pathSegments.length - 1; i >= 1; i--) {
        const parentPath = "/" + pathSegments.slice(0, i).join("/");
        if (sectionsByPath.has(parentPath)) {
          parentSection = sectionsByPath.get(parentPath);
          break;
        }
      }

      if (parentSection) {
        if (!parentSection.pages) parentSection.pages = [];
        parentSection.pages.push(pageData);
        // ページの親をセクションに設定
        pageData.parent = parentSection;
      }
    }
  }

  // セクションの親子関係を設定
  for (const section of sectionsMap.values()) {
    const pathWithoutPrefix = section.relPermalink.replace(/^\/k/, "");
    const pathSegments = pathWithoutPrefix.split("/").filter(Boolean);
    
    if (pathSegments.length <= 2) {
      // トップレベルのセクション（例: /ja/start）の親はホーム
      section.parent = homeData;
    } else {
      // 入れ子のセクション（例: /ja/start/subsection）の親は親セクション
      let parentSection: PageProps | undefined;
      for (let i = pathSegments.length - 1; i >= 2; i--) {
        const parentPath = "/" + pathSegments.slice(0, i).join("/");
        if (sectionsByPath.has(parentPath)) {
          parentSection = sectionsByPath.get(parentPath);
          break;
        }
      }
      
      if (parentSection) {
        section.parent = parentSection;
        if (!parentSection.sections) parentSection.sections = [];
        parentSection.sections.push(section);
      } else {
        // 親セクションが見つからない場合はホームを親とする
        section.parent = homeData;
      }
    }
    
    // セクションのページを weight でソート
    if (section.pages) {
      section.pages.sort((a, b) => (a.weight || 0) - (b.weight || 0));
    }
    
    // セクションのサブセクションを weight でソート
    if (section.sections) {
      section.sections.sort((a, b) => (a.weight || 0) - (b.weight || 0));
    }
  }

  // トップレベルのセクションのみを返す（親がホームのもの）
  const topLevelSections = Array.from(sectionsMap.values())
    .filter(section => section.parent === homeData)
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
  sections: PageProps[]
): PageProps {
  // 現在の URL パスを取得
  const currentPath = Astro.url.pathname;

  // ホームページかどうかをチェック
  if (currentPath === "/" || currentPath === "/k/" || currentPath === "/k") {
    return getSiteHome();
  }

  // パスを正規化（末尾のスラッシュを除去）
  const normalizedPath = currentPath.replace(/\/$/, "");

  // 再帰的にページを検索する関数
  function findPageRecursive(pages: PageProps[]): PageProps | undefined {
    for (const page of pages) {
      // relPermalink を正規化して比較
      const normalizedPermalink = page.relPermalink.replace(/\/$/, "");
      
      if (normalizedPermalink === normalizedPath) {
        return page;
      }

      // sections 内を検索
      if (page.sections && page.sections.length > 0) {
        const found = findPageRecursive(page.sections);
        if (found) return found;
      }

      // pages 内を検索
      if (page.pages && page.pages.length > 0) {
        const found = findPageRecursive(page.pages);
        if (found) return found;
      }
    }
    return undefined;
  }

  // sections から検索
  const foundPage = findPageRecursive(sections);
  
  if (!foundPage) {
    throw new Error(`ページが見つかりません: ${currentPath}`);
  }
  
  return foundPage;
}
