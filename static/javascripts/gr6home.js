'use strict';

(function() {

    // Menu component
    const MenuTitle = {
        props: ["type", "item"],
        template: `<div class="home-menu-item-title">
                        <div v-bind:class="'home-menu-item-title-img home-menu-item-title-img-' + this.type" v-bind:style="{ backgroundImage: 'url(' + this.item.img_src + ')' }"></div>
                        <div class="home-menu-item-text">
                                {{ this.item.title }}
                        </div>
                    </div>`
    }
    const MenuCard = {
        props: ["type", "item", "admin"],
        components:{
            MenuTitle
        },
        template: `<div>
                        <a v-if="this.item.link_href" v-bind:href="this.item.link_href" target="_self" class="home-menu-item-title-container">
                            <menu-title :item="item" :type="type" />
                        </a>
                        <div v-else class="home-menu-item-title-container">
                            <menu-title :item="item" :type="type" />
                        </div>
                        <div class="home-menu-item-description">{{ this.item.description }}</div>
                    </div>
                    <div v-if="this.item.admin_href" class="home-menu-item-admin" >
                        <div class="home-menu-item-admin-img" v-bind:style="{ backgroundImage: 'url(' + this.admin.icon + ')' }"></div>
                        <div class="home-menu-item-admin-text" >
                            <a v-bind:href="this.item.admin_href">{{ this.admin.title }}</a>
                        </div>
                    </div>`
    };
    const vm = Vue.createApp({
        delimiters: ['[[', ']]'],
        data() {
            return {
                menus: [],
                langid: "en",
                productid: "",
            }
        },
        created() {
            this.langid = getLangId();
            this.productid = getProductId();
        },
        components: {
            MenuCard,
        },
        async mounted() {
            fetch(`/${this.productid}/${this.langid}/home.json`, { cache: 'no-cache' }).then((resp) => {
                if(!resp.ok) {
                    throw new Error(resp.statusText);
                }
                return resp.json();
            }).then((json) => {
                this.menus = json;
            }).catch(error => {
                console.log(error);
            });
        },
        methods: {
            show: function() {
            }
        }
    }).mount('#content');


    // URLから対象言語を取り出す
    function getLangId() {
        let langid = "en";
        const url = new URL(window.location.href);
        const pname = url.pathname;
        const pathes = pname.split("/");
        if (pathes.length > 2) {
            langid = pathes[2].replace(".html", "");
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

    vm.show();
})();
