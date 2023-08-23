'use strict';
(function() {
    window.addEventListener('load', function() {
        $("#tutorial-index-switch").click(function(){
            $("#tutorial-index").slideToggle();
        });

        $(window).resize(function() {
            if (window.innerWidth < 768) {
                $("#tutorial-index").css("display", "none");
            } else {
                $("#tutorial-index").css("display", "block");
            }
        });

    });
})();