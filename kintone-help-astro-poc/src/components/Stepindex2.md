# Stepindex2.astro 変更記録

元ファイル: `layouts/shortcodes/stepindex2.html`

## 関数・変数の置換

| Hugo | Astro | 備考 |
|------|-------|------|
| `{{.Get "target"}}` | `{target}` | Props で受け取り |

## Props 設計

```typescript
interface Props {
  target: string;  // テーブル要素の id 属性
}
```

## DOM 構造の変化

なし（完全に同じ構造を保持）

```html
<!-- Hugo/Astro 共通 -->
<div class="step-list-wrapper">
  <strong>Steps:</strong>
  <table class="step-list list-place" id="[target値]"></table>
</div>
```

## 実装パターン

- **カスタムProps**: target パラメータで id を動的設定
- **ステップ表示**: ステップ一覧を表形式で表示
- **JavaScript連携**: 空のテーブルを JavaScript で動的に埋める想定
- **固定ラベル**: "Steps:" ラベルの多言語化なし

## リスクが考えられる箇所

- **JavaScript依存**: 空のテーブルを埋める JavaScript 実装が必須
- **必須パラメータ**: target が未指定の場合のエラー
- **CSS依存**: 複数のクラス（step-list-wrapper, step-list, list-place）のスタイル定義
- **多言語化**: "Steps:" ラベルがハードコード（WOVN 対応なし）
- **id重複**: 同じ target 値を持つ複数のコンポーネントでの id 衝突

## TODO

- [ ] **重要**: JavaScript でのテーブル生成ロジックの実装確認
- [ ] **重要**: "Steps:" ラベルの多言語化対応（WOVN 対応）
- [ ] パラメータバリデーション: target の空文字チェック
- [ ] id重複防止の仕組み検討
- [ ] 空テーブルの表示スタイル確認

## その他留意点として記録しておくこと

### 移行前後の比較
```html
<!-- Hugo -->
{{< stepindex2 target="main-steps" >}}

<!-- Astro -->
<Stepindex2 target="main-steps" />
```

### 使用方法
```astro
---
import Stepindex2 from '@/components/Stepindex2.astro';
---

<Stepindex2 target="kintone-setup-steps" />
```

### 推測される JavaScript 連携
```javascript
// 推測される JavaScript 実装
function populateSteps(targetId, steps) {
  const table = document.getElementById(targetId);
  steps.forEach((step, index) => {
    const row = table.insertRow();
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    cell1.textContent = index + 1;
    cell2.textContent = step.title;
  });
}

// 使用例
populateSteps('main-steps', [
  { title: 'ログイン' },
  { title: 'アプリ作成' },
  { title: '設定完了' }
]);
```

### CSS 依存関係
```css
.step-list-wrapper {
  /* ラッパーコンテナのスタイル */
  margin: 1rem 0;
  padding: 1rem;
  border: 1px solid #ddd;
}

.step-list {
  /* ステップテーブルのスタイル */
  width: 100%;
  border-collapse: collapse;
}

.list-place {
  /* リスト配置のスタイル */
  /* 特定の配置ルール */
}

.step-list td {
  /* テーブルセルのスタイル */
  padding: 0.5rem;
  border-bottom: 1px solid #eee;
}
```

### 多言語化対応案
```astro
---
import Wovn from '@/components/Wovn.astro';

interface Props {
  target: string;
}

const { target } = Astro.props;
---

<div class="step-list-wrapper">
  <strong><Wovn>i18n__Steps_label</Wovn></strong>
  <table class="step-list list-place" id={target}></table>
</div>
```

### パラメータバリデーション案
```astro
---
interface Props {
  target: string;
}

const { target } = Astro.props;

// バリデーション
if (!target || target.trim() === '') {
  throw new Error('target parameter is required for Stepindex2 component');
}

// HTML id として有効な値かチェック
if (!/^[a-zA-Z][\w-]*$/.test(target)) {
  throw new Error('target must be a valid HTML id');
}
---
```

