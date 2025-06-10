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
- `layouts/` - Hugo テンプレート（41個の partials を含む）
- `layouts/partials/` - 再利用可能なコンポーネント
- `i18n/` - 6言語対応の翻訳ファイル（ja, en, zh, zh-tw, th, es）
- `static/` - CSS、JavaScript、画像などの静的アセット
- `astro/` - Astro コンポーネントへの移行作業ディレクトリ
- `data/` - JSONデータファイル
- `bin/` - Hugo実行バイナリ

### 製品別レイアウト
- `layouts/k/` - kintone用
- `layouts/gr/`, `layouts/gr6/` - Garoon用
- `layouts/of/` - Office用
- `layouts/kintone_tutorial/` - kintoneチュートリアル用

### Astro移行計画
`ASTRO_PLAN.md` に詳細な移行ルールが記載されています：
- i18n: Hugo の `{{ i18n "key" }}` → Astro の `<Wovn>i18n__key</Wovn>`
- 変数: サイト変数は `env`、ページ変数は `page` プロパティに集約
- 各Astroコンポーネントには同名の `.md` ファイルで変更記録を作成

移行用AIプロンプトは `PROMPT.md` に定義されています。

### 外部サービス統合
- WOVN.io - 翻訳サービス
- Google Tag Manager
- Zendesk - サポート
- HubSpot - マーケティング
- Google/Bing Search

## 開発時の注意点

### Astro移行作業
1. 現在のブランチ: `astro`（メインブランチは `master`）
2. 移行済みコンポーネント: Wovn, ApplyParams, ArticleNumber, Breadcrumb, BreadcrumbNav, Disclaimer2, GotoTop, Title
3. 新規コンポーネント作成時は必ず変更記録ファイル（.md）も作成

### i18n対応
- 現在: Hugo の i18n 関数を使用
- 移行後: WOVNサービスによる翻訳（`<Wovn>` コンポーネント使用）

### テンプレート機能
- 41個の partials が様々な UI コンポーネントを提供
- メガナビゲーション、ツリーナビゲーション、検索機能などの高度なUI
- 製品別のカスタムレイアウトとスタイル