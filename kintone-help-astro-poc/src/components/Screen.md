# Screen.astro 変更記録

元ファイル: `layouts/shortcodes/screen.html`

## 関数・変数の置換

| Hugo | Astro | 備考 |
|------|-------|------|
| `{{.Get "src" }}` | `{src}` | Props で受け取り |
| `{{ .Get "alt" }}` | `{alt}` | Props で受け取り |

## Props 設計

```typescript
interface Props {
  src: string;   // 画像ソースパス
  alt: string;   // alt属性（アクセシビリティ）
}
```

## DOM 構造の変化

なし（完全に同じ構造を保持）

```html
<!-- Hugo/Astro 共通 -->
<img class="screenshot" src="[画像パス]" alt="[説明]" data-action="zoom" />
```

## 実装パターン

- **カスタムProps**: 2つの必須パラメータを定義
- **アクセシビリティ対応**: alt 属性を必須パラメータとして設計
- **拡大機能**: `data-action="zoom"` による画像拡大機能
- **専用クラス**: screenshot クラスによるスクリーンショット専用スタイル

## Logo.astro との比較

| 項目 | Logo.astro | Screen.astro |
|------|------------|--------------|
| **用途** | ロゴリンク表示 | スクリーンショット表示 |
| **構造** | a > img | img のみ |
| **リンク** | 外部リンク有り | リンクなし |
| **拡大機能** | なし | data-action="zoom" |
| **クラス** | col-logo | screenshot |
| **alt属性** | 未設定（TODO） | 必須パラメータ |

## 特殊機能: data-action="zoom"

**拡大機能**: クリックで画像を拡大表示する機能

### 実装方法の推測
- JavaScript ライブラリによる画像拡大
- CSS transform による拡大表示
- モーダルウィンドウでの画像表示
- ブラウザの画像ビューアー機能

## リスクが考えられる箇所

- **JavaScript依存**: `data-action="zoom"` 機能の JavaScript 実装必須
- **必須パラメータ**: src, alt が未指定の場合のエラー
- **画像読み込み**: 存在しない画像パスの場合の表示
- **CSS依存**: `.screenshot` クラスのスタイル定義
- **拡大機能**: zoom 機能が動作しない場合のユーザー体験

## TODO

- [ ] **重要**: zoom 機能の JavaScript 実装確認
- [ ] パラメータバリデーション: 画像パスの validation 追加
- [ ] エラーハンドリング: 画像読み込み失敗時の fallback
- [ ] zoom 機能無効時の fallback 動作検討

## その他留意点として記録しておくこと

### 移行前後の比較
```html
<!-- Hugo -->
{{< screen src="/images/screenshot.png" alt="kintone アプリ画面" >}}

<!-- Astro -->
<Screen 
  src="/images/screenshot.png" 
  alt="kintone アプリ画面" 
/>
```

### 使用方法
```astro
---
import Screen from '@/components/Screen.astro';
---

<Screen 
  src="/public/images/kintone-app.png"
  alt="kintone アプリの設定画面"
/>
```

### アクセシビリティの優位性
Logo.astro と異なり、Screen.astro では alt 属性が必須パラメータとして設計されており、アクセシビリティがより適切に考慮されている。

### zoom 機能の JavaScript 実装例
```javascript
// 推測される JavaScript 実装
document.addEventListener('click', function(e) {
  if (e.target.dataset.action === 'zoom') {
    // 画像拡大ロジック
    showImageModal(e.target.src, e.target.alt);
  }
});
```

### CSS 依存関係
```css
.screenshot {
  /* スクリーンショット専用スタイル */
  max-width: 100%;
  height: auto;
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  cursor: zoom-in; /* zoom 機能のヒント */
}

.screenshot:hover {
  /* ホバー効果 */
}
```

### 用途の推測
- 操作手順でのスクリーンショット表示
- UI 画面の説明
- 設定画面のキャプチャ
- エラー画面の例示

### zoom 機能の代替案
```astro
<!-- JavaScript が無効な場合の代替案 -->
<a href={src} target="_blank">
  <img class="screenshot" src={src} alt={alt} />
</a>
```

### 依存関係
- CSS スタイル定義（.screenshot クラス）
- JavaScript（zoom 機能実装）
- 画像ファイル（src で指定）

### テスト要件
- [ ] 2つのパラメータでの正常な表示確認
- [ ] 画像の表示確認
- [ ] alt 属性の適切な設定確認
- [ ] zoom 機能の動作確認
- [ ] CSS スタイルの適用確認
- [ ] 存在しない画像パスでの動作確認
- [ ] JavaScript 無効時の動作確認

### 関連コンポーネント
- Logo.astro（画像表示の類似コンポーネント）