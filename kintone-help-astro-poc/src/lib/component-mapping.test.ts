import { describe, it, expect } from 'vitest';
import { getEnvValueForComponent, COMPONENT_TO_ENV_MAPPING, isSupportedComponent } from './component-mapping';
import { buildEnvConfig } from './env';

describe('component-mapping', () => {
  const mockEnv = buildEnvConfig({
    languageCode: 'ja-jp',
    targetRegion: 'JP',
    useWovn: false,
    meganav: false,
  });

  describe('COMPONENT_TO_ENV_MAPPING', () => {
    it('必要なコンポーネントのマッピングが定義されている', () => {
      expect(COMPONENT_TO_ENV_MAPPING).toEqual({
        Kintone: 'kintone',
        CybozuCom: 'cybozuCom',
        Store: 'store',
        Slash: 'slash',
        SlashUi: 'slashUi',
        Service: 'service',
        SlashAdministrators: 'slashAdministrators',
        SlashHelp: 'slashHelp',
      });
    });
  });

  describe('getEnvValueForComponent', () => {
    it('マッピングされたコンポーネントの値を正しく取得する', () => {
      // Kintoneコンポーネントに対して、env.kintoneの値が返される
      const kintoneValue = getEnvValueForComponent('Kintone', mockEnv);
      expect(kintoneValue).toBe(mockEnv.kintone);
      
      // CybozuComコンポーネントに対して、env.cybozuComの値が返される
      const cybozuComValue = getEnvValueForComponent('CybozuCom', mockEnv);
      expect(cybozuComValue).toBe(mockEnv.cybozuCom);
      
      // Serviceコンポーネントに対して、env.serviceの値が返される
      const serviceValue = getEnvValueForComponent('Service', mockEnv);
      expect(serviceValue).toBe(mockEnv.service);
    });

    it('存在しないコンポーネントに対してエラーを投げる', () => {
      expect(() => getEnvValueForComponent('NonExistentComponent', mockEnv))
        .toThrow('Unsupported component: NonExistentComponent');
      expect(() => getEnvValueForComponent('DevnetTop', mockEnv))
        .toThrow('Unsupported component: DevnetTop');
      expect(() => getEnvValueForComponent('AdminButtonLabel', mockEnv))
        .toThrow('Unsupported component: AdminButtonLabel');
    });

    it('env値が空の場合エラーを投げる', () => {
      const emptyEnv = { ...mockEnv, kintone: '' };
      expect(() => getEnvValueForComponent('Kintone', emptyEnv))
        .toThrow("Environment value not set for component 'Kintone' (env key: 'kintone')");
    });
  });

  describe('isSupportedComponent', () => {
    it('対応済みコンポーネントでtrueを返す', () => {
      expect(isSupportedComponent('Kintone')).toBe(true);
      expect(isSupportedComponent('Service')).toBe(true);
      expect(isSupportedComponent('CybozuCom')).toBe(true);
    });

    it('未対応コンポーネントでfalseを返す', () => {
      expect(isSupportedComponent('Yeah')).toBe(false);
      expect(isSupportedComponent('DevnetTop')).toBe(false);
      expect(isSupportedComponent('NonExistentComponent')).toBe(false);
    });
  });

});