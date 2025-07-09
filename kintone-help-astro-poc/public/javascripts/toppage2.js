"use strict";
(function() {
  $(document).ready(function() {
    const SELECTEDCLASS = "top-page-item-selected";
    const KEYDOWN_CHECK = "tab_keydown_check";

    function closeCardMenu(panelId) {
      const parentId = "#" + $(panelId).attr("aria-labelledby");
      $(parentId).removeClass("top-page-card-selected");
      $(parentId).attr("aria-expanded", "false");

      $(panelId).find("a").attr("tabindex", "-1");
      $(panelId).find("a").off("keydown");
      $(panelId).css("display", "none");
    }

    function closeAllMenu() {
      $(".top-page-panel").each(function() {
        if ($(this).css("display") === "block") {
          closeCardMenu("#"+$(this).attr("id"));
        }
      });
    };

    function toggleCardMenu(e) {
      const parentId = e.data.id;
      const targetPanel = "#" + e.data.panel;
      const $aTags = $(targetPanel).find("a");

      if ($(targetPanel).css("display") === "block") {
        closeCardMenu(targetPanel);
      } else {

        closeAllMenu();

        const $targetButton = $("#"+parentId);
        $targetButton.addClass("top-page-card-selected");

        const top = $targetButton.offset().top + $targetButton.outerHeight() - 6;
        const left = $targetButton.offset().left;

        $targetButton.attr("aria-expanded", "true");
        $(targetPanel).css("display", "block");
        $(targetPanel).offset({"top": top, "left": left, "height": 0});

        $(targetPanel).find("." + SELECTEDCLASS).each(function() {
           $(this).removeClass(SELECTEDCLASS);
        });

        if (sessionStorage.getItem(KEYDOWN_CHECK) !== null) {
          sessionStorage.removeItem(KEYDOWN_CHECK);
          $(targetPanel).find("a").first().focus();

          const $aTags = $(targetPanel).find("a");
          if ($aTags.length > 0) {
            const $firstA = $aTags.first();
            $firstA.find("span").addClass(SELECTEDCLASS);
            $firstA.attr("tabindex", "0");
            $firstA.focus();

            $aTags.on("keydown", function(e) {
              handleKeydown(e, $aTags);
            });
        }
        }

      }
    };

    function movePage(e) {
      location.href = e.data.href;
    }

    function handleClick(e) {
      if (!$(e.target).hasClass("top-page-card")) {
        closeAllMenu();
      }
    }

    $(".top-page-card-single").each(function() {
       $(this).on("click", {href: $(this).attr("href")}, movePage);
    });
    $(".top-page-card-parent").each(function() {
       $(this).on("click", {id: $(this).attr("id"), panel: $(this).attr("aria-controls")}, toggleCardMenu);
    });

    $(window).resize(function() {
      closeAllMenu();
    });

    function moveItemFocusByKeydown($aTags, diff) {
      const itemCount = $aTags.length;
      const $currentItem = $aTags.find("." + SELECTEDCLASS);

      let currentNum = 0;
      if ($currentItem.length > 0) {
        currentNum = Number($currentItem.parent().attr("data-itemnum"));
      }

      let nextNum = currentNum + diff;
      if (diff === -999) {
        nextNum = 0;
      } else if (diff === 999) {
        nextNum = itemCount - 1;
      }

      if (nextNum > itemCount - 1) {
          nextNum = itemCount - 1;
      } else if (nextNum < 0) {
          nextNum = 0;
     }

      $aTags.each(function() {
        if ($(this).attr("data-itemnum") === String(nextNum)) {
           $(this).find("span").addClass(SELECTEDCLASS);
           $(this).attr("tabindex", "0");
           $(this).focus();
        } else {
           $(this).find("span").removeClass(SELECTEDCLASS);
           $(this).attr("tabindex", "-1");
        }
      });

    };

    function handleKeydown(e, $aTags) {
      const pushedKey = e.code;
      let prevent = true;
      switch(pushedKey) {
        case "ArrowDown":
          moveItemFocusByKeydown($aTags, 1);
          break;
        case "ArrowUp":
          moveItemFocusByKeydown($aTags, -1);
          break;
        case "End":
          moveItemFocusByKeydown($aTags, 999);
          break;
        case "Enter":
          const itemHref = $aTags.find("." + SELECTEDCLASS).parent().attr("href");
          if (itemHref !== undefined) {
            location.href = itemHref;
          }
          break;
        case "Escape":
          closeAllMenu();
          const parentId = $aTags.first().parent().parent().attr("aria-labelledby");
          if (parentId !== undefined) {
             $("#" + parentId).focus();
          }
          break;
        case "Home":
          moveItemFocusByKeydown($aTags, -999);
          break;
        case "Tab":
          closeAllMenu();
          prevent = false;
          break;
      }

      if (prevent) {
        e.preventDefault();
        e.stopPropagation();
      }
    }

    $(document).on("click", handleClick);

    function keydownCheck(e) {
      if (e.code === "Tab") {
        sessionStorage.setItem(KEYDOWN_CHECK, true);
      }
    }

    $(document).on("keydown", keydownCheck);

  });

})();
