# Permalink/RelPermalink 移行作業履歴

## ユーザーからの指示

> Astroへの移行作業です。
> 
> PageLayout.astro から、Head コンポーネントへの page プロパティが正しく渡るようにしたいです。
> そのために、まずは一部の Props の実装を見直したいです。
> 
> 今回は、permalink および relPermalink を見直したいです。
> 
> これは、もとは以下の実装です。
> 
> https://gohugo.io/methods/resource/permalink/
> https://gohugo.io/methods/page/relpermalink/
> 
> これを、Astro.url を利用した関数などに置き換えることはできませんか？
> https://docs.astro.build/en/reference/api-reference/#url
> 関数を作る場合は lib/ 配下にお願いします。

## 実施内容

### 1. 現状調査
- Head.astro コンポーネントの Props 定義を確認
- page オブジェクトに permalink と relPermalink が必要であることを確認
- Hugo での使用状況を確認

### 2. 実装方針の決定
- Astro.url を使って permalink と relPermalink を生成する関数を作成
- PageLayout.astro で page オブジェクトを構築して Head コンポーネントに渡す

### 3. 実装

#### lib/url.ts の作成
以下の関数を実装：
- `getPermalinks(url: URL, domain: string)`: permalink と relPermalink を生成
- `isHomePage(pathname: string)`: ホームページ判定
- `getLangFromLanguageCode(languageCode: string)`: 言語コード変換

#### PageLayout.astro の修正
- url関連の関数をインポート
- Astro.url から permalink と relPermalink を生成
- page オブジェクトを構築
- Head コンポーネントに pageData を渡すように修正

### 4. 主な変更点

**変更前:**
```astro
<Head env={envConfig} page={Astro.url} />
```

**変更後:**
```astro
// permalink と relPermalink を生成
const permalinks = getPermalinks(Astro.url, envConfig.domain);

// page オブジェクトを構築
const pageData = {
  isHome: isHomePage(Astro.url.pathname),
  description: frontmatter.description,
  content: content,
  permalink: permalinks.permalink,
  relPermalink: permalinks.relPermalink,
  params: {
    type: type,
    nolink: false,
  },
  lang: getLangFromLanguageCode(languageCode),
};

<Head env={envConfig} page={pageData} />
```

## 結果
- Astro.url を使用して Hugo の `.Permalink` と `.RelPermalink` と同等の機能を実現
- PageLayout.astro から Head コンポーネントに適切な page オブジェクトが渡されるようになった
- トレイリングスラッシュの処理も含めて実装

## 今後の課題
- params.nolink の実際の値の設定
- isHome の判定ロジックの確認（特にサブディレクトリでのデプロイ時）
- 多言語対応時のURL構造の確認