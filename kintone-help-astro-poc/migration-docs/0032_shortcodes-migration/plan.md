# Hugo Shortcodes → Astro コンポーネント移行実行プラン

## 概要

Hugo の layouts/shortcodes/ 配下にある 44 個のショートコードを Astro コンポーネントに移行する作業。
既に 7 個のコンポーネントが実装済みのため、残り 37 個の移行を行う。

## 作業目標

- **DOM の破壊的変更の禁止** - 既存構造の正確な再現を最優先
- **段階的実装** - 簡単なものから複雑なものへの順次移行
- **product 固定化対応** - kintone 固定により不要な分岐処理を削除
- **型安全性の確保** - TypeScript による適切な Props 型定義

## 移行対象の分析

### 既に移行済み（7個）

| Hugo Shortcode | Astro Component | 状態 |
|---------------|-----------------|------|
| hint.html | Hint.astro | ✅ 完了 |
| note.html | Note.astro | ✅ 完了 |
| reference.html | Reference.astro | ✅ 完了 |
| kintone.html | Kintone.astro | ✅ 完了 |
| enabled2.html | Enabled.astro | ✅ 完了 |
| wv_brk.html | Wovn.astro | ✅ 完了 |
| （なし） | Heading.astro | ✅ 新規作成済み |

### 移行対象（37個）- 複雑度別分類

#### 【フェーズ1】単純置換系（11個）
**特徴**: 単純な変数出力・ラッパー系

1. **CorpName.html** - 企業名出力（{{$.Site.Params.CorpName}}）
2. **annotation.html** - 単純な div ラッパー
3. **listsummary.html** - 単純な div ラッパー
4. **paramdata.html** - 動的クラス生成
5. **cybozu_com.html** - サイトパラメータ参照
6. **devnet_name.html** - 開発者サイト名
7. **devnet_top.html** - 開発者サイトトップURL
8. **disabled2.html** - enabled2 の逆ロジック（地域表示制御）
9. **slash.html** - product固定化対象（kintone固定）
10. **store.html** - product固定化対象（kintone固定）
11. **service.html** - product固定化対象（kintone固定）

#### 【フェーズ2】条件分岐・スタイル制御系（15個）
**特徴**: 中程度の条件分岐・スタイル適用

12. **warning.html** - product 条件付きアイコン表示
13. **info.html** - information アドモニション
14. **graynote.html** - グレー背景の注記
15. **subnavi.html** - パラメータ付きナビゲーション
16. **subnavi2.html** - subnavi のバリエーション
17. **subtitle.html** - 小見出し表示
18. **listtext.html** - リストテキスト表示
19. **logo.html** - ロゴ表示
20. **screen.html** - スクリーンショット表示
21. **proc1.html** - プロセス表示1
22. **proc2.html** - プロセス表示2
23. **stepindex2.html** - ステップインデックス
24. **anchorstep2.html** - アンカーステップ
25. **admin_button_label.html** - 管理者ボタンラベル
26. **id_search_msg.html** - ID 検索メッセージ

#### 【フェーズ3】高複雑系（11個）
**特徴**: 複雑なロジック・外部データ参照

27. **tile2.html** - 正規表現によるコンテンツ解析
28. **tile_img.html** - 画像付きタイル
29. **tile_img3.html** - 画像付きタイル（バリエーション）
30. **topics.html** - CSV 外部データ読み込み＋動的リスト生成
31. **audit_start.html** - 監査ログ開始タグ
32. **audit_end.html** - 監査ログ終了タグ
33. **slash_administrators.html** - slash 管理者表示
34. **slash_help.html** - slash ヘルプ
35. **slash_service_name.html** - slash サービス名
36. **slash_ui.html** - slash UI 表示
37. **slash_ui_administrators.html** - slash UI 管理者表示

### 【削除検討対象】Garoon 専用機能（2個）
- **tile_gr3.html** - Garoon 専用タイル（kintone 固定により不要）
- **tile_gr4.html** - Garoon 専用タイル（kintone 固定により不要）

## 実装戦略

### 1. 基本実装パターン

#### Props 設計原則
```typescript
// 【パターンA】Props 不要の最大簡素化
// 例: CorpName.astro
import { env } from "@/lib/env";
// Props 定義なし

// 【パターンB】必要最小限のカスタム Props
// 例: Disabled2.astro  
interface Props {
  regions?: string[];
}

// 【パターンC】BaseProps 継承（複雑な場合のみ）
import type { BaseProps } from './types';
interface Props extends BaseProps {
  // 必要な追加プロパティ
}
```

#### アドモニション統一パターン
```astro
<!-- Reference.astro, Hint.astro, Note.astro で確立済み -->
<aside class="admonition {type}">
  <div class="admonition-alt">
    <i class="fas fa-{icon} fa-fw" aria-hidden="true"></i>
    <Wovn>i18n__{title_key}</Wovn>
  </div>
  <div class="admonition-content">
    <slot />
  </div>
</aside>
```

