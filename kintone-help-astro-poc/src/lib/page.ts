import type { PageProps } from "../layouts/components/types";

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
    };

    allPagesData.push(pageData);

    // セクションページの場合、sectionsMapに追加
    if (pageData.isSection && sectionName) {
      sectionsMap.set(sectionName, pageData);
    }
  }

  // 各ページを適切なセクションに配置
  for (const pageData of allPagesData) {
    if (!pageData.isSection && !pageData.isHome) {
      // /k/ プレフィックスを除去してパスを解析
      const pathWithoutPrefix = pageData.relPermalink.replace(/^\/k/, "");
      const pathSegments = pathWithoutPrefix.split("/").filter(Boolean);
      const sectionName = pathSegments[1];

      if (sectionName && sectionsMap.has(sectionName)) {
        const section = sectionsMap.get(sectionName)!;
        if (!section.pages) section.pages = [];
        section.pages.push(pageData);
      }
    }
  }

  // セクションのページを weight でソート
  for (const section of sectionsMap.values()) {
    if (section.pages) {
      section.pages.sort((a, b) => (a.weight || 0) - (b.weight || 0));
    }
  }

  // セクション一覧を weight でソートして返す
  const sections = Array.from(sectionsMap.values()).sort(
    (a, b) => (a.weight || 0) - (b.weight || 0)
  );

  return sections;
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
