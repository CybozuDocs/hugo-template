# AnnouncementBanner 変更記録

元ファイル: `layouts/partials/announcementbanner.html` (全体を統合)
- 元の `define "makeannouncebanner"` 部分も統合済み

## 統合作業履歴

### 2025年1月 - MakeAnnounceBanner.astro 統合
- MakeAnnounceBanner.astro の機能を AnnouncementBanner.astro に完全統合
- Props設計を配列形式からオブジェクト形式（MessageData）に改善
- CSV ファイル読み込み機能を削除（未使用のため）

## 関数・変数の置換

### AnnouncementBanner 部分
| Hugo                                     | Astro                                   | 備考                       |
| ---------------------------------------- | --------------------------------------- | -------------------------- |
| `{{ i18n "Unsupported_browser" }}`       | `i18n__Unsupported_browser`             | 静的文字列として処理       |
| `{{ i18n "Unsupported_message" }}`       | `i18n__Unsupported_message`             | 静的文字列として処理       |
| `$.Lang`                                 | `env.lang`                              | 削除（使用されず）         |
| `$.Site.Params.TargetRegion`             | `env.targetRegion`                      | 削除（使用されず）         |
| `os.FileExists`                          | 削除                                    | CSV読み込み削除により不要  |
| `resources.Get`                          | 削除                                    | CSV読み込み削除により不要  |
| `transform.Unmarshal`                    | 削除                                    | CSV読み込み削除により不要  |

### MakeAnnounceBanner 部分（統合済み）
| Hugo                                                      | Astro                                               | 備考                      |
| --------------------------------------------------------- | --------------------------------------------------- | ------------------------- |
| `{{ index . 0 }}`                                         | `message.key`                                       | オブジェクトプロパティ    |
| `{{ index . 1 }}`                                         | `message.bgColor`                                   | オブジェクトプロパティ    |
| `{{ index . 2 }}`                                         | `message.fontawesomeIcon`                           | オブジェクトプロパティ    |
| `{{ index . 3 }}`                                         | `message.iconColor`                                 | オブジェクトプロパティ    |
| `{{ index . 4 }}`                                         | `message.title`                                     | オブジェクトプロパティ    |
| `{{ index . 5 }}`                                         | `message.text`                                      | オブジェクトプロパティ    |
| `{{ with $bg_color }}background-color: {{ . }};{{ end }}` | `${message.bgColor ? `background-color: ${message.bgColor};` : ''}` | 条件付きスタイル          |
| `{{ with $icon_color }}color: {{ . }};{{ end }}`          | `${message.iconColor ? `color: ${message.iconColor};` : ''}`        | 条件付きスタイル          |
| `{{ with $title }}...{{ end }}`                           | `{message.title && (...)}`                         | 条件付きレンダリング      |
| `{{ $text | markdownify }}`                               | `{processMarkdown(message.text)}`                   | マークダウン処理          |
| `{{ i18n "Announcement_button_close" }}`                  | `i18n__todo__Announcement_button_close`             | title属性内のためTODO     |
| `{{ i18n "Close" }}`                                      | `<Wovn>i18n__Close</Wovn>`                          | WOVN対応                  |

## TODO

- [ ] markdownify機能の完全実装（現在は簡易実装）
- [ ] title属性のi18n対応方法の検討

## 削除した機能（2025年1月）

以下の機能は未使用であることが判明したため削除：
- [ ] ~~CSVファイルの動的読み込み処理の実装~~（削除：使用されない）
- [ ] ~~os.FileExistsに相当するファイル存在チェック機能~~（削除：CSV機能削除により不要）
- [ ] ~~resources.Getに相当するリソース読み込み機能~~（削除：CSV機能削除により不要）
- [ ] ~~transform.Unmarshalに相当するCSV解析機能~~（削除：CSV機能削除により不要）

## 構造の変化

### ~~define/template分離~~ → 統合アプローチ

- ~~`define "makeannouncebanner"` → `MakeAnnounceBanner.astro`として分離~~（削除）
- **2025年1月統合**: MakeAnnounceBanner.astro の機能を AnnouncementBanner.astro に統合
- 分離設計から単一コンポーネント設計への変更

### 条件分岐の変更

- Hugo の `with` による null チェック → JavaScript の `&&` 演算子
- Hugo の `range` → JavaScript の `map` 関数

## Props設計の改善（2025年1月）

### 配列からオブジェクトへの変更

**変更前（配列形式）:**
```typescript
const defaultMsg = [
  "session-notice-1",      // [0] key
  "#f9aeb6",               // [1] bgColor
  "fas fa-exclamation-triangle", // [2] fontawesomeIcon
  "#cd1b49",               // [3] iconColor
  "i18n__Unsupported_browser",   // [4] title
  "i18n__Unsupported_message",   // [5] text
];
```

**変更後（オブジェクト形式）:**
```typescript
interface MessageData {
  key: string;
  bgColor?: string;
  fontawesomeIcon?: string;
  iconColor?: string;
  title?: string;
  text: string;
}

const defaultMessage: MessageData = {
  key: "session-notice-1",
  bgColor: "#f9aeb6",
  fontawesomeIcon: "fas fa-exclamation-triangle",
  iconColor: "#cd1b49",
  title: "i18n__Unsupported_browser",
  text: "i18n__Unsupported_message",
};
```

### 型安全性の向上

- 配列インデックスアクセス → 名前付きプロパティアクセス
- TypeScript インターフェースによる型定義
- 省略可能プロパティによる柔軟性

## その他の差分

### 空白・改行の扱い

- Hugo テンプレートの `{{-` と `-}}` による空白制御 → Astro では明示的に制御

### デフォルト値

- Hugo: `{{ with $bg_color }}background-color: {{ . }};{{ end }}`
- Astro: `${message.bgColor ? `background-color: ${message.bgColor};` : ''}`

## 外部依存

### スクリプトの読み込み

- Font Awesomeアイコンを使用

### CSS クラスの動的生成

- Hugo: `class="announcement-banner {{ $key }}"`
- Astro: `class={`announcement-banner ${key}`}`

## 注意事項

- マークダウン処理は簡易実装のため、完全なMarkdown対応が必要
- ~~CSVファイルの読み込み処理は現在未実装~~（削除：使用されない）
- ~~ファイル存在チェック機能の実装が必要~~（削除：CSV機能削除により不要）

## PageLayout.astro 統合（2025年1月追加）

### プレースホルダーから実コンポーネントへの移行

- **変更前**: `{/* <div>[ANNOUNCEMENT BANNER PARTIAL]</div> */}`
- **変更後**: `<AnnouncementBanner />`
- **import追加**: `import AnnouncementBanner from "./components/AnnouncementBanner.astro";`

### Props最適化の実施

統合時にTypeScript型エラーが発生したため、Props最適化を実施：

```typescript
// 変更前：BaseProps依存
interface Props extends BaseProps {
  msg?: MessageData;
}

// 変更後：必要最小限
interface Props {
  msg?: MessageData;
}
```

### 統合位置

- LocaleModalの次、Headerの前に配置
- Hugoの元実装と同じ位置での表示を実現

## 統合による改善効果

- コンポーネント間の依存関係削除
- Props インターフェースの明確化
- 型安全性の向上
- 未使用機能の削除による保守性向上
- 単一責任原則に基づく設計
- PageLayoutでの実際の使用可能性確保
- Props最適化による無駄な依存関係の排除
