/// <reference path="dashboard.tsx" />
/// <reference path="organization.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', '../../lib/core', './organization', './dashboard', 'react-bootstrap'], function (require, exports, React, core, organization_1, dashboard_1, rb) {
    "use strict";
    var b = rb;
    var AccountView = (function (_super) {
        __extends(AccountView, _super);
        function AccountView() {
            _super.apply(this, arguments);
        }
        AccountView.prototype.render = function () {
            var html = React.createElement("div", {className: "row"}, React.createElement(b.Col, {xs: 12}, this.resolve_content()));
            return html;
        };
        AccountView.prototype.update_url_path = function () {
            var route = this.app.router.current_route;
            $('.path-title').html(route.title);
            $('.path-url li').not('.path-home').remove();
            _.each(route.path, function (p) {
                $('.path-url ol').append($('<li>{0}</li>'.format(p)));
            });
        };
        AccountView.prototype.exit_login = function () {
            $('body').removeClass('gray-bg');
            $('#wrapper').show();
            $('.login-view').hide();
        };
        AccountView.prototype.resolve_content = function () {
            if (this.props.params) {
                return this.resolve_subview();
            }
            else {
                return this.default_content();
            }
        };
        AccountView.prototype.default_content = function () {
            return React.createElement(dashboard_1.DashboardView, null);
        };
        AccountView.prototype.resolve_subview = function () {
            switch (this.props.params) {
                case '/account/organization':
                    return React.createElement(organization_1.OrganizationView, null);
                default:
                    return this.default_content();
            }
        };
        AccountView.prototype.componentDidMount = function () {
            _super.prototype.componentDidMount.call(this);
            $.getScript('/js/inspinia.js');
            this.update_url_path();
            this.highlight_active_menu();
        };
        AccountView.prototype.highlight_active_menu = function () {
            $('.sidebar-collapse li').removeClass('active');
            $('.sidebar-collapse li a').removeClass('active');
            var menu = this.props.params;
            if (!menu || menu === '/') {
                menu = '/account/dashboard';
            }
            $('.nav-second-level [href="{0}"]'.format(menu)).closest('li').addClass('active');
            $('.nav-second-level [href="{0}"]'.format(menu)).parents('li').last().addClass('active');
        };
        return AccountView;
    }(core.base.BaseView));
    exports.AccountView = AccountView;
});
//# sourceMappingURL=C:/afriknet/zando.admin/zando.admin/Reactive.v1/js/views/company/account.js.map