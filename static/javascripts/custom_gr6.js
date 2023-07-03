"use strict";
(function () {
  const headerHideWidth = 768;
  window.addEventListener("load", function () {
    const $headerSearch = $('.header-search-wrap');
    $(window).on("scrollstop", function () {
      if ($headerSearch.length === 0 ){
        return;
      }
      if ($(window).scrollTop() > 200 || $(window).width() < headerHideWidth ) {
        $headerSearch.css('display', 'block');
      } else {
        $headerSearch.css('display', 'none');
      }
    });
  });
})();
