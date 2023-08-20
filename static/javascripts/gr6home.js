'use strict';

(function() {

    // Menu component
    const MenuCardTitle = {
        props: ["type", "item"],
        template: `<div v-bind:class="'home-menu-item-title-img home-menu-item-title-img-' + this.type"
                        v-bind:style="{ backgroundImage: 'url(' + this.item.icon + ')' }"></div>
                    <div class="home-menu-item-title-text">{{ this.item.title }}</div>`
    }
    const MenuCardAdmin = {
        props: ["admin"],
        template: `
                    <div class="home-menu-item-admin-img" v-bind:style="{ backgroundImage: 'url(' + this.admin.icon + ')' }"></div>
                    <div class="home-menu-item-admin-text" >{{ this.admin.title }}</div>
                    `
    }
    const MenuCard = {
        props: ["type", "item", "admin"],
        components:{
            MenuCardTitle,
            MenuCardAdmin
        },
        template: `<div>
                        <div class="home-menu-item-title-container">
                            <a v-if="this.item.link_href" v-bind:href="this.item.link_href" target="_self" class="home-menu-item-title">
                                <menu-card-title :item="item" :type="type" />
                            </a>
                            <div v-else class="home-menu-item-title">
                                <menu-card-title :item="item" :type="type" />
                            </div>
                        </div>
                        <div class="home-menu-item-description">{{ this.item.description }}</div>
                    </div>
                    <div v-if="this.admin" class="home-menu-item-admin-container">
                        <a v-if="this.item.admin_href" v-bind:href="this.item.admin_href" class="home-menu-item-admin" >
                            <menu-card-admin :admin="admin" />
                        </a>
                        <div v-else class="home-menu-item-admin" >
                            <menu-card-admin :admin="admin" />
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
            // アンカー付きURL対応
            // 1秒待ってから移動させる
            this.$nextTick(function () {
                const hash = window.location.hash;
                if(hash) {
                    const hashBody = hash.replace("#", "");
                    setTimeout(() => {
                        const el = document.getElementById(hashBody);
                        if(el !== null) {
                            el.scrollIntoView();
                        }
                    }, 1000);
                }
            })
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
})();
