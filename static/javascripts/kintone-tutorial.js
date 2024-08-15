'use strict';
(function() {
    window.addEventListener('load', function() {
        $("#tutorial-index-switch").click(function(){
            $("#tutorial-index").slideToggle();
        });
        // ロゴ
        const languages = ["ja"];
        const $headerLogo = $(".tutorial-logo");
        if($headerLogo.length > 0) {
            $headerLogo.on("click", function(e) {
                const pathes = location.pathname.split("/");
                let language = "";
                let productId = "";
                if(pathes.length >= 3) {
                    if (languages.includes(pathes[1])) {
                        language = pathes[1];
                        window.location.href = `/${language}/`;
                    } else {
                        productId = pathes[1];
                        langId = pathes[2];
                        window.location.href = `/${productId}/${language}/`;
                    }
                }
            });
        }

        $(window).resize(function() {
            if (window.innerWidth < 768) {
                $("#tutorial-index").css("display", "none");
            } else {
                $("#tutorial-index").css("display", "block");
            }
        });

    });
})();