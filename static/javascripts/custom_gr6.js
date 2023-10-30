"use strict";
(function () {

  function moveSearchBoxToHeader() {
    const $search = $('.search-wrap');
    const $searchInput = $('.searchbox > input');
    const $searchSubmit = $('.searchbox > button');
    if ($search.length === 0 ){
      return;
    }
    $search.addClass('home-search-fixed');
    $searchInput.addClass('home-search-fixed-input');
    $searchSubmit.addClass('home-search-fixed-submit');
  }

  function moveSearchBoxToMain() {
    const $search = $('.search-wrap');
    const $searchInput = $('.searchbox > input');
    const $searchSubmit = $('.searchbox > button');
    if ($search.length === 0 ){
      return;
    }
    $search.removeClass('home-search-fixed');
    $searchInput.removeClass('home-search-fixed-input');
    $searchSubmit.removeClass('home-search-fixed-submit');
  }

  window.addEventListener("load", function () {
    const headerHideWidth = 768;

    $(window).on("scrollstop", function () {
      if ($(window).scrollTop() > 200 || $(window).width() < headerHideWidth ) {
        moveSearchBoxToHeader();
      } else {
        moveSearchBoxToMain();
      }
    });
  });
})();
