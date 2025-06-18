# LatestPageGuide.astro 削除作業計画

## 作業概要

PageLayoutからの呼び出しで未実装なものとして、LatestPageGuide.astro があります。
しかし、"kintone" を対象としたヘルプサイトの場合、"latest_page" が設定されているコンテンツが存在しないため、LatestPageGuide.astro の中身が表示されることはありません。

LatestPageGuide.astro を削除します。

## 作業範囲

### 削除対象
- `kintone-help-astro-poc/src/components/LatestPageGuide.astro`

### 影響確認
- PageLayoutでの参照がある場合は削除
- その他のコンポーネントからの参照有無確認

## 作業手順

1. **ファイル存在確認**
   - LatestPageGuide.astroファイルの存在確認

2. **参照箇所の確認**
   - PageLayout.astroでの参照確認
   - その他コンポーネントからの参照確認

3. **削除実行**
   - LatestPageGuide.astroファイル削除
   - 参照箇所（あれば）削除

4. **ビルドテスト**
   - npm run buildでエラーがないことを確認

5. **ドキュメント更新**
   - prompt.mdの作成
   - migrate-memo.mdの更新

## 削除理由

- kintone対象のヘルプサイトでは"latest_page"設定コンテンツが存在しない
- 実際に表示されることがない未実装コンポーネント
- 不要なファイルの整理

## 品質確保

- ビルドテストによる構文エラー確認
- 他コンポーネントへの影響確認

## 作業完了条件

- LatestPageGuide.astroファイルが削除されている
- 参照箇所が適切に削除されている
- ビルドテストがエラーなしで完了する
- ドキュメントが適切に更新されている