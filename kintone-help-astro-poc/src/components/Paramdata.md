# Paramdata.astro 変更記録

元ファイル: `layouts/shortcodes/paramdata.html`

## 関数・変数の置換

| Hugo | Astro | 備考 |
|------|-------|------|
| `{{.Get "type"}}` | `{type}` | ショートコードパラメータを Props で受け取り |
| `{{.Inner \| markdownify}}` | `<slot />` | ショートコード内容を Astro slot で表示 |

## Props 設計

```typescript
interface Props {
  type: string;
}
```

## DOM 構造の変化

なし（完全に同じ構造を保持）

```html
<!-- Hugo/Astro 共通 -->
<div class="tmp-{type}">
  [内容]
</div>
```

## 実装パターン

- **カスタムProps**: type パラメータを必須プロパティとして定義
- **動的クラス生成**: `tmp-${type}` によるテンプレートリテラル活用
- **Slot活用**: Hugo の `.Inner | markdownify` を Astro の `<slot />` で代替

## リスクが考えられる箇所

- **type値の制限**: type プロパティに不正な値が渡された場合のCSS影響
- **Markdown処理**: Hugo の `markdownify` 機能は Astro では自動処理されるため、差異が生じる可能性
- **CSS依存**: `tmp-*` クラス群のCSS定義状況が不明
- **型安全性**: type が string 型だが、実際は特定の値のみが有効の可能性

## TODO

- [ ] type プロパティの有効値を調査・制限する
- [ ] CSS で定義されている `tmp-*` クラス一覧の確認

## その他留意点として記録しておくこと

### 移行前後の比較
```html
<!-- Hugo -->
{{< paramdata type="example" >}}
コンテンツ
{{< /paramdata >}}

<!-- Astro -->
<Paramdata type="example">
コンテンツ
</Paramdata>
```

### 使用方法
```astro
---
import Paramdata from '@/components/Paramdata.astro';
---

<Paramdata type="example">
  クラス tmp-example が適用される内容
</Paramdata>
```

### type パラメータの用途
- 動的なCSS クラス生成に使用
- `tmp-{type}` 形式でクラス名を構築
- 用途不明のため、実際の使用例の調査が必要

### 型安全性の改善案
```typescript
// 将来的な改善案
type ValidType = 'example' | 'data' | 'content' | /* その他有効値 */;

interface Props {
  type: ValidType;
}
```

### CSS 依存関係
- `tmp-*` パターンのCSSクラス定義が必要
- 各 type 値に対応するスタイル定義の存在確認要

### テスト要件
- [ ] 各種 type 値での正常なクラス生成を確認
- [ ] CSS スタイルの適用確認
- [ ] MDXファイル内での使用テスト
- [ ] 不正な type 値での動作確認

### 関連ファイル
- CSS/SCSS ファイルでの `tmp-*` クラス定義群
- 実際の MDX ファイルでの使用例
- type パラメータの有効値ドキュメント