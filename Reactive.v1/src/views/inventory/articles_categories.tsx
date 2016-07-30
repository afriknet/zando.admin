// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX


import React = require('react');
import ReactDOM = require('react-dom');
import core = require('../../lib/core');
import pn = require('../../ctrls/panels');

import rb = require('react-bootstrap');
var b: any = rb;



export interface CategoriesProps extends core.base.BaseProps {
    params?: any
}
interface CatehoriesState extends core.base.BaseState {
    right_view: string,
    data: any[],
    select_id: string
}
export class CategoriesExplorer extends core.base.BaseView {

    props: CategoriesProps;
    state: CatehoriesState;

    render() {

        var html =
            <b.Row className="animated fadeInRight">

                <b.Col md={5} xs={12}>

                    <pn.BasePanel style={{ minHeight: 350 }}>
                                                
                        <h2>Categories d'articles <button className="btn btn-primary pull-right btn-new-cat"><i className="fa fa-plus-circle"></i> Ajouter </button></h2>

                        <hr />

                        <CategoryList ref="category-list" owner={this}  />

                    </pn.BasePanel>

                </b.Col>

                <b.Col md={7} xs={12}>

                    {this.resolve_right_view() }

                </b.Col>

            </b.Row>


        return html;
    }


    componentDidMount() {

        super.componentDidMount();

        this.update_url_path();

        this.exit_login();

        this.init_actions();

        this.highlight_active_menu();

    }


    load_data() {

        return schema.get('categories');        
    }



    init_actions() {

        this.root.find('.btn-new-cat').click(() => {

            this.setState(_.extend(this.state, {
                right_view: 'add_new_cat'
            } as CatehoriesState))
        });
    }


    highlight_active_menu() {

        $('.sidebar-collapse li').removeClass('active');
        $('.sidebar-collapse li a').removeClass('active');

        var menu = this.props.params;

        if (!menu || menu === '/') {
            menu = '/profiles/explore'
        }

        $('.nav-second-level [href="{0}"]'.format(menu)).closest('li').addClass('active');
        $('.nav-second-level [href="{0}"]'.format(menu)).parents('li').last().addClass('active');
    }


    resolve_right_view() {

        switch (this.state.right_view) {

            case 'add_new_cat': {

                return <CategoryView owner={this} key={utils.guid()} title={<span><i className="fa fa-plus-circle"></i> Ajouter</span>} />
                
            }

            case 'edit_cat': {

                return <CategoryView owner={this} key={utils.guid()} catid={this.state.select_id} title={<span><i className="fa fa-plus-circle"></i> Editer</span>} />

            }

            default:

                return null;
                
        }

    }
    

    exit_login() {

        $('body').removeClass('gray-bg');

        $('#wrapper').show();

        $('.login-view').hide();

    }


    update_url_path() {

        var route: core.types.RouteInfo = this.app.router.current_route;

        $('.path-title').html(route.title);
        $('.path-url li').not('.path-home').remove();

        _.each(route.path, p => {
            $('.path-url ol').append($('<li>{0}</li>'.format(p)));
        });
    }


    reload_categories() {
        this.refs['category-list']['realod_data']()
    }
}



interface CategoryListProps extends core.base.BaseProps{
    //data: any[],
    //select_id: string
}
interface CategoryListState extends core.base.BaseState{
    data: any[],
    select_id: string
}
class CategoryList extends core.base.BaseView{

    props: CategoryListProps;
    state: CategoryListState;


    constructor(props:CategoryListProps){
        super(props);
        this.state.loading = true;
    }


    render() {

        var _data = _.filter(this.state.data, d => {
            return !d['parent_id']
        });

        var html =

            <div style={{ minHeight:300 }} >

                <ul id= "inprogress" className= "sortable-list connectList agile-list" >

                    {
                        _.map(_data, cat => {

                            var type: string = 'info-element';

                            var id = cat['id'];

                            if (this.state.select_id === id) {
                                type = 'danger-element highlight';
                            }

                            var li =
                                <li key={cat['id']} data-rowid={cat['id']} className={type} style={{ paddingBottom: 20 }}>

                                    <a href='javascript:void(0)' onClick={this.edit_category.bind(this) } style={{ display: 'inline-block' }}>{cat['name']}</a>

                                    <a href='javascript:void(0)' onClick={() => { this.remove_category(id) } }  className="btn btn-default btn-outline btn-sm pull-right" style={{ marginLeft: 10 }}>
                                        <i className="fa fa-times"></i>
                                    </a>

                                    <a href='javascript:void(0)' onClick={this.edit_category.bind(this) } className="btn btn-default btn-outline btn-sm pull-right">
                                        <i className="fa fa-edit"></i>
                                    </a>

                                </li>

                            return li
                        })
                    }

                </ul >

            </div>


        return html;

    }


