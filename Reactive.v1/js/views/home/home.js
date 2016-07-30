/// <reference path="../company/account.tsx" />
/// <reference path="../../lib/core.tsx" />
/// <reference path="../../ctrls/panels.tsx" />
/// <reference path="../../../typings/react/react-bootstrap.d.ts" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', 'react-dom', '../../lib/core', '../../ctrls/panels', '../company/account', 'react-bootstrap'], function (require, exports, React, ReactDOM, core, pn, account_1, rb) {
    "use strict";
    var b = rb;
    var HomeView = (function (_super) {
        __extends(HomeView, _super);
        function HomeView() {
            _super.apply(this, arguments);
        }
        HomeView.prototype.render = function () {
            var html = React.createElement("div", {className: "row"}, this.resolve_content());
            return html;
        };
        HomeView.prototype.resolve_content = function () {
            if (this.props.params) {
                return this.resolve_subview();
            }
            else {
                return this.default_content();
            }
        };
        HomeView.prototype.default_content = function () {
            if (this.app.router.params === 'login' || !Backendless.UserService.getCurrentUser()) {
                return null;
            }
            else {
                return React.createElement(account_1.AccountView, null);
            }
        };
        HomeView.prototype.enter_login = function () {
            $('body').addClass('gray-bg');
            $('.login-view').show();
            $('#wrapper').hide();
        };
        HomeView.prototype.exit_login = function () {
            $('body').removeClass('gray-bg');
            $('#wrapper').show();
            $('.login-view').hide();
        };
        HomeView.prototype.resolve_subview = function () {
            switch (this.props.params) {
                default:
                    return this.default_content();
            }
        };
        HomeView.prototype.componentDidMount = function () {
            _super.prototype.componentDidMount.call(this);
            if (this.app.router.params === 'login' || !Backendless.UserService.getCurrentUser()) {
                this.enter_login();
                ReactDOM.render(React.createElement(Login, null), $('.login-view')[0]);
            }
            else {
                this.exit_login();
            }
            this.highlight_active_menu();
        };
        HomeView.prototype.highlight_active_menu = function () {
            $('.sidebar-collapse li').removeClass('active');
            $('.sidebar-collapse li a').removeClass('active');
            var menu = this.props.params;
            if (!menu || menu === '/') {
                menu = '/account/dashboard';
            }
            $('.nav-second-level [href="{0}"]'.format(menu)).closest('li').addClass('active');
            $('.nav-second-level [href="{0}"]'.format(menu)).parents('li').last().addClass('active');
        };
        return HomeView;
    }(core.base.BaseView));
    exports.HomeView = HomeView;
    var Panels = (function (_super) {
        __extends(Panels, _super);
        function Panels() {
            _super.apply(this, arguments);
        }
        Panels.prototype.render = function () {
            var html = React.createElement("div", {className: "col-lg-12 animated fadeInRight"}, React.createElement("div", {className: "col-lg-6"}, React.createElement(pn.BasePanel, {title: "Default container"}, React.createElement("h4", null, "Some random content"), React.createElement("p", null, "Aenean commodo ligula eget dolor.Aenean massa.Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.Nulla consequat massa quis enim."), React.createElement("p", null, "Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu.In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.Nullam dictum felis eu pede mollis pretium.Integer tincidunt.Cras dapibus.Vivamus elementum semper nisi."))), React.createElement("div", {className: "col-lg-6"}, React.createElement(pn.BasePanel, {title: "Default container", toolbox: true}, React.createElement("h4", null, "Basic panel with toolbox"), React.createElement("p", null, "Aenean commodo ligula eget dolor.Aenean massa.Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.Nulla consequat massa quis enim."), React.createElement("p", null, "Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu.In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.Nullam dictum felis eu pede mollis pretium.Integer tincidunt.Cras dapibus.Vivamus elementum semper nisi."))), React.createElement("div", {className: "col-lg-6"}, React.createElement(pn.BasePanel, {title: "Bootstrap classic panel", toolbox: true}, React.createElement("h4", null, "Bootstrap classic panel"), React.createElement(b.Panel, {header: "Bootstrap", bsStyle: "primary"}, "Panel content"))));
            return html;
        };
        Panels.prototype.componentDidMount = function () {
        };
        return Panels;
    }(core.base.BaseView));
    var Login = (function (_super) {
        __extends(Login, _super);
        function Login() {
            _super.apply(this, arguments);
        }
        Login.prototype.render = function () {
            var html = React.createElement("div", {className: "middle-box text-center loginscreen animated fadeInDown"}, React.createElement("div", null, React.createElement("div", {className: "text-center"}, React.createElement("h1", {className: "logo-name"}, "HR+")), React.createElement("h3", null, "Welcome to Stamp HR"), React.createElement("p", null, "Perfectly designed and precisely prepared admin theme with over 50 pages with extra new web app views."), React.createElement("p", null, "Login in.To see it in action."), React.createElement("form", {action: "index.html", role: "form", className: "m-t"}, React.createElement("div", {className: "form-group"}, React.createElement("input", {type: "email", required: true, placeholder: "Username", className: "form-control"})), React.createElement("div", {className: "form-group"}, React.createElement("input", {type: "password", required: true, placeholder: "Password", className: "form-control"})), React.createElement("button", {className: "btn btn-primary block full-width m-b btn-login", type: "button"}, "Login"), React.createElement("a", {href: "#"}, React.createElement("small", null, "Forgot password?")), React.createElement("p", {className: "text-muted text-center"}, React.createElement("small", null, "Do not have an account?")), React.createElement("a", {href: "register.html", className: "btn btn-sm btn-white btn-block"}, "Create an account")), React.createElement("p", {className: "m-t"}, " ", React.createElement("small", null, "Inspinia we app framework base on Bootstrap 3 © 2014"), " ")));
            return html;
        };
        Login.prototype.componentDidMount = function () {
            var _this = this;
            $('.btn-login').off('click');
            $('.btn-login').click(function () {
                _this.login($(_this.root).find('[type="email"]').val(), $(_this.root).find('[type="password"]').val());
            });
            this.login('seyaobey@gmail.com', 'JazzTheSoul1.');
        };
        Login.prototype.login = function (email, password) {
            var _this = this;
            utils.spin($('body'));
            Backendless.UserService.login(email, password, true, new Backendless.Async(function (res) {
                utils.unspin($('body'));
                toastr.success('Login was successfull');
                _this.app.router.navigate('/');
            }, function (err) {
                utils.unspin($('body'));
                toastr.error(err['message']);
            }));
        };
        return Login;
    }(core.base.BaseView));
});
//# sourceMappingURL=C:/afriknet/zando.admin/zando.admin/Reactive.v1/js/views/home/home.js.map