import { describe, it, expect, vi, beforeEach } from "vitest";
import type { PageProps } from "../layouts/components/types";
import type { AstroGlobal } from "astro";

// page.ts からテスト対象をimport
import {
  getSiteHome,
  getSiteHomeSections,
  getCurrentPage,
  normalizePathname,
  removeKPrefix,
  getPathSegments,
  createPageData,
  isValidPageFile,
  findParentSection,
  findPageInTree,
} from "./page";

describe("page.ts", () => {
  describe("getSiteHome", () => {
    it("ホームページデータを正しく返すこと", () => {
      const home = getSiteHome();

      expect(home.isHome).toBe(true);
      expect(home.isSection).toBe(false);
      expect(home.frontmatter.title).toBe("kintone ヘルプ");
      expect(home.relPermalink).toBe("/");
      expect(home.permalink).toBe("/");
      expect(home.lang).toBe("ja");
      expect(home.frontmatter.weight).toBe(0);
    });
  });

  describe("getCurrentPage", () => {
    let mockAstro: AstroGlobal;
    let mockSections: PageProps[];

    beforeEach(() => {
      // Astro.urlのモック
      mockAstro = {
        url: new URL("http://localhost:4321/k/ja/start/"),
      } as AstroGlobal;

      // テスト用のセクションデータ
      mockSections = [
        {
          isHome: false,
          isSection: true,
          relPermalink: "/k/ja/start",
          permalink: "/k/ja/start",
          lang: "ja",
          frontmatter: {
            title: "はじめる",
            titleUs: undefined,
            titleCn: undefined,
            description: "",
            weight: 1,
            type: "",
            disabled: [],
            aliases: [],
            labels: [],
          },
          sections: [],
          pages: [
            {
              isHome: false,
              isSection: false,
              relPermalink: "/k/ja/start/whatskintone",
              permalink: "/k/ja/start/whatskintone",
              lang: "ja",
              frontmatter: {
                title: "kintoneとは",
                titleUs: undefined,
                titleCn: undefined,
                description: "",
                weight: 1,
                type: "",
                disabled: [],
                aliases: [],
                labels: [],
              },
              sections: [],
              pages: [],
            },
          ],
        },
      ];
    });

    it("ホームページパスの場合、ホームページデータを返すこと", () => {
      mockAstro.url = new URL("http://localhost:4321/");
      const result = getCurrentPage(mockAstro, mockSections);

      expect(result.isHome).toBe(true);
      expect(result.frontmatter.title).toBe("kintone ヘルプ");
    });

    it("/k/パスの場合、ホームページデータを返すこと", () => {
      mockAstro.url = new URL("http://localhost:4321/k/");
      const result = getCurrentPage(mockAstro, mockSections);

      expect(result.isHome).toBe(true);
      expect(result.frontmatter.title).toBe("kintone ヘルプ");
    });

    it("セクションページを正しく見つけること", () => {
      mockAstro.url = new URL("http://localhost:4321/k/ja/start");
      const result = getCurrentPage(mockAstro, mockSections);

      expect(result.frontmatter.title).toBe("はじめる");
      expect(result.isSection).toBe(true);
      expect(result.relPermalink).toBe("/k/ja/start");
    });

    it("末尾スラッシュありのセクションページを正しく見つけること", () => {
      mockAstro.url = new URL("http://localhost:4321/k/ja/start/");
      const result = getCurrentPage(mockAstro, mockSections);

      expect(result.frontmatter.title).toBe("はじめる");
      expect(result.isSection).toBe(true);
      expect(result.relPermalink).toBe("/k/ja/start");
    });

    it("通常ページを正しく見つけること", () => {
      mockAstro.url = new URL("http://localhost:4321/k/ja/start/whatskintone");
      const result = getCurrentPage(mockAstro, mockSections);

      expect(result.frontmatter.title).toBe("kintoneとは");
      expect(result.isSection).toBe(false);
      expect(result.relPermalink).toBe("/k/ja/start/whatskintone");
    });

    it("存在しないページの場合、エラーをスローすること", () => {
      mockAstro.url = new URL("http://localhost:4321/k/ja/nonexistent");

      expect(() => {
        getCurrentPage(mockAstro, mockSections);
      }).toThrow("ページが見つかりません: /k/ja/nonexistent");
    });

    it("深い階層のページも検索できること", () => {
      // 深い階層のテストデータを追加
      const deepPage: PageProps = {
        isHome: false,
        isSection: false,
        relPermalink: "/k/ja/start/sub/deep",
        permalink: "/k/ja/start/sub/deep",
        lang: "ja",
        frontmatter: {
          title: "深いページ",
          titleUs: undefined,
          titleCn: undefined,
          description: "",
          weight: 1,
          type: "",
          disabled: [],
          aliases: [],
          labels: [],
        },
        sections: [],
        pages: [],
      };

      const subSection: PageProps = {
        isHome: false,
        isSection: true,
        relPermalink: "/k/ja/start/sub",
        permalink: "/k/ja/start/sub",
        lang: "ja",
        frontmatter: {
          title: "サブセクション",
          titleUs: undefined,
          titleCn: undefined,
          description: "",
          weight: 2,
          type: "",
          disabled: [],
          aliases: [],
          labels: [],
        },
        sections: [],
        pages: [deepPage],
      };

      mockSections[0].sections = [subSection];

      mockAstro.url = new URL("http://localhost:4321/k/ja/start/sub/deep");
      const result = getCurrentPage(mockAstro, mockSections);

      expect(result.frontmatter.title).toBe("深いページ");
      expect(result.relPermalink).toBe("/k/ja/start/sub/deep");
    });
  });

  // 内部関数のテスト
  describe("normalizePathname", () => {
    it("末尾のスラッシュを除去すること", () => {
      expect(normalizePathname("/path/")).toBe("/path");
      expect(normalizePathname("/path/to/page/")).toBe("/path/to/page");
    });

    it("末尾にスラッシュがない場合はそのまま返すこと", () => {
      expect(normalizePathname("/path")).toBe("/path");
      expect(normalizePathname("/path/to/page")).toBe("/path/to/page");
    });
  });

  describe("removeKPrefix", () => {
    it("/k/プレフィックスを除去すること", () => {
      expect(removeKPrefix("/k/ja/start")).toBe("/ja/start");
      expect(removeKPrefix("/k/ja/start/page")).toBe("/ja/start/page");
    });

    it("/k/プレフィックスがない場合はそのまま返すこと", () => {
      expect(removeKPrefix("/ja/start")).toBe("/ja/start");
      expect(removeKPrefix("/other/path")).toBe("/other/path");
    });
  });

  describe("getPathSegments", () => {
    it("パスを正しくセグメントに分割すること", () => {
      expect(getPathSegments("/ja/start/page")).toEqual([
        "ja",
        "start",
        "page",
      ]);
      expect(getPathSegments("/ja/start")).toEqual(["ja", "start"]);
    });

    it("空のセグメントを除去すること", () => {
      expect(getPathSegments("/ja//start/page")).toEqual([
        "ja",
        "start",
        "page",
      ]);
      expect(getPathSegments("//ja/start//")).toEqual(["ja", "start"]);
    });
  });

  describe("isValidPageFile", () => {
    it("有効なページファイルを判定すること", () => {
      expect(isValidPageFile("/src/pages/ja/start/index.mdx")).toBe(true);
      expect(isValidPageFile("/src/pages/ja/start/page.md")).toBe(true);
    });

    it("_dataディレクトリのファイルを除外すること", () => {
      expect(isValidPageFile("/src/pages/_data/test.csv")).toBe(false);
      expect(isValidPageFile("/src/pages/ja/_data/config.json")).toBe(false);
    });
  });

  describe("createPageData", () => {
    it("ファイルパスからページデータを作成すること", () => {
      const filepath = "/src/pages/ja/start/index.mdx";
      const module = {
        frontmatter: {
          title: "スタートガイド",
          description: "テスト説明",
          weight: 10,
        },
      };

      const result = createPageData(filepath, module);

      expect(result.frontmatter.title).toBe("スタートガイド");
      expect(result.frontmatter.description).toBe("テスト説明");
      expect(result.frontmatter.weight).toBe(10);
      expect(result.frontmatter).toEqual({
        title: "スタートガイド",
        titleUs: undefined,
        titleCn: undefined,
        description: "テスト説明",
        weight: 10,
        type: "",
        disabled: [],
        aliases: [],
        labels: [],
      });
      expect(result.relPermalink).toBe("/k/ja/start");
      expect(result.isSection).toBe(true); // index.mdx なのでセクション
      expect(result.lang).toBe("ja");
    });

    it("frontmatterがない場合でもデフォルト値を設定すること", () => {
      const filepath = "/src/pages/ja/start/page.md";
      const module = {};

      const result = createPageData(filepath, module);

      expect(result.frontmatter.title).toBe("");
      expect(result.frontmatter.description).toBe("");
      expect(result.frontmatter.weight).toBe(0);
      expect(result.frontmatter).toEqual({
        title: "",
        titleUs: undefined,
        titleCn: undefined,
        description: "",
        weight: 0,
        type: "",
        disabled: [],
        aliases: [],
        labels: [],
      });
      expect(result.relPermalink).toBe("/k/ja/start/page");
      expect(result.isSection).toBe(false); // page.md なので通常ページ
    });
  });

  describe("findParentSection", () => {
    let sectionsByPath: Map<string, PageProps>;

    beforeEach(() => {
      sectionsByPath = new Map();
      sectionsByPath.set("/ja/start", {
        isHome: false,
        isSection: true,
        relPermalink: "/k/ja/start",
        permalink: "/k/ja/start",
        lang: "ja",
        frontmatter: {
          title: "スタート",
          titleUs: undefined,
          titleCn: undefined,
          description: "",
          weight: 1,
          type: "",
          disabled: [],
          aliases: [],
          labels: [],
        },
        sections: [],
        pages: [],
      } as PageProps);
      sectionsByPath.set("/ja/start/advanced", {
        isHome: false,
        isSection: true,
        relPermalink: "/k/ja/start/advanced",
        permalink: "/k/ja/start/advanced",
        lang: "ja",
        frontmatter: {
          title: "上級編",
          titleUs: undefined,
          titleCn: undefined,
          description: "",
          weight: 2,
          type: "",
          disabled: [],
          aliases: [],
          labels: [],
        },
        sections: [],
        pages: [],
      } as PageProps);
    });

    it("直接の親セクションを見つけること", () => {
      const pathSegments = ["ja", "start", "page"];
      const result = findParentSection(pathSegments, sectionsByPath);

      expect(result?.frontmatter.title).toBe("スタート");
    });

    it("深い階層の親セクションを見つけること", () => {
      const pathSegments = ["ja", "start", "advanced", "page"];
      const result = findParentSection(pathSegments, sectionsByPath);

      expect(result?.frontmatter.title).toBe("上級編");
    });

    it("親セクションが見つからない場合はundefinedを返すこと", () => {
      const pathSegments = ["ja", "nonexistent", "page"];
      const result = findParentSection(pathSegments, sectionsByPath);

      expect(result).toBeUndefined();
    });
  });

  describe("findPageInTree", () => {
    let pages: PageProps[];

    beforeEach(() => {
      pages = [
        {
          isHome: false,
          isSection: true,
          relPermalink: "/k/ja/section1",
          permalink: "/k/ja/section1",
          lang: "ja",
          frontmatter: {
            title: "セクション1",
            titleUs: undefined,
            titleCn: undefined,
            description: "",
            weight: 1,
            type: "",
            disabled: [],
            aliases: [],
            labels: [],
          },
          sections: [
            {
              isHome: false,
              isSection: true,
              relPermalink: "/k/ja/section1/sub",
              permalink: "/k/ja/section1/sub",
              lang: "ja",
              frontmatter: {
                title: "サブセクション",
                titleUs: undefined,
                titleCn: undefined,
                description: "",
                weight: 1,
                type: "",
                disabled: [],
                aliases: [],
                labels: [],
              },
              sections: [],
              pages: [
                {
                  isHome: false,
                  isSection: false,
                  relPermalink: "/k/ja/section1/sub/deep",
                  permalink: "/k/ja/section1/sub/deep",
                  lang: "ja",
                  frontmatter: {
                    title: "深いページ",
                    titleUs: undefined,
                    titleCn: undefined,
                    description: "",
                    weight: 1,
                    type: "",
                    disabled: [],
                    aliases: [],
                    labels: [],
                  },
                  sections: [],
                  pages: [],
                } as PageProps,
              ],
            } as PageProps,
          ],
          pages: [
            {
              isHome: false,
              isSection: false,
              relPermalink: "/k/ja/section1/page1",
              permalink: "/k/ja/section1/page1",
              lang: "ja",
              frontmatter: {
                title: "ページ1",
                titleUs: undefined,
                titleCn: undefined,
                description: "",
                weight: 1,
                type: "",
                disabled: [],
                aliases: [],
                labels: [],
              },
              sections: [],
              pages: [],
            } as PageProps,
          ],
        } as PageProps,
      ];
    });

    it("トップレベルのセクションを見つけること", () => {
      const result = findPageInTree(pages, "/k/ja/section1");
      expect(result?.frontmatter.title).toBe("セクション1");
    });

    it("ページを見つけること", () => {
      const result = findPageInTree(pages, "/k/ja/section1/page1");
      expect(result?.frontmatter.title).toBe("ページ1");
    });

    it("深い階層のページを見つけること", () => {
      const result = findPageInTree(pages, "/k/ja/section1/sub/deep");
      expect(result?.frontmatter.title).toBe("深いページ");
    });

    it("存在しないページの場合はundefinedを返すこと", () => {
      const result = findPageInTree(pages, "/k/ja/nonexistent");
      expect(result).toBeUndefined();
    });
  });
});

