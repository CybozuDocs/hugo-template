# PageLayout.astro Props → envConfig 移行プラン

## 概要
PageLayout.astroで定義されているPropsのうち、envConfigの値を使うのが適切と思われるものをenvConfigから取得する形に修正する。

## 現状分析

### 現在のProps（サイト設定関連）
- `targetRegion?: string` - LINE 12, 38
- `meganav?: boolean` - LINE 13, 39  
- `product?: string` - LINE 15, 41
- `languageCode?: string` - LINE 16, 42
- `useWovn?: boolean` - LINE 17, 43

### 現在のenvConfig構築
```typescript
const envConfig = buildEnvConfig({
  languageCode,
  product,
  targetRegion,
  useWovn,
  meganav
});
```

### envConfigで提供される値
- `languageCode` - 言語コード
- `product` - 製品名
- `targetRegion` - ターゲット地域
- `useWovn` - WOVN使用フラグ
- `meganav` - メガナビ使用フラグ
- その他多数の環境変数ベースの設定値

## 移行対象の特定

### envConfigから取得すべきProps
1. `targetRegion` - envConfig.targetRegionを使用
2. `meganav` - envConfig.meganavを使用  
3. `product` - envConfig.productを使用
4. `languageCode` - envConfig.languageCodeを使用
5. `useWovn` - envConfig.useWovnを使用

### 残すべきProps
- ページ固有のデータ（disabled, aliases, labels, content, type, weight）
- 国際化設定（i18n）
- フロントマター関連（title, description）

## 実行計画

### Step 1: Props型定義の修正
- サイト設定関連のPropsを削除
- 必要最小限のオプションのみを残す

### Step 2: envConfig構築方法の変更
- Propsに依存しないenvConfig構築に変更
- 環境変数から直接値を取得

### Step 3: 条件判定ロジックの修正
- Props参照をenvConfig参照に変更
- 無効化チェックやGaroon判定の修正

### Step 4: 動作確認
- 既存機能が正常に動作することを確認

## 期待される効果
- 環境変数の一元管理
- Props定義の簡素化
- 設定の一貫性向上