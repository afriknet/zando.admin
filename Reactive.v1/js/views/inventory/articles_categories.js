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
    var CategoriesExplorer = (function (_super) {
        __extends(CategoriesExplorer, _super);
        function CategoriesExplorer() {
            _super.apply(this, arguments);
        }
        CategoriesExplorer.prototype.render = function () {
            var html = React.createElement(b.Row, {className: "animated fadeInRight"}, React.createElement(b.Col, {md: 5, xs: 12}, React.createElement(pn.BasePanel, {style: { minHeight: 350 }}, React.createElement("h2", null, "Categories d'articles ", React.createElement("button", {className: "btn btn-primary pull-right btn-new-cat"}, React.createElement("i", {className: "fa fa-plus-circle"}), " Ajouter ")), React.createElement("hr", null), React.createElement(CategoryList, {ref: "category-list", owner: this}))), React.createElement(b.Col, {md: 7, xs: 12}, this.resolve_right_view()));
            return html;
        };
        CategoriesExplorer.prototype.componentDidMount = function () {
            _super.prototype.componentDidMount.call(this);
            this.update_url_path();
            this.exit_login();
            this.init_actions();
            this.highlight_active_menu();
        };
        CategoriesExplorer.prototype.load_data = function () {
            return schema.get('categories');
        };
        CategoriesExplorer.prototype.init_actions = function () {
            var _this = this;
            this.root.find('.btn-new-cat').click(function () {
                _this.setState(_.extend(_this.state, {
                    right_view: 'add_new_cat'
                }));
            });
        };
        CategoriesExplorer.prototype.highlight_active_menu = function () {
            $('.sidebar-collapse li').removeClass('active');
            $('.sidebar-collapse li a').removeClass('active');
            var menu = this.props.params;
            if (!menu || menu === '/') {
                menu = '/profiles/explore';
            }
            $('.nav-second-level [href="{0}"]'.format(menu)).closest('li').addClass('active');
            $('.nav-second-level [href="{0}"]'.format(menu)).parents('li').last().addClass('active');
        };
        CategoriesExplorer.prototype.resolve_right_view = function () {
            switch (this.state.right_view) {
                case 'add_new_cat': {
                    return React.createElement(CategoryView, {owner: this, key: utils.guid(), title: React.createElement("span", null, React.createElement("i", {className: "fa fa-plus-circle"}), " Ajouter")});
                }
                case 'edit_cat': {
                    return React.createElement(CategoryView, {owner: this, key: utils.guid(), catid: this.state.select_id, title: React.createElement("span", null, React.createElement("i", {className: "fa fa-plus-circle"}), " Editer")});
                }
                default:
                    return null;
            }
        };
        CategoriesExplorer.prototype.exit_login = function () {
            $('body').removeClass('gray-bg');
            $('#wrapper').show();
            $('.login-view').hide();
        };
        CategoriesExplorer.prototype.update_url_path = function () {
            var route = this.app.router.current_route;
            $('.path-title').html(route.title);
            $('.path-url li').not('.path-home').remove();
            _.each(route.path, function (p) {
                $('.path-url ol').append($('<li>{0}</li>'.format(p)));
            });
        };
        CategoriesExplorer.prototype.reload_categories = function () {
            this.refs['category-list']['realod_data']();
        };
        return CategoriesExplorer;
    }(core.base.BaseView));
    exports.CategoriesExplorer = CategoriesExplorer;
    var CategoryList = (function (_super) {
        __extends(CategoryList, _super);
        function CategoryList(props) {
            _super.call(this, props);
            this.state.loading = true;
        }
        CategoryList.prototype.render = function () {
            var _this = this;
            var _data = _.filter(this.state.data, function (d) {
                return !d['parent_id'];
            });
            var html = React.createElement("div", {style: { minHeight: 300 }}, React.createElement("ul", {id: "inprogress", className: "sortable-list connectList agile-list"}, _.map(_data, function (cat) {
                var type = 'info-element';
                var id = cat['id'];
                if (_this.state.select_id === id) {
                    type = 'danger-element highlight';
                }
                var li = React.createElement("li", {key: cat['id'], "data-rowid": cat['id'], className: type, style: { paddingBottom: 20 }}, React.createElement("a", {href: 'javascript:void(0)', onClick: _this.edit_category.bind(_this), style: { display: 'inline-block' }}, cat['name']), React.createElement("a", {href: 'javascript:void(0)', onClick: function () { _this.remove_category(id); }, className: "btn btn-default btn-outline btn-sm pull-right", style: { marginLeft: 10 }}, React.createElement("i", {className: "fa fa-times"})), React.createElement("a", {href: 'javascript:void(0)', onClick: _this.edit_category.bind(_this), className: "btn btn-default btn-outline btn-sm pull-right"}, React.createElement("i", {className: "fa fa-edit"})));
                return li;
            })));
            return html;
        };
        CategoryList.prototype.componentDidMount = function () {
            _super.prototype.componentDidMount.call(this);
            this.forceUpdate();
        };
        CategoryList.prototype.componentDidUpdate = function () {
            if (this.state.loading) {
                this.load_data();
            }
        };
        CategoryList.prototype.realod_data = function () {
            this.setState(_.extend(this.state, {
                loading: true
            }));
        };
        CategoryList.prototype.internal_load_data = function () {
            return schema.call({
                fn: 'get',
                params: ['/categories', { sort: 'datecreated' }]
            }).then(function (res) {
                return res.response;
            }).fail(function (err) {
            });
        };
        CategoryList.prototype.load_data = function () {
            var _this = this;
            utils.spin(this.root);
            this.internal_load_data().then(function (res) {
                _this.setState(_.extend(_this.state, {
                    data: res['results'],
                    loading: false
                }));
            }).finally(function () {
                utils.unspin(_this.root);
            });
        };
        CategoryList.prototype.edit_category = function (e) {
            var id = $(e.currentTarget).closest('li').attr('data-rowid');
            this.props.owner.setState(_.extend(this.state, {
                right_view: 'edit_cat',
                select_id: id
            }));
        };
        CategoryList.prototype.remove_category = function (id) {
            var _this = this;
            utils.can_delete().then(function (ok) {
                if (ok) {
                    utils.spin(_this.root);
                    schema.call({
                        fn: 'delete',
                        params: ['/categories/{0}'.format(id)]
                    }).then(function (res) {
                        _this.setState(_.extend(_this.state, {
                            loading: true
                        }));
                    }).fail(function (err) {
                        toastr.error(err);
                    }).finally(function () {
                        utils.unspin(_this.root);
                    });
                }
            });
        };
        return CategoryList;
    }(core.base.BaseView));
    var CategoryView = (function (_super) {
        __extends(CategoryView, _super);
        function CategoryView(props) {
            _super.call(this, props);
            this.state.loading = true;
        }
        Object.defineProperty(CategoryView.prototype, "catobj", {
            get: function () {
                if (!this.__cat) {
                    this.__cat = ko.mapping.fromJS({
                        active: 1,
                        children: [],
                        name: '',
                        description: '',
                    });
                }
                return this.__cat;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CategoryView.prototype, "is_new", {
            get: function () {
                return this.state.catid === undefined;
            },
            enumerable: true,
            configurable: true
        });
        CategoryView.prototype.render = function () {
            var hidden = this.state.loading ? 'hidden' : 'none';
            var html = React.createElement(pn.BasePanel, {style: { minHeight: 350 }}, React.createElement("h2", null, this.props.title), React.createElement("hr", null), React.createElement("div", {className: "row"}, React.createElement("div", {className: "col-lg-12 col-md-12"}, React.createElement("form", {role: "form", className: "frm-category {0}".format(hidden)}, React.createElement("div", {className: "form-group"}, React.createElement("h2", null, "Categorie"), React.createElement("input", {type: "text", className: "form-control", name: "cat-name", required: true, "data-bind": "textInput:name", placeholder: "nom de la categorie"})), React.createElement("br", null), React.createElement("div", null, React.createElement("button", {type: "button", className: "btn btn-primary btn-outline", onClick: this.save_edit.bind(this), style: { marginRight: 10 }}, React.createElement("i", {className: "fa fa-check"}), " Sauvergarder"), React.createElement("button", {type: "button", className: "btn btn-warning btn-outline", onClick: this.cancel_edit.bind(this)}, React.createElement("i", {className: "fa fa-times"}), " Annuler"))))), this.display_subcategories());
            return html;
        };
        CategoryView.prototype.after_render = function () {
            var _this = this;
            this.state.catid = this.props.catid;
            this.root.addClass("animated fadeInRight").one('animationend webkitAnimationEnd oAnimationEnd', function () {
                _this.root.removeClass("animated fadeInRight");
            });
            this.root.find('.frm-category').validate({
                rules: {
                    'cat-name': 'required'
                }
            });
            if (this.state.loading) {
                this.internal_load().then(function () {
                    _this.setState(_.extend(_this.state, {
                        loading: false
                    }));
                    _this.bind();
                });
            }
        };
        CategoryView.prototype.componentDidMount = function () {
            this.after_render();
        };
        CategoryView.prototype.componentDidUpdate = function () {
            this.after_render();
        };
        CategoryView.prototype.bind = function () {
            if (this.state.loading) {
                return;
            }
            ko.cleanNode(this.root[0]);
            ko.applyBindings(this.catobj, this.root[0]);
        };
        CategoryView.prototype.save_edit = function () {
            var _this = this;
            if (this.root.find('.frm-category').valid()) {
                var method = 'put';
                if (this.is_new) {
                    method = 'post';
                }
                this.internal_save(method).then(function () {
                    _this.props.owner['reload_categories']();
                });
            }
        };
        CategoryView.prototype.internal_load = function () {
            var _this = this;
            var d = Q.defer();
            if (!this.state.catid) {
                return Q.resolve(true);
            }
            var id = this.state.catid;
            utils.spin(this.root);
            schema.call({
                fn: 'get',
                params: ['/categories/{0}'.format(id)]
            }).then(function (res) {
                _this.__cat = ko.mapping.fromJS(res.response);
                d.resolve(true);
            }).fail(function (err) {
            }).finally(function () {
                utils.unspin(_this.root);
            });
            return d.promise;
        };
        CategoryView.prototype.internal_save = function (method) {
            var _this = this;
            var d = Q.defer();
            var obj = ko.mapping.toJS(this.catobj);
            var params = ['/categories', obj];
            if (!this.is_new) {
                params = ['/categories/{0}'.format(obj['id']), obj];
            }
            utils.spin(this.root);
            schema.call({
                fn: method,
                params: params
            }).then(function (res) {
                toastr.success('Les donnees ont ete sauvergardees avec success', 'Sauvergarde');
                d.resolve(res.response);
            }).fail(function (err) {
                toastr.error(err['message']);
                d.reject(false);
            }).finally(function () {
                utils.unspin(_this.root);
            });
            return d.promise;
        };
        CategoryView.prototype.cancel_edit = function () {
            this.setState(_.extend(this.state, {
                loading: true
            }));
        };
        CategoryView.prototype.display_subcategories = function () {
            if (this.state.loading) {
                return null;
            }
            if (!this.props.catid) {
                return null;
            }
            var html = React.createElement("div", null, React.createElement("hr", {style: { marginTop: 40 }}), React.createElement("div", {className: "row", style: { paddingLeft: 20, paddingRight: 20 }}, React.createElement("div", {className: "col-lg-12  col-md-12"}, React.createElement(SousCategories, {owner: this, parent_catid: this.props.catid}))));
            return html;
        };
        return CategoryView;
    }(core.base.BaseView));
    var SousCategories = (function (_super) {
        __extends(SousCategories, _super);
        function SousCategories(props) {
            _super.call(this, props);
            this.state.data = [];
            this.state.loading = true;
        }
        SousCategories.prototype.render = function () {
            var _this = this;
            var count = 0;
            var __data = this.state.data;
            var html = React.createElement("div", {className: "row"}, React.createElement("h2", null, React.createElement("span", null, "Sous-categories"), React.createElement("button", {className: "btn btn-info pull-right btn-add-cat", onClick: this.add_sub_category.bind(this)}, React.createElement("span", null, React.createElement("i", {className: "fa fa-plus-circle"}), " Ajouter"))), React.createElement("br", null), React.createElement("form", {role: "form", className: "ctrl-new-cat", style: { marginTop: 30, marginBottom: 30, display: 'none' }}, React.createElement("p", null, "Ajouter une nouvelle categorie"), React.createElement("div", {className: "input-group"}, React.createElement("input", {type: "text", className: "form-control", name: "txt-new-subcat-name", required: true, placeholder: "nom de la sous-categorie"}), " ", React.createElement("span", {className: "input-group-btn"}, React.createElement("button", {className: "btn btn-success btn-save", type: "button", onClick: this.insert_new_sub_category.bind(this)}, React.createElement("i", {className: "fa fa-check"})), React.createElement("button", {className: "btn btn-warning btn-cancel", type: "button", style: { marginLeft: 5 }, onClick: this.cancel_new_sub_category.bind(this)}, React.createElement("i", {className: "fa fa-times"})))), React.createElement("br", null)), React.createElement("table", {className: "table table-hover"}, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "#"), React.createElement("th", null, "Sous-categorie"), React.createElement("th", null))), React.createElement("tbody", null, _.map(__data, function (d) {
                //alert('2. sublist-rendering: {0}'.format(d['name']))
                return React.createElement(CategoryRow, {key: d['id'], owner: _this, sub_cat: d, count: ++count});
            }))));
            return html;
        };
        SousCategories.prototype.componentDidMount = function () {
            this.root.find('.ctrl-new-cat').validate({
                rules: {
                    'txt-new-subcat-name': 'required'
                }
            });
            this.forceUpdate();
        };
        SousCategories.prototype.componentDidUpdate = function () {
            var _this = this;
            if (this.state.loading) {
                this.load_data().then(function (data) {
                    _this.state.data = [];
                    _this.setState(_.extend(_this.state, {
                        data: data,
                        loading: false
                    }));
                });
            }
        };
        SousCategories.prototype.reload = function () {
            var _this = this;
            this.load_data().then(function (__data) {
                _this.state.data = [];
                _this.setState(_.extend(_this.state, {
                    data: __data,
                    loading: false
                }));
            });
        };
        SousCategories.prototype.load_data = function () {
            return schema.call({
                fn: 'get',
                params: ['/categories', { 'parent_id': this.props.parent_catid, sort: 'datecreated' }]
            }).then(function (res) {
                _.each(res.response['results'], function (d) {
                    //alert('1. load-data: {0}'.format(d['name']))
                });
                return res.response['results'];
            });
        };
        SousCategories.prototype.add_sub_category = function (e) {
            this.root.find('.ctrl-new-cat').slideDown();
            this.root.find('.btn-add-cat').removeClass('btn-info').addClass('btn-default');
        };
        SousCategories.prototype.cancel_new_sub_category = function () {
            this.root.find('.ctrl-new-cat').slideUp();
            this.root.find('.btn-add-cat').addClass('btn-info').removeClass('btn-default');
            this.root.find('.ctrl-new-cat input').val('');
        };
        SousCategories.prototype.insert_new_sub_category = function () {
            var _this = this;
            if (!this.root.find('.ctrl-new-cat').valid()) {
                return;
            }
            var sub_cat = {
                active: 1,
                parent_id: this.props.parent_catid,
                name: this.root.find('[name="txt-new-subcat-name"]').val()
            };
            utils.spin(this.root);
            var that = this;
            this.internal_save('post', ['/categories', sub_cat]).then(function () {
                _this.root.find('.ctrl-new-cat').slideUp();
                _this.root.find('.btn-add-cat').addClass('btn-info').removeClass('btn-default');
                _this.root.find('.ctrl-new-cat input').val('');
                _this.load_data().then(function (data) {
                    that.state.data = [];
                    _this.setState(_.extend(_this.state, {
                        data: data,
                        loading: false
                    }));
                });
            }).finally(function () {
                utils.unspin(_this.root);
            });
        };
        SousCategories.prototype.internal_save = function (method, params) {
            var _this = this;
            var d = Q.defer();
            utils.spin(this.root);
            schema.call({
                fn: method,
                params: params
            }).then(function (res) {
                toastr.success('Les donnees ont ete sauvergardees avec success', 'Sauvergarde');
                d.resolve(res.response);
            }).fail(function (err) {
                toastr.error(err['message']);
                d.reject(false);
            }).finally(function () {
                utils.unspin(_this.root);
            });
            return d.promise;
        };
        return SousCategories;
    }(core.base.BaseView));
    var CategoryRow = (function (_super) {
        __extends(CategoryRow, _super);
        function CategoryRow(props) {
            _super.call(this, props);
            this.state.sub_cat = this.props.sub_cat;
        }
        Object.defineProperty(CategoryRow.prototype, "obj", {
            get: function () {
                if (!this.__obj) {
                    this.__obj = ko['mapping'].fromJS(this.state.sub_cat);
                }
                return this.__obj;
            },
            enumerable: true,
            configurable: true
        });
        CategoryRow.prototype.render = function () {
            var cells = [];
            cells.push(React.createElement("td", null, this.props.count));
            cells.push(React.createElement("td", null, React.createElement("form", {role: "form", className: "txt-subcatname mode-edit hidden"}, React.createElement("div", {className: "form-group"}, React.createElement("input", {type: "text", className: "form-control", name: "subcatname", "data-bind": "textInput:name", placeholder: "nom de la categorie"}))), React.createElement("span", {className: "mode-view", "data-bind": "text:name"})));
            cells.push(React.createElement("td", null, React.createElement("span", {className: "pull-right"}, React.createElement("button", {className: "btn btn-default btn-sm mode-edit hidden btn-save", onClick: this.save_data.bind(this), style: { marginRight: 10 }}, React.createElement("i", {className: "fa fa-check"}), " sauvergarder"), React.createElement("button", {className: "btn btn-default btn-sm btn-edit mode-view", onClick: this.edit_subcat.bind(this), style: { marginRight: 10 }}, React.createElement("i", {className: "fa fa-edit"}), " edit"), React.createElement("button", {className: "btn btn-default btn-sm btn-cancel", onClick: this.reload.bind(this)}, React.createElement("i", {className: "fa fa-times"}), " ", React.createElement("span", {className: "txt-cancel"}, "effacer")))));
            return React.createElement("tr", null, cells);
        };
        CategoryRow.prototype.componentDidMount = function () {
            this.root.find('form').validate({
                rules: {
                    'subcatname': 'required'
                }
            });
            this.forceUpdate();
        };
        CategoryRow.prototype.componentDidUpdate = function () {
            this.bind();
        };
        CategoryRow.prototype.bind = function () {
            ko.cleanNode(this.root[0]);
            ko.applyBindings(this.obj, this.root[0]);
        };
        CategoryRow.prototype.save_data = function () {
            var _this = this;
            if (!this.root.find('form').valid()) {
                return;
            }
            this.internal_save().then(function () {
                _this.do_exit_subcat(_this.root.find('.btn-save'));
                _this.forceUpdate();
            });
        };
        CategoryRow.prototype.reload = function () {
            var _this = this;
            if (this.root.find('.txt-cancel').hasClass('editing')) {
                this.do_exit_subcat(this.root.find('.btn-save'));
                this.__obj = ko['mapping'].fromJS(this.state.sub_cat);
                this.forceUpdate();
            }
            else {
                if ($('.category-row-editing').length > 0) {
                    return;
                }
                utils.can_delete().then(function (ok) {
                    if (ok) {
                        _this.delete_sub_category().then(function () {
                            _this.props.owner['reload']();
                        });
                    }
                });
            }
        };
        CategoryRow.prototype.internal_save = function () {
            var _this = this;
            var d = Q.defer();
            utils.spin(this.root);
            schema.call({
                fn: 'put',
                params: ['/categories/{0}'.format(this.obj['id']()), ko['mapping'].toJS(this.obj)]
            }).then(function (res) {
                var __obj = _this.obj;
                _this.__obj = null;
                _this.state.sub_cat = ko['mapping'].toJS(__obj);
                toastr.success('Les donnees ont ete sauvergardees avec success', 'Sauvergarde');
                d.resolve(res.response);
            }).fail(function (err) {
                toastr.error(err['message']);
                d.reject(false);
            }).finally(function () {
                utils.unspin(_this.root);
            });
            return d.promise;
        };
        CategoryRow.prototype.delete_sub_category = function () {
            var _this = this;
            utils.spin(this.root);
            var id = this.state.sub_cat['id'];
            var d = Q.defer();
            schema.call({
                fn: 'delete',
                params: ['/categories/{0}'.format(id)]
            }).then(function (res) {
                d.resolve(true);
            }).fail(function (err) {
                toastr.error(err);
            }).finally(function () {
                utils.unspin(_this.root);
            });
            return d.promise;
        };
        CategoryRow.prototype.edit_subcat = function (e) {
            if ($('.category-row-editing').length > 0) {
                return;
            }
            $(e.currentTarget).closest('tr').addClass('category-row-editing');
            $(e.currentTarget).closest('tr').find('.mode-view').addClass('hidden');
            $(e.currentTarget).closest('tr').find('.mode-edit').removeClass('hidden');
            $(e.currentTarget).closest('td').find('.btn-save').removeClass('btn-default').addClass('btn-primary btn-outline');
            $(e.currentTarget).closest('td').find('.btn-cancel').removeClass('btn-default').addClass('btn-warning btn-outline');
            $(e.currentTarget).closest('td').find('.txt-cancel').addClass('editing').html('annuler');
        };
        CategoryRow.prototype.do_exit_subcat = function (root) {
            $(root).closest('tr').removeClass('category-row-editing');
            $(root).closest('tr').find('.mode-edit').addClass('hidden');
            $(root).closest('tr').find('.mode-view').removeClass('hidden');
            $(root).closest('td').find('.btn-save').removeClass('btn-primary btn-outline').addClass('btn-default');
            $(root).closest('td').find('.btn-cancel').removeClass('btn-warning btn-outline').addClass('btn-default');
            $(root).closest('td').find('.txt-cancel').removeClass('editing').html('effacer');
        };
        CategoryRow.prototype.exit_edit_subcat = function (e) {
            this.do_exit_subcat($(e.currentTarget));
        };
        return CategoryRow;
    }(core.base.BaseView));
});
//# sourceMappingURL=C:/afriknet/zando.admin/zando.admin/Reactive.v1/js/views/inventory/articles_categories.js.map