# SlashUiAdministrators.astro 変更記録

元ファイル: layouts/shortcodes/slash_ui_administrators.html

## 関数・変数の置換

| Hugo | Astro | 備考 |
|------|-------|------|
| `{{$.Site.Params.slash_ui_administrators}}` | `{env.slashUiAdministrators \|\| ""}` | 環境変数に変換 |

## Props 設計

```typescript
// Props なし - 環境変数の直接出力のみ
```

## DOM 構造の変化

なし - テキスト出力のみでHTML構造なし

## TODO

なし（実装完了）

## 注意事項

- シンプルなコンポーネントのため、複雑な機能は不要
- 環境変数 `slashUiAdministrators` の設定が必要
- 空文字フォールバック実装済み