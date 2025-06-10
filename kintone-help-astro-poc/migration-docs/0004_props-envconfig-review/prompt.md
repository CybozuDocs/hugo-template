# Props → envConfig 移行作業履歴

## ユーザーからの指示

```
PageLayout.astroは、layouts/_default/single.html をベースにLLMによって移植したものです。
この中で利用している変数について、大半がPropsから取得するようになっています。

このPropsを見直し、envConfigの値を使うのが適切と思われるものは、そちらを利用する形に修正してください。
```

## 実行した作業

### 1. 現状分析
- PageLayout.astroの内容を確認し、Props定義を分析
- envConfig（env.ts）の提供値を確認
- 移行対象となるPropsを特定

### 2. 移行対象の特定
以下のPropsをenvConfigから取得するように変更：
- `targetRegion` → `envConfig.targetRegion`
- `meganav` → `envConfig.meganav`
- `product` → `envConfig.product`
- `languageCode` → `envConfig.languageCode`
- `useWovn` → `envConfig.useWovn`

### 3. 修正内容

#### Props型定義の簡素化
- サイト設定関連のPropsを削除
- ページ固有の設定のみを残す

#### envConfig構築の変更
```typescript
// 変更前
const envConfig = buildEnvConfig({
  languageCode,
  product,
  targetRegion,
  useWovn,
  meganav
});

// 変更後
const envConfig = buildEnvConfig();
```

#### 参照箇所の修正
- 無効化チェック: `disabled.includes(targetRegion)` → `disabled.includes(envConfig.targetRegion)`
- Garoon判定: `product === "Garoon"` → `envConfig.product === "Garoon"`
- 条件分岐での参照をすべてenvConfig経由に変更

## 効果
- 環境変数の一元管理が実現
- Props定義が簡素化され、ページ固有の設定に特化
- 設定値の一貫性が向上
- buildEnvConfig()が環境変数から直接値を取得するため、より適切な設計に