"use strict";

(function () {
    const searchUrl = "https://ae4gbmw2xi.execute-api.ap-northeast-1.amazonaws.com/help/search";

    const vm = Vue.createApp({
        delimiters: ['[[', ']]'],
        data: () => ({
            ctabs: [],
            items: [],
            search_words: "",
            total: 0,
            start: 1,
            last: 1,
            current: 0,
            pages: [],
            searching: true,
            lang: "en",
            region: "jp",
            app: "",
            cid: 0,
            initial: true,
            connected: "0",
            error_message: ""
        }),
        created: function() {  
            const gcon = sessionStorage.getItem("gcon");
            if(gcon !== null) {
                this.connected = gcon;
            }
        },
        mounted: function() {
            this.$nextTick(function () {
                switch (this.connected) {
                    case "0":
                        // confirm api connection
                        confirmApiConnection();
                        break;
                    case "1":
                        this.searching = false;
                        this.first_call();
                        break;
                    case "2":
                        this.unavailable();
                        break;
                    default:
                        this.searching = false;
                        break;
                }
            });
        },
        methods: {
            first_call: function() {
                this.set_environment();

                if (this.set_options() === false) {
                    return false;
                }

                callSearchApi();
            },
            set_environment: function() {
                const this_url = location.pathname;
                const url_parts = this_url.split("/");

                // get application name from url
                this.app = url_parts[1];

                // get language code from url
                this.lang = url_parts[2];

                // 'common' does not have app section
                switch (this.app) {
                    case "en":
                    case "ja":
                    case "zh":
                    case "zh-tw":
                    case "es":
                        this.lang = this.app;
                        this.app = "common";
                        break;
                }

                // get region code from html lang
                const htmllang = document.documentElement.lang;
                if (htmllang === "zh-tw-jp") {
                    this.region = "jp";
                    this.lang = "zhtw";
                } else if (htmllang === "zh-tw-us") {
                    this.region = "us";
                    this.lang = "zhtw";
                } else {
                    this.region = htmllang.substr(3,2);
                }
            },
            set_options: function () {
                const qstr = location.search;
                if (qstr.length <= 0) return false;

                const params = new URLSearchParams(qstr);

                if(params.has("c")) {
                    // category tab number
                    this.cid = Number(params.get("c"));
                }

                if(params.has("start")) {
                    // start page
                    this.start = Number(params.get("start"));
                }

                if((params.has("q")) && (params.get("q").length > 0)){
                    // search text
                    this.search_words = decodeURIComponent(params.get("q"));
                } else {
                    return false;
                }

                // category_list is defined Global by Hugo template
                if (category_list !== null ) {
                    this.ctabs = category_list;
                }

                return true;
            },
            unavailable: function() {
                this.error_message = "This feature is not available in this environment.";
            },
            submit: function() {
                if (this.searching == false) {
                    this.searching = true;
                    let newpath = location.pathname;
                    const words = this.search_words.trim();
                    newpath = newpath + "?c=" + this.cid + "&start=" + this.start + "&q=" + encodeURIComponent(words);
                    location.href = newpath;
                }
            },
            submit_button: function() {
                this.start = 1;
                this.submit();
            },
            change_category: function(num) {
                this.start = 0;
                this.cid = num;
                this.submit();
            },
            key_down: function(e) {
                const pl = e.target.htmlFor;
                const pi = pl.slice(-1);
                this.change_category(pi);
            },
            page_navigate: function(page) {
                if (this.current + 1 != page) {
                    this.start = page * 10 - 9;
                    this.submit();
                }
            },
            go_prev: function() {
                if (this.start > 10) {
                    this.start = this.start - 10;
                    this.submit();
                }
            },
            go_next: function() {
                const next_start = this.start + 10;
                if (next_start < this.total) {
                    this.start = next_start;
                    this.submit();
                }
            },
            resetButton: function () {
                this.searching = false;
            }
        }
    }).mount('#main_form')

    // to confirm Google API is enabled
    // call it without token
    const confirmApiConnection = () => {
        const chkurl = "https://www.googleapis.com/customsearch/v1";

        fetch(chkurl, { cache: 'no-cache' })
            .then(response => {
                if(response.status === 403) {
                    // call the url without token, 'forbidden' is a correct status
                    vm.connected = "1";
                    vm.first_call();
                    vm.resetButton();
                } else {
                    throw new Error(response);
                }
            })
            .catch((e) => { 
                vm.unavailable();
                vm.connected = "2";
                vm.initial = false;
            })
            .finally(() => {
                sessionStorage.setItem("gcon", vm.connected);
            });
    }

    const callSearchApi = () => {
        const words = vm.search_words;

        const target = searchUrl + "?app=" + vm.app + "&c=" + vm.cid + "&lang=" + vm.lang + "&r=" + vm.region + "&start=" + vm.start  + "&q=" + encodeURIComponent(words);
        vm.searching = true;

        fetch(target, { cache: 'no-cache' })
            .then(response => {
                if(!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json()
            })
            .then(jd => {
                if (jd.hasOwnProperty("error") === false) {
                    if("searchInformation" in jd) {
                        vm.total = Number(jd["searchInformation"].totalResults);
                    }

                    const queries = jd["queries"];
                    if("request" in queries) {
                        vm.start = Number(queries["request"][0]["startIndex"]);
                        vm.last = vm.start + 9;
                        if ( vm.last > vm.total ) {
                            vm.last = vm.total;
                        }
                        vm.current = Math.floor(vm.start / 10);

                        // page navigation bar
                        const pages = [];
                        // The number of pages should be 1 when the number of search items is 10
                        const lastnum = vm.total + 9;
                        for (let i = 10; lastnum >= i; i = i + 10) {
                            pages.push(i/10);

                            // because the maximum number of search items is 100
                            // the maximum number of pages is 10
                            if (i >= 100) break;
                        }
                        vm.pages = pages;

                        if (typeof WOVN !== 'undefined') {
                            const paths = location.pathname.split("/");
                            const wovncode = WOVN.io.getCurrentLang().code;
                            const resourcefile = "/" + paths[1] + "/json/" + wovncode + "/category_list.json";
                            fetch(resourcefile)
                                .then(response => response.json())
                                .then((data) => { 
                                    vm.ctabs = data.us;
                                });
                        } else {
                            // category_list is defined Global by Hugo template
                            if (category_list !== null ) {
                                vm.ctabs = category_list;
                            }
                        }

                    }

                    if(jd.hasOwnProperty("items")) {
                        const rec_items = jd["items"];
                        vm.items = rec_items;
                    }
                } else {
                    vm.error_message = jd["error"].message;
                }
            })
            .catch(error => {
                vm.error_message = "Error: status=" + error.status;
            })
            .finally(() => {
                vm.initial = false;
                vm.resetButton();
            });
    }
}());
