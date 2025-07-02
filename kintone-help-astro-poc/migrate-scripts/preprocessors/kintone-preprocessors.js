export default {
  rules: [
    {
      filePath: "app/form/autocalc/basic_error/autocalc_format.md",
      transform: (content) => {
        // Fix unescaped < character in table cell
        return content
          .replaceAll(
            '<td style="text-align: center;"><</td>',
            '<td style="text-align: center;">&lt;</td>',
          )
          .replaceAll(
            '<td style="text-align: center;"><=</td>',
            '<td style="text-align: center;">&lt;=</td>',
          )
          .replaceAll(
            '<td style="text-align: center;"><></td>',
            '<td style="text-align: center;">&lt;&gt;</td>',
          )
          .replaceAll(
            "=,  !=,  <>,  <,  >,  <=,  >=（比較演算子）",
            "=,  !=,  &lt;&gt;,  &lt;,  &gt;,  &lt;=,  &gt;=（比較演算子）",
          );
      },
    },
    {
      filePath: "app/form/autocalc/basic_error/example_operators.md",
      transform: (content) => {
        // Fix unescaped operators in table cells
        return content
          .replaceAll("<td><></td>", "<td>&lt;&gt;</td>")
          .replaceAll("<td><</td>", "<td>&lt;</td>")
          .replaceAll("<td><=</td>", "<td>&lt;=</td>")
          .replaceAll("<td>></td>", "<td>&gt;</td>")
          .replaceAll("<td>>=</td>", "<td>&gt;=</td>")
          .replaceAll("<td>*</td>", "<td>&#42;</td>")
          .replaceAll("<td>3*2</td>", "<td>3&#42;2</td>")
          .replaceAll("<td>IF(A<100,B,C)</td>", "<td>IF(A&lt;100,B,C)</td>")
          .replaceAll(
            "<td>IF(A<>100,B,C)</td>",
            "<td>IF(A&lt;&gt;100,B,C)</td>",
          )
          .replaceAll("<td>IF(A<=100,B,C)</td>", "<td>IF(A&lt;=100,B,C)</td>")
          .replaceAll("<td>IF(A>100,B,C)</td>", "<td>IF(A&gt;100,B,C)</td>")
          .replaceAll("<td>IF(A>=100,B,C)</td>", "<td>IF(A&gt;=100,B,C)</td>");
      },
    },
    {
      filePath: "app/form/autocalc/function/and_or.md",
      transform: (content) => {
        // Fix unescaped operators in list items and code blocks
        return content
          .replaceAll("* <>", "* &lt;&gt;")
          .replaceAll("* <", "* &lt;")
          .replaceAll("* <=", "* &lt;=")
          .replaceAll("「<>」", "「&lt;&gt;」")
          .replaceAll(
            'IF(AND(学科>=80,実技>=80),"合格","再テスト")',
            'IF(AND(学科&gt;=80,実技&gt;=80),"合格","再テスト")',
          )
          .replaceAll(
            'IF(OR(学科>=80,実技>=80),"合格","再テスト")',
            'IF(OR(学科&gt;=80,実技&gt;=80),"合格","再テスト")',
          )
          .replaceAll(
            'IF(NOT(学科+実技>=160),"再テスト","合格")',
            'IF(NOT(学科+実技&gt;=160),"再テスト","合格")',
          )
          .replaceAll(
            'IF(AND(入社年月日!="",退職年月日=""),1,0)',
            'IF(AND(入社年月日!="",退職年月日=""),1,0)',
          );
      },
    },
    {
      filePath: "app/form/autocalc/function/if_function.md",
      transform: (content) => {
        // Fix unescaped operators in list items
        return content
          .replaceAll("* <>", "* &lt;&gt;")
          .replaceAll("* <", "* &lt;")
          .replaceAll("* <=", "* &lt;=")
          .replaceAll("「!=」「<>」", "「!=」「&lt;&gt;」");
      },
    },
    {
      filePath: "app/form/autocalc/function/rounding.md",
      transform: (content) => {
        // Fix unclosed tr tag in table
        return content.replaceAll(
          "        <tr>\n            <td>6.5</td>\n            <td>7</td>\n            <td>6</td>\n    </tbody>",
          "        <tr>\n            <td>6.5</td>\n            <td>7</td>\n            <td>6</td>\n        </tr>\n    </tbody>",
        );
      },
    },
    {
      filePath: "app/form/autocalc/ref_data/calculation_type.md",
      transform: (content) => {
        // Fix unescaped operators in table cells
        return content
          .replaceAll("<td>=、 !=、 <></td>", "<td>=、 !=、 &lt;&gt;</td>")
          .replaceAll(
            "<td><、 <=、 >、 >=</td>",
            "<td>&lt;、 &lt;=、 &gt;、 &gt;=</td>",
          );
      },
    },
    {
      filePath: "app/form/form_parts/_index.md",
      transform: (content) => {
        // Fix unclosed td tags in table using regex for multiline pattern
        return content
          .replace(
            /(テーブル<\/a><\/li>\s+<\/ul>)\s+(<\/tr>)/g,
            "$1\n            </td>\n        $2",
          )
          .replace(
            /(関連レコード一覧<\/a><\/li>\s+<\/ul>)\s+(<\/tr>)/g,
            "$1\n            </td>\n        $2",
          );
      },
    },
    {
      filePath: "app/setup/app_csv/add_app_failed.md",
      transform: (content) => {
        // Fix unquoted href attribute
        return content.replaceAll(
          "<a href=/k/ja/id/040628.html>",
          '<a href="/k/ja/id/040628.html">',
        );
      },
    },
    {
      filePath: "app/using_app/delete_bulk.md",
      transform: (content) => {
        // Note内のインデントを統一（開始タグに合わせて4文字インデント）
        return content.replace(
          /(   \{\{< note >\}\}\n\n)([\s\S]*?)(   \{\{< \/note >\}\})/,
          (match, openTag, noteContent, closeTag) => {
            const indentedContent = noteContent
              .split("\n")
              .map((line) => {
                if (line.trim() === "") return line;
                // すべての行に4文字インデントを適用
                if (line.startsWith(" ")) {
                  // 既にスペースがある場合は置き換え
                  return "    " + line.replace(/^ +/, "");
                } else if (line.trim().length > 0) {
                  // スペースがない場合は4文字追加
                  return "    " + line;
                }
                return line;
              })
              .join("\n");
            return openTag + indentedContent + closeTag;
          },
        );
      },
    },
  ],
};
