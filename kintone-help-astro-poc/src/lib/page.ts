import type { PageProps } from "../layouts/components/types";

/**
 * サイトのホームページ情報を取得
 * Hugo の .Site.Home に対応
 */
export function getSiteHome(): PageProps {
  // TODO: 実際のサイトホーム情報を実装
  return {
    isHome: true,
    isSection: false,
    title: "kintone ヘルプ",
    relPermalink: "/",
    permalink: "/",
    lang: "ja",
    weight: 0,
    params: {}
  };
}

/**
 * サイトホームのセクション一覧を取得
 * Hugo の .Site.Home.Sections に対応
 */
export function getSiteHomeSections(): PageProps[] {
  // TODO: 実際のサイトホームセクション一覧を実装
  return [];
}

/**
 * サイト内の全ページ一覧を取得
 * Hugo の .Site.RegularPages に対応
 */
export function getRegularPages(): PageProps[] {
  // TODO: 実際のサイト内ページ一覧を実装
  return [];
}