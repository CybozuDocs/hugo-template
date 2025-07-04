import { describe, it, expect } from 'vitest';
import { processShortcodes } from './shortcode-processor.js';

describe('processShortcodes', () => {
  describe('Simple型ショートコード', () => {
    it('{{< kintone >}}を<Kintone />に変換する', () => {
      const input = '{{< kintone >}}には30日間の無料お試し期間があります。';
      const result = processShortcodes(input);
      
      expect(result.content).toBe('<Kintone />には30日間の無料お試し期間があります。');
      expect(result.imports).toContain('import Kintone from "@/components/Kintone.astro";');
      expect(result.converted).toBe(true);
    });

    it('{{< slash >}}を<Slash />に変換する', () => {
      const input = '{{< slash >}}はクラウドサービスです。';
      const result = processShortcodes(input);
      
      expect(result.content).toBe('<Slash />はクラウドサービスです。');
      expect(result.imports).toContain('import Slash from "@/components/Slash.astro";');
    });

    it('{{< slash_ui >}}を<SlashUi />に変換する', () => {
      const input = '{{< slash_ui >}}の画面です。';
      const result = processShortcodes(input);
      
      expect(result.content).toBe('<SlashUi />の画面です。');
      expect(result.imports).toContain('import SlashUi from "@/components/SlashUi.astro";');
    });
  });

  describe('Content型ショートコード', () => {
    it('{{< note >}}...{{< /note >}}をNoteコンポーネントに変換する', () => {
      const input = `{{< note >}}
ログイン名の初期設定は、お試しを申し込む際に登録したメールアドレスに統一されています。
{{< /note >}}`;
      const result = processShortcodes(input);
      
      const expected = `<Note>
ログイン名の初期設定は、お試しを申し込む際に登録したメールアドレスに統一されています。
</Note>`;
      expect(result.content).toBe(expected);
      expect(result.imports).toContain('import Note from "@/components/Note.astro";');
    });

    it('{{< hint >}}...{{< /hint >}}をHintコンポーネントに変換する', () => {
      const input = `{{< hint >}}
ヒントの内容です。
{{< /hint >}}`;
      const result = processShortcodes(input);
      
      const expected = `<Hint>
ヒントの内容です。
</Hint>`;
      expect(result.content).toBe(expected);
      expect(result.imports).toContain('import Hint from "@/components/Hint.astro";');
    });

    it('{{< warning >}}...{{< /warning >}}をWarningコンポーネントに変換する', () => {
      const input = `{{< warning >}}
警告メッセージです。
{{< /warning >}}`;
      const result = processShortcodes(input);
      
      const expected = `<Warning>
警告メッセージです。
</Warning>`;
      expect(result.content).toBe(expected);
      expect(result.imports).toContain('import Warning from "@/components/Warning.astro";');
    });

    it('{{< reference >}}...{{< /reference >}}をReferenceコンポーネントに変換する', () => {
      const input = `{{< reference >}}
[ログインに関するトラブル](/general/ja/id/020262.html)
{{< /reference >}}`;
      const result = processShortcodes(input);
      
      const expected = `<Reference>
[ログインに関するトラブル](/general/ja/id/020262.html)
</Reference>`;
      expect(result.content).toBe(expected);
      expect(result.imports).toContain('import Reference from "@/components/Reference.astro";');
    });
  });

  describe('Attributes型ショートコード（regions）', () => {
    it('{{< enabled JP >}}を配列形式のregions属性に変換する', () => {
      const input = `{{< enabled JP >}}
{{< kintone >}}（キントーン）は、開発の知識がなくても自社の業務に合わせたシステムをかんたんに作成できる、サイボウズのクラウドサービスです。
{{< /enabled >}}`;
      const result = processShortcodes(input);
      
      const expected = `<Enabled regions={["JP"]}>
<Kintone />（キントーン）は、開発の知識がなくても自社の業務に合わせたシステムをかんたんに作成できる、サイボウズのクラウドサービスです。
</Enabled>`;
      expect(result.content).toBe(expected);
      expect(result.imports).toContain('import Enabled from "@/components/Enabled.astro";');
      expect(result.imports).toContain('import Kintone from "@/components/Kintone.astro";');
    });

    it('{{< enabled JP US >}}を複数要素の配列に変換する', () => {
      const input = `{{< enabled JP US >}}
コンテンツ
{{< /enabled >}}`;
      const result = processShortcodes(input);
      
      const expected = `<Enabled regions={["JP", "US"]}>
コンテンツ
</Enabled>`;
      expect(result.content).toBe(expected);
    });

    it('{{< enabled CN >}}を配列形式のregions属性に変換する', () => {
      const input = `{{< enabled CN >}}
コンテンツ
{{< /enabled >}}`;
      const result = processShortcodes(input);
      
      const expected = `<Enabled regions={["CN"]}>
コンテンツ
</Enabled>`;
      expect(result.content).toBe(expected);
      expect(result.imports).toContain('import Enabled from "@/components/Enabled.astro";');
    });
  });

  describe('複合的な変換', () => {
    it('複数種類のショートコードを一度に変換する', () => {
      const input = `{{< kintone >}}の説明です。

{{< note >}}
重要な注意事項
{{< /note >}}

{{< enabled JP >}}
日本限定のコンテンツ
{{< /enabled >}}`;
      const result = processShortcodes(input);
      
      const expected = `<Kintone />の説明です。

<Note>
重要な注意事項

</Note>

<Enabled regions={["JP"]}>
日本限定のコンテンツ

</Enabled>`;
      expect(result.content).toBe(expected);
      expect(result.imports).toContain('import Kintone from "@/components/Kintone.astro";');
      expect(result.imports).toContain('import Note from "@/components/Note.astro";');
      expect(result.imports).toContain('import Enabled from "@/components/Enabled.astro";');
    });

    it('ネストされたショートコードを処理する', () => {
      const input = `{{< note >}}
{{< kintone >}}の使い方について説明します。
{{< /note >}}`;
      const result = processShortcodes(input);
      
      const expected = `<Note>
<Kintone />の使い方について説明します。
</Note>`;
      expect(result.content).toBe(expected);
      expect(result.imports).toContain('import Note from "@/components/Note.astro";');
      expect(result.imports).toContain('import Kintone from "@/components/Kintone.astro";');
    });
  });

  describe('エッジケース', () => {
    it('ショートコードがない場合は内容を変更しない', () => {
      const input = '通常のMarkdownテキストです。**太字**や*斜体*を含みます。';
      const result = processShortcodes(input);
      
      expect(result.content).toBe(input);
      expect(result.converted).toBe(false);
      expect(result.imports).toHaveLength(0);
    });

    it('重複するコンポーネントのインポートは1つにする', () => {
      const input = `{{< kintone >}}と{{< kintone >}}と{{< kintone >}}`;
      const result = processShortcodes(input);
      
      const kintoneImports = result.imports.filter(imp => imp.includes('Kintone'));
      expect(kintoneImports).toHaveLength(1);
    });

    it('エラーや警告がないことを確認', () => {
      const input = '{{< kintone >}}の内容';
      const result = processShortcodes(input);
      
      expect(result.errors).toHaveLength(0);
      expect(result.warnings).toHaveLength(0);
    });
  });

  describe('ネストした複雑なケース', () => {
    it('wv_brk内にテキストが含まれるパターンを処理する', () => {
      const input = '{{< wv_brk >}}［レコードの一覧］{{< /wv_brk >}}画面で、レコードの編集や削除ができます。';
      const result = processShortcodes(input);
      
      const expected = '<Wovn>［レコードの一覧］</Wovn>画面で、レコードの編集や削除ができます。';
      expect(result.content).toBe(expected);
      expect(result.imports).toContain('import Wovn from "@/components/Wovn.astro";');
      expect(result.converted).toBe(true);
    });

    it('enabled2内にhintが含まれるパターンを処理する', () => {
      const input = `{{< enabled2 JP >}}

{{< hint >}}

ルックアップフィールドを初めて使用される方向けに、サンプルアプリを操作しながら学べるガイドブックがあります。
詳細は、次のページを参照してください。

{{< /hint >}}

{{< /enabled2 >}}`;
      const result = processShortcodes(input);
      
      const expected = `<Enabled regions={["JP"]}>

<Hint>

ルックアップフィールドを初めて使用される方向けに、サンプルアプリを操作しながら学べるガイドブックがあります。
詳細は、次のページを参照してください。

</Hint>
</Enabled>`;
      expect(result.content).toBe(expected);
      expect(result.imports).toContain('import Enabled from "@/components/Enabled.astro";');
      expect(result.imports).toContain('import Hint from "@/components/Hint.astro";');
      expect(result.converted).toBe(true);
    });

    it('note内にwv_brkとリストが含まれるパターンを処理する', () => {
      const input = `{{< note >}}

{{< wv_brk >}}［オプション］{{< /wv_brk >}}アイコンに{{< wv_brk >}}［一括削除］{{< /wv_brk >}}が表示されない場合は、以下の原因が考えられます。

* アプリのアクセス権の設定で{{< wv_brk >}}［アプリ管理］{{< /wv_brk >}}および{{< wv_brk >}}［レコード削除］{{< /wv_brk >}}にチェックが入っていない。
* 一括削除機能が有効になっていない。

{{< /note >}}`;
      const result = processShortcodes(input);
      
      const expected = `<Note>

<Wovn>［オプション］</Wovn>アイコンに<Wovn>［一括削除］</Wovn>が表示されない場合は、以下の原因が考えられます。

* アプリのアクセス権の設定で<Wovn>［アプリ管理］</Wovn>および<Wovn>［レコード削除］</Wovn>にチェックが入っていない。
* 一括削除機能が有効になっていない。
</Note>`;
      expect(result.content).toBe(expected);
      expect(result.imports).toContain('import Note from "@/components/Note.astro";');
      expect(result.imports).toContain('import Wovn from "@/components/Wovn.astro";');
      expect(result.converted).toBe(true);
    });

    it('hint内にenabled2が含まれるパターンを処理する', () => {
      const input = `{{< hint >}}

* 計算結果が数値になる場合に計算フィールドを利用します。
* 計算結果が文字列になる場合は、文字列（1行）フィールドに計算式を設定します。

{{< enabled2 JP >}}

* 計算フィールドを初めて使用される方向けに、サンプルアプリを操作しながら学べるガイドブックがあります。

{{< /enabled2 >}}

{{< /hint >}}`;
      const result = processShortcodes(input);
      
      const expected = `<Hint>

* 計算結果が数値になる場合に計算フィールドを利用します。
* 計算結果が文字列になる場合は、文字列（1行）フィールドに計算式を設定します。

<Enabled regions={["JP"]}>

* 計算フィールドを初めて使用される方向けに、サンプルアプリを操作しながら学べるガイドブックがあります。

</Enabled>
</Hint>`;
      expect(result.content).toBe(expected);
      expect(result.imports).toContain('import Hint from "@/components/Hint.astro";');
      expect(result.imports).toContain('import Enabled from "@/components/Enabled.astro";');
      expect(result.converted).toBe(true);
    });

    it('warning内にリストが含まれるパターンを処理する', () => {
      const input = `{{< warning >}}

* テーブルは、すでにあるテーブルやグループフィールド内には配置できません。
* 次のフィールドは、テーブル内に配置できません。
  * すでに使用中のフィールド
  * ラベル、関連レコード一覧、スペース、罫線、グループ、テーブル、レコード番号、作成者、更新者、作成日時、更新日時
* テーブル内のフィールドでは、使用できない機能や操作があります（例：ルックアップ、関連レコード一覧、フィールドのアクセス権など）。

{{< /warning >}}`;
      const result = processShortcodes(input);
      
      const expected = `<Warning>

* テーブルは、すでにあるテーブルやグループフィールド内には配置できません。
* 次のフィールドは、テーブル内に配置できません。
  * すでに使用中のフィールド
  * ラベル、関連レコード一覧、スペース、罫線、グループ、テーブル、レコード番号、作成者、更新者、作成日時、更新日時
* テーブル内のフィールドでは、使用できない機能や操作があります（例：ルックアップ、関連レコード一覧、フィールドのアクセス権など）。
</Warning>`;
      expect(result.content).toBe(expected);
      expect(result.imports).toContain('import Warning from "@/components/Warning.astro";');
      expect(result.converted).toBe(true);
    });

    it('複数のwv_brkが連続するパターンを処理する', () => {
      const input = 'アプリはポータルのお知らせ掲示板や、スペースのお知らせ（スペースの本文）、スレッドの本文に貼り付けることができます。{{< wv_brk >}}{{< /wv_brk >}}{{< wv_brk >}}{{< /wv_brk >}}  \n貼り付けられたアプリのレコード一覧からも、{{< wv_brk >}}［レコードの一覧］{{< /wv_brk >}}画面と同様の手順で、レコードの編集や削除ができます。';
      const result = processShortcodes(input);
      
      const expected = 'アプリはポータルのお知らせ掲示板や、スペースのお知らせ（スペースの本文）、スレッドの本文に貼り付けることができます。<Wovn></Wovn><Wovn></Wovn>  \n貼り付けられたアプリのレコード一覧からも、<Wovn>［レコードの一覧］</Wovn>画面と同様の手順で、レコードの編集や削除ができます。';
      expect(result.content).toBe(expected);
      expect(result.imports).toContain('import Wovn from "@/components/Wovn.astro";');
      expect(result.converted).toBe(true);
    });
  });
});