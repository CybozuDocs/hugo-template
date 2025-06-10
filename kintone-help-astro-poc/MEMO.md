# PoC 作業の記録

## PoC 対象画面

次の内容は確認したい

- 簡易的な画面表示
- Partial の移植
- ショートコードの移植
- CSS の適用
- FrontMatter の読み込み

以上を踏まえ、ひとまず「kintone とは？」の移植を目指す
https://jp.cybozu.help/k/ja/start/whatskintone.html

## MDX の有効化

FrontMatter を有効化しつつ、かつコンポーネントも使いたいので、MDX を有効化する

https://docs.astro.build/ja/guides/markdown-content/

```
npx astro add mdx
```

## 静的リソースの複製

旧 `/static` 配下のリソースを、`/public` 配下に複製

## ビルドごとの設定の切り替え

従来、`hugo_jp.toml` などを使って動的なパラメータを渡している。

e.g. 一部を抜粋

```
template_version = "2"
product = "kintone"
domain = "jp.cybozu.help"
TargetRegion = "JP"
kintone = "kintone"
service = "cybozu.com"
cybozu_com = "cybozu.com"
favicon = "img/kintone_favicon.ico"

...
```

リージョンを再現する場合では、これと同等の機構が必要になる。
ビルド時に BUILD_ENV みたいなものを渡して、それに応じて env ファイルを読み分けるといいかも？

## ID 用アンカーの差し替え

MDX からの RenderHooks で差し込んでいるケースが非常に多い
https://gohugo.io/render-hooks/headings/

## タイトル部分の動的部分の差し替えはどうするか？

```
title: "{{< kintone >}} Help"
```

みたいなものがある。これをうまく差し替えてあげないといけない。

### 案

{{Kintone}} とかの指定で、これを文字列として Dynamic Import とみなして変換する、というのはあるかも

## hugo-template 内の i18n 周りの対応

テンプレート内に含まれてしまっている文言については、
従来は Hugo の i18n 周りの仕組みを使っていた。
WOVN に寄せる必要がありそう。

## Claude に全 Paritial 移植を検討させて出してきた懸念点

```
## 移植計画と課題の洗い出し

### Hugo 特有の機能と移植時の課題

1. **i18n 関数**
   - 使用箇所: ほぼすべてのコンポーネント
   - 例: `{{ i18n "Contact_support"}}`
   - 対応案: Astro の i18n ライブラリ（astro-i18n など）を使用するか、独自の i18n システムを構築

2. **Hugo のサイト変数とパラメータ**
   - 使用箇所: すべてのコンポーネント
   - 例: `$.Site.Params.product`, `$.Site.BaseURL`, `.Site.LanguageCode`
   - 対応案: Astro の環境変数や設定ファイルで管理し、Props として渡す

3. **Hugo のページ変数**
   - 使用箇所: navigation系、breadcrumb など
   - 例: `.CurrentSection`, `.Parent`, `.FirstSection`, `.IsHome`, `.RelPermalink`
   - 対応案: ページ情報を含むオブジェクトを Props として受け取る

4. **Hugo のコレクション操作**
   - 使用箇所: treenav, meganav など
   - 例: `.Pages.ByWeight`, `.Sections`, `union`, `where`
   - 対応案: JavaScript の配列メソッドで実装

5. **Hugo のリソース管理**
   - 使用箇所: meganav_gr, meganav_kt, footer など
   - 例: `resources.Get`, `transform.Unmarshal`
   - 対応案: JSON/CSV ファイルを import して使用

6. **Hugo のテンプレート機能**
   - 使用箇所: treenav, meganav など
   - 例: `define`, `template`, `partial`
   - 対応案: Astro コンポーネントの入れ子構造で実装

7. **Hugo の文字列処理**
   - 使用箇所: 多数
   - 例: `strings.TrimPrefix`, `split`, `replaceRE`
   - 対応案: JavaScript の文字列メソッドで実装

8. **Hugo の条件分岐とループ**
   - 使用箇所: すべて
   - 例: `range`, `if`, `with`
   - 対応案: JavaScript の制御構文と JSX の条件レンダリング

### 特に複雑な移植が必要なコンポーネント

1. **treenav.html** - 再帰的なナビゲーション構造、TOC生成機能
2. **meganav_gr.html / meganav_kt.html** - CSVデータの読み込みと動的メニュー生成
3. **head.html** - 多数の条件分岐とメタタグ生成
4. **searchbox.html** - 検索プロバイダーの切り替え機能
5. **applyparams.html** - テンプレート変数の置換処理

### 外部依存関係

1. **JavaScript ライブラリ**
   - jQuery
   - jsTree
   - Vue.js (一部のページタイプで使用)
   - HubSpot
   - Google Tag Manager
   - Zendesk Chat

2. **CSS フレームワーク**
   - Font Awesome

### 提案する実装方針

1. **i18n システム**: `astro-i18n` または `@astrojs/i18n` を使用
2. **設定管理**: Astro の環境変数と設定ファイルで管理
3. **データ管理**: CSV/JSONファイルを静的にインポート
4. **ナビゲーション**: 再帰的コンポーネントで実装
5. **検索機能**: 検索プロバイダーを Props で切り替え可能に

これらの課題について、どのような対応方針で進めるべきか、ご確認をお願いします。特に：

1. i18n システムはどのように実装すべきでしょうか？
2. Hugo のサイト設定（Site.Params）に相当するデータはどのように管理すべきでしょうか？
3. CSV/JSONデータの読み込み方法はどうすべきでしょうか？
4. 外部スクリプト（GTM、Zendesk等）の扱いはどうすべきでしょうか？
```
