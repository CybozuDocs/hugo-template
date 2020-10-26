'use strict';
(function() {
    window.onload = function() {
        /* 768pxは @media screen min-width の設定値 */
        let mobileSize = 768;
                
        /* スクロール停止の検知イベント登録 */
        let scrollStop = new $.Event("scrollstop");
        let timer;
        function scrollStopTrigger() {
          if (timer) { clearTimeout(timer); }
          timer = setTimeout(function() { $(window).trigger(scrollStop) }, 10);
        }
        $(window).on("scroll", scrollStopTrigger);

        /* Garoonの場合、ツリーナビゲーションのヘッダーを持つ */
        let hasTreeHead = false;
        if( document.getElementById("tree-head") != null) {
            hasTreeHead = true;
        }

        /* ツリーナビゲーションのスクロール対象 */
        let $tree = $("#tree-main");

        /* 言語切り替え */
        if( document.getElementById("lang-selector") != null ) {
            $("#lang-selector").click(function(e){
                let altsts = $(".alter-lang").css("display");
                if(altsts === "none") {
                    openAlterLangs();
                } else {
                    closeAlterLangs();
                }
            });
            $(document).click(function(e) {
              if (!$(e.target).closest('#lang-selector').length) {
                closeAlterLangs();
              }
            });

            $("#lang-selector").keydown(function (e) {
                let altsts = $(".alter-lang").css("display");
                let langlist = $(".lang-link");

                switch(e.which) {
                    case 13: // enter
                        if(altsts === "none") {
                            openAlterLangs();
                        } else {
                            closeAlterLangs();
                        }
                        break;
                    case 9: // tab
                        if(altsts === "block") {
                            let tl = langlist.index($(':focus')) + 1;
                            if(tl >= langlist.length) {
                                tl = 0;
                            }
                            langlist.eq(tl).focus();
                            return false;
                        }
                        break;
                    case 27: // esc
                        closeAlterLangs();
                        $(this).focus();
                        break;
                    case 38:  // up
                        let cl = langlist.index($(':focus'));
                        if((altsts === "block") && (cl === 0)) {
                            closeAlterLangs();
                            $(this).focus();
                        } else {
                            langlist.eq(cl -1).focus();
                        }
                        return false;
                        break;
                    case 40: // down
                        if(altsts === "none") {
                            openAlterLangs();
                            langlist.eq(0).focus();
                        } else {
                            let nl = langlist.index($(':focus')) + 1;
                            langlist.eq(nl).focus();
                        }
                        return false;
                        break;
                }
            });

            function openAlterLangs() {
                $("#lang-selector").attr("aria-expanded", "true");
                $(".alter-lang").css("display", "block");
                $(".alter-lang").attr("aria-hidden", "false");
            }

            function closeAlterLangs() {
                $(".alter-lang").attr("aria-hidden", "true");
                $(".alter-lang").css("display", "none");
                $("#lang-selector").attr("aria-expanded", "false");
            }
        }

        /* Topに戻るボタン */
        if( document.getElementById("goto-top") != null) {
            $("#goto-top").click(function () {
                $("html, body").stop().animate({ scrollTop:0 });
            });

            $(window).on("scrollstop",function(e) {
                if($(window).scrollTop() > 100) {
                    let bottompos = 30;
                    let postype = "fixed";
                    
                    let winHeight = $(window).height();
                    let winScrollTop = $(window).scrollTop();
                    let footerOffsetTop = $(".footer").offset().top;
                    
                    if ( (footerOffsetTop - winHeight) < winScrollTop ) {
                        bottompos += $(".footer").height();
                        postype = "absolute";
                    }
                    
                    if( document.getElementById("enquete") != null) {
                        if($("#enquete").css("display") === "block") {
                            if($("#enquete").css("position") === "fixed") {
                                bottompos += $("#enquete").height() + 10;
                            }
                        }
                    }
                    
                    $("#goto-top").css({position: postype, bottom: bottompos+"px"});
                    $("#goto-top").fadeIn('fast');
                } else {
                    $("#goto-top").fadeOut('fast');
                }
            });
        }

    /*** ツリーナビゲーション ***/

        // 選択時にスクロール位置をクッキーに保存させるイベントハンドラ
        $("#tree-nav li a").click(function (e) {
            let pos = $tree.scrollTop();
            // クッキーの有効期間は5秒間（クリックしてから再描画されるまでの時間を想定）
            let date = new Date();
            date.setTime( date.getTime() + ( 5000 ));
            Cookies.set("dpos", pos, { expires: date, samesite: "Lax"} );
        });

        // セクション開閉のイベントハンドラ
        $("#tree-nav .branch-icon").click(function(e) {
            let pu = $(this).parent().parent().children("ul");
            let ico = $(this).children("i");
            let pid = "#" + $(this).attr("aria-owns");

            if (ico.hasClass("fa-chevron-down")) {
                ico.removeClass("fa-chevron-down");
                ico.addClass("fa-chevron-right");
                $(this).attr("aria-expanded", "false");
            } else {
                ico.removeClass("fa-chevron-right");
                ico.addClass("fa-chevron-down");
                $(this).attr("aria-expanded", "true");
            }
            
            pu.slideToggle();
        });
        
        $("#tree-nav .branch-icon").keyup(function(e) {
            if (e.keyCode === 13) {
                $(this).click();
                e.stopPropagation();
                return false;
            }
        });

        // 本文スクロール時にツリーナビゲーションの高さ調節させるイベントハンドラ
        $(window).on("scrollstop",function(e) {
            adjustTreeHeight();
        });  


    /*** ツリーナビゲーション内TOC ***/

        // 本文内のh2とh3リンク
        let links = $("main :header").not("h1,h4,h5,h6");

        if(hasTreeHead　== true) {
            let toclinks = $("a.toclink");
            if(toclinks.length > 0) {
                toclinks.each(function() {
                    let pathname = $(this).prop("pathname");

                    // 表示中ページのTOCのみを対象
                    if(location.pathname == pathname) {
                        let pos = 0;
                        let url = $(this).prop("href");

                        links.each(function () {
                            // メニューのhrefと本文中のh2,h3タグのhrefが同じ場合
                            let target = location.origin + location.pathname + "#" + encodeURIComponent($(this).attr("pid"));

                            if(target.toLowerCase() === url) {
                                // 本文中のh2,h3タグの位置を取得
                                pos = $(this).offset().top - 50;
                            }
                        });

                        // アンカーリンク クリック時のイベントハンドラ
                        $(this).click(function() {
                            // h2,h3タグの位置まで本文をスクロール
                            $("html, body").stop().animate({ scrollTop:pos });
                            let href = $(this).prop("href");
                            location.replace(href);
                        });
                    }
                });

                // bodyスクロール時にTOCのハイライトを移動させるイベントハンドラ
                $(window).on("scrollstop",function(e) {
                    moveTreeTocHighlight();
                });
            }
        }

        /* ブラウザリサイズ時にツリーナビゲーションの高さを調整するイベントハンドラ */
        let resizetimer = false;
        $(window).resize(function() {
            if(resizetimer !== false) {
                clearTimeout(resizetimer);
            }

            resizetimer = setTimeout(function() {
                adjustTreeHeight();
            }, 500);
        }); 

        /* 画面スクロール時のツリーナビゲーション内TOCハイライト移動 */
        function moveTreeTocHighlight() {
            let tocMargin = 150;
            let locbase = location.origin + location.pathname + "#";
            let cur_pos = $(window).scrollTop() + tocMargin;

            if(cur_pos <= tocMargin ) {
                // ページの先頭
                setTreeTocHighlight(locbase);
                return false;
            }

            // 現在位置より上に位置するアンカーを配列に登録
            let ids = [];
            links.each(function() {
                if(cur_pos >= $(this).offset().top) {
                    let pid = $(this).attr("pid");
                    if(pid != "") {
                        ids.push($(this).attr("pid"));
                    } else {
                        ids.push($(this).prop("id"));
                    }
                }
            });
            
            let idcnt = ids.length;
            if(idcnt > 0) {
                // ツリーナビゲーションのハイライトを配列の最後のアンカーと同じIDに位置付ける
                let target = locbase + encodeURIComponent(ids[idcnt-1]);
                setTreeTocHighlight(target.toLowerCase());
            }
        }
            
        /* ナビゲーション内TOCのハイライト設定 */
        function setTreeTocHighlight(target) {
            $("a.toclink").removeClass("current");
            $("a.toclink").attr("aria-selected", "false");

            $("a.toclink").each(function() {
                if($(this).prop("href") === target) {
                    $(this).addClass("current");
                    $(this).attr("aria-selected", "true");

                    /* 省略中のツリー内にハイライトが移動した場合はツリーを展開させる */

                    /* 選択アイテムの親タグがtwig-parentである場合 */
                    let treeparent = $(this).closest(".twig-parent");
                    if( treeparent.length > 0 ) {
                            /* 開閉アイコンを取得 */
                            let tgicon = treeparent.closest("li").find("i");

                            if(tgicon.length > 0 ) {
                                /* ツリーが展開されてなければ展開させる */
                                if (tgicon.hasClass("fa-chevron-right")) {
                                    tgicon.click();
                                }
                            }
                    }

                    return false;
                }
            });
        };

        /* ツリーナビゲーションの位置と高さの調整 */
        function adjustTreeHeight(){
            if($(window).width() < mobileSize) {
                // モバイルサイズにリサイズした場合の設定リセット
                $("#tree-nav").css("height", "auto");
                $tree.css("height", "auto");
                if(hasTreeHead === true) {
                    $("#tree-nav").removeClass("fixed-tree");
                }
                return false;
            }

            if(hasTreeHead === true) {
                let menuheight = $(".g-nav").height() + $(".mega-nav").height();
                
                // メガメニューがスクロールアウトしたらツリーナビゲーションの位置を固定
                if(menuheight < $(window).scrollTop()) {
                    $("#tree-nav").addClass("fixed-tree");
                } else {
                    $("#tree-nav").removeClass("fixed-tree");
                }
            }

            /* 高さを調整  */
            let winHeight = $(window).height();
            let footerOffsetTop = $(".footer").offset().top;
            let winScrollTop = $(window).scrollTop();
            
            // 画面内に表示されているフッターの高さに応じたサイズ調整
            let wrapHeight = 0;
            let gap = 0;
            if(winScrollTop+winHeight-footerOffsetTop > 0) {
                gap = (winScrollTop+winHeight-footerOffsetTop);
            }

            if(hasTreeHead === true) {
                wrapHeight = winHeight - ($("#tree-nav").offset().top - winScrollTop) - gap;

                let mh = $("#main").height();
                if(wrapHeight > mh ) {
               　　　　 // 本文の高さがツリーナビゲーションより小さい場合
                    // ツリーナビゲーションの高さを本文に合わせる(スクロール時のリサイズループ防止)

                    // ヘッダーとフッターを除いた表示領域の高さ
                    let dh = winHeight - $(".header").height() - getTreeHeadHeight() - $(".footer").height() - 30;
                    if(mh > dh) {
                        wrapHeight = mh;
                    } else {
                        wrapHeight = dh;
                    }
                }

                $("#tree-nav").height(wrapHeight);
                wrapHeight = wrapHeight - getTreeHeadHeight() - 35;
            } else {
                wrapHeight = winHeight - $(".header").height() - gap;
                $("#tree-nav").height(wrapHeight);
            }

            $tree.height(wrapHeight);

            // 右ペインTOCのサイズ調整
            if( document.getElementById("page-toc") != null ) {
                let sbh = winHeight - $(".header").height() - 48 - gap;
                if( document.getElementById("enquete") != null ) {
                    sbh -= ($("#enquete").height() + 20);
                }
                $("#rightside-bar").height(sbh);

            }
        }

        function getTreeHeadHeight() {
            let th1 = 0;
            let th2 = 0;
            if($(".tree-title").length) {
                th1 = $(".tree-title").height();
            }
            if($(".tree-subtitle").length) {
                th2 = $(".tree-subtitle").height();
            }

            return th1 + th2;
        }


    /*** 右ペインTOC ***/  

        if( document.getElementById("rightside-bar") != null ) {
            // TOC構築
            let toclist = "<div id='page-toc'>";
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
                $(".toc-title").show();
                $("#rightside-bar").append(toclist);
            }

            //右ペインTOCのイベントハンドラ

            // TOC選択による本文スクロール
            $("#page-toc li").click(function() {
                let href = $(this).find("a").attr("href");
                let pos = $(href).offset().top;
                $("html, body").stop().animate({ scrollTop:pos });
                location.href = href;
                return false;
            });

            // TOCへのハイライト設定
            function moveTocHighlight() {
                 let cur_pos = $(window).scrollTop() + 80;
                $(".article :header").not(".article h1").each(function() {
                    if(cur_pos >= $(this).offset().top) {
                        $("#page-toc li a").removeClass("current");
                        $("#page-toc li a").attr("aria-selected", "false");
                        $("#page-toc li a[href='#" + $(this).attr("id") +"']").addClass("current");
                        $("#page-toc li a[href='#" + $(this).attr("id") +"']").attr("aria-selected", "true");
                    }
                });
            }

            // bodyスクロール時にTOCのハイライトを移動
            $(window).on("scrollstop",function(e) {
                moveTocHighlight();
            });
        }

    /*** ヘッダータグのパーマリンク  ***/
        $('div.heading-link').click(function() {
            let $popurl = $(this).children('div.heading-url');
            let $popurlInput = $popurl.children();

            if ($popurl.css('display') === "block") {
                $popurl.hide();

                $('.heading-link > a').attr({
                    'aria-selected': 'false',
                    'aria-expanded': 'false'
                });
                $popurl.attr({
                    'aria-expanded': 'false',
                    'aria-hidden': 'true'
                });
            } else {
                $popurl.show();
                $popurlInput.select();

                $('html').click(function() {
                    $(this).unbind('click.overlay');
                    $popurl.hide();
                }).show();

                $('.heading-link > a').attr({
                    'aria-selected': 'true',
                    'aria-expanded': 'true'
                });
                $popurl.attr({
                    'aria-expanded': 'true',
                    'aria-hidden': 'false'
                });
            }
            return false;
        });

        $('.heading-link').on('keydown', function(e) {
            if (e.keyCode === 13) {
                $(this).trigger('click');
            }
        })

        .children('div.heading-url')
        .bind('click', function(e) {
            e.stopPropagation();
        });

    /*** ホームページの人気のトピックの開閉  ***/
        if( document.getElementById("hotArticles-showMore") != null ) {
            $("#hotArticles-showMore").click(function(e){
                $(this).toggleClass("expand closed") ;
                $("#hotArticles-others").slideToggle();
                e.stopPropagation();
            });
        }


    /***  ページ表示時の処理 ***/

        if($(window).width() >= mobileSize) {
            /* モバイル画面以外の場合、処理を行う */

            let topMargin = 90;
            let $current = $("#tree-nav .current");
            adjustTreeHeight();

            // ハイライトを持つ場合
            if($current.length > 0) {
                // 選択されたアイテムのスクロール位置をクッキーから取り出す
                let dpos = Cookies.get("dpos");
                if(dpos === undefined) {
                    // クッキーを持たない場合(=直リンクで開かれた場合)
                    // 表示ページのメニュー位置をスクロール位置と設定
                    dpos = $current.offset().top - topMargin;
                }
                // ハイライト位置までスクロール
                $tree.scrollTop(dpos);

                if(hasTreeHead === true) {
                    // ナビゲーション内TOCの直リンク対応
                    let hash = location.hash;
                    if(hash != ""){
                        setTreeTocHighlight(location.href);
                    }
                }

                // 画面内に収まっていない場合の表示補正
                let curpos = $current.offset().top;
                let dtop = $tree.offset().top;
                if((curpos < dtop) || (curpos > (dtop + $tree.height())) ){
                       $tree.scrollTop(curpos - topMargin);
                }
            } else {
                // ハイライトを持たない場合、先頭に位置付け
                $tree.scrollTop(0);
            }

            if( document.getElementById("page-toc") != null ) {
                // 右ペインTOCの先頭にハイライト設定
                $("#page-toc li a").eq(0).addClass("current");
                $("#page-toc li a").eq(0).attr("aria-selected", "true");
            }
        }


    /*** コンテンツ修正 ***/

        let tables = $("article table")
        if( tables != null ) {
            tables.each( function() {
              $(this).wrap("<div class='wrapTable'></div>");
            });
        }
    }

})();
