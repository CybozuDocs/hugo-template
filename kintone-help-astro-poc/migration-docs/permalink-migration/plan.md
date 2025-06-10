# Permalink/RelPermalink 移行計画

## 概要
Hugo の `.Permalink` と `.RelPermalink` を Astro.url を使った実装に置き換える。

## 現状分析

### Hugo での実装
- `.Permalink`: 絶対URL（例: `https://example.com/path/to/page/`）
- `.RelPermalink`: 相対URL（例: `/path/to/page/`）

### 現在の使用箇所
Head.astro コンポーネントの Props として以下が定義されている：
```typescript
page: {
  permalink: string;      // 絶対パス（Hugoの.Permalink相当）
  relPermalink: string;   // 相対パス（Hugoの.RelPermalink相当）
  // ...
}
```

## 実装計画

### 1. Astro.url を使った関数の作成
`lib/url.ts` に以下の関数を実装：

```typescript
// Astro.url から permalink と relPermalink を生成
export function getPermalinks(url: URL, baseURL: string) {
  return {
    permalink: url.href,              // 絶対URL
    relPermalink: url.pathname        // 相対パス
  };
}
```

### 2. PageLayout.astro の修正
現在の実装：
```astro
<Head env={envConfig} page={Astro.url} />
```

修正後：
```astro
---
import { getPermalinks } from '../lib/url.js';

// Permalink の生成
const permalinks = getPermalinks(Astro.url, envConfig.baseURL);

// page オブジェクトの構築
const pageData = {
  isHome: false,  // TODO: 判定ロジック実装
  permalink: permalinks.permalink,
  relPermalink: permalinks.relPermalink,
  params: {},     // TODO: パラメータ実装
  lang: languageCode.split('-')[0],  // ja-jp -> ja
  description: frontmatter.description,
  content: content
};
---

<Head env={envConfig} page={pageData} />
```

### 3. 考慮事項

#### トレイリングスラッシュ
Hugo は通常、URL の末尾にスラッシュを付ける。Astro のデフォルトでは付けない場合があるため、設定を確認する必要がある。

#### ベースパスの扱い
サブディレクトリにデプロイする場合（例: `/help/`）、Astro.url には自動的に含まれるが、適切に処理されているか確認が必要。

#### 言語別URL
多言語対応の場合、URL構造が言語によって異なる可能性がある。

### 4. テスト項目
- [ ] 通常のページでのpermalink/relPermalinkの生成
- [ ] ホームページでの生成
- [ ] サブディレクトリ配下でのページ
- [ ] 言語別ページでの動作確認

## 影響範囲
- PageLayout.astro
- Head.astro（Props の受け取り方）
- 新規作成: lib/url.ts

## 作業手順
1. lib/url.ts の作成
2. PageLayout.astro の修正
3. 動作確認
4. ドキュメント更新