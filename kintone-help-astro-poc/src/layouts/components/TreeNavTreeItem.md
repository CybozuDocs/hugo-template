# TreeNavTreeItem 変更記録

元ファイル: `layouts/partials/treenav.html` の `define "treeitem"` 部分

## 関数・変数の置換

| Hugo                            | Astro                      | 備考                        |
| ------------------------------- | -------------------------- | --------------------------- |
| `.tocitem`                      | `tocitem`                  | Props として受け取り        |
| `.haschild`                     | `haschild`                 | Props として受け取り        |
| `.pageurl`                      | `pageurl`                  | Props として受け取り        |
| `split $tocitem " "`            | `tocitem.split(" ")`       | JavaScript の文字列メソッド |
| `in . "pid="`                   | `param.includes("pid=")`   | JavaScript の文字列メソッド |
| `split . ">"`                   | `param.split(">")`         | JavaScript の文字列メソッド |
| `strings.TrimPrefix "pid=\"" .` | `p2.replace(/^pid="/, '')` | JavaScript の正規表現       |
| `strings.TrimSuffix "\"" $anc`  | `.replace(/"$/, '')`       | JavaScript の正規表現       |
| `findRE ">.+<" $tocitem 1`      | `tocitem.match(/>.+</)`    | JavaScript の正規表現       |
| `range first 1 $txts`           | `txtMatches[0]`            | JavaScript の配列アクセス   |
| `strings.TrimPrefix ">" $txt`   | `txt.replace(/^>/, '')`    | JavaScript の正規表現       |
| `strings.TrimSuffix "<" $txt`   | `txt.replace(/<$/, '')`    | JavaScript の正規表現       |
| `safeHTML`                      | `set:html={safeHTML(txt)}` | Astro のディレクティブ      |

## TODO

- [ ] safeHTML関数の実装改善
- [ ] より複雑なHTML構造への対応
- [ ] エラーハンドリングの追加

## 構造の変化

### 属性抽出の簡素化

- Hugo の複雑な文字列操作 → JavaScript の配列操作とループ
- より読みやすい抽出ロジック

### テキスト抽出の改善

- Hugo の `findRE` + `first` + `range` → JavaScript の `match()` + 配列アクセス
- より直接的なアプローチ

### 条件付きレンダリング

- Hugo の条件付き `</li>` 出力 → Astro の条件付きレンダリング
- haschild フラグによる適切な HTML 構造制御

## その他の差分

### 正規表現の使用

- Hugo の `strings.*` 関数群 → JavaScript の正規表現
- より柔軟な文字列処理

### HTMLの安全性

- Hugo の `safeHTML` → Astro の `set:html` ディレクティブ
- 同等の機能を提供

### Props の拡張

- `isLast` プロパティを追加して最後の要素の判定をより明確に

## 外部依存

### Astro ディレクティブ

- `set:html` を使用した動的HTML挿入

## 注意事項

- `set:html` はサニタイズされないため、信頼できるコンテンツのみで使用
- TOC要素の複雑な入れ子構造に対応するため、`haschild`と`isLast`の適切な制御が重要
- アンカーリンクの正確な抽出のため、id/pid属性の解析が必要
