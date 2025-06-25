# Hugo → Astro コンテンツ変換スクリプトの改善・拡張計画

## 概要
既存の `convert-hugo-to-astro.ts` スクリプトをベースに、より包括的な変換機能を持つスクリプトを作成します。

## 現状分析

### 既存スクリプトの機能
- ✅ Deno ベースの TypeScript スクリプト
- ✅ AST ベースでない（正規表現ベース）の変換処理
- ✅ 22種類の Shortcode 対応
- ✅ FrontMatter の変換とタイポ修正
- ✅ 画像・見出しの変換
- ✅ Import 文の自動生成
- ✅ 並列処理対応
- ✅ Dry-run モード

### 改善が必要な点
1. **AST ベースへの移行**: 現在は正規表現ベースで、複雑なケースでエラーが発生する可能性
2. **Node.js/TypeScript への移植**: Deno 依存を解消し、npm スクリプトとして実行可能に
3. **配置場所の変更**: `migrate-scripts/` ディレクトリへの移動
4. **エラーハンドリングの強化**: より詳細なエラー情報とリカバリー機能
5. **変換検証機能**: 変換前後の内容検証

## 実装計画

### Phase 1: 基盤整備
1. `kintone-help-astro-poc/migrate-scripts/` ディレクトリの作成
2. Node.js/TypeScript プロジェクトのセットアップ
   - package.json の作成
   - TypeScript 設定
   - 必要なパッケージのインストール

### Phase 2: AST ベースの変換エンジン実装
1. Markdown AST パーサー（remark）の導入
2. Shortcode 変換のAST実装
3. 画像・見出し変換のAST実装
4. FrontMatter 処理の最適化

### Phase 3: 機能拡張
1. 変換前後の検証機能
   - DOM 構造の比較
   - リンク切れチェック
   - 画像パスの検証
2. 進捗表示の改善
   - プログレスバー
   - リアルタイム統計
3. 変換ルールのカスタマイズ機能
   - 設定ファイル対応
   - プラグインシステム

### Phase 4: テストとドキュメント
1. ユニットテストの作成
2. 統合テストの作成
3. 使用ドキュメントの作成

## 技術スタック

### 必要なパッケージ
- **remark**: Markdown AST パーサー
- **remark-frontmatter**: FrontMatter 対応
- **remark-mdx**: MDX 対応
- **gray-matter**: FrontMatter パーサー
- **commander**: CLI フレームワーク
- **ora**: プログレススピナー
- **chalk**: ターミナル出力の色付け
- **glob**: ファイル検索
- **fs-extra**: ファイル操作

### 開発用パッケージ
- **typescript**: TypeScript コンパイラ
- **@types/node**: Node.js 型定義
- **jest**: テストフレームワーク
- **eslint**: リンター
- **prettier**: フォーマッター

## スクリプト構成

```
kintone-help-astro-poc/migrate-scripts/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts              # エントリーポイント
│   ├── cli.ts                # CLI 処理
│   ├── converter/
│   │   ├── index.ts          # 変換メインロジック
│   │   ├── ast-parser.ts     # AST パーサー
│   │   ├── shortcodes.ts     # Shortcode 変換
│   │   ├── images.ts         # 画像変換
│   │   ├── headings.ts       # 見出し変換
│   │   └── frontmatter.ts    # FrontMatter 処理
│   ├── validator/
│   │   ├── index.ts          # 検証メインロジック
│   │   └── rules.ts          # 検証ルール
│   └── utils/
│       ├── file.ts           # ファイル操作
│       ├── logger.ts         # ログ出力
│       └── progress.ts       # 進捗表示
├── tests/
│   ├── fixtures/             # テスト用ファイル
│   ├── converter.test.ts     # 変換テスト
│   └── validator.test.ts     # 検証テスト
└── README.md                 # 使用方法ドキュメント
```

## 使用方法（予定）

```bash
# インストール
cd kintone-help-astro-poc/migrate-scripts
npm install

# 基本的な使用方法
npm run convert -- --source-dir /path/to/hugo/content/ja --target-dir /path/to/astro/src/pages/ja

# 特定ディレクトリのみ変換
npm run convert -- --source-dir ./content/ja --target-dir ./src/pages/ja --target admin/app_admin

# Dry-run モード
npm run convert -- --source-dir ./content/ja --target-dir ./src/pages/ja --dry-run

# 検証付き変換
npm run convert -- --source-dir ./content/ja --target-dir ./src/pages/ja --validate
```

## 成功基準

1. **機能的要件**
   - すべての Hugo Shortcode が正しく Astro コンポーネントに変換される
   - FrontMatter が適切に処理される
   - 画像パスが正しく変換される
   - 見出しの ID が保持される
   - _index.md が index.mdx に変換される

2. **非機能的要件**
   - 1000ファイルを5分以内に変換
   - エラー率 1% 未満
   - メモリ使用量 1GB 未満
   - 詳細なログ出力

3. **品質基準**
   - テストカバレッジ 80% 以上
   - ESLint エラー 0
   - TypeScript 型エラー 0

## リスクと対策

| リスク | 影響 | 対策 |
|--------|------|------|
| AST パーサーの互換性問題 | 変換エラー | フォールバック機能の実装 |
| メモリ不足（大量ファイル処理時） | 処理中断 | バッチ処理とメモリ管理 |
| 未知の Shortcode パターン | 変換漏れ | ログ出力と手動修正ガイド |

## タイムライン

- Phase 1: 1日
- Phase 2: 2日
- Phase 3: 2日
- Phase 4: 1日

合計: 約6日間の作業

## 次のステップ

1. このプランの承認を得る
2. migrate-scripts ディレクトリの作成
3. Node.js プロジェクトのセットアップ
4. 既存スクリプトの機能を AST ベースで再実装