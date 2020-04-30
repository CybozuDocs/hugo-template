/*********************アンケート用スクリプト************************/
//役立ちましたか？[はい][いいえ]のアンケート
$(function() {
  var $enquete = $("#enquete");
  if (!$enquete[0]) {
      return true; //アンケートがなければ終了
  }
  if ($.cookie('answered') == location.pathname) {
      return true; //すでに回答済みの場合は終了
  }
  var $window = $(window);

  //回答の送信処理
  (function() {
      var feedbackflg = false; //回答したかどうかのフラグ

      var url = "https://form.kintoneapp.com/public/form/show/2a7268574abefeca37c34f2e89c1dad558239925266fe18a3ee9499e6c2b0590?";
      var queryObj = {
          check: "",
          url: encodeURI(location.href),
          title: document.title
      };
      var param = "";

      //[はい][いいえ]の回答時に回答フラグを立てる。表示も切り替える。
      $('#feedback_yes').click(function() {
          feedbackflg = true;
          queryObj.check = 'Yes';
          param = $.param(queryObj);

          var winopen = window.open(url + param, 'feedback', 'width=620, height=460, scrollbars=1, menubar=1, resizable=1');
          winopen.opener = null;
          $enquete.fadeOut();
      });
      $('#feedback_no').click(function() {
          feedbackflg = true;
          queryObj.check = 'No';
          param = $.param(queryObj);

          var winopen = window.open(url + param, 'feedback', 'width=620, height=460, scrollbars=1, menubar=1, resizable=1');
          winopen.opener = null;
          $enquete.fadeOut();
      });
  })();

  //アンケートの表示位置の制御
  $window.on("load", function() {
      var $triggerNode = $(".footer"); //アンケートのfixed<->absoluteを切り替える位置
      var windowHeight = $window.height();
      var windowScrollTop = $window.scrollTop();
      var triggerNodeOffsetTop = $triggerNode.offset().top;
      var triggerNodeHeight = $triggerNode.height();
      var isDisplayed = false;
      var displayedPos = "fixed";

      function displayEnquete() {
          $enquete.fadeIn("normal", function() {
              isDisplayed = true;
          });
      }
      function controlDisplayPosition() {
          if ((triggerNodeOffsetTop - windowHeight) < windowScrollTop) { //アンケートのfixed<->absoluteを切り替える
              if (displayedPos == "fixed") {
                  $enquete.css({position: "absolute", bottom: triggerNodeHeight});
                  displayedPos = "absolute";
              }
          } else {
              if (displayedPos == "absolute") {
                  $enquete.css({position: "fixed", bottom: "0"});
                  displayedPos = "fixed";
              }
          }
      }
      setTimeout(displayEnquete, 0); //0秒後にアンケートを表示する
      controlDisplayPosition();
      $window.scroll(function() {
          windowScrollTop = $window.scrollTop();
          controlDisplayPosition();
      });
      var timer = false;
      $window.resize(function() {
          if (timer !== false) {
              clearTimeout(timer);
          }
          timer = setTimeout(function() { //リサイズ終了時に実行
              windowHeight = $window.height(); //ウィンドウサイズを更新
              triggerNodeOffsetTop = $triggerNode.offset().top; //アンケート表示の基準位置も更新
              controlDisplayPosition();
          }, 200);
      });
  });
});
