# IdSearchMsg.astro 変更記録

元ファイル: `layouts/shortcodes/id_search_msg.html`

## 関数・変数の置換

| Hugo | Astro | 備考 |
|------|-------|------|
| `{{- range .Params }}` | `{messages}` | Props で配列を受け取り |
| `{{- . }},` | JavaScript 配列生成 | Astro の define:vars で処理 |

## Props 設計

```typescript
interface Props {
  messages: string[];  // エラーメッセージの配列
}
```

## DOM 構造の変化

構造は同じですが、Astro の `define:vars` を使用してより安全に変数を渡します。

```html
<!-- Hugo -->
<script>
var id_error_msg = [
  "メッセージ1",
  "メッセージ2",
];
</script>

<!-- Astro -->
<script define:vars={{ messages }}>
  var id_error_msg = messages;
</script>
```

## 実装パターン

- **カスタムProps**: メッセージ配列を Props で受け取り
- **define:vars**: Astro の機能でサーバーサイドからクライアントサイドに安全にデータ転送
- **JavaScript生成**: クライアントサイドでアクセス可能なグローバル変数を生成
- **型安全**: TypeScript インターフェースでメッセージの型を定義

## リスクが考えられる箇所

- **グローバル変数**: `id_error_msg` がグローバルスコープに作成される
- **変数衝突**: 同名の変数が存在する場合の上書きリスク
- **JSON シリアライゼーション**: 複雑なオブジェクトの場合のシリアライゼーションエラー
- **XSS リスク**: メッセージ内容のサニタイゼーション
- **空配列**: messages が未指定時の動作

## TODO

- [ ] グローバル変数の名前空間化検討
- [ ] メッセージ内容のサニタイゼーション
- [ ] 空配列時の動作確認
- [ ] JavaScript での使用方法の確認

## その他留意点として記録しておくこと

### 移行前後の比較
```html
<!-- Hugo -->
{{< id_search_msg "エラー1" "エラー2" "エラー3" >}}

<!-- Astro -->
<IdSearchMsg messages={["エラー1", "エラー2", "エラー3"]} />
```

### 使用方法
```astro
---
import IdSearchMsg from '@/components/IdSearchMsg.astro';

const errorMessages = [
  "IDが見つかりませんでした",
  "IDの形式が正しくありません", 
  "アクセス権限がありません"
];
---

<IdSearchMsg messages={errorMessages} />

<!-- 他の JavaScript から使用 -->
<script>
  // グローバル変数として利用可能
  console.log(id_error_msg); // 配列が出力される
  
  // エラーメッセージの表示例
  function showError(index) {
    if (id_error_msg && id_error_msg[index]) {
      alert(id_error_msg[index]);
    }
  }
</script>
```

### 推測される用途
- フォームバリデーション時のエラーメッセージ
- Ajax 検索結果のエラー表示
- ユーザーID検索機能でのエラーハンドリング
- 動的なメッセージ表示システム

### define:vars の利点
```astro
<!-- 従来の方法（非推奨） -->
<script>
  var id_error_msg = ['{{range .Params}}{{.}},{{end}}'];
</script>

<!-- Astro の define:vars（推奨） -->
<script define:vars={{ messages }}>
  var id_error_msg = messages;
</script>
```

**利点**:
- JSON シリアライゼーションによる安全な値の転送
- エスケープ処理の自動化
- TypeScript 型チェックの活用

### グローバル変数の名前空間化案
```astro
---
interface Props {
  messages: string[];
  namespace?: string;
}

const { messages = [], namespace = 'idSearch' } = Astro.props;
const variableName = `${namespace}_error_msg`;
---

<script define:vars={{ messages, variableName }}>
  window[variableName] = messages;
</script>
```

### メッセージのサニタイゼーション
```astro
---
interface Props {
  messages: string[];
}

// メッセージの安全性チェック
const sanitizeMessage = (msg: string): string => {
  return msg.replace(/[<>\"']/g, '');
};

const { messages = [] } = Astro.props;
const safeMessages = messages.map(sanitizeMessage);
---

<script define:vars={{ messages: safeMessages }}>
  var id_error_msg = messages;
</script>
```

### 多言語化対応
```astro
---
import Wovn from '@/components/Wovn.astro';

interface Props {
  messageKeys: string[];  // i18n キーの配列
}

const { messageKeys = [] } = Astro.props;
---

<!-- サーバーサイドで多言語化処理 -->
<script define:vars={{ messageKeys }}>
  // クライアントサイドで WOVN API を使用
  var id_error_msg = messageKeys.map(key => 
    window.wovn ? window.wovn.t(key) : key
  );
</script>
```

