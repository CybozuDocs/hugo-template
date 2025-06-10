# Breadcrumb 変更記録

元ファイル: `layouts/partials/breadcrumb.html`

## 関数・変数の置換

| Hugo                                 | Astro                     | 備考                         |
| ------------------------------------ | ------------------------- | ---------------------------- |
| `{{ i18n "Bread_crumb" }}`           | `i18n__todo__Bread_crumb` | aria-label 属性内のため TODO |
| `{{ template "breadcrumbnav" ... }}` | `<BreadcrumbNav ... />`   | 別コンポーネントとして分離   |
| `dict "p1" . "p2" .`                 | `p1={page} p2={page}`     | Props として渡す             |

## TODO

- [ ] aria-label の i18n 対応方法の検討

## 構造の変化

### define/template の分離

- `define "breadcrumbnav"` → `BreadcrumbNav.astro` として別ファイルに分離
- 再帰的な処理を別コンポーネントで実装

## その他の差分

なし

## 外部依存

- BreadcrumbNav コンポーネント（再帰的なナビゲーション構築）

## 注意事項

- メインコンポーネントはシンプルに保ち、複雑なロジックは BreadcrumbNav に委譲
