/// <reference path="../lib/core.tsx" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
define(["require", "exports", 'react', '../lib/core'], function (require, exports, React, core) {
    "use strict";
    var BasePanel = (function (_super) {
        __extends(BasePanel, _super);
        function BasePanel(props) {
            _super.call(this, props);
        }
        BasePanel.prototype.render = function () {
            var props = _.extend({}, this.props);
            var toolbox = !this.props.toolbox ? 'hidden' : null;
            var html = React.createElement("div", __assign({className: "ibox"}, props), React.createElement("div", {className: "ibox-title hidden"}, React.createElement("h5", {className: "title"}, this.props.title), React.createElement("div", {className: "ibox-tools {0}".format(toolbox)}, React.createElement("a", {className: "collapse-link"}, React.createElement("i", {className: "fa fa-chevron-up"})), React.createElement("a", {className: "dropdown-toggle", "data-toggle": "dropdown", href: "#"}, React.createElement("i", {className: "fa fa-wrench"})), React.createElement("ul", {className: "dropdown-menu dropdown-user"}, React.createElement("li", null, React.createElement("a", {href: "#"}, "Config option 1")), React.createElement("li", null, React.createElement("a", {href: "#"}, "Config option 2"))), React.createElement("a", {className: "close-link"}, React.createElement("i", {className: "fa fa-times"})))), React.createElement("div", {className: "ibox-content col-lg-12"}, this.props.children), React.createElement("div", {className: "ibox-footer hidden"}));
            return html;
        };
        BasePanel.prototype.componentDidMount = function () {
            this.init_toolbox();
        };
        BasePanel.prototype.init_toolbox = function () {
            // Collapse ibox function
            this.jget('.collapse-link').click(function () {
                var ibox = $(this).closest('div.ibox');
                var button = $(this).find('i');
                var content = ibox.find('div.ibox-content');
                content.slideToggle(200);
                button.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
                ibox.toggleClass('').toggleClass('border-bottom');
                setTimeout(function () {
                    ibox.resize();
                    ibox.find('[id^=map-]').resize();
                }, 50);
            });
            // Close ibox function
            this.jget('.close-link').click(function () {
                var content = $(this).closest('div.ibox');
                content.remove();
            });
            if (this.props.onfooter) {
                this.jget('.ibox-footer').removeClass('hidden');
                this.props.onfooter(this, this.jget('.ibox-footer'));
            }
        };
        return BasePanel;
    }(core.base.BaseView));
    exports.BasePanel = BasePanel;
});
//# sourceMappingURL=C:/afriknet/zando.admin/zando.admin/Reactive.v1/js/ctrls/panels.js.map