# Disabled2.astro 変更記録

元ファイル: `layouts/shortcodes/disabled2.html`

## 関数・変数の置換

| Hugo | Astro | 備考 |
|------|-------|------|
| `{{- if in .Params $.Site.Params.TargetRegion}}` | `regions.includes(env.targetRegion)` | 指定リージョンの包含判定 |
| `{{- .Inner \| .Page.RenderString }}` | `<slot />` | ショートコード内容を Astro slot で表示 |

## Props 設計

```typescript
interface Props {
  regions?: string[];
}
```

## ロジックの変更

### Hugo のロジック
```hugo
{{- if in .Params $.Site.Params.TargetRegion}}
  <!-- 指定リージョンの場合：何も表示しない -->
{{else}}
  <!-- 指定リージョン以外の場合：内容を表示 -->
  {{- .Inner | .Page.RenderString }}
{{- end}}
```

### Astro のロジック  
```typescript
// regionsが未定義の場合は常に表示
// regionsが定義されている場合は、env.targetRegionが含まれない場合のみ表示
const shouldDisplay = !regions || !regions.includes(env.targetRegion);
```

## Enabled.astro との関係

| コンポーネント | 表示条件 | 用途 |
|---------------|---------|------|
| **Enabled.astro** | `!regions \|\| regions.includes(env.targetRegion)` | 指定リージョンでのみ表示 |
| **Disabled2.astro** | `!regions \|\| !regions.includes(env.targetRegion)` | 指定リージョンでは非表示 |

## DOM 構造の変化

なし（条件付きレンダリングのため DOM 構造は動的）

## 実装パターン

- **カスタムProps**: regions 配列を省略可能プロパティとして定義
- **逆ロジック**: Enabled.astro と正反対の表示条件
- **条件付きレンダリング**: `{shouldDisplay && <slot />}` による表示制御

## リスクが考えられる箇所

- **regions未定義**: regions プロパティが未定義の場合は常に表示される（意図と異なる可能性）
- **空配列**: regions=[] の場合は常に表示される（仕様として適切か要確認）
- **targetRegion変更**: 環境変数 PUBLIC_TARGET_REGION の変更による表示変化
- **Enabled との混同**: 類似コンポーネントでの使い分けミス

## TODO

なし（実装完了）

## その他留意点として記録しておくこと

### 移行前後の比較
```html
<!-- Hugo -->
{{< disabled2 "JP,US" >}}
CN環境でのみ表示される内容
{{< /disabled2 >}}

<!-- Astro -->
<Disabled2 regions={["JP", "US"]}>
CN環境でのみ表示される内容
</Disabled2>
```

### 使用方法
```astro
---
import Disabled2 from '@/components/Disabled2.astro';
---

<!-- 特定リージョンで非表示 -->
<Disabled2 regions={["JP", "US"]}>
  CN環境でのみ表示される内容
</Disabled2>

<!-- 常に表示（regions未指定） -->
<Disabled2>
  全リージョンで表示される内容  
</Disabled2>
```

### Enabled.astro との使い分け

```astro
<!-- 特定リージョンでのみ表示 -->
<Enabled regions={["US"]}>
  US環境限定コンテンツ
</Enabled>

<!-- 特定リージョンでは非表示 -->  
<Disabled2 regions={["US"]}>
  US環境以外で表示されるコンテンツ
</Disabled2>
```

### 実用例

```astro
<!-- 日本・アメリカ以外（中国）でのみ表示 -->
<Disabled2 regions={["JP", "US"]}>
  中国向け特別機能の説明
</Disabled2>

<!-- アメリカ以外で表示 -->
<Disabled2 regions={["US"]}>
  cybozu.com 関連の説明
</Disabled2>
```

### 依存関係
- `src/lib/env.ts` の `env.targetRegion` プロパティ
- 環境変数 `PUBLIC_TARGET_REGION` の設定
- Enabled.astro（対になるコンポーネント）

### テスト要件
- [ ] 指定リージョンで非表示になることを確認
- [ ] 指定リージョン以外で表示されることを確認
- [ ] regions未定義時の常時表示を確認
- [ ] 空配列時の動作確認
- [ ] Enabled.astro との動作差異を確認

### 関連コンポーネント
- Enabled.astro（対になる表示制御コンポーネント）