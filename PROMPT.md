# Hugo Partials から Astro Components への移植プロンプト

## 背景

このプロンプトは、Hugo テンプレートエンジンで書かれた partial ファイルを Astro コンポーネントに移植する際に使用するものです。

## プロンプト

````
あなたは Hugo テンプレートから Astro コンポーネントへの移植を行う専門家です。
以下のルールに従って、Hugo の partial ファイルを Astro コンポーネントに変換してください。

## 基本ルール

1. **出力ファイル**:
   - Astro コンポーネント: `{ComponentName}.astro`
   - 変更記録: `{ComponentName}.md`
   - 両方のファイルを必ず作成すること

2. **i18n の扱い**:
   - `{{ i18n "key" }}` → `<Wovn>i18n__key</Wovn>`
   - aria-label など属性内: `{{ i18n "key" }}` → `i18n__todo__key`

3. **変数の扱い**:
   - Hugo のサイト変数 → `env` プロパティ
   - Hugo のページ変数 → `page` プロパティ

4. **描画の同一性**:
   - HTML 構造、クラス名、属性を完全に一致させる
   - 空白や改行も可能な限り維持

## 変換ルール詳細

### サイト変数 (env)
- `$.Site.Params.product` → `env.product`
- `$.Site.BaseURL` → `env.baseURL`
- `.Site.LanguageCode` → `env.languageCode`
- `.Site.Params.TargetRegion` → `env.targetRegion`

### ページ変数 (page)
- `.IsHome` → `page.isHome`
- `.Title` → `page.title`
- `.RelPermalink` → `page.relPermalink`
- `.Parent` → `page.parent`
- `.CurrentSection` → `page.currentSection`

### 文字列処理
- `strings.TrimPrefix "prefix" .` → `str.replace(/^prefix/, '')`
- `strings.TrimSuffix "suffix" .` → `str.replace(/suffix$/, '')`
- `split . " "` → `str.split(' ')`
- `printf "%s %s" $var1 $var2` → `` `${var1} ${var2}` ``

### 条件分岐
- `{{ if condition }}` → `{condition && ()}`
- `{{ if condition }}...{{ else }}...{{ end }}` → `{condition ? () : ()}`
- `{{ with .Variable }}` → `{variable && ()}`
- `{{ range .Items }}` → `{items.map((item) => ())}`

### コレクション操作
- `.Pages.ByWeight` → `pages.sort((a, b) => a.weight - b.weight)`
- `len` → `.length`
- `first 5` → `slice(0, 5)`

## Props インターフェース

必ず TypeScript の interface を定義してください：

```typescript
interface Props {
  env: {
    product: string;
    baseURL: string;
    languageCode: string;
    targetRegion: string;
    // 必要なその他のプロパティ
  };
  page: {
    isHome: boolean;
    title: string;
    relPermalink: string;
    // 必要なその他のプロパティ
  };
  // コンポーネント固有のプロパティ
}
````

## 変更記録ファイルの内容

以下の項目を必ず記録してください：

1. **関数・変数の置換対応表**
2. **TODO リスト** (未実装や要確認事項)
3. **構造の変化** (define/template の分離など)
4. **その他の差分** (属性名の変更、空白制御など)
5. **外部依存** (スクリプトの扱いなど)

## 実装例

入力 (Hugo):

```html
<div id="goto-top" class="fa-stack" aria-hidden="true" title="{{i18n "Go_back_to_top"}}">
<i class="fas fa-circle fa-stack-2x"></i>
<i class="fas fa-arrow-circle-up fa-stack-1x"></i>
</div>
```

出力 (Astro):

```astro
---
interface Props {
  env: {
    // 今回は使用しない
  };
  page: {
    // 今回は使用しない
  };
}

const { env, page } = Astro.props;
---

<div id="goto-top" class="fa-stack" aria-hidden="true" title="i18n__todo__Go_back_to_top">
<i class="fas fa-circle fa-stack-2x"></i>
<i class="fas fa-arrow-circle-up fa-stack-1x"></i>
</div>
```

変更記録:

```markdown
# GotoTop 変更記録

元ファイル: `layouts/partials/gototop.html`

## 関数・変数の置換

| Hugo                        | Astro                        | 備考                    |
| --------------------------- | ---------------------------- | ----------------------- |
| `{{i18n "Go_back_to_top"}}` | `i18n__todo__Go_back_to_top` | title 属性内のため TODO |

## TODO

- [ ] title 属性の i18n 対応方法の検討

## 構造の変化

なし

## その他の差分

なし

## 外部依存

- Font Awesome のアイコンを使用
```

## 注意事項

1. **Wovn コンポーネントのインポート**: i18n を使用する場合は必ず import する
2. **partial の呼び出し**: 他の partial を呼び出す場合は、対応する Astro コンポーネントを import
3. **define/template**: 別コンポーネントとして分離し、適切に import
4. **外部スクリプト**: 必要に応じて `is:inline` ディレクティブを使用
5. **エラーハンドリング**: Hugo の `with` に相当する null チェックを実装

必ずすべての動的な値を Props 経由で受け取り、ハードコードを避けてください。

```

## 使用方法

1. このプロンプトを AI に与える
2. 移植したい Hugo partial ファイルの内容を提供
3. 必要に応じて、関連する他の partial ファイルの情報も提供
4. AI が生成した Astro コンポーネントと変更記録を確認
5. 必要に応じて修正を依頼

## プロンプトの拡張

特定のコンポーネントに固有の要件がある場合は、以下を追加してください：

```

## 追加要件

### {コンポーネント名} 固有の要件

- CSV データの読み込みが必要な場合の処理方法
- 複雑な条件分岐のパターン
- 再帰的な構造の扱い方
- その他の特殊な要件

```

## バリエーション

### シンプルなコンポーネント用

```

Hugo の partial ファイル `{filename}.html` を Astro コンポーネントに変換してください。
i18n は WOVN を使用し、`{{ i18n "key" }}` は `<Wovn>i18n__key</Wovn>` に変換します。
変更記録も作成してください。

```

### 複雑なコンポーネント用

```

Hugo の partial ファイル `{filename}.html` を Astro コンポーネントに変換してください。
このファイルには以下の特徴があります：

- define/template による再帰的な構造
- CSV データの読み込み
- 複雑な条件分岐

ASTRO_PLAN.md の変換ルールに従い、適切にコンポーネントを分割してください。
各コンポーネントに対して変更記録ファイルも作成してください。

```

## 品質確認用プロンプト

```

生成された Astro コンポーネントについて、以下の点を確認してください：

1. すべての i18n キーが適切に変換されているか
2. env と page の Props が正しく定義されているか
3. HTML 構造が元のテンプレートと一致しているか
4. 変更記録にすべての変更点が記載されているか
5. TODO 項目が適切に記録されているか

問題があれば修正してください。

```

```
