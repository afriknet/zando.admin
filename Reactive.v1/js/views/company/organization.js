/// <reference path="edit_division.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', 'react-dom', '../../lib/core', '../../ctrls/panels', 'react-bootstrap', './edit_division'], function (require, exports, React, ReactDOM, core, pn, rb, edit_division_1) {
    "use strict";
    var b = rb;
    var OrganizationView = (function (_super) {
        __extends(OrganizationView, _super);
        function OrganizationView(props) {
            _super.call(this, props);
            this.state.loading = true;
            this.first_load = true;
        }
        OrganizationView.prototype.render = function () {
            var html = React.createElement(b.Row, {className: "animated fadeInRight"}, React.createElement(b.Col, {md: 5, xs: 12}, React.createElement(pn.BasePanel, {style: { minHeight: 350 }}, this.get_divs_list())), React.createElement(b.Col, {md: 7, xs: 12}, React.createElement("div", {className: "division-placeholder"})));
            return html;
        };
        OrganizationView.prototype.componentDidMount = function () {
            _super.prototype.componentDidMount.call(this);
            this.forceUpdate();
        };
        OrganizationView.prototype.componentDidUpdate = function () {
            var _this = this;
            if (this.state.loading) {
                utils.spin(this.root);
                this.load_divs_data().then(function () {
                    _this.setState(_.extend({}, _this.state, {
                        loading: false
                    }));
                    _this.state.divid = null;
                }).finally(function () {
                    utils.unspin(_this.root);
                }).done(function () {
                });
            }
            if (!this.state.loading) {
                if (this.divs_data && this.divs_data.length > 0) {
                    if (this.first_load) {
                        this.first_load = false;
                        this.refs['divs_listview']['select'](this.divs_data[0]['objectId']);
                    }
                }
            }
        };
        OrganizationView.prototype.load_divs_data = function () {
            var _this = this;
            var model = Backendless.Persistence.of('compdivs');
            var qry = new Backendless.DataQuery();
            qry.condition = "usrid = '{0}'".format(Backendless.UserService.getCurrentUser()['objectId']);
            qry.options = { relations: ["depts"] };
            var d = Q.defer();
            utils.spin(this.root);
            model.find(qry, new Backendless.Async(function (res) {
                _this.divs_data = res.data;
                utils.unspin(_this.root);
                _this.setState({
                    loading: false
                });
                d.resolve(true);
            }, function (err) {
                utils.unspin(_this.root);
                _this.setState({
                    loading: false
                });
                d.reject(false);
            }));
            return d.promise;
        };
        OrganizationView.prototype.add_division = function () {
            ReactDOM.unmountComponentAtNode(this.jget('.division-placeholder')[0]);
            ReactDOM.render(React.createElement(edit_division_1.EditDivision, {divid: null, owner: this}), this.jget('.division-placeholder')[0]);
        };
        OrganizationView.prototype.edit_division = function (id) {
            ReactDOM.unmountComponentAtNode(this.jget('.division-placeholder')[0]);
            this.jget('.division-placeholder').empty();
            this.state.divid = id;
            ReactDOM.render(React.createElement(edit_division_1.EditDivision, {divid: id, owner: this}), this.jget('.division-placeholder')[0]);
        };
        OrganizationView.prototype.cancel_edit = function (id) {
            this.edit_division(id);
        };
        OrganizationView.prototype.get_divs_list = function () {
            var selectid = this.state.divid;
            var html = React.createElement("div", null, React.createElement("div", {className: "row", style: { paddingLeft: 20, paddingRight: 20 }}, React.createElement("h2", {style: { display: 'inline-block' }}, "Company divisions"), React.createElement("a", {href: "#", className: "btn btn-primary btn-outline pull-right", onClick: this.add_division.bind(this)}, React.createElement("i", {className: "fa fa-plus"}), " new division")), React.createElement("hr", null), React.createElement("div", null, React.createElement(DivisionList, {ref: 'divs_listview', data: this.divs_data, select_id: selectid, owner: this})));
            return html;
        };
        OrganizationView.prototype.notify = function (cmd, data) {
            switch (cmd) {
                case "update-list":
                    this.setState(_.extend({}, this.state, {
                        selected_divid: data,
                        loading: true
                    }));
                    return Q.resolve(true);
                default:
                    return _super.prototype.notify.call(this, cmd, data);
            }
        };
        return OrganizationView;
    }(core.base.BaseView));
    exports.OrganizationView = OrganizationView;
    var DivisionList = (function (_super) {
        __extends(DivisionList, _super);
        function DivisionList() {
            _super.apply(this, arguments);
        }
        DivisionList.prototype.render = function () {
            var _this = this;
            var html = React.createElement("ul", {id: "inprogress", className: "sortable-list connectList agile-list"}, _.map(this.props.data, function (div) {
                return _this.get_divs_view(div);
            }));
            return html;
        };
        DivisionList.prototype.select = function (id) {
            this.edit_div(id);
        };
        DivisionList.prototype.get_divs_view = function (div) {
            var _this = this;
            if (this.state.loading) {
                return;
            }
            var type = 'info-element';
            if (this.props.select_id === div['objectId']) {
                type = 'danger-element highlight';
            }
            var html = React.createElement("li", {key: div['objectId'], "data-rowid": div['objectId'], className: type}, React.createElement("a", {href: 'javascript:void(0)', onClick: function (e) { _this.edit_div(div['objectId']); }, style: { display: 'block', fontSize: 15 }}, div['compdiv_title']), React.createElement("span", {className: "text-muted"}, div['compdiv_descr']), React.createElement("div", {className: "agile-detail row", style: { paddingRight: 10, marginTop: 0 }}, React.createElement("div", {className: "pull-right"}, React.createElement("a", {className: "btn btn-xs btn-white btn-edit", href: "javascript:void(0)", onClick: function (e) { _this.edit_div(div['objectId']); }, style: { marginRight: 10 }}, React.createElement("i", {className: "fa fa-edit"}), " edit"), React.createElement("a", {className: "btn btn-xs btn-white", href: "javascript:void(0)"}, React.createElement("i", {className: "fa fa-times"}), " delete "))));
            return html;
        };
        DivisionList.prototype.componentDidMount = function () {
            _super.prototype.componentDidMount.call(this);
            this.forceUpdate();
        };
        DivisionList.prototype.componentDidUpdate = function () {
        };
        DivisionList.prototype.edit_div = function (id) {
            this.jget('.danger-element').removeClass('danger-element highlight').addClass('info-element');
            this.jget('[data-rowid="{0}"]'.format(id)).removeClass('info-element').addClass('danger-element highlight');
            this.props.owner['edit_division'](id);
        };
        return DivisionList;
    }(core.base.BaseView));
});
//# sourceMappingURL=C:/afriknet/zando.admin/zando.admin/Reactive.v1/js/views/company/organization.js.map