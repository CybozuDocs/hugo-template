# Subnavi.astro 変更記録

元ファイル: `layouts/shortcodes/subnavi.html`

## 関数・変数の置換

| Hugo | Astro | 備考 |
|------|-------|------|
| `{{ .Get "msg"}}` | `{msg}` | Props で受け取り |
| `{{ .Get "url" }}` | `{url}` | Props で受け取り |
| `{{ .Get "inquiry"}}` | `{inquiry}` | Props で受け取り |

## Props 設計

```typescript
interface Props {
  msg: string;      // メッセージテキスト
  url: string;      // リンクURL
  inquiry: string;  // 問い合わせテキスト
}
```

## DOM 構造の変化

なし（完全に同じ構造を保持）

```html
<!-- Hugo/Astro 共通 -->
<nav class="subnavi">
  <aside>
    <div class="subnavimsg">[メッセージ]</div>
    <div class="subnavibtn">
      <a href="[URL]" target="_blank" class="subnavianc">
        <i class="far fa-envelope" aria-hidden="true"></i>
        <h4>[問い合わせテキスト]</h4>
      </a>
    </div>
  </aside>
</nav>
```

## 実装パターン

- **カスタムProps**: 3つの必須パラメータを定義
- **外部リンク**: `target="_blank"` による新しいタブでの開行
- **Font Awesome統合**: `far fa-envelope` アイコン使用
- **ナビゲーション構造**: `nav` > `aside` > コンテンツ

## リスクが考えられる箇所

- **外部リンクセキュリティ**: `target="_blank"` 使用時の `rel="noopener"` 未設定
- **必須パラメータ**: msg, url, inquiry が未指定の場合のエラー
- **Font Awesome依存**: Font Awesome CSS/JSの読み込み必須
- **CSS依存**: `.subnavi`, `.subnavimsg`, `.subnavibtn`, `.subnavianc` クラスのスタイル定義

## TODO

- [ ] セキュリティ強化: `rel="noopener noreferrer"` の追加検討
- [ ] パラメータバリデーション: 必須パラメータの validation 追加
- [ ] デフォルト値: パラメータ未指定時の fallback 検討

## その他留意点として記録しておくこと

### 移行前後の比較
```html
<!-- Hugo -->
{{< subnavi msg="お困りですか？" url="https://example.com/contact" inquiry="お問い合わせ" >}}

<!-- Astro -->
<Subnavi 
  msg="お困りですか？" 
  url="https://example.com/contact" 
  inquiry="お問い合わせ" 
/>
```

### 使用方法
```astro
---
import Subnavi from '@/components/Subnavi.astro';
---

<Subnavi 
  msg="サポートが必要ですか？"
  url="https://cybozu.dev/ja/contact/"
  inquiry="開発者向けお問い合わせ"
/>
```

### セキュリティ改善案
```astro
<!-- セキュリティ強化版 -->
<a href={url} target="_blank" rel="noopener noreferrer" class="subnavianc">
  <i class="far fa-envelope" aria-hidden="true"></i>
  <h4>{inquiry}</h4>
</a>
```

### パラメータバリデーション案
```typescript
interface Props {
  msg: string;
  url: string;
  inquiry: string;
}

const { msg, url, inquiry } = Astro.props;

// バリデーション
if (!msg || !url || !inquiry) {
  throw new Error('Subnavi requires msg, url, and inquiry parameters');
}

// URL形式チェック
try {
  new URL(url);
} catch {
  throw new Error('Invalid URL provided to Subnavi component');
}
```

### 用途の推測
- サポート・お問い合わせへの誘導
- 外部リソースへのナビゲーション
- ページ下部での関連リンク表示
- CTA（Call to Action）ボタンとしての使用

### CSS 依存関係
```css
.subnavi {
  /* ナビゲーション全体のスタイル */
}

.subnavimsg {
  /* メッセージテキストのスタイル */
}

.subnavibtn {
  /* ボタン領域のスタイル */
}

.subnavianc {
  /* リンクアンカーのスタイル */
}
```

### 依存関係
- Font Awesome CSS/JS（`far fa-envelope` アイコン）
- CSS スタイル定義（上記クラス群）

### テスト要件
- [ ] 3つのパラメータでの正常な表示確認
- [ ] 外部リンクの動作確認（新しいタブで開く）
- [ ] Font Awesome アイコンの表示確認
- [ ] CSS スタイルの適用確認
- [ ] アクセシビリティ（キーボードナビゲーション）確認
- [ ] パラメータ未指定時の動作確認

### 関連コンポーネント
- Subnavi2.astro（バリエーション版、次の実装対象）
- DevnetTop.astro（類似の外部リンクコンポーネント）