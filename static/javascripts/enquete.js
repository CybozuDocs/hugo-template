/*********************アンケート用スクリプト************************/
//回答者の情報を取得
$(function(){
  //ヘルプサイトへのアクセス元ページを記録
  (function() {
    var referrerVal = document.referrer;
    if(referrerVal.indexOf(document.domain) == -1) { //リファラが別のサイトなら記録
      $.cookie("cb_ref", referrerVal, { path:"/",expires:0,secure:true});
    }
  })();
});
//いいえの回答が二重登録されてしまう件の暫定対処
$(function(){
  $("#feedback_send").attr("type","button");
  $("#feedback_sendWithoutComment").attr("type","button");
});
//役立ちましたか？[はい][いいえ]のアンケート
$(function(){
  var $enquete = $("#enquete");
  if (!$enquete[0]) {
    return true; //アンケートがなければ終了
  }
  if ($.cookie('answered') == location.pathname) {
    return true; //すでに回答済みの場合は終了
  }
  var $window= $(window);
  var $enqueteYesOrNoBtns = $("#enqueteYesOrNoBtns");
  var $enqueteThanks = $("#enqueteThanks");
  var $enqueteSorry = $("#enqueteSorry");
  var $additionnalEnquate = $("#additionnalEnquate");
  var $additionnalEnquate_textArea = $('#additionnalEnquate_textArea');
  var $additionnalEnquate_countChar = $('#additionnalEnquate_countChar');
  var $feedback_send = $('#feedback_send');
  var $feedback_sendWithoutComment = $('#feedback_sendWithoutComment');

  //アンケート項目に回答送信元の情報をセット
  (function() {
    var ipAddr = $.cookie('__ctc');
    if (ipAddr) {
      ipAddr = ipAddr.slice(0,ipAddr.lastIndexOf("."));
    }
    var env = {
      ip: ipAddr,
      subDomain: $.cookie('CYBOZU_COM_DOMAIN'),
      referrer: $.cookie('cb_ref'),
      keywords: $.cookie('cb_kw')
    };
    $(".enqueteIpAddr").each( function() {
      $(this).attr("value",env.ip); //IP
    });
    $(".enqueteSubDomain").each( function() {
      $(this).attr("value",env.subDomain); //サブドメイン
    });
    $(".enqueteReferrer").each( function() {
      $(this).attr("value",env.referrer); //リファラー
    });
    $(".enqueteKeyWords").each( function() {
      $(this).attr("value",env.keywords); //検索キーワード
    });
  })();
  //回答の送信処理
  (function() {
    var feedbackflg = false; //回答したかどうかのフラグ
    //var sendFeedbackFlg = false; //回答を送信したかどうかのフラグ
    //[はい][いいえ]の回答時に回答フラグを立てる。表示も切り替える。
    $('#feedback_yes').click( function() {
      document.getElementById("enqueteRadio").value = 342409;
      feedbackflg = true;
      document.enqueteForm.submit();
      $enqueteYesOrNoBtns.hide();
      $enqueteThanks.show();
      setTimeout(function() {
        $enquete.fadeOut();
      },3000);
    });
    $('#feedback_no').click( function() {
      document.getElementById("enqueteRadio").value = 342410;
      feedbackflg = true;
      document.enqueteForm.submit();
      $enqueteYesOrNoBtns.hide();
      $enqueteSorry.show();
      //[いいえ]を押されたらご意見記入欄を表示
      setTimeout(function() {
        $additionnalEnquate.show();
        $additionnalEnquate_textArea.focus();
      },200);
    });
    $("#feedback_send").click( function() {
      if ($(this).hasClass('btn_disabled')) {
        return false;
      }
      document.getElementById("enqueteRadio").value = null;
      document.enqueteForm.submit();
      $additionnalEnquate.fadeOut("slow", function() {
        $enqueteThanks.show();
      });
      setTimeout(function() {
        $enquete.fadeOut();
      },3000);
    });
    $("#feedback_sendWithoutComment").click( function() {
        $enquete.fadeOut();
    });
  })();
  //ご意見記入欄をフォーカス中は記入欄を広げる
  (function(normalSize,extendedSize,$elm) {
    var isEnlarged = false;
    $elm.focus(function(){
      if(isEnlarged == false) {
        $(this).animate({
            height: extendedSize},400);
        isEnlarged = true;
      }
    });
    //フォーカスが外れたらサイズを縮める
    $elm.blur(function(){
      if($elm[0].value.length == 0 && isEnlarged == true) {
        $(this).animate({
            height: normalSize},500);
        isEnlarged = false;
      }
    });
  })('39px','100px',$additionnalEnquate_textArea);
  //ご意見記入欄に残りの入力可能文字数を表示
  (function() {
    var maxCharLength = 1500;

    $additionnalEnquate_textArea.bind('keydown keyup keypress change',function(){
      var remainingLength = maxCharLength -$additionnalEnquate_textArea[0].value.length;
      $additionnalEnquate_countChar.text('残り'+remainingLength+'文字')
      if(remainingLength < maxCharLength) {
        $feedback_sendWithoutComment.addClass('btn_disabled');
        $feedback_send.removeClass('btn_disabled');
      } else {
        $feedback_sendWithoutComment.removeClass('btn_disabled');
        $feedback_send.addClass('btn_disabled');
      }
      if(remainingLength < 0) {
        $additionnalEnquate_countChar.text('最大文字数を超えています。')
      }
    });
  })();
  //アンケートの表示位置の制御
  $window.on("load", function() {
    var $triggerNode = $(".footer"); //アンケートのfixed<->absoluteを切り替える位置
    var windowHeight = $window.height();
    var windowScrollTop = $window.scrollTop();
    var triggerNodeOffsetTop = $triggerNode.offset().top;
    var isDisplayed = false;
    var displayedPos = "fixed";

    function displayEnquete() {
        $enquete.fadeIn("normal", function() {
          isDisplayed = true;
        });
    }
    function controlDisplayPosition() {
      if ( (triggerNodeOffsetTop - windowHeight) < windowScrollTop ) { //アンケートのfixed<->absoluteを切り替える
        if (displayedPos == "fixed") {
          $enquete.css({position: "absolute",bottom: "92px"});
          displayedPos = "absolute";
        }
      } else {
        if (displayedPos == "absolute") {
          $enquete.css({position: "fixed",bottom: "0"});
          displayedPos = "fixed";
        }
      }
    };
    setTimeout(displayEnquete,10000); //3秒後にアンケートを表示する
    controlDisplayPosition();
    $window.scroll(function() {
      windowScrollTop = $window.scrollTop();
      controlDisplayPosition();
    });
    var timer = false;
    $window.resize(function() {
      if(timer !== false) {
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
