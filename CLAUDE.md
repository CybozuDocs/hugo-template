# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

Hugo ベースのドキュメントテンプレートシステムです。現在、Astro への段階的な移行が進行中です。

## Hugo から Astro への移行作業におけるルール

kintone-help-astro-poc/ ディレクトリ配下が移行後の Astro によるプロジェクトです。

### 必ず参照するファイル

Astro への移行作業を指示された場合、**必ず次のファイルの内容を確認してください。**

- kintone-help-astro-poc/migration-docs/rules.md : Astro 開発の永続的なルール（移行完了後も使用）
- kintone-help-astro-poc/migration-docs/migrate-rules.md : 新たな移行ルールや注意点
- kintone-help-astro-poc/migration-docs/migrate-memo.md : 作業の概要、学習事項、判明している課題

### 重要：移行作業時の必須ドキュメント作成

Hugo から Astro への移行作業を行う際は、**必ず以下のドキュメントを作成してください**：

#### 1. 作業ごとのドキュメント作成

kintone-help-astro-poc/migration-docs/ 配下に、作業ごとにディレクトリを作成し、次のファイルを作成：

- **plan.md** : 詳細な実行プラン（作業開始前に作成）
- **prompt.md** : ユーザーからの指示と、それに対する回答の履歴（作業完了時に作成）

例：環境変数移行の場合

```
kintone-help-astro-poc/migration-docs/env-variables/
├── plan.md    # 環境変数移行の実行プラン
└── prompt.md  # 作業履歴
```

#### 2. ドキュメントの分類と管理

migration-docs/ 配下の 3 つのファイルを適切に使い分けてください：

- **rules.md**: Astro 開発の永続的なルール（移行完了後も使用）
  - マイグレーション関連の情報は一切含まない
  - コンポーネント設計原則、品質管理指針など
- **migrate-rules.md**: マイグレーション作業時のルール
  - Hugo からの変換規則、移行時の注意点
  - DOM 構造の保持、コンポーネント名の対応など
- **migrate-memo.md**: マイグレーションの進捗管理
  - 作業状況、未解決事項、TODO
  - 各作業の概要と学習事項

#### 3. 作業中の更新

- 新しい開発ルールが確立されたら **rules.md** に追加
- 移行時の新しい注意点は **migrate-rules.md** に追加
- 進捗や課題は随時 **migrate-memo.md** に記録

#### 4. 作業完了時の必須更新

**重要**: 作業完了時には必ず以下の 3 ファイルを確認・更新してください：

- **migrate-memo.md**: 作業の概要、学習事項、判明した課題を記録
- **migrate-rules.md**: 新たな移行ルールや注意点を追加
- **rules.md**: Astro 開発の新しい永続的ルールを追加

### ドキュメント作成を忘れないために

作業開始時に Todo リストを作成し、以下のタスクを必ず含めてください：

1. migration-docs/{4 桁の連番}\_{作業名}/ ディレクトリの作成
2. plan.md の作成
3. prompt.md の作成
4. 作業中: 3 つのドキュメントを適宜更新
5. 作業完了時: 3 つのドキュメントの最終更新

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
