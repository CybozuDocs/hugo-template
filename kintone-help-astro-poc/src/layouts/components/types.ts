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

  // FAQ リンク
  faqLink?: string;
}

export interface PageProps {
  // 基本情報（パスから計算される値）
  isHome: boolean;
  isSection: boolean;
  relPermalink: string;
  permalink?: string;
  lang: string;

  // FrontMatterから取得した値
  frontmatter: {
    title: string;
    titleUs?: string;
    titleCn?: string;
    description: string;
    weight: number;
    type: string;
    disabled: string[];
    aliases: string[];
    labels: string[];
  };

  // ページ階層
  currentSection?: PageProps;
  parent?: PageProps;
  firstSection?: PageProps;

  // コンテンツ
  content?: string;

  // ナビゲーション
  pages?: PageProps[];
  sections?: PageProps[];
  nextInSection?: PageProps;
  prevInSection?: PageProps;
  siteNext?: PageProps;
  sitePrev?: PageProps;

  // ファイル情報
  fileContentBaseName?: string;
  aliases?: string[];

  // 関数
  isAncestor?: (target: PageProps) => boolean;
}

export interface BaseProps {
  page: PageProps;
}

// ApplyParams用の型定義
export interface ReplaceParams {
  kintone?: string;
  service?: string;
  store?: string;
  product?: string;
  domain?: string;
  cybozu_com?: string;
  slash_help?: string;
  slash?: string;
  CorpName?: string;
  service_type?: string;
  help?: string;
  product_name?: string;
  slash_ui?: string;
  slash_administrators?: string;
  slash_service_name?: string;
  [key: string]: string | undefined;
}

// TreeNav関連の型定義
export interface TreeNavEntry {
  title: string;
  relPermalink: string;
  weight?: number;
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