// 統合テスト: getSiteHomeSections の実際の動作テスト
describe("getSiteHomeSections integration", () => {
  it("ダミーコンテンツから正しいページ構造を構築すること", async () => {
    const sections = await getSiteHomeSections();

    // トップレベルセクションが2つ存在すること（start, guide）
    expect(sections).toHaveLength(2);

    // weight順でソートされているか確認
    const sectionTitles = sections.map((s) => s.frontmatter.title);
    expect(sectionTitles).toEqual(["スタートガイド", "ガイド"]);

    // startセクション（.mdx）
    const startSection = sections.find(
      (s) => s.frontmatter.title === "スタートガイド",
    )!;
    expect(startSection.relPermalink).toBe("/k/ja/start");
    expect(startSection.isSection).toBe(true);
    expect(startSection.frontmatter.weight).toBe(1);

    const whatskintone = startSection.pages?.find(
      (p) => p.frontmatter.title === "kintoneとは",
    );
    expect(whatskintone).toBeDefined();
    expect(whatskintone!.relPermalink).toBe("/k/ja/start/whatskintone");
    expect(whatskintone!.isSection).toBe(false);

    const advancedSection = startSection.sections?.find(
      (s) => s.frontmatter.title === "上級編",
    );
    expect(advancedSection).toBeDefined();
    expect(advancedSection!.relPermalink).toBe("/k/ja/start/advanced");
    expect(advancedSection!.isSection).toBe(true);

    // guideセクション（.md）
    const guideSection = sections.find(
      (s) => s.frontmatter.title === "ガイド",
    )!;
    expect(guideSection.relPermalink).toBe("/k/ja/guide");
    expect(guideSection.isSection).toBe(true);
    expect(guideSection.frontmatter.weight).toBe(2);

    const basicPage = guideSection.pages?.find(
      (p) => p.frontmatter.title === "基本操作",
    );
    expect(basicPage).toBeDefined();
    expect(basicPage!.relPermalink).toBe("/k/ja/guide/basic");
    expect(basicPage!.isSection).toBe(false);
  });

  it("親子関係が正しく設定されること", async () => {
    const sections = await getSiteHomeSections();
    const homeData = getSiteHome();

    // 各セクションの親はホーム
    sections.forEach((section) => {
      expect(section.parent).toEqual(homeData);
    });

    // 個別のテスト
    const startSection = sections.find(
      (s) => s.frontmatter.title === "スタートガイド",
    )!;
    const guideSection = sections.find(
      (s) => s.frontmatter.title === "ガイド",
    )!;

    // startセクション内の関係
    const advancedSection = startSection.sections?.find(
      (s) => s.frontmatter.title === "上級編",
    );
    const whatskintone = startSection.pages?.find(
      (p) => p.frontmatter.title === "kintoneとは",
    );
    const customization = advancedSection?.pages?.[0];

    expect(advancedSection?.parent).toEqual(startSection);
    expect(whatskintone?.parent).toEqual(startSection);
    expect(customization?.parent).toEqual(advancedSection);

    // guideセクション内の関係
    const basicPage = guideSection.pages?.find(
      (p) => p.frontmatter.title === "基本操作",
    );
    expect(basicPage?.parent).toEqual(guideSection);
  });

  it("ページとセクションが weight でソートされること", async () => {
    const sections = await getSiteHomeSections();

    // トップレベルセクションがweight順でソートされていること
    const weights = sections.map((s) => s.frontmatter.weight);
    expect(weights).toEqual([1, 2]); // start, guide

    // 各セクション内でもソートされていること確認
    sections.forEach((section) => {
      if (section.pages && section.pages.length > 1) {
        for (let i = 0; i < section.pages.length - 1; i++) {
          expect(section.pages[i].frontmatter.weight).toBeLessThanOrEqual(
            section.pages[i + 1].frontmatter.weight,
          );
        }
      }

      if (section.sections && section.sections.length > 1) {
        for (let i = 0; i < section.sections.length - 1; i++) {
          expect(section.sections[i].frontmatter.weight).toBeLessThanOrEqual(
            section.sections[i + 1].frontmatter.weight,
          );
        }
      }
    });
  });

  // nextInSection/prevInSection のテストケースを追加
  describe("nextInSection/prevInSection", () => {
    it("should correctly set nextInSection and prevInSection for pages within the same section", async () => {
      const sections = await getSiteHomeSections();
      
      // startセクションを取得
      const startSection = sections.find(s => s.relPermalink === "/k/ja/start");
      expect(startSection).toBeDefined();
      expect(startSection!.pages).toBeDefined();
      
      // セクション内のすべてのページをweight降順で取得（Hugo仕様）
      const sectionPages = startSection!.pages!
        .sort((a, b) => b.frontmatter.weight - a.frontmatter.weight);
      
      // 実際のページ数を確認（少なくとも4つ：3つのseriesページ + whatskintone）
      expect(sectionPages.length).toBeGreaterThanOrEqual(4);
      
      // 最初のページ（最高weight）のテスト
      const firstPage = sectionPages[0];
      expect(firstPage.prevInSection).toBeUndefined(); // 最初のページは前のページがない
      expect(firstPage.nextInSection).toBeDefined(); // 次のページがある
      
      // 最後のページ（最低weight）のテスト
      const lastPage = sectionPages[sectionPages.length - 1];
      expect(lastPage.nextInSection).toBeUndefined(); // 最後のページは次のページがない
      expect(lastPage.prevInSection).toBeDefined(); // 前のページがある
      
      // 中間ページのテスト
      if (sectionPages.length > 2) {
        const middlePage = sectionPages[1];
        expect(middlePage.prevInSection).toBeDefined(); // 前のページがある
        expect(middlePage.nextInSection).toBeDefined(); // 次のページがある
        
        // 前後関係の確認
        expect(middlePage.prevInSection!.frontmatter.weight).toBeGreaterThan(middlePage.frontmatter.weight);
        expect(middlePage.nextInSection!.frontmatter.weight).toBeLessThan(middlePage.frontmatter.weight);
      }
    });

    it("should not set navigation for sections with only one page", async () => {
      const sections = await getSiteHomeSections();
      
      // guideセクションを取得（1ページのみ）
      const guideSection = sections.find(s => s.relPermalink === "/k/ja/guide");
      expect(guideSection).toBeDefined();
      expect(guideSection!.pages).toBeDefined();
      expect(guideSection!.pages!).toHaveLength(1);
      
      const singlePage = guideSection!.pages![0];
      expect(singlePage.nextInSection).toBeUndefined();
      expect(singlePage.prevInSection).toBeUndefined();
    });
  });
});
