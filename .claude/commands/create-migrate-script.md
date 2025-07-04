# Hugo → Astro のコンテンツ変換用スクリプトの作成

- kintone-help-astro-poc/migrate-scripts/WORK.md の内容を遵守して作業すること
- 変換スクリプトの変更後、常に migrate-scripts/ 配下のテストコードを最新化すること
- コード変更後、常に migrate-scripts/ 配下で `npm run test` を実行し、テストが通ることを確認すること

## プロジェクト全体の前提

- Astro への移行作業を行っています。
- kintone-help-astro-poc/ ディレクトリ配下が移行後の Astro によるプロジェクトです。

**必ず次のファイルの内容を確認してください。**

- kintone-help-astro-poc/migration-docs/rules.md : Astro 開発の永続的なルール（移行完了後も使用）
- kintone-help-astro-poc/migration-docs/migrate-rules.md : 新たな移行ルールや注意点
