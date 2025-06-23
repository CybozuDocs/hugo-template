# Note.astro 変更記録

## 概要

Hugo ショートコード `layouts/shortcodes/note.html` を Astro コンポーネント `Note.astro` として移植。
Hint.astro と同時に実装（MDX ファイルの互換性確保のため）。

## 元ファイル

`layouts/shortcodes/note.html`

## 関数・変数の置換

| Hugo | Astro | 備考 |
|------|-------|------|
| `{{ i18n "Title_note" }}` | `<Wovn>i18n__Title_note</Wovn>` | WOVN翻訳コンポーネント使用 |
| `{{ .Inner \| markdownify }}` | `<slot />` | Astro slot による内容表示 |
| `{{ .Site.Params.product }}` 条件分岐 | 削除 | product="kintone"固定により簡素化 |

## 構造の変化

### DOM構造

**元の構造（Hugo）**:
```html
<aside class="admonition note">
  <div class="admonition-alt">
    {{- if and (ne .Site.Params.product "Garoon") ... }}
      <i class="fas fa-pencil-alt" aria-hidden="true"></i>
    {{- end }}
    <span>{{ i18n "Title_note" }}</span>
  </div>
  <div class="admonition-content">{{ printf "%s" .Inner | markdownify }}</div>
</aside>
```

**新しい構造（Astro）**:
```astro
<aside class="admonition note">
  <div class="admonition-alt">
    <i class="fas fa-pencil-alt" aria-hidden="true"></i>
    <span><Wovn>i18n__Title_note</Wovn></span>
  </div>
  <div class="admonition-content"><slot /></div>
</aside>
```

### 主な変更点

1. **製品分岐の削除**: kintone固定により条件分岐を除去、アイコン常に表示
2. **i18n対応**: WOVN翻訳コンポーネント使用
3. **内容表示**: markdownify から slot への変更
4. **Props最適化**: Props不要の最大限簡素化
5. **admonition-alt-text クラス**: Hint.astro と異なり、span要素にクラス指定なし

## 実装パターン

- **コンポーネント分類**: アドモニション型（Reference.astro、Hint.astro と同様）
- **Props設計**: Props不要（最大限簡素化）
- **外部依存**: Wovn.astro のみ

## アクセシビリティ

- `aria-hidden="true"` 属性をアイコンに保持
- セマンティック HTML（aside要素）を使用

## CSS/スタイリング

- Font Awesome 依存: `fas fa-pencil-alt` クラス
- 既存CSS構造: `.admonition.note` クラスを保持

## テスト・検証

- ビルドテスト成功（npm run build: 2.52秒）
- DOM構造の保持確認
- 実際の使用例で動作確認（add_employee_app.mdx）

## その他の差分

### Hint.astro との相違点

- **アイコン**: pencil-alt vs lightbulb
- **翻訳キー**: Title_note vs Title_tips
- **CSS クラス**: note vs hint
- **span要素**: クラス指定なし vs admonition-alt-text

## 外部依存

- **Wovn.astro**: i18n翻訳機能
- **Font Awesome CSS**: アイコン表示

## 使用方法

```astro
import Note from "@/components/Note.astro";

<Note>
  注意事項をここに記述
  マークダウン記法も使用可能
</Note>
```

## 注意事項

- Font Awesome CSS が読み込まれている前提
- WOVN翻訳サービスが有効な環境での使用を想定
- 内容はslotで受け取るため、Markdown記法はコンポーネント呼び出し側で処理