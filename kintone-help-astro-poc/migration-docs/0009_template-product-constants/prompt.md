# templateVersion および product の固定化作業履歴

## ユーザーからの指示

```
Astroへの移行作業です。ルールに従って作業して。

## templateVersion および product の固定化

移行に伴い、templateVersion は "2" で固定であり、product は "kintone" で固定になります。
従来は環境変数上で PUBLIC_PRODUCT や PUBLIC_TEMPLATE_VERSION によって参照していましたが、これが不要になります。

- 環境変数からこれらの値を削除してください。
- これらのenvの値によって分岐している箇所を見直し、不要な分岐はすべて削除してください。
- もし値を埋め込んで表示している箇所がある場合は、直接定数を埋め込んでください。

補足:
過去にはenv.tsに定義されていたのですが、現在は削除されています。
しかし、各コンポーネントではまだこれをPropsとして受け取ることを期待した実装になっています。
```

## 実行内容

### 1. 環境変数の削除
全ての .env ファイルから以下の環境変数を削除：
- PUBLIC_TEMPLATE_VERSION=2
- PUBLIC_PRODUCT=kintone

対象ファイル：
- .env
- .env.cn
- .env.jp
- .env.us
- .env.cn_staging
- .env.jp_staging
- .env.us_staging

### 2. 型定義の更新
`src/env.d.ts` から該当する型定義を削除：
- readonly PUBLIC_TEMPLATE_VERSION: string;
- readonly PUBLIC_PRODUCT: string;

`src/layouts/components/types.ts` から該当する型定義を削除：
- product: string;
- templateVersion?: string;

### 3. コンポーネントの修正

#### Head.astro
- `env.product` プロパティを削除
- 他製品（Garoon, Mailwise, Office, Remote）の分岐処理を削除
- GTMタグの条件を `env.product === "kintone"` から `env.targetRegion === "JP"` に変更
- AlternateLinkコンポーネントの条件分岐を削除（常に表示）

#### Footer.astro
- `env.product` プロパティを削除
- Garoonの条件分岐を削除
- CSVファイル読み込み処理を修正（動的インポートの問題を解決）

#### PageLayout.astro
- Garoon非日本語の条件チェックを削除

#### AlternateLink.astro
- `env.product` プロパティの参照を削除
- 他製品（Garoon, store）の地域設定分岐を削除
- Garoonのon-premise条件を削除

#### TreeNav.astro, TreeNav3.astro
- `templateVersion === "2"` の条件分岐を削除（常に表示）
- 他製品のTOC設定を削除

#### BreadcrumbNav.astro
- 他製品のホームページタイトル表示条件を削除

#### MegaNavKt.astro
- product による分岐を削除（kintone固定でtabnum=1）
- support_guide の条件を削除

### 4. 修正結果

#### 削除された分岐処理
- Garoon, Mailwise, Office, Remote 製品の処理
- templateVersion !== "2" の処理
- product !== "kintone" の処理

#### 固定化された値
- templateVersion: "2" （メタタグや条件分岐で直接使用）
- product: "kintone" （ロジック内で前提として使用）

#### ビルド結果
- npm run build 成功
- 構文エラー解消
- CSVファイル読み込み問題解決

## 学習事項
1. 動的な環境変数参照を削除することで、コードがシンプルになった
2. 不要な分岐処理の削除により、保守性が向上した
3. kintone専用の実装により、コード量が大幅に削減された
4. Astroでの動的インポートはビルド時に解決される必要がある