### エラーハンドリング強化版
```astro
---
interface Props {
  messages: string[];
}

const { messages = [] } = Astro.props;

// バリデーション
if (!Array.isArray(messages)) {
  throw new Error('messages must be an array');
}

const validMessages = messages.filter(msg => 
  typeof msg === 'string' && msg.length > 0
);
---

<script define:vars={{ messages: validMessages }}>
  var id_error_msg = messages;
  
  // デバッグ情報
  if (typeof console !== 'undefined') {
    console.debug('IdSearchMsg initialized with', messages.length, 'messages');
  }
</script>
```

### JavaScript での使用パターン
```javascript
// 基本的な使用
function displaySearchError(errorIndex) {
  if (typeof id_error_msg !== 'undefined' && id_error_msg[errorIndex]) {
    return id_error_msg[errorIndex];
  }
  return '不明なエラーが発生しました';
}

// Promise ベースの検索関数での使用
async function searchById(id) {
  try {
    const result = await fetch(`/api/search/${id}`);
    if (!result.ok) {
      const errorIndex = result.status === 404 ? 0 : 1;
      throw new Error(id_error_msg[errorIndex] || 'エラーが発生しました');
    }
    return await result.json();
  } catch (error) {
    console.error('Search error:', error.message);
    return { error: error.message };
  }
}

// フォームバリデーションでの使用
function validateIdField(input) {
  const value = input.value.trim();
  if (!value) {
    showError(id_error_msg[0] || 'IDを入力してください');
    return false;
  }
  if (!/^[A-Za-z0-9]+$/.test(value)) {
    showError(id_error_msg[1] || 'IDの形式が正しくありません');
    return false;
  }
  return true;
}
```

### TypeScript での型定義
```typescript
// グローバル変数の型定義
declare global {
  var id_error_msg: string[];
}

// 使用関数の型定義
interface SearchErrorHandler {
  getError(index: number): string | undefined;
  hasError(index: number): boolean;
  getAllErrors(): string[];
}

const errorHandler: SearchErrorHandler = {
  getError: (index) => id_error_msg?.[index],
  hasError: (index) => Boolean(id_error_msg?.[index]),
  getAllErrors: () => id_error_msg || []
};
```

### React/Vue との連携例
```jsx
// React での使用例
function SearchComponent() {
  const [error, setError] = useState('');
  
  const handleSearch = async (id) => {
    try {
      // 検索処理
    } catch (err) {
      const errorMsg = window.id_error_msg?.[0] || 'エラーが発生しました';
      setError(errorMsg);
    }
  };
  
  return (
    <div>
      {error && <div className="error">{error}</div>}
      {/* 検索フォーム */}
    </div>
  );
}
```

### パフォーマンス考慮事項
- `define:vars` はビルド時に処理されるため実行時オーバーヘッドなし
- グローバル変数はメモリに常駐するため大量のメッセージは避ける
- メッセージの長さと数を適切に制限

### セキュリティ考慮事項
```astro
---
// XSS 対策
const sanitizeMessages = (messages: string[]): string[] => {
  return messages.map(msg => {
    // HTML エンティティのエスケープ
    return msg
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  });
};

const { messages = [] } = Astro.props;
const safeMessages = sanitizeMessages(messages);
---
```

### デバッグ・開発支援
```astro
---
const { messages = [] } = Astro.props;

// 開発時の検証
if (import.meta.env.DEV) {
  console.log('IdSearchMsg messages:', messages);
  if (messages.length === 0) {
    console.warn('IdSearchMsg: No messages provided');
  }
}
---

<script define:vars={{ messages, isDev: import.meta.env.DEV }}>
  var id_error_msg = messages;
  
  if (isDev) {
    // 開発時のヘルパー関数
    window.__debugIdSearchMsg = {
      messages: id_error_msg,
      getError: (index) => id_error_msg[index],
      listAll: () => console.table(id_error_msg)
    };
  }
</script>
```

### 依存関係
- Astro の `define:vars` 機能
- クライアントサイド JavaScript 実行環境

### テスト要件
- [ ] 複数メッセージでの正常な生成確認
- [ ] 空配列での動作確認
- [ ] 特殊文字を含むメッセージでの安全性確認
- [ ] JavaScript からのアクセス確認
- [ ] グローバル変数の衝突テスト
- [ ] XSS 攻撃に対する耐性確認

### 関連コンポーネント
- なし（独立した JavaScript 生成コンポーネント）

### アップグレード パス
将来的な改善案：
1. モジュール化（ES Module として提供）
2. 型安全な API の提供
3. 多言語化の完全対応
4. エラーハンドリングの強化