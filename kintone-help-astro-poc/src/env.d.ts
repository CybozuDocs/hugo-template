/// <reference types="astro/client" />

interface ImportMetaEnv {
  // サイト基本設定
  readonly PUBLIC_BASE_URL: string;
  readonly PUBLIC_TEMPLATE_VERSION: string;
  readonly PUBLIC_PRODUCT: string;
  readonly PUBLIC_DOMAIN: string;
  readonly PUBLIC_TARGET_REGION: string;
  readonly PUBLIC_KINTONE: string;
  readonly PUBLIC_SERVICE: string;
  readonly PUBLIC_CYBOZU_COM: string;
  readonly PUBLIC_FAVICON: string;
  readonly PUBLIC_LOGO: string;
  readonly PUBLIC_OG_IMG: string;
  
  // 機能フラグ
  readonly PUBLIC_LANG_SELECTOR: string;
  readonly PUBLIC_MEGANAV: string;
  readonly PUBLIC_JSON_TREE: string;
  readonly PUBLIC_GOOGLE_SEARCH: string;
  readonly PUBLIC_ID_SEARCH: string;
  
  // 外部サービス
  readonly PUBLIC_DEVNET_NAME: string;
  readonly PUBLIC_DEVNET_URL: string;
  readonly PUBLIC_DATA_WOVNIO?: string;
  readonly PUBLIC_STAGING?: string;
  readonly PUBLIC_BING_SEARCH?: string;
  readonly PUBLIC_CHAT?: string;
  readonly PUBLIC_CHAT_MENU_PREFIX?: string;
  readonly PUBLIC_SERVICE_TYPE?: string;
  readonly PUBLIC_SERVICE_TYPE_ID?: string;
  
  // カスタムCSS
  readonly PUBLIC_CUSTOM_CSS: string;
  
  // ラベル色設定
  readonly PUBLIC_LABEL_COLORS: string;
  
  // 言語設定
  readonly PUBLIC_DEFAULT_CONTENT_LANGUAGE: string;
  readonly PUBLIC_LANGUAGE_CODE: string;
  
  // 日本語設定
  readonly PUBLIC_PRODUCT_NAME_JA: string;
  readonly PUBLIC_HELP_JA: string;
  readonly PUBLIC_GOOGLE_SEARCH_TABS_JA: string;
  readonly PUBLIC_FOOTER_LINKS_JA: string;
  readonly PUBLIC_CORP_NAME_JA: string;
  readonly PUBLIC_STORE_JA: string;
  readonly PUBLIC_SLASH_JA: string;
  readonly PUBLIC_SLASH_HELP_JA: string;
  readonly PUBLIC_SLASH_ADMINISTRATORS_JA: string;
  readonly PUBLIC_SLASH_UI_JA: string;
  readonly PUBLIC_LABEL_LEAD_JA: string;
  readonly PUBLIC_LABEL_CONTENTS_JA: string;
  
  // 英語設定
  readonly PUBLIC_PRODUCT_NAME_EN: string;
  readonly PUBLIC_HELP_EN: string;
  readonly PUBLIC_GOOGLE_SEARCH_TABS_EN: string;
  readonly PUBLIC_FOOTER_LINKS_EN: string;
  readonly PUBLIC_CORP_NAME_EN: string;
  readonly PUBLIC_STORE_EN: string;
  readonly PUBLIC_SLASH_EN: string;
  readonly PUBLIC_SLASH_HELP_EN: string;
  readonly PUBLIC_SLASH_ADMINISTRATORS_EN: string;
  readonly PUBLIC_SLASH_UI_EN: string;
  
  // 中国語（簡体字）設定
  readonly PUBLIC_PRODUCT_NAME_ZH: string;
  readonly PUBLIC_HELP_ZH: string;
  readonly PUBLIC_GOOGLE_SEARCH_TABS_ZH: string;
  readonly PUBLIC_FOOTER_LINKS_ZH: string;
  readonly PUBLIC_CORP_NAME_ZH: string;
  readonly PUBLIC_STORE_ZH: string;
  readonly PUBLIC_SLASH_ZH: string;
  readonly PUBLIC_SLASH_HELP_ZH: string;
  readonly PUBLIC_SLASH_ADMINISTRATORS_ZH: string;
  readonly PUBLIC_SLASH_UI_ZH: string;
  
  // 中国語（繁体字）設定
  readonly PUBLIC_PRODUCT_NAME_ZH_TW: string;
  readonly PUBLIC_HELP_ZH_TW: string;
  readonly PUBLIC_GOOGLE_SEARCH_TABS_ZH_TW: string;
  readonly PUBLIC_FOOTER_LINKS_ZH_TW: string;
  readonly PUBLIC_CORP_NAME_ZH_TW: string;
  readonly PUBLIC_STORE_ZH_TW: string;
  readonly PUBLIC_SLASH_ZH_TW: string;
  readonly PUBLIC_SLASH_HELP_ZH_TW: string;
  readonly PUBLIC_SLASH_ADMINISTRATORS_ZH_TW: string;
  readonly PUBLIC_SLASH_UI_ZH_TW: string;
  
  // 動的に生成される言語固有の設定用
  [key: string]: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}