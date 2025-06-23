# PageNav 変更記録

元ファイル: `layouts/partials/pagenav.html`

## Props最適化

| 修正前 | 修正後 | 理由 |
|--------|--------|------|
| `interface Props extends BaseProps {}` | `interface Props { nextInSection?: { permalink: string; }; prevInSection?: { permalink: string; }; }` | 必要最小限のプロパティのみに限定 |
| `const { page } = Astro.props;` | `const { nextInSection, prevInSection } = Astro.props;` | 直接必要なプロパティを受け取る |
| `page.nextInSection` | `nextInSection` | Props最適化に伴う参照変更 |
| `page.prevInSection` | `prevInSection` | Props最適化に伴う参照変更 |

## Hugo → Astro 変換

| Hugo                         | Astro                              | 備考                |
| ---------------------------- | ---------------------------------- | ------------------- |
| `{{ i18n "Previous_page" }}` | `<Wovn>i18n__Previous_page</Wovn>` | WOVN 対応           |
| `{{ i18n "Next_page" }}`     | `<Wovn>i18n__Next_page</Wovn>`     | WOVN 対応           |
| `{{ with .NextInSection }}`  | `{ nextInSection && (`             | 条件分岐の変換       |
| `{{ with .PrevInSection }}`  | `{ prevInSection && (`             | 条件分岐の変換       |
| `{{ .Permalink }}`           | `{nextInSection.permalink}`        | プロパティ参照の変換 |

## TODO

- [ ] nextInSectionとprevInSectionの実際の値を取得するロジックの実装
- [ ] シリーズページでの前後ページナビゲーション機能の完全実装

## 構造の変化

### 条件分岐の変更

- Hugo の `{{ with }}` → JavaScript の `&&` 演算子
- より簡潔な条件付きレンダリング

## その他の差分

### プロパティ名の統一

- Hugo の `.Permalink` → Astro の `.permalink`（小文字）
- 型定義に合わせた命名規則

## 外部依存

### Font Awesome

- `<i class="fas fa-caret-left">` / `<i class="fas fa-caret-right">` アイコンの使用

## 注意事項

- nextInSection/prevInSection が存在しない場合は何も表示されない
- ページナビゲーションは現在のセクション内でのみ動作
