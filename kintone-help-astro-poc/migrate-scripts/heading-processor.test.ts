import { describe, it, expect } from "vitest";
import { processHeadings } from "./heading-processor.js";

describe("processHeadings", () => {
  describe("カスタムID付き見出しの変換", () => {
    it("レベル2の見出しをHeadingコンポーネントに変換する（level属性なし）", () => {
      const input = "## アプリ{#start_whatskintone_10}";
      const result = processHeadings(input);

      expect(result.content).toBe(
        '<Heading id="start_whatskintone_10">アプリ</Heading>',
      );
      expect(result.imports).toContain(
        'import Heading from "@/components/Heading.astro";',
      );
      expect(result.converted).toBe(true);
    });

    it("レベル1の見出しをlevel属性付きで変換する", () => {
      const input = "# タイトル{#custom-id}";
      const result = processHeadings(input);

      expect(result.content).toBe(
        '<Heading level={1} id="custom-id">タイトル</Heading>',
      );
      expect(result.converted).toBe(true);
    });

    it("レベル3の見出しをlevel属性付きで変換する", () => {
      const input = "### サブセクション{#sub-section}";
      const result = processHeadings(input);

      expect(result.content).toBe(
        '<Heading level={3} id="sub-section">サブセクション</Heading>',
      );
      expect(result.converted).toBe(true);
    });

    it("レベル4の見出しをlevel属性付きで変換する", () => {
      const input = "#### 詳細{#detail}";
      const result = processHeadings(input);

      expect(result.content).toBe(
        '<Heading level={4} id="detail">詳細</Heading>',
      );
      expect(result.converted).toBe(true);
    });

    it("レベル5の見出しをlevel属性付きで変換する", () => {
      const input = "##### 小見出し{#small}";
      const result = processHeadings(input);

      expect(result.content).toBe(
        '<Heading level={5} id="small">小見出し</Heading>',
      );
      expect(result.converted).toBe(true);
    });

    it("レベル6の見出しをlevel属性付きで変換する", () => {
      const input = "###### 最小見出し{#tiny}";
      const result = processHeadings(input);

      expect(result.content).toBe(
        '<Heading level={6} id="tiny">最小見出し</Heading>',
      );
      expect(result.converted).toBe(true);
    });
  });

  describe("通常の見出し（カスタムIDなし）", () => {
    it("カスタムIDがない見出しは変換しない", () => {
      const input = "## 通常の見出し";
      const result = processHeadings(input);

      expect(result.content).toBe(input);
      expect(result.converted).toBe(false);
    });

    it("複数レベルの通常見出しを変換しない", () => {
      const input = `# 見出し1
## 見出し2
### 見出し3`;
      const result = processHeadings(input);

      expect(result.content).toBe(input);
      expect(result.converted).toBe(false);
    });
  });

  describe("複数の見出しの処理", () => {
    it("複数のカスタムID付き見出しを一度に変換する", () => {
      const input = `## アプリ{#start_whatskintone_10}

本文の内容

## スペース{#start_whatskintone_20}

別の本文`;
      const result = processHeadings(input);

      const expected = `<Heading id="start_whatskintone_10">アプリ</Heading>

本文の内容

<Heading id="start_whatskintone_20">スペース</Heading>

別の本文`;
      expect(result.content).toBe(expected);
      expect(result.converted).toBe(true);
    });

    it("異なるレベルの見出しを混在して変換する", () => {
      const input = `# メイン{#main}
## サブ{#sub}
### 詳細{#detail}
## 別のサブ`;
      const result = processHeadings(input);

      const expected = `<Heading level={1} id="main">メイン</Heading>
<Heading id="sub">サブ</Heading>
<Heading level={3} id="detail">詳細</Heading>
## 別のサブ`;
      expect(result.content).toBe(expected);
      expect(result.converted).toBe(true);
    });
  });

  describe("インポート文の生成", () => {
    it("Headingコンポーネントを使用した場合、インポート文を生成する", () => {
      const input = "## タイトル{#title}";
      const result = processHeadings(input);

      expect(result.imports).toContain(
        'import Heading from "@/components/Heading.astro";',
      );
    });

    it("見出しがない場合、インポート文を生成しない", () => {
      const input = "通常のテキスト";
      const result = processHeadings(input);

      expect(result.imports).toHaveLength(0);
      expect(result.converted).toBe(false);
    });

    it("通常の見出しのみの場合、インポート文を生成しない", () => {
      const input = "## 通常の見出し";
      const result = processHeadings(input);

      expect(result.imports).toHaveLength(0);
      expect(result.converted).toBe(false);
    });
  });

  describe("エッジケース", () => {
    it("見出し内に中括弧がある場合も正しく処理する", () => {
      const input = "## オブジェクト{key: value}の説明{#object}";
      const result = processHeadings(input);

      expect(result.content).toBe(
        '<Heading id="object">オブジェクト{key: value}の説明</Heading>',
      );
      expect(result.converted).toBe(true);
    });

    it("見出しの前後の空白を保持する", () => {
      const input = "##   スペース付き見出し   {#spaced}";
      const result = processHeadings(input);

      expect(result.content).toBe(
        '<Heading id="spaced">スペース付き見出し</Heading>',
      );
      expect(result.converted).toBe(true);
    });

    it("エラーや警告がないことを確認", () => {
      const input = "## タイトル{#test}";
      const result = processHeadings(input);

      expect(result.errors).toHaveLength(0);
      expect(result.warnings).toHaveLength(0);
    });
  });
});
