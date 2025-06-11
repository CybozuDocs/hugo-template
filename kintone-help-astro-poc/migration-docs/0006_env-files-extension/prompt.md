# 環境変数ファイル拡張 - 作業履歴

## ユーザーからの指示

```
Astroへの移行作業です

すでに1ファイル(hugo_jp.toml)をベースに、.env.jp を作ってもらいました。
同様に次のファイルを用意したので、それぞれ別の .env ファイルにしてください

hugo_cn.toml
hugo_cn_staging.toml
hugo_jp_staging.toml
hugo_us.toml
hugo_us_staging.toml
```

## 実行した作業

### 1. 作業計画とTodoリスト作成
- 各tomlファイルの確認と対応する.envファイル作成のTodoリストを作成
- 5つのファイルを個別にタスクとして管理

### 2. 既存ファイルの分析
- 各tomlファイル（hugo_cn.toml, hugo_cn_staging.toml, hugo_jp_staging.toml, hugo_us.toml, hugo_us_staging.toml）を並行読み取り
- 既存の`.env.jp`ファイルを参考として形式を確認

### 3. 環境変数ファイルの作成

#### `.env.cn` (中国向けプロダクション)
- baseurl: https://help.cybozu.cn/k/
- Bing検索有効
- cybozu.cnドメイン・サービス
- 4言語対応（en, ja, zh, zh-tw）

#### `.env.cn_staging` (中国向けステージング)  
- baseurl: https://cn.cybozu.help/k/
- WOVN設定有効（data_wovnio: FZkNJw）
- 日本語メイン言語設定
- JSON tree無効

#### `.env.jp_staging` (日本向けステージング)
- baseurl: https://jp.cybozu.help/k/  
- WOVN設定有効
- ラベル色設定あり
- Google検索有効

#### `.env.us` (アメリカ向けプロダクション)
- baseurl: https://get.kintone.help/k/
- Kintoneブランディング（大文字K）
- メガナビ有効
- サポート問い合わせURL設定
- 4言語対応、複数CSS読み込み

#### `.env.us_staging` (アメリカ向けステージング)
- baseurl: https://get.kintone.help/k/
- 日本語メイン言語（staging特有）
- その他は.env.usと同等の設定

### 4. 共通変換ルールの適用
- Hugo toml形式からAstro環境変数形式への変換
- `PUBLIC_`プレフィックスの付与
- 言語別設定の`_JA`, `_EN`, `_ZH`, `_ZH_TW`サフィックス
- JSON配列形式の保持

## 成果物
以下5つの環境変数ファイルを作成：
- `.env.cn`
- `.env.cn_staging` 
- `.env.jp_staging`
- `.env.us`
- `.env.us_staging`

## 学習事項
- 地域別のブランディング差異（中国・日本: kintone、アメリカ: Kintone）
- 検索機能の地域差（中国: Bing、日本・アメリカ: Google）
- WOVN翻訳サービスの使用パターン（staging環境で有効）
- メガナビゲーションの地域別有効/無効設定