/**
 * フッターリンク用のデータ
 */

export interface LinkItem {
  categoryId: string;
  title: string;
  url?: string;
}

export interface LinksData {
  JP: LinkItem[];
  US: LinkItem[];
  CN: LinkItem[];
}

/**
 * フッターリンクデータ
 */
export const linksData: LinksData = {
  JP: [
    { categoryId: "1", title: "Cybozu" },
    { categoryId: "1", title: "サイボウズ株式会社", url: "https://cybozu.co.jp/" },
    { categoryId: "1", title: "動作環境", url: "https://www.cybozu.com/jp/service/requirements.html" },
    { categoryId: "1", title: "制限事項", url: "https://www.cybozu.com/jp/service/restrictions.html" },
    { categoryId: "1", title: "cybozu.com稼働状況", url: "https://status.cybozu.com/status/" },
    { categoryId: "2", title: "kintone" },
    { categoryId: "2", title: "製品サイト", url: "https://kintone.cybozu.co.jp/" },
    { categoryId: "2", title: "料金", url: "https://kintone.cybozu.co.jp/price/" },
    { categoryId: "2", title: "アップデート情報", url: "https://kintone.cybozu.co.jp/update/main/" },
    { categoryId: "3", title: "サポート" },
    { categoryId: "3", title: "カスタマーサポートに問い合わせる", url: "/k/ja/id/040321.html" },
    { categoryId: "3", title: "Webブラウザーのトラブル解決方法", url: "https://jp.cybozu.help/ja/id/01067.html" },
    { categoryId: "4", title: "関連情報" },
    { categoryId: "4", title: "サイトマップ", url: "/k/ja/sitemap.html" },
    { categoryId: "4", title: "kintone ヘルプ記事番号検索", url: "/k/ja/search_id.html" },
    { categoryId: "4", title: "cybozu.com ヘルプ記事番号検索", url: "https://jp.cybozu.help/general/ja/search_id.html" },
    { categoryId: "4", title: "cybozu.com Store ヘルプ記事番号検索", url: "https://jp.cybozu.help/s/ja/search_id.html" },
    { categoryId: "999", title: "他社商標について", url: "https://cybozu.co.jp/logotypes/other-trademark/" },
    { categoryId: "999", title: "個人情報保護方針", url: "https://cybozu.co.jp/privacy/" }
  ],
  US: [
    { categoryId: "1", title: "Kintone" },
    { categoryId: "1", title: "About Us", url: "https://www.kintone.com/en-us/company" },
    { categoryId: "1", title: "Kintoneに関するお知らせ", url: "https://blog.kintone.com/company-news/tag/product-updates" },
    { categoryId: "1", title: "Kintone Status", url: "https://status.kintone.com/" },
    { categoryId: "2", title: "関連情報" },
    { categoryId: "2", title: "サイトマップ", url: "/k/ja/sitemap.html" },
    { categoryId: "2", title: "ヘルプ記事番号検索", url: "/k/ja/search_id.html" },
    { categoryId: "999", title: "他社商標について", url: "https://cybozu.co.jp/logotypes/other-trademark/" },
    { categoryId: "999", title: "個人情報保護方針", url: "https://www.kintone.com/en-us/privacy-policy/" }
  ],
  CN: [
    { categoryId: "1", title: "Cybozu" },
    { categoryId: "1", title: "Cybozu, Inc.", url: "https://www.cybozu.cn/jp/" },
    { categoryId: "2", title: "kintone" },
    { categoryId: "2", title: "製品サイト", url: "https://www.cybozu.cn/jp/products/kintone/" },
    { categoryId: "2", title: "料金", url: "https://www.cybozu.cn/jp/products/kintone/price.html" },
    { categoryId: "2", title: "アップデート情報", url: "https://www.cybozu.cn/jp/products/kintone/news.html" },
    { categoryId: "3", title: "サポート" },
    { categoryId: "3", title: "Webブラウザーのトラブル解決方法", url: "https://help.cybozu.cn/ja/id/01067.html" },
    { categoryId: "4", title: "関連情報" },
    { categoryId: "4", title: "サイトマップ", url: "/k/ja/sitemap.html" },
    { categoryId: "4", title: "kintone ヘルプ記事番号検索", url: "/k/ja/search_id.html" },
    { categoryId: "4", title: "cybozu.cn ヘルプ記事番号検索", url: "https://help.cybozu.cn/general/ja/search_id.html" },
    { categoryId: "999", title: "他社商標について", url: "https://cybozu.co.jp/logotypes/other-trademark/" },
    { categoryId: "999", title: "プライバシーポリシー", url: "https://www.cybozu.cn/jp/terms/privacy/" }
  ]
};