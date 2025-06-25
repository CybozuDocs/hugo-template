# CybozuCom.astro 変更記録

元ファイル: `layouts/shortcodes/cybozu_com.html`

## 関数・変数の置換

| Hugo | Astro | 備考 |
|------|-------|------|
| `{{$.Site.Params.cybozu_com}}` | `{env.cybozuCom}` | 環境変数 PUBLIC_CYBOZU_COM から取得 |

## Props 設計

```typescript
// Props 不要（環境変数直接参照）
```

## 環境変数対応

| 環境変数 | 設定値例 | 備考 |
|---------|----------|------|
| `PUBLIC_CYBOZU_COM` | cybozu.com (JP), kintone.com (US), cybozu.cn (CN) | リージョン別にドメイン設定 |

### リージョン別設定値
- **JP環境**: "cybozu.com" 
- **US環境**: "kintone.com"
- **CN環境**: "cybozu.cn"
- **Staging環境**: リージョンに応じて設定

## 実装パターン

- **Props最適化**: Props不要の最大簡素化
- **環境変数直接参照**: `import { env } from "@/lib/env"`
- **単純出力**: HTMLタグなしの純粋なテキスト出力

## DOM 構造の変化

なし（単純なテキスト出力のため）

## リスクが考えられる箇所

- **環境変数未設定**: PUBLIC_CYBOZU_COM が未設定の場合は空文字列が出力される
- **ドメイン変更**: 各リージョンのドメイン変更時は環境変数の更新が必要
- **用途不明**: サイト名として使用されるのか、URLとして使用されるのか用途が不明

## TODO

- [ ] 実際の使用箇所を調査してドメイン名の用途を確認
- [ ] URL として使用される場合は https:// プレフィックス付与の検討

## その他留意点として記録しておくこと

### 移行前後の比較
```html
<!-- Hugo -->
{{$.Site.Params.cybozu_com}}

<!-- Astro -->
{env.cybozuCom}
```

### 使用方法
```astro
---
import CybozuCom from '@/components/CybozuCom.astro';
---

<CybozuCom />
```

### 地域別ドメインの特徴
- **JP/JP_STAGING**: cybozu.com (標準のcybozuドメイン)
- **US/US_STAGING**: kintone.com (米国向けkintoneブランディング)
- **CN/CN_STAGING**: cybozu.cn (中国向けローカライズドメイン)

### 用途の推測
- リンク生成での使用が想定される
- ドメイン名として表示される場合
- URL の一部として組み込まれる場合

### 依存関係
- `src/lib/env.ts` の `env.cybozuCom` プロパティ
- 環境変数 `PUBLIC_CYBOZU_COM` の設定

### テスト要件
- [ ] JP環境で「cybozu.com」が表示されることを確認
- [ ] US環境で「kintone.com」が表示されることを確認
- [ ] CN環境で「cybozu.cn」が表示されることを確認
- [ ] 各Staging環境での適切な値表示を確認

### 関連コンポーネント
- ApplyParams.astro でパラメータ置換機能として使用される可能性がある
- リンク生成コンポーネントでドメイン名として使用される可能性