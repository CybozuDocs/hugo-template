# Heading.astro 変更記録

元ファイル: `layouts/_default/_markup/render-heading.html` (anchorlink2 部分)

## 概要

Hugo の `render-heading.html` で Markdown 見出しをカスタマイズする際の `anchorlink2` テンプレート呼び出し部分を、Astro コンポーネントとして実装。

## 関数・変数の置換

| Hugo                             | Astro               | 備考                   |
| -------------------------------- | ------------------- | ---------------------- |
| `{{ template "anchorlink2" }}`   | `<AnchorLink2 />`   | コンポーネント化       |
| `.Level`                         | `level` prop        | 見出しレベル           |
| `.Anchor`                        | `id` prop           | アンカーID             |
| `.Text`                          | `text` prop         | 見出しテキスト         |
| `.Attributes.class`              | `class` prop        | CSSクラス              |
| `.Page.RelPermalink`             | `getRelPermalink()` | 相対パーマリンク取得   |
| `.Page.Site.Params.id_search`    | `env.idSearch`      | IDリンク機能フラグ     |
| `(index .Page.Params.aliases 0)` | `getRelPermalink()` | エイリアス取得（TODO） |

## 実装の変化

### Hugo版（簡略化後）

```html
{{- template "anchorlink2" (dict "ti" . "link" .Page.RelPermalink "al" (index
.Page.Params.aliases 0) "ids" .Page.Site.Params.id_search ) }}
```

### Astro版

```astro
<AnchorLink2 ti={ti} ids={env.idSearch} al={al} />
```

## 構造の変化

- **Props設計**: level, id, text, class の明示的な定義
- **依存関係**: AnchorLink2.astro への依存
- **関数分離**: getRelPermalink() 関数を page.ts に分離

## TODO

- [ ] getRelPermalink() の実際の実装
- [ ] page.params.aliases の取得機能
- [ ] Markdown レンダリング時の自動統合

## 外部依存

- `AnchorLink2.astro` (既存)
- `src/lib/page.ts` (getRelPermalink 関数)
- `src/lib/env.ts` (env.idSearch)

## 注意事項

1. **使用方法**: slot ではなく text props でテキストを渡す
2. **条件分岐削除**: kintone固定、templateVersion="2"固定により分岐処理なし
3. **TODO実装**: getRelPermalink() は現在ダミー値を返す

## 品質確保

- TypeScript interface による型安全性
- ビルドテスト成功確認
- 既存の AnchorLink2.astro との連携確認
