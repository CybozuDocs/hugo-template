# Footer.astro CSVファイル読み込み機能実装プラン

## 作業概要

Footer.astroコンポーネントでCSVファイルからフッターリンクデータを読み込む機能を実装する。

## 背景

- Footer.astroは既に実装済みだが、CSVファイル読み込み部分がTODOコメントとして残っていた  
- 元のHugo実装（layouts/partials/footer2.html）ではHugoのリソース管理機能を使用してCSVを読み込んでいた
- AstroではViteの機能を使用してCSVファイルを静的に読み込む必要がある

## 実装対象ファイル

- `/kintone-help-astro-poc/src/layouts/components/Footer.astro`
- CSVファイル: `/kintone-help-astro-poc/src/pages/_data/csv/links.{リージョン}.csv`

## CSVファイル形式

確認したCSVファイルの形式：
- カラム1: カテゴリID（1-4, 999は特別なフッター）
- カラム2: リンクテキスト  
- カラム3: URL
- カラム4: ステータス（jaonly等）またはtarget属性

例：
```csv
1,Cybozu,,
1,サイボウズ株式会社,https://cybozu.co.jp/,
999,個人情報保護方針,https://cybozu.co.jp/privacy/,
```

## 実装詳細

### 1. CSV読み込み処理
- `env.targetRegion`に基づいてCSVファイルパスを決定（JP/US/CN）
- Viteの`?raw`インポートを使用してCSVファイルを文字列として読み込み
- カンマ区切りでパース（クォート対応）

### 2. データ処理
- ID=999の行は法的リンク（legalMenu）として処理
- ID=1-4の行はメガメニューとして処理
- 各カテゴリの最初の行はカテゴリタイトル、それ以降はリンク項目

### 3. TypeScript型定義
- CSVデータを`string[][]`として型定義
- target属性を適切な型で制約
- 未使用変数の削除

### 4. エラーハンドリング
- CSVファイル読み込みエラーの適切な処理
- コンソール警告出力

## 実装後の検証項目

- [ ] CSVファイルが正しく読み込まれる
- [ ] リージョン別のCSVファイルの使い分けが動作する
- [ ] メガメニューとリーガルメニューが正しく分類される
- [ ] TypeScriptエラーが解消される
- [ ] 既存のDOM構造が保持される

## 注意事項

- DOM構造は元のHugo実装と完全に一致させる必要がある
- 勝手な文言追加は禁止
- 元のclass名とidを維持する