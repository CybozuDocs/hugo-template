# Hugo から Astro へのマイグレーションルール

## 概要

このドキュメントは、Hugo テンプレートから Astro コンポーネントへの移行作業時に守るべきルールと注意点を記録します。

## Partials移行時の重要ルール

### 1. コンポーネント名の対応規則

Hugoのpartial名とAstroコンポーネント名は正確に対応させる：

- `disclaimer2.html` → `Disclaimer2.astro`
- `pagenav.html` → `PageNav.astro`
- スペースがある場合は除去: `[PAGE NAV PARTIAL]` → `pagenav.html`

### 2. DOM構造の厳密な保持

**最重要ルール**: 元のHTML構造を正確に再現し、勝手な文言追加は禁止

```astro
<!-- ❌ 間違い: 勝手な文言追加 -->
<Wovn>翻訳に関する免責事項</Wovn>

<!-- ✅ 正しい: 元の構造を保持 -->
<div id="disclaimer2" class="disclaimer-note">
</div>
```

### 3. templateVersionの扱い

- templateVersion=2のみ存在するため、バージョン分岐は不要
- Footer2.astroは標準のFooter.astroとして扱う

## 移行作業の基本原則

### 1. 段階的アプローチ

- プレースホルダーとして基本実装を行い、後から機能を追加
- 複雑なコンポーネントは分割して移行

### 2. 変更記録の徹底

各コンポーネントの移行時には必ず `.md` ファイルを作成：

```markdown
# {ComponentName} 変更記録

元ファイル: `layouts/partials/{filename}.html`

## 関数・変数の置換

| Hugo | Astro | 備考 |
|------|-------|------|

## TODO

- [ ] 未実装機能

## 構造の変化

## その他の差分

## 外部依存

## 注意事項
```

### 3. 型安全性の確保

- すべてのコンポーネントでPropsの型定義を実装
- TypeScript interfaceを使用して型安全性を保証

## Hugo特有の構文の変換規則

### 1. テンプレート関数

```
{{ define "name" }} → 個別のAstroコンポーネントとして分離
{{ template "name" . }} → <ComponentName {props} />
{{ partial "name" . }} → <ComponentName {props} />
```

### 2. 変数参照

```
$.Site.Params.xxx → env.xxx
.Params.xxx → page.params.xxx
.Site.xxx → env.xxx
```

### 3. 制御構文

```
{{ if condition }} → {condition && (...)}
{{ range .Items }} → {items.map(item => (...))}
{{ with .Variable }} → {variable && (...)}
```

## 移行時の確認事項

### 必須チェックリスト

- [ ] 元のHTML構造が保持されているか
- [ ] 文言の勝手な追加がないか
- [ ] TypeScript型定義が適切か
- [ ] 変更記録ファイルを作成したか
- [ ] TODOコメントを適切に記載したか

### 移行困難な要素の扱い

1. **属性内のi18n**: `i18n__todo__` プレフィックスを付けて後回し
2. **複雑な再帰処理**: 専用の設計を検討
3. **外部API連携**: 環境変数経由で設定

## ドキュメント更新ルール

### 作業開始時

1. `migration-docs/{4桁の連番}_{作業名}/` ディレクトリを作成
2. `plan.md` に詳細な実行計画を記載
3. Todoリストに必要なタスクを登録

### 作業中

- 重要な発見や課題は随時 `migrate-memo.md` に記録
- 新しいルールが確立されたら `migrate-rules.md` に追加

### 作業完了時

1. `prompt.md` に作業履歴を作成
2. `migrate-memo.md` を更新（概要、学習事項、課題）
3. `migrate-rules.md` を更新（新ルール）
4. `rules.md` を更新（Astro開発の永続的ルール）

## 更新履歴

- 2025年1月 - 初版作成（rules.mdから移行関連情報を分離）