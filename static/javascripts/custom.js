'use strict';

window.onload = function() {
    if( document.getElementById("mainmenu") != null ) {
        /* セクションクリック時の開閉トグル */
        $("#mainmenu li span").click(function(e) {
           $(this).toggleClass("expand closed") ;
           $(this).parent().children("ul").slideToggle();
            e.stopPropagation();
        });

       /* メニュー選択時にスクロール位置をクッキーに保存 */
       $("#mainmenu li a").click(function (e) {
           let pos = $("div.drawer").scrollTop();
           Cookies.set("dpos", pos);
       });

       /* 選択されたメニューのスクロール位置をクッキーから取り出す */
       let dpos = Cookies.get("dpos");

        if(dpos == undefined) {
            /* クッキーを持たない場合(=直リンクで開かれた場合) */
            /* 表示ページのメニュー位置をスクロール位置と設定 */
            let curnode = null;
            $("#mainmenu li a").each(function() {
                let url = $(this).attr("href");
                if(location.href.match(url)) {
                    dpos = $(this).parent().offset().top;
                    return false;
                }
            });
        }

        /* メニューを選択位置までスクロール */
       $("div.drawer").scrollTop(dpos);
    }

    if( document.getElementById("TableOfContents") != null ) {
        /* TOC選択による本文スクロール */
        $("#TableOfContents li").click(function() {
            let href = $(this).find("a").attr("href");
            let pos = $(href).offset().top;
            $("html, body").stop().animate({ scrollTop:pos });
            return false;
        });

        /* スクロール停止の検知イベント登録 */
        let scrollStop = new $.Event("scrollstop");
        let timer;
        function scrollStopTrigger() {
          if (timer) { clearTimeout(timer); }
          timer = setTimeout(function() { $(window).trigger(scrollStop) }, 20);
        }
        $(window).on("scroll", scrollStopTrigger);
        $("body").on("touchmove", scrollStopTrigger); //タッチデバイス向け

        /* TOCの1件目をハイライト(初期表示) */
        $("#TableOfContents li a").eq(0).addClass("current");

        /* TOCへのハイライト設定 */
        function moveHighlite() {
             let cur_pos = $(window).scrollTop() + 80;
            $(".article :header").each(function() {
                if(cur_pos >= $(this).offset().top) {
                   $("#TableOfContents li a").removeClass("current");
                   $("#TableOfContents li a[href='#" + $(this).attr("id") +"']").addClass("current");
                }
            });
        }

        /* bodyスクロール時にTOCのハイライトを移動 */
        $(window).on("scrollstop",function(e) {
              moveHighlite();
        });
    }

    /* ホームページの人気のトピックの開閉  */
     if( document.getElementById("hotArticles-showMore") != null ) {
        $("#hotArticles-showMore").click(function(e){
            $(this).toggleClass("expand closed") ;
            $("#hotArticles-others").slideToggle();
            e.stopPropagation();
        });
     }

     if( document.getElementById("langselector") != null ) {
        $("#langselector").click(function(e){
          $(this).find(".otherlanguage").toggle();
        });
        $(document).click(function(e) {
          if (!$(e.target).closest('#langselector').length) {
            $(".otherlanguage").hide();
          }
        });
     }
}
