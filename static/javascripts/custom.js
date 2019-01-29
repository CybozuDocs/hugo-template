'use strict';

window.onload = function() {
    if( document.getElementById("mainmenu") != null ) {
        /* セクションクリック時の開閉トグル */
        $("#mainmenu").find(".navi-icon").click(function(e) {
        //    $(this).parent().toggleClass("expand");
            let ico = $(this).children("i");
            if (ico.hasClass("fa-minus-circle")) {
                ico.removeClass().addClass('fa fa-plus-circle');
            } else {
                ico.removeClass().addClass('fa fa-minus-circle');
            }
            $(this).parent().parent().children("ul").slideToggle();
        });

       /* メニュー選択時にスクロール位置をクッキーに保存 */
       $("#mainmenu li a").click(function (e) {
           let pos = $(".drawer").scrollTop();
           $.cookie("dpos", pos);
           // Cookies.set("dpos", pos);
       });

       /* 選択されたメニューのスクロール位置をクッキーから取り出す */
       // let dpos = Cookies.get("dpos");
       let dpos = $.cookie("dpos");

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
       $(".drawer").scrollTop(dpos);
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
