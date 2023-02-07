'use strict';

(function() {

    // タグ選択パーツ
    const vs = Vue.createApp({
        delimiters: ['[[', ']]'],
        data() {
            return {
                tags: [],
                filter: "",
                langid: "en",
                tagOptionName: "tags",
                productid: "",
                storagePrefix: "videotags_",
            }
        },
        created() {
            this.langid = getLangId();
            this.productid = getProductId();
        },
        async mounted() {
            // 文言リソースファイルの読み込み
            await axios.get("/" + this.productid + "/" + this.langid + "/video/resource.json")
                .then(response => {
                        this.tags = response.data.tags;
                        this.filter = response.data.title;
                })
                .catch((error) => console.log(error));

            // アンカー付きURL対応
            // コンマ5秒待ってから移動させる
            this.$nextTick(function () {
                const hash = window.location.hash;
                if(hash !== undefined) {
                    const hashBody = hash.replace("#", "");
                    setTimeout(() => {
                        const el = document.getElementById(hashBody);
                        if(el !== null) {
                            el.scrollIntoView();
                        }
                    }, 500);
                }
            })
        },
        methods: {
            // タグ一覧の選択状態の変更
            changetag: function() {
                const url = new URL(window.location.href);
                const key = this.storagePrefix + this.productid;

                const selected = this.getselected();

                if(selected.length <= 0) {
                    // 既存URLオプションを削除
                    url.searchParams.delete(this.tagOptionName);
                    // 選択状態をURLに反映
                    history.replaceState(null,null,url);

                    // セッションストレージを削除
                    sessionStorage.removeItem(key);

                    // 画面更新
                    vm.showall();
                } else {
                    const strTags = selected.join(",");
                    const tags = url.searchParams.get(this.tagOptionName);

                    if(tags === null) {
                        // URLオプションに新規追加
                        url.searchParams.append(this.tagOptionName, strTags);
                    } else {
                        // 既存URLオプションを編集
                        url.searchParams.set(this.tagOptionName, strTags);
                    }

                    // 選択状態をURLに反映
                    history.replaceState(null,null,url);

                    // 選択状態をセッションストレージに保存
                    sessionStorage.setItem(key, strTags);

                    // 画面更新
                    vm.showselected();
                }
            },
            // 選択済みのタグIDを配列で取得
            getselected: function() {
                const selected = [];
                const allFilters = $(".video-filter-check");
                for(let i=0; i< allFilters.length; i++) {
                    if(allFilters[i].checked) {
                        const targetid = allFilters[i].id;
                        const idparts = targetid.split("-");
                        selected.push(idparts[2]);
                    }
                }

                return selected;
            },
            // 選択状態の再現
            restoreselections: function() {
                let setopts = 0;

                // URLからオプションを取得
                const url = new URL(window.location.href);
                let strTags = url.searchParams.get(this.tagOptionName);

                if(strTags === null) {
                    // セッションストレージからオプションを取得
                    const key = this.storagePrefix + this.productid;
                    strTags = sessionStorage.getItem(key);

                    if(strTags !== null) {
                        // セッションストレージをURLに反映
                        url.searchParams.append(this.tagOptionName, strTags);
                        history.replaceState(null,null,url);
                    }
                }

                if(strTags !== null) {
                    // 選択状態を再現
                    const taglist = strTags.split(",");
                    taglist.forEach(tag => {
                        // ゴミ文字を削除
                        tag = tag.replace(/[&'`"<>]/g, "");
                        const tagid = "#video-filter-" + tag;
                        if($(tagid).length !== 0) {
                            $(tagid).prop('checked', true);
                            setopts++;
                        }
                    })
                }

                return setopts;
            }
        }
    }).mount('#video-filter');

    // ビデオカードコンポーネント
    const VideoCard = {
        props: ["video"],
        methods: {
            transtag: function(key) {
                let retTag = key;
                if(vm.tags !== null) {
                    const tag = vm.tags.find(tag => tag.key === key);
                    if(tag === undefined) {
                        // keyに該当するタグリソースが見つからない場合
                        retTag = key;
                    } else {
                        retTag = tag["text"];
                    }
                }
                return retTag;
            },
            tagstyle: function(key) {
                let retStyle = "";
                if(vm.tags !== null) {
                    const tag = vm.tags.find(tag => tag.key === key);
                    if(tag === undefined) {
                        // keyに該当するタグリソースが見つからない場合
                        retStyle = "background-color:#cacaca";
                    } else {
                        retStyle = "color:"+tag["text-color"]+"; background-color:"+tag["bg-color"];
                    }
                }
                return retStyle;
            }
        },
        template: `<div class="col-video">
                        <a class="col-video-link" v-bind:href="this.video.link_href" target="_self"></a>
                        <div class="col-video-title">{{this.video.title}}</div>
                        <img class="col-video-img" v-bind:src="this.video.img_src">
                        <div class="col-video-time">{{this.video.time}}</div>
                        <div class="video-tag-list" >
                            <template v-for="tag in this.video.tags" :key="tag">
                                <span class="video-tag" v-bind:style="tagstyle(tag)">{{transtag(tag)}}</span>
                            </template>
                        </div>
                    </div>`
    };

    // コンテンツ本体
    const vm = Vue.createApp({
        delimiters: ['[[', ']]'],
        data() {
            return {
                alllist: [],
                categories: [],
                videos: [],
                tags: [],
                langid: "en",
                viewall: true,
                productid: "",
                reloaded: 0
            }
        },
        created() {
            this.langid = getLangId();
            this.productid = getProductId();
        },
        async mounted() {
            // 文言リソースファイルの読み込み
            await axios.get("/" + this.productid + "/" + this.langid + "/video/resource.json")
                .then(response => {
                    this.tags = response.data.tags;
                })
                .catch((error) => console.log(error));

            // データファイルの読み込み
            await axios.get("/" + this.productid + "/" + this.langid + "/video/list.json")
                .then(response => {
                    this.alllist = response.data;
                })
                .catch((error) => console.log(error));
        },
        components: {
            VideoCard
        },
        methods: {
            showall: function() {
                //　全カードをカテゴリ付きで表示
                if(this.alllist.length <= 0) {
                    // alllistが読み込めていない場合への対応
                    // １秒待って再取得を５回試す
                    if(this.reloaded < 5) {
                        setTimeout(this.showall, 1000);
                        this.reloaded++;
                    }
                } else {
                    this.viewall = true;
                    this.categories = this.alllist;
                }
            },
            showselected: function() {
                
                if(this.alllist.length <= 0) {
                    // alllistが読み込めていない場合への対応
                    if(this.reloaded < 5) {
                        setTimeout(this.showselected, 1000);
                        this.reloaded++;
                    }
                } else {
                    this.viewall = false;
                    this.categories = [];
                    this.videos = [];

                    const selected = vs.getselected();
                    if(selected.length === 0) {
                        // チェックされたものがない場合、全件表示
                        this.showall();
                    } else {
                        // チェックされたvideoのみを表示
                        this.alllist.forEach(category => {
                            category.videos.forEach(video => {
                                for(let t=0; t < video.tags.length; t++) {
                                    if(selected.includes(video.tags[t])) {
                                        this.videos.push(video);
                                        break;
                                    }
                                }
                            })
                        });

                        window.scrollTo(0, 0);
                    }
                }
            },
            // パーマリンクの展開と省略
            expandlink: function(id, e) {
                const $btn = $("#"+id);
                const child = $btn.attr('aria-owns');
                const $popurl = $("#"+child);

                if ($popurl.css('display') === "block") {
                    $popurl.hide();
                    $popurl.attr('aria-hidden', 'true');
                    $btn.attr('aria-expanded', 'false');
                } else {
                    $popurl.show();
                    $popurl.attr('aria-hidden', 'false');
                    $popurl.children().select();
                    $btn.attr('aria-expanded', 'true');
                }
                return false;
            }
        }
    }).mount('#main');

    // URLから対象言語を取り出す
    function getLangId() {
        let langid = "en";
        const url = new URL(window.location.href);
        const pname = url.pathname;
        const pathes = pname.split("/");
        if(pathes.length > 2) {
            langid = pathes[2];
        }

        return langid;
    }

    // URLから製品IDを取り出す
    function getProductId() {
        let prodid = "en";
        const url = new URL(window.location.href);
        const pname = url.pathname;
        const pathes = pname.split("/");
        if(pathes.length > 2) {
            prodid = pathes[1];
        }

        return prodid;
    }

    // 初期画面表示
    window.addEventListener('load', function() {
        $('html').click(function(e) {
            const links = $(".heading-url:visible");
            if(links.length > 0) {
                for(let l=0; l < links.length; l++) {
                    $(links[l]).hide();
                    $(links[l]).attr('aria-hidden', 'true');
                    $(links[l]).parent().find("button").attr('aria-expanded', 'false');
                    break;
                }
            }
        });

        // 選択状態を再現
        const opts = vs.restoreselections();

        if(opts > 0) {
            // 選択表示
            vm.showselected();
        } else {
            // 全件表示
            vm.showall();
        }
    });

})();