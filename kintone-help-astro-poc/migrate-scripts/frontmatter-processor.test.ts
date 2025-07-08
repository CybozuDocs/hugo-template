import { describe, it, expect } from "vitest";
import {
  parseFrontMatter,
  processFrontMatter,
  stringifyFrontMatter,
} from "./frontmatter-processor.js";

describe("processFrontMatter", () => {
  describe("基本的なフロントマター処理", () => {
    it("通常のファイルにPageLayoutを追加する", () => {
      const input = `---
title: "無料お試しを申し込み後にログインする"
weight: 200
---

コンテンツ`;
      const parsed = parseFrontMatter(input);
      const isIndexFile =
        "normal-file.md".endsWith("_index.md") ||
        "normal-file.md".endsWith("index.md");
      const processed = processFrontMatter(parsed.frontmatter, isIndexFile);
      const result = stringifyFrontMatter(processed, parsed.content);

      const expected = `---
title: "無料お試しを申し込み後にログインする"
weight: 200
layout: "@/layouts/PageLayout.astro"
---

コンテンツ`;
      expect(result).toBe(expected);
    });

    it("_index.mdファイルにSectionLayoutを追加する", () => {
      const input = `---
title: "スタートガイド"
weight: 100
---

コンテンツ`;
      const parsed = parseFrontMatter(input);
      const isIndexFile =
        "_index.md".endsWith("_index.md") || "_index.md".endsWith("index.md");
      const processed = processFrontMatter(parsed.frontmatter, isIndexFile);
      const result = stringifyFrontMatter(processed, parsed.content);

      const expected = `---
title: "スタートガイド"
weight: 100
layout: "@/layouts/SectionLayout.astro"
---

コンテンツ`;
      expect(result).toBe(expected);
    });

    it("index.mdファイルにSectionLayoutを追加する", () => {
      const input = `---
title: "インデックスページ"
weight: 100
---

コンテンツ`;
      const parsed = parseFrontMatter(input);
      const isIndexFile =
        "some/path/index.md".endsWith("_index.md") ||
        "some/path/index.md".endsWith("index.md");
      const processed = processFrontMatter(parsed.frontmatter, isIndexFile);
      const result = stringifyFrontMatter(processed, parsed.content);

      const expected = `---
title: "インデックスページ"
weight: 100
layout: "@/layouts/SectionLayout.astro"
---

コンテンツ`;
      expect(result).toBe(expected);
    });
  });

  describe("配列フィールドの正規化", () => {
    it("文字列のaliasesを配列に変換する", () => {
      const input = `---
title: "タイトル"
aliases: /ja/id/040141
---

コンテンツ`;
      const parsed = parseFrontMatter(input);
      const isIndexFile =
        "file.md".endsWith("_index.md") || "file.md".endsWith("index.md");
      const processed = processFrontMatter(parsed.frontmatter, isIndexFile);
      const result = stringifyFrontMatter(processed, parsed.content);

      const expected = `---
title: "タイトル"
aliases:
  - "/ja/id/040141"
layout: "@/layouts/PageLayout.astro"
---

コンテンツ`;
      expect(result).toBe(expected);
    });

    it("配列のaliasesはそのまま保持する", () => {
      const input = `---
title: "タイトル"
aliases:
  - "/ja/id/040141"
  - "/ja/id/040142"
---

コンテンツ`;
      const parsed = parseFrontMatter(input);
      const isIndexFile =
        "file.md".endsWith("_index.md") || "file.md".endsWith("index.md");
      const processed = processFrontMatter(parsed.frontmatter, isIndexFile);
      const result = stringifyFrontMatter(processed, parsed.content);

      const expected = `---
title: "タイトル"
aliases:
  - "/ja/id/040141"
  - "/ja/id/040142"
layout: "@/layouts/PageLayout.astro"
---

コンテンツ`;
      expect(result).toBe(expected);
    });

    it("disabledフィールドを配列に変換する", () => {
      const input = `---
title: "タイトル"
disabled: [US,CN]
---

コンテンツ`;
      const parsed = parseFrontMatter(input);
      const isIndexFile =
        "file.md".endsWith("_index.md") || "file.md".endsWith("index.md");
      const processed = processFrontMatter(parsed.frontmatter, isIndexFile);
      const result = stringifyFrontMatter(processed, parsed.content);

      const expected = `---
title: "タイトル"
disabled: "[US,CN]"
layout: "@/layouts/PageLayout.astro"
---

コンテンツ`;
      expect(result).toBe(expected);
    });

    it("enabledフィールドを配列に変換する", () => {
      const input = `---
title: "タイトル"
enabled: [JP,US]
---

コンテンツ`;
      const parsed = parseFrontMatter(input);
      const isIndexFile =
        "file.md".endsWith("_index.md") || "file.md".endsWith("index.md");
      const processed = processFrontMatter(parsed.frontmatter, isIndexFile);
      const result = stringifyFrontMatter(processed, parsed.content);

      const expected = `---
title: "タイトル"
enabled: "[JP,US]"
layout: "@/layouts/PageLayout.astro"
---

コンテンツ`;
      expect(result).toBe(expected);
    });

    it("labelsフィールドを配列に変換する", () => {
      const input = `---
title: "タイトル"
labels: [label1, label2]
---

コンテンツ`;
      const parsed = parseFrontMatter(input);
      const isIndexFile =
        "file.md".endsWith("_index.md") || "file.md".endsWith("index.md");
      const processed = processFrontMatter(parsed.frontmatter, isIndexFile);
      const result = stringifyFrontMatter(processed, parsed.content);

      const expected = `---
title: "タイトル"
labels: "[label1, label2]"
layout: "@/layouts/PageLayout.astro"
---

コンテンツ`;
      expect(result).toBe(expected);
    });
  });

  describe("複合的なフロントマター処理", () => {
    it("複数のフィールドを一度に処理する", () => {
      const input = `---
title: "複合的なページ"
weight: 300
aliases: /ja/id/040143
disabled: [CN]
enabled: [JP,US]
labels: [important, guide]
---

コンテンツ`;
      const parsed = parseFrontMatter(input);
      const isIndexFile =
        "file.md".endsWith("_index.md") || "file.md".endsWith("index.md");
      const processed = processFrontMatter(parsed.frontmatter, isIndexFile);
      const result = stringifyFrontMatter(processed, parsed.content);

      const expected = `---
title: "複合的なページ"
weight: 300
aliases:
  - "/ja/id/040143"
disabled: "[CN]"
enabled: "[JP,US]"
labels: "[important, guide]"
layout: "@/layouts/PageLayout.astro"
---

コンテンツ`;
      expect(result).toBe(expected);
    });

    it("_index.mdでの複合処理", () => {
      const input = `---
title: "セクションページ"
weight: 100
aliases: /ja/section/
disabled: [US]
---

コンテンツ`;
      const parsed = parseFrontMatter(input);
      const isIndexFile =
        "_index.md".endsWith("_index.md") || "_index.md".endsWith("index.md");
      const processed = processFrontMatter(parsed.frontmatter, isIndexFile);
      const result = stringifyFrontMatter(processed, parsed.content);

      const expected = `---
title: "セクションページ"
weight: 100
aliases:
  - "/ja/section/"
disabled: "[US]"
layout: "@/layouts/SectionLayout.astro"
---

コンテンツ`;
      expect(result).toBe(expected);
    });
  });

  describe("特殊なフィールドの処理", () => {
    it("文字列形式のdisabledフィールドを処理する", () => {
      const input = `---
title: "タイトル"
disabled: "[US,CN]"
---

コンテンツ`;
      const parsed = parseFrontMatter(input);
      const isIndexFile =
        "file.md".endsWith("_index.md") || "file.md".endsWith("index.md");
      const processed = processFrontMatter(parsed.frontmatter, isIndexFile);
      const result = stringifyFrontMatter(processed, parsed.content);

      const expected = `---
title: "タイトル"
disabled: "[US,CN]"
layout: "@/layouts/PageLayout.astro"
---

コンテンツ`;
      expect(result).toBe(expected);
    });
  });

  describe("エッジケース", () => {
    it("フロントマターがない場合は追加する", () => {
      const input = "コンテンツのみ";
      const parsed = parseFrontMatter(input);
      const isIndexFile =
        "file.md".endsWith("_index.md") || "file.md".endsWith("index.md");
      const processed = processFrontMatter(parsed.frontmatter, isIndexFile);
      const result = stringifyFrontMatter(processed, parsed.content);

      const expected = `---
layout: "@/layouts/PageLayout.astro"
---
コンテンツのみ`;
      expect(result).toBe(expected);
    });

    it("空のフロントマターの場合はlayoutのみ追加する", () => {
      const input = `---
---

コンテンツ`;
      const parsed = parseFrontMatter(input);
      const isIndexFile =
        "file.md".endsWith("_index.md") || "file.md".endsWith("index.md");
      const processed = processFrontMatter(parsed.frontmatter, isIndexFile);
      const result = stringifyFrontMatter(processed, parsed.content);

      const expected = `---
layout: "@/layouts/PageLayout.astro"
---

コンテンツ`;
      expect(result).toBe(expected);
    });

    it("既にlayoutがある場合は変更しない", () => {
      const input = `---
title: "タイトル"
layout: "@/layouts/CustomLayout.astro"
---

コンテンツ`;
      const parsed = parseFrontMatter(input);
      const isIndexFile =
        "file.md".endsWith("_index.md") || "file.md".endsWith("index.md");
      const processed = processFrontMatter(parsed.frontmatter, isIndexFile);
      const result = stringifyFrontMatter(processed, parsed.content);

      expect(result).toBe(input);
    });

    it("複雑なYAML構造を正しく処理する", () => {
      const input = `---
title: "複雑なページ"
meta:
  description: "説明"
  keywords: ["key1", "key2"]
aliases: /ja/id/040141
---

コンテンツ`;
      const parsed = parseFrontMatter(input);
      const isIndexFile =
        "file.md".endsWith("_index.md") || "file.md".endsWith("index.md");
      const processed = processFrontMatter(parsed.frontmatter, isIndexFile);
      const result = stringifyFrontMatter(processed, parsed.content);

      const expected = `---
title: "複雑なページ"
meta: []
description: "説明"
keywords: "[\"key1\", \"key2\"]"
aliases:
  - "/ja/id/040141"
layout: "@/layouts/PageLayout.astro"
---

コンテンツ`;
      expect(result).toBe(expected);
    });
  });

  describe("ファイルパスによる条件分岐", () => {
    it("ディレクトリ内の_index.mdを正しく判定する", () => {
      const input = `---
title: "サブディレクトリ"
---

コンテンツ`;
      const parsed = parseFrontMatter(input);
      const isIndexFile =
        "path/to/sub/_index.md".endsWith("_index.md") ||
        "path/to/sub/_index.md".endsWith("index.md");
      const processed = processFrontMatter(parsed.frontmatter, isIndexFile);
      const result = stringifyFrontMatter(processed, parsed.content);

      const expected = `---
title: "サブディレクトリ"
layout: "@/layouts/SectionLayout.astro"
---

コンテンツ`;
      expect(result).toBe(expected);
    });

    it("通常のファイルを正しく判定する", () => {
      const input = `---
title: "通常のファイル"
---

コンテンツ`;
      const parsed = parseFrontMatter(input);
      const isIndexFile =
        "path/to/normal-file.md".endsWith("_index.md") ||
        "path/to/normal-file.md".endsWith("index.md");
      const processed = processFrontMatter(parsed.frontmatter, isIndexFile);
      const result = stringifyFrontMatter(processed, parsed.content);

      const expected = `---
title: "通常のファイル"
layout: "@/layouts/PageLayout.astro"
---

コンテンツ`;
      expect(result).toBe(expected);
    });
  });

  describe("FrontMatter内のショートコード変換", () => {
    it("description内の{{< kintone >}}ショートコードを変換する", () => {
      const input = `---
title: "タイトル"
description: "{{< kintone >}}が出力する監査ログについて説明します。"
---

コンテンツ`;
      const parsed = parseFrontMatter(input);
      const isIndexFile =
        "file.md".endsWith("_index.md") || "file.md".endsWith("index.md");
      const processed = processFrontMatter(parsed.frontmatter, isIndexFile);
      const result = stringifyFrontMatter(processed, parsed.content);

      const expected = `---
title: "タイトル"
description: "<Kintone />が出力する監査ログについて説明します。"
layout: "@/layouts/PageLayout.astro"
---

コンテンツ`;
      expect(result).toBe(expected);
    });

    it("title内の{{< slash_ui >}}ショートコードを変換する", () => {
      const input = `---
title: "{{< slash_ui >}}でGuest Account Licenseの必要数を確認する"
weight: 100
---

コンテンツ`;
      const parsed = parseFrontMatter(input);
      const isIndexFile =
        "file.md".endsWith("_index.md") || "file.md".endsWith("index.md");
      const processed = processFrontMatter(parsed.frontmatter, isIndexFile);
      const result = stringifyFrontMatter(processed, parsed.content);

      const expected = `---
title: "<SlashUi />でGuest Account Licenseの必要数を確認する"
weight: 100
layout: "@/layouts/PageLayout.astro"
---

コンテンツ`;
      expect(result).toBe(expected);
    });

    it("複数のフィールドで異なるショートコードを変換する", () => {
      const input = `---
title: "{{< kintone >}}の設定方法"
description: "{{< service >}}で{{< slash_ui >}}を使用する方法を説明します。"
weight: 200
---

コンテンツ`;
      const parsed = parseFrontMatter(input);
      const isIndexFile =
        "file.md".endsWith("_index.md") || "file.md".endsWith("index.md");
      const processed = processFrontMatter(parsed.frontmatter, isIndexFile);
      const result = stringifyFrontMatter(processed, parsed.content);

      const expected = `---
title: "<Kintone />の設定方法"
description: "<Service />で<SlashUi />を使用する方法を説明します。"
weight: 200
layout: "@/layouts/PageLayout.astro"
---

コンテンツ`;
      expect(result).toBe(expected);
    });

    it("同じフィールド内に複数のショートコードがある場合でも変換する", () => {
      const input = `---
title: "{{< kintone >}}と{{< slash >}}の違い"
description: "{{< corpname >}}が提供する{{< kintone >}}と{{< slash >}}について説明します。"
---

コンテンツ`;
      const parsed = parseFrontMatter(input);
      const isIndexFile =
        "file.md".endsWith("_index.md") || "file.md".endsWith("index.md");
      const processed = processFrontMatter(parsed.frontmatter, isIndexFile);
      const result = stringifyFrontMatter(processed, parsed.content);

      const expected = `---
title: "<Kintone />と<Slash />の違い"
description: "<CorpName />が提供する<Kintone />と<Slash />について説明します。"
layout: "@/layouts/PageLayout.astro"
---

コンテンツ`;
      expect(result).toBe(expected);
    });

    it("ショートコードが含まれていないフィールドはそのまま保持する", () => {
      const input = `---
title: "通常のタイトル"
description: "ショートコードのない普通の説明文です。"
weight: 100
aliases: /ja/id/040141
---

コンテンツ`;
      const parsed = parseFrontMatter(input);
      const isIndexFile =
        "file.md".endsWith("_index.md") || "file.md".endsWith("index.md");
      const processed = processFrontMatter(parsed.frontmatter, isIndexFile);
      const result = stringifyFrontMatter(processed, parsed.content);

      const expected = `---
title: "通常のタイトル"
description: "ショートコードのない普通の説明文です。"
weight: 100
aliases:
  - "/ja/id/040141"
layout: "@/layouts/PageLayout.astro"
---

コンテンツ`;
      expect(result).toBe(expected);
    });

    it("数値や配列などの非文字列フィールドは変更しない", () => {
      const input = `---
title: "{{< kintone >}}の設定"
weight: 100
aliases: ["/ja/id/1", "/ja/id/2"]
enabled: true
---

コンテンツ`;
      const parsed = parseFrontMatter(input);
      const isIndexFile =
        "file.md".endsWith("_index.md") || "file.md".endsWith("index.md");
      const processed = processFrontMatter(parsed.frontmatter, isIndexFile);
      const result = stringifyFrontMatter(processed, parsed.content);

      const expected = `---
title: "<Kintone />の設定"
weight: 100
aliases:
  - "[\"/ja/id/1\", \"/ja/id/2\"]"
enabled: true
layout: "@/layouts/PageLayout.astro"
---

コンテンツ`;
      expect(result).toBe(expected);
    });

    it("_index.mdでもショートコード変換が動作する", () => {
      const input = `---
title: "{{< kintone >}}セクション"
description: "{{< service >}}の概要セクション"
weight: 100
---

コンテンツ`;
      const parsed = parseFrontMatter(input);
      const isIndexFile =
        "_index.md".endsWith("_index.md") || "_index.md".endsWith("index.md");
      const processed = processFrontMatter(parsed.frontmatter, isIndexFile);
      const result = stringifyFrontMatter(processed, parsed.content);

      const expected = `---
title: "<Kintone />セクション"
description: "<Service />の概要セクション"
weight: 100
layout: "@/layouts/SectionLayout.astro"
---

コンテンツ`;
      expect(result).toBe(expected);
    });

    it("ショートコード名にスペースがある場合も正しく変換する", () => {
      const input = `---
title: "{{<kintone>}}と{{<  slash_ui  >}}の使い方"
description: "{{<   service   >}}について"
---

コンテンツ`;
      const parsed = parseFrontMatter(input);
      const isIndexFile =
        "file.md".endsWith("_index.md") || "file.md".endsWith("index.md");
      const processed = processFrontMatter(parsed.frontmatter, isIndexFile);
      const result = stringifyFrontMatter(processed, parsed.content);

      const expected = `---
title: "<Kintone />と<SlashUi />の使い方"
description: "<Service />について"
layout: "@/layouts/PageLayout.astro"
---

コンテンツ`;
      expect(result).toBe(expected);
    });
  });
});
