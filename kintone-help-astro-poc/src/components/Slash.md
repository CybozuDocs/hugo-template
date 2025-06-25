# Slash.astro 変更記録

元ファイル: `layouts/shortcodes/slash.html`

## 関数・変数の置換

| Hugo | Astro | 備考 |
|------|-------|------|
| `{{$.Site.Params.slash}}` | `kintone` | product="kintone" 固定により固定値出力 |

## Props 設計

```typescript
// Props 不要（固定値出力）
```

## product 固定化による簡素化

### 移行前（Hugo）
```hugo
<!-- product 分岐処理 -->
{{ if eq $.Site.Params.product "kintone" }}kintone{{ end }}
{{ if eq $.Site.Params.product "slash" }}kintone/{{ $.Site.Params.slash }}{{ end }}
```

### 移行後（Astro）
```astro
<!-- kintone 固定 -->
kintone
```

## 環境変数の削除対象

| 環境変数 | 削除前の値例 | 削除理由 |
|---------|-------------|----------|
| `PUBLIC_SLASH` | cybozu.com | product="kintone" 固定により不要 |
| `PUBLIC_SLASH_HELP` | cybozu.com ヘルプ | 同上 |
| `PUBLIC_SLASH_ADMINISTRATORS` | cybozu.com共通管理者 | 同上 |
| `PUBLIC_SLASH_UI` | cybozu.com共通管理 | 同上 |

## 実装パターン

- **Props最適化**: Props不要の最大簡素化
- **固定値出力**: product 固定化による条件分岐削除
- **単純出力**: HTMLタグなしの純粋なテキスト出力

## DOM 構造の変化

なし（単純なテキスト出力のため）

## リスクが考えられる箇所

- **機能削減**: slash 製品対応の完全廃止
- **既存コンテンツ**: slash 製品用に作成されたコンテンツの影響
- **将来拡張**: slash 製品サポート復活時の対応工数増加
- **用途確認**: 実際の使用箇所での適切性確認が必要

## TODO

- [ ] slash 製品関連コンテンツの実際の使用状況確認
- [ ] kintone 固定出力の妥当性確認

## その他留意点として記録しておくこと

### 移行前後の比較
```html
<!-- Hugo -->
{{< slash >}}

<!-- Astro -->
<Slash />
```

### 使用方法
```astro
---
import Slash from '@/components/Slash.astro';
---

<Slash />
<!-- 出力: kintone -->
```

### product 固定化の背景
- 本プロジェクトでは kintone 製品のみをサポート
- slash, store 製品のサポート廃止により簡素化
- 条件分岐処理の削除による保守性向上

### 関連する固定化対象
- Slash.astro → kintone
- Store.astro → kintone  
- Service.astro → kintone

### 削除された機能
```hugo
<!-- 削除された Hugo 実装 -->
{{ if eq $.Site.Params.product "slash" }}
  kintone/{{ $.Site.Params.slash }}
{{ end }}
```

### 依存関係
- なし（固定値出力のため）

### テスト要件
- [ ] 出力が「kintone」であることを確認
- [ ] 全リージョンで同じ値が出力されることを確認
- [ ] 既存コンテンツでの適切な表示確認

### 関連コンポーネント
- Store.astro（同じく product 固定化対象）
- Service.astro（同じく product 固定化対象）
- Kintone.astro（製品名表示の基本コンポーネント）