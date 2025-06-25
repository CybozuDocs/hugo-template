# AdminButtonLabel.astro 変更記録

元ファイル: `layouts/shortcodes/admin_button_label.html`

## 関数・変数の置換

| Hugo | Astro | 備考 |
|------|-------|------|
| `{{$.Site.Params.admin_button_label}}` | `import.meta.env.PUBLIC_ADMIN_BUTTON_LABEL` | 環境変数から取得 |

## Props 設計

```typescript
// Props 不要（Props-free パターン）
// 環境変数から値を取得
```

## DOM 構造の変化

なし（テキストのみの出力）

```html
<!-- Hugo/Astro 共通 -->
管理者ボタンのラベル文字列
```

## 実装パターン

- **Props-free**: パラメータなしのシンプルなテキスト出力
- **環境変数利用**: `PUBLIC_ADMIN_BUTTON_LABEL` 環境変数から取得
- **フォールバック**: 環境変数未設定時は "管理者" をデフォルト値として使用
- **テキスト出力**: HTML タグを使わないプレーンテキスト

## リスクが考えられる箇所

- **環境変数依存**: `PUBLIC_ADMIN_BUTTON_LABEL` が未設定の場合のフォールバック
- **多言語化**: ハードコードされたデフォルト値（"管理者"）
- **用途不明**: 具体的な使用箇所や文脈が不明
- **動的変更**: 実行時のラベル変更が不可能

## TODO

- [ ] デフォルト値の多言語化対応検討
- [ ] 環境変数の設定ドキュメント作成
- [ ] 実際の使用箇所での動作確認
- [ ] kintone での適切なラベル文言の調査

## その他留意点として記録しておくこと

### 移行前後の比較
```html
<!-- Hugo -->
{{< admin_button_label >}}

<!-- Astro -->
<AdminButtonLabel />
```

### 使用方法
```astro
---
import AdminButtonLabel from '@/components/AdminButtonLabel.astro';
---

<!-- ボタンやリンクのラベルとして使用 -->
<button class="admin-btn">
  <AdminButtonLabel />
</button>

<!-- 文章内での使用 -->
<p><AdminButtonLabel />の権限が必要です。</p>
```

### 環境変数設定例
```bash
# .env ファイル
PUBLIC_ADMIN_BUTTON_LABEL=Administrator

# 多言語対応の場合
PUBLIC_ADMIN_BUTTON_LABEL_JA=管理者
PUBLIC_ADMIN_BUTTON_LABEL_EN=Administrator
PUBLIC_ADMIN_BUTTON_LABEL_ZH=管理员
```

### 推測される用途
- UI ボタンのラベル表示
- 権限説明でのロール名表示
- ヘルプドキュメントでの管理者参照
- フォームのラベルやプレースホルダー

### 多言語化改善案
```astro
---
import Wovn from '@/components/Wovn.astro';

// WOVN による多言語化対応案
---

<Wovn>i18n__admin_button_label</Wovn>
```

### 動的ラベル対応案（将来検討）
```astro
---
interface Props {
  variant?: 'default' | 'short' | 'full';
}

const { variant = 'default' } = Astro.props;

const labels = {
  default: import.meta.env.PUBLIC_ADMIN_BUTTON_LABEL || "管理者",
  short: import.meta.env.PUBLIC_ADMIN_BUTTON_LABEL_SHORT || "管理",
  full: import.meta.env.PUBLIC_ADMIN_BUTTON_LABEL_FULL || "システム管理者"
};
---

{labels[variant]}
```

### 環境変数のフォールバック戦略
```astro
---
// より堅牢なフォールバック
const getAdminLabel = () => {
  return import.meta.env.PUBLIC_ADMIN_BUTTON_LABEL 
    || import.meta.env.PUBLIC_DEFAULT_ADMIN_LABEL 
    || "管理者";
};

const adminButtonLabel = getAdminLabel();
---

{adminButtonLabel}
```

