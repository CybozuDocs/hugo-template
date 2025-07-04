import { describe, it, expect } from 'vitest';
import { processHtml } from './html-processor.js';

describe('processHtml', () => {
  describe('自己閉じタグの変換', () => {
    it('<br>を<br />に変換する', () => {
      const input = 'テキスト1<br>テキスト2';
      const result = processHtml(input);
      
      expect(result.content).toBe('テキスト1<br />テキスト2');
      expect(result.converted).toBe(true);
    });

    it('複数の<br>タグを一度に変換する', () => {
      const input = `バナーの内容：  
反映前の変更があります　変更した設定をアプリに反映するには、[アプリを更新]ボタンをクリックします（ヘルプ）。  
<br>
このバナーは、変更した設定がアプリにまだ反映されていないことを示しています。<br>
追加の説明です。`;
      const result = processHtml(input);
      
      const expected = `バナーの内容：  
反映前の変更があります　変更した設定をアプリに反映するには、[アプリを更新]ボタンをクリックします（ヘルプ）。  
<br />
このバナーは、変更した設定がアプリにまだ反映されていないことを示しています。<br />
追加の説明です。`;
      expect(result.content).toBe(expected);
      expect(result.converted).toBe(true);
    });

    it('既に自己閉じタグの場合は変更しない', () => {
      const input = 'テキスト1<br />テキスト2';
      const result = processHtml(input);
      
      expect(result.content).toBe(input);
      expect(result.converted).toBe(false);
    });
  });

  describe('複合的な処理', () => {
    it('複数のHTML要素を含む文書を処理する', () => {
      const input = `段落1の内容<br>続きの内容

<table><tr><td>データ</td></tr></table>

<ul><li>項目1</li><li>項目2</li></ul>`;
      const result = processHtml(input);
      
      const expected = `段落1の内容<br />続きの内容

<table><tr><td>データ</td></tr></table>

<ul><li>項目1</li><li>項目2</li></ul>`;
      expect(result.content).toBe(expected);
      expect(result.converted).toBe(true);
    });

    it('Markdown内のHTMLも正しく処理する', () => {
      const input = `# 見出し

通常のテキスト<br>
改行後のテキスト

- リスト項目1<br>改行
- リスト項目2

<table><tr><td>セル</td></tr></table>`;
      const result = processHtml(input);
      
      const expected = `# 見出し

通常のテキスト<br />
改行後のテキスト

- リスト項目1<br />改行
- リスト項目2

<table><tr><td>セル</td></tr></table>`;
      expect(result.content).toBe(expected);
      expect(result.converted).toBe(true);
    });
  });

  describe('エッジケース', () => {
    it('HTMLタグがない場合は内容を変更しない', () => {
      const input = '通常のMarkdownテキストです。**太字**や*斜体*を含みます。';
      const result = processHtml(input);
      
      expect(result.content).toBe(input);
      expect(result.converted).toBe(false);
      expect(result.imports).toHaveLength(0);
    });

    it('属性を持つタグも正しく処理する', () => {
      const input = '<table class="custom-table" id="data"><tr><td>データ</td></tr></table>';
      const result = processHtml(input);
      
      const expected = '<table class="custom-table" id="data"><tr><td>データ</td></tr></table>';
      expect(result.content).toBe(expected);
      expect(result.converted).toBe(false);
    });

    it('空のタグも正しく処理する', () => {
      const input = '<ul><li></li><li>内容あり</li></ul>';
      const result = processHtml(input);
      
      const expected = '<ul><li></li><li>内容あり</li></ul>';
      expect(result.content).toBe(expected);
      expect(result.converted).toBe(false);
    });

    it('エラーや警告がないことを確認', () => {
      const input = '<br>タグの変換';
      const result = processHtml(input);
      
      expect(result.errors).toHaveLength(0);
      expect(result.warnings).toHaveLength(0);
    });
  });

  describe('ネストした複雑なケース', () => {
    it('リスト内の<br>タグを適切に処理する', () => {
      const input = `* **手順1：**
  重要な操作を行います。<br>
  この操作は取り消せませんので注意してください。
* **手順2：**
  次の設定を確認します：<br>
  - 設定A: 有効<br>
  - 設定B: 無効
* **手順3：**
  最終確認を行い、<br>保存ボタンをクリックします。`;
      const result = processHtml(input);
      
      const expected = `* **手順1：**
  重要な操作を行います。<br />
  この操作は取り消せませんので注意してください。
* **手順2：**
  次の設定を確認します：<br />
  - 設定A: 有効<br />
  - 設定B: 無効
* **手順3：**
  最終確認を行い、<br />保存ボタンをクリックします。`;
      expect(result.content).toBe(expected);
      expect(result.converted).toBe(true);
    });

    it('番号付きリスト内の複雑なHTML構造を処理する', () => {
      const input = `1. データの準備
   
   テーブルを作成します：
   <table><tr><td>項目1</td><td>値1</td></tr><tr><td>項目2</td><td>値2</td></tr></table>
   
   注意：<br>テーブルのレイアウトを確認してください。

2. リストの作成

   以下のリストを参考にしてください：
   <ul><li>要素A<br>説明文A</li><li>要素B<br>説明文B</li></ul>

3. 最終確認<br>すべての項目をチェックしてください。`;
      const result = processHtml(input);
      
      const expected = `1. データの準備
   
   テーブルを作成します：
   <table><tr><td>項目1</td><td>値1</td></tr><tr><td>項目2</td><td>値2</td></tr></table>
   
   注意：<br />テーブルのレイアウトを確認してください。

2. リストの作成

   以下のリストを参考にしてください：
   <ul><li>要素A<br />説明文A</li><li>要素B<br />説明文B</li></ul>

3. 最終確認<br />すべての項目をチェックしてください。`;
      expect(result.content).toBe(expected);
      expect(result.converted).toBe(true);
    });

    it('引用ブロック内のHTML要素を処理する', () => {
      const input = `> **重要な情報**
> 
> 次の表を参照してください：
> <table><tr><th>項目</th><th>値</th></tr><tr><td>設定1</td><td>有効</td></tr></table>
> 
> 詳細な説明：<br>この設定は本番環境でのみ有効です。<br>テスト環境では無効になります。
> 
> 参考リスト：
> <ul><li>項目A</li><li>項目B<br>補足説明</li></ul>`;
      const result = processHtml(input);
      
      const expected = `> **重要な情報**
> 
> 次の表を参照してください：
> <table><tr><th>項目</th><th>値</th></tr><tr><td>設定1</td><td>有効</td></tr></table>
> 
> 詳細な説明：<br />この設定は本番環境でのみ有効です。<br />テスト環境では無効になります。
> 
> 参考リスト：
> <ul><li>項目A</li><li>項目B<br />補足説明</li></ul>`;
      expect(result.content).toBe(expected);
      expect(result.converted).toBe(true);
    });

    it('深くネストしたリスト内のHTML処理', () => {
      const input = `* レベル1
  1. レベル2
     * レベル3<br>詳細説明
       - レベル4
         <table><tr><td>ネストしたテーブル</td></tr></table>
         追加情報：<br>重要な注意事項
     * レベル3-2
       <ul><li>サブリスト1<br>説明</li><li>サブリスト2</li></ul>
  2. レベル2-2<br>説明文`;
      const result = processHtml(input);
      
      const expected = `* レベル1
  1. レベル2
     * レベル3<br />詳細説明
       - レベル4
         <table><tr><td>ネストしたテーブル</td></tr></table>
         追加情報：<br />重要な注意事項
     * レベル3-2
       <ul><li>サブリスト1<br />説明</li><li>サブリスト2</li></ul>
  2. レベル2-2<br />説明文`;
      expect(result.content).toBe(expected);
      expect(result.converted).toBe(true);
    });

    it('コードブロック内のHTMLタグは変換しない', () => {
      const input = `HTMLの例：

\`\`\`html
<div>
  <p>段落です<br>改行があります</p>
  <ul><li>リスト項目</li></ul>
</div>
\`\`\`

実際のHTML：<br>
<table><tr><td>実際のセル</td></tr></table>`;
      const result = processHtml(input);
      
      const expected = `HTMLの例：

\`\`\`html
<div>
  <p>段落です<br />改行があります</p>
  <ul><li>リスト項目</li></ul>
</div>
\`\`\`

実際のHTML：<br />
<table><tr><td>実際のセル</td></tr></table>`;
      expect(result.content).toBe(expected);
      expect(result.converted).toBe(true);
    });

    it('テーブル内の<br>タグを処理する', () => {
      const input = `| 項目 | 説明 | 備考 |
|------|------|------|
| 設定A | 基本設定です<br>重要な項目 | 必須 |
| 設定B | 詳細設定<br>オプション項目<br>上級者向け | 任意 |
| 設定C | 最終設定 | 必須<br>確認要 |`;
      const result = processHtml(input);
      
      const expected = `| 項目 | 説明 | 備考 |
|------|------|------|
| 設定A | 基本設定です<br />重要な項目 | 必須 |
| 設定B | 詳細設定<br />オプション項目<br />上級者向け | 任意 |
| 設定C | 最終設定 | 必須<br />確認要 |`;
      expect(result.content).toBe(expected);
      expect(result.converted).toBe(true);
    });

    it('混在するHTMLタグとMarkdown要素の処理', () => {
      const input = `## セクション見出し

**重要**：次の手順を実行してください<br>

1. **準備作業**
   * ファイルのバックアップ<br>重要なデータを保護
   * 設定の確認
     <table><tr><td>項目</td><td>現在値</td></tr><tr><td>状態</td><td>有効</td></tr></table>

2. **実行手順**
   > 注意：<br>この操作は元に戻せません
   > 
   > 詳細：
   > <ul><li>手順A<br>詳細説明A</li><li>手順B</li></ul>

3. **完了確認**<br>すべてが正常に動作することを確認`;
      const result = processHtml(input);
      
      const expected = `## セクション見出し

**重要**：次の手順を実行してください<br />

1. **準備作業**
   * ファイルのバックアップ<br />重要なデータを保護
   * 設定の確認
     <table><tr><td>項目</td><td>現在値</td></tr><tr><td>状態</td><td>有効</td></tr></table>

2. **実行手順**
   > 注意：<br />この操作は元に戻せません
   > 
   > 詳細：
   > <ul><li>手順A<br />詳細説明A</li><li>手順B</li></ul>

3. **完了確認**<br />すべてが正常に動作することを確認`;
      expect(result.content).toBe(expected);
      expect(result.converted).toBe(true);
    });
  });
});