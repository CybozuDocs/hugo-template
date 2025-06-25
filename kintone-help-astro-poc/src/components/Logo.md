# Logo.astro 変更記録

元ファイル: `layouts/shortcodes/logo.html`

## 関数・変数の置換

| Hugo | Astro | 備考 |
|------|-------|------|
| `{{- .Get "link_href" -}}` | `{link_href}` | Props で受け取り |
| `{{- .Get "img_src" -}}` | `{img_src}` | Props で受け取り |

## Props 設計

```typescript
interface Props {
  link_href: string;  // リンクURL
  img_src: string;    // 画像ソースパス
}
```

## DOM 構造の変化

なし（完全に同じ構造を保持）

```html
<!-- Hugo/Astro 共通 -->
<a class="col-logo" href="[リンクURL]" target="_blank">
  <img src="[画像パス]" />
</a>
```

## 実装パターン

- **カスタムProps**: 2つの必須パラメータを定義
- **外部リンク**: `target="_blank"` による新しいタブでの開行
- **画像表示**: img 要素による画像読み込み
- **ロゴリンク**: 画像クリックでリンク遷移

## リスクが考えられる箇所

- **外部リンクセキュリティ**: `target="_blank"` 使用時の `rel="noopener"` 未設定
- **アクセシビリティ**: img 要素の `alt` 属性が未設定
- **必須パラメータ**: link_href, img_src が未指定の場合のエラー
- **画像読み込み**: 存在しない画像パスの場合の表示
- **CSS依存**: `.col-logo` クラスのスタイル定義

## TODO

- [ ] **高優先度**: セキュリティ強化 `rel="noopener noreferrer"` の追加
- [ ] **高優先度**: アクセシビリティ改善 `alt` 属性の追加
- [ ] パラメータバリデーション: URL・画像パスの validation 追加
- [ ] エラーハンドリング: 画像読み込み失敗時の fallback

## その他留意点として記録しておくこと

### 移行前後の比較
```html
<!-- Hugo -->
{{< logo link_href="https://example.com" img_src="/images/logo.png" >}}

<!-- Astro -->
<Logo 
  link_href="https://example.com" 
  img_src="/images/logo.png" 
/>
```

### 使用方法
```astro
---
import Logo from '@/components/Logo.astro';
---

<Logo 
  link_href="https://cybozu.com"
  img_src="/public/images/cybozu-logo.png"
/>
```

### セキュリティ・アクセシビリティ改善案
```astro
---
interface Props {
  link_href: string;
  img_src: string;
  alt?: string;  // alt 属性を追加
}

const { link_href, img_src, alt = "Logo" } = Astro.props;
---

<a class="col-logo" href={link_href} target="_blank" rel="noopener noreferrer">
  <img src={img_src} alt={alt} />
</a>
```

### パラメータバリデーション案
```typescript
interface Props {
  link_href: string;
  img_src: string;
  alt?: string;
}

const { link_href, img_src, alt = "Logo" } = Astro.props;

// URL形式チェック
try {
  new URL(link_href);
} catch {
  throw new Error('Invalid URL provided to Logo component');
}

// 画像パスチェック
if (!img_src) {
  throw new Error('img_src is required for Logo component');
}
```

### 用途の推測
- パートナー企業のロゴ表示
- 外部サービスへのリンク付きロゴ
- スポンサーロゴの表示
- 関連製品のロゴリンク

### CSS 依存関係
```css
.col-logo {
  /* ロゴリンクのスタイル */
  display: inline-block;
  /* ホバー効果、レイアウト等 */
}

.col-logo img {
  /* ロゴ画像のスタイル */
  max-width: 100%;
  height: auto;
}
```

### アクセシビリティ考慮事項
- **alt属性**: 画像の説明を適切に設定
- **ロゴの説明**: 何のロゴか明確に示す
- **キーボードナビゲーション**: フォーカス可能なリンク要素

### 依存関係
- CSS スタイル定義（.col-logo クラス）
- 画像ファイル（img_src で指定）

### テスト要件
- [ ] 2つのパラメータでの正常な表示確認
- [ ] 外部リンクの動作確認（新しいタブで開く）
- [ ] 画像の表示確認
- [ ] CSS スタイルの適用確認
- [ ] 存在しない画像パスでの動作確認
- [ ] アクセシビリティ（キーボードナビゲーション）確認

### 関連コンポーネント
- DevnetTop.astro（類似の外部リンクコンポーネント）
- Subnavi.astro, Subnavi2.astro（外部リンク機能）