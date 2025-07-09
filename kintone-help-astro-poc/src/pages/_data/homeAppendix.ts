/**
 * ホームページ付録用のメニューデータ
 */

export type HomeAppendixItemType = 'category' | 'link';

export interface HomeAppendixItem {
  type: HomeAppendixItemType;
  title: string;
  icon?: string;
  url?: string;
}

export interface HomeAppendixData {
  JP: HomeAppendixItem[];
  US: HomeAppendixItem[];
  CN: HomeAppendixItem[];
}

/**
 * ホーム付録メニューアイテムデータ
 */
export const homeAppendixData: HomeAppendixData = {
  JP: [
    { type: "category", title: "よくあるご質問", icon: "fas fa-headset" },
    { type: "link", title: "kintone FAQ", url: "https://kintone-faq.cybozu.co.jp/hc/ja" },
    { type: "link", title: "cybozu.com FAQ", url: "https://faq.cybozu.info/alphascope/cybozu/web/cybozu.com/" },
    { type: "category", title: "コミュニティ", icon: "far fa-comments" },
    { type: "link", title: "キンコミ kintone user community", url: "https://kincom.cybozu.co.jp/" },
    { type: "link", title: "cybozu developer network", url: "https://cybozu.dev/" },
    { type: "category", title: "学ぶ", icon: "fas fa-pencil-alt" },
    { type: "link", title: "ここからはじまるkintone導入ガイドブック", url: "https://kintone.cybozu.co.jp/r/kokokaraguide/" },
    { type: "link", title: "機能別！便利に使おうガイドブック", url: "https://kintone.cybozu.co.jp/material/#guidebook" },
    { type: "link", title: "動画で基礎から応用まで学ぶ", url: "https://kintone.cybozu.co.jp/seminar/ondemand.html?utm_source=ki_helpsite&utm_medium=website&utm_campaign=movie" }
  ],
  US: [
    { type: "category", title: "コミュニティ", icon: "far fa-comments" },
    { type: "link", title: "Kintone Developer Program", url: "https://kintone.dev/" },
    { type: "category", title: "学ぶ", icon: "fas fa-pencil-alt" },
    { type: "link", title: "動画で学ぶ", url: "https://www.youtube.com/playlist?list=PLJOThIyQA7oO3I-EJ1_qFrZa_f_caz3S9" }
  ],
  CN: [
    { type: "category", title: "コミュニティ", icon: "far fa-comments" },
    { type: "link", title: "cybozu developer network", url: "https://cybozudev.kf5.com/hc/" },
    { type: "category", title: "学ぶ", icon: "fas fa-pencil-alt" },
    { type: "link", title: "機能別！便利に使おうガイドブック", url: "https://www.cybozu.cn/jp/products/kintone/material.html" },
    { type: "link", title: "動画で基礎から応用まで学ぶ", url: "https://www.cybozu.cn/jp/products/kintone/video.html" }
  ]
};