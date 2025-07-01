# Hugo コンテンツから Astro MDX への変換スクリプト実装プラン

## 概要

Hugo の `content/ja/` 配下の `.md` ファイルを、Astro の `src/pages/ja/` 配下の `.mdx` ファイルに変換するTypeScriptスクリプトを実装します。

## 仕様要件（convert_prompt.mdより）

### 技術仕様
- **実行形式**: TypeScriptで直接実行可能（tsx）
- **型安全性**: any型の利用を避け、型アサーションも極力利用しない
- **設計原則**: Classは使わず、typeを優先利用
- **配置場所**: `kintone-help-astro-poc/migrate-scripts/` 配下

### CLI オプション要件
- **入力ディレクトリ**: 変換対象のソースディレクトリ
- **出力ディレクトリ**: 変換結果の出力先ディレクトリ  
- **フィルタリング機能**: パスの部分一致でフィルタリング
- **画像パスprefix変換**: "/k/" → "/k/kintone/" などの変換機能

### ファイル名変換要件
- `_index.md` → `index.mdx` （アンダースコア除去）
- その他の `.md` → `.mdx`

## 変換仕様詳細

### 1. FrontMatter変換

#### 必須追加フィールド
```yaml
# すべてのファイルに追加
layout: "@/layouts/PageLayout.astro"  # 通常ページ
# または
layout: "@/layouts/SectionLayout.astro"  # セクションページ（_index.mdx）
```

#### 既存フィールドの保持
- `title`, `weight`, `aliases`, `disabled`, `type`
- 配列形式（`disabled`, `aliases`）の構造維持
- 型と値の完全保持

### 2. 画像記法変換

#### 基本変換パターン
```markdown
<!-- 変換前 -->
![alt属性のテキスト](/path/to/image.png)

<!-- 変換後 -->
<Img src="/path/to/image.png" alt="alt属性のテキスト" />
```

#### title属性付きの場合
```markdown
<!-- 変換前 -->
![alt text](/path/image.png "タイトル")

<!-- 変換後 -->
<Img src="/path/image.png" alt="alt text" title="タイトル" />
```

#### インポート文の自動追加
```typescript
// 画像を使用している場合、ファイル先頭に追加
import Img from "@/components/Img.astro";
```

### 3. Hugo ショートコード変換

#### 単純置換型（37個のコンポーネント対応）

```typescript
type SimpleReplacements = {
  // 単体タグ
  '{{< kintone >}}': '<Kintone />',
  '{{< service >}}': '<Service />',
  '{{< corpname >}}': '<CorpName />',
  // ... 他34個
};
```

#### コンテンツ包含型
```typescript
type ContentReplacements = {
  // slotを使用するコンポーネント
  'hint': 'Hint',
  'note': 'Note',
  'warning': 'Warning',
  'reference': 'Reference',
  // ... 他
};
```

#### 属性付き型
```typescript
type AttributeReplacements = {
  'screen': ['src', 'alt'],
  'enabled': ['regions'],
  'disabled2': ['regions'],
  // ... 他
};
```

### 4. 見出し変換（将来実装）

```markdown
<!-- 変換前 -->
## 見出しテキスト {#custom-id}

<!-- 変換後 -->
<Heading level={2} id="custom-id">見出しテキスト</Heading>
```

## 実装プラン

### Phase 1: 基本変換機能（優先度：高）

#### 1.1 CLIインターフェース実装
```typescript
type CliOptions = {
  inputDir: string;
  outputDir: string;
  filter?: string;
  imagePathPrefix?: {
    from: string;
    to: string;
  };
};
```

#### 1.2 ファイル操作機能
- ディレクトリ再帰探索
- `.md` ファイルの検出
- ディレクトリ構造の保持
- `_index.md` → `index.mdx` 変換

#### 1.3 FrontMatter処理
- YAML パーサーによる解析
- layout フィールドの自動追加
- 既存フィールドの保持

#### 1.4 画像記法変換
- 正規表現による `![alt](src)` パターンの検出
- `<Img>` コンポーネントへの変換
- `import Img` 文の自動追加

### Phase 2: ショートコード変換（優先度：中）