### 2. product 固定化による簡素化

**対象ショートコード**:
- slash.html → "kintone" 固定出力
- store.html → "kintone" 固定出力  
- service.html → "kintone" 固定出力

**簡素化効果**:
```html
<!-- Hugo（削除前） -->
{{ if eq $.Site.Params.product "kintone" }}kintone{{ end }}
{{ if eq $.Site.Params.product "slash" }}kintone/{{ $.Site.Params.slash }}{{ end }}

<!-- Astro（簡素化後） -->
kintone
```

### 3. DOM 構造保持の原則

**厳守事項**:
- 元の HTML 構造を正確に再現
- クラス名・ID・属性の完全保持
- 勝手な文言追加・構造変更の禁止
- セマンティック HTML の維持

### 4. i18n 対応パターン

```astro
<!-- 通常箇所 -->
{{ i18n "key" }} → <Wovn>i18n__key</Wovn>

<!-- 属性内（TODO 対応） -->
aria-label="{{ i18n "key" }}" → aria-label="i18n__todo__key"
```

## 実装スケジュール

### Week 1: フェーズ1（単純置換系）
**作業量**: 11個のコンポーネント
**推定工数**: 2-3日

1. CorpName.astro
2. Annotation.astro
3. Listsummary.astro
4. Paramdata.astro
5. CybozuCom.astro
6. DevnetName.astro
7. DevnetTop.astro
8. Disabled2.astro
9. Slash.astro（product 固定化）
10. Store.astro（product 固定化）
11. Service.astro（product 固定化）

### Week 2: フェーズ2前半（アドモニション系）
**作業量**: 8個のコンポーネント
**推定工数**: 3-4日

12. Warning.astro（アドモニション）
13. Info.astro（アドモニション）
14. Graynote.astro（アドモニション）
15. Subtitle.astro
16. Listtext.astro
17. Logo.astro
18. Screen.astro
19. IdSearchMsg.astro

### Week 3: フェーズ2後半（ナビゲーション・UI系）
**作業量**: 7個のコンポーネント
**推定工数**: 3-4日

20. Subnavi.astro
21. Subnavi2.astro
22. Proc1.astro
23. Proc2.astro
24. Stepindex2.astro
25. Anchorstep2.astro
26. AdminButtonLabel.astro

### Week 4-5: フェーズ3（高複雑系）
**作業量**: 11個のコンポーネント
**推定工数**: 5-7日

27. Tile2.astro（最優先 - 正規表現処理）
28. TileImg.astro
29. TileImg3.astro
30. Topics.astro（CSV読み込み）
31. AuditStart.astro
32. AuditEnd.astro
33. SlashAdministrators.astro
34. SlashHelp.astro
35. SlashServiceName.astro
36. SlashUi.astro
37. SlashUiAdministrators.astro

## 品質管理

### 1. 必須チェック項目

各コンポーネント実装時:
- [ ] DOM 構造の元ファイルとの一致確認
- [ ] TypeScript 型エラーなし
- [ ] ビルドテスト成功（npm run build）
- [ ] 変更記録ファイル（.md）作成
- [ ] Props最適化の実施

### 2. 段階的テスト

- **フェーズ完了時**: 該当コンポーネント群のビルドテスト
- **全体完了時**: 全体統合テスト
- **リグレッション防止**: 既存機能への影響確認

### 3. ドキュメント要件

各コンポーネントに以下を作成:
```markdown
# {ComponentName} 変更記録

元ファイル: layouts/shortcodes/{filename}.html

## 関数・変数の置換
| Hugo | Astro | 備考 |
|------|-------|------|

## Props 設計
interface Props {
  // 型定義
}

## DOM 構造の変化
（なし／変更点記載）

## TODO
- [ ] 未実装機能

## 注意事項
```

## リスク管理

### 1. 高リスク要素
- **tile2.html**: 正規表現によるコンテンツ解析（最高複雑度）
- **topics.html**: CSV外部データ読み込み機能
- **slash_*** シリーズ**: product 変更の影響範囲が不明

### 2. 緩和策
- 高複雑度コンポーネントは単独作業日を設定
- TODO実装によるプレースホルダー機能の先行実装
- 段階的リリースによる影響範囲の限定

### 3. 成功基準
- [ ] 37個全てのコンポーネント移行完了
- [ ] ビルドエラーなし
- [ ] DOM構造の完全保持
- [ ] 既存機能への影響なし
- [ ] 型安全性の確保
- [ ] ドキュメント完備

## 次のステップ

1. **ユーザー承認**: 本プラン内容の確認・承認
2. **作業開始**: フェーズ1から順次実装
3. **進捗管理**: migration-memo.md での状況更新
4. **完了報告**: prompt.md での作業履歴記録

---
**重要**: プランニング段階完了。ユーザー許可後に実装を開始します。