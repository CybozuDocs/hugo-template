# Img コンポーネント実装プラン

## 概要

Hugo の `layouts/_default/_markup/render-image.html` 内の画像レンダリングロジックを `Img.astro` コンポーネントとして切り出す作業です。

## 対象ファイル

### 元ファイル
- `layouts/_default/_markup/render-image.html`（Hugo マークダウン画像レンダラー）

### 作成ファイル
- `kintone-help-astro-poc/src/components/Img.astro`
- `kintone-help-astro-poc/src/components/Img.md`

## 現在の Hugo 実装の解析

### 1. 元のロジック構造

```html
{{- $simple := "false" }}
{{- if and (eq .Page.Site.Params.product "Garoon") (in .Destination "/common/icon/") }}
    {{- $simple = "true" }}
{{- else if or (eq .Page.Site.Params.product "Mailwise") (eq .Page.Site.Params.product "Remote") }}
    {{- if in .Destination "/common/img/" }}
        {{- $simple = "true" }}
    {{- end }}
{{- else if eq .Page.Site.Params.product "Office" }}
    {{- if or (in .Destination "/common/img/") (in .Destination "/common/icon/") }}
        {{- $simple = "true" }}
    {{- end }}
{{- else if (in .Destination "/img/") }}
    {{- $simple = "true" }}
{{- end }}
```

### 2. product 固定化による簡素化

**重要な変更点**: rules.md および migrate-rules.md に従い、product="kintone" で固定化されているため、他製品（Garoon, Mailwise, Remote, Office）の条件分岐は完全に削除可能。

**簡素化後のロジック**:
```typescript
// product="kintone" 固定の場合
const isSimple = src.includes("/img/");
```

### 3. 出力される img タグ

- **Simple 画像** (`$simple = "true"`):
  ```html
  <img src="..." alt="..." title="..." role="img" />
  ```

- **Screenshot 画像** (`$simple = "false"`):
  ```html
  <img class="screenshot" src="..." alt="..." title="..." data-action="zoom" role="img" />
  ```

## Astro コンポーネント設計

### 1. Props 設計

```typescript
interface Props {
  src: string;      // 画像のURL（.Destination相当）
  alt: string;      // alt属性（.Text相当）
  title?: string;   // title属性（.Title相当、省略可能）
}
```

### 2. ロジック実装

```typescript
const { src, alt, title } = Astro.props;

// product="kintone"固定により他製品分岐は削除
const isSimple = src.includes("/img/");
```

### 3. DOM 構造保持

元の Hugo 実装と完全に同じ HTML 構造を保持：

```astro
{isSimple ? (
  <img src={src} alt={alt} {title && {title}} role="img" />
) : (
  <img class="screenshot" src={src} alt={alt} {title && {title}} data-action="zoom" role="img" />
)}
```

## 実装手順

### Phase 1: コンポーネント作成
1. **Img.astro** 作成
   - TypeScript Props 定義
   - product固定化による簡素化ロジック実装
   - DOM構造の完全保持

2. **Img.md** 変更記録作成
   - Hugo → Astro 変換内容
   - 削除された他製品分岐の記録
   - 簡素化による影響の記録

### Phase 2: テスト・検証
1. **ビルドテスト実行**
   - `npm run build` でエラーなし確認
   - TypeScript 型チェック通過

2. **機能テスト**
   - `/img/` パスでの simple 画像表示
   - それ以外でのスクリーンショット画像表示
   - title 属性の省略可能性確認

### Phase 3: ドキュメント更新
1. **prompt.md** 作成
   - 作業履歴の記録
   - ユーザー指示と回答の記録

2. **3つのドキュメント更新**
   - **migrate-memo.md**: 作業概要、学習事項記録
   - **migrate-rules.md**: 新しいルール追加（該当する場合）
   - **rules.md**: Astro開発の永続的ルール追加（該当する場合）

## 重要な注意事項

### 1. product 固定化対応
- Garoon, Mailwise, Remote, Office の処理は完全削除
- kintone 固定前提の簡素化実装

### 2. DOM 構造の厳密保持
- Hugo の出力 HTML と完全一致
- 属性の順序、条件付き属性の実装

### 3. Props 最適化
- 必要最小限のプロパティのみ定義
- title の省略可能性を適切に実装

### 4. 型安全性
- TypeScript interface による型定義
- any 型の使用は完全禁止

## 期待される効果

1. **再利用性向上**: マークダウン以外でも画像コンポーネントを使用可能
2. **保守性向上**: 画像表示ロジックの一元管理
3. **簡素化効果**: product 固定化による大幅なコード削減
4. **型安全性**: TypeScript による型保証

## 品質確保項目

- [ ] TypeScript 型エラーなし
- [ ] ビルドエラーなし
- [ ] DOM 構造の完全保持
- [ ] simple/screenshot 画像の適切な分岐
- [ ] title 属性の省略可能性
- [ ] 変更記録ファイル作成
- [ ] 3つのドキュメント更新