/**
 * MegaNav用のメニューデータ
 */

export interface MenuItemData {
  id: string;
  title: string;
  url: string;
}

/**
 * メニューアイテムデータ
 */
export const menuItems: MenuItemData[] = [
  { id: "1", title: "Kintoneの使いかた", url: "/k/ja/" },
  { id: "1", title: "スタートガイド", url: "/k/ja/id/040130.html" },
  { id: "1", title: "Kintone共通の操作", url: "/k/ja/id/040830.html" },
  { id: "1", title: "アプリ", url: "/k/ja/id/040840.html" },
  { id: "1", title: "データの検索", url: "/k/ja/id/040688.html" },
  { id: "1", title: "通知", url: "/k/ja/id/040669.html" },
  { id: "1", title: "ポータル", url: "/k/ja/id/040617.html" },
  { id: "1", title: "スペース", url: "/k/ja/id/040691.html" },
  { id: "1", title: "ゲストスペース", url: "/k/ja/id/040639.html" },
  { id: "1", title: "ピープル", url: "/k/ja/id/040679.html" },
  { id: "1", title: "メッセージ", url: "/k/ja/id/040651.html" },
  { id: "1", title: "システム管理", url: "/k/ja/id/0402.html" },
  { id: "1", title: "モバイル", url: "/k/ja/id/040653.html" },
  { id: "1", title: "活用ガイド", url: "/k/ja/id/040732.html" },
  { id: "1", title: "トラブルシューティング", url: "/k/ja/id/040146.html" },

  { id: "2", title: "管理（ユーザー／システム）", url: "/general/ja/" },
  { id: "2", title: "ユーザー管理", url: "/general/ja/id/020138.html" },
  { id: "2", title: "セキュリティ設定", url: "/general/ja/id/02038.html" },
  { id: "2", title: "アカウントの設定", url: "/general/ja/id/020406.html" },
  {
    id: "2",
    title: "ログインに関するトラブル",
    url: "/general/ja/id/020262.html",
  },

  { id: "3", title: "試用／購入", url: "/store/ja/" },
  { id: "3", title: "トライアル", url: "/store/ja/id/03038.html" },
  { id: "3", title: "購入", url: "/store/ja/id/03027.html" },
  { id: "3", title: "支払い方法の変更", url: "/store/ja/id/03018.html" },
  { id: "3", title: "契約の変更", url: "/store/ja/id/0302.html" },
  { id: "3", title: "解約", url: "/store/ja/id/03034.html" },
];
