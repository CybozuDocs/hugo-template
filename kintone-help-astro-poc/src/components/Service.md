# Service.astro 変更記録

元ファイル: `layouts/shortcodes/service.html`

## 関数・変数の置換

| Hugo | Astro | 備考 |
|------|-------|------|
| `{{$.Site.Params.service}}` | `kintone` | product="kintone" 固定により固定値出力 |

## Props 設計

```typescript
// Props 不要（固定値出力）
```

## product 固定化による簡素化

### 移行前（Hugo）のリージョン別設定
```hugo
<!-- リージョン別 service 設定 -->
JP: cybozu.com
US: Kintone  
CN: cybozu.cn
```

### 移行後（Astro）
```astro
<!-- kintone 固定（全リージョン統一） -->
kintone
```

## 環境変数の削除対象

| 環境変数 | 削除前の値例 | 削除理由 |
|---------|-------------|----------|
| `PUBLIC_SERVICE` | cybozu.com (JP), Kintone (US), cybozu.cn (CN) | product="kintone" 固定により不要 |

## 実装パターン

- **Props最適化**: Props不要の最大簡素化
- **固定値出力**: product 固定化による条件分岐削除
- **リージョン統一**: 全リージョンで同一出力

## DOM 構造の変化

なし（単純なテキスト出力のため）

## リスクが考えられる箇所

- **リージョン差異の消失**: JP/US/CN でのサービス名差異が失われる
- **ブランディング影響**: US の "Kintone" ブランディングが "kintone" に統一される
- **既存コンテンツ**: リージョン別サービス名前提のコンテンツへの影響
- **将来拡張**: リージョン別対応復活時の対応工数増加

## TODO

- [ ] リージョン別サービス名の実際の使用状況確認
- [ ] US ブランディング（大文字 Kintone）の影響評価

## その他留意点として記録しておくこと

### 移行前後の比較
```html
<!-- Hugo -->
{{< service >}}

<!-- Astro -->
<Service />
```

### 使用方法
```astro
---
import Service from '@/components/Service.astro';
---

<Service />
<!-- 出力: kintone （全リージョン統一）-->
```

### 失われたリージョン差異
- **JP**: cybozu.com → kintone
- **US**: Kintone → kintone（大文字・小文字の違い）
- **CN**: cybozu.cn → kintone

### product 固定化の背景
- 本プロジェクトでは kintone 製品のみをサポート
- リージョン別のサービス名差異よりも統一性を優先
- 条件分岐処理の削除による保守性向上

### Slash/Store.astro との統一性
- 実装パターンは Slash.astro, Store.astro と完全に同一
- 3つのコンポーネント全てが "kintone" を出力
- product 固定化による設計統一

### 関連する固定化対象
- Slash.astro → kintone（実装済み）
- Store.astro → kintone（実装済み）
- Service.astro → kintone（本コンポーネント）

### 削除された機能
```hugo
<!-- 削除された Hugo 実装 -->
{{ if eq $.Site.Params.product "kintone" }}{{ $.Site.Params.service }}{{ end }}
<!-- リージョン別設定: JP: cybozu.com, US: Kintone, CN: cybozu.cn -->
```

### 依存関係
- なし（固定値出力のため）

### テスト要件
- [ ] 出力が「kintone」であることを確認
- [ ] 全リージョンで同じ値が出力されることを確認
- [ ] US環境での大文字・小文字の変更影響確認
- [ ] 既存コンテンツでの適切な表示確認

### ブランディング考慮事項
- US 環境での "Kintone" → "kintone" の変更
- ブランディングガイドラインとの整合性要確認
- 必要に応じて将来的なリージョン別対応の復活検討

### 関連コンポーネント
- Slash.astro, Store.astro（同じく product 固定化対象、同一実装）
- Kintone.astro（製品名表示の基本コンポーネント、env.kintone を使用）
- CybozuCom.astro（リージョン別ドメイン名、差異を保持）