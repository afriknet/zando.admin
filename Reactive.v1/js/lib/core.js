// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', 'react-dom'], function (require, exports, React, ReactDOM) {
    "use strict";
    var __router_ctx;
    var __app;
    var types;
    (function (types) {
        (function (Usertype) {
            Usertype[Usertype["admin"] = 0] = "admin";
            Usertype[Usertype["contact"] = 1] = "contact";
            Usertype[Usertype["guest"] = 2] = "guest";
        })(types.Usertype || (types.Usertype = {}));
        var Usertype = types.Usertype;
    })(types = exports.types || (exports.types = {}));
    var base;
    (function (base) {
        var BaseView = (function (_super) {
            __extends(BaseView, _super);
            function BaseView(props) {
                _super.call(this, props);
                this.props = props;
                this.state = {};
            }
            Object.defineProperty(BaseView.prototype, "app", {
                get: function () {
                    return __app;
                },
                enumerable: true,
                configurable: true
            });
            BaseView.prototype.initalize_state = function () {
                return {};
            };
            Object.defineProperty(BaseView.prototype, "root", {
                get: function () {
                    return $(ReactDOM.findDOMNode(this));
                },
                enumerable: true,
                configurable: true
            });
            BaseView.prototype.jget = function (sel) {
                return this.root.find(sel);
            };
            BaseView.prototype.notify = function (cmd, data) {
                return Q.resolve(true);
            };
            BaseView.prototype.componentWillMount = function () {
            };
            BaseView.prototype.componentDidUpdate = function () {
            };
            BaseView.prototype.componentWillUnmount = function () {
            };
            BaseView.prototype.componentDidMount = function () {
            };
            return BaseView;
        }(React.Component));
        base.BaseView = BaseView;
    })(base = exports.base || (exports.base = {}));
    var application;
    (function (application) {
        var Router = (function () {
            function Router(app) {
                this.__app = app;
            }
            Router.prototype.init_routes = function (routes) {
                var _this = this;
                this.routes = routes;
                _.each(Object.keys(routes), function (key) {
                    var route = routes[key];
                    page(key, function (ctx) {
                        _this.params = ctx.params;
                        var url = _.find(Object.keys(_this.routes), function (r) {
                            return r === key;
                        });
                        var route = null;
                        if (url) {
                            route = _this.routes[url];
                        }
                        if (!route) {
                        }
                        _this.current_route = route;
                        var path = '..' + utils.Path.join('/views', route.url);
                        var that = _this;
                        var __params = key;
                        require([path], function (module) {
                            var view = module[Object.keys(module)[0]];
                            ReactDOM.unmountComponentAtNode($(that.__app.settings.rootpage)[0]);
                            $(_this.__app.settings.rootpage).empty();
                            ReactDOM.render(React.createElement(view, {
                                params: __params
                            }), $(_this.__app.settings.rootpage)[0]);
                        });
                    });
                });
                page.start();
            };
            Router.prototype.update_url = function (url) {
                return page.show(url, null, false);
            };
            Router.prototype.navigate = function (urlpath) {
                return page(urlpath);
            };
            return Router;
        }());
        application.Router = Router;
        var App = (function () {
            function App() {
            }
            Object.defineProperty(App.prototype, "router", {
                get: function () {
                    if (!this.__router) {
                        this.__router = new application.Router(this);
                    }
                    return this.__router;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(App.prototype, "settings", {
                get: function () {
                    return this.__setts;
                },
                enumerable: true,
                configurable: true
            });
            App.prototype.get_default_settings = function () {
                return {
                    rootpage: '#root-page',
                    masterpage_template: '/html/masterpage.html',
                    homepage_template: '/html/homepage.html',
                    viewpath_root: ''
                };
            };
            App.prototype.load_settings = function () {
                var _this = this;
                var d = Q.defer();
                require(['../config/settings'], function (fn) {
                    _this.__setts = _.extend(_this.get_default_settings(), fn['settings']);
                    _this.load_backendless();
                    d.resolve(fn);
                });
                return d.promise;
            };
            App.prototype.load_rootes = function () {
                var _this = this;
                var d = Q.defer();
                require(['../config/routes'], function (fn) {
                    var routes = fn['routes'];
                    _this.router.init_routes(routes);
                    d.resolve(fn);
                });
                return d.promise;
            };
            App.prototype.load_backendless = function () {
                Backendless.initApp(this.settings.BACKENDLESS_APPID, this.settings.BACKENDLESS_KEYID, this.settings.BACKENDLESS_VERID);
            };
            App.prototype.store_user = function (usr) {
                cookies.set('current-user', usr);
            };
            App.prototype.get_user = function () {
                return cookies.get('current-user');
            };
            App.prototype.login = function (email, password) {
                var _this = this;
                var d = Q.defer();
                Backendless.UserService.login(email, password, true, new Backendless.Async(function (data) {
                    _this.store_user(data);
                }, function (err) {
                    d.reject(err);
                }));
                return d.promise;
            };
            App.prototype.signup = function (params) {
                var usr = new Backendless.User();
                usr.email = params.email;
                usr.password = params.password;
                usr['name'] = params.name;
                usr['surname'] = params.surname;
                var d = Q.defer();
                Backendless.UserService.register(usr, new Backendless.Async(function (data) {
                    d.resolve(data);
                }, function (err) {
                    d.reject(err);
                }));
                return d.promise;
            };
            App.prototype.login_as_guest = function () {
                var d = Q.defer();
                Backendless.UserService.login('guest@gmail.com', 'guest', false, new Backendless.Async(function (res) {
                    d.resolve(true);
                }, function (err) {
                    d.reject(false);
                }));
                return d.promise;
            };
            App.prototype.start = function () {
                var _this = this;
                Q.all([
                    this.load_settings(),
                    //this.load_moltin(),
                    this.load_rootes()]).then(function () {
                    return _this.login_as_guest();
                });
            };
            return App;
        }());
        application.App = App;
        function InitApplication() {
            __app = new application.App();
            __app.start();
        }
        application.InitApplication = InitApplication;
    })(application = exports.application || (exports.application = {}));
});
//# sourceMappingURL=C:/afriknet/zando.admin/zando.admin/Reactive.v1/js/lib/core.js.map