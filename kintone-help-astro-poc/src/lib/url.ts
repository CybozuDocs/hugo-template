/**
 * URL関連のユーティリティ関数
 */

/**
 * Astro.url から permalink と relPermalink を生成する
 * 
 * @param url - Astro.url オブジェクト
 * @param domain - ドメイン名（例: "help.kintone.com"）
 * @returns permalink（絶対URL）と relPermalink（相対パス）
 */
export function getPermalinks(url: URL, domain: string) {
  // パスを取得（トレイリングスラッシュを確保）
  let pathname = url.pathname;
  if (!pathname.endsWith('/')) {
    pathname += '/';
  }

  // 絶対URLを構築（プロトコルは https を使用）
  const permalink = `https://${domain}${pathname}`;

  return {
    permalink,
    relPermalink: pathname
  };
}

/**
 * ホームページかどうかを判定する
 * 
 * @param pathname - URLのパス部分
 * @returns ホームページの場合はtrue
 */
export function isHomePage(pathname: string): boolean {
  // トレイリングスラッシュを除去して比較
  const normalizedPath = pathname.replace(/\/$/, '');
  return normalizedPath === '' || normalizedPath === '/index';
}

/**
 * 言語コードからlangプロパティを取得する
 * 
 * @param languageCode - 言語コード（例: "ja-jp", "en-us"）
 * @returns 短縮言語コード（例: "ja", "en"）
 */
export function getLangFromLanguageCode(languageCode: string): string {
  return languageCode.split('-')[0];
}