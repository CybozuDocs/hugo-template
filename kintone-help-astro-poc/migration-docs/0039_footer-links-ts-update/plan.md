# Footer.astro のリンクデータ読み込み方式変更

## 作業概要
Footer.astro で CSV ファイルから読み込んでいたリンクデータを、TypeScript ファイル (links.ts) から読み込む方式に変更する。

## 現状分析

### 現在の実装
- **ファイル**: `kintone-help-astro-poc/src/layouts/components/Footer.astro`
- **読み込み方式**: CSVファイル (`links.{リージョン}.csv`) をViteの`?raw`インポートで読み込み
- **パース処理**: カスタムCSVパーサーで配列に変換
- **データ構造**: `[categoryId, title, url, status]` の配列形式

### 新しいデータソース
- **ファイル**: `kintone-help-astro-poc/src/pages/_data/links.ts`
- **データ形式**: TypeScript オブジェクト
- **構造**: 
  ```typescript
  interface LinkItem {
    categoryId: string;
    title: string;
    url?: string;
  }
  ```

## 実装計画

### 1. TSファイルからのデータ読み込み
- CSVインポート処理を削除
- links.ts から直接データをインポート
- リージョン別データの取得処理を実装

### 2. データ処理ロジックの更新
- CSVパース処理を削除
- TypeScriptオブジェクトを直接使用するロジックに変更
- categoryIdによるグループ化処理の更新

### 3. テンプレート部分の調整
- status フィールドが削除されたことへの対応
  - 現在は "jaonly" ステータスのチェックがある
  - links.ts にはこの情報がないため、削除または別の方法で対応
- target 属性の扱い
  - CSVでは4番目のフィールドとして存在
  - links.ts には含まれていない

## 注意事項

### データ構造の差異
1. **status フィールドの欠如**
   - CSV: 4番目のフィールドに status/target 情報
   - TS: status 情報なし
   - 対応: "jaonly" 表示を削除、またはデータ側に追加を検討

2. **target 属性の欠如**
   - CSV: リーガルメニューで target 属性を指定
   - TS: target 情報なし
   - 対応: デフォルトを "_blank" とする、またはデータ側に追加

### 破壊的変更の回避
- DOM構造は変更しない
- クラス名やIDは維持
- 表示される内容の大きな変更は避ける

## 実装手順

1. links.ts のインポート追加
2. CSV読み込み処理の削除
3. データ処理ロジックの更新
4. テンプレート部分の微調整
5. 動作確認とビルドテスト

## 期待される効果
- 型安全性の向上
- ビルド時のパフォーマンス向上
- メンテナンス性の向上
- CSVパース処理の削除によるコード簡素化