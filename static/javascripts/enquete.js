/*********************アンケート用スクリプト************************/
// 役立ちましたか？[はい][いいえ]のアンケート
(function() {
    let $window = $(window);

    $window.on("load", function() {
        let $enquete = $("#enquete");
        if (!$enquete[0]) {
            return true; // アンケートがなければ終了
        }
        if (Cookies.get('answered') === location.pathname) {
            return true; // すでに回答済みの場合は終了
        }

        let url = "https://form.kintoneapp.com/public/form/show/";
        let formid = "2a7268574abefeca37c34f2e89c1dad558239925266fe18a3ee9499e6c2b0590";

        let cururl = location.pathname;
        let url_parts = cururl.split("/");
        let product = url_parts[1];

        switch(product) {
            case "g":
            case "g5":
                formid = "3a1e708ed680b060dbb5f7c4a57ca6ec2d7dedf6426d1cf7faded0e75e1f1d87";
                break;
            case "m":
            case "mw5":
                formid = "941072d61311ef3c6649c67885983e26cc98ec986a45f7706fe12fb4a0df1e3e";
                break;
            case "o":
            case "of10":
                formid= "b171044e8835b86f44f794671a2c2ab7d5b85240677b2b83bd4ec5f42eccff85";
                break;
        }

        url = url + formid + "?";

        let queryObj = {
            check: "",
            url: encodeURI(location.href),
            title: document.title,
            lang: document.documentElement.lang
        };

        // Yes/Noボタンのイベントハンドラ
        $('#feedback-yes').click(function() {
            queryObj.check = 'Yes';
            openForm();
        });
        $('#feedback-no').click(function() {
            queryObj.check = 'No';
            openForm();
        });

        // 別ウィンドウで送信画面を表示
        function openForm() {
            let winopen = window.open(url + $.param(queryObj), 'feedback', 'width=620, height=460, scrollbars=1, menubar=1, resizable=1');
            winopen.opener = null;
            $enquete.fadeOut();

            // クッキーに回答済フラグを書き込む（有効期限は1日）
　　　　　　　　　　　　Cookies.set("answered", location.pathname, {path:"/",expires:1});
        }

        // アンケートボタンの表示位置の制御
        function controlDisplayPosition() {
            let $triggerNode = $(".footer");
            if ($window.width() > 1059) {
                let footDisp = $triggerNode.offset().top - $window.height();
                let windowScrollTop = $window.scrollTop();

                if (footDisp < windowScrollTop) {
                    let triggerNodeHeight = $triggerNode.height();
                    let gap = windowScrollTop - footDisp;
                    $enquete.css({position: "fixed", bottom: gap});
                } else {
                    $enquete.css({position: "fixed", bottom: 0});
                }
            } else {
                $enquete.css({position: "absolute", bottom: $triggerNode.height()});
            }
        }

        $window.scroll(function() {
            controlDisplayPosition();
        });

        let timer = false;
        $window.resize(function() {
            if (timer !== false) {
                clearTimeout(timer);
            }
            timer = setTimeout(function() {
                controlDisplayPosition();
            }, 100);
        });

        $enquete.fadeIn();
        controlDisplayPosition();
  });
})();
