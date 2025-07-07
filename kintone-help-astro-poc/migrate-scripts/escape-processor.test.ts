import { describe, it, expect } from "vitest";
import { processEscaping } from "./escape-processor.js";

describe("processEscaping", () => {
  describe("JSON様構造のエスケープ", () => {
    it("単純なオブジェクト記法をエスケープする", () => {
      const input = "設定例: {key: value}";
      const result = processEscaping(input);

      expect(result.content).toBe("設定例: &#123;key: value&#125;");
      expect(result.converted).toBe(true);
    });

    it("複数のキーを持つオブジェクトをエスケープする", () => {
      const input = 'オプション: {name: "test", value: 123, enabled: true}';
      const result = processEscaping(input);

      expect(result.content).toBe(
        'オプション: &#123;name: "test", value: 123, enabled: true&#125;',
      );
      expect(result.converted).toBe(true);
    });

    it("ネストされたオブジェクトをエスケープする", () => {
      const input = 'データ: {user: {name: "John", age: 30}}';
      const result = processEscaping(input);

      expect(result.content).toBe(
        'データ: &#123;user: &#123;name: "John", age: 30&#125;&#125;',
      );
      expect(result.converted).toBe(true);
    });

    it("配列を含むオブジェクトをエスケープする", () => {
      const input = "設定: {items: [1, 2, 3], enabled: true}";
      const result = processEscaping(input);

      expect(result.content).toBe(
        "設定: &#123;items: [1, 2, 3], enabled: true&#125;",
      );
      expect(result.converted).toBe(true);
    });

    it("改行を含むオブジェクトをエスケープする", () => {
      const input = `オブジェクト: {
  key1: "value1",
  key2: "value2"
}`;
      const result = processEscaping(input);

      // 複数行にまたがるオブジェクトは行ごとに処理されるため、変換されない
      expect(result.content).toBe(input);
      expect(result.converted).toBe(false);
    });
  });

  describe("JSXコンポーネントの除外", () => {
    it("Astroコンポーネントはエスケープしない", () => {
      const input = "<Kintone />と<Note>内容</Note>を含む文章";
      const result = processEscaping(input);

      expect(result.content).toBe(input);
      expect(result.converted).toBe(false);
    });

    it("属性付きコンポーネントもエスケープしない", () => {
      const input =
        '<Img src="/path/to/image.png" alt="画像" />と<Heading level={2}>見出し</Heading>';
      const result = processEscaping(input);

      expect(result.content).toBe(input);
      expect(result.converted).toBe(false);
    });

    it("配列属性を持つコンポーネントもエスケープしない", () => {
      const input = '<Enabled regions={["JP", "US"]}>コンテンツ</Enabled>';
      const result = processEscaping(input);

      expect(result.content).toBe(input);
      expect(result.converted).toBe(false);
    });

    it("HTML要素もエスケープしない", () => {
      const input = "<br />と<table><tr><td>セル</td></tr></table>";
      const result = processEscaping(input);

      expect(result.content).toBe(input);
      expect(result.converted).toBe(false);
    });
  });

  describe("import文の除外", () => {
    it("import文はエスケープしない", () => {
      const input = 'import Kintone from "@/components/Kintone.astro";';
      const result = processEscaping(input);

      expect(result.content).toBe(input);
      expect(result.converted).toBe(false);
    });

    it("複数のimport文を含む場合もエスケープしない", () => {
      const input = `import Kintone from "@/components/Kintone.astro";
import Note from "@/components/Note.astro";

文章の内容: {設定: "値"}`;
      const result = processEscaping(input);

      const expected = `import Kintone from "@/components/Kintone.astro";
import Note from "@/components/Note.astro";

文章の内容: &#123;設定: "値"&#125;`;
      expect(result.content).toBe(expected);
      expect(result.converted).toBe(true);
    });
  });

  describe("複合的なケース", () => {
    it("JSXとJSON様構造が混在する場合", () => {
      const input = `<Note>
JSONの例: {key: "value", number: 123}
</Note>

通常のテキスト内のオブジェクト: {設定: true}`;
      const result = processEscaping(input);

      const expected = `<Note>
JSONの例: &#123;key: "value", number: 123&#125;
</Note>

通常のテキスト内のオブジェクト: &#123;設定: true&#125;`;
      expect(result.content).toBe(expected);
      expect(result.converted).toBe(true);
    });

    it("コードブロック内のオブジェクトはエスケープする", () => {
      const input = `コード例:
\`\`\`javascript
const obj = {name: "test"};
\`\`\`

インライン: \`{key: value}\``;
      const result = processEscaping(input);

      const expected = `コード例:
\`\`\`javascript
const obj = &#123;name: "test"&#125;;
\`\`\`

インライン: \`&#123;key: value&#125;\``;
      expect(result.content).toBe(expected);
      expect(result.converted).toBe(true);
    });
  });

  describe("エッジケース", () => {
    it("空の中括弧はエスケープしない", () => {
      const input = "空のオブジェクト: {}";
      const result = processEscaping(input);

      expect(result.content).toBe(input);
      expect(result.converted).toBe(false);
    });

    it("単独の中括弧はエスケープしない", () => {
      const input = "開き括弧{と閉じ括弧}";
      const result = processEscaping(input);

      expect(result.content).toBe(input);
      expect(result.converted).toBe(false);
    });

    it("数式的な表現はエスケープしない", () => {
      const input = "計算式: a{1} + b{2} = c{3}";
      const result = processEscaping(input);

      expect(result.content).toBe(input);
      expect(result.converted).toBe(false);
    });

    it("URLパラメータはエスケープしない", () => {
      const input = "URL: https://example.com?param={value}";
      const result = processEscaping(input);

      expect(result.content).toBe(input);
      expect(result.converted).toBe(false);
    });

    it("複数のオブジェクトを一度にエスケープする", () => {
      const input = "設定1: {a: 1} と設定2: {b: 2} と設定3: {c: 3}";
      const result = processEscaping(input);

      const expected =
        "設定1: &#123;a: 1&#125; と設定2: &#123;b: 2&#125; と設定3: &#123;c: 3&#125;";
      expect(result.content).toBe(expected);
      expect(result.converted).toBe(true);
    });

    it("エラーや警告がないことを確認", () => {
      const input = '設定: {key: "value"}';
      const result = processEscaping(input);

      expect(result.errors).toHaveLength(0);
      expect(result.warnings).toHaveLength(0);
    });
  });

  describe("エスケープが不要なパターン", () => {
    it("通常のMarkdownテキストは変更しない", () => {
      const input = "# 見出し\n\n通常のテキストと**太字**と*斜体*";
      const result = processEscaping(input);

      expect(result.content).toBe(input);
      expect(result.converted).toBe(false);
    });

    it("数学記号は変更しない", () => {
      const input = "a < b, c > d, e <= f, g >= h";
      const result = processEscaping(input);

      expect(result.content).toBe(input);
      expect(result.converted).toBe(false);
    });

    it("リンクは変更しない", () => {
      const input = "[リンクテキスト](https://example.com)";
      const result = processEscaping(input);

      expect(result.content).toBe(input);
      expect(result.converted).toBe(false);
    });
  });

  describe("ネストした複雑なケース", () => {
    it("Astroコンポーネント内のJSON様構造をエスケープする", () => {
      const input = `<Note>
APIの戻り値例: {success: true, data: {id: 123, name: "テスト"}}
このオブジェクトの構造を確認してください。
</Note>`;
      const result = processEscaping(input);

      const expected = `<Note>
APIの戻り値例: &#123;success: true, data: &#123;id: 123, name: "テスト"&#125;&#125;
このオブジェクトの構造を確認してください。
</Note>`;
      expect(result.content).toBe(expected);
      expect(result.converted).toBe(true);
    });

    it("リスト内のJSON様構造をエスケープする", () => {
      const input = `* APIの設定方法：
  1. 設定オブジェクトを作成: {apiKey: "your-key", endpoint: "https://api.example.com"}
  2. リクエストオプション: {method: "POST", headers: {Authorization: "Bearer token"}}
     * レスポンス例: {status: "success", message: "データが正常に処理されました"}
     * エラー例: {status: "error", code: 400}`;
      const result = processEscaping(input);

      const expected = `* APIの設定方法：
  1. 設定オブジェクトを作成: &#123;apiKey: "your-key", endpoint: "https://api.example.com"&#125;
  2. リクエストオプション: &#123;method: "POST", headers: &#123;Authorization: "Bearer token"&#125;&#125;
     * レスポンス例: &#123;status: "success", message: "データが正常に処理されました"&#125;
     * エラー例: &#123;status: "error", code: 400&#125;`;
      expect(result.content).toBe(expected);
      expect(result.converted).toBe(true);
    });

    it("引用ブロック内のJSON様構造をエスケープする", () => {
      const input = `> 重要な設定情報
> 
> 基本設定: {database: "production", logging: true}
> 詳細設定: {cache: {enabled: true, ttl: 3600}, security: {ssl: true}}
> 
> この設定は本番環境で使用してください。`;
      const result = processEscaping(input);

      const expected = `> 重要な設定情報
> 
> 基本設定: &#123;database: "production", logging: true&#125;
> 詳細設定: &#123;cache: &#123;enabled: true, ttl: 3600&#125;, security: &#123;ssl: true&#125;&#125;
> 
> この設定は本番環境で使用してください。`;
      expect(result.content).toBe(expected);
      expect(result.converted).toBe(true);
    });

    it("テーブル内のJSON様構造をエスケープする", () => {
      const input = `| 項目 | 設定値 | 説明 |
|------|--------|------|
| 基本設定 | {host: "localhost", port: 3000} | サーバー設定 |
| DB設定 | {type: "mysql", credentials: {user: "admin"}} | データベース設定 |
| ログ設定 | {level: "info", format: "json"} | ログ出力設定 |`;
      const result = processEscaping(input);

      const expected = `| 項目 | 設定値 | 説明 |
|------|--------|------|
| 基本設定 | &#123;host: "localhost", port: 3000&#125; | サーバー設定 |
| DB設定 | &#123;type: "mysql", credentials: &#123;user: "admin"&#125;&#125; | データベース設定 |
| ログ設定 | &#123;level: "info", format: "json"&#125; | ログ出力設定 |`;
      expect(result.content).toBe(expected);
      expect(result.converted).toBe(true);
    });

    it("コードブロックとAstroコンポーネントが混在する複雑なケース", () => {
      const input = `<Warning>
次のコードスニペットを参考にしてください：

\`\`\`javascript
const config = {api: {baseUrl: "https://api.example.com"}};
\`\`\`

設定オブジェクト: {timeout: 5000, retries: 3}

<Hint>
エラーレスポンス: {error: {code: 500, message: "Internal Server Error"}}
</Hint>
</Warning>`;
      const result = processEscaping(input);

      const expected = `<Warning>
次のコードスニペットを参考にしてください：

\`\`\`javascript
const config = &#123;api: &#123;baseUrl: "https://api.example.com"&#125;&#125;;
\`\`\`

設定オブジェクト: &#123;timeout: 5000, retries: 3&#125;

<Hint>
エラーレスポンス: &#123;error: &#123;code: 500, message: "Internal Server Error"&#125;&#125;
</Hint>
</Warning>`;
      expect(result.content).toBe(expected);
      expect(result.converted).toBe(true);
    });

    it("深くネストしたリスト内でのJSON構造エスケープ", () => {
      const input = `* 設定手順
  1. 基本設定の作成
     * サーバー設定: {host: "localhost", port: 8080}
     * データベース設定
       * 接続情報: {host: "db.example.com", database: "myapp"}
       * 認証情報: {username: "dbuser", password: "secret"}
       * オプション: {pool: {min: 5, max: 20}, ssl: true}
  2. 詳細設定の確認
     * ログ設定: {file: "/var/log/app.log", level: "debug"}`;
      const result = processEscaping(input);

      const expected = `* 設定手順
  1. 基本設定の作成
     * サーバー設定: &#123;host: "localhost", port: 8080&#125;
     * データベース設定
       * 接続情報: &#123;host: "db.example.com", database: "myapp"&#125;
       * 認証情報: &#123;username: "dbuser", password: "secret"&#125;
       * オプション: &#123;pool: &#123;min: 5, max: 20&#125;, ssl: true&#125;
  2. 詳細設定の確認
     * ログ設定: &#123;file: "/var/log/app.log", level: "debug"&#125;`;
      expect(result.content).toBe(expected);
      expect(result.converted).toBe(true);
    });

    it("インラインコードとJSON構造が混在するケース", () => {
      const input = `設定は\`config.json\`ファイルで管理します。基本設定: {env: "production", debug: false}

メソッド\`getData()\`の戻り値: {result: {items: [1, 2, 3], total: 3}}

ファイル\`/etc/app/settings.conf\`に記述: {cache: {enabled: true}}`;
      const result = processEscaping(input);

      const expected = `設定は\`config.json\`ファイルで管理します。基本設定: &#123;env: "production", debug: false&#125;

メソッド\`getData()\`の戻り値: &#123;result: &#123;items: [1, 2, 3], total: 3&#125;&#125;

ファイル\`/etc/app/settings.conf\`に記述: &#123;cache: &#123;enabled: true&#125;&#125;`;
      expect(result.content).toBe(expected);
      expect(result.converted).toBe(true);
    });
  });
});
