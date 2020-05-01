'use strict';

window.onload = function() {
    if( document.getElementById("mainmenu") != null ) {
        /* セクションクリック時の開閉トグル */
        $("#mainmenu").find(".navi-icon").click(function(e) {
        //    $(this).parent().toggleClass("expand");
            let ico = $(this).children("i");
            if (ico.hasClass("fa-chevron-down")) {
                ico.removeClass().addClass('fa fa-chevron-right');
            } else {
                ico.removeClass().addClass('fa fa-chevron-down');
            }
            $(this).parent().parent().children("ul").slideToggle();
        });

        /* メニュー選択時にスクロール位置をクッキーに保存させるイベントハンドラ */
        $("#mainmenu li a").click(function (e) {
            let pos = $(".drawer").scrollTop();
            let date = new Date();
            date.setTime( date.getTime() + ( 5000 ));
            $.cookie("dpos", pos, { expires: date });
        });

        /* 選択されたメニューのスクロール位置をクッキーから取り出す */
        let dpos = $.cookie("dpos");
        if(dpos == undefined) {
            /* クッキーを持たない場合(=直リンクで開かれた場合) */
            /* ハイライト位置をスクロール位置と設定 */
            dpos = $("#mainmenu .current").offset().top - 90;
        }

        /* メニューを選択位置までスクロール */
        $(".drawer").scrollTop(dpos);

        /* 画面内に収まっていない場合の表示補正 */
        let curpos = $("#mainmenu .current").offset().top;
        let dtop = $(".drawer").offset().top;
        if((curpos < dtop) || (curpos > (dtop + $(".drawer").height())) ){
                $(".drawer").scrollTop($("#mainmenu .current").offset().top - 90);
        } 
    }

    let tocdiv =  document.getElementById("sidebar-toc");
    if( tocdiv != null ) {
        /* TOC構築 */
        let toclist = "<div id='TableOfContents'>";
        let curlevel = 0;
        let existsToc = 0;
        $(".article h2,.article h3,.article h4").each(function() {
            let href = $(this).attr("id");
            let val = $(this).text();
            let taglevel = Number($(this).prop("tagName").substr(1,1));

            while(curlevel < taglevel) {
                toclist += "<ul>";
                curlevel++;
            }

            while(curlevel > taglevel) {
                toclist += "</ul>";
                curlevel--;
            }

            if(val != "") {
                toclist += "<li><a href='#" + href + "'>" + val + "</a></li>";
            }
            existsToc++;
        });
        toclist += "</div>";
        if( existsToc > 0 ){
            $(".tocTitle").show();
            $("#sidebar-toc").append(toclist);
        }
    }

    if( document.getElementById("TableOfContents") != null ) {
        /* TOC選択による本文スクロール */
        $("#TableOfContents li").click(function() {
            let href = $(this).find("a").attr("href");
            let pos = $(href).offset().top;
            $("html, body").stop().animate({ scrollTop:pos });
            location.href = href;
            return false;
        });

        /* スクロール停止の検知イベント登録 */
        let scrollStop = new $.Event("scrollstop");
        let timer;
        function scrollStopTrigger() {
          if (timer) { clearTimeout(timer); }
          timer = setTimeout(function() { $(window).trigger(scrollStop) }, 5);
        }
        $(window).on("scroll", scrollStopTrigger);
        $("body").on("touchmove", scrollStopTrigger); //タッチデバイス向け

        /* TOCの1件目をハイライト(初期表示) */
        $("#TableOfContents li a").eq(0).addClass("current");

        /* TOCへのハイライト設定 */
        function moveHighlite() {
             let cur_pos = $(window).scrollTop() + 80;
            $(".article :header").not(".article h1").each(function() {
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
     let tables = $("article table")
     if( tables != null ) {
        tables.each( function() {
          $(this).wrap("<div class='wrapTable'></div>");
        });
     }
}
