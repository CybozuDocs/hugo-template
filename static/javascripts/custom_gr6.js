"use strict";
(function () {

  function fixHomeSearchBoxToHeader() {
    const $search = $('.search-wrap');
    const $searchInput = $('.searchbox > input');
    const $searchSubmit = $('.searchbox > button');
    $(window).on("scrollstop", function () {
      if ($search.length === 0 ){
        return;
      }
      const headerHideWidth = 768;
      if ($(window).scrollTop() > 200 || $(window).width() < headerHideWidth ) {
        $search.addClass('home-search-fixed');
        $searchInput.addClass('home-search-fixed-input');
        $searchSubmit.addClass('home-search-fixed-submit');
      } else {
        $search.removeClass('home-search-fixed');
        $searchInput.removeClass('home-search-fixed-input');
        $searchSubmit.removeClass('home-search-fixed-submit');
      }
    });
  }


  window.addEventListener("load", function () {
    fixHomeSearchBoxToHeader();
  });
})();
