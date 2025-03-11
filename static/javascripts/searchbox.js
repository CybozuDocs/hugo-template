"use strict";
(function() {
  $(document).ready(function() {
    const $currentFilter = $(".search-filter-current");
    const $filterList = $(".search-filter-list");
    const $items = $(".search-filter-item");
    let filterId = 0;

    function closeFilterList() {
      $currentFilter.attr("aria-expanded", "false");
      $filterList.attr("tabindex", "-1");
      $filterList.css("display" ,"none");
    }

    function toggleFilterList() {
      if ($filterList.css("display") === "block" ) {
        closeFilterList();
      } else {
        const top = $currentFilter.offset().top + $currentFilter.outerHeight();
        const left = $currentFilter.offset().left;
        $filterList.css("display" ,"block");
        $filterList.offset({"top": top, "left": left});
        $filterList.attr("tabindex", "0");
        $currentFilter.attr("aria-expanded", "true");
        $filterList.focus();
      }
    }

    function selectFilter(e) {
      const $selected = $(".search-filter-selected");
      $selected.removeClass("search-filter-selected");
      $selected.attr("aria-selected", "false");

      $(e.target).addClass("search-filter-selected");
      $(e.target).attr("aria-selected", "true");
      const filterName = $(e.target).text();
      $currentFilter.text(filterName);
      $filterList.css("display" ,"none");
      filterId = Number($(e.target).attr("listid"));
    }

    function submitSearch() {
      const searchText = $("#search-input").val();
      
      if (searchText !== "") {
        const params = "c=" + filterId + "&q=" + encodeURIComponent(searchText);

        const product = document.querySelector('meta[name="cy-product-name"]');
        const strPathes = location.pathname;
        const pathes = strPathes.split("/");
        let baseurl = "";
        if (product === "support_guide") {
          baseurl = "/" + pathes[1];
        } else {
          baseurl = "/" + pathes[1] + "/" + pathes[2];
        }
        const newpath = baseurl + "/search_result.html?" + params;
        location.href = newpath;
      }
    }

    function handleClick(e) {
      if (!$(e.target).hasClass("search-filter-current") && ($filterList.css("display") === "block")) {
        $filterList.css("display" ,"none");
      }
    }

    function handleKeydown(e) {
      if (e.keyCode === 13) submitSearch();
    }

    $(".search-filter-list li").each(function() {
       $(this).on("click", selectFilter);
    });

    $currentFilter.on("click", toggleFilterList);
    $(".search-submit").on("click", submitSearch);

    $(document).on("click", handleClick);
    $("#search-input").on("keydown", handleKeydown);

    function focusItem() {
      $items.each(function() {
        if ($(this).attr("listid") === String(filterId)) {
           $(this).addClass("forcused-item search-filter-selected");
           $(this).attr("aria-selected", "true");
           $currentFilter.text($(this).text());
        } else {
           $(this).removeClass("forcused-item search-filter-selected");
           $(this).attr("aria-selected", "false");
        }
      });
    };

    $currentFilter.on("keydown", function(e) {
      const pushedKey = e.code;
      switch(pushedKey) {
        case "Tab":
        case "Escape":
          closeFilterList();
          break;
      }
    });

    $filterList.on("keydown", function(e) {
      const pushedKey = e.code;
      switch(pushedKey) {
        case "Enter":
        case "Escape":
        case "Tab":
          closeFilterList();
          $currentFilter.focus();
          e.preventDefault();
          e.stopPropagation();
          break;
        case "ArrowDown":
          if (($items.length - 1) > filterId) {
            filterId++;
            focusItem();
          }
          e.preventDefault();
          e.stopPropagation();
          break;
        case "ArrowUp":
          if (0 < filterId) {
            filterId--;
            focusItem();
          }
          e.preventDefault();
          e.stopPropagation();
          break;
        case "Home":
          filterId = 0;
          focusItem();
          e.preventDefault();
          e.stopPropagation();
          break;
        case "End":
          filterId = $items.length - 1;
          focusItem();
          e.preventDefault();
          e.stopPropagation();
          break;
      }
    });

    // search results page
    if($("search-result") !== null) {
      const url = new URL(window.location.href);
      const params = url.searchParams;
      const currentId = params.get("c");
      if (currentId !== null) {
        $(".search-filter-item").each(function() {
            if ($(this).attr("listid") === currentId) {
               $(this).click();
            }
        });
      }

      const currentWord = params.get("q");
      if (currentWord !== null) {
        $("#search-input").val(currentWord);
      }
    }

  });
})();