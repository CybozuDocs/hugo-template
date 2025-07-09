# CSV to TypeScript 変換作業履歴

## 2025-07-09

### ユーザーからの指示
CSVファイルをTSファイルに変換してほしい。

すでに変換済みのものが存在するため、ファイルからexportする要素などはこれを参考にして

変換前: kintone-help-astro-poc/src/pages/_data/csv/menuitems.US.csv
変換後: kintone-help-astro-poc/src/pages/_data/menuItems.ts

対象は、kintone-help-astro-poc/src/pages/_data/csv 配下にある次のファイルです

- home.CN.csv
- home.JP.csv
- home.US.csv
- home_apx.CN.csv
- home_apx.JP.csv
- home_apx.US.csv
- links.CN.csv
- links.JP.csv
- links.US.csv

ファイルによってリージョンが別れていますが、これらは単一ファイルにまとめてほしい。

home.CN.csv, home.JP.csv, home.US.csv → home.ts

CN, JP, US については、exportする値のキーとして切り分けて。
e.g. { "JP": {}, "US: {}, "CN: {}  }

また、home_apxというファイル名は homeAppendix としてほしい

### 作業内容
1. migration-docs配下のルールファイルを確認
2. 既存の変換済みファイル（menuItems.ts）を確認
3. CSVファイルの内容とフォーマットを確認
4. 作業ディレクトリとplan.mdを作成
5. CSV→TS変換の実装

### 分析結果
- menuItems.ts: id, title, url の3つのプロパティを持つシンプルな配列
- home系CSV: type, icon/url, title の3カラム形式
- home_apx系CSV: type, title, icon/url の3カラム形式
- links系CSV: categoryId, title, url, 空 の4カラム形式

### 実装内容
1. **home.ts**
   - HomeItem型: type, icon?, title?, url?
   - HomeData型: JP/US/CNリージョン別配列
   - CSVデータをパースして適切な型に変換

2. **homeAppendix.ts**
   - HomeAppendixItem型: type, title, icon?, url?
   - HomeAppendixData型: JP/US/CNリージョン別配列
   - home_apx → homeAppendixへのファイル名変更

3. **links.ts**
   - LinkItem型: categoryId, title, url?
   - LinksData型: JP/US/CNリージョン別配列
   - カテゴリID別のリンクデータ管理

### 変換結果
- 全てのCSVファイルを正常にTypeScriptファイルに変換
- リージョン別データを単一ファイルに統合
- 適切な型定義を付与
- ビルドテストで構文エラーなし（既存のJSXエラーは別問題）

### 作成ファイル
- `/src/pages/_data/home.ts`
- `/src/pages/_data/homeAppendix.ts`
- `/src/pages/_data/links.ts`