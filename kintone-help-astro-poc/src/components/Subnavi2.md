# Subnavi2.astro 変更記録

元ファイル: `layouts/shortcodes/subnavi2.html`

## 関数・変数の置換

| Hugo | Astro | 備考 |
|------|-------|------|
| `{{ .Get "url_1" }}` | `{url_1}` | Props で受け取り |
| `{{ .Get "icon_1" }}` | `{icon_1}` | Props で受け取り |
| `{{ .Get "title_1" }}` | `{title_1}` | Props で受け取り |
| `{{ .Get "msg_1" }}` | `{msg_1}` | Props で受け取り |
| `{{ .Get "url_2" }}` | `{url_2}` | Props で受け取り |
| `{{ .Get "icon_2" }}` | `{icon_2}` | Props で受け取り |
| `{{ .Get "title_2" }}` | `{title_2}` | Props で受け取り |
| `{{ .Get "msg_2" }}` | `{msg_2}` | Props で受け取り |

## Props 設計

```typescript
interface Props {
  // 1つ目のリンクアイテム
  url_1: string;      // リンクURL
  icon_1: string;     // Font Awesome アイコンクラス
  title_1: string;    // タイトルテキスト
  msg_1: string;      // メッセージテキスト
  
  // 2つ目のリンクアイテム
  url_2: string;      // リンクURL
  icon_2: string;     // Font Awesome アイコンクラス
  title_2: string;    // タイトルテキスト
  msg_2: string;      // メッセージテキスト
}
```

## DOM 構造の変化

なし（完全に同じ構造を保持）

```html
<!-- Hugo/Astro 共通 -->
<aside>
  <nav class="subnavi">
    <!-- 1つ目のアイテム -->
    <a href="[URL_1]" target="_blank">
      <i class="[ICON_1] subnavi2-icon" aria-hidden="true"></i>
      <span class="subnavi2-title">[TITLE_1]</span>
    </a>
    <div class="subnavi2-msg">[MSG_1]</div>
    
    <!-- 区切り線 -->
    <hr class="subnavi-part" />
    
    <!-- 2つ目のアイテム -->
    <a href="[URL_2]" target="_blank">
      <i class="[ICON_2] subnavi2-icon" aria-hidden="true"></i>
      <span class="subnavi2-title">[TITLE_2]</span>
    </a>
    <div class="subnavi2-msg">[MSG_2]</div>
  </nav>
</aside>
```

## 実装パターン

- **複雑なProps**: 8個の必須パラメータを定義
- **2アイテム構造**: 2つのリンクアイテムを区切り線で分離
- **カスタマイズ可能アイコン**: Font Awesome アイコンの自由指定
- **外部リンク**: `target="_blank"` による新しいタブでの開行

## Subnavi.astro との比較

| 項目 | Subnavi.astro | Subnavi2.astro |
|------|---------------|----------------|
| **構造** | 単一メッセージ + 単一リンク | 2つのアイテム + 区切り線 |
| **パラメータ数** | 3個 | 8個 |
| **アイコン** | 固定（far fa-envelope） | カスタマイズ可能 |
| **レイアウト** | メッセージ上、リンク下 | アイテムごとにタイトル・メッセージ |

## リスクが考えられる箇所

- **パラメータ過多**: 8個の必須パラメータによる使用複雑性
- **外部リンクセキュリティ**: `target="_blank"` 使用時の `rel="noopener"` 未設定
- **必須パラメータ**: 8個全てが未指定の場合のエラー
- **Font Awesome依存**: カスタムアイコンクラスの正確性
- **CSS依存**: 複数の専用クラスのスタイル定義

## TODO

- [ ] セキュリティ強化: `rel="noopener noreferrer"` の追加検討
- [ ] パラメータ簡素化: オブジェクト形式での受け渡し検討
- [ ] デフォルト値: パラメータ未指定時の fallback 検討
- [ ] バリデーション: アイコンクラス・URL の validation 追加

## その他留意点として記録しておくこと

### 移行前後の比較
```html
<!-- Hugo -->
{{< subnavi2 
  url_1="https://example1.com" 
  icon_1="fas fa-book" 
  title_1="ドキュメント" 
  msg_1="詳細な使い方"
  url_2="https://example2.com" 
  icon_2="fas fa-comments" 
  title_2="コミュニティ" 
  msg_2="質問・議論" 
>}}

<!-- Astro -->
<Subnavi2 
  url_1="https://example1.com"
  icon_1="fas fa-book"
  title_1="ドキュメント"
  msg_1="詳細な使い方"
  url_2="https://example2.com"
  icon_2="fas fa-comments"
  title_2="コミュニティ"
  msg_2="質問・議論"
/>
```

### 使用方法
```astro
---
import Subnavi2 from '@/components/Subnavi2.astro';
---

<Subnavi2 
  url_1="https://cybozu.dev/ja/"
  icon_1="fas fa-code"
  title_1="開発者ガイド"
  msg_1="APIリファレンスと開発手順"
  url_2="https://cybozu.dev/ja/contact/"
  icon_2="fas fa-question-circle"
  title_2="サポート"
  msg_2="技術的なお問い合わせ"
/>
```

### パラメータ簡素化案
```typescript
// 将来の改善案: オブジェクト形式
interface NavItem {
  url: string;
  icon: string;
  title: string;
  msg: string;
}

interface Props {
  item1: NavItem;
  item2: NavItem;
}

// 使用例
<Subnavi2 
  item1={{
    url: "https://example1.com",
    icon: "fas fa-book",
    title: "ドキュメント",
    msg: "詳細な使い方"
  }}
  item2={{
    url: "https://example2.com", 
    icon: "fas fa-comments",
    title: "コミュニティ",
    msg: "質問・議論"
  }}
/>
```

### セキュリティ改善案
```astro
<!-- セキュリティ強化版 -->
<a href={url_1} target="_blank" rel="noopener noreferrer">
  <i class={`${icon_1} subnavi2-icon`} aria-hidden="true"></i>
  <span class="subnavi2-title">{title_1}</span>
</a>
```

### CSS 依存関係
```css
.subnavi {
  /* ナビゲーション全体のスタイル */
}

.subnavi2-icon {
  /* アイコンのスタイル */
}

.subnavi2-title {
  /* タイトルのスタイル */
}

.subnavi2-msg {
  /* メッセージのスタイル */
}

.subnavi-part {
  /* 区切り線のスタイル */
}
```

### 用途の推測
- 2つの関連リソースへの誘導（ドキュメント・サポート）
- 代替手段の提示（方法A・方法B）
- 関連サービスの紹介（製品A・製品B）

### 依存関係
- Font Awesome CSS/JS（カスタムアイコン）
- CSS スタイル定義（subnavi2-* クラス群）

### テスト要件
- [ ] 8個のパラメータでの正常な表示確認
- [ ] 2つの外部リンクの動作確認（新しいタブで開く）
- [ ] カスタムアイコンの表示確認
- [ ] 区切り線の表示確認
- [ ] CSS スタイルの適用確認
- [ ] パラメータ未指定時の動作確認

### 関連コンポーネント
- Subnavi.astro（シンプル版）
- DevnetTop.astro（類似の外部リンクコンポーネント）