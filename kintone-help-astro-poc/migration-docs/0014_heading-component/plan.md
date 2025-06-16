# Heading.astro コンポーネント実装計画

## 目的

Hugo の `render-heading.html` で呼び出される `anchorlink2` テンプレートの機能を、Astro の Heading.astro コンポーネントとして実装する。

## 背景

- `render-heading.html` は Hugo で Markdown の見出しレンダリングをカスタマイズする処理
- kintone 固定、templateVersion="2" 固定により、anchorlink2 の呼び出し部分のみが必要
- 複雑な Markdown レンダリングカスタマイズを避け、シンプルなコンポーネント化を行う

## 実装方針

### 1. コンポーネント設計

**Props 設計:**
```typescript
interface Props {
  level: number;     // 見出しレベル (1-6)
  id: string;        // アンカーID
  text: string;      // 見出しテキスト
  class?: string;    // 追加CSSクラス
}
```

**実装パターン:**
- AnchorLink2.astro を内部で呼び出す
- getRelPermalink() 関数で相対パーマリンクを取得（TODO実装）
- env.idSearch を使用してIDリンク機能を制御

### 2. Hugo テンプレートとの対応

**元のHugo処理:**
```html
{{- template "anchorlink2" (dict "ti" . "link" .Page.RelPermalink "al" (index .Page.Params.aliases 0) "ids" .Page.Site.Params.id_search ) }}
```

**Astro実装:**
```astro
<AnchorLink2 ti={ti} ids={env.idSearch} al={al} />
```

### 3. 依存関係

**必要なコンポーネント:**
- AnchorLink2.astro (既存)

**必要な関数:**
- getRelPermalink() (新規作成、page.ts に追加)

## 実装手順

### 1. getRelPermalink 関数の追加
- [ ] `src/lib/page.ts` に関数を追加
- [ ] 引数なしでダミー値を返す実装
- [ ] TODO コメントで将来の実装を明示

### 2. Heading.astro の実装
- [ ] AnchorLink2.astro をインポート
- [ ] Props インターフェースを定義
- [ ] TocItem 型に合わせたデータ構築
- [ ] AnchorLink2 コンポーネントの呼び出し

### 3. 品質確保
- [ ] ビルドテストの実行
- [ ] 型エラーの解消
- [ ] 変更記録ファイルの作成

## 技術的考慮事項

### 制約事項
- product="kintone" 固定のため、他製品の分岐は不要
- templateVersion="2" 固定のため、バージョン分岐は不要
- Astro では slot の内容を直接取得できないため、text props を使用

### TODO項目
- getRelPermalink() の実際の実装
- page.params.aliases の取得機能
- Markdown レンダリング時の自動統合

## 期待される効果

1. **機能保持**: anchorlink2 テンプレートの機能を完全に再現
2. **コンポーネント化**: 再利用可能な見出しコンポーネントとして利用
3. **保守性向上**: Hugo テンプレートよりもシンプルで理解しやすい実装
4. **型安全性**: TypeScript による型チェック

## リスク

1. **使用方法の変更**: slot ではなく text props を使用
2. **機能不完全**: getRelPermalink の TODO 実装
3. **統合課題**: Markdown レンダリングとの連携方法

これらのリスクは段階的な実装により軽減する。