    componentDidMount() {

        super.componentDidMount();

        this.forceUpdate();        
    }


    componentDidUpdate() {

        if (this.state.loading) {
            this.load_data()
        }
    }


    realod_data() {
        this.setState(_.extend(this.state, {
            loading: true
        }));
    }


    internal_load_data() {

        return schema.call({
            fn: 'get',
            params: ['/categories', { sort: 'datecreated' }]
        }).then((res) => {

            return res.response;

        }).fail(err => {

        });
        
    }


    load_data() {

        utils.spin(this.root);

        this.internal_load_data().then((res: any) => {

            this.setState(_.extend(this.state, {
                data: res['results'],
                loading: false
            }))

        }).finally(() => {
            utils.unspin(this.root);
        });
    }


    edit_category(e: Event) {

        var id = $(e.currentTarget).closest('li').attr('data-rowid');

        this.props.owner.setState(_.extend(this.state, {
            right_view: 'edit_cat',
            select_id: id
        } as CatehoriesState))

    }


    remove_category(id:any) {

        utils.can_delete().then(ok => {

            if (ok) {

                utils.spin(this.root);
                
                schema.call({
                    fn: 'delete',
                    params: ['/categories/{0}'.format(id)]
                }).then(res => {

                    this.setState(_.extend(this.state, {
                        loading: true
                    }));

                }).fail(err => {
                    toastr.error(err);
                }).finally(() => {
                    utils.unspin(this.root);
                });

            }

        })

    }
}




interface CategoryViewProps extends core.base.BaseProps {
    title: any,
    catid?: string
}
interface CategoryViewState extends core.base.BaseState {
    catid: string
}
interface CategoryEntity {
    active: ()=>number,
    id?: () =>string,
    parent_id?: () =>string,
    name: () =>string,
    description: () =>string,
    children?: () =>any[]
}
class CategoryView extends core.base.BaseView {

    props: CategoryViewProps;
    state: CategoryViewState;


    private __cat: CategoryEntity;
    get catobj(): CategoryEntity {

        if (!this.__cat) {

            this.__cat = (ko as any).mapping.fromJS( {
                active: 1,
                children: [],                
                name: '',
                description: '',
            } as any);
        }

        return this.__cat;
    }


    get is_new(): boolean {
        return this.state.catid === undefined;
    }


    constructor(props: CategoryViewProps) {
        super(props);        
        this.state.loading = true;
    }


    render() {

        var hidden = this.state.loading ? 'hidden' : 'none';

        var html = 

            <pn.BasePanel style={{ minHeight: 350 }}>

                <h2>{this.props.title}</h2>

                <hr />

                <div className="row">

                    <div className="col-lg-12 col-md-12">

                        <form role="form" className={"frm-category {0}".format(hidden) }>

                            <div className="form-group">
                                <h2>Categorie</h2>
                                <input type="text" className="form-control" name="cat-name" required data-bind="textInput:name" placeholder="nom de la categorie" />
                            </div>
                            <br/>
                            <div>
                                <button type="button" className="btn btn-primary btn-outline" onClick={this.save_edit.bind(this) } style={{ marginRight: 10 }}><i className="fa fa-check"></i> Sauvergarder</button>
                                <button type="button" className="btn btn-warning btn-outline" onClick={this.cancel_edit.bind(this) }><i className="fa fa-times"></i> Annuler</button>                                
                            </div>

                        </form>
                    </div>

                </div>

                {this.display_subcategories()}
                
            </pn.BasePanel>

        return html;
    }


