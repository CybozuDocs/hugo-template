# Proc2.astro 変更記録

元ファイル: `layouts/shortcodes/proc2.html`

## 関数・変数の置換

| Hugo | Astro | 備考 |
|------|-------|------|
| `{{ .Inner \| markdownify }}` | `<slot />` | スロットで内容を受け取り |

## Props 設計

```typescript
// Props 不要（Props-free パターン）
```

## DOM 構造の変化

なし（完全に同じ構造を保持）

```html
<!-- Hugo/Astro 共通 -->
<span class="proc2">[内容]</span>
```

## 実装パターン

- **Props-free**: パラメータなしのシンプルなラッパーコンポーネント
- **スロット利用**: `<slot />` によるコンテンツ挿入
- **シンプルラッパー**: CSS クラス付与のみの最小実装
- **Markdown対応**: Astro では自動的にMarkdown処理される

## Proc1.astro との比較

| 項目 | Proc1.astro | Proc2.astro |
|------|-------------|-------------|
| **DOM構造** | `<span class="proc1">` | `<span class="proc2">` |
| **実装パターン** | Props-free, slot | Props-free, slot |
| **用途推測** | 主要プロセス | 補助プロセス |
| **視覚的差異** | CSS クラスによる | CSS クラスによる |

## リスクが考えられる箇所

- **CSS依存**: `.proc2` クラスのスタイル定義が必須
- **内容空白**: スロット内容が空の場合の表示
- **Markdown処理**: Astroでの Markdown 処理方法の違い
- **用途区別**: Proc1 との使い分けルールが不明
- **視覚的差異**: CSS 次第で同じに見える可能性

## TODO

- [ ] `.proc2` CSS クラスの用途と影響範囲の調査
- [ ] Proc1.astro との視覚的差異の確認
- [ ] プロセス表示の階層構造やレベルの調査
- [ ] 空コンテンツ時の動作確認
- [ ] 実際の使用例での Proc1/Proc2 の使い分け確認

## その他留意点として記録しておくこと

### 移行前後の比較
```html
<!-- Hugo -->
{{< proc2 >}}補助的なプロセス手順{{< /proc2 >}}

<!-- Astro -->
<Proc2>補助的なプロセス手順</Proc2>
```

### 使用方法
```astro
---
import Proc2 from '@/components/Proc2.astro';
---

<Proc2>
  詳細手順: 設定値を確認します
</Proc2>
```

### 推測される用途差異
```html
<!-- 主要プロセス -->
<Proc1>手順 1: アプリを作成します</Proc1>

<!-- 補助・詳細プロセス -->
<Proc2>注意: 権限を確認してください</Proc2>
```

### CSS 依存関係
```css
.proc1 {
  /* 主要プロセス - 目立つスタイル */
  font-weight: bold;
  color: #007bff;
  font-size: 1.1em;
}

.proc2 {
  /* 補助プロセス - 控えめなスタイル */
  font-weight: normal;
  color: #6c757d;
  font-size: 0.9em;
}
```

### プロセス階層の推測パターン

| レベル | コンポーネント | 用途例 |
|--------|---------------|--------|
| **主要** | Proc1 | 必須の手順 |
| **補助** | Proc2 | 注意事項、詳細説明 |
| **ステップ** | Stepindex2 | 番号付きステップ |
| **アンカー** | Anchorstep2 | リンク付きステップ |

### 使用例パターン
```astro
<!-- 階層的なプロセス表示の例 -->
<Proc1>kintone アプリを設定する</Proc1>
<Proc2>事前にアプリの権限設定を確認してください</Proc2>

<Proc1>フィールドを追加する</Proc1>
<Proc2>フィールド名は分かりやすい名前にしましょう</Proc2>
```

### 同一ファイル内での使い分け例
```astro
---
import Proc1 from '@/components/Proc1.astro';
import Proc2 from '@/components/Proc2.astro';
---

<h3>アプリ設定手順</h3>

<Proc1>1. kintone にログインします</Proc1>
<Proc2>ログイン情報は管理者にお問い合わせください</Proc2>

<Proc1>2. アプリを作成します</Proc1>
<Proc2>テンプレートから作成すると効率的です</Proc2>
```

### アクセシビリティ考慮事項
- span 要素のため、セマンティックな意味は CSS に依存
- プロセスの重要度を視覚的だけでなく構造的に示すことを検討
- aria-label や role 属性での補強を検討

### セマンティック改善案（将来検討）
```astro
<!-- 重要度や階層を明示的に示す案 -->
<span class="proc2" role="note" aria-label="補助情報">
  <slot />
</span>
```

### Markdown 処理の違い
```html
<!-- Hugo: markdownify フィルタ -->
{{ .Inner | markdownify }}

<!-- Astro: 自動 Markdown 処理 -->
<slot />
```

### 依存関係
- CSS スタイル定義（.proc2 クラス）
- Astro のスロット機能
- Proc1.astro との視覚的差別化

### テスト要件
- [ ] 通常テキストでの表示確認
- [ ] Markdown記法での表示確認
- [ ] Proc1.astro との視覚的差異確認
- [ ] 長いテキストでの表示確認
- [ ] 空コンテンツでの表示確認
- [ ] CSS スタイルの適用確認
- [ ] 同一ページでの Proc1/Proc2 混在表示確認

### 関連コンポーネント
- Proc1.astro（主要プロセス表示）
- Stepindex2.astro（ステップインデックス表示）
- Anchorstep2.astro（アンカーステップ表示）

### 実装の一貫性
Proc1.astro と同じ実装パターンを採用しており、唯一の違いは CSS クラス名のみ。この一貫性により：
- メンテナンスが容易
- 使用方法が統一
- 拡張性が高い

### 視覚的差異の重要性
CSS による差別化が唯一の区別手段のため、スタイル定義が重要：
- 色の違い
- フォントサイズの違い  
- フォントウェイトの違い
- アイコンや装飾の有無

### 将来の拡張可能性
```astro
<!-- パラメータ化案（将来検討） -->
<span class={`proc${level}`} role={semanticRole}>
  <slot />
</span>
```