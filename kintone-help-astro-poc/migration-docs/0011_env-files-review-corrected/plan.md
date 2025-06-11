# 環境変数ファイル見直し実行プラン（修正版）

## 概要
`.env.xx` 系の設定ファイルの内容をもとに、既存の `src/lib/env.ts` と `src/env.d.ts` を見直し、不足している環境変数を追加する。

## 現状分析

### 発見した環境変数ファイル
- `.env` （ベース設定 - JPリージョン）
- `.env.jp` （JP本番環境）
- `.env.us` （US本番環境）
- `.env.cn` （CN本番環境）
- `.env.jp_staging` （JPステージング環境）
- `.env.us_staging` （USステージング環境）
- `.env.cn_staging` （CNステージング環境）

### 既存ファイルの状況
1. **src/lib/env.ts**: 既に存在し、buildEnvConfig関数で環境変数を処理
2. **src/env.d.ts**: 既に存在し、基本的な型定義済み
3. **問題点**: .envファイルに存在する環境変数の一部が型定義や処理関数に含まれていない

### 不足している環境変数の分析

#### src/env.d.ts に不足している型定義
- `PUBLIC_ID_SEARCH` (機能フラグ)
- `PUBLIC_JSON_TREE` (機能フラグ)
- `PUBLIC_LOGO_ALT` (USリージョン専用)
- `PUBLIC_SERVICE` (サービス設定)
- `PUBLIC_CYBOZU_COM` (サービス設定)
- `PUBLIC_KINTONE` (ブランド設定)
- `PUBLIC_DEVNET_NAME`, `PUBLIC_DEVNET_URL` (外部サービス)
- `PUBLIC_SUPPORT_INQUIRY` (USリージョン専用)
- `PUBLIC_DEFAULT_CONTENT_LANGUAGE` (言語設定)
- `PUBLIC_FOOTER_LINKS` (UI設定)
- `PUBLIC_CORP_NAME`, `PUBLIC_STORE` (ブランディング)
- `PUBLIC_SLASH*` 系の変数 (スラッシュコマンド)
- `PUBLIC_LABEL_*` 系の変数 (JPリージョン専用)

#### src/lib/env.ts の buildEnvConfig に不足している処理
- 上記の環境変数を適切に読み込んで返り値に含める

## 実行計画

### 1. src/env.d.ts の更新
- 不足している環境変数の型定義を追加
- コメントは追加せず、シンプルな型定義のみ
- オプショナルな変数は適切に `?` マークで定義

### 2. src/lib/env.ts の更新
- buildEnvConfig関数の返り値に不足している環境変数を追加
- 既存の構造は維持し、追加のみ実施
- 適切なデフォルト値の設定

### 3. 検証
- TypeScriptのコンパイルエラーがないことを確認
- 既存の機能に影響がないことを確認

## 期待される効果
1. **完全な環境変数対応** - .envファイルの全変数への対応
2. **型安全性の向上** - 新しい環境変数への型安全なアクセス
3. **既存機能の保持** - 現在の動作を維持したまま拡張
4. **シンプルさの維持** - 過度な抽象化を避けた実装

## 注意点
- 既存のbuildEnvConfig関数の構造と命名規則を維持
- 新規ファイルは作成せず、既存ファイルの拡張のみ
- env.d.tsにはコメントを追加しない
- 段階的改善のアプローチを採用