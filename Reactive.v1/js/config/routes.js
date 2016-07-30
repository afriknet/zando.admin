/// <reference path="../lib/jx.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.routes = {
        '/': {
            url: 'home/home',
            title: 'Account',
            path: ['<a href="/account/dashboard">Company</a>', '<strong>Dashboard</strong>']
        },
        '/login': {
            params: 'login',
            url: 'home/home',
        },
        '/inventaire/articles': {
            url: 'inventory/articles',
            title: 'Articles',
            path: ['<a href="/Accueil/articles">Articles</a>', '<strong>Articles</strong>']
        },
        '/inventaire/categories': {
            url: '/inventory/articles_categories',
            title: 'Categories',
            path: ['<a href="/inventaire/categories"><strong>Cartegories</strong></a>'] //'',
        }
    };
});
//# sourceMappingURL=C:/afriknet/zando.admin/zando.admin/Reactive.v1/js/config/routes.js.map