# 画像パス変換機能

Hugo to Astro MDX変換スクリプトに、画像パスの変換機能が追加されました。

## 機能概要

Markdownファイル内の画像パス（`![alt](src)`）を変換する際に、指定したプレフィックスを別のプレフィックスに変換できます。

## 使用方法

### CLIオプション

```bash
npx tsx src/convert-to-mdx.ts [変換オプション] --img-path-from "<変換元プレフィックス>" --img-path-to "<変換先プレフィックス>"
```

### 例

```bash
# aiディレクトリを変換し、画像パスを /k/ から /k/kintone/ に変更
npx tsx src/convert-to-mdx.ts --dir ai --target ../src/pages/ja --img-path-from "/k/" --img-path-to "/k/kintone/"
```

### 変換例

**変換前（Hugo Markdown）:**
```markdown
![スクリーンショット](![k/img-ja/ai_enable_01.png)
```

**変換後（Astro MDX）:**
```mdx
<Img src="/k/kintone/img-ja/ai_enable_01.png" alt="スクリーンショット" />
```

## 設定詳細

### パラメータ

- `--img-path-from`: 変換対象となるパスのプレフィックス（例: `"/k/"`）
- `--img-path-to`: 変換先のパスプレフィックス（例: `"/k/kintone/"`）

### 動作仕様

1. **条件付き変換**: 両方のオプションが指定された場合のみ有効
2. **プレフィックス一致**: `img-path-from`で指定したプレフィックスで始まる画像パスのみ変換
3. **完全置換**: 最初の一致部分のみを置換（複数回の置換は行われない）

### TypeScript設定

```typescript
type ImagePathTransform = {
  readonly from: string;  // 変換元プレフィックス
  readonly to: string;    // 変換先プレフィックス
};

type ConversionConfig = {
  // ... 他の設定
  readonly imagePathTransform?: ImagePathTransform;
};
```

## 注意事項

1. **任意機能**: オプションを指定しない場合、従来通りの変換が行われます
2. **プレフィックス一致**: 完全に一致するプレフィックスのみが対象となります
3. **大文字小文字**: 大文字小文字を区別します
4. **相対パス**: 相対パスでも絶対パスでも動作します

## 実装箇所

- **型定義**: `src/types/conversion.ts`
- **変換ロジック**: `src/lib/string-transformer.ts`の`transformImagesToComponents`関数
- **CLI統合**: `src/convert-to-mdx.ts`の`main`関数

この機能により、プロジェクト間での画像パス構造の違いに柔軟に対応できるようになります。