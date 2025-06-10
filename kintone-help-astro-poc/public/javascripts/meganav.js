"use strict";
(function() {
  $(document).ready(function() {
    const mobileSize = 768; /* @media screen min-width */
    let mobileMode = true;
    if($(window).width() >= mobileSize) {
        mobileMode = false;
    }
    const $tabs = $("button.mega-tab");
    const $panels = $("div.mega-panel");
    const $swbtn = $("#mega-tab-switch");
    const $swicon = $("#mega-tab-switch-icon");

    let secondMode =false;
    if ($(".g-nav").outerHeight() <= 0) {
        secondMode = true;

        if($(".hero").length > 0) {
            $(".hero").css("margin-top", "0px");
            $(".mega-nav").css("border-bottom", "none");
        }
    }

    const $menuline = $(".mega-list-line");
    if($menuline.length > 0) {
        $.each($menuline, function(index, value) {
            $(this).bind("click", function() {
                const url = $(this).find("a").attr("href");
                location.href = url;
            });
        });
    }

    const hideTabPanels = function(except) {
        $.each($tabs, function(index, value) {      
            if (($(this).attr("aria-expanded") === "true") && ($(this).attr("id") !== except)) { 
                const panel = $(this).attr("aria-controls");
                $("#"+panel).stop(false, true).fadeOut(0);   
                $(this).trigger("close");

                const $place = $(this).parent().find(".mega-panelplace");
                $place.css("height", 0);
            }
        });
    };

    const togglePanel = function(btn, panel) {
        const $places = $(".mega-panelplace");
        $places.css("height", 0);

        const $target = $("#" + btn);
        if ($target.attr("aria-expanded") === "false") {
            const $mtb = $("#mega-tab-bar");
            let tabtop = $mtb.position().top + $mtb.outerHeight();
            const $panel = $("#" + panel);

            if(secondMode === true) {
                const mobmenu = $("#mega-tab-short").css("display");
                if(mobmenu == "block") {
                    const tabnum = Number($target.attr("id").substring(3));
                    tabtop = $(".mega-tab-bar").position().top + ($target.outerHeight() * tabnum);
                    const $place = $target.parent().find(".mega-panelplace");
                    $place.css("height", $panel.outerHeight());
                }

                $panel.css("top", tabtop);
                $panel.css("left", $("#mega-tab-bar").position().left + $target.parent().position().left);
                $panel.css("min-width", $target.parent().outerWidth());
            } else {
                $panel.css("top", 7 + tabtop);
            }

            $panel.stop(false, true).fadeIn("fast");  
            $target.trigger("expand");
        } else {
            btn = undefined;
        }
    
        hideTabPanels(btn);
    }

    const toggleMobileMenu = function(force) {
        const $txt = $("#mega-tab-short-text");
        const $mtb = $("#mega-tab-bar");

        let mts = false;
        if( document.getElementsByClassName("mega-tab-short").length > 0) {
            mts = true;
        }

        if (force === true) {
            $mtb.css("display", "block");
            $swbtn.attr("aria-expanded", "true");
            $txt.css("visibility", "hidden");
            $swicon.removeClass("fa-chevron-down");
            $swicon.addClass("fa-chevron-up");
            $("#tab1").focus();
        } else {
            if (mts === true) {
                $mtb.css("display", "none");
            }
            $swbtn.attr("aria-expanded", "false");
            $txt.css("visibility", "");
            $swicon.removeClass("fa-chevron-up");
            $swicon.addClass("fa-chevron-down");
        }
    }

    $swbtn
    .bind("click",function(e) {
        let sts = true;
        if ($swbtn.attr("aria-expanded") === "true") {
            sts = false;
        }
        toggleMobileMenu(sts);
    })
    .bind("keydown", function(e) {
        switch(e.code) {
            case "Enter":
            case "Space":
                $(this).trigger("click");
                e.preventDefault();
                e.stopPropagation();
                break;
            case "Escape":
                toggleMobileMenu(false);
                e.preventDefault();
                e.stopPropagation();
                break;
        }
    });

    $tabs
    .bind("expand", function() {
        const $i = $(this).find("i:first-child");
        $i.removeClass("fa-chevron-down");
        $i.addClass("fa-chevron-up");
        $(this).attr("aria-expanded", "true");
    })

    .bind("close", function() {
        const $i = $(this).find("i:first-child");
        $i.removeClass("fa-chevron-up");
        $i.addClass("fa-chevron-down");
        $(this).attr("aria-expanded", "false");
    })

    .bind("click", function() {
        togglePanel($(this).attr("id"), $(this).attr("aria-controls"));
        return false;
    })
    
    // メガメニュータブのキーバインド
    .bind("keydown", function(e) {
        // フォーカスを持つタブの位置
        let tabpos = $tabs.index($(":focus"));

        let pushedKey = e.code;
        if((pushedKey === "Tab") && e.shiftKey) {
            // Shift + Tab は Escape
            pushedKey= "Escape";
        }

        switch(pushedKey) {
            case "Tab":
                // パネルが展開されている場合、最初のアイテムにフォーカスを当てる
                if($(this).attr("aria-expanded") === "true") {
                    const child = $(this).attr("aria-controls");
                    const al = $("#" + child).find("a");
                    al[0].focus();

                    e.preventDefault();
                    e.stopPropagation();
                }
                break;

            case "Escape":
                if((secondMode === true) && (mobileMode === true)){
                    if($(this).attr("aria-expanded") === "false") {
                        $swbtn.focus();
                        $swbtn.click();
                    } else {
                        hideTabPanels();
                    }
                } else {
                    hideTabPanels();
                }
                break;

            case "Enter":
            case "Space":
                $(this).click();
                e.preventDefault();
                e.stopPropagation();
                break;

            case "ArrowLeft":
            case "ArrowUp":
                if (tabpos !== -1) {
                    $tabs.eq(tabpos).attr("tabindex", -1);
                    tabpos--;
                    if (tabpos < 0) {
                        tabpos = $tabs.length - 1;
                    }
                    const aex = $(this).attr("aria-expanded");
                    const $prev = $tabs.eq(tabpos);
                    $prev.attr("tabindex", 0);
                    $prev.focus();
                    
                    if(aex === "true") {
                        togglePanel($prev.attr("id"), $prev.attr("aria-controls"));
                    }
                } 
                e.preventDefault();
                e.stopPropagation();
                break;

            case "ArrowRight":
            case "ArrowDown":
                if (tabpos != -1) {
                    $tabs.eq(tabpos).attr("tabindex", -1);
                    tabpos++;
                    if(tabpos >= ($tabs.length)) {
                        tabpos = 0;
                    }
                    
                    const aex = $(this).attr("aria-expanded");
                    const $next = $tabs.eq(tabpos);
                    $next.attr("tabindex", 0);
                    $next.focus();
                    
                    if(aex === "true") {
                        togglePanel($next.attr("id"), $next.attr("aria-controls"));
                    }
                }
                e.preventDefault();
                e.stopPropagation();
                break;
    }
    });
    
    const moveFocus = function(links, ttop, tleft) {
　　　　// メガパネル内のフォーカス移動
        const rows = [];
        links.each( function( index, element) {
            if ($(element).position().left === tleft) {
                rows.push($(element));
            };
        });
        
        let trow = 0;
        rows.forEach( function( item, index, array) {
            if (item.position().top <= ttop) {
                trow = index;
                return false;
            };
        });
        
        rows[trow].focus();
    }
    
    $panels.bind("keydown", function(e) {
        // メガパネル内のキーバインド
        let leftpos = 100;
        let lnext = 2;
        let rnext = 2;
        if(mobileMode === true) {
            leftpos = 30;
            lnext = 1;
            rnext = 0;
        }
        
        const cols = [];
        const $alllinks = $(this).find("a");
        $alllinks.each( function( index, element ) {
            const cl = $(element).position().left;
            if ((cl >= leftpos ) && (cols.indexOf(cl) === -1)) {
                cols.push(cl);
            }
        });
       

        const linklen = $alllinks.length;
        const curpos = $alllinks.index($(":focus"));
        
        const ft = $alllinks.eq(curpos).position().top;
        const fl = $alllinks.eq(curpos).position().left;
        const curcol = cols.indexOf(fl);

        let firstLine = 1;
        if(secondMode === true) {
            // メニューの見出しを持たない場合
            firstLine = 0;
        }

        let processed = false;
        let pushedKey = e.code;
        if((pushedKey === "Tab") && e.shiftKey) {
            pushedKey= "TabEscape";
        }

        if(secondMode === true) {
            // 左右は上下に読み替え
            switch(pushedKey) {
                case "ArrowLeft":
                    pushedKey = "ArrowUp";
                    processed = true;
                    break;

                case "ArrowRight":
                    pushedKey = "ArrowDown";
                    processed = true;
                    break;
            }
        }

        switch(pushedKey) {
                case "Escape":
                    hideTabPanels();
                    const ptabid = $(this).attr("aria-labelledby");
                    $("#" + ptabid).focus();
                    processed = true;
                    break;

                case "TabEscape":
                case "ArrowUp":
                    if( curpos > firstLine ) {
                        $alllinks.eq(curpos-1).focus();
                    } else {
                        if(pushedKey === "TabEscape") {
                            hideTabPanels();
                            const ptabid = $(this).attr("aria-labelledby");
                            $("#" + ptabid).focus();
                        } else {
                            $alllinks.eq(linklen-1).focus();
                        }
                    }
                    processed = true;
                    break;

                case "Tab":
                case "ArrowDown":
                    if( curpos < linklen - 1 ) {
                        $alllinks.eq(curpos+1).focus();
                        processed = true;
                    } else {
                        if(pushedKey === "Tab") {
                            hideTabPanels();
                        } else {
                            $alllinks.eq(firstLine).focus();
                            processed = true;
                        }
                    }
                    break;

                case "ArrowLeft":
                    switch(curcol) {
                        case 0:
                            moveFocus($alllinks, ft, cols[lnext]);
                            break;
                        case 1:
                            moveFocus($alllinks, ft, cols[0]);
                            break;
                        case 2:
                            moveFocus($alllinks, ft, cols[1]);
                            break;
                        default:
                            break;
                    }
                    processed = true;
                    break;

                case "ArrowRight":
                    switch(curcol) {
                        case 0:
                            moveFocus($alllinks, ft, cols[1]);
                            break;
                        case 1:
                            moveFocus($alllinks, ft, cols[rnext]);
                            break;
                        case 2:
                            moveFocus($alllinks, ft, cols[0]);
                            break;
                        default:
                            break;
                    }
                    processed = true;
                    break;
        }

        if (processed === true) {
            e.preventDefault();
            e.stopImmediatePropagation();
        }
    });

    $(window).resize(function() {
        hideTabPanels();
        if($(window).width() >= mobileSize) {
            mobileMode = false;
        } else {
            mobileMode = true;
        }

        toggleMobileMenu(!mobileMode);
    });

    $("html").bind("click", function() {
        hideTabPanels();
    });
  });
})();
