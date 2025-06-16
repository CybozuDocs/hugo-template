/**
 * 環境変数からサイト設定オブジェクトを構築する関数
 */
export const buildEnvConfig = (
  options: {
    languageCode?: string;
    targetRegion?: string;
    useWovn?: boolean;
    meganav?: boolean;
  } = {}
) => {
  const {
    languageCode,
    targetRegion,
    useWovn = false,
    meganav,
  } = options;

  const currentLangCode =
    languageCode || import.meta.env.PUBLIC_LANGUAGE_CODE || "ja-jp";

  return {
    languageCode: currentLangCode,
    useWovn: useWovn,
    dataWovnio: import.meta.env.PUBLIC_DATA_WOVNIO || "",
    baseURL: import.meta.env.PUBLIC_BASE_URL || "",
    serviceType: import.meta.env.PUBLIC_SERVICE_TYPE || "",
    serviceTypeId: import.meta.env.PUBLIC_SERVICE_TYPE_ID || "",
    productName: import.meta.env.PUBLIC_PRODUCT_NAME || "",
    help: import.meta.env.PUBLIC_HELP || "",
    domain: import.meta.env.PUBLIC_DOMAIN || "",
    ogImg: import.meta.env.PUBLIC_OG_IMG || "",
    staging: import.meta.env.PUBLIC_STAGING || "",
    favicon: import.meta.env.PUBLIC_FAVICON || "",
    targetRegion: targetRegion || import.meta.env.PUBLIC_TARGET_REGION || "JP",
    customCss: import.meta.env.PUBLIC_CUSTOM_CSS || "",
    meganav:
      meganav !== undefined
        ? meganav
        : import.meta.env.PUBLIC_MEGANAV === "true",
    googleSearch: import.meta.env.PUBLIC_GOOGLE_SEARCH === "true",
    bingSearch: import.meta.env.PUBLIC_BING_SEARCH === "true",
    idSearch: import.meta.env.PUBLIC_ID_SEARCH === "true",
    chat: import.meta.env.PUBLIC_CHAT || "",
    chatMenuPrefix: import.meta.env.PUBLIC_CHAT_MENU_PREFIX || "",
    logo: import.meta.env.PUBLIC_LOGO || "",
    logoAlt: import.meta.env.PUBLIC_LOGO_ALT || "",
    previewSite: import.meta.env.PUBLIC_PREVIEW_SITE === "true",
    searchAll: import.meta.env.PUBLIC_SEARCH_ALL || "",
    langSelector: import.meta.env.PUBLIC_LANG_SELECTOR === "true",
    googleSearchTabs: import.meta.env.PUBLIC_GOOGLE_SEARCH_TABS || "",
    bingSearchTabs: import.meta.env.PUBLIC_BING_SEARCH_TABS || "",
    service: import.meta.env.PUBLIC_SERVICE || "",
    cybozuCom: import.meta.env.PUBLIC_CYBOZU_COM || "",
    kintone: import.meta.env.PUBLIC_KINTONE || "",
    devnetName: import.meta.env.PUBLIC_DEVNET_NAME || "",
    devnetUrl: import.meta.env.PUBLIC_DEVNET_URL || "",
    supportInquiry: import.meta.env.PUBLIC_SUPPORT_INQUIRY || "",
    defaultContentLanguage: import.meta.env.PUBLIC_DEFAULT_CONTENT_LANGUAGE || "",
    footerLinks: import.meta.env.PUBLIC_FOOTER_LINKS || "",
    corpName: import.meta.env.PUBLIC_CORP_NAME || "",
    store: import.meta.env.PUBLIC_STORE || "",
    slash: import.meta.env.PUBLIC_SLASH || "",
    slashHelp: import.meta.env.PUBLIC_SLASH_HELP || "",
    slashAdministrators: import.meta.env.PUBLIC_SLASH_ADMINISTRATORS || "",
    slashUi: import.meta.env.PUBLIC_SLASH_UI || "",
    labelLead: import.meta.env.PUBLIC_LABEL_LEAD || "",
    labelContents: import.meta.env.PUBLIC_LABEL_CONTENTS || "",
    labelColors: import.meta.env.PUBLIC_LABEL_COLORS || "",
    languageData: import.meta.env.PUBLIC_LANGUAGE_DATA
      ? JSON.parse(import.meta.env.PUBLIC_LANGUAGE_DATA)
      : undefined,
  };
};

/**
 * 環境変数設定の型定義
 */
export type EnvConfig = ReturnType<typeof buildEnvConfig>;

/**
 * 環境変数設定のグローバルインスタンス
 * buildEnvConfig をデフォルト引数で実行した結果を Readonly で export
 */
export const env: Readonly<EnvConfig> = buildEnvConfig();
