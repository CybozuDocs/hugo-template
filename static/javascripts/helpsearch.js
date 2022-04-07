"use strict";

(function () {
const searchUrl = "https://ae4gbmw2xi.execute-api.ap-northeast-1.amazonaws.com/help/search";

const vm = new Vue({
  delimiters: ['[[', ']]'],
  el: '#main_form',
  data: {
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
  },
  created: function() {  
    const gcon = sessionStorage.getItem("gcon");
    if(gcon !== null) {
        this.connected = gcon;
    }
  },
  mounted: function () {
        this.$nextTick(function () {
            switch (vm.connected) {
                case "0":
                    // confirm api connection
                    const chkurl = "https://www.googleapis.com/customsearch/v1";
           
                    const xhr = new XMLHttpRequest();
                    xhr.open("GET", chkurl);
                    
                    xhr.onload = function() {
                        sessionStorage.setItem("gcon", "1");
                        vm.connected = "1";            
                        vm.searching = false;
                        vm.first_call();
                    };
                    
                    xhr.ontimeout = function() {
                        vm.unavailable();
                        sessionStorage.setItem("gcon", "2");
                        vm.connected = "2";
                    };
                    
                    xhr.onerror = function() {
                        vm.error_message = "Error: "+this.status;
                        sessionStorage.setItem("gcon", "3");
                        vm.connected = 3;
                        vm.searching = false;
                    };
                    
                    xhr.send();
                    break;
                case "1":
                    vm.searching = false;
                    vm.first_call();
                    break;
                case "2":
                    vm.unavailable();
                    break;
                default:
                    vm.searching = false;
                    break;
            }
        });
  },
  methods: {
    first_call: function() {
        vm.set_environment();

        if (vm.set_options() === false) {
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
                this.lang = this.app;
                this.app = "common";
                break;
        }
        
        // get region code from html lang
        const htmllang = document.documentElement.lang;
        if (htmllang === "zh-tw") {
            this.region = "jp";
            this.lang = "zhtw";
        } else {
            this.region = htmllang.substr(3,2);
        }
    },
    set_options: function () {
        const qstr = location.search;
        if (qstr.length <= 0) return false;

        // parse query string
        // because we have to support IE, we can not use URLSearchParams()
        const qs = [];
        const qlist = qstr.substring(1).split('&');
        for (let i = 0; i < qlist.length; i++) {
            let pi = qlist[i].split('=');
            qs[pi[0]] = pi[1];
        }

        if("c" in qs) {
            // category tab number
            this.cid = Number(qs.c);
        }

        if("start" in qs) {
            // start page
            this.start = Number(qs.start);
        }

        if(("q" in qs) && (qs.q.length > 0)){
            // search text
            this.search_words = decodeURIComponent(qs.q);
        } else {
            return false;
        }
 
        // category_list should be defined Global
        if (category_list != null ) {
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

            newpath = newpath + "?c=" + this.cid + "&start=" + vm.start + "&q=" + encodeURIComponent(words);
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
})

const callSearchApi = function() {
    const words = vm.search_words;

    const target = searchUrl + "?app=" + vm.app + "&c=" + vm.cid + "&lang=" + vm.lang + "&r=" + vm.region + "&start=" + vm.start  + "&q=" + encodeURIComponent(words);
    vm.searching = true;

    // because we have to support IE, we can not use fetch()
    const xhr = new XMLHttpRequest();
    xhr.open("GET", target);
    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            if(this.status == 200) {
                const jd = JSON.parse(this.response);

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
                        const lastnum = vm.total + 10;
                        for (let i = 10; lastnum >= i; i = i + 10) {
                            pages.push(i/10);

                            // because the maximum number of search items is 100
                            // the maximum number of pages is 10
                            if (i >= 100) break;
                        }
                        vm.pages = pages;
                    }

                    if(jd.hasOwnProperty("items")) {
                        const rec_items = jd["items"];
                        vm.items = rec_items;
                    }
                } else {
                    vm.error_message = jd["error"].message;
                }
                vm.initial = false;
            }
            vm.resetButton();
        } 
    }
    
    xhr.onerror = function() {
        if (xhr.status === 0) {
            vm.error_message = "Network error.";
        } else {
            vm.error_message = "Error: status=" + xhr.status;
        }
        vm.initial = false;
        vm.resetButton();
    }
    
    xhr.onabort = function() {
        vm.resetButton();
    }
    
    xhr.ontimeout = function() {
        vm.resetButton();
    }

    xhr.send();

}
}());
