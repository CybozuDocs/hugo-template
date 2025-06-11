# templateVersion および product の固定化 実行プラン

## 作業概要
Astroへの移行に伴い、templateVersionを"2"、productを"kintone"で固定化する。
従来の環境変数による動的な値参照を削除し、定数として直接埋め込む。

## 現状分析
- 現在、PUBLIC_PRODUCT と PUBLIC_TEMPLATE_VERSION が環境変数として定義されている
- これらの値によって分岐処理が存在する可能性がある
- 値を表示している箇所では環境変数を参照している

## 実行ステップ

### 1. 現状調査
- [ ] 環境変数ファイル（.env*）の確認
- [ ] PUBLIC_PRODUCT, PUBLIC_TEMPLATE_VERSION の使用箇所を検索
- [ ] 分岐処理の特定
- [ ] 値表示箇所の特定

### 2. 環境変数の削除
- [ ] .env ファイルから該当行を削除
- [ ] .env.* ファイルから該当行を削除

### 3. コード修正
- [ ] 分岐処理の削除（kintone/template version 2以外の処理を削除）
- [ ] 値表示箇所の定数化
  - templateVersion → "2"
  - product → "kintone"

### 4. 検証
- [ ] ビルドエラーがないことを確認
- [ ] 表示される値が正しいことを確認

## 固定値
- `templateVersion`: "2"
- `product`: "kintone"

## 注意点
- 他の製品（Garoon等）の分岐処理も削除対象
- テンプレートバージョン1の処理も削除対象
- 表示値は文字列として直接埋め込む