### テーブル生成の代替実装案
```astro
---
interface Props {
  target: string;
  steps?: Array<{title: string, description?: string}>;
}

const { target, steps = [] } = Astro.props;
---

<div class="step-list-wrapper">
  <strong>Steps:</strong>
  <table class="step-list list-place" id={target}>
    {steps.length > 0 && steps.map((step, index) => (
      <tr>
        <td>{index + 1}</td>
        <td>{step.title}</td>
        {step.description && <td>{step.description}</td>}
      </tr>
    ))}
  </table>
</div>
```

### JavaScript なしでの代替表示案
```astro
---
interface Props {
  target: string;
}

const { target } = Astro.props;
---

<div class="step-list-wrapper">
  <strong>Steps:</strong>
  <table class="step-list list-place" id={target}>
    <tr class="placeholder">
      <td colspan="2">ステップが読み込まれます...</td>
    </tr>
  </table>
</div>
```

### 関連コンポーネントとの連携

| コンポーネント | 関係 | 用途 |
|---------------|------|------|
| **Anchorstep2** | 連携 | ステップへのアンカーリンク |
| **Proc1/Proc2** | 補完 | 個々のプロセス説明 |
| **Stepindex2** | 索引 | ステップ一覧表示 |

### 使用パターンの推測
```astro
<!-- ページ上部でステップ一覧を表示 -->
<Stepindex2 target="tutorial-steps" />

<!-- 各ステップの詳細説明 -->
<Proc1>手順 1: 準備</Proc1>
<Proc2>詳細: 必要な権限を確認</Proc2>

<!-- ステップへのリンク -->
<Anchorstep2 target="tutorial-steps" step="1">手順1に戻る</Anchorstep2>
```

### アクセシビリティ考慮事項
- テーブル要素なので適切な構造化
- th 要素や caption の追加を検討
- JavaScript で生成される内容のアクセシビリティ

### セマンティック改善案
```astro
<div class="step-list-wrapper">
  <strong id={`${target}-heading`}>Steps:</strong>
  <table 
    class="step-list list-place" 
    id={target}
    role="table"
    aria-labelledby={`${target}-heading`}
  >
    <caption class="sr-only">操作手順一覧</caption>
  </table>
</div>
```

### エラーハンドリング
```astro
---
interface Props {
  target: string;
}

const { target } = Astro.props;

// 安全な id 生成
const safeTarget = target.replace(/[^a-zA-Z0-9-_]/g, '-');
---

<div class="step-list-wrapper">
  <strong>Steps:</strong>
  <table class="step-list list-place" id={safeTarget}></table>
</div>
```

### JavaScript 実装例
```javascript
// ステップデータの構造例
const stepData = {
  'kintone-setup-steps': [
    { id: 1, title: 'kintone にログイン', completed: false },
    { id: 2, title: 'アプリを作成', completed: false },
    { id: 3, title: 'フィールドを設定', completed: false }
  ]
};

// テーブル生成関数
function renderSteps(targetId) {
  const table = document.getElementById(targetId);
  const steps = stepData[targetId] || [];
  
  steps.forEach(step => {
    const row = table.insertRow();
    row.innerHTML = `
      <td>${step.id}</td>
      <td>${step.title}</td>
      <td>${step.completed ? '✓' : ''}</td>
    `;
  });
}
```

### 依存関係
- CSS スタイル定義（複数のクラス）
- JavaScript（テーブル生成）
- 固有の id 値（target パラメータ）

### テスト要件
- [ ] target パラメータでの正常な表示確認
- [ ] 空のテーブルの表示確認
- [ ] JavaScript によるテーブル生成の動作確認
- [ ] CSS スタイルの適用確認
- [ ] id重複時の動作確認
- [ ] 無効な target 値での動作確認
- [ ] アクセシビリティ（テーブル構造）確認

### 関連コンポーネント
- Anchorstep2.astro（ステップへのアンカーリンク）
- Proc1.astro, Proc2.astro（プロセス表示）

### セキュリティ考慮事項
- target パラメータの値の検証
- XSS 対策（id 値の安全性）
- JavaScript による動的コンテンツのセキュリティ

### パフォーマンス考慮事項
- 空のテーブル要素の描画コスト
- JavaScript による動的生成のタイミング
- 大量のステップでの表示パフォーマンス