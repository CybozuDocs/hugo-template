import { describe, it, expect } from "vitest";
import { processImages } from "./image-processor.js";
import type { PathReplacement } from "./types.js";

describe("processImages", () => {
  describe("基本的な画像変換", () => {
    it("シンプルな画像をImgコンポーネントに変換する", () => {
      const input =
        "![スクリーンショット：ログイン画面](/k/img-ja/to_be_invited_03.png)";
      const pathReplacement: PathReplacement = {
        from: "/k/",
        to: "/k/kintone/",
      };
      const result = processImages(input, pathReplacement);

      expect(result.content).toBe(
        '<Img src="/k/kintone/img-ja/to_be_invited_03.png" alt="スクリーンショット：ログイン画面" />',
      );
      expect(result.imports).toContain(
        'import Img from "@/components/Img.astro";',
      );
      expect(result.converted).toBe(true);
    });

    it("タイトル属性付き画像を変換する", () => {
      const input = '![代替テキスト](/k/img-ja/sample.png "タイトル")';
      const pathReplacement: PathReplacement = {
        from: "/k/",
        to: "/k/kintone/",
      };
      const result = processImages(input, pathReplacement);

      expect(result.content).toBe(
        '<Img src="/k/kintone/img-ja/sample.png" alt="代替テキスト" title="タイトル" />',
      );
      expect(result.converted).toBe(true);
    });

    it("空のalt属性を持つ画像を変換する", () => {
      const input = "![](/k/img-ja/sample.png)";
      const pathReplacement: PathReplacement = {
        from: "/k/",
        to: "/k/kintone/",
      };
      const result = processImages(input, pathReplacement);

      expect(result.content).toBe(
        '<Img src="/k/kintone/img-ja/sample.png" alt="" />',
      );
      expect(result.converted).toBe(true);
    });
  });

  describe("リスト内の画像処理", () => {
    it("番号付きリスト内の画像を適切にインデントする", () => {
      const input = `1. 試用を申し込んだサービスの初期パスワードを設定します。  
  ![スクリーンショット：［初期パスワードの設定］画面](/k/img-ja/login_started_02.png)`;
      const pathReplacement: PathReplacement = {
        from: "/k/",
        to: "/k/kintone/",
      };
      const result = processImages(input, pathReplacement);

      const expected = `1. 試用を申し込んだサービスの初期パスワードを設定します。  
  <Img src="/k/kintone/img-ja/login_started_02.png" alt="スクリーンショット：［初期パスワードの設定］画面" />`;
      expect(result.content).toBe(expected);
    });

    it("箇条書きリスト内の画像を適切にインデントする", () => {
      const input = `- アイテム1  
  ![画像](/k/img-ja/sample.png)`;
      const pathReplacement: PathReplacement = {
        from: "/k/",
        to: "/k/kintone/",
      };
      const result = processImages(input, pathReplacement);

      const expected = `- アイテム1  
  <Img src="/k/kintone/img-ja/sample.png" alt="画像" />`;
      expect(result.content).toBe(expected);
    });
  });

  describe("パス変換", () => {
    it("指定されたパスプレフィックスを変換する", () => {
      const input = "![画像](/k/img-ja/sample.png)";
      const pathReplacement: PathReplacement = {
        from: "/k/",
        to: "/k/kintone/",
      };
      const result = processImages(input, pathReplacement);

      expect(result.content).toBe(
        '<Img src="/k/kintone/img-ja/sample.png" alt="画像" />',
      );
    });

    it("パスプレフィックスが一致しない場合は変換しない", () => {
      const input = "![画像](/other/img-ja/sample.png)";
      const pathReplacement: PathReplacement = {
        from: "/k/",
        to: "/k/kintone/",
      };
      const result = processImages(input, pathReplacement);

      expect(result.content).toBe(
        '<Img src="/other/img-ja/sample.png" alt="画像" />',
      );
    });

    it("パス変換なしでも正常に動作する", () => {
      const input = "![画像](/k/img-ja/sample.png)";
      const result = processImages(input);

      expect(result.content).toBe(
        '<Img src="/k/img-ja/sample.png" alt="画像" />',
      );
    });
  });

  describe("複数画像の処理", () => {
    it("複数の画像を一度に変換する", () => {
      const input = `段落1の内容
![画像1](/k/img-ja/sample1.png)

段落2の内容  
![画像2](/k/img-ja/sample2.png "タイトル")

段落3の内容`;
      const pathReplacement: PathReplacement = {
        from: "/k/",
        to: "/k/kintone/",
      };
      const result = processImages(input, pathReplacement);

      const expected = `段落1の内容
<Img src="/k/kintone/img-ja/sample1.png" alt="画像1" />

段落2の内容  
<Img src="/k/kintone/img-ja/sample2.png" alt="画像2" title="タイトル" />

段落3の内容`;
      expect(result.content).toBe(expected);
      expect(result.imports).toHaveLength(1);
      expect(result.imports[0]).toBe(
        'import Img from "@/components/Img.astro";',
      );
    });
  });

  describe("エッジケース", () => {
    it("画像がない場合は内容を変更しない", () => {
      const input =
        "通常のテキストです。[リンク](https://example.com)もあります。";
      const result = processImages(input);

      expect(result.content).toBe(input);
      expect(result.converted).toBe(false);
      expect(result.imports).toHaveLength(0);
    });

    it("画像内に特殊なパターンがある場合でも正しく処理する", () => {
      const input = "![画像 [内部] (テキスト)](/k/img-ja/sample.png)";
      const pathReplacement: PathReplacement = {
        from: "/k/",
        to: "/k/kintone/",
      };
      const result = processImages(input, pathReplacement);

      expect(result.content).toBe(
        '<Img src="/k/kintone/img-ja/sample.png" alt="画像 [内部] (テキスト)" />',
      );
    });

    it("エラーや警告がないことを確認", () => {
      const input = "![テスト画像](/k/img-ja/test.png)";
      const result = processImages(input);

      expect(result.errors).toHaveLength(0);
      expect(result.warnings).toHaveLength(0);
    });
  });

  describe("ネストした複雑なケース", () => {
    it("箇条書きリスト内の画像インデントを適切に処理する", () => {
      const input = `* **登録済みの社員情報を一覧表示するには：**  
  パンくずリストまたは画面左上のアプリ名をクリックすると、手順2の画面に戻り、レコード（社員情報）の一覧が表示されます。
  ![スクリーンショット：パンくずリストとアプリ名が枠線で強調された［レコードの詳細］画面](/k/img-ja/add_record_app_img04.png)
* **レコード一覧から各社員情報の詳細を確認するには：**  
  レコードの一覧画面で、各レコードの左側にあるアイコンをクリックすると、レコードの詳細内容を表示できます。
  ![スクリーンショット：［レコードの詳細を表示する］アイコンが枠線で強調された［レコードの一覧］画面](/k/img-ja/add_record_app_img05.png)`;
      const pathReplacement: PathReplacement = {
        from: "/k/",
        to: "/k/kintone/",
      };
      const result = processImages(input, pathReplacement);

      const expected = `* **登録済みの社員情報を一覧表示するには：**  
  パンくずリストまたは画面左上のアプリ名をクリックすると、手順2の画面に戻り、レコード（社員情報）の一覧が表示されます。
  <Img src="/k/kintone/img-ja/add_record_app_img04.png" alt="スクリーンショット：パンくずリストとアプリ名が枠線で強調された［レコードの詳細］画面" />
* **レコード一覧から各社員情報の詳細を確認するには：**  
  レコードの一覧画面で、各レコードの左側にあるアイコンをクリックすると、レコードの詳細内容を表示できます。
  <Img src="/k/kintone/img-ja/add_record_app_img05.png" alt="スクリーンショット：［レコードの詳細を表示する］アイコンが枠線で強調された［レコードの一覧］画面" />`;
      expect(result.content).toBe(expected);
      expect(result.imports).toContain(
        'import Img from "@/components/Img.astro";',
      );
      expect(result.converted).toBe(true);
    });

    it("番号付きリスト内の複数インデントレベルでの画像処理", () => {
      const input = `1. 手順4～6を繰り返し、次のフィールドをドラッグアンドドロップで配置してフィールド名を設定します。また、必要に応じて各フィールドの位置をドラッグアンドドロップで調整します。  

   * 数値フィールド：  
     フィールド名を「社員番号」に設定します。
   * 日付フィールド：  
     フィールド名を「入社年月日」に設定します。
   * 文字列（複数行）フィールド：  
     フィールド名を「住所」に設定します。

   次のような画面ができたら、入力欄の配置は完了です。
   ![スクリーンショット：入力欄の配置が完了した［アプリの設定］画面](/k/img-ja/add_employee_app_img09.png)`;
      const pathReplacement: PathReplacement = {
        from: "/k/",
        to: "/k/kintone/",
      };
      const result = processImages(input, pathReplacement);

      const expected = `1. 手順4～6を繰り返し、次のフィールドをドラッグアンドドロップで配置してフィールド名を設定します。また、必要に応じて各フィールドの位置をドラッグアンドドロップで調整します。  

   * 数値フィールド：  
     フィールド名を「社員番号」に設定します。
   * 日付フィールド：  
     フィールド名を「入社年月日」に設定します。
   * 文字列（複数行）フィールド：  
     フィールド名を「住所」に設定します。

   次のような画面ができたら、入力欄の配置は完了です。
   <Img src="/k/kintone/img-ja/add_employee_app_img09.png" alt="スクリーンショット：入力欄の配置が完了した［アプリの設定］画面" />`;
      expect(result.content).toBe(expected);
      expect(result.imports).toContain(
        'import Img from "@/components/Img.astro";',
      );
      expect(result.converted).toBe(true);
    });

    it("深くネストしたリスト構造内の画像インデント処理", () => {
      const input = `* アプリ作成の手順
  1. アプリを作成します
     * フィールドを配置します
       ![画像：フィールド配置画面](/k/img-ja/field_setup.png)
     * 設定を保存します
       * 設定の確認
         ![画像：設定確認画面](/k/img-ja/config_confirm.png)
       * 最終チェック
  2. アプリを公開します`;
      const pathReplacement: PathReplacement = {
        from: "/k/",
        to: "/k/kintone/",
      };
      const result = processImages(input, pathReplacement);

      const expected = `* アプリ作成の手順
  1. アプリを作成します
     * フィールドを配置します
       <Img src="/k/kintone/img-ja/field_setup.png" alt="画像：フィールド配置画面" />
     * 設定を保存します
       * 設定の確認
         <Img src="/k/kintone/img-ja/config_confirm.png" alt="画像：設定確認画面" />
       * 最終チェック
  2. アプリを公開します`;
      expect(result.content).toBe(expected);
      expect(result.imports).toContain(
        'import Img from "@/components/Img.astro";',
      );
      expect(result.converted).toBe(true);
    });

    it("リスト内でのtitle属性付き画像の処理", () => {
      const input = `* 手順の説明：
  1. ログイン画面を開きます
     ![ログイン画面のスクリーンショット](/k/img-ja/login_screen.png "ログイン画面")
  2. ユーザー情報を入力します
     * ユーザー名の入力
       ![ユーザー名入力欄](/k/img-ja/username_field.png "ユーザー名を入力")
     * パスワードの入力
       ![パスワード入力欄](/k/img-ja/password_field.png "パスワードを入力")`;
      const pathReplacement: PathReplacement = {
        from: "/k/",
        to: "/k/kintone/",
      };
      const result = processImages(input, pathReplacement);

      const expected = `* 手順の説明：
  1. ログイン画面を開きます
     <Img src="/k/kintone/img-ja/login_screen.png" alt="ログイン画面のスクリーンショット" title="ログイン画面" />
  2. ユーザー情報を入力します
     * ユーザー名の入力
       <Img src="/k/kintone/img-ja/username_field.png" alt="ユーザー名入力欄" title="ユーザー名を入力" />
     * パスワードの入力
       <Img src="/k/kintone/img-ja/password_field.png" alt="パスワード入力欄" title="パスワードを入力" />`;
      expect(result.content).toBe(expected);
      expect(result.imports).toContain(
        'import Img from "@/components/Img.astro";',
      );
      expect(result.converted).toBe(true);
    });

    it("混在するインデントスタイル（スペースとタブ）での画像処理", () => {
      const input = `* メインの手順
\t1. サブステップ1
\t   ![画像1](/k/img-ja/step1.png)
  2. サブステップ2（スペースインデント）
     ![画像2](/k/img-ja/step2.png)
\t\t* さらに深いレベル
\t\t  ![画像3](/k/img-ja/step3.png)`;
      const pathReplacement: PathReplacement = {
        from: "/k/",
        to: "/k/kintone/",
      };
      const result = processImages(input, pathReplacement);

      const expected = `* メインの手順
\t1. サブステップ1
\t   <Img src="/k/kintone/img-ja/step1.png" alt="画像1" />
  2. サブステップ2（スペースインデント）
     <Img src="/k/kintone/img-ja/step2.png" alt="画像2" />
\t\t* さらに深いレベル
\t\t  <Img src="/k/kintone/img-ja/step3.png" alt="画像3" />`;
      expect(result.content).toBe(expected);
      expect(result.imports).toContain(
        'import Img from "@/components/Img.astro";',
      );
      expect(result.converted).toBe(true);
    });

    it("引用ブロック内の画像処理", () => {
      const input = `> 重要な注意事項：
> 
> 次の画面が表示されたら、設定を確認してください：
> ![設定確認画面](/k/img-ja/config_check.png)
> 
> 間違いがあれば修正してください。`;
      const pathReplacement: PathReplacement = {
        from: "/k/",
        to: "/k/kintone/",
      };
      const result = processImages(input, pathReplacement);

      const expected = `> 重要な注意事項：
> 
> 次の画面が表示されたら、設定を確認してください：
> <Img src="/k/kintone/img-ja/config_check.png" alt="設定確認画面" />
> 
> 間違いがあれば修正してください。`;
      expect(result.content).toBe(expected);
      expect(result.imports).toContain(
        'import Img from "@/components/Img.astro";',
      );
      expect(result.converted).toBe(true);
    });
  });
});
