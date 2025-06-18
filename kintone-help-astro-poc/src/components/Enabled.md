# Enabled 変更記録

元ファイル: `layouts/shortcodes/enabled2.html`

## 関数・変数の置換

| Hugo                         | Astro                 | 備考                           |
| ---------------------------- | --------------------- | ------------------------------ |
| `.Params`                    | `regions` prop        | 配列形式で地域コードを受け取る |
| `$.Site.Params.TargetRegion` | `env.targetRegion`    | 環境変数から取得               |
| `in` 演算子                  | `includes()` メソッド | 配列内の要素チェック           |
| `.Inner`                     | `<slot />`            | Astro のスロット機能           |
| `.Page.RenderString`         | -                     | Astro では不要（自動処理）     |

## TODO

- [x] 基本的な条件分岐実装
- [ ] 使用箇所の確認と動作テスト

## 構造の変化

### Hugo（enabled2.html）

```html
{{- if in .Params $.Site.Params.TargetRegion}} {{- .Inner | .Page.RenderString
}} {{- end}}
```

### Astro（Enabled.astro）

```astro
---
interface Props {
  regions?: string[];
  env: {
    targetRegion: string;
  };
}

const { regions, env } = Astro.props;
const shouldDisplay = !regions || regions.includes(env.targetRegion);
---

{shouldDisplay && <slot />}
```

## その他の差分

1. **Props の明示的定義**: TypeScript による型安全性の確保
2. **条件判定の簡素化**: 変数 `shouldDisplay` で可読性向上
3. **wrapper 要素なし**: 元の実装に忠実（余計な要素を追加しない）

## 外部依存

- 環境変数 `targetRegion` の存在が前提

## 注意事項

- `regions` が未定義の場合は常に表示（後方互換性）
- 空配列の場合は非表示（どの地域にも該当しない）
