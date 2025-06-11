/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_BASE_URL: string;
  readonly PUBLIC_DOMAIN: string;
  readonly PUBLIC_TARGET_REGION: "JP" | "US" | "CN";
  readonly PUBLIC_KINTONE: string;
  readonly PUBLIC_SERVICE: string;
  readonly PUBLIC_CYBOZU_COM: string;
  readonly PUBLIC_FAVICON: string;
  readonly PUBLIC_LOGO: string;
  readonly PUBLIC_OG_IMG: string;
  readonly PUBLIC_LOGO_ALT?: string;

  readonly PUBLIC_LANG_SELECTOR: string;
  readonly PUBLIC_MEGANAV: string;
  readonly PUBLIC_JSON_TREE: string;
  readonly PUBLIC_GOOGLE_SEARCH?: string;
  readonly PUBLIC_BING_SEARCH?: string;
  readonly PUBLIC_ID_SEARCH: string;
  readonly PUBLIC_USE_WOVN?: string;

  readonly PUBLIC_DEVNET_NAME: string;
  readonly PUBLIC_DEVNET_URL: string;
  readonly PUBLIC_DATA_WOVNIO?: string;
  readonly PUBLIC_SUPPORT_INQUIRY?: string;
  readonly PUBLIC_STAGING?: string;
  readonly PUBLIC_CHAT?: string;
  readonly PUBLIC_CHAT_MENU_PREFIX?: string;
  readonly PUBLIC_SERVICE_TYPE?: string;
  readonly PUBLIC_SERVICE_TYPE_ID?: string;

  readonly PUBLIC_CUSTOM_CSS: string;
  readonly PUBLIC_LABEL_COLORS?: string;

  readonly PUBLIC_DEFAULT_CONTENT_LANGUAGE: string;
  readonly PUBLIC_LANGUAGE_CODE: string;

  readonly PUBLIC_PRODUCT_NAME: string;
  readonly PUBLIC_HELP: string;
  readonly PUBLIC_GOOGLE_SEARCH_TABS?: string;
  readonly PUBLIC_BING_SEARCH_TABS?: string;
  readonly PUBLIC_FOOTER_LINKS?: string;
  readonly PUBLIC_CORP_NAME: string;
  readonly PUBLIC_STORE: string;
  readonly PUBLIC_SLASH: string;
  readonly PUBLIC_SLASH_HELP: string;
  readonly PUBLIC_SLASH_ADMINISTRATORS: string;
  readonly PUBLIC_SLASH_UI: string;
  
  readonly PUBLIC_LABEL_LEAD?: string;
  readonly PUBLIC_LABEL_CONTENTS?: string;

  [key: string]: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
