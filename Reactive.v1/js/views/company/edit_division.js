/// <reference path="../../../typings/toastr/toastr.d.ts" />
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
    var EditDivision = (function (_super) {
        __extends(EditDivision, _super);
        function EditDivision(props) {
            _super.call(this, props);
            this.state.loading = true;
        }
        EditDivision.prototype.render = function () {
            var icon = React.createElement("i", {className: "fa fa-edit", style: { marginRight: 10 }});
            var title = "Edit division";
            if (!this.props.divid) {
                icon = React.createElement("i", {className: "fa fa-plus-circle", style: { marginRight: 10 }});
                title = "Add new division";
            }
            var html = React.createElement(pn.BasePanel, {className: "animated fadeInRight"}, React.createElement("div", {className: "row", style: { paddingLeft: 20, paddingRight: 20 }}, React.createElement("h2", {style: { display: 'inline-block' }}, icon, title), React.createElement("a", {href: "#", className: "btn btn-warning pull-right", onClick: this.cancel.bind(this), style: { marginLeft: 10 }}, React.createElement("i", {className: "fa fa-times"}), " cancel"), React.createElement("a", {href: "#", className: "btn btn-success pull-right btn-save btn-save", onClick: this.save.bind(this)}, React.createElement("i", {className: "fa fa-check"}), " save")), React.createElement("br", null), React.createElement("div", {className: "row", style: { paddingLeft: 20, paddingRight: 20 }}, React.createElement("form", {role: "form"}, React.createElement("div", {className: "form-group"}, React.createElement("label", null, "Title"), " ", React.createElement("input", {type: "text", "data-bind": "textInput:compdiv_title", id: "compdiv_title", className: "form-control", placeholder: "Enter a title"})), React.createElement("div", {className: "form-group"}, React.createElement("label", null, "Description"), " ", React.createElement("textarea", {"data-bind": "textInput:compdiv_descr", id: "compdiv_descr", rows: 4, className: "form-control", placeholder: "Enter a division"})))), React.createElement("hr", null), React.createElement("div", {className: "depst"}, this.display_deps()));
            return html;
        };
        EditDivision.prototype.display_deps = function () {
            if (this.state.loading) {
                return;
            }
            var depts = !this.item ? [] : this.item.depts();
            return React.createElement(DepartmentsList, {div_obj: this.item});
        };
        EditDivision.prototype.componentDidMount = function () {
            _super.prototype.componentDidMount.call(this);
            this.forceUpdate();
        };
        EditDivision.prototype.componentDidUpdate = function () {
            var _this = this;
            if (this.state.loading) {
                if (this.props.divid) {
                    utils.spin(this.root);
                    this.load_data().then(function () {
                        _this.setState(_.extend({}, _this.state, {
                            loading: false
                        }));
                        ko.cleanNode(_this.root[0]);
                        ko.applyBindings(_this.item, _this.root[0]);
                    }).finally(function () {
                        utils.unspin(_this.root);
                    });
                }
            }
        };
        EditDivision.prototype.load_data = function () {
            var model = Backendless.Persistence.of('compdivs');
            var qry = new Backendless.DataQuery();
            qry.condition = "objectId = '{0}'".format(this.props.divid);
            qry.options = { relations: ["depts"] };
            var d = Q.defer();
            var that = this;
            model.find(qry, new Backendless.Async(function (res) {
                that.item = ko['mapping'].fromJS(res.data[0]);
                d.resolve(true);
            }, function (err) {
                d.reject(false);
            }));
            return d.promise;
        };
        EditDivision.prototype.save = function () {
            var _this = this;
            if (!this.props.divid) {
                utils.spin(this.root);
                return this.add_div()
                    .then(function () {
                    //this.props.owner.notify('update-list');
                    return true;
                })
                    .finally(function () { utils.unspin(_this.root); });
            }
            else {
                utils.spin(this.root);
                return this.save_div()
                    .then(function () {
                    //this.props.owner.notify('update-list');
                    return true;
                })
                    .finally(function () { utils.unspin(_this.root); });
            }
        };
        EditDivision.prototype.cancel = function () {
            if (this.props.divid) {
                this.setState(_.extend({}, this.state, {
                    loading: true
                }));
            }
            else {
                this.props.owner['cancel_edit'](this.props.divid);
            }
        };
        EditDivision.prototype.add_div = function () {
            var _this = this;
            var model = Backendless.Persistence.of('compdivs');
            var obj = new CompDiv();
            obj['usrid'] = Backendless.UserService.getCurrentUser()['objectId'];
            obj['compdiv_title'] = this.root.find('#compdiv_title').val();
            obj['compdiv_descr'] = this.root.find('#compdiv_descr').val();
            if (!obj || !obj['compdiv_title']) {
                toastr.error('Title not found');
                return Q.reject(false);
            }
            var d = Q.defer();
            model.save(obj, new Backendless.Async(function (res) {
                toastr.success('Data saved successfully');
                _this.props.owner.notify('update-list', res['objectId']);
                d.resolve(true);
            }, function (err) {
                toastr.error(err['message']);
                d.reject(false);
            }));
            return d.promise;
        };
        EditDivision.prototype.save_div = function () {
            var _this = this;
            var obj = ko['mapping'].toJS(this.item);
            if (!obj || !obj['compdiv_title']) {
                toastr.error('Title not found');
                return Q.reject(false);
            }
            var model = Backendless.Persistence.of('compdivs');
            var d = Q.defer();
            model.save(obj, new Backendless.Async(function (res) {
                toastr.success('Data saved successfully');
                _this.props.owner.notify('update-list', res['objectId']);
                d.resolve(true);
            }, function (err) {
                toastr.error(err['message']);
                d.reject(false);
            }));
            return d.promise;
        };
        return EditDivision;
    }(core.base.BaseView));
    exports.EditDivision = EditDivision;
    var CompDiv = (function () {
        function CompDiv() {
        }
        return CompDiv;
    }());
    var actions;
    (function (actions) {
        actions[actions["NONE"] = 0] = "NONE";
        actions[actions["ADD_NEW_DEPARTMENT"] = 1] = "ADD_NEW_DEPARTMENT";
        actions[actions["EDIT_DEPARTMENT"] = 2] = "EDIT_DEPARTMENT";
        actions[actions["RELOAD_DATA"] = 3] = "RELOAD_DATA";
    })(actions || (actions = {}));
    var DepartmentsList = (function (_super) {
        __extends(DepartmentsList, _super);
        function DepartmentsList(props) {
            _super.call(this, props);
            this.state.loading = true;
        }
        Object.defineProperty(DepartmentsList.prototype, "divid", {
            get: function () {
                return _.result(this.props.div_obj, 'objectId');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DepartmentsList.prototype, "deptview", {
            get: function () {
                return this.refs['deptview'];
            },
            enumerable: true,
            configurable: true
        });
        DepartmentsList.prototype.componentDidMount = function () {
            _super.prototype.componentDidMount.call(this);
            this.forceUpdate();
        };
        DepartmentsList.prototype.componentDidUpdate = function () {
            var _this = this;
            _super.prototype.componentDidUpdate.call(this);
            if (this.state.loading) {
                this.load_data().then(function () {
                    _this.setState(_.extend({}, _this.state, {
                        loading: false
                    }));
                });
            }
        };
        DepartmentsList.prototype.render = function () {
            var btn_add_classes = 'btn-primary';
            if (this.state.action === actions.ADD_NEW_DEPARTMENT || this.state.action === actions.EDIT_DEPARTMENT) {
                btn_add_classes = 'btn-default';
            }
            var btn_save_classes = 'btn-default btn-outline';
            if (this.state.action === actions.ADD_NEW_DEPARTMENT || this.state.action === actions.EDIT_DEPARTMENT) {
                btn_save_classes = 'btn-success btn-outline';
            }
            var btn_cancel_classes = 'btn-default btn-outline';
            if (this.state.action === actions.ADD_NEW_DEPARTMENT || this.state.action === actions.EDIT_DEPARTMENT) {
                btn_cancel_classes = 'btn-warning btn-outline';
            }
            var data = this.depts ? this.depts : [];
            var html = React.createElement("div", {className: "department"}, React.createElement("div", {className: "row", style: { paddingLeft: 20, paddingRight: 20 }}, React.createElement("h2", {style: { display: 'inline-block' }}, "Departments"), React.createElement("a", {href: "#", className: "btn {0} pull-right".format(btn_cancel_classes), onClick: this.return_from_edit.bind(this), style: { marginLeft: 10 }}, React.createElement("i", {className: "fa fa-reply"}), " return"), React.createElement("a", {href: "#", className: "btn {0} pull-right".format(btn_save_classes), onClick: this.save.bind(this), style: { marginLeft: 10 }}, React.createElement("i", {className: "fa fa-check"}), " save"), React.createElement("a", {href: "#", className: "btn {0} pull-right".format(btn_add_classes), onClick: this.add_new_dep.bind(this), style: { marginLeft: 10 }}, React.createElement("i", {className: "fa fa-plus"}), " new department")), React.createElement("hr", null), this.resolve_content(data));
            return html;
        };
        DepartmentsList.prototype.resolve_content = function (data) {
            switch (this.state.action) {
                case actions.ADD_NEW_DEPARTMENT: {
                    return React.createElement(EditDepartment, {ref: "deptview", dept_id: null, div_id: _.result(this.props.div_obj, 'objectId'), owner: this});
                }
                case actions.EDIT_DEPARTMENT: {
                    return React.createElement(EditDepartment, {ref: "deptview", dept_id: this.state.edit_deptid, div_id: _.result(this.props.div_obj, 'objectId'), owner: this});
                }
                case actions.RELOAD_DATA:
                default:
                    return this.fill_with_data(data);
            }
        };
        DepartmentsList.prototype.add_new_dep = function (e) {
            e.preventDefault();
            this.setState(_.extend({}, this.state, {
                action: actions.ADD_NEW_DEPARTMENT
            }));
        };
        DepartmentsList.prototype.return_from_edit = function (e) {
            var _this = this;
            e.preventDefault();
            utils.spin(this.root);
            this.load_data().then(function () {
                _this.setState(_.extend({}, _this.state, {
                    loading: true,
                    action: actions.RELOAD_DATA
                }));
            }).finally(function () {
                utils.unspin(_this.root);
            });
        };
        DepartmentsList.prototype.edit_department = function (e) {
            var deptid = $(e.currentTarget).closest('[data-rowid]').attr('data-rowid');
            this.setState(_.extend({}, this.state, {
                action: actions.EDIT_DEPARTMENT,
                edit_deptid: deptid
            }));
        };
        DepartmentsList.prototype.fill_with_data = function (data) {
            var _this = this;
            if (data.length === 0) {
                return;
            }
            var count = 1;
            var table = React.createElement("table", {className: "table table-hover"}, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "#"), React.createElement("th", null, "Department"), React.createElement("th", null, "Description"), React.createElement("th", null))), React.createElement("tbody", null, _.map(this.depts, function (dep) {
                var tr = React.createElement("tr", {key: _.result(dep, 'objectId'), "data-rowid": "{0}".format(_.result(dep, 'objectId'))}, React.createElement("td", null, count++), React.createElement("td", null, _.result(dep, 'compdept_title')), React.createElement("td", null, _.result(dep, 'compdept_descr')), React.createElement("td", null, React.createElement("button", {onClick: _this.edit_department.bind(_this), className: "btn btn-info btn-outline btn-sm"}, "edit")));
                return tr;
            })));
            return table;
        };
        DepartmentsList.prototype.load_data = function () {
            var _this = this;
            if (!this.divid) {
                return Q.reject(false);
            }
            var model = Backendless.Persistence.of('compdept');
            var qry = new Backendless.DataQuery();
            qry.condition = "compdivs_id = '{0}'".format(this.divid);
            var that = this;
            var d = Q.defer();
            var that = this;
            model.find(qry, new Backendless.Async(function (res) {
                _this.depts = res.data;
                d.resolve(true);
            }));
            return d.promise;
        };
        DepartmentsList.prototype.save = function () {
            if (this.deptview) {
                this.deptview.save();
            }
        };
        return DepartmentsList;
    }(core.base.BaseView));
    exports.DepartmentsList = DepartmentsList;
    var EditDepartment = (function (_super) {
        __extends(EditDepartment, _super);
        function EditDepartment(props) {
            _super.call(this, props);
            this.state.loading = true;
        }
        Object.defineProperty(EditDepartment.prototype, "isNew", {
            get: function () {
                return !this.props.dept_id;
            },
            enumerable: true,
            configurable: true
        });
        EditDepartment.prototype.render = function () {
            var icon = React.createElement("i", {className: "fa fa-edit", style: { marginRight: 10 }});
            var title = "Edit department";
            if (!this.props.dept_id) {
                icon = React.createElement("i", {className: "fa fa-plus-circle", style: { marginRight: 10 }});
                title = "Add new department";
            }
            var html = React.createElement("div", {className: "row animated fadeInUp", style: { paddingLeft: 20, paddingRight: 20, marginTop: 30 }}, React.createElement("h2", null, icon, title), React.createElement("br", null), React.createElement(b.FormGroup, {controlId: "formControlsText"}, React.createElement("h3", null, "Title"), React.createElement(b.FormControl, {type: "text", className: "edit-mode", "data-bind": "textInput:compdept_title", placeholder: "Enter a title"})), React.createElement("br", null), React.createElement(b.FormGroup, {controlId: "formControlsText"}, React.createElement("h3", null, "Description"), React.createElement("textarea", {rows: 3, id: "compdept_descr", "data-bind": "textInput:compdept_descr", className: "custom-scroll form-control edit-mode"})));
            return html;
        };
        EditDepartment.prototype.componentDidMount = function () {
            _super.prototype.componentDidMount.call(this);
            this.forceUpdate();
        };
        EditDepartment.prototype.componentDidUpdate = function () {
            var _this = this;
            if (this.state.loading) {
                utils.spin(this.root);
                this.load_data().then(function () {
                    _this.setState(_.extend({}, _this.state, {
                        loading: false
                    }));
                }).finally(function () {
                    utils.unspin(_this.root);
                });
            }
            else {
                ko.cleanNode(this.root[0]);
                ko.applyBindings(this.item, this.root[0]);
            }
        };
        EditDepartment.prototype.load_data = function () {
            var _this = this;
            var model = Backendless.Persistence.of('compdivs');
            var qry = new Backendless.DataQuery();
            qry.condition = "objectId = '{0}'".format(this.props.div_id);
            qry.options = { relations: ["depts"] };
            var that = this;
            var d = Q.defer();
            var that = this;
            model.find(qry, new Backendless.Async(function (res) {
                _this.div_obj = res.data[0];
                if (!that.isNew) {
                    var dept = _.find(res.data[0].depts, function (dep) {
                        return dep['objectId'] === _this.props.dept_id;
                    });
                    that.item = ko['mapping'].fromJS(dept);
                }
                else {
                    var obj = _.extend(new CompDept(), {
                        ___class: 'compdept',
                        compdivs_id: _this.div_obj['objectId'],
                        compdept_title: '',
                        compdept_descr: ''
                    });
                    _this.item = ko['mapping'].fromJS(obj);
                }
                d.resolve(that.item);
            }));
            return d.promise;
        };
        EditDepartment.prototype.save = function () {
            var _this = this;
            utils.spin(this.root);
            if (!this.props.dept_id) {
                this.add_new_div().then(function () {
                }).finally(function () {
                    utils.unspin(_this.root);
                });
            }
            else {
                this.save_div().then(function () {
                }).finally(function () {
                    utils.unspin(_this.root);
                });
            }
        };
        EditDepartment.prototype.save_div = function () {
            var _this = this;
            var obj = ko['mapping'].toJS(this.item);
            utils.spin(this.root);
            var model = Backendless.Persistence.of('compdept');
            var d = Q.defer();
            model.save(obj, new Backendless.Async(function (res) {
                toastr.success('Data saved successfully');
                _this.props.owner.notify('update_list');
                d.resolve(true);
            }, function (err) {
                toastr.error(err['message']);
                d.reject(false);
            }));
            return d.promise;
        };
        EditDepartment.prototype.add_new_div = function () {
            var model = Backendless.Persistence.of('compdivs');
            var obj = ko['mapping'].toJS(this.item);
            obj['compdept_title'] = this.root.find('[data-bind="textInput:compdept_title"]').val();
            obj['compdept_descr'] = this.root.find('[data-bind="textInput:compdept_descr"]').val();
            this.div_obj['depts'].push(obj);
            var d = Q.defer();
            model.save(this.div_obj, new Backendless.Async(function (res) {
                toastr.success('Data saved successfully');
                d.resolve(true);
            }, function (err) {
                toastr.error(err['message']);
                d.reject(false);
            }));
            return d.promise;
        };
        return EditDepartment;
    }(core.base.BaseView));
    var CompDept = (function () {
        function CompDept() {
        }
        return CompDept;
    }());
});
//# sourceMappingURL=C:/afriknet/zando.admin/zando.admin/Reactive.v1/js/views/company/edit_division.js.map