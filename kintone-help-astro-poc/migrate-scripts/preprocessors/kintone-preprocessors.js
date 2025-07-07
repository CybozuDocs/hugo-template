export default {
  rules: [
    {
      filePath: "app/form/autocalc/basic_error/autocalc_format.md",
      transform: (content) => {
        // テーブルセル内のエスケープされていない < 文字を修正
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
        // テーブルセル内のエスケープされていない演算子を修正
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
        // リスト項目とコードブロック内のエスケープされていない演算子を修正
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
        // リスト項目内のエスケープされていない演算子を修正
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
        // テーブル内の閉じられていないtrタグを修正
        return content.replaceAll(
          "        <tr>\n            <td>6.5</td>\n            <td>7</td>\n            <td>6</td>\n    </tbody>",
          "        <tr>\n            <td>6.5</td>\n            <td>7</td>\n            <td>6</td>\n        </tr>\n    </tbody>",
        );
      },
    },
    {
      filePath: "app/form/autocalc/ref_data/calculation_type.md",
      transform: (content) => {
        // テーブルセル内のエスケープされていない演算子を修正
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
        // 複数行パターンの正規表現を使用してテーブル内の閉じられていないtdタグを修正
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
        // 引用符で囲まれていないhref属性を修正
        return content.replaceAll(
          "<a href=/k/ja/id/040628.html>",
          '<a href="/k/ja/id/040628.html">',
        );
      },
    },
    {
      filePath: "utility/app/balance_total.md",
      transform: (content) => {
        // 欠けている開始trタグを追加し、不要な閉じtrタグを削除
        return content
          .replaceAll(
            "        <td>残高累計</td>\n        <td>残高累計</td>\n        <td>計算</br>\n            - 計算式：前日残高 + 入金 - 出金</br>\n        </td>\n        </tr>",
            "        <tr>\n        <td>残高累計</td>\n        <td>残高累計</td>\n        <td>計算</br>\n            - 計算式：前日残高 + 入金 - 出金</br>\n        </td>\n        </tr>",
          )
          .replaceAll(
            "        <td>アクションの利用者</td>\n        <td>Everyone</td>\n        </tr>\n        <tr>",
            "        <td>アクションの利用者</td>\n        <td>Everyone</td>\n        </tr>",
          );
      },
    },
    {
      filePath: "utility/app/latenight_overtime.md",
      transform: (content) => {
        // 計算式内のエスケープされていない演算子を修正
        return (
          content
            // 条件式内の単独演算子を修正
            .replaceAll(/出勤<=/g, "出勤&lt;=")
            .replaceAll(/退勤<=/g, "退勤&lt;=")
            .replaceAll(/退勤>=/g, "退勤&gt;=")
            .replaceAll(/出勤>=/g, "出勤&gt;=")
            .replaceAll(/退勤<出勤/g, "退勤&lt;出勤")
            .replaceAll(/実技>=/g, "実技&gt;=")
            .replaceAll(/学科>=/g, "学科&gt;=")
            // 時間値を含む演算子を修正（例：<=5*60*60）
            .replaceAll(/<=(\d+\*60\*60)/g, "&lt;=$1")
            .replaceAll(/>=(\d+\*60\*60)/g, "&gt;=$1")
        );
      },
    },
    {
      filePath: "admin/app_admin/confirm_app_list.md",
      transform: (content) => {
        return (
          content
            .replaceAll("</ul>{{< /note >}}", "</ul>\n{{< /note >}}")
            .replaceAll(
              "{{< note >}}{{< slash >}}",
              "{{< note >}}\n{{< slash >}}",
            )
            // 欠けているtd閉じタグを修正
            .replace(
              /(<td style="vertical-align: top;">アプリ内の以下のファイルの合計サイズが表示されます。<\/br>[\s\S]*?この列の値は1日ごとに更新されます。<\/br>)\s*(<\/tr>)/,
              "$1</td>\n        $2",
            )
        );
      },
    },
    {
      filePath: "admin/permission_admin/common/control_view_profile.md",
      transform: (content) => {
        // rowspan td要素の後の欠けているtr閉じタグを修正
        return (
          content
            // rowspan="7"のtrタグを修正
            .replace(
              /<td rowspan="7">{{< wv_brk >}}\［フォーム\］{{< \/wv_brk >}}<\/td>\s*<tr>/,
              '<td rowspan="7">{{< wv_brk >}}［フォーム］{{< /wv_brk >}}</td>\n        </tr>\n        <tr>',
            )
            // rowspan="3"のtrタグを修正
            .replace(
              /<td rowspan="3">{{< wv_brk >}}\［レコードのアクセス権\］{{< \/wv_brk >}}<\/td>\s*<tr>/,
              '<td rowspan="3">{{< wv_brk >}}［レコードのアクセス権］{{< /wv_brk >}}</td>\n        </tr>\n        <tr>',
            )
        );
      },
    },
    {
      filePath: "guest/manage/confirm_guest_list.md",
      transform: (content) => {
        // 正しくないショートコード構文を修正
        return content.replaceAll("{{% kintone %}}", "{{< kintone >}}");
      },
    },
    {
      filePath: "notifications/mail/activate_mail_notifications.md",
      transform: (content) => {
        // 欠けているthead閉じタグを修正
        return content.replace(
          /(<thead>\s*<tr>[\s\S]*?<\/tr>)\s*(<tbody>)/,
          "$1\n    </thead>\n    $2",
        );
      },
    },
    {
      filePath: "notifications/usage/notification_tutorial.md",
      transform: (content) => {
        // 欠けているtr開始タグを修正
        return content.replace(
          /(<\/tr>\s*)(<td>アプリ<\/td>)/,
          "$1\n        <tr>\n        $2",
        );
      },
    },
    {
      filePath: "notifications/usage/notification_type.md",
      transform: (content) => {
        // 欠けているul・li閉じタグと欠けているthead開始タグを修正
        return content
          // 最初のパターンの欠けているli・ul閉じタグを修正
          .replace(
            /<li>通知先に指定された組織やグループに所属するユーザー<\/td>/g,
            "<li>通知先に指定された組織やグループに所属するユーザー</li>\n            </ul>\n            </td>"
          )
          // 2番目のパターン（グループ選択後）の欠けているul閉じタグを修正
          .replace(
            /(<li>{{< wv_brk >}}\［グループ選択\］{{< \/wv_brk >}}<\/li>)\s*(<\/td>)/g,
            "$1\n            </ul>\n            $2"
          )
          // 3番目のパターンの欠けているul・li閉じタグを修正  
          .replace(
            /<li>通知先に指定された組織やグループに所属するユーザー{{< wv_brk >}}{{< \/wv_brk >}}<\/li>\s*<\/td>/g,
            "<li>通知先に指定された組織やグループに所属するユーザー{{< wv_brk >}}{{< /wv_brk >}}</li>\n            </ul>\n            </td>"
          )
          // 追加の欠けているul閉じタグを修正（特定パターン）
          .replace(
            /(<li>{{< wv_brk >}}\［グループ選択\］{{< \/wv_brk >}}<\/li>\s*<\/ul>\s*)\*1：書き込みした時点で/g,
            "$1</ul>\n             *1：書き込みした時点で"
          )
          .replace(
            /(<li>{{< wv_brk >}}\［グループ選択\］{{< \/wv_brk >}}<\/li>\s*<\/ul>\s*)\*1：ステータス変更後の/g,
            "$1</ul>\n             *1：ステータス変更後の"
          )
          // テーブル内の欠けているthead開始タグを修正
          .replace(
            /(<table[^>]*>\s*)(<tr>\s*<th[^>]*>)/g,
            "$1\n    <thead>\n        $2"
          );
      },
    },
    {
      filePath: "option/email/m_list_data/m_log.md",
      transform: (content) => {
        // 特定の中括弧パターンをエスケープ（Hugoショートコードを除く）
        return content
          .replaceAll("{メールアプリケーション名}", "\\{メールアプリケーション名\\}")
          .replaceAll("{メールID{WID}}", "\\{メールID\\{WID\\}\\}")
          .replaceAll("{メールアプリケーションID}", "\\{メールアプリケーションID\\}")
          .replaceAll("{追加または更新した数}", "\\{追加または更新した数\\}")
          .replaceAll("{削除した数}", "\\{削除した数\\}")
          .replaceAll("{メールスペース名}", "\\{メールスペース名\\}")
          .replaceAll("{メールID}", "\\{メールID\\}")
          .replaceAll("{YYYY-MM-DDThh:mm:ss+09:00}", "\\{YYYY-MM-DDThh:mm:ss+09:00\\}")
          .replaceAll("{件名(0～100文字)}", "\\{件名(0～100文字)\\}")
          .replaceAll("{条件ID}", "\\{条件ID\\}")
          .replaceAll("{期間}", "\\{期間\\}")
          .replaceAll("{メールID/メールID/...}", "\\{メールID/メールID/...\\}")
          .replaceAll("{エラーID}", "\\{エラーID\\}")
          .replaceAll("{条件名}", "\\{条件名\\}")
          .replaceAll("{転送先}", "\\{転送先\\}")
          .replaceAll("{メールのMessage-ID}", "\\{メールのMessage-ID\\}")
          .replaceAll("{エラー番号}", "\\{エラー番号\\}")
          .replaceAll("{フォルダ名}", "\\{フォルダ名\\}")
          .replaceAll("{エラーメッセージ}", "\\{エラーメッセージ\\}")
          .replaceAll("{サーバーからの応答(最大1000文字)}", "\\{サーバーからの応答(最大1000文字)\\}")
          .replaceAll("{振り分け先のフォルダ名}", "\\{振り分け先のフォルダ名\\}")
          .replaceAll("{通知の宛先メールアドレス}", "\\{通知の宛先メールアドレス\\}")
          .replaceAll("{サブフォルダを含めない場合は0を、含める場合は1を表示}", "\\{サブフォルダを含めない場合は0を、含める場合は1を表示\\}");
      },
    },
    {
      filePath: "option/email/m_list_set/m_address_format.md",
      transform: (content) => {
        // <メールアドレス>パターンをエスケープ
        return content.replaceAll("<メールアドレス>", "&lt;メールアドレス&gt;");
      },
    },
    {
      filePath: "people/view_people.md",
      transform: (content) => {
        // 引用符で囲まれていないwidth属性を修正
        return content.replaceAll("width=55", 'width="55"');
      },
    },
    {
      filePath: "trouble_shooting/app_qa/comments_closed.md",
      transform: (content) => {
        // enabled2ショートコード後の全角スペースを削除
        return content.replaceAll("{{< /enabled2 >}}　　", "{{< /enabled2 >}}");
      },
    },
    {
      filePath: "trouble_shooting/app_trouble/target_record_search.md",
      transform: (content) => {
        // 引用符で囲まれていないwidth属性を修正
        return content.replaceAll("width=100", 'width="100"');
      },
    },
    {
      filePath: "trouble_shooting/calculation/sumif.md",
      transform: (content) => {
        // 不正なHTMLタグの入れ子を修正（<b><ul>を<ul><li><b>に変更）
        return content.replace(
          /<b><ul>\s*<li>テーブル内「自費金額」の計算式：IF\(CONTAINS\(自費,"自費"\),金額,""\)<\/b><\/li>/,
          '<ul>\n       <li><b>テーブル内「自費金額」の計算式：IF(CONTAINS(自費,"自費"),金額,"")</b></li>'
        );
      },
    },
  ],
};
