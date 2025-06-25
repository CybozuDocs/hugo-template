# DevnetTop.astro 変更記録

元ファイル: `layouts/shortcodes/devnet_top.html`

## 関数・変数の置換

| Hugo | Astro | 備考 |
|------|-------|------|
| `{{$.Site.Params.devnet_url}}` | `{env.devnetUrl}` | 環境変数 PUBLIC_DEVNET_URL から取得 |
| `{{$.Site.Params.devnet_name}}` | `{env.devnetName}` | 環境変数 PUBLIC_DEVNET_NAME から取得 |

## Props 設計

```typescript
// Props 不要（環境変数直接参照）
```

## 環境変数対応

| 環境変数 | 設定値例 | 備考 |
|---------|----------|------|
| `PUBLIC_DEVNET_URL` | https://cybozu.dev/ (JP), https://kintone.dev/en/ (US) | リージョン別にURL設定 |
| `PUBLIC_DEVNET_NAME` | cybozu developer network (JP/CN), Kintone Developer Program (US) | リージョン別にサイト名設定 |

### リージョン別設定値
- **JP環境**: URL: https://cybozu.dev/, 名前: cybozu developer network
- **US環境**: URL: https://kintone.dev/en/, 名前: Kintone Developer Program  
- **CN環境**: URL: https://cybozudev.kf5.com/hc/, 名前: cybozu developer network
- **Staging環境**: 各リージョンの本番環境と同じ値

## 実装パターン

- **Props最適化**: Props不要の最大簡素化
- **環境変数直接参照**: `import { env } from "@/lib/env"`
- **複合コンポーネント**: 既存の DevnetName.astro 機能を内包

## DOM 構造の変化

なし（完全に同じ構造を保持）

```html
<!-- Hugo/Astro 共通 -->
<a href="{devnet_url}">{devnet_name}</a>
```

## リスクが考えられる箇所

- **環境変数未設定**: PUBLIC_DEVNET_URL または PUBLIC_DEVNET_NAME が未設定の場合
- **リンク切れ**: 外部サイトへのリンクのため、リンク先の変更・削除の可能性
- **セキュリティ**: 外部リンクのため、セキュリティ属性（target="_blank", rel="noopener"）の検討要
- **ブランディング差異**: リージョン別のURL・名前の整合性

## TODO

- [ ] セキュリティ属性（target="_blank", rel="noopener"）の追加検討
- [ ] 外部リンクの有効性確認

## その他留意点として記録しておくこと

### 移行前後の比較
```html
<!-- Hugo -->
<a href="{{$.Site.Params.devnet_url}}">{{$.Site.Params.devnet_name}}</a>

<!-- Astro -->
<a href={env.devnetUrl}>{env.devnetName}</a>
```

### 使用方法
```astro
---
import DevnetTop from '@/components/DevnetTop.astro';
---

<DevnetTop />
```

### セキュリティ改善案
```astro
<!-- セキュリティ強化版 -->
<a href={env.devnetUrl} target="_blank" rel="noopener noreferrer">
  {env.devnetName}
</a>
```

### 地域別開発者サイトの特徴
- **JP**: cybozu.dev（日本語メイン）
- **US**: kintone.dev/en/（英語版）  
- **CN**: cybozudev.kf5.com/hc/（中国向け特別サイト）

### DevnetName.astro との関係
- DevnetTop.astro は DevnetName.astro の機能を内包
- 単独でサイト名のみ表示したい場合は DevnetName.astro を使用
- リンク付きで表示したい場合は DevnetTop.astro を使用

### 依存関係
- `src/lib/env.ts` の `env.devnetUrl`, `env.devnetName` プロパティ
- 環境変数 `PUBLIC_DEVNET_URL`, `PUBLIC_DEVNET_NAME` の設定
- DevnetName.astro（類似機能コンポーネント）

### テスト要件
- [ ] JP環境での正しいリンク・テキスト表示を確認
- [ ] US環境での正しいリンク・テキスト表示を確認
- [ ] CN環境での正しいリンク・テキスト表示を確認
- [ ] 各リンク先サイトの有効性確認
- [ ] アクセシビリティ（キーボードナビゲーション）確認

### 関連コンポーネント
- DevnetName.astro（サイト名のみ表示）
- ApplyParams.astro でパラメータ置換機能として使用される可能性がある