// 共通の型定義ファイル
// ASTRO_PLAN.md のProps インターフェース設計に基づく

export interface EnvProps {
  // 基本設定
  productName: string;
  baseURL: string;
  domain: string;
  languageCode: string;
  targetRegion: string;
  help: string;

  // 検索設定
  googleSearch?: boolean;
  googleSearchTabs?: string;
  bingSearch?: boolean;
  bingSearchTabs?: string;
  searchAll?: string;
  idSearch?: boolean;

  // 機能フラグ
  meganav?: boolean;
  previewSite?: boolean;
  langSelector?: boolean;
  useWovn?: boolean;
  tocInTree?: boolean;

  // 外部サービス
  dataWovnio?: string;
  serviceType?: string;
  serviceTypeId?: string;
  staging?: string;

  // リソースパス
  logo?: string;
  favicon?: string;
  ogImg?: string;
  footerLinks?: string;
  customCss?: string;

  // チャット設定
  chat?: string;
  chatMenuPrefix?: string;

  // ラベル設定
  labelColors?: string[];
  labelLead?: string;
  labelContents?: string[];

  // 言語データ設定
  languageData?: {
    languages: Array<{
      language_code: string;
      display_name: string;
    }>;
  };

  // サイト構造
  siteHome?: PageProps;
  siteHomeSections?: PageProps[];
  regularPages?: PageProps[];

  // FAQ リンク
  faqLink?: string;

  // その他のプロパティ（互換性のため）
  [key: string]: any;
}

export interface PageProps {
  // 基本情報
  isHome: boolean;
  isSection: boolean;
  title: string;
  description?: string;
  relPermalink: string;
  permalink?: string;
  type?: string;
  lang: string;
  weight: number;

  // ページ階層
  currentSection?: PageProps;
  parent?: PageProps;
  firstSection?: PageProps;

  // パラメータ
  params: {
    weight?: number;
    disabled?: string[];
    nolink?: boolean;
    titleUs?: string;
    titleCn?: string;
    labels?: string[];
    latestPage?: string;
    [key: string]: any;
  };

  // コンテンツ
  content?: string;

  // ナビゲーション
  pages?: PageProps[];
  sections?: PageProps[];
  nextInSection?: PageProps;
  prevInSection?: PageProps;
  siteNext?: PageProps;
  sitePrev?: PageProps;

  // 翻訳
  isTranslated?: boolean;
  allTranslations?: PageProps[];
  translations?: PageProps[];

  // ファイル情報
  fileContentBaseName?: string;
  aliases?: string[];

  // 関数
  isAncestor?: (target: PageProps) => boolean;

  // その他のプロパティ（互換性のため）
  [key: string]: any;
}

export interface BaseProps {
  env: EnvProps;
  page: PageProps;
}

// ApplyParams用の型定義
export interface ReplaceParams {
  kintone?: string;
  service?: string;
  store?: string;
  product?: string;
  domain?: string;
  [key: string]: string | undefined;
}

// TreeNav関連の型定義
export interface TreeNavEntry {
  title: string;
  relPermalink: string;
  weight?: number;
  params?: PageProps['params'];
  pages?: TreeNavEntry[];
  sections?: TreeNavEntry[];
  isSection?: boolean;
  parent?: TreeNavEntry;
}

// Breadcrumb関連の型定義
export interface BreadcrumbItem {
  title: string;
  relPermalink: string;
  isHome: boolean;
}