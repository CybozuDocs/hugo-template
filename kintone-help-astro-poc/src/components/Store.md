# Store.astro 変更記録

元ファイル: `layouts/shortcodes/store.html`

## 関数・変数の置換

| Hugo | Astro | 備考 |
|------|-------|------|
| `{{$.Site.Params.store}}` | `kintone` | product="kintone" 固定により固定値出力 |

## Props 設計

```typescript
// Props 不要（固定値出力）
```

## product 固定化による簡素化

### 移行前（Hugo）
```hugo
<!-- product 分岐処理 -->
{{ if eq $.Site.Params.product "kintone" }}kintone{{ end }}
{{ if eq $.Site.Params.product "store" }}kintone/{{ $.Site.Params.store }}{{ end }}
```

### 移行後（Astro）
```astro
<!-- kintone 固定 -->
kintone
```

## 環境変数の削除対象

| 環境変数 | 削除前の値例 | 削除理由 |
|---------|-------------|----------|
| `PUBLIC_STORE` | kintone（値は推測） | product="kintone" 固定により不要 |

## 実装パターン

- **Props最適化**: Props不要の最大簡素化
- **固定値出力**: product 固定化による条件分岐削除
- **単純出力**: HTMLタグなしの純粋なテキスト出力

## DOM 構造の変化

なし（単純なテキスト出力のため）

## リスクが考えられる箇所

- **機能削減**: store 製品対応の完全廃止
- **既存コンテンツ**: store 製品用に作成されたコンテンツの影響
- **将来拡張**: store 製品サポート復活時の対応工数増加
- **用途確認**: 実際の使用箇所での適切性確認が必要

## TODO

- [ ] store 製品関連コンテンツの実際の使用状況確認
- [ ] kintone 固定出力の妥当性確認

## その他留意点として記録しておくこと

### 移行前後の比較
```html
<!-- Hugo -->
{{< store >}}

<!-- Astro -->
<Store />
```

### 使用方法
```astro
---
import Store from '@/components/Store.astro';
---

<Store />
<!-- 出力: kintone -->
```

### product 固定化の背景
- 本プロジェクトでは kintone 製品のみをサポート
- slash, store 製品のサポート廃止により簡素化
- 条件分岐処理の削除による保守性向上

### Slash.astro との類似性
- 実装パターンは Slash.astro と完全に同一
- 元々の製品名のみが異なる（slash vs store）
- 固定化により両方とも "kintone" を出力

### 関連する固定化対象
- Slash.astro → kintone（実装済み）
- Store.astro → kintone（本コンポーネント）
- Service.astro → kintone（次の実装対象）

### 削除された機能
```hugo
<!-- 削除された Hugo 実装 -->
{{ if eq $.Site.Params.product "store" }}
  kintone/{{ $.Site.Params.store }}
{{ end }}
```

### 依存関係
- なし（固定値出力のため）

### テスト要件
- [ ] 出力が「kintone」であることを確認
- [ ] 全リージョンで同じ値が出力されることを確認
- [ ] 既存コンテンツでの適切な表示確認
- [ ] Slash.astro との出力一致確認

### 関連コンポーネント
- Slash.astro（同じく product 固定化対象、同一実装）
- Service.astro（同じく product 固定化対象）
- Kintone.astro（製品名表示の基本コンポーネント）