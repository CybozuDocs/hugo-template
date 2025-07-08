import { describe, it, expect, vi } from 'vitest';
import { replaceFrontMatterString, replaceFrontMatterComponents } from './frontmatter-replacer';

// envをモック
vi.mock('./env', () => ({
  env: {
    kintone: 'kintone',
    service: 'kintone',
    corpName: 'Cybozu',
    cybozuCom: 'cybozu.com',
    devnetName: 'cybozu developer network',
    store: 'kintone',
    slash: '/',
    slashAdministrators: '/admin',
    slashHelp: '/help',
    slashServiceName: '/service',
    slashUi: '/ui',
    slashUiAdministrators: '/ui/admin',
  }
}));

describe('frontmatter-replacer', () => {
  describe('replaceFrontMatterString', () => {
    it('単一のコンポーネントを置換する', () => {
      const input = 'Welcome to <Kintone />!';
      const expected = 'Welcome to kintone!';
      expect(replaceFrontMatterString(input)).toBe(expected);
    });

    it('複数のコンポーネントを置換する', () => {
      const input = '<Kintone /> by <CybozuCom />';
      const expected = 'kintone by cybozu.com';
      expect(replaceFrontMatterString(input)).toBe(expected);
    });

    it('スペースありのコンポーネントを置換する', () => {
      const input = 'Welcome to <Kintone /> service';
      const expected = 'Welcome to kintone service';
      expect(replaceFrontMatterString(input)).toBe(expected);
    });

    it('未対応コンポーネントは無視してそのまま表示', () => {
      const input = 'Hello <NonExistentComponent />';
      const expected = 'Hello <NonExistentComponent />';
      expect(replaceFrontMatterString(input)).toBe(expected);
    });

    it('対象外のコンポーネントは無視してそのまま表示', () => {
      const input = 'Check <DevnetTop /> for more info';
      const expected = 'Check <DevnetTop /> for more info';
      expect(replaceFrontMatterString(input)).toBe(expected);
    });

    it('意図的なコンポーネント風文字列はそのまま表示', () => {
      const input = 'React component: <Yeah /> is awesome!';
      const expected = 'React component: <Yeah /> is awesome!';
      expect(replaceFrontMatterString(input)).toBe(expected);
    });

    it('空文字列やundefinedは変更しない', () => {
      expect(replaceFrontMatterString('')).toBe('');
      expect(replaceFrontMatterString(undefined)).toBe(undefined);
    });

    it('コンポーネント以外の文字列は変更しない', () => {
      const input = 'Regular text without components';
      expect(replaceFrontMatterString(input)).toBe(input);
    });
  });

  describe('replaceFrontMatterComponents', () => {
    it('文字列フィールドのコンポーネントを置換する', () => {
      const input = {
        title: 'Welcome to <Kintone />',
        description: 'This is <Service /> help',
        other: 'No components here'
      };
      const expected = {
        title: 'Welcome to kintone',
        description: 'This is kintone help',
        other: 'No components here'
      };
      expect(replaceFrontMatterComponents(input)).toEqual(expected);
    });

    it('配列内の文字列も置換する', () => {
      const input = {
        tags: ['<Kintone />', '<Service />', 'normal-tag'],
        title: 'Test <CybozuCom />'
      };
      const expected = {
        tags: ['kintone', 'kintone', 'normal-tag'],
        title: 'Test cybozu.com'
      };
      expect(replaceFrontMatterComponents(input)).toEqual(expected);
    });

    it('数値やブール値はそのまま維持する', () => {
      const input = {
        weight: 100,
        published: true,
        title: 'Test <Kintone />',
        config: { nested: true }
      };
      const expected = {
        weight: 100,
        published: true,
        title: 'Test kintone',
        config: { nested: true }
      };
      expect(replaceFrontMatterComponents(input)).toEqual(expected);
    });

    it('空のオブジェクトは変更しない', () => {
      const input = {};
      expect(replaceFrontMatterComponents(input)).toEqual({});
    });

    it('配列内の非文字列要素は変更しない', () => {
      const input = {
        mixed: ['<Kintone />', 123, true, { obj: 'value' }]
      };
      const expected = {
        mixed: ['kintone', 123, true, { obj: 'value' }]
      };
      expect(replaceFrontMatterComponents(input)).toEqual(expected);
    });
  });
});