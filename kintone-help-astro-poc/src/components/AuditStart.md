# AuditStart.astro 変更記録

元ファイル: layouts/shortcodes/audit_start.html

## 関数・変数の置換

| Hugo | Astro | 備考 |
|------|-------|------|
| `<!-- auditstart -->` | `<!-- auditstart -->` | 変更なし（完全一致） |

## Props 設計

```typescript
// Props なし - 静的HTMLコメント出力のみ
```

## DOM 構造の変化

なし - HTMLコメント形式を完全保持

## TODO

なし（実装完了）

## 注意事項

- 監査用マーカーのため、AuditEnd.astro とペアで使用
- HTMLコメントなのでブラウザでは非表示
- 自動化ツールや解析スクリプトでの範囲指定に使用