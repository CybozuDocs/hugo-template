# MegaNav 変更記録

元ファイル: `layouts/partials/meganav.html`, `layouts/partials/meganav_kt.html`, `layouts/partials/meganav_gr.html`

## 統合の経緯

2025年1月のコンポーネント統合作業により、以下の変更を実施：

1. **MegaNavGr関連コンポーネントの削除**: Garoon用機能（MegaNavGr.astro, MegaNavGrGetSecond.astro, MegaNavGrTitleIcon.astro, MegaNavGrMegaPanel.astro, MegaNavGrSectBar.astro）を完全削除
2. **MegaNavKt.astroの統合**: kintone用メガナビゲーション機能をMegaNav.astroに統合
3. **条件分岐の削除**: `env.targetRegion === "US"` による分岐を削除（PageLayout側で制御）

## 関数・変数の置換

### 基本的な置換パターン

| Hugo                               | Astro                              | 備考                        |
| ---------------------------------- | ---------------------------------- | --------------------------- |
| `{{ i18n "Document_type" }}`       | `i18n__todo__Document_type`        | aria-label内のためTODO      |
| `{{ i18n "Tab_menu" }}`            | `i18n__todo__Tab_menu`             | aria-label内のためTODO      |
| `$.Site.Params.product`            | `env.product`                      | 現在はkintone固定           |
| `$.Site.Params.TargetRegion`       | `env.targetRegion`                 | env プロパティに集約        |
| `$.Lang`                           | `page.lang`                        | page プロパティ             |
| `$.IsHome`                         | `page.isHome`                      | page プロパティ             |
| `$.Params.type`                    | `page.frontmatter.type`            | page プロパティ             |
| `.RelPermalink`                    | `page.relPermalink`                | page プロパティ             |

### CSVデータ処理

| Hugo                               | Astro                              | 備考                        |
| ---------------------------------- | ---------------------------------- | --------------------------- |
| `resources.Get`                    | `getMenuData()`                    | 簡易実装（要改善）          |
| `transform.Unmarshal`              | JavaScript配列操作                 | CSV解析の代替               |

### 配列・文字列操作

| Hugo                               | Astro                              | 備考                        |
| ---------------------------------- | ---------------------------------- | --------------------------- |
| `slice`                            | `配列リテラル []`                  | JavaScript の配列           |
| `append`                           | `...スプレッド演算子`              | JavaScript の配列操作       |
| `strings.TrimSuffix ".html"`       | `.replace(/\.html$/, '')`          | JavaScript の正規表現       |
| `split $baseurl "/"`               | `baseurl.split('/')`               | JavaScript の文字列メソッド |
| `len $baseparts`                   | `baseparts.length`                 | JavaScript のプロパティ     |

### ループ・制御構文

| Hugo                               | Astro                              | 備考                        |
| ---------------------------------- | ---------------------------------- | --------------------------- |
| `range $entries`                   | `entries.map((entry) => (...))`    | JavaScript の配列メソッド   |
| `seq $panelcnt`                    | `Array.from({ length: panelcnt })` | JavaScript の配列生成       |
| `add $menuid 1`                    | `menuid++`                         | JavaScript の演算子         |

## TODO

- [ ] CSVファイルの実際の読み込み処理を実装
- [ ] aria-label内のi18n対応
- [ ] menuitems_*.csvファイルの動的読み込み
- [ ] エラーハンドリングの追加
- [ ] product分岐処理の復活（slash, store製品サポート時）

## 構造の変化

### コンポーネント統合

- **統合前**: MegaNav.astro → 条件分岐 → MegaNavKt.astro / MegaNavGr.astro
- **統合後**: MegaNav.astro（kintone用機能のみ）

### 関数の整理

- Hugo の複雑な `range` ループ → `generateMenuItems()` / `generatePanelContent()` 関数
- 可読性とメンテナンス性の向上

### CSVファイル処理の簡易実装

- Hugo の `resources.Get` + `transform.Unmarshal` → `getMenuData()` 関数による簡易実装
- 実際のCSVファイル読み込みは後日実装が必要

### Scratch変数の代替

- Hugo の暗黙的な変数管理 → JavaScript のローカル変数
- より明示的な状態管理

## その他の差分

### 条件分岐の簡素化

- env.targetRegion === "US" による分岐を削除
- PageLayout側での env.meganav による制御に統一

### Props の明示的な受け渡し

- Hugo の `.` による暗黙的なコンテキスト受け渡し → BasePropsによる明示的な Props 受け渡し

### 配列操作の変更

- Hugo の `slice` + `append` → JavaScript の配列リテラルとスプレッド演算子
- より自然な配列操作

