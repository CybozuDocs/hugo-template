'use strict';
(function() {
  $(document).ready(function() {
    /* @media screen min-width */
    let mobilewidth = 768;

    let hideMenuPopups = function($menus, duration) {
        let $activeMenu = $menus.filter(function() {
            return $(this).hasClass('active');
        });

        $activeMenu
        .trigger('deactive')
        .find('div.mega-panel')
        .stop(false, true)
        .fadeOut(duration ? duration : 0);

    };

    let togglePanel = function($target) {
        let $popup = $target.find("div.mega-panel");
        if ($target.hasClass('active')) {
            hideMenuPopups($target, 'normal');
        } else {
            let currentMenu = this;
            hideMenuPopups($menus.filter(function() {
                return this !== currentMenu;
            }));
            
            $popup
            .stop(false, true)
            .fadeIn('fast');
            
            $target.trigger('active');
        }
    }
    
    let $menus = $('li.mega-item');

    $menus
    .bind('active', function() {
        let $i = $(this).find('i:first-child');
        $i.removeClass('fa-chevron-down');
        $i.addClass('fa-chevron-up');
        $(this).addClass('active');
        $(this).attr('aria-expanded', 'true');
        $('#secondNav').css('border-bottom', 'none');
    })

    .bind('deactive', function() {
        let $i = $(this).find('i:first-child');
        $i.removeClass('fa-chevron-up');
        $i.addClass('fa-chevron-down');
        $(this).removeClass('active');
        $('#secondNav').css('border-bottom', '3px solid #b8c5ca');
        $(this).attr('aria-expanded', 'false');
    })

    .bind('click', function() {
        togglePanel($(this));
        return false;
    })

    .bind('keyup', function(e) {
        let menupos = $menus.index($(':focus'));
        if (menupos != -1) {
            switch(e.which) {
                case 13:  // enter
                    togglePanel($(this));
                    break;
            }
            return false;
        }
    })
    
    .bind('keydown', function(e) {
        if(($(window).width() < mobilewidth) && (e.which >= 37)) {
            return false;
        }

        let menupos = $menus.index($(':focus'));
        
        let $alllinks = $(this).find("div.mega-panel").find("a");
        let linklen = $alllinks.length;
        let curpos = $alllinks.index($(':focus'));
        let curcol = $alllinks.eq(curpos).parent().parent().prop("id");
        
        let $links1 = $(this).find("#menu1").find("a");
        let $links2 = $(this).find("#menu2").find("a");
        let $links3 = $(this).find("#menu3").find("a");
        let fline = -1;
        
        switch(e.which) {
            case 9: // tab
                let currentMenu = this;
                hideMenuPopups($menus.filter(function() {
                    return this !== currentMenu;
                }));
                break;

            case 27: // esc
                hideMenuPopups($(this), 'normal');
                break;

            case 37: // left
                if (menupos != -1) {
                    if(menupos == 0) return false;
                    
                    let wasActive = $(this).hasClass('active')
                    let $prev = $menus.eq(menupos-1);
                    $prev.focus();
                    
                    if(wasActive) {
                        hideMenuPopups($(this), 'normal');
                        togglePanel($prev);
                    }
                } else {
                    switch(curcol) {
                        case "menu2":
                            fline = $links2.index($(':focus'));
                            $links1.eq(fline).focus();
                            break;
                        case "menu3":
                            fline = $links3.index($(':focus'));
                            $links2.eq(fline).focus();
                            break;
                        default:
                            $(this).focus();
                    }
                }
                break;

            case 38: // up
                if( curpos > 0) {
                    $alllinks.eq(curpos-1).focus();
                    e.preventDefault();
                } else {
                    $(this).focus();
                }
                break;

            case 39: // right
                if (menupos != -1) {
                    if(menupos >= ($menus.length-1)) return false;
                    
                    let wasActive = $(this).hasClass('active')
                    let $next = $menus.eq(menupos+1);
                    $next.focus();
                    
                    if(wasActive) {
                        hideMenuPopups($(this), 'normal');
                        togglePanel($next);
                    }
                } else {
                    switch(curcol) {
                        case "menu1":
                            fline = $links1.index($(':focus'));
                            if(fline > $links2.length-1) {fline = $links2.length-1}
                            $links2.eq(fline).focus();
                            break;
                        case "menu2":
                            fline = $links2.index($(':focus'));
                            if(fline > $links3.length-1) {fline = $links3.length-1}
                            $links3.eq(fline).focus();
                            break;
                        default:
                            $(this).focus();
                    }
                }
                break;

            case 40:  // down
                if( curpos < linklen - 1 ) {
                    $alllinks.eq(curpos+1).focus();
                } else {
                    $(this).focus();
                }
                e.preventDefault();
                break;
        }
    })
    
    .find('div.mega-panel')
    .bind('click keyup', function(e) {
        e.stopPropagation();
    });
    
    $("html")
    .bind("click", function() {
        hideMenuPopups($menus, 'normal');
    })
    .bind("keyup", function() {
        hideMenuPopups($menus, 'normal');
    });
  });
})();
