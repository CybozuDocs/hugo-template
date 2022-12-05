'use strict';

(function() {
    window.addEventListener('DOMContentLoaded', function() {
        // 製品別のID
        const paths = location.pathname.split("/");
        const productid = paths[1] + "_";

        // お知らせの表示状態のプレフィックス
        const storagePrefixForAnnouncement = 'announce_' + productid;
        const sessionPrefixForAnnouncement = 'session-notice-';

        // サポート外のブラウザ(現時点ではIEのみ)
        function unsupportedBrowser() {
            const ua = window.navigator.userAgent.toLowerCase();
            return ua.indexOf('msie ') > -1 || ua.indexOf('trident/') > -1;
        }

        // お知らせ全体の高さを合計する処理
        function sumAllAnnnounceHeight() {
            const $announcements = $('.announcement-banner');
            let height = 0;
            $announcements.each(function() {
                // 非表示のお知らせの高さは 0 とする
                height += this.offsetHeight;
            });
            return height;
        }

        // お知らせを表示する位置を調整する処理
        function justifyAnnouncementPosition() {
            const $announcements = $('.announcement-banner');
            if ($announcements) {
                let position = 0;
                $announcements.each(function() {
                    $(this).css('top', position);
                    // 非表示のお知らせの高さは 0 とする
                    position += this.offsetHeight;
                });
            }
        }

        // お知らせを表示する処理
        function showAnnouncements() {
            const $announcements = $('.announcement-banner');
            if ($announcements) {
                let position = sumAllAnnnounceHeight();
                $announcements.each(function () {
                    const identifer = $(this).attr('id').replace('announcement-banner-', '');
                    const storageKey = storagePrefixForAnnouncement + identifer;
                    let strval  = null;
                    if(identifer.indexOf(sessionPrefixForAnnouncement) !== -1) {
                        if(unsupportedBrowser()) {
                            strval = sessionStorage.getItem(storageKey);
                        } else {
                            strval = "";
                        }
                    } else {
                        strval = localStorage.getItem(storageKey);
                    }

                    if(strval === null) {
                        $(this).css('top', position);
                        $(this).show();
                        position += $(this).outerHeight();
                    }
                });
                const announceHeight = sumAllAnnnounceHeight();
                $('header').css('top', announceHeight);
            }
        }

        // 閉じるボタンを押したときのイベントハンドラー
        if($('.announcement-banner-content-button-close').length > 0) {
            $('.announcement-banner-content-button-close').click(function() {
                const identifer = $(this).attr('id').replace('announcement-', '');
                const storageKey = storagePrefixForAnnouncement + identifer;
                const $banner = $('.announcement-banner.' + identifer);
                if ($banner) {
                    $banner.hide();
                    const strval = JSON.stringify({
                        timestamp: new Date().getTime(),
                        limit: 10368000000, // 120日
                    });
                    if(identifer.indexOf(sessionPrefixForAnnouncement) !== -1) {
                        sessionStorage.setItem(storageKey, strval);
                    } else {
                        localStorage.setItem(storageKey, strval);
                    }
                    const announceHeight = sumAllAnnnounceHeight();
                    justifyAnnouncementPosition();
                    $('header').css('top', announceHeight);
                }
            });
        }

        // ブラウザの幅を調整したときのヘッダーの位置を調整するイベントハンドラー
        $(window).resize(function() {
            const $announcements = $('.announcement-banner');
            if ($announcements) {
                const announceHeight = sumAllAnnnounceHeight();
                $('header').css('top', announceHeight);
            }
        });

        // 期限切れデータの削除
        function removeExpiredAnnouncementStatus() {
            const now = new Date().getTime();

            for (let key in localStorage) {
                if(key.indexOf(storagePrefixForAnnouncement) !== -1) {
                    const strval = localStorage.getItem(key);
                    const d = JSON.parse(strval);
                    const timestamp = d.timestamp;
                    const limit = d.limit;
                    if((timestamp !== null) && (now - timestamp >= limit)) {
                        localStorage.removeItem(key);
                    }
                }
            }
        }

        removeExpiredAnnouncementStatus();
        showAnnouncements();
    })
})();