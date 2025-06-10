# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

Hugo ベースのドキュメントテンプレートシステムです。現在、Astro への段階的な移行が進行中です。

## ビルド・開発コマンド

### Hugo の実行

```bash
# Hugoバイナリはプロジェクト内に含まれています
./bin/hugo serve  # 開発サーバー起動
./bin/hugo        # ビルド
```

### lint/typecheck コマンド

プロジェクトには package.json がないため、JavaScript/CSS の lint コマンドは定義されていません。

## アーキテクチャ・ディレクトリ構造

### 主要ディレクトリ

- `layouts/` - Hugo テンプレート（41 個の partials を含む）
- `layouts/partials/` - 再利用可能なコンポーネント
- `i18n/` - 6 言語対応の翻訳ファイル（ja, en, zh, zh-tw, th, es）
- `static/` - CSS、JavaScript、画像などの静的アセット
- `astro/` - Astro コンポーネントへの移行作業ディレクトリ
- `data/` - JSON データファイル
- `bin/` - Hugo 実行バイナリ

### 製品別レイアウト

- `layouts/k/` - kintone 用
- `layouts/gr/`, `layouts/gr6/` - Garoon 用
- `layouts/of/` - Office 用
- `layouts/kintone_tutorial/` - kintone チュートリアル用

### 外部サービス統合

- WOVN.io - 翻訳サービス
- Google Tag Manager
- Zendesk - サポート
- HubSpot - マーケティング
- Google/Bing Search

## 開発時の注意点

### i18n 対応

- 現在: Hugo の i18n 関数を使用
- 移行後: WOVN サービスによる翻訳（`<Wovn>` コンポーネント使用）

### テンプレート機能

- 41 個の partials が様々な UI コンポーネントを提供
- メガナビゲーション、ツリーナビゲーション、検索機能などの高度な UI
- 製品別のカスタムレイアウトとスタイル

# Hugo から Astro への移行作業におけるルール

kintone-help-astro-poc/ ディレクトリ配下が移行後の Astro によるプロジェクトです。

Hugo から Astro への移行作業を行う際は、kintone-help-astro-poc/migration-docs/ 配下に、作業ごとにディレクトリを作成し、次のファイルを作成してください。

- plan.md : 詳細な実行プラン
- prompt.md : ユーザーからの指示と、それに対する回答の履歴

また、Astro での開発における全般的なルールについては、kintone-help-astro-poc/migration-docs/rules.md にナレッジとして記録してください。
rules.md には移行作業が完了した後も参照可能なナレッジのみを記載します。
移行作業全体に関する進行状況やメモについては、migrate.memo.md に記載してください。
