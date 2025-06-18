import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { PageProps } from '../layouts/components/types';
import type { AstroGlobal } from 'astro';

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
  findPageInTree
} from './page';

describe('page.ts', () => {
  describe('getSiteHome', () => {
    it('ホームページデータを正しく返すこと', () => {
      const home = getSiteHome();
      
      expect(home.isHome).toBe(true);
      expect(home.isSection).toBe(false);
      expect(home.title).toBe('kintone ヘルプ');
      expect(home.relPermalink).toBe('/');
      expect(home.permalink).toBe('/');
      expect(home.lang).toBe('ja');
      expect(home.weight).toBe(0);
      expect(home.params).toEqual({});
    });
  });

  describe('getCurrentPage', () => {
    let mockAstro: AstroGlobal;
    let mockSections: PageProps[];

    beforeEach(() => {
      // Astro.urlのモック
      mockAstro = {
        url: new URL('http://localhost:4321/k/ja/start/'),
      } as AstroGlobal;

      // テスト用のセクションデータ
      mockSections = [
        {
          isHome: false,
          isSection: true,
          title: 'はじめる',
          relPermalink: '/k/ja/start',
          permalink: '/k/ja/start',
          lang: 'ja',
          weight: 1,
          params: {},
          sections: [],
          pages: [
            {
              isHome: false,
              isSection: false,
              title: 'kintoneとは',
              relPermalink: '/k/ja/start/whatskintone',
              permalink: '/k/ja/start/whatskintone',
              lang: 'ja',
              weight: 1,
              params: {},
              sections: [],
              pages: [],
            }
          ],
        }
      ];
    });

    it('ホームページパスの場合、ホームページデータを返すこと', () => {
      mockAstro.url = new URL('http://localhost:4321/');
      const result = getCurrentPage(mockAstro, mockSections);
      
      expect(result.isHome).toBe(true);
      expect(result.title).toBe('kintone ヘルプ');
    });

    it('/k/パスの場合、ホームページデータを返すこと', () => {
      mockAstro.url = new URL('http://localhost:4321/k/');
      const result = getCurrentPage(mockAstro, mockSections);
      
      expect(result.isHome).toBe(true);
      expect(result.title).toBe('kintone ヘルプ');
    });

    it('セクションページを正しく見つけること', () => {
      mockAstro.url = new URL('http://localhost:4321/k/ja/start');
      const result = getCurrentPage(mockAstro, mockSections);
      
      expect(result.title).toBe('はじめる');
      expect(result.isSection).toBe(true);
      expect(result.relPermalink).toBe('/k/ja/start');
    });

    it('末尾スラッシュありのセクションページを正しく見つけること', () => {
      mockAstro.url = new URL('http://localhost:4321/k/ja/start/');
      const result = getCurrentPage(mockAstro, mockSections);
      
      expect(result.title).toBe('はじめる');
      expect(result.isSection).toBe(true);
      expect(result.relPermalink).toBe('/k/ja/start');
    });

    it('通常ページを正しく見つけること', () => {
      mockAstro.url = new URL('http://localhost:4321/k/ja/start/whatskintone');
      const result = getCurrentPage(mockAstro, mockSections);
      
      expect(result.title).toBe('kintoneとは');
      expect(result.isSection).toBe(false);
      expect(result.relPermalink).toBe('/k/ja/start/whatskintone');
    });

    it('存在しないページの場合、エラーをスローすること', () => {
      mockAstro.url = new URL('http://localhost:4321/k/ja/nonexistent');
      
      expect(() => {
        getCurrentPage(mockAstro, mockSections);
      }).toThrow('ページが見つかりません: /k/ja/nonexistent');
    });

    it('深い階層のページも検索できること', () => {
      // 深い階層のテストデータを追加
      const deepPage: PageProps = {
        isHome: false,
        isSection: false,
        title: '深いページ',
        relPermalink: '/k/ja/start/sub/deep',
        permalink: '/k/ja/start/sub/deep',
        lang: 'ja',
        weight: 1,
        params: {},
        sections: [],
        pages: [],
      };

      const subSection: PageProps = {
        isHome: false,
        isSection: true,
        title: 'サブセクション',
        relPermalink: '/k/ja/start/sub',
        permalink: '/k/ja/start/sub',
        lang: 'ja',
        weight: 2,
        params: {},
        sections: [],
        pages: [deepPage],
      };

      mockSections[0].sections = [subSection];

      mockAstro.url = new URL('http://localhost:4321/k/ja/start/sub/deep');
      const result = getCurrentPage(mockAstro, mockSections);
      
      expect(result.title).toBe('深いページ');
      expect(result.relPermalink).toBe('/k/ja/start/sub/deep');
    });
  });

  // 内部関数のテスト
  describe('normalizePathname', () => {
    it('末尾のスラッシュを除去すること', () => {
      expect(normalizePathname('/path/')).toBe('/path');
      expect(normalizePathname('/path/to/page/')).toBe('/path/to/page');
    });

    it('末尾にスラッシュがない場合はそのまま返すこと', () => {
      expect(normalizePathname('/path')).toBe('/path');
      expect(normalizePathname('/path/to/page')).toBe('/path/to/page');
    });
  });

  describe('removeKPrefix', () => {
    it('/k/プレフィックスを除去すること', () => {
      expect(removeKPrefix('/k/ja/start')).toBe('/ja/start');
      expect(removeKPrefix('/k/ja/start/page')).toBe('/ja/start/page');
    });

    it('/k/プレフィックスがない場合はそのまま返すこと', () => {
      expect(removeKPrefix('/ja/start')).toBe('/ja/start');
      expect(removeKPrefix('/other/path')).toBe('/other/path');
    });
  });

  describe('getPathSegments', () => {
    it('パスを正しくセグメントに分割すること', () => {
      expect(getPathSegments('/ja/start/page')).toEqual(['ja', 'start', 'page']);
      expect(getPathSegments('/ja/start')).toEqual(['ja', 'start']);
    });

    it('空のセグメントを除去すること', () => {
      expect(getPathSegments('/ja//start/page')).toEqual(['ja', 'start', 'page']);
      expect(getPathSegments('//ja/start//')).toEqual(['ja', 'start']);
    });
  });

  describe('isValidPageFile', () => {
    it('有効なページファイルを判定すること', () => {
      expect(isValidPageFile('/src/pages/ja/start/index.mdx')).toBe(true);
      expect(isValidPageFile('/src/pages/ja/start/page.md')).toBe(true);
    });

    it('_dataディレクトリのファイルを除外すること', () => {
      expect(isValidPageFile('/src/pages/_data/test.csv')).toBe(false);
      expect(isValidPageFile('/src/pages/ja/_data/config.json')).toBe(false);
    });
  });

  describe('createPageData', () => {
    it('ファイルパスからページデータを作成すること', () => {
      const filepath = '/src/pages/ja/start/index.mdx';
      const module = {
        frontmatter: {
          title: 'スタートガイド',
          description: 'テスト説明',
          weight: 10,
          params: { test: 'value' }
        }
      };

      const result = createPageData(filepath, module);

      expect(result.title).toBe('スタートガイド');
      expect(result.description).toBe('テスト説明');
      expect(result.weight).toBe(10);
      expect(result.params).toEqual({ test: 'value' });
      expect(result.relPermalink).toBe('/k/ja/start');
      expect(result.isSection).toBe(true); // index.mdx なのでセクション
      expect(result.lang).toBe('ja');
    });

    it('frontmatterがない場合でもデフォルト値を設定すること', () => {
      const filepath = '/src/pages/ja/start/page.md';
      const module = {};

      const result = createPageData(filepath, module);

      expect(result.title).toBe('');
      expect(result.description).toBe('');
      expect(result.weight).toBe(0);
      expect(result.params).toEqual({});
      expect(result.relPermalink).toBe('/k/ja/start/page');
      expect(result.isSection).toBe(false); // page.md なので通常ページ
    });
  });

  describe('findParentSection', () => {
    let sectionsByPath: Map<string, PageProps>;

    beforeEach(() => {
      sectionsByPath = new Map();
      sectionsByPath.set('/ja/start', {
        title: 'スタート',
        relPermalink: '/k/ja/start',
        isSection: true,
      } as PageProps);
      sectionsByPath.set('/ja/start/advanced', {
        title: '上級編',
        relPermalink: '/k/ja/start/advanced',
        isSection: true,
      } as PageProps);
    });

    it('直接の親セクションを見つけること', () => {
      const pathSegments = ['ja', 'start', 'page'];
      const result = findParentSection(pathSegments, sectionsByPath);
      
      expect(result?.title).toBe('スタート');
    });

    it('深い階層の親セクションを見つけること', () => {
      const pathSegments = ['ja', 'start', 'advanced', 'page'];
      const result = findParentSection(pathSegments, sectionsByPath);
      
      expect(result?.title).toBe('上級編');
    });

    it('親セクションが見つからない場合はundefinedを返すこと', () => {
      const pathSegments = ['ja', 'nonexistent', 'page'];
      const result = findParentSection(pathSegments, sectionsByPath);
      
      expect(result).toBeUndefined();
    });
  });

  describe('findPageInTree', () => {
    let pages: PageProps[];

    beforeEach(() => {
      pages = [
        {
          title: 'セクション1',
          relPermalink: '/k/ja/section1',
          isSection: true,
          sections: [
            {
              title: 'サブセクション',
              relPermalink: '/k/ja/section1/sub',
              isSection: true,
              pages: [
                {
                  title: '深いページ',
                  relPermalink: '/k/ja/section1/sub/deep',
                  isSection: false,
                } as PageProps
              ],
            } as PageProps
          ],
          pages: [
            {
              title: 'ページ1',
              relPermalink: '/k/ja/section1/page1',
              isSection: false,
            } as PageProps
          ],
        } as PageProps
      ];
    });

    it('トップレベルのセクションを見つけること', () => {
      const result = findPageInTree(pages, '/k/ja/section1');
      expect(result?.title).toBe('セクション1');
    });

    it('ページを見つけること', () => {
      const result = findPageInTree(pages, '/k/ja/section1/page1');
      expect(result?.title).toBe('ページ1');
    });

    it('深い階層のページを見つけること', () => {
      const result = findPageInTree(pages, '/k/ja/section1/sub/deep');
      expect(result?.title).toBe('深いページ');
    });

    it('存在しないページの場合はundefinedを返すこと', () => {
      const result = findPageInTree(pages, '/k/ja/nonexistent');
      expect(result).toBeUndefined();
    });
  });
});

