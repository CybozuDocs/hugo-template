# DevnetName.astro 変更記録

元ファイル: `layouts/shortcodes/devnet_name.html`

## 関数・変数の置換

| Hugo | Astro | 備考 |
|------|-------|------|
| `{{$.Site.Params.devnet_name}}` | `{env.devnetName}` | 環境変数 PUBLIC_DEVNET_NAME から取得 |

## Props 設計

```typescript
// Props 不要（環境変数直接参照）
```

## 環境変数対応

| 環境変数 | 設定値例 | 備考 |
|---------|----------|------|
| `PUBLIC_DEVNET_NAME` | cybozu developer network (JP/CN), Kintone Developer Program (US) | リージョン別にサイト名設定 |

### リージョン別設定値
- **JP/CN環境**: "cybozu developer network"
- **US環境**: "Kintone Developer Program"
- **Staging環境**: 本番環境と同じ値

## 実装パターン

- **Props最適化**: Props不要の最大簡素化
- **環境変数直接参照**: `import { env } from "@/lib/env"`
- **単純出力**: HTMLタグなしの純粋なテキスト出力

## DOM 構造の変化

なし（単純なテキスト出力のため）

## リスクが考えられる箇所

- **環境変数未設定**: PUBLIC_DEVNET_NAME が未設定の場合は空文字列が出力される
- **ブランディング差異**: JP/CN は cybozu ブランド、US は Kintone ブランドで統一性の考慮が必要
- **大文字・小文字**: JP/CN は小文字、US は適切な大文字表記で表示される

## TODO

なし（実装完了）

## その他留意点として記録しておくこと

### 移行前後の比較
```html
<!-- Hugo -->
{{$.Site.Params.devnet_name}}

<!-- Astro -->
{env.devnetName}
```

### 使用方法
```astro
---
import DevnetName from '@/components/DevnetName.astro';
---

<DevnetName />
```

### 地域別ブランディングの特徴
- **JP/CN環境**: "cybozu developer network" (小文字、cybozu ブランド)
- **US環境**: "Kintone Developer Program" (大文字表記、Kintone ブランド)
- 一貫したブランディング戦略を反映

### 用途の推測
- 開発者向けサイトへのリンクテキストとして使用
- 開発者向けコンテンツでのサイト名表示
- フッターやナビゲーションでの外部リンク表示

### 依存関係
- `src/lib/env.ts` の `env.devnetName` プロパティ
- 環境変数 `PUBLIC_DEVNET_NAME` の設定
- 関連する `DevnetTop.astro`（URL用）との組み合わせ使用

### テスト要件
- [ ] JP環境で「cybozu developer network」が表示されることを確認
- [ ] US環境で「Kintone Developer Program」が表示されることを確認
- [ ] CN環境で「cybozu developer network」が表示されることを確認
- [ ] 各Staging環境での適切な値表示を確認

### 関連コンポーネント
- DevnetTop.astro（開発者サイトURL）
- ApplyParams.astro でパラメータ置換機能として使用される可能性がある