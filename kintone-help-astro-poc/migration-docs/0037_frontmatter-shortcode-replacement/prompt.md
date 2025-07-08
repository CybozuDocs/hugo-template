# FrontMatter内ショートコード置換実装

## ユーザーからの指示

コンテンツの FrontMatter の中に、ショートコードに対応したコンポーネント風の文字列が入ります。

851d488f3dbbe13b96ed0a7557dd20de83265535 のコミットでその対応が入りました。

実際には、これらの文字列はコンポーネントとしては機能しないため、
page.ts で FrontMatter の内容を読み込む際に、
コンポーネント内で読み込んでいる文字列と同じ文字列に強制的に該当部分を置換するようにしてほしいです。

## 現在の状況分析

### 既存の実装状況

1. **frontmatter-processor.ts**: FrontMatter内のショートコードを`<Kintone />`のような文字列に変換
2. **コンポーネント**: `env.kintone`などの実際の値を出力
3. **page.ts**: FrontMatterを読み込んでPagePropsを作成

### 問題

FrontMatter内の`<Kintone />`などの文字列が実際のコンポーネントとして機能せず、文字列のまま表示される

### 解決方針

page.tsでFrontMatterを読み込む際に、コンポーネント風文字列を実際のenv値に置換する処理を追加する

## 作業履歴

- ✅ 現在の実装状況を調査完了
- ✅ plan.mdを作成し、ユーザーの承認を取得
- ✅ component-mapping.ts実装完了
- ✅ frontmatter-replacer.ts実装完了
- ✅ page.ts修正完了
- ✅ テスト実装完了
- ✅ 動作確認完了（`<Kintone />`→`kintone`への置換が正常動作）
- 🔄 ドキュメント更新中

## 動作確認結果

実際のページで置換処理が正常に動作することを確認：
- **テストページ**: `/k/ja/ai/ai_enable`
- **FrontMatter**: `title: "<Kintone /> AIの有効化と利用する機能の選択"`
- **実際のタイトル**: `kintone AIの有効化と利用する機能の選択`
- **結果**: ✅ `<Kintone />`が`kintone`に正しく置換

## 最終実装仕様

### 対応コンポーネント（8つ限定）
- Kintone, CybozuCom, Store, Slash, SlashUi, Service, SlashAdministrators, SlashHelp

### エラーハンドリング
1. **未対応コンポーネント**: 無視してそのまま表示（`<Yeah />` など）
2. **対応済みコンポーネント**: env値未設定でビルドエラー

### 置換処理フロー
```
<Yeah /> → 無視 → そのまま表示
<Kintone /> + env設定済み → 置換 → "kintone"  
<Kintone /> + env未設定 → エラー → ビルド停止
```

### 実装ファイル
- `src/lib/component-mapping.ts`: マッピング定義、対応チェック関数
- `src/lib/frontmatter-replacer.ts`: 置換ロジック  
- `src/lib/page.ts`: createPageData関数での適用
- テスト: 19ケース網羅