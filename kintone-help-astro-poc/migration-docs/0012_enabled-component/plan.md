# Enabled.astro 実装計画

## 概要
Hugo の `enabled2.html` ショートコードを Astro コンポーネント `Enabled.astro` に移行する。

## 元の実装分析

### enabled2.html の機能
```go
{{- if in .Params $.Site.Params.TargetRegion}}
{{- .Inner | .Page.RenderString }}
{{- end}}
```

**機能説明**:
- `.Params` に指定された地域コードが `$.Site.Params.TargetRegion` に含まれるかを判定
- 含まれる場合のみ内部コンテンツ（`.Inner`）を表示
- 地域別の条件付きコンテンツ表示を実現

## Astro 実装方針

### 必要な変更点
1. 現在のダミー実装 `<div><slot /></div>` を実際の条件分岐に変更
2. Props として `regions` を受け取る（配列形式）
3. 環境変数から現在の `targetRegion` を取得
4. 条件判定を実装

### Props インターフェース
```typescript
interface Props {
  regions?: string[];
  env: {
    targetRegion: string;
  };
}
```

## 実装手順

1. **Props 定義**
   - `regions`: 表示対象の地域コード配列
   - `env`: 環境設定（targetRegion を含む）

2. **条件判定ロジック**
   - `regions` が未定義の場合は常に表示
   - `regions` が定義されている場合、`env.targetRegion` が含まれるかチェック

3. **レンダリング**
   - 条件を満たす場合のみ `<slot />` を表示
   - wrapper 要素は追加しない（元の実装に忠実）

## 考慮事項

- **DOM 構造の保持**: 余計な wrapper 要素を追加しない
- **型安全性**: TypeScript による型定義
- **後方互換性**: regions が未指定の場合の動作

## テストケース

1. regions 未指定 → 常に表示
2. regions に現在の地域を含む → 表示
3. regions に現在の地域を含まない → 非表示
4. regions が空配列 → 非表示

## 依存関係

- BaseProps または EnvProps の使用
- targetRegion 環境変数の存在確認