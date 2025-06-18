# VideoNav 変更記録

元ファイル: `layouts/partials/videonav.html`

## 関数・変数の置換

| Hugo                                   | Astro                                   | 備考                                     |
| -------------------------------------- | --------------------------------------- | ---------------------------------------- |
| `v-for="tag in tags"`                  | `tags.map((tag) => ())`                 | 配列反復                                 |
| `:key="tag.key"`                       | `key={tag.key}`                         | React/JSXのキー属性                      |
| `v-bind:id="'video-filter-'+tag.key"`  | `id={\`video-filter-${tag.key}\`}`      | 動的ID生成                               |
| `v-on:click="changetag()"`             | `addEventListener('click', ...)`        | イベントハンドラー                       |
| `v-bind:for="'video-filter-'+tag.key"` | `htmlFor={\`video-filter-${tag.key}\`}` | ラベル関連付け                           |
| `[[tag.text]]`                         | `{tag.text}`                            | Vue.jsのテキスト補間                     |
| `[[filter]]`                           | `[[filter]]`                            | そのまま維持（他の実装で処理される想定） |

## TODO

- [ ] 実際のビデオフィルタリング機能の実装
- [ ] Vue.js から バニラJS への完全移行

## 構造の変化

### Vue.js からバニラJavaScript への移行

- Vue.js のディレクティブ → 標準のHTML属性とJavaScript
- Vue.js のリアクティブシステム → 手動のイベントハンドリング

### イベントハンドリングの変更

- Vue.js の `v-on:click` → `addEventListener`
- Vue.js の `changetag()` メソッド → カスタムJavaScript関数

### データ属性の追加

- タグキーを `data-tag-key` 属性として保存
- JavaScript でのアクセスを容易にするため

## その他の差分

### 属性名の変更

- Vue.js: `v-bind:for`
- JSX: `htmlFor`（React/JSX仕様）

### テンプレート構文

- Vue.js: `[[tag.text]]`（カスタム区切り文字）
- Astro: `{tag.text}`（JSX構文）

### 関数定義

- Vue.js: メソッド定義
- Astro: スクリプトタグ内の関数定義

## 外部依存

### JavaScript

- DOMイベントハンドリング
- ビデオフィルタリング機能（TODO）

### CSS

- ビデオフィルターのスタイリング

## 注意事項

- Vue.js の機能をバニラJavaScriptで再実装する必要
- フィルタリング機能の詳細な実装が必要
- `[[filter]]` はVue.js のテンプレート構文のため、別途対応が必要
- チェックボックスの状態管理とフィルタリングロジックの実装が必要
