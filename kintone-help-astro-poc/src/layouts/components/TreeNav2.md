# TreeNav2 変更記録

元ファイル: `layouts/partials/treenav2.html`

## 関数・変数の置換

| Hugo                            | Astro                             | 備考                                            |
| ------------------------------- | --------------------------------- | ----------------------------------------------- | --------------------- |
| `.RelPermalink`                 | `page.relPermalink`               | page プロパティ                                 |
| `partial "title" .`             | `<Title page={page} env={env} />` | コンポーネント呼び出し                          |
| `.Content`                      | `page.content`                    | page プロパティ                                 |
| `findRE "<h2.\*?>(.             | \n)\*?</h2>" $cont`               | `page.content.match(new RegExp(tocregex, 'g'))` | JavaScript の正規表現 |
| `gt (len $tocs) 0`              | `tocs.length > 0`                 | JavaScript の比較演算子                         |
| `split . " "`                   | `tocItem.split(" ")`              | JavaScript の文字列メソッド                     |
| `in . "pid="`                   | `param.includes("pid=")`          | JavaScript の文字列メソッド                     |
| `split . ">"`                   | `param.split(">")`                | JavaScript の文字列メソッド                     |
| `strings.TrimPrefix "pid=\"" .` | `p2.replace(/^pid="/, '')`        | JavaScript の正規表現                           |
| `strings.TrimSuffix "\"" $anc`  | `.replace(/"$/, '')`              | JavaScript の正規表現                           |
| `findRE ">.+<" . 1`             | `tocItem.match(/>.+</)`           | JavaScript の正規表現                           |
| `first 1 $txts`                 | `txtMatches[0]`                   | JavaScript の配列アクセス                       |
| `strings.TrimPrefix ">" $txt`   | `txt.replace(/^>/, '')`           | JavaScript の正規表現                           |
| `strings.TrimSuffix "<" $txt`   | `txt.replace(/<$/, '')`           | JavaScript の正規表現                           |
| `range $tocs`                   | `tocs.map((tocItem) => (...))`    | JavaScript の配列メソッド                       |
| `safeHTML`                      | `set:html={safeHTML(txt)}`        | Astro のディレクティブ                          |

## TODO

- [ ] findRE の完全な実装（現在は簡易実装）
- [ ] safeHTML関数の実装改善
- [ ] より複雑な見出し構造への対応

## 構造の変化

### 処理関数の分離

- Hugo のインライン処理 → `processTocItem()` 関数として分離
- より読みやすく再利用可能な構造

### TOC抽出の簡素化

- Hugo の `findRE` → JavaScript の `match()` メソッド
- より直接的なアプローチ

### 条件付きレンダリング

- Hugo の `{{ if gt (len $tocs) 0 }}` → `{tocs.length > 0 && (...)}`
- より簡潔な条件分岐

## その他の差分

### 正規表現の使用

- Hugo の `strings.*` 関数群 → JavaScript の正規表現
- より柔軟な文字列処理

### HTMLの安全性

- Hugo の `safeHTML` → Astro の `set:html` ディレクティブ
- 同等の機能を提供

### 配列操作

- Hugo の `range` → JavaScript の `map`
- より自然な配列処理

## 外部依存

### jsTree

- `data-jstree`属性を使用したツリー表示ライブラリ
- dummy-node として設定（opened: true, disabled: true）

### Astro ディレクティブ

- `set:html` を使用した動的HTML挿入

## 注意事項

- TreeNavと異なり、単一ページのTOC表示専用
- H2見出しのみを対象とした簡易版
- `set:html` はサニタイズされないため、信頼できるコンテンツのみで使用
- jsTreeライブラリとの連携を前提とした実装

## TreeNavとの違い

- 階層ナビゲーション機能なし
- 単一ページの見出し一覧のみ
- より軽量でシンプルな実装
- dummy-nodeを使用した特殊な構造
