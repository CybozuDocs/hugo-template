# FrontMatter内ショートコード置換実装プラン

## 背景

コミット 851d488f3dbbe13b96ed0a7557dd20de83265535 でFrontMatter内のショートコードが`<Kintone />`のようなコンポーネント風文字列に変換されるようになった。しかし、これらの文字列は実際のコンポーネントとしては機能しないため、page.tsでFrontMatterを読み込む際に実際のenv値に置換する必要がある。

## 現在の状況

### 問題のある処理フロー
```
Hugo shortcode {{< kintone >}} 
↓ (frontmatter-processor.ts)
<Kintone /> 
↓ (page.ts - 現在)
"<Kintone />" (文字列のまま)
```

### 期待される処理フロー
```
Hugo shortcode {{< kintone >}}
↓ (frontmatter-processor.ts)
<Kintone />
↓ (page.ts - 修正後)
"kintone" (env.kintoneの実際の値)
```

## 実装プラン

### 1. コンポーネント⇔env値のマッピング作成

`src/lib/component-mapping.ts` を作成し、コンポーネント名とenv値のマッピングを定義：

```typescript
import type { EnvConfig } from "./env";

export const COMPONENT_TO_ENV_MAPPING: Record<string, keyof EnvConfig> = {
  AdminButtonLabel: "labelContents", // 仮定
  Kintone: "kintone",
  Service: "service", 
  CorpName: "corpName",
  CybozuCom: "cybozuCom",
  DevnetName: "devnetName",
  Store: "store",
  Slash: "slash",
  // 他のコンポーネントも追加
};
```

### 2. FrontMatter置換関数の実装

`src/lib/frontmatter-replacer.ts` を作成：

```typescript
import { env } from "./env";
import { COMPONENT_TO_ENV_MAPPING } from "./component-mapping";

export function replaceFrontMatterComponents(frontmatter: Record<string, unknown>): Record<string, unknown> {
  // FrontMatter内の文字列値をチェックし、<ComponentName />を実際の値に置換
}
```

### 3. page.tsの修正

`createPageData` 関数内でFrontMatter処理時に置換処理を追加：

```typescript
// 74-89行目あたりを修正
const frontmatterData = {
  title: replaceFrontMatterString(frontmatter.title as string) || "",
  titleUs: replaceFrontMatterString(frontmatter.title_us as string) || undefined,
  // 他のフィールドも同様に処理
};
```

### 4. テストの実装

- 置換処理のユニットテスト
- page.tsのテスト更新

## 実装詳細

### コンポーネントマッピングの確認作業

各コンポーネントファイル（*.astro）を確認し、実際に使用されているenv値を特定：

1. **確認済み**:
   - `Kintone.astro` → `env.kintone`
   - `Service.astro` → `env.service`

2. **確認予定**:
   - `CorpName.astro` → `env.corpName` (推測)
   - `Store.astro` → `env.store` (推測)
   - 他のコンポーネント

### 置換ロジック

```typescript
function replaceFrontMatterString(value: string | undefined): string | undefined {
  if (!value || typeof value !== 'string') return value;
  
  // <ComponentName /> パターンを検索
  const componentRegex = /<(\w+)\s*\/>/g;
  let result = value;
  
  let match;
  while ((match = componentRegex.exec(value)) !== null) {
    const componentName = match[1];
    const envKey = COMPONENT_TO_ENV_MAPPING[componentName];
    
    if (envKey && env[envKey]) {
      result = result.replace(match[0], env[envKey] as string);
    }
  }
  
  return result;
}
```

## リスク・考慮事項

### 1. パフォーマンス

- 全FrontMatterフィールドを処理するため、若干のオーバーヘッドが発生
- ただし、ページ読み込み時の1回のみの処理なので問題ないと判断

### 2. コンポーネントマッピングの維持

- 新しいコンポーネント追加時にマッピングも更新が必要
- migration-docs/migrate-rules.mdに運用ルールを記載予定

### 3. 複雑な文字列の処理

- 複数のコンポーネントが含まれる場合の処理
- 属性付きコンポーネント（`<Component attr="value" />`）の処理は今回は対象外

## 作業ステップ

1. ✅ 現在の実装状況調査完了
2. 🔄 各コンポーネントファイルの調査でenv値マッピング確定
3. ⏸️ component-mapping.ts実装
4. ⏸️ frontmatter-replacer.ts実装  
5. ⏸️ page.ts修正
6. ⏸️ テスト実装
7. ⏸️ 動作確認
8. ⏸️ ドキュメント更新

## 成功基準

- FrontMatter内の`<Kintone />`が`env.kintone`の実際の値に置換される
- 既存の機能に影響を与えない
- テストが全て通る
- ページ表示で正しい値が表示される