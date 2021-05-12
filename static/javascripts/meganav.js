"use strict";
(function() {
  $(document).ready(function() {
    /* @media screen min-width */
    let mobilewidth = 768;
    let $tabs = $("button.mega-tab");
    let $panels = $("div.mega-panel");
    
    let hideTabPanels = function(except) {
        $.each($tabs, function(index, value) {      
            if (($(this).attr("aria-expanded") === "true") && ($(this).attr("id") !== except)) { 
                let panel = $(this).attr("aria-controls");
                $("#"+panel).stop(false, true).fadeOut(0);   
                $(this).trigger("close");
            }
        });
    };

    let togglePanel = function(btn, panel) {
        let $target = $("#" + btn);
        if ($target.attr("aria-expanded") === "false") {
            let $panel = $("#" + panel);
            $panel.stop(false, true).fadeIn("fast");  
            $target.trigger("expand");
        } else {
            btn = undefined;
        }
    
        hideTabPanels(btn);
    }

    $tabs
    .bind("expand", function() {
        let $i = $(this).find("i:first-child");
        $i.removeClass("fa-chevron-down");
        $i.addClass("fa-chevron-up");
        $(this).attr("aria-expanded", "true");
    })

    .bind("close", function() {
        let $i = $(this).find("i:first-child");
        $i.removeClass("fa-chevron-up");
        $i.addClass("fa-chevron-down");
        $(this).attr("aria-expanded", "false");
    })

    .bind("click", function() {
        togglePanel($(this).attr("id"), $(this).attr("aria-controls"));
        return false;
    })
    
    .bind("keydown", function(e) {
        let tabpos = $tabs.index($(":focus"));   
        let panel = $(this).attr("aria-controls");

        switch(e.which) {
            case 27: // esc
                hideTabPanels();
                e.preventDefault();
                e.stopPropagation();
                break;

            case 37: // left
                if (tabpos !== -1) {
                    $tabs.eq(tabpos).attr("tabindex", -1);
                    tabpos--;
                    if (tabpos < 0) {
                        tabpos = $tabs.length - 1;
                    }
                    let aex = $(this).attr("aria-expanded");
                    let $prev = $tabs.eq(tabpos);
                    $prev.attr("tabindex", 0);
                    $prev.focus();
                    
                    if(aex === "true") {
                        togglePanel($prev.attr("id"), $prev.attr("aria-controls"));
                    }
                } 
                e.stopPropagation();
                break;

            case 39: // right
                if (tabpos != -1) {
                    $tabs.eq(tabpos).attr("tabindex", -1);
                    tabpos++;
                    if(tabpos >= ($tabs.length)) {
                        tabpos = 0;
                    }
                    
                    let aex = $(this).attr("aria-expanded");
                    let $next = $tabs.eq(tabpos);
                    $next.attr("tabindex", 0);
                    $next.focus();
                    
                    if(aex === "true") {
                        togglePanel($next.attr("id"), $next.attr("aria-controls"));
                    }
                } 
                e.stopPropagation();
                break;
        }
    });
    
    let moveFocus = function(links, ttop, tleft) {
        let rows = [];
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
        
        let cols = [];
        let $alllinks = $(this).find("a");
        $alllinks.each( function( index, element ) {
            let cl = $(element).position().left;
            if ((cl >= 100 ) && (cols.indexOf(cl) === -1)) {
                cols.push(cl);
            }
        });
       
        let linklen = $alllinks.length;
        let curpos = $alllinks.index($(":focus"));
        
        let ft = $alllinks.eq(curpos).position().top;
        let fl = $alllinks.eq(curpos).position().left;
        let curcol = cols.indexOf(fl);
        
        switch(e.which) {
            case 37: // left
                switch(curcol) {
                    case 0:
                        moveFocus($alllinks, ft, cols[2]);
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
                e.preventDefault();
                e.stopImmediatePropagation();
                break;
                
            case 38: // up
                if( curpos > 1) {
                    $alllinks.eq(curpos-1).focus();          
                } else {
                    $alllinks.eq(linklen-1).focus();
                }
                e.preventDefault();
                e.stopImmediatePropagation();
                break;
                
            case 39: // right
                switch(curcol) {
                    case 0:
                        moveFocus($alllinks, ft, cols[1]);
                        break;
                    case 1:
                        moveFocus($alllinks, ft, cols[2]);
                        break;
                    case 2:
                        moveFocus($alllinks, ft, cols[0]);
                        break;
                    default:
                        break;
                }
                e.preventDefault();
                e.stopImmediatePropagation();
                break;
                
            case 40:  // down
                if( curpos < linklen - 1 ) {
                    $alllinks.eq(curpos+1).focus();
                } else {
                    $alllinks.eq(1).focus();
                }
                e.preventDefault();
                e.stopImmediatePropagation();
                break;
        }
    });
    
    $("html")
    .bind("click", function() {
        hideTabPanels();
    });
  });
})();