// 統合テスト: getSiteHomeSections の実際の動作テスト  
describe('getSiteHomeSections integration', () => {
  it('ダミーコンテンツから正しいページ構造を構築すること', async () => {
    const sections = await getSiteHomeSections();
    
    // トップレベルセクションが2つ存在すること（start, guide）
    expect(sections).toHaveLength(2);
    
    // weight順でソートされているか確認
    const sectionTitles = sections.map(s => s.title);
    expect(sectionTitles).toEqual(['スタートガイド', 'ガイド']);
    
    // startセクション（.mdx）
    const startSection = sections.find(s => s.title === 'スタートガイド')!;
    expect(startSection.relPermalink).toBe('/k/ja/start');
    expect(startSection.isSection).toBe(true);
    expect(startSection.weight).toBe(1);
    
    const whatskintone = startSection.pages?.find(p => p.title === 'kintoneとは');
    expect(whatskintone).toBeDefined();
    expect(whatskintone!.relPermalink).toBe('/k/ja/start/whatskintone');
    expect(whatskintone!.isSection).toBe(false);
    
    const advancedSection = startSection.sections?.find(s => s.title === '上級編');
    expect(advancedSection).toBeDefined();
    expect(advancedSection!.relPermalink).toBe('/k/ja/start/advanced');
    expect(advancedSection!.isSection).toBe(true);
    
    // guideセクション（.md）
    const guideSection = sections.find(s => s.title === 'ガイド')!;
    expect(guideSection.relPermalink).toBe('/k/ja/guide');
    expect(guideSection.isSection).toBe(true);
    expect(guideSection.weight).toBe(2);
    
    const basicPage = guideSection.pages?.find(p => p.title === '基本操作');
    expect(basicPage).toBeDefined();
    expect(basicPage!.relPermalink).toBe('/k/ja/guide/basic');
    expect(basicPage!.isSection).toBe(false);
  });

  it('親子関係が正しく設定されること', async () => {
    const sections = await getSiteHomeSections();
    const homeData = getSiteHome();
    
    // 各セクションの親はホーム
    sections.forEach(section => {
      expect(section.parent).toEqual(homeData);
    });
    
    // 個別のテスト
    const startSection = sections.find(s => s.title === 'スタートガイド')!;
    const guideSection = sections.find(s => s.title === 'ガイド')!;
    
    // startセクション内の関係
    const advancedSection = startSection.sections?.find(s => s.title === '上級編');
    const whatskintone = startSection.pages?.find(p => p.title === 'kintoneとは');
    const customization = advancedSection?.pages?.[0];
    
    expect(advancedSection?.parent).toEqual(startSection);
    expect(whatskintone?.parent).toEqual(startSection);
    expect(customization?.parent).toEqual(advancedSection);
    
    // guideセクション内の関係  
    const basicPage = guideSection.pages?.find(p => p.title === '基本操作');
    expect(basicPage?.parent).toEqual(guideSection);
  });

  it('ページとセクションが weight でソートされること', async () => {
    const sections = await getSiteHomeSections();
    
    // トップレベルセクションがweight順でソートされていること
    const weights = sections.map(s => s.weight);
    expect(weights).toEqual([1, 2]); // start, guide
    
    // 各セクション内でもソートされていること確認
    sections.forEach(section => {
      if (section.pages && section.pages.length > 1) {
        for (let i = 0; i < section.pages.length - 1; i++) {
          expect(section.pages[i].weight).toBeLessThanOrEqual(section.pages[i + 1].weight);
        }
      }
      
      if (section.sections && section.sections.length > 1) {
        for (let i = 0; i < section.sections.length - 1; i++) {
          expect(section.sections[i].weight).toBeLessThanOrEqual(section.sections[i + 1].weight);
        }
      }
    });
  });
});