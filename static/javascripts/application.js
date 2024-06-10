'use strict';
(function() {
    window.addEventListener('load', function() {

        if (typeof WOVN !== 'undefined') {
                setTimeout(() => {
                    if (document.getElementById("wovn-additional-buttons") !== null) {
                        if (typeof OneTrust !== 'undefined') {
                            OneTrust.Close();
                        }

                        if( document.getElementById("enquete") !== null) {
                            $("#enquete").css("display", "none");
                        }

                        if( document.getElementById("goto-top") !== null) {
                            $("#goto-top").css("display", "none");
                        }

                        if( document.getElementsByClassName("locale-modal").length > 0) {
                            $(".locale-modal").hide();
                            setSessionValue("locale_modal", { disabled: "1" });
                        }
                    }

                    const wovnCode = WOVN.io.getCurrentLang().code;
                    const atags = document.getElementsByTagName("a");
                    if (atags.length > 0) {
                        const curProd = location.pathname.split("/");
                        const tgProd = curProd[1] === "k" ? "general" : "k";
                        const basePath = `/${tgProd}/en/`;
                        const destPath = `/${tgProd}/${wovnCode}/`;
                        const atagArr = Array.from(atags);
                        atagArr.forEach((a) => {
                            if (a.href.includes(basePath)) {
                                a.href = a.href.replace(basePath, destPath);
                            };
                        });
                    }

                }, "2000");
        }

        // 1059px と 768px は css における@media screen min-width の設定値
        const pcSize = 1059;
        const mobileSize = 768;

        // 現在のURL
        const cururl = location.pathname;
        const url_parts = cururl.split("/");

        // 対応言語
        const languages = ["en", "ja", "zh", "zh-tw"];

        // メガメニュー有無のフラグ
        let hasMegaNav = false;
        let hasMegaNavSecond = false;
        if( document.getElementsByClassName("mega-nav").length > 0) {
            hasMegaNav = true;
            if( document.getElementsByClassName("mega-tab-short").length > 0) {
                hasMegaNavSecond = true;
            }
        }

        // ツリーナビゲーションのdiv
        const $tree = $("#tree-main");

        // ツリーナビゲーションヘッダー有無のフラグ
        let hasTreeHead = false;
        if( document.getElementById("tree-head") != null) {
            hasTreeHead = true;
        }

        // ツリーナビゲーションJSONモード
        let json_mode = false;
        if( document.getElementsByClassName("tree-base").length > 0) {
            json_mode = true;
        }

        // スクロール停止の検知イベント登録
        const scrollStop = new $.Event("scrollstop");
        let timer;
        function scrollStopTrigger() {
          if (timer) { clearTimeout(timer); }
          timer = setTimeout(function() { $(window).trigger(scrollStop) }, 10);
        }
        $(window).on("scroll", scrollStopTrigger);

        // ID検索
        if( document.getElementById("id-panel") != null ) {
            let searching = false;
            const $idinput = $("#id-input");
            const $idbtn = $("#id-search-disp");
            const $idmsg = $("#id-message");
            $idinput.focus();

            $idinput.keydown(function(e) {
                switch(e.which) {
                case 13: 
                    dispTarget();
                }
            });

            $idbtn.click(function(e) {
                dispTarget();
            });

            function resetForm() {
                $idinput.prop("disabled", false);
                $idbtn.prop("disabled", false);
                $idbtn.removeClass("id-button-disabled");
                searching = false;
                $idinput.focus();
            }

            function setmessage(msgid) {
                if((typeof id_error_msg !== 'undefined') && (id_error_msg.length > msgid)){
                    $idmsg.text(id_error_msg[msgid - 1])
                } else {
                    $idmsg.text("");
                }
            }

            function zenToHan(orgStr) {
                return orgStr.replace(/[０-９]/g, function(str) {
                    return String.fromCharCode(str.charCodeAt(0) - 0xFEE0);
                });
            }

            function dispTarget() {
                if (searching === true) {
                    return false;
                }

                $idinput.prop("disabled", true);
                $idbtn.prop("disabled", true);
                $idbtn.addClass("id-button-disabled");
                searching = true;
                let idval = ($idinput.val());

                idval = zenToHan(idval);

                if(Number.isNaN(Number(idval))) {
                    setmessage(2);
                    resetForm();
                    return false;
                }

                if((idval === "") || (idval.length < 4 )) {
                    setmessage(1);
                    resetForm();
                    return false;
                }

                const prodid = idval.substring(0, 3);
                let prodpath = "";
                switch(prodid) {
                    case "010":
                        prodpath = "/";
                        break;
                    case "020":
                        prodpath = "/general/";
                        break;
                    case "030":
                        prodpath = "/store/";
                        break;
                    case "040":
                        prodpath = "/k/";
                        break;
                    case "050":
                        prodpath = "/s/";
                        break;
                }

                const uri = new URL(window.location.href);
                const pname = uri.pathname;
                const pathes = pname.split("/");

                if(pathes.length >= 3) {
                    let langid = "";
                    if (languages.includes(pathes[1])) {
                        // URLの２階層目が言語情報（製品IDを含まない）
                        langid = pathes[1];
                    } else {
                        langid = pathes[2];
                    }

                    let tg = prodpath + langid + "/id/" + idval + ".html";

                    const xhr = new XMLHttpRequest();
                    xhr.open("GET", tg);
                    xhr.onload = function() {
                        if(this.status !== 200) {
                            setmessage(3);
                            resetForm();
                        } else {
                            location.href = tg;
                        }
                    };

                    xhr.ontimeout = function() {
                        setmessage(4);
                        resetForm();
                    };

                    xhr.onerror = function() {
                        setmessage(5);
                        resetForm();
                    };

                    xhr.send();

                }
            }
        }

        // 言語切り替え
        if( document.getElementById("lang-selector") != null ) {
            if (typeof WOVN !== 'undefined') {
                window.addEventListener('wovnLangChanged', function () {
                    const wovnobj = WOVN.io.getCurrentLang();
                    const wovnlang = wovnobj.name;
                    const wovncode = wovnobj.code;

                    if (wovncode !== "en") {
                        changeSelectedLang(wovncode, wovnlang);
                        setDisclamer(wovncode);
                    }
                });
            }

            initLanguageSelector();
        }

        function initLanguageSelector() {
            const $langbtn = $("#lang-selector");
            const $langlist = $("#alter-lang");
            const $alllangs = $('#alter-lang [role="option"]');
            const $firstitem = $alllangs.eq(0);

            $langlist.attr("aria-activedescendant", $firstitem.attr("id"));
            $firstitem.addClass("selectlang");
            $firstitem.attr("aria-selected", "true");  
                            
            $langbtn.click(function(e){
                if($langbtn.attr("aria-expanded") === "true") {
                    closeAlterLangs();
                } else {   
                    openAlterLangs();
                }
            });
            $(document).click(function(e) {
              if (!$(e.target).closest('#lang-selector').length) {
                closeAlterLangs();
              }
            });
            
            $langbtn.keydown(function (e) {
                switch(e.which) {
                    case 27: // esc
                        closeAlterLangs();
                        $(this).focus();
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        break;
                    case 13: // enter
                    case 32: // space
                        if($langbtn.attr("aria-expanded") === "true") {
                            closeAlterLangs(); 
                        } else {
                            let $curlang = $("#alter-lang .selectlang");
                            if ($curlang.length <= 0) {
                                $firstitem.addClass("selectlang");
                                $firstitem.attr("aria-selected", "true");  
                            }
                            
                            openAlterLangs();
                        }
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        break;
                }
            });
            
            $langlist.hover(function (e) {
                const $curlang = $("#alter-lang .selectlang");
                    
                if ($curlang.length > 0) {
                    $curlang.removeClass("selectlang");
                    $curlang.removeAttr("aria-selected");  
                }
            });
            
            $langlist.click(function (e) {
                const $curlang = $("#" + e.target.parentElement.id);
                $("#displang").prop("innerText", $curlang.prop("innerText"));
                $langbtn.attr("disabled", "true");
                location.href = $curlang.attr("desturl");
            });
            
            $langlist.keydown(function (e) {
                const $curlang = $("#alter-lang .selectlang");
                const langs = $('#alter-lang [role="option"]');
                
                switch(e.which) {
                    case 9: // tab
                    case 27: // esc
                    case 32: // space
                        closeAlterLangs();
                        $langbtn.focus();
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        break;
                    case 13: // enter
                        closeAlterLangs();
                        $("#displang").prop("innerText", $curlang.prop("innerText"));
                        $langbtn.focus();
                        $langbtn.attr("disabled", "true");
                        location.href = $curlang.attr("desturl");
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        break;
                    case 38:  // up
                        $curlang.removeClass("selectlang");
                        $curlang.removeAttr("aria-selected");
                        
                        let cl = langs.index($curlang) - 1;
                        if ( cl < 0 ) {
                            cl = langs.length - 1;
                        }
                        langs.eq(cl).addClass("selectlang");
                        langs.eq(cl).attr("aria-selected", "true");  
                        
                        $(this).attr("aria-activedescendant", langs.eq(cl).attr("id"));
                        
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        return false;
                        break;
                    case 40: // down
                        $curlang.removeClass("selectlang");
                        $curlang.removeAttr("aria-selected");
                        
                        let nl = langs.index($curlang) + 1;
                        if (nl >= langs.length) {
                            nl = 0;
                        }
                        langs.eq(nl).addClass("selectlang");
                        langs.eq(nl).attr("aria-selected", "true");
                        
                        $(this).attr("aria-activedescendant", langs.eq(nl).attr("id"));
                        
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        return false;
                        break;
                }
            });

            function openAlterLangs() {
                $langbtn.attr("aria-expanded", "true");
                $langlist.css("display", "block");
                $langlist.removeAttr("aria-hidden");
                $langlist.attr("tabindex", "0");
                $langlist.focus();
            }

            function closeAlterLangs() {
                $langlist.attr("aria-hidden", "true");
                $langlist.css("display", "none");
                $langlist.attr("tabindex", "-1");
                $langbtn.attr("aria-expanded", "false");
            }
        }

        // WOVN 言語選択メニューの更新
        function changeSelectedLang(langcode, langtext) {
            // ボタンの文字に現在表示中の言語を設定
            const $displang = $("#displang");
            $displang[0].innerText = langtext;
            const $alllangs = $('#alter-lang [role="option"]');

            // 言語リストの先頭に英語を追加
            const cururl = location.href;
            const enurl = cururl.replace("/"+langcode+"/", "/en/");
            const $enli = $("<li>", {
              id: "lang_item_en-us",
              class: "lang-item",
              role: "option",
              desturl: enurl
            }).insertBefore($alllangs[0]);

            $("<span>", {
              class: "lang-title",
              text: "English"
            }).appendTo($enli);

            // 表示中の言語を言語リストから削除
            const $deltarget = $("#lang_item_" + langcode);
            $deltarget.remove();
        }

        // WOVN 機械翻訳免責文言の表示
        function setDisclamer(langcode) {
            const $disc2 = $("#disclaimer2");
            if ($disc2.length > 0) {
                const paths = location.pathname.split("/");
                fetch("/" + paths[1] + "/json/" + langcode + "/message.json")
                    .then(response => response.json())
                    .then((data) => { 
                        $disc2.text(data.disclamer);
                        $disc2.css("display", "block");
                    });
            }
        }


        function calculateBottomPosition() {
            let bottompos = 20;

            const winHeight = $(window).height();
            const winScrollTop = $(window).scrollTop();
            let footadjust = true;

            // アンケートボタン分の補正
            if($("#enquete").css("display") !== "none") {
                if($("#enquete").css("position") === "absolute") {
                    const enqOffsetTop = $("#enquete").offset().top;
                    if ( (enqOffsetTop - winHeight) < winScrollTop ) {
                        bottompos += winScrollTop - (enqOffsetTop - winHeight);
                    }
                    footadjust = false;
                } else {
                    bottompos += $("#enquete").outerHeight();
                }
            }

            if(footadjust === true) {
                // 表示されてるフッター分の補正
                const footerOffsetTop = $(".footer").offset().top;
                if ( (footerOffsetTop - winHeight) < winScrollTop ) {
                    bottompos += winScrollTop - (footerOffsetTop - winHeight);
                }
            }

            return bottompos;
        }

        // サポートボタンの位置調整
        function adjustSupportInquiry() {
            let strBottom = "0px";
            let posType = "fixed";
            if (window.innerWidth > pcSize) {
                strBottom = (calculateBottomPosition() - 10) + "px";
            } else {
                let bottompos = $("#page-footer").outerHeight();
                if ($("#enquete").length > 0) {
                    bottompos += $("#enquete").outerHeight();
                }
                strBottom = bottompos + 10 + "px";
                posType = "absolute";

                // アンケートボタンのための余白を確保
                if (window.innerWidth < mobileSize) {
                    $("#tree-nav").css({paddingBottom: "60px"});
                } else {
                    $("#page").css({paddingBottom: "60px"});
                }
            }

            $("#support-inquiry").css({position: posType, bottom: strBottom});
        }

        // チャットボタン
        let ct_enabled = false;
        if(typeof zE === "function") {
            // ZendeskAPI関数が存在すればチャットが有効
            ct_enabled = true;

            // 右ペイン余白確保
            $("#contents").addClass("contents-with-chat");

            let ctpos = 0;
            if (window.innerWidth > pcSize) {
                if($("#enquete").css("bottom") == "0px") {
                    // アンケートボタンの上の位置
                    ctpos =  $("#enquete").css("height");
                }

                if(document.body.scrollHeight - $(window).outerHeight() <= 1 ) {
                    // スクロールが発生していない画面
                    ctpos =  $("#page-footer").outerHeight() + $("#enquete").outerHeight();
                }
            }

            // チャットボタンの初期設定
            zE("webWidget", "updateSettings", {
                webWidget: {
                    offset: {
                        horizontal: "40px",
                        vertical: ctpos,
                        mobile: {
                            horizontal: "left",
                            vertical: "bottom"
                        }
                    },
                    launcher: {
                        chatLabel: {'ja': 'チャット サポート'}
                    },
                    color: {
                        launcher: "#ff9900",
                        launcherText: "#000"
                    }
                }
            });
        }


        // Topに戻るボタンのクリックイベント
        $("#goto-top").click(function () {
            $("html, body").stop().animate({ scrollTop:0 });
        });



    /*** ツリーナビゲーション ***/
        // jsTree.js の初期化
        function initJstree() {
            if (json_mode === true) {
                const date = $('meta[name="date"]').attr("content");
                const jsonurl = "/" + url_parts[1] + "/" + url_parts[2] + "/pagetree.json?" + date;
                $tree.jstree({"core": { "data" : { "url" : jsonurl } } });
            }
            else
            {
                $tree.jstree();
            }

            $tree.on("ready.jstree", function (e, data) {
                // jsTreeの初期化処理完了後に画面表示
                $tree.css("display", "block");

                initPage();
            });

            $tree.on("open_node.jstree", function(e, data) {
                // 開閉しても現在位置のハイライトを維持する
                const currentNodeId = data.node.children.find(function(id) {
                    const currentNodeHref = $("#" + id).find(".jstree-anchor").attr("href");
                    return currentNodeHref === location.pathname;
                });
                if (currentNodeId) {
                    $("#" + currentNodeId).find(".jstree-anchor").addClass("current");
                }
            });

            $tree.on("changed.jstree", function (e, data) {
                if (data.action === "select_node") {
                    const pos = $tree.scrollTop();
                    // 選択時にスクロール位置を保存する
                    setSessionValue("dpos", pos);

                    // リンククリック対応
                    let newurl = data.node.a_attr.href;
                    
                    if (typeof WOVN !== 'undefined') {
                        const wovncode = WOVN.io.getCurrentLang().code;
                        newurl = newurl.replace("/en/", "/" + wovncode + "/");
                    }

                    if (newurl !== "") {
                        if ((data !== undefined) 
                            && ("originalEvent" in data.event)
                            && (data.event.originalEvent.key === "Enter")) {

                            // キーボード操作で選択されたフラグを保存する
                            setSessionValue("keydn", "true");
                        }

                        if (newurl.indexOf("#") !== -1) {
                            let newParts = newurl.split("#");
                            let curParts = location.pathname.split("#");
                            if (newParts[0] === curParts[0]) {
                                // ページ内アンカーへ移動
                                moveToAnchor(newurl);
                            } else {
                                location.href = newurl;
                            }
                        } else {
                            location.href = newurl;
                        }
                    }
                }
            });
        }

        if (typeof $tree.jstree !== "function") {
            setTimeout(() => {
                initJstree();
            }, "1000")
        } else {
            initJstree();
        }

        $tree.keydown(function (e) {
            // Tabキーでツリーナビゲーションから抜けるとき、キー操作フラグを消す
            if(e.which === 9) {
                sessionStorage.removeItem("keydn");
            }
        });

        // 本文内のh2とh3
        const allLinks = $("#main h2, #main h3");
        // 本文内のh2
        const h2Links = $("#main h2");

        // ページ内アンカーへの移動
        function moveToAnchor(destUrl) {
            let pos = 0;
            allLinks.each(function () {
                // destUrlと本文中のh2,h3タグのhrefが同じ場合
                let ancUrl = location.pathname + "#" + encodeURIComponent($(this).attr("pid"));

                if(ancUrl.toLowerCase() === destUrl) {
                    // 本文中のタグの位置を取得
                    pos = $(this).offset().top - 50;

                    // アンカーの位置まで本文をスクロール
                    $("html, body").stop().animate({ scrollTop:pos });
                    location.replace(destUrl);
                }
            });
        }

        // ブラウザリサイズ対応
        let resizetimer = false;
        $(window).resize(function() {
            if(resizetimer !== false) {
                clearTimeout(resizetimer);
            }

            resizetimer = setTimeout(function() {
                switchParts(window.innerWidth < mobileSize);
                adjustTreeHeight();

                if(ct_enabled === true) {
                    // チャットをボタンに戻す
                    zE("webWidget", "close");
                }

                if ($("#support-inquiry").length > 0) {
                    // サポートボタンの位置修正
                    adjustSupportInquiry();
                }

            }, 1000);
        }); 

        // ツリーナビゲーションの位置と高さの調整
        function adjustTreeHeight(){
            if($tree.length <= 0) return false;

            if(window.innerWidth < mobileSize) {
                // モバイルサイズにリサイズした場合の設定リセット
                $("#tree-nav").css("height", "auto");
                $tree.css("height", "auto");
                if(hasMegaNav === true) {
                    $("#tree-nav").removeClass("fixed-tree");
                }
                return false;
            }

            if(hasMegaNavSecond === true) {
                $("#tree-nav").addClass("fixed-tree");
            } else if(hasMegaNav === true) {
                const menuheight = $(".g-nav").height() + $(".mega-nav").height();

                // メガメニューがスクロールアウトしたらツリーナビゲーションの位置を固定
                if(menuheight < $(window).scrollTop()) {
                    $("#tree-nav").addClass("fixed-tree");
                } else {
                    $("#tree-nav").removeClass("fixed-tree");
                }
            }

            // 高さを調整
            const winHeight = $(window).outerHeight();
            const footerOffsetTop = $(".footer").offset().top;
            const winScrollTop = $(window).scrollTop();
            
            // 画面内に表示されているフッターの高さに応じたサイズ調整
            let wrapHeight = 0;
            let footHeight = 0;
            if(winScrollTop + winHeight - footerOffsetTop > 0) {
                footHeight = (winScrollTop + winHeight - footerOffsetTop);
            }

            if(hasMegaNav === true) {
                // pageの高さ
                const pageHeight = $("#page").outerHeight();

                // treeの表示領域域の高さ
                wrapHeight = winHeight - ($("#tree-nav").offset().top - winScrollTop) - footHeight;

                $("#tree-nav").height(wrapHeight);
                wrapHeight = wrapHeight - getTreeHeadHeight();
            } else {
                wrapHeight = winHeight - $(".header").outerHeight() - footHeight;
                $("#tree-nav").height(wrapHeight);
            }

            $tree.height(wrapHeight);

            // 右ペインTOCのサイズ調整
            if( document.getElementById("rightside-bar") != null ) {
                let sbh = winHeight - $(".header").outerHeight(true) - footHeight - 10;
                if( document.getElementsByClassName("mega-nav-bar").length ) {
                   sbh -= ($(".mega-nav-bar").outerHeight(true) + 10);
                }
                if( document.getElementById("enquete") != null ) {
                   sbh -= ($("#enquete").outerHeight(true));
                }
                if( document.getElementById("support-inquiry") != null ) {
                    sbh -= ($("#support-inquiry").outerHeight(true) + 10);
                }
                $("#rightside-bar").height(sbh);
            }
        }

        // ツリーナビゲーションヘッダーの高さ取得
        function getTreeHeadHeight() {
            if (hasTreeHead == false) {
                return 0;
            }

            let th1 = 0;
            let th2 = 0;
            if($(".tree-title").length) {
                th1 = $(".tree-title").outerHeight();
            }
            if($(".tree-subtitle").length) {
                th2 = $(".tree-subtitle").outerHeight();
            }

            return th1 + th2;
        }

        // ツリーナビゲーション位置の入れ替え
        function switchParts(mobile) {
            const head = document.getElementById("head");
            const search = document.getElementById("search");
            const lang = document.getElementById("lang");
            
            if((search != null) && (lang != null)) {
                if (mobile === true) {
                    head.insertBefore(lang, search);
                } else {
                    head.insertBefore(search, lang);
                }
            }
            
            const page = document.getElementById("page");
            const tree = document.getElementById("tree");
            const contents = document.getElementById("contents");
            
            if ((tree != null) && (contents != null)) {
                if (mobile === true) {
                    if ($(page).children().first().attr("id") === "tree") {
                        page.insertBefore(contents,tree);
                    }
                } else {
                    if ($(page).children().first().attr("id") === "contents") {
                        page.insertBefore(tree, contents);
                    }
                }
            }
        }

        // 現在ページのノードまでツリーを展開する
        function expandCurrentNode() {
            const parts_len = url_parts.length;
            let target_node = $tree;
            let target_url = "/" + url_parts[1] + "/" + url_parts[2];
            let links = null;

            for(let i=3; i<parts_len; i++) {
                links = target_node.find(".jstree-anchor");

                if(links.lenght <= 0) {
                    return false;
                }

                target_url = target_url + "/" + url_parts[i];
                let param_url = target_url;
                let last = false;
                if(i >= (parts_len - 1)) {
                    last = true;
                } else {
                    param_url = param_url + ".html"
                }
                target_node = openNode(links, param_url, last);
            }
        }

        // 対象のURLのAタグを含むノードを展開する
        // 最終ノードの場合はハイライトを設定する
        function openNode(links, url, last) {
            let reto = null;
            links.each(function() {
                if ($(this).attr("href") === url) {
                    if(last === true) {
                        $(this).addClass("current");
                        // 子ノードを持つ場合は展開させる
                        if ($(this).parent().hasClass("jstree-closed")) {
                            $tree.jstree("open_node", $(this).parent().attr("id"));
                        }
                    } else {
                        $tree.jstree("open_node", $(this).parent().attr("id"));
                        reto = $(this).parent();
                    }
                    return false;
                }
            });
            return reto;
        }

    /*** ツリーナビゲーション内TOC ***/

        // ツリーナビゲーションヘッダーを持つ(=ツリー内TOCを保つ場合)
/*
        if(hasTreeHead == true) {
            // bodyスクロール時にツリーナビゲーションTOCのハイライトを移動させるイベントハンドラ
            $(window).on("scrollstop",function(e) {
                moveTreeTocHighlight();
            });
        }
*/

        // 画面スクロール時のツリーナビゲーション内TOCハイライト移動
        function moveTreeTocHighlight() {
            // ツリーの第一階層が展開されてなければ展開させる
            $("a.toclink").each(function() {
                if ($(this).attr("href") === "#") {
                    $tree.jstree("open_node", $(this).prop("id"));
                }
            });

            const tocMargin = 150;
            const locbase = location.origin + location.pathname + "#";
            // 本文のスクロール位置
            const cur_pos = $(window).scrollTop() + tocMargin;

            if(cur_pos <= tocMargin ) {
                // ページの先頭
                setTreeTocHighlight(locbase);
                return false;
            }

            // 本文の先頭にあるアンカー情報の取得
            let anc = "";
            let ctag = "";
            allLinks.each(function() {
                if(cur_pos >= $(this).offset().top) {
                    anc = $(this).attr("pid");
                    ctag = $(this).prop("nodeName");
                }
            });

            if(ctag === "H3") {
                // h3タグの場合、直前のh2タグを探す
                let lasth2 = null;
                h2Links.each(function() {
                    if(cur_pos > $(this).offset().top) {
                        lasth2 = $(this).attr("pid");
                    }
                });

                // ツリーナビゲーションでh2が展開されていない場合は展開させる
                if (lasth2 !== null) {
                    expandParentNode(lasth2);
                }
            }

            let target = locbase;
            if (anc !== "") {
                target = target + encodeURIComponent(anc);
            }
            setTreeTocHighlight(target.toLowerCase());
        }

        // ナビゲーション内TOCのハイライト設定
        function setTreeTocHighlight(target) {
            const toclinks = $("a.toclink");
            toclinks.removeClass("current");

            toclinks.each(function() {
                if($(this).prop("href") === target) {

                    $(this).addClass("current");

                    const keydn = getSessionValue("keydn");
                    if (keydn === "true") {
                        $(this).focus();
                    }

                    // ハイライトが画面内に収まっていない場合の表示補正
                    const hilightTop = $(this).offset().top;
                    const treeTop = $tree.offset().top;
                    const hilightHeight = $(this).prop("offsetHeight");

                    if ((hilightTop + hilightHeight) > (treeTop + $tree.height())) {
                        // ツリーの下にはみ出す場合
                        if ($tree.scrollTop() <= 0) {
                            $tree.scrollTop(hilightTop - treeTop);
                        } else {
                            $tree.scrollTop($tree.scrollTop() + hilightHeight);
                        }
                        
                    } else if (hilightTop < treeTop) {
                        // ツリーの上にはみ出す場合
                        $tree.scrollTop($tree.scrollTop() - hilightHeight);
                    }

                    return false;
                }
            });
            return null;
        };

        // ツリーの親ノードを展開させる
        function expandParentNode(anc) {
            let litag =  null;
            $("a.toclink").each(function() {
                if ($(this).prop("href").indexOf(anc) !== -1) {
                    // 対象となるアンカーの親のliタグを取得
                    litag = $(this).closest("li");
                    if (litag !== null ) {
                        // ツリーが展開されてなければ展開させる
                        if (litag.hasClass("jstree-closed")) {
                            let lid = litag.prop("id");
                            $tree.jstree("open_node", lid);
                        }
                    }
                    return false;
                }
            });
        }

        // データをセッションストレージに保存
        function setSessionValue(key, val) {
            const newval = JSON.stringify({
                value: val,
                timestamp: new Date().getTime()
            });

            sessionStorage.setItem(key, newval);
        }

        // セッションストレージの更新が5秒以内であればvalueの値を返す
        // 5秒は、クリックしてから再描画までの間を想定
        function getSessionValue(key) {
            let retval = null;
            const strval = sessionStorage.getItem(key);

            if(strval !== null) {
                const d = JSON.parse(strval);
                const intval = Number(d.timestamp);
                const now =  new Date().getTime();

                if(now - intval < 5000) {
                    retval = d.value;
                } 

                // 使用後は削除
                sessionStorage.removeItem(key);
            }

            return retval;
        }

    /*** 右ペインTOC ***/  

        if( document.getElementById("rightside-bar") != null ) {
            // TOC構築
            let toclist = "<div id='page-toc'>";
            let curlevel = 0;
            let existsToc = 0;
            $(".article h2,.article h3,.article h4").each(function() {
                let href = $(this).attr("pid");
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

            // 右ペインTOCのイベントハンドラ

            // TOC選択による本文スクロール
            $("#page-toc li").click(function() {
                const href = $(this).find("a").attr("href");
                const pos = $(href).offset().top;
                $("html, body").stop().animate({ scrollTop:pos - 20 });
                location.href = href;
                return false;
            });
        }

        // TOCへのハイライト設定
        function moveTocHighlight() {
             const cur_pos = $(window).scrollTop() + 80;
            $(".article :header").not(".article h1").each(function() {
                if(cur_pos >= $(this).offset().top) {
                    $("#page-toc li a").removeClass("current");
                    $("#page-toc li a").attr("aria-selected", "false");
                    $("#page-toc li a[href='#" + $(this).attr("pid") +"']").addClass("current");
                    $("#page-toc li a[href='#" + $(this).attr("pid") +"']").attr("aria-selected", "true");
                }
            });
        }

    /*** 本文内ヘッダータグのパーマリンク  ***/
    
        if ($('.heading-button').length > 0 ) {
            $('.heading-button').click(function() {
                const $popurl = $(this).parent().children('div.heading-url');
                const $popurlInput = $popurl.children();

                if ($popurl.css('display') === "block") {
                    $popurl.hide();
                    $popurl.attr('aria-hidden', 'true');
                    $(this).attr('aria-expanded', 'false');
                } else {
                    $popurl.show();
                    $popurlInput.select();

                    $('html').click(function() {
                        $(this).unbind('click.overlay');
                        $popurl.hide();
                    }).show();

                    $popurl.attr('aria-hidden', 'false');
                    $(this).attr('aria-expanded', 'true');
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
        }
        
        // IDリンク
        const hids = $(".id-link-button");
        if(hids.length > 0) {
            hids.click(function() {
                const idpath = $(this).attr('idpath');
                if(idpath !== undefined) {
                    const url = location.href;
                    const pathes = url.split("/");
                    
                    let prodpath = "";
                    if (languages.indexOf(pathes[3]) === -1) {
                        // URLの２階層目が言語情報ではない（＝製品ID）
                        prodpath = "//" + pathes[2] + "/" + pathes[3];
                    } else {
                        prodpath = "//" + pathes[2];
                    }
                    
                    let desturl = pathes[0] + prodpath + idpath + ".html";
                    const anc = $(this).parent().attr('id');
                    if((anc !== undefined) && (anc !== "")) {
                        desturl = desturl + "#" + anc;
                    }
                    
                    let cpdflg = false;
                    if(navigator.clipboard){
                        navigator.clipboard.writeText(desturl);
                        cpdflg = true;
                    } else if(window.clipboardData){
                        //for IE
                        window.clipboardData.setData("Text" , desturl);
                        cpdflg = true;
                    }
                    
                    if (cpdflg === true ) {
                        const msgid = $(this).attr('aria-owns');
                        $("#"+msgid).show();
                        $("#"+msgid).fadeOut(3000);
                    }
                }
            });
        }

        // コードブロックのコピーボタン
        if($('.codeblock-copy-button').length > 0) {
            $('.codeblock-copy-button').click(function() {
                const codeblockContent = $(this).nextAll().filter('.codeblock--content');
                if(!codeblockContent) {
                    return;
                }
                let cpdflg = false;
                // text() を使うと末尾に2つスペースが入るので除去する
                const text = codeblockContent.text().replace(/  $/g,'');
                if(navigator.clipboard){
                    navigator.clipboard.writeText(text);
                    cpdflg = true;
                } else if(window.clipboardData){
                    // for IE
                    window.clipboardData.setData("Text" , text);
                    cpdflg = true;
                }
                if (cpdflg) {
                    const msg = $(this).next(".codeblock-copy-message");
                    if(msg) {
                        msg.show();
                        msg.fadeOut(3000);
                    }
                }
            });
        }

    /*** ステップリストのチェックボックス ***/
        // local storage key の接頭辞
        const storagePrefix = "slist_";

        // 索引チェックボックスidの接頭辞
        const indexPrefix = "sindexid_";

        // 本文チェックボックスidの接頭辞
        const bodyPrefix = "sbodyid_";

        // 製品別のID
        const pathname = location.pathname;
        const pathes = pathname.split("/");
        const productid = pathes[1] + "_";

        // ステップ一覧索引の作成
        makeSteplistIndex();

        // ステップ索引
        const stepListCheck = document.getElementsByClassName("step-list-check");
        let stepListLen = 0;
        if(stepListCheck !== null) {
            stepListLen = stepListCheck.length;
        }

        // ステップ本文
        const stepCheck = document.getElementsByClassName("step-check");
        let stepLen = 0;
        if(stepCheck !== null) {
            stepLen = stepCheck.length;
        }

        for(let sl = 0; sl < stepListLen; sl++) {
            const id = $(stepListCheck[sl]).attr("id");
            if((id === "") || (id.startsWith(indexPrefix) !== true)) {
                continue;
            }

            // 索引チェックボックスのイベントハンドラ
            $(stepListCheck[sl]).click(function () {
                const cid = id.slice(indexPrefix.length);
                const sts = $(stepListCheck[sl]).prop("checked");
                checkBodyStep(cid, sts);
                updateStorage(cid, sts);
            });
        }

        for(let sl = 0; sl < stepLen; sl++) {
            const id = $(stepCheck[sl]).attr("id");
            if((id === "") || (id.startsWith(bodyPrefix) !== true)) {
                continue;
            }

            // 本文チェックボックスのイベントハンドラ
            $(stepCheck[sl]).click(function () {
                const cid = id.slice(bodyPrefix.length);
                const sts = $(stepCheck[sl]).prop("checked");
                checkIndexStep(cid, sts);
                updateStorage(cid, sts);
            });
        }

        // ステップリスト索引の作成
        function makeSteplistIndex() {
            const targets = $(".list-place");
            for(let tl = 0; tl < targets.length; tl++) {
                const tid = $(targets[tl]).attr("id");
                const divs = $("div[id^="+tid+"]");

                for(let dl = 0; dl < divs.length; dl++) {
                    const ancstr = $(divs[dl]).attr("id");
                    let numstr = $(divs[dl]).find(".step-num").first().text();
                    numstr = numstr.replace("Step", "Step ");
                    const descstr = $(divs[dl]).find(".step-desc").find(".step-title-body").first().text();

                    if(descstr.length > 0) {
                        const newel = '<tr class="step-line"><th class="step-index"><input type="checkbox" class="step-list-check" id="'+ indexPrefix + ancstr + '"><label for="' + indexPrefix + ancstr + '" class="step-index-label">' + numstr + '</label></th><td class="step-link"><a href="#' + ancstr + '">' + descstr + '</a></td></tr>';
                        $(newel).appendTo($(targets[tl]));
                    }
                }
            }
        }

        // ステータスチェック状態の画面への反映
        function updateDisplay() {
            let curPrefix = "";
            let checkSts = "";
            let stsPos = 0;

            for(let sl = 0; sl < stepLen; sl++) {
                let id = $(stepCheck[sl]).attr("id");
                if(id !== "") {
                    const prefix = getPrefix(id.slice(bodyPrefix.length));

                    if(curPrefix !== prefix) {
                        const strval = localStorage.getItem(storagePrefix+productid+prefix);
                        if(strval !== null) {
                            const d = JSON.parse(strval);
                            checkSts = d.checksts;
                            stsPos = 0;
                        }

                        curPrefix = prefix;
                    }

                    const tgsts = checkSts.slice(stsPos,stsPos+1);
                    if(tgsts === "1") {
                        $(stepListCheck[sl]).prop("checked", true);
                        $(stepCheck[sl]).prop("checked", true);
                    }

                    stsPos++;
                }
            }
        }

        // ステータス永続化情報の更新
        function updateStorage(id, sts) {
            if(!window.localStorage) {
                return false;
            }

            const prefix = getPrefix(id);
            const strval = localStorage.getItem(storagePrefix+productid+prefix);
            let checksts = "";
            if(strval !== null) {
                const d = JSON.parse(strval);
                checksts = d.checksts;

                const cklen = getStepLength(prefix);

                if (checksts.length !== cklen) {
                    checksts = adjustStatusList(checksts, cklen);
                }
            } else {
                checksts = initStatusList(prefix);
            }

            let nextsts = "1";
            if(sts === false) nextsts = "0";

            const num = getNumPart(id);
            const point = Number(num);
            const p1 = checksts.slice(0, point-1);
            const p2 = checksts.slice(point);
            const newsts = p1 + nextsts + p2;

            const newval = JSON.stringify({
                checksts: newsts,
                timestamp: new Date().getTime()
            });

            localStorage.setItem(storagePrefix+productid+prefix, newval);
        }

        // idから文字列部分を抜き出す
        function getPrefix(id) {
            if(id.includes("#")) {
                const ids = id.split("#");
                id = ids[1];
            }
            const num = getNumPart(id);
            const brk = num.length;
            const prefix = id.slice(0, id.length - brk);

            return prefix;
        }

        // 期限切れデータの削除
        function removeExpired(prefix) {
            const now = new Date().getTime();

            for (let key in localStorage) {
                if(key.indexOf(prefix) !== -1) {
                    const strval = localStorage.getItem(key);
                    const d = JSON.parse(strval);
                    const timestamp = d.timestamp;
                    const limit = d.limit || 2592000000; // 30日
                    if((timestamp !== null) && (now - timestamp >= limit)) {
                        localStorage.removeItem(key);
                    }
                }
            }
        }

        // 索引チェックボックスのON/OFF
        function checkIndexStep(id, sts) {
            const stepid = indexPrefix + id;
            const tg = $("#" + stepid);
            if(tg.length > 0) {
                tg.prop("checked", sts);
            }
        }

        // 本文チェックボックスのON/OFF
        function checkBodyStep(id, sts) {
            const stepid = bodyPrefix + id;
            const tg = $("#" + stepid);
            if(tg.length > 0) {
                tg.prop("checked", sts);
            }
        }

        // idから数字部分の取り出し（末尾2桁以内）
        function getNumPart(idstr) {
            let retnum = 0;
            const las1 = idstr.slice(idstr.length-1);

            if (!isNaN(Number(las1))) {
                const las2 = idstr.slice(idstr.length-2);
                if (!isNaN(Number(las2))) {
                    retnum = las2;
                } else {
                    retnum = las1;
                }
            }

            return retnum;
        }

        // ステップリストの件数取得
        function getStepLength(prefix) {
            let retval = 0;
            const pflen = prefix.length;
            for(let sl = 0; sl < stepLen; sl++) {
                let id = $(stepCheck[sl]).attr("id");
                id = id.slice(bodyPrefix.length);
                if(id.startsWith(prefix)) {
                    retval = retval + 1;
                }
            }

            return retval;
        }

        // ステータスリスト初期登録
        function initStatusList(prefix) {
            let retstr = "";
            const pflen = prefix.length;
            for(let sl = 0; sl < stepLen; sl++) {
                let id = $(stepCheck[sl]).attr("id");
                id = id.slice(bodyPrefix.length);
                if(id.startsWith(prefix)) {
                    retstr += "0";
                }
            }

            return retstr;
        }

        // ステータスリスト過不足の調整
        function adjustStatusList(stslist, listlen) {
            if(stslist.length < listlen) {
                const luck = listlen - stslist.length;
                for(let ll=0; ll < luck; ll++) {
                    stslist += "0";
                }
            } else if (stslist.length > listlen) {
                stslist = stslist.slice(0, listlen);
            }

            return stslist;
        }

        // 期限切れデータの削除
        removeExpired(storagePrefix);

        // ステータスチェック状態の画面への反映
        updateDisplay();


        // スクロール時の処理
        $(window).on("scrollstop",function(e) {
            // ツリーナビゲーションの高さ調節
            adjustTreeHeight();
 
            if(hasTreeHead == true) {
                // ツリーナビゲーション内TOCのハイライトを移動
                moveTreeTocHighlight();
            }

            if( document.getElementById("rightside-bar") != null ) {
                // 右ペインTOCのハイライトを移動
                moveTocHighlight();
            }

            if ($("#support-inquiry").length > 0) {
                // サポートボタンの位置修正
                adjustSupportInquiry();
            }

            let bottompos = calculateBottomPosition();
            if($(window).scrollTop() > 100) {
                // Topへ戻るボタンの位置修正
                $("#goto-top").css({position: "fixed", bottom: bottompos+"px"});
                $("#goto-top").fadeIn('fast');
            } else {
                $("#goto-top").fadeOut('fast');
            }

            if(ct_enabled === true) {
                // チャットボタンの位置修正
                bottompos -= 26;

                zE("webWidget", "updateSettings", {
                    webWidget: {
                        offset: { 
                            horizontal: "40px",
                            vertical: bottompos+"px",
                            mobile: {
                                horizontal: "left",
                                vertical: bottompos+"px"
                            }
                        },
                    }
                });
            }
        });

    /***  初回表示時の処理 ***/
        function initPage() {
            if( json_mode === true ) {
                // JSONモード時のツリー展開とハイライト設定
                expandCurrentNode();
            }

            if(window.innerWidth < mobileSize) {
                // モバイル画面ではツリーナビゲーションの位置を変える
                switchParts(true);
            } else {
                // モバイル画面以外の処理

                let topMargin = $("#head").outerHeight();
                if($(".mega-nav").length > 0) {
                    topMargin += $(".mega-nav").outerHeight()
                }

                const $current = $("#tree-nav .current");
                adjustTreeHeight();
                // ハイライトを持つ場合
                if($current.length > 0) {
                    // 選択されたアイテムのスクロール位置を取り出す
                    let dpos = getSessionValue("dpos");
                    if(dpos === null) {
                        // セッション情報を持たない場合(=直リンクで開かれた場合)
                        // 表示ページのメニュー位置をスクロール位置と設定
                        dpos = $current.offset().top - topMargin;
                    }
                    // ハイライト位置までスクロール
                    if(hasTreeHead === true) {
                        moveTreeTocHighlight();
                    } else {
                        $tree.animate({scrollTop:dpos},300);
                    }

                    // キーボード操作で遷移してきた場合は、ハイライトされたノードにフォーカスも当てる
                    const keydn = getSessionValue("keydn");
                    if (keydn === "true") {
                        $current.focus();
                    }
                } else {
                    const anc = location.hash;
                    if (anc.length > 1) {
                        // アンカーを持つ場合
                        setTreeTocHighlight(location.href);
                    } else {
                        // ハイライトもアンカーも持たない場合、先頭に位置付け
                        $tree.scrollTop(0);
                    }
                }

                if( document.getElementById("page-toc") != null ) {
                    // 右ペインTOCの先頭にハイライト設定
                    $("#page-toc li a").eq(0).addClass("current");
                    $("#page-toc li a").eq(0).attr("aria-selected", "true");
                }
            }

            // 英語の場合のみサポートボタンを表示
            if (($("#support-inquiry").length > 0) && document.documentElement.lang.startsWith("en")) {
                adjustSupportInquiry();
                $("#support-inquiry").css("display", "block");
            }
        }


    /*** コンテンツ修正 ***/

        const tables = $("article table")
        if( tables != null ) {
            tables.each( function() {
              $(this).wrap("<div class='wrapTable'></div>");
            });
        }
    });

})();
