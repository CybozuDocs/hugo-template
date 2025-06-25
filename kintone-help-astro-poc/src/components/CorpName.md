# CorpName.astro 変更記録

元ファイル: `layouts/shortcodes/CorpName.html`

## 関数・変数の置換

| Hugo | Astro | 備考 |
|------|-------|------|
| `{{$.Site.Params.CorpName}}` | `{env.corpName}` | 環境変数 PUBLIC_CORP_NAME から取得 |

## Props 設計

```typescript
// Props 不要（環境変数直接参照）
```

## 環境変数対応

| 環境変数 | 設定値例 | 備考 |
|---------|----------|------|
| `PUBLIC_CORP_NAME` | サイボウズ (JP), Kintone Corp (US), Cybozu (CN) | リージョン別に設定 |

### リージョン別設定値
- **JP環境**: "サイボウズ"
- **US環境**: "Kintone Corp"  
- **CN環境**: "Cybozu"

## 実装パターン

- **Props最適化**: Props不要の最大簡素化
- **環境変数直接参照**: `import { env } from "@/lib/env"`
- **単純出力**: HTMLタグなしの純粋なテキスト出力

## DOM 構造の変化

なし（単純なテキスト出力のため）

## リスクが考えられる箇所

- **環境変数未設定**: PUBLIC_CORP_NAME が未設定の場合は空文字列が出力される
- **多言語対応**: 現在は単一言語（日本語）対応のみ、他言語設定はコメントアウト

## TODO

なし（実装完了）

## その他留意点として記録しておくこと

### 移行前後の比較
```html
<!-- Hugo -->
{{$.Site.Params.CorpName}}

<!-- Astro -->
{env.corpName}
```

### 使用方法
```astro
---
import CorpName from '@/components/CorpName.astro';
---

<CorpName />
```

### 依存関係
- `src/lib/env.ts` の `env.corpName` プロパティ
- 環境変数 `PUBLIC_CORP_NAME` の設定

### テスト要件
- [ ] JP環境で「サイボウズ」が表示されることを確認
- [ ] US環境で「Kintone Corp」が表示されることを確認  
- [ ] CN環境で「Cybozu」が表示されることを確認

### 関連コンポーネント
- ApplyParams.astro でパラメータ置換機能として使用される可能性がある