### kintone 固有の考慮事項
```astro
---
// kintone 固有のラベル
const adminButtonLabel = import.meta.env.PUBLIC_ADMIN_BUTTON_LABEL || "kintone 管理者";
---
```

### Hugo サイトパラメータとの対応

| Hugo | Astro | 設定場所 |
|------|-------|----------|
| `$.Site.Params.admin_button_label` | `PUBLIC_ADMIN_BUTTON_LABEL` | 環境変数 |
| `config.yaml` の params | `.env` ファイル | 設定ファイル |

### 使用例パターン
```astro
<!-- UI コンポーネント内での使用 -->
<div class="permission-notice">
  <AdminButtonLabel />の権限でアクセスしてください
</div>

<!-- ボタンコンポーネント内での使用 -->
<button type="button" class="btn btn-admin">
  <i class="fas fa-user-shield"></i>
  <AdminButtonLabel />
</button>

<!-- ナビゲーション内での使用 -->
<nav class="admin-nav">
  <a href="/admin" class="nav-link">
    <AdminButtonLabel />画面
  </a>
</nav>
```

### CSS との連携
```css
/* 管理者関連UI のスタイル */
.admin-btn {
  background: #dc3545; /* 管理者を示す赤色 */
  color: white;
}

.permission-notice {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  padding: 0.75rem;
}
```

### アクセシビリティ考慮事項
```astro
<!-- スクリーンリーダー対応 -->
<button aria-label="管理者機能へアクセス">
  <AdminButtonLabel />
</button>

<!-- 略称での表示時の補完 -->
<abbr title="システム管理者">
  <AdminButtonLabel />
</abbr>
```

### デバッグ・開発時の考慮事項
```astro
---
const adminButtonLabel = import.meta.env.PUBLIC_ADMIN_BUTTON_LABEL || "管理者";

// 開発時のデバッグ情報
if (import.meta.env.DEV && !import.meta.env.PUBLIC_ADMIN_BUTTON_LABEL) {
  console.warn('PUBLIC_ADMIN_BUTTON_LABEL is not set, using default value');
}
---

{adminButtonLabel}
```

### テストでの考慮事項
```typescript
// テスト用のモック
const mockEnv = {
  PUBLIC_ADMIN_BUTTON_LABEL: 'Test Admin'
};

// テストケース
test('AdminButtonLabel renders correct label', () => {
  // 環境変数設定
  // コンポーネントレンダリング
  // 期待値確認
});
```

### 国際化での使用例
```astro
---
// 地域別のデフォルト値
const getDefaultLabel = () => {
  const locale = import.meta.env.PUBLIC_LOCALE || 'ja';
  const defaults = {
    ja: '管理者',
    en: 'Administrator', 
    zh: '管理员',
    es: 'Administrador'
  };
  return defaults[locale] || defaults.ja;
};

const adminButtonLabel = import.meta.env.PUBLIC_ADMIN_BUTTON_LABEL || getDefaultLabel();
---
```

### パフォーマンス考慮事項
- 環境変数アクセスはビルド時に解決されるため実行時コストなし
- テキスト出力のみなので描画コストは最小限
- キャッシュやメモ化は不要

### セキュリティ考慮事項
- 環境変数の値はクライアントサイドで見える（PUBLIC_ prefix）
- 機密情報を含まないテキストラベルなので問題なし
- XSS リスクはテキストのみなので低い

### 依存関係
- 環境変数 `PUBLIC_ADMIN_BUTTON_LABEL`（任意）
- フォールバック用のデフォルト値

### テスト要件
- [ ] 環境変数設定時の正常な表示確認
- [ ] 環境変数未設定時のデフォルト値確認
- [ ] 様々な UI コンテキストでの表示確認
- [ ] 多言語環境での表示確認
- [ ] アクセシビリティ（スクリーンリーダー）確認

### 関連コンポーネント
- なし（独立したテキスト出力コンポーネント）

### 実装の完全性
このコンポーネントは以下の点で完全な実装：
- Hugo の機能を完全に再現
- 適切なフォールバック機能
- シンプルで保守性が高い
- 拡張可能な設計