// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', '../../lib/core', '../../ctrls/panels', 'react-bootstrap'], function (require, exports, React, core, pn, rb) {
    "use strict";
    var b = rb;
    var ProfilesExplorer = (function (_super) {
        __extends(ProfilesExplorer, _super);
        function ProfilesExplorer() {
            _super.apply(this, arguments);
        }
        ProfilesExplorer.prototype.render = function () {
            var html = React.createElement(b.Row, {className: "animated fadeInRight"}, React.createElement(b.Col, {md: 5, xs: 12}, React.createElement(pn.BasePanel, {style: { minHeight: 350 }}, React.createElement("h2", null, "Profiles ", React.createElement("button", {className: "btn btn-primary pull-right btn-new-profile"}, React.createElement("i", {className: "fa fa-plus-circle"}), " Add new ")), React.createElement("hr", null))), React.createElement(b.Col, {md: 7, xs: 12}, this.resolve_right_view()));
            return html;
        };
        ProfilesExplorer.prototype.componentDidMount = function () {
            _super.prototype.componentDidMount.call(this);
            this.update_url_path();
            this.exit_login();
            this.init_actions();
            this.highlight_active_menu();
        };
        ProfilesExplorer.prototype.init_actions = function () {
            var _this = this;
            this.root.find('.btn-new-profile').click(function () {
                _this.setState(_.extend(_this.state, {
                    right_view: 'add_new_profile'
                }));
            });
        };
        ProfilesExplorer.prototype.highlight_active_menu = function () {
            $('.sidebar-collapse li').removeClass('active');
            $('.sidebar-collapse li a').removeClass('active');
            var menu = this.props.params;
            if (!menu || menu === '/') {
                menu = '/profiles/explore';
            }
            $('.nav-second-level [href="{0}"]'.format(menu)).closest('li').addClass('active');
            $('.nav-second-level [href="{0}"]'.format(menu)).parents('li').last().addClass('active');
        };
        ProfilesExplorer.prototype.resolve_right_view = function () {
            switch (this.state.right_view) {
                case 'add_new_profile': {
                    return React.createElement(pn.BasePanel, {className: "animated fadeInRight", style: { minHeight: 350 }}, React.createElement("h2", null, React.createElement("i", {className: "fa fa-plus-circle"}), " New profile"), React.createElement("hr", null));
                }
                default:
                    return React.createElement(pn.BasePanel, {style: { minHeight: 350 }}, React.createElement("h2", null, React.createElement("i", {className: "fa fa-edit"}), " Edit profile"), React.createElement("hr", null));
            }
        };
        ProfilesExplorer.prototype.exit_login = function () {
            $('body').removeClass('gray-bg');
            $('#wrapper').show();
            $('.login-view').hide();
        };
        ProfilesExplorer.prototype.update_url_path = function () {
            var route = this.app.router.current_route;
            $('.path-title').html(route.title);
            $('.path-url li').not('.path-home').remove();
            _.each(route.path, function (p) {
                $('.path-url ol').append($('<li>{0}</li>'.format(p)));
            });
        };
        return ProfilesExplorer;
    }(core.base.BaseView));
    exports.ProfilesExplorer = ProfilesExplorer;
});
//# sourceMappingURL=C:/afriknet/zando.admin/zando.admin/Reactive.v1/js/views/profiles/profiles_explore.js.map