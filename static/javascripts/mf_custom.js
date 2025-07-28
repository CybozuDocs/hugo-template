'use strict';
(function() {
    window.addEventListener('load', function() {

      const selectCategory = () => {
        const params = new URL(window.location.href).searchParams;
        const currentCategory = params.get("c");
        const buttons = document.querySelectorAll(".mf-filters_use-links_item_buttons button");

        if ((currentCategory !== "") && (buttons.length > 0)) {
          buttons.forEach((btn) => {
            if ((btn.innerText === currentCategory) && 
              !btn.classList.contains("mf-filters_use-links_item_buttons_button--selected")) {
              btn.click();
            }
          });
        }
      };
      
      setTimeout(selectCategory, 500);

    });
})();