    after_render() {

        this.state.catid = this.props.catid;

        this.root.addClass("animated fadeInRight").one('animationend webkitAnimationEnd oAnimationEnd', () => {
            this.root.removeClass("animated fadeInRight");
        });

        this.root.find('.frm-category').validate({
            rules: {
                'cat-name': 'required'
            }
        });
        

        if (this.state.loading) {

            this.internal_load().then(() => {

                this.setState(_.extend(this.state, {
                    loading: false
                }));

                this.bind();
            });

        }

    }


    componentDidMount() {

        this.after_render();

    }
    

    componentDidUpdate() {

        this.after_render();
    }


    bind() {

        if (this.state.loading) {
            return;
        }
        
        ko.cleanNode(this.root[0]);

        ko.applyBindings(this.catobj, this.root[0]);
    }


    save_edit() {

        if (this.root.find('.frm-category').valid()) {

            var method = 'put';

            if (this.is_new) {
                method = 'post';
            }

            this.internal_save(method).then(() => {

                this.props.owner['reload_categories']();
            });
            
        }        
    }


    internal_load() {

        var d = Q.defer();

        if (!this.state.catid) {
            return Q.resolve(true);
        }

        var id = this.state.catid;

        utils.spin(this.root);

        schema.call({

            fn: 'get',

            params: ['/categories/{0}'.format(id)]

        }).then(res => {

            this.__cat = (ko as any).mapping.fromJS( res.response as any );

            d.resolve(true);

        }).fail((err) => {


        }).finally(() => {

            utils.unspin(this.root);

        });

        return d.promise;

    }


    internal_save(method: string) {

        var d = Q.defer();

        var obj = (ko as any).mapping.toJS(this.catobj);

        var params = ['/categories', obj];

        if(!this.is_new){
            params = ['/categories/{0}'.format(obj['id']), obj];
        }

        utils.spin(this.root);

        schema.call({
            fn: method,
            params: params
        }).then(res => {

            toastr.success('Les donnees ont ete sauvergardees avec success','Sauvergarde');

            d.resolve(res.response as any);

        }).fail(err => {

            toastr.error(err['message'])

            d.reject(false);

        }).finally(() => {

            utils.unspin(this.root);

        });

        return d.promise;
    }


    cancel_edit() {

        this.setState(_.extend(this.state, {
            loading: true
        }));

    }


    display_subcategories() {

        if(this.state.loading){
            return null;
        }

        if (!this.props.catid) {
            return null;
        }

        var html =
            <div>

                <hr style={{ marginTop: 40 }} />


                <div className="row" style={{ paddingLeft: 20, paddingRight: 20 }}>

                    <div className="col-lg-12  col-md-12">

                        <SousCategories owner={this} parent_catid={this.props.catid} />

                    </div>

                </div>
            </div>

        return html;
    }
}



interface SousCategoriesProps extends core.base.BaseProps {
    parent_catid: string
}
interface SousCategoriesState extends core.base.BaseState {
    data: any[];
}
class SousCategories extends core.base.BaseView {

    state: SousCategoriesState;
    props: SousCategoriesProps;


    constructor(props: SousCategoriesProps) {

        super(props);

        this.state.data = [];

        this.state.loading = true;
    }
    

    render() {

        var count: number = 0;

        var __data = this.state.data;

        var html =
            <div className="row">
                <h2>
                    <span>Sous-categories</span>
                    <button className="btn btn-info pull-right btn-add-cat" onClick={this.add_sub_category.bind(this)}>
                        <span><i className="fa fa-plus-circle"></i> Ajouter</span>
                    </button>
                </h2>

                <br/>

                <form role="form" className="ctrl-new-cat" style={{ marginTop: 30, marginBottom: 30, display: 'none' }}>
                    <p>Ajouter une nouvelle categorie</p>
                    <div className="input-group">
                        <input type="text" className="form-control" name="txt-new-subcat-name" required placeholder="nom de la sous-categorie" /> <span className="input-group-btn">
                            <button className="btn btn-success btn-save" type="button" onClick={this.insert_new_sub_category.bind(this)}>
                                <i className="fa fa-check"></i>
                            </button>
                            <button className="btn btn-warning btn-cancel" type="button" style={{ marginLeft: 5 }} onClick={this.cancel_new_sub_category.bind(this) }>
                                <i className="fa fa-times"></i>
                            </button>
                        </span>
                    </div>
                    <br />
                </form>

                <table className="table table-hover">

                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Sous-categorie</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            _.map(__data, d => {

                                //alert('2. sublist-rendering: {0}'.format(d['name']))

                                return <CategoryRow key={d['id']} owner={this} sub_cat={d} count={++count} />
                            })
                        }
                    </tbody>

                </table>

            </div>


        return html;
    }


    componentDidMount() {

        this.root.find('.ctrl-new-cat').validate({
            rules: {
                'txt-new-subcat-name':'required'
            }
        });

        this.forceUpdate();
    }


    componentDidUpdate() {

        if (this.state.loading) {

            this.load_data().then(data => {

                this.state.data = [];

                this.setState(_.extend(this.state, {
                    data: data,
                    loading: false
                }))
            })
        }

    }


    reload() {

        this.load_data().then(__data => {

            this.state.data = [];

            this.setState(_.extend(this.state, {
                data: __data,
                loading: false
            }))

        });
    }


    load_data() {

        return schema.call({
            fn: 'get',
            params: ['/categories', { 'parent_id': this.props.parent_catid, sort: 'datecreated' }]
        }).then(res => {
                        
            _.each(res.response['results'] as any, (d:any) => {

                //alert('1. load-data: {0}'.format(d['name']))
                

            });

            return res.response['results'];
        });        
    }
    


    add_sub_category(e: Event) {

        this.root.find('.ctrl-new-cat').slideDown();
        this.root.find('.btn-add-cat').removeClass('btn-info').addClass('btn-default');
    }


    cancel_new_sub_category() {

        this.root.find('.ctrl-new-cat').slideUp();
        this.root.find('.btn-add-cat').addClass('btn-info').removeClass('btn-default');

        this.root.find('.ctrl-new-cat input').val('');
    }


    insert_new_sub_category() {

        if (!this.root.find('.ctrl-new-cat').valid()) {
            return;
        }

        var sub_cat = {
            active: 1,
            parent_id: this.props.parent_catid,
            name: this.root.find('[name="txt-new-subcat-name"]').val()
        }

        utils.spin(this.root);

        var that = this;

        this.internal_save('post', ['/categories', sub_cat]).then(() => {

            this.root.find('.ctrl-new-cat').slideUp();
            this.root.find('.btn-add-cat').addClass('btn-info').removeClass('btn-default');

            this.root.find('.ctrl-new-cat input').val('');

            this.load_data().then(data => {
                
                that.state.data = [];

                this.setState(_.extend(this.state, {
                    data: data,
                    loading: false
                }))

            });
            

        }).finally(() => {

            utils.unspin(this.root);

        });

        
    }


    internal_save(method: string, params: any[]) {

        var d = Q.defer();

        utils.spin(this.root);

        schema.call({
            fn: method,
            params: params
        }).then(res => {

            toastr.success('Les donnees ont ete sauvergardees avec success', 'Sauvergarde');

            d.resolve(res.response as any);

        }).fail(err => {

            toastr.error(err['message'])

            d.reject(false);

        }).finally(() => {

            utils.unspin(this.root);

        });

        return d.promise;
    }
    
}



interface CategoryRowProps extends core.base.BaseProps {
    sub_cat: any,
    count:any
}

interface CategoryRowState extends core.base.BaseState {
    sub_cat: any,
}

class CategoryRow extends core.base.BaseView {

    props: CategoryRowProps;
    state: CategoryRowState;


    private __obj: any;
    get obj(): any {
        if (!this.__obj) {
            this.__obj = ko['mapping'].fromJS(this.state.sub_cat);
        }
        return this.__obj;
    }

    constructor(props: CategoryRowProps) {
        super(props);
        this.state.sub_cat = this.props.sub_cat;
    }

    render() {
              
        
        var cells = [];

        cells.push(<td>{this.props.count}</td>);
        
        cells.push(
            <td>

                <form role="form" className="txt-subcatname mode-edit hidden">
                    <div className="form-group">
                        <input type="text" className="form-control" name="subcatname" data-bind="textInput:name" placeholder="nom de la categorie" />
                    </div>
                </form>

                <span className="mode-view" data-bind="text:name"></span>
                
            </td>);

        cells.push(
            <td>
                <span className="pull-right">

                    <button className="btn btn-default btn-sm mode-edit hidden btn-save" onClick={this.save_data.bind(this) } style={{ marginRight: 10 }}>
                        <i className="fa fa-check"></i> sauvergarder
                    </button>

                    <button className="btn btn-default btn-sm btn-edit mode-view" onClick={this.edit_subcat.bind(this) } style={{ marginRight: 10 }}>
                        <i className="fa fa-edit"></i> edit
                    </button>
                    <button className="btn btn-default btn-sm btn-cancel"  onClick={this.reload.bind(this) } ><i className="fa fa-times"></i> <span className="txt-cancel">effacer</span></button>
                </span>
            </td>);

        return <tr>{cells}</tr>
        
    }

    componentDidMount() {

        this.root.find('form').validate({
            rules: {
                'subcatname':'required'
            }
        })

        this.forceUpdate();
        
    }


    componentDidUpdate() {
        
        this.bind();
    }


    bind() {
        
        ko.cleanNode(this.root[0]);

        ko.applyBindings(this.obj, this.root[0]);
    }


    save_data() {

        if (!this.root.find('form').valid()) {
            return;
        }

        this.internal_save().then(() => {

            this.do_exit_subcat(this.root.find('.btn-save'));

            this.forceUpdate();
        });
    }

    reload() {

        if (this.root.find('.txt-cancel').hasClass('editing')) {

            this.do_exit_subcat(this.root.find('.btn-save'));

            this.__obj = ko['mapping'].fromJS(this.state.sub_cat);

            this.forceUpdate();

        } else {

            if ($('.category-row-editing').length > 0) {
                return
            }

            utils.can_delete().then(ok => {

                if (ok) {

                    this.delete_sub_category().then(() => {

                        this.props.owner['reload']();
                    });
                }

            });
        }

        

    }


    internal_save() {
        
        var d = Q.defer();

        utils.spin(this.root);

        schema.call({

            fn: 'put',

            params: ['/categories/{0}'.format(this.obj['id']()), ko['mapping'].toJS(this.obj)]

        }).then(res => {

            var __obj = this.obj;

            this.__obj = null;

            this.state.sub_cat = ko['mapping'].toJS(__obj);

            toastr.success('Les donnees ont ete sauvergardees avec success', 'Sauvergarde');

            d.resolve(res.response as any);

        }).fail(err => {

            toastr.error(err['message'])

            d.reject(false);

        }).finally(() => {

            utils.unspin(this.root);

        });

        return d.promise;
    }


    delete_sub_category() {

        utils.spin(this.root);

        var id = this.state.sub_cat['id'];

        var d = Q.defer();

        schema.call({
            fn: 'delete',
            params: ['/categories/{0}'.format(id)]
        }).then(res => {

            d.resolve(true);

        }).fail(err => {
            toastr.error(err);
        }).finally(() => {
            utils.unspin(this.root);
        });

        return d.promise;
    }


    edit_subcat(e: Event) {

        if ($('.category-row-editing').length > 0) {
            return
        }

        $(e.currentTarget).closest('tr').addClass('category-row-editing');

        $(e.currentTarget).closest('tr').find('.mode-view').addClass('hidden')
        $(e.currentTarget).closest('tr').find('.mode-edit').removeClass('hidden');

        $(e.currentTarget).closest('td').find('.btn-save').removeClass('btn-default').addClass('btn-primary btn-outline');
        $(e.currentTarget).closest('td').find('.btn-cancel').removeClass('btn-default').addClass('btn-warning btn-outline');

        $(e.currentTarget).closest('td').find('.txt-cancel').addClass('editing').html('annuler')
    }


    do_exit_subcat(root: JQuery) {

        $(root).closest('tr').removeClass('category-row-editing');

        $(root).closest('tr').find('.mode-edit').addClass('hidden');
        $(root).closest('tr').find('.mode-view').removeClass('hidden');

        $(root).closest('td').find('.btn-save').removeClass('btn-primary btn-outline').addClass('btn-default');
        $(root).closest('td').find('.btn-cancel').removeClass('btn-warning btn-outline').addClass('btn-default');

        $(root).closest('td').find('.txt-cancel').removeClass('editing').html('effacer')
    }


    exit_edit_subcat(e: Event) {

        this.do_exit_subcat($(e.currentTarget));
    }

}