/**
 * 環境変数から言語固有の設定値を取得するユーティリティ関数
 */
export const getLocalizedEnvValue = (key: string, langCode: string): string => {
  const langSuffix = langCode.toUpperCase().replace('-', '_');
  const localizedKey = `PUBLIC_${key}_${langSuffix}`;
  const defaultKey = `PUBLIC_${key}_JA`; // デフォルトは日本語
  
  return import.meta.env[localizedKey] || import.meta.env[defaultKey] || import.meta.env[`PUBLIC_${key}`] || '';
};

/**
 * 環境変数からサイト設定オブジェクトを構築する関数
 */
export const buildEnvConfig = (options: {
  languageCode?: string;
  product?: string;
  targetRegion?: string;
  useWovn?: boolean;
  meganav?: boolean;
} = {}) => {
  const {
    languageCode,
    product,
    targetRegion,
    useWovn = false,
    meganav
  } = options;

  const currentLangCode = languageCode || import.meta.env.PUBLIC_LANGUAGE_CODE || 'ja-jp';
  
  return {
    languageCode: currentLangCode,
    useWovn: useWovn,
    dataWovnio: import.meta.env.PUBLIC_DATA_WOVNIO || '',
    baseURL: import.meta.env.PUBLIC_BASE_URL || '',
    serviceType: import.meta.env.PUBLIC_SERVICE_TYPE || '',
    serviceTypeId: import.meta.env.PUBLIC_SERVICE_TYPE_ID || '',
    productName: getLocalizedEnvValue('PRODUCT_NAME', currentLangCode),
    help: getLocalizedEnvValue('HELP', currentLangCode),
    product: product || import.meta.env.PUBLIC_PRODUCT || '',
    domain: import.meta.env.PUBLIC_DOMAIN || '',
    ogImg: import.meta.env.PUBLIC_OG_IMG || '',
    staging: import.meta.env.PUBLIC_STAGING || '',
    favicon: import.meta.env.PUBLIC_FAVICON || '',
    targetRegion: targetRegion || import.meta.env.PUBLIC_TARGET_REGION || 'US',
    templateVersion: import.meta.env.PUBLIC_TEMPLATE_VERSION || '1',
    customCss: import.meta.env.PUBLIC_CUSTOM_CSS || '',
    meganav: meganav !== undefined ? meganav : (import.meta.env.PUBLIC_MEGANAV === 'true'),
    googleSearch: import.meta.env.PUBLIC_GOOGLE_SEARCH === 'true',
    bingSearch: import.meta.env.PUBLIC_BING_SEARCH === 'true',
    chat: import.meta.env.PUBLIC_CHAT || '',
    chatMenuPrefix: import.meta.env.PUBLIC_CHAT_MENU_PREFIX || ''
  };
};

/**
 * 環境変数設定の型定義
 */
export type EnvConfig = ReturnType<typeof buildEnvConfig>;