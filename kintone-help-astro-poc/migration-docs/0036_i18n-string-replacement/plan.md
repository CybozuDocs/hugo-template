# i18n 文字列置換計画

## 概要
Astro プロジェクト内で暫定的に使用されている `i18n__` プレフィックス付き文字列を、`i18n/ja.toml` に定義されている実際の日本語テキストに置換する。

## 現状分析

### 対象ファイル数
- 29個の Astro コンポーネントファイル（.astro）に `i18n__` 文字列が含まれている

### 発見された i18n キー

#### 通常の i18n キー（23個）
1. `i18n__Article_number` → "記事番号"
2. `i18n__Articles_in_this_category` → "このカテゴリーの記事"
3. `i18n__Close` → "閉じる"
4. `i18n__Contact_support` → "サポート問い合わせ"
5. `i18n__Footer_copyright` → "記載された商品名、各製品名は各社の登録商標または商標です。 ©Cybozu"
6. `i18n__In_this_article` → "この記事の内容"
7. `i18n__Link_was_copied` → "固定リンクがコピーされました"
8. `i18n__Locale_modal_message` → "このページは、日本国外のお客様向けです。<br>日本のお客様に適したページに移動しますか？"
9. `i18n__MT_Disclaimer` → "機械翻訳についての免責事項"
10. `i18n__Next_page` → "次のページへ"
11. `i18n__No` → "いいえ"
12. `i18n__Only_ja` → "日本語のみ"
13. `i18n__Permalink` → "固定リンク"
14. `i18n__Previous_page` → "前のページへ"
15. `i18n__See_also` → "次のページも参照してください"
16. `i18n__Title_caution` → "注意"
17. `i18n__Title_note` → "補足"
18. `i18n__Title_references` → "関連ページ"
19. `i18n__Title_tips` → "ヒント"
20. `i18n__Unsupported_browser` → "非対応のWebブラウザです。"
21. `i18n__Unsupported_message` → "一部の機能が正常に動作しない場合があります。"
22. `i18n__Was_it_helpful` → "この情報は役に立ちましたか？"
23. `i18n__Yes` → "はい"

#### Bing 検索関連（2個）
24. `i18n__search_bing` → "Enhanced by Bing"
25. `i18n__search_bing_legal` → "Microsoft Privacy Statement"

#### TODO マークされたキー（16個）
以下のキーは `i18n__todo__` プレフィックスが付いており、翻訳の定義を確認する必要がある：
- `i18n__todo__Announcement_button_close` → 該当なし（新規追加が必要）
- `i18n__todo__Bread_crumb` → "パンくずリスト"
- `i18n__todo__Close` → "閉じる"
- `i18n__todo__Copy_perma_link` → "固定リンクをコピーします"
- `i18n__todo__Document_type` → "メニュー"
- `i18n__todo__Go_back_to_top` → "トップに戻る"
- `i18n__todo__In_this_article` → "この記事の内容"
- `i18n__todo__No` → "いいえ"
- `i18n__todo__Search_example` → "検索する（例：ルックアップ、通知、ログインできない）"
- `i18n__todo__Search_filter` → "次の中から検索する"
- `i18n__todo__Side_navigation_hide` → "サイドナビゲーションを表示しない"
- `i18n__todo__Side_navigation_show` → "サイドナビゲーションを表示する"
- `i18n__todo__Tab_menu` → "タブメニュー"
- `i18n__todo__Yes` → "はい"
- `i18n__todo__og_desc` → 動的生成が必要（og_desc1, og_desc1_service, og_desc2を使用）
- `i18n__todo__search` → "検索"
- `i18n__todo__search_word` → "検索ワード"

## 実装計画

### Phase 1: 準備と検証（5分）
1. 各ファイルの i18n 文字列の使用箇所を特定
2. 置換による影響範囲の確認
3. 動的な値を含む文字列の特定（特に og_desc 関連）

### Phase 2: 基本的な i18n 文字列の置換（15分）
1. 通常の `i18n__` プレフィックス文字列（23個）の一括置換
2. 各ファイルごとに確認しながら実行

### Phase 3: TODO マーク付き文字列の処理（20分）
1. `i18n__todo__` プレフィックス文字列の置換
2. `Announcement_button_close` などの未定義キーの処理方針決定
3. `og_desc` 関連の動的生成が必要な箇所の特別処理

### Phase 4: 検証とテスト（10分）
1. 全ファイルの置換結果の確認
2. HTML エスケープが必要な箇所の確認（`Locale_modal_message` の `<br>` など）
3. ビルドエラーがないことの確認

## 技術的考慮事項

### 1. HTML を含む文字列の処理
- `Locale_modal_message` には `<br>` タグが含まれている
- Astro コンポーネント内での使用方法に応じて、`set:html` の使用が必要な可能性

### 2. 動的な値の処理
- `og_desc` 関連は、Site.Params の値を使用した動的生成が必要
- 現在の実装を確認し、適切な処理方法を決定

### 3. 未定義キーの処理
- `Announcement_button_close` は ja.toml に定義されていない
- デフォルト値の設定または新規追加が必要

## リスク評価
- **低リスク**: 単純な文字列置換のため、実装リスクは低い
- **中リスク**: HTML を含む文字列の処理で、表示が崩れる可能性
- **注意点**: ビルド時のエラーを避けるため、段階的な置換を推奨

## 成功基準
1. すべての `i18n__` プレフィックス文字列が日本語に置換される
2. ビルドエラーが発生しない
3. ページの表示が正常に行われる
4. HTML を含む文字列が適切にレンダリングされる