#### 2.1 単純置換型変換
- 37個の Hugo ショートコードの一括置換
- 対応するインポート文の生成

#### 2.2 コンテンツ包含型変換
- `{{< shortcode >}}content{{< /shortcode >}}` パターン
- slot による内容の適切な配置

#### 2.3 属性付き変換
- 属性の解析と Astro Props への変換
- 地域設定など配列属性の適切な処理

### Phase 3: 高度な変換機能（優先度：低）

#### 3.1 見出し変換
- カスタムID付き見出しの変換
- `<Heading>` コンポーネントの使用

#### 3.2 最適化機能
- 不要なインポートの削除
- インポート文のソート
- 空行の最適化

## ファイル構成

```
kintone-help-astro-poc/migrate-scripts/
├── convert-content.ts          # メインスクリプト
├── types.ts                   # 型定義
├── frontmatter-processor.ts   # FrontMatter処理
├── markdown-processor.ts      # Markdown変換処理
├── shortcode-processor.ts     # ショートコード変換
├── image-processor.ts         # 画像記法変換
└── cli.ts                     # CLI インターフェース
```

## 型定義設計

### 基本型
```typescript
type ConversionConfig = {
  inputDir: string;
  outputDir: string;
  filter?: string;
  imagePathPrefix?: PathReplacement;
};

type PathReplacement = {
  from: string;
  to: string;
};

type FileContent = {
  frontmatter: Record<string, unknown>;
  content: string;
};

type ConversionResult = {
  converted: boolean;
  imports: string[];
  content: string;
  errors: string[];
};
```

### ショートコード定義
```typescript
type ShortcodeMapping = {
  simple: Record<string, string>;
  content: Record<string, string>;
  attributes: Record<string, string[]>;
};
```

## エラーハンドリング

### 1. ファイル操作エラー
- 存在しないディレクトリ
- 読み書き権限エラー
- ディスク容量不足

### 2. 変換エラー
- 不正なFrontMatter YAML
- 認識できないショートコード
- 不正な画像パス

### 3. 警告レベル
- スキップされたファイル
- 部分的な変換失敗
- 非対応パターンの検出

## テスト戦略

### 1. ユニットテスト
- 各処理関数の個別テスト
- 正常系・異常系の網羅

### 2. 統合テスト  
- 実際のHugoファイルでの変換テスト
- ディレクトリ構造の保持確認

### 3. 手動テスト
- `/Users/mugi/ghq/github.com/CybozuDocs/kintone/content/ja/` の一部での動作確認
- `npm run dev` でのビルド確認

## 段階的実装・テスト計画

### Step 1: CLIとファイル操作
- 基本的なファイル読み書き機能
- ディレクトリ構造の複製

### Step 2: FrontMatter + 画像変換
- 基本的な変換機能の実装
- 小規模ディレクトリでのテスト

### Step 3: ショートコード変換
- 段階的なショートコード対応
- 実際のコンテンツでの検証

### Step 4: 最適化と完成
- パフォーマンス改善
- エラーハンドリングの強化

## リスク要因と対策

### 1. 大量ファイル処理
- **リスク**: メモリ不足、処理時間
- **対策**: ストリーミング処理、バッチ処理

### 2. 複雑なショートコード
- **リスク**: 100% 正確な変換の困難
- **対策**: 段階的実装、手動確認ポイントの明示

### 3. FrontMatter の多様性
- **リスク**: 予期しないフィールド構造
- **対策**: 柔軟な型定義、警告システム

## 成功基準

### 1. 機能要件
- [ ] CLI オプション全てが動作
- [ ] ファイル構造の完全保持
- [ ] FrontMatter の正確な変換
- [ ] 画像記法の完全変換
- [ ] 主要ショートコードの変換

### 2. 品質要件
- [ ] TypeScript エラーなし
- [ ] 型安全性の確保
- [ ] 適切なエラーハンドリング

### 3. パフォーマンス要件
- [ ] 1000ファイル程度の処理が実用的時間内
- [ ] メモリ使用量が適切

このプランに基づいて段階的に実装を進めることで、要求仕様を満たす堅牢な変換スクリプトを構築できます。