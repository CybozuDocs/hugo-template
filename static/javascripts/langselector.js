"use strict";
(function () {
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

        // 表示中の言語を言語リストから削除
        const $deltarget = $("#lang_item_" + langcode);
        $deltarget.remove();
    }

    window.addEventListener('load', function() {
        if( document.getElementById("lang-selector") != null ) {
            initLanguageSelector();

            window.addEventListener('wovnApiReady',function(){
              const wovnobj = WOVN.io.getCurrentLang();
              const wovnlang = wovnobj.name;
              const wovncode = wovnobj.code;

              if (wovncode !== "ja") {
                changeSelectedLang(wovncode, wovnlang);
              }
            });
        }
    });
})();