### 文字列処理の変更

- Hugo の `strings.*` 関数群 → JavaScript の文字列メソッドと正規表現
- より柔軟な文字列操作

## 外部依存

### Font Awesome

- `fas fa-chevron-down` アイコンの使用
- タブ切り替えアイコンとして使用

### CSVデータファイル

- `menuitems_*.csv` ファイル（言語・地域別）
- 現在は簡易実装で代替

## 注意事項

### 実装の制限

- 現在の実装は簡易版のため、実際のCSVファイル読み込み処理が必要
- メニューデータにはslash, store用URLが含まれているが、kintone環境では不要
- アクセシビリティ属性（role, aria-*）を適切に維持

### 削除された機能

- Garoon用の特化された機能（Second Section判定など）
- CSVファイルからのアイコン読み込み（Garoon）
- より複雑な階層構造の処理（Garoon）
- 製品による分岐処理（現在はkintone固定）

### 将来の拡張性

- slash, store製品のサポートが必要になった場合は、product分岐処理の復活が必要
- CSVファイル読み込み処理の実装により、ハードコードからの脱却が可能
- JavaScript での動的な動作（タブ切り替え等）は別途実装が必要

## Props最適化（2025年1月追加）

### 最適化の経緯

PageLayoutコンポーネントでの実際の統合に合わせて、Props設計を最適化：

1. **BaseProps削除**: 不要な依存関係を除去
2. **必要最小限のプロパティ**: page全体ではなく、実際に使用される4つのプロパティのみ
3. **型安全性の向上**: 明示的なプロパティ定義による型安全性確保

### 最適化されたProps設計

```typescript
interface Props {
  lang: string;           // page.lang
  isHome: boolean;        // page.isHome  
  type: string;           // page.frontmatter.type
  relPermalink: string;   // page.relPermalink
}
```

### PageLayoutでの統合

```astro
{env.meganav && (
  <>
    <div class="mnav-pad" />
    <MegaNav 
      lang={currentPage.lang}
      isHome={currentPage.isHome}
      type={currentPage.frontmatter.type}
      relPermalink={currentPage.relPermalink}
    />
  </>
)}
```

## 統合による効果

### 簡素化

- 不要な条件分岐の削除による構造の簡素化
- 単一責任原則に基づくコンポーネント設計の確立
- 保守性の向上

### 型安全性

- 必要最小限のPropsによる明確なインターフェース
- TypeScript型安全性の維持
- BaseProps依存の除去による独立性向上

### 性能向上

- 不要なコンポーネントファイルの削除
- 条件分岐の削減によるランタイム処理の軽量化
- Props最適化による依存関係の削減

### 実装の完了

- PageLayout.astroでの実際の統合完了
- MEGANAV PARTIALプレースホルダーから実コンポーネントへの移行
- env.meganav条件による適切な制御の確保

## 実データファイル対応（2025年1月追加）

### ダミーデータから実データへの移行

MegaNavコンポーネントで使用していたダミーデータを実際のCSVデータから変換したTypeScriptファイルに置き換え：

### 作成されたファイル

- **src/_data/menuitems.ts**: CSVデータをTypeScriptオブジェクトに変換
- **元ファイル**: src/pages/_data/csv/menuitems.US.csv

### 変換内容

```typescript
export interface MenuItemData {
  id: string;
  title: string;
  url: string;
}

export const menuItems: MenuItemData[] = [
  // CSVデータをオブジェクト配列に変換
  { id: "1", title: "Kintoneの使いかた", url: "/k/ja/" },
  { id: "1", title: "スタートガイド", url: "/k/ja/id/040130.html" },
  // ... その他のメニューアイテム
];

export function getMenuData(_lang: string, _targetRegion: string) {
  // 既存のgetMenuData関数と同じインターフェースを維持
  return {
    ids: menuItems.map(item => item.id),
    titles: menuItems.map(item => item.title),
    urls: menuItems.map(item => item.url),
  };
}
```

### MegaNav.astroの修正

```astro
---
import { getMenuData } from "../../_data/menuitems";
// ダミー関数を削除し、実際のデータファイルをインポート
---
```

### 変更による効果

1. **実データの使用**: CSVファイルから実際のメニューデータを使用
2. **型安全性**: TypeScriptインターフェースによる型定義
3. **保守性向上**: データとロジックの分離
4. **拡張性**: 将来的な多言語・多リージョン対応への準備

### データ構造

- **カテゴリ1**: Kintoneの使いかた（15項目）
- **カテゴリ2**: 管理（ユーザー／システム）（5項目）
- **カテゴリ3**: 試用／購入（6項目）

総計26項目のメニューデータを実装。