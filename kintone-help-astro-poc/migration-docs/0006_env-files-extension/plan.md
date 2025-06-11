# 環境変数ファイル拡張 - 実行プラン

## 作業概要
既存の`.env.jp`に加えて、追加のTomlファイルから新しい環境変数ファイルを作成する

## 対象ファイル
- `hugo_cn.toml` → `.env.cn`
- `hugo_cn_staging.toml` → `.env.cn_staging`  
- `hugo_jp_staging.toml` → `.env.jp_staging`
- `hugo_us.toml` → `.env.us`
- `hugo_us_staging.toml` → `.env.us_staging`

## 実行手順

### 1. 各Tomlファイルの読み取り
- 5つのTomlファイルの内容を並行して読み取り
- 既存の`.env.jp`ファイルの形式を参考として確認

### 2. 環境変数ファイルの作成
各Tomlファイルの設定を以下の形式でAstro用環境変数に変換：

#### 基本設定の変換
- `baseurl` → `PUBLIC_BASE_URL`
- `params.template_version` → `PUBLIC_TEMPLATE_VERSION`
- `params.product` → `PUBLIC_PRODUCT`
- `params.domain` → `PUBLIC_DOMAIN`
- など

#### 機能フラグの変換
- `params.langSelector` → `PUBLIC_LANG_SELECTOR`
- `params.meganav` → `PUBLIC_MEGANAV`
- `params.json_tree` → `PUBLIC_JSON_TREE`
- など

#### 言語別設定の変換
- `languages.ja.params.*` → `PUBLIC_*_JA`
- `languages.en.params.*` → `PUBLIC_*_EN`
- `languages.zh.params.*` → `PUBLIC_*_ZH`
- `languages.zh-tw.params.*` → `PUBLIC_*_ZH_TW`

### 3. 地域別・環境別の差異対応
- CN: Bing検索、cybozu.cnドメイン
- JP: Google検索、cybozu.comドメイン、ラベル色設定
- US: メガナビ有効、Kintoneブランディング、サポート問い合わせURL
- Staging: WOVN設定、異なるベースURL

### 4. 品質確認
- 各ファイルの形式一貫性確認
- 必要な設定項目の漏れチェック
- 地域・環境別の設定差異の正確性確認

## 期待される成果物
- `.env.cn` - 中国向けプロダクション環境設定
- `.env.cn_staging` - 中国向けステージング環境設定
- `.env.jp_staging` - 日本向けステージング環境設定  
- `.env.us` - アメリカ向けプロダクション環境設定
- `.env.us_staging` - アメリカ向けステージング環境設定

## 注意点
- 既存の`.env.jp`と同じ形式を維持
- 地域別のブランディング差異（Kintone vs kintone）に注意
- 検索機能の違い（Google vs Bing）を正確に反映
- WOVN設定の有無を適切に処理