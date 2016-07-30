/// <reference path="../../../typings/toastr/toastr.d.ts" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX


import React = require('react');
import ReactDOM = require('react-dom');
import core = require('../../lib/core');
import pn = require('../../ctrls/panels');

import rb = require('react-bootstrap');
var b: any = rb;



interface EditDivisionState extends core.base.BaseState {
    flow: string
}

export interface EditDivisionProps extends core.base.BaseProps {
    divid: string
}

export class EditDivision extends core.base.BaseView {

    props: EditDivisionProps;
    state: EditDivisionState;
    item: any;

    constructor(props: EditDivisionProps) {
        super(props);
        this.state.loading = true;
    }

    
    render() {

        var icon = <i className="fa fa-edit" style={{ marginRight:10 }}></i>
        var title = "Edit division";

        if (!this.props.divid) {
            icon = <i className="fa fa-plus-circle" style={{ marginRight: 10 }}></i>
            title = "Add new division";
        }
        
        var html =
            <pn.BasePanel className="animated fadeInRight" >

                <div className="row" style={{ paddingLeft: 20, paddingRight: 20 }}>

                    <h2 style={{ display: 'inline-block' }}>
                        {icon }
                        {title}
                    </h2>

                    <a href="#" className="btn btn-warning pull-right" onClick={this.cancel.bind(this) } style={{ marginLeft: 10 }}><i className="fa fa-times"></i> cancel</a>
                    <a href="#" className="btn btn-success pull-right btn-save btn-save" onClick={this.save.bind(this)}><i className="fa fa-check"></i> save</a>
                </div>
                
                <br />

                <div className="row" style={{ paddingLeft: 20, paddingRight: 20 }}>

                    <form role="form">
                        <div className="form-group"><label>Title</label> <input type="text" data-bind="textInput:compdiv_title" id="compdiv_title" className="form-control" placeholder="Enter a title" /></div>
                        <div className="form-group"><label>Description</label> <textarea  data-bind="textInput:compdiv_descr"  id="compdiv_descr" rows={4} className="form-control" placeholder="Enter a division" /></div>
                    </form>

                </div>

                <hr />

                <div className="depst">
                    {this.display_deps()}
                </div>



            </pn.BasePanel>



        return html;

    }


    display_deps() {

        if (this.state.loading) {
            return
        }

        var depts = !this.item ? [] : this.item.depts();

        return <DepartmentsList div_obj={this.item} />
    }


    componentDidMount() {

        super.componentDidMount();
        
        this.forceUpdate();
        
    }


    componentDidUpdate() {

        if (this.state.loading) {

            if (this.props.divid) {

                utils.spin(this.root);

                this.load_data().then(() => {

                    this.setState(_.extend({}, this.state, {
                        loading: false
                    }));

                    ko.cleanNode(this.root[0]);

                    ko.applyBindings(this.item, this.root[0]);


                }).finally(() => {

                    utils.unspin(this.root);

                });
            }
        }

        
    }



    load_data() {

        var model = Backendless.Persistence.of('compdivs');

        var qry = new Backendless.DataQuery();
        

        qry.condition = "objectId = '{0}'".format(this.props.divid);
        qry.options = { relations: ["depts"] };

        var d = Q.defer();
        
        var that = this;

        model.find(qry, new Backendless.Async((res: any) => {

            that.item = ko['mapping'].fromJS(res.data[0]);
            
            d.resolve(true);

        }, err => {
            
            d.reject(false);

        }));

        return d.promise;

    }


    save() {

        if (!this.props.divid) {

            utils.spin(this.root);

            return this.add_div()
                .then(() => {
                    //this.props.owner.notify('update-list');
                    return true;
                })
                .finally(() => { utils.unspin(this.root); });

        } else {

            utils.spin(this.root);

            return this.save_div()
                .then(() => {
                    //this.props.owner.notify('update-list');
                    return true;
                })
                .finally(() => { utils.unspin(this.root); });
        }
    }


    cancel() {

        if (this.props.divid) {

            this.setState(_.extend({}, this.state, {
                loading: true
            }));

        } else {

            this.props.owner['cancel_edit'](this.props.divid);
        }

        
    }


    add_div() {

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
        
        model.save(obj, new Backendless.Async(res => {

            toastr.success('Data saved successfully');

            this.props.owner.notify('update-list', res['objectId']);

            d.resolve(true);

        }, err => {

            toastr.error(err['message']);

            d.reject(false);

        }));

        return d.promise;
        
    }
    

    save_div() {

        var obj = ko['mapping'].toJS(this.item);

        if (!obj || !obj['compdiv_title']) {
            toastr.error('Title not found');
            return Q.reject(false);
        }
        
        var model = Backendless.Persistence.of('compdivs');

        var d = Q.defer();

        model.save(obj, new Backendless.Async(res => {

            toastr.success('Data saved successfully');
            
            this.props.owner.notify('update-list', res['objectId']);

            d.resolve(true);

        }, err => {
            
            toastr.error(err['message']);

            d.reject(false);
        }));

        return d.promise;
    }

}


class CompDiv {
    usrid: string
    compdiv_title: string
}




interface DepartmentsListState extends core.base.BaseState {
    action: actions,
    edit_deptid?: string
}

export interface DepartmentsListProps extends core.base.BaseProps{
    div_obj:any,
    //depts:any[]
}

enum actions { NONE, ADD_NEW_DEPARTMENT, EDIT_DEPARTMENT, RELOAD_DATA }

export class DepartmentsList extends core.base.BaseView {

    props: DepartmentsListProps;
    state: DepartmentsListState;
    depts: any[];
    get divid(): string {
        return _.result(this.props.div_obj,'objectId')
    }

    get deptview(): EditDepartment {
        return this.refs['deptview'] as EditDepartment;
    }

    constructor(props: DepartmentsListProps) {
        super(props);
        this.state.loading = true;
    }

    componentDidMount() {

        super.componentDidMount();

        this.forceUpdate();
    }
    

    componentDidUpdate() {

        super.componentDidUpdate();

        if (this.state.loading) {

            this.load_data().then(() => {

                this.setState(_.extend({}, this.state, {
                    loading: false
                }));
            })
        }
    }


    render() {
        
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

        var html = 
            <div className="department">

                    <div className="row" style={{ paddingLeft: 20, paddingRight: 20 }}>

                        <h2 style={{ display: 'inline-block' }}>Departments</h2>

                        <a href="#" className={"btn {0} pull-right".format(btn_cancel_classes) } onClick={this.return_from_edit.bind(this) } style={{ marginLeft: 10 }}><i className="fa fa-reply"></i> return</a>
                        <a href="#" className={"btn {0} pull-right".format(btn_save_classes) } onClick={this.save.bind(this) } style={{ marginLeft: 10 }}><i className="fa fa-check"></i> save</a>
                        <a href="#" className={"btn {0} pull-right".format(btn_add_classes) } onClick={this.add_new_dep.bind(this) } style={{ marginLeft: 10 }}><i className="fa fa-plus"></i> new department</a>

                        </div>

                    <hr />

                    {this.resolve_content(data) }

                </div>

        return html;
    }


    resolve_content(data:any[]) {

        switch (this.state.action) {

            case actions.ADD_NEW_DEPARTMENT: {

                return <EditDepartment ref="deptview" dept_id={null} div_id={_.result(this.props.div_obj, 'objectId') } owner={this}/>

            } 

            case actions.EDIT_DEPARTMENT: {
                
                return <EditDepartment  ref="deptview" dept_id={this.state.edit_deptid}  div_id={_.result(this.props.div_obj, 'objectId')}  owner={this}/>
            }

            case actions.RELOAD_DATA:
            default:
                return this.fill_with_data(data);
        }

    }


    add_new_dep(e: Event) {

        e.preventDefault();

        this.setState(_.extend({}, this.state, {
            action: actions.ADD_NEW_DEPARTMENT
        }));

    }


    return_from_edit(e: Event) {

        e.preventDefault();

        utils.spin(this.root);

        this.load_data().then(() => {

            this.setState(_.extend({}, this.state, {
                loading: true,
                action: actions.RELOAD_DATA
            }));
        }).finally(() => {

            utils.unspin(this.root);
        });

        
    }


    edit_department(e: Event) {

        var deptid = $(e.currentTarget).closest('[data-rowid]').attr('data-rowid');

        this.setState(_.extend({}, this.state, {
            action: actions.EDIT_DEPARTMENT,
            edit_deptid: deptid
        }));

    }


    fill_with_data(data: any[]) {

        if (data.length === 0) {
            return
        }
        
        var count = 1;

        
        var table = 
            <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Department</th>
                            <th>Description</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
          
                        {
                    _.map(this.depts, dep => {
                        
                            var tr =
                                <tr key={ _.result(dep, 'objectId') } data-rowid={"{0}".format(_.result(dep, 'objectId')) }>

                                        <td>{count++}</td>

                                        <td>{_.result(dep, 'compdept_title')}</td>

                                        <td>{_.result(dep, 'compdept_descr')}</td>

                                        <td>
                                            <button onClick={this.edit_department.bind(this)} className="btn btn-info btn-outline btn-sm">edit</button>
                                        </td>

                                    </tr>
                        
                                return tr;
                            })
                        }
                                      
                    </tbody>
            </table>
        
        return table;
    }
    

    load_data() {

        if (!this.divid) {
            return Q.reject(false);
        }
       
        var model = Backendless.Persistence.of('compdept');

        var qry = new Backendless.DataQuery();

        qry.condition = "compdivs_id = '{0}'".format(this.divid);
        

        var that = this;

        var d = Q.defer();

        var that = this;

        model.find(qry, new Backendless.Async((res: any) => {

            this.depts = res.data;
                        
            d.resolve(true);

        }));

        return d.promise;

    }


    save() {

        if (this.deptview) {
            this.deptview.save();
        }
    }
}



interface EditDepartmentProps extends core.base.BaseProps {
    dept_id: any,
    div_id:any
}
interface EditDepartmentState extends core.base.BaseState {
}
class EditDepartment extends core.base.BaseView {
    
    props: EditDepartmentProps;
    state: EditDepartmentState;
    item: any;
    div_obj: any;

    get isNew(): boolean {
        return !this.props.dept_id
    }

    constructor(props: EditDepartmentProps) {
        super(props);
        this.state.loading = true;
    }

    render() {

        var icon = <i className="fa fa-edit" style={{ marginRight: 10 }}></i>
        var title = "Edit department";

        if (!this.props.dept_id) {
            icon = <i className="fa fa-plus-circle" style={{ marginRight: 10 }}></i>
            title = "Add new department";
        }

        var html =
            <div className="row animated fadeInUp" style={{ paddingLeft: 20, paddingRight: 20, marginTop:30 }}>

                <h2>{icon}{title}</h2>

                <br />

                <b.FormGroup controlId="formControlsText">
                            <h3>Title</h3>
                            <b.FormControl type="text" className="edit-mode"
                                data-bind="textInput:compdept_title" placeholder="Enter a title" />                            
                            </b.FormGroup>

                     <br />

                     <b.FormGroup controlId="formControlsText">
                            <h3>Description</h3>
                            <textarea rows={3} id="compdept_descr"
                                data-bind="textInput:compdept_descr" className="custom-scroll form-control edit-mode" />                            
                     </b.FormGroup>
            </div>

        return html;
    }


    componentDidMount() {

        super.componentDidMount();

        this.forceUpdate();
    }


    componentDidUpdate() {

        if (this.state.loading) {
            
            utils.spin(this.root);

            this.load_data().then(() => {

                this.setState(_.extend({}, this.state, {
                    loading: false
                }));
            }).finally(() => {

                utils.unspin(this.root);
            });
            
        } else {

            ko.cleanNode(this.root[0]);

            ko.applyBindings(this.item, this.root[0]);
            
        }

    }



    load_data() {
        
        var model = Backendless.Persistence.of('compdivs');

        var qry = new Backendless.DataQuery();

        qry.condition = "objectId = '{0}'".format(this.props.div_id);

        qry.options = { relations: ["depts"] };

        var that = this;

        var d = Q.defer();

        var that = this;

        model.find(qry, new Backendless.Async((res: any) => {

            this.div_obj = res.data[0];

            if (!that.isNew) {

                var dept = _.find(res.data[0].depts, dep => {
                    return dep['objectId'] === this.props.dept_id;
                });

                that.item = ko['mapping'].fromJS(dept);

            } else {

                var obj = _.extend(new CompDept(), {
                    ___class: 'compdept',
                    compdivs_id: this.div_obj['objectId'],
                    compdept_title: '',
                    compdept_descr: ''
                });

                this.item = ko['mapping'].fromJS(obj);

            }
            
            d.resolve(that.item);

        }));

        return d.promise;

    }



    save() {

        utils.spin(this.root);
        
        if (!this.props.dept_id) {

            this.add_new_div().then(() => {

            }).finally(() => {
                utils.unspin(this.root);
            });

        } else {

            this.save_div().then(() => {

            }).finally(() => {
                utils.unspin(this.root);
            });
        }
    }


    save_div() {

        var obj = ko['mapping'].toJS(this.item);

        utils.spin(this.root);

        var model = Backendless.Persistence.of('compdept');

        var d = Q.defer();

        model.save(obj, new Backendless.Async(res => {
            
            toastr.success('Data saved successfully');
            
            this.props.owner.notify('update_list');

            d.resolve(true);

        }, err => {
            
            toastr.error(err['message']);

            d.reject(false);

        }));

        return d.promise;
    }


    add_new_div() {

        var model = Backendless.Persistence.of('compdivs');

        var obj = ko['mapping'].toJS(this.item);
        
        obj['compdept_title'] = this.root.find('[data-bind="textInput:compdept_title"]').val();
        obj['compdept_descr'] = this.root.find('[data-bind="textInput:compdept_descr"]').val();

        this.div_obj['depts'].push(obj);
        
        var d = Q.defer();

        model.save(this.div_obj, new Backendless.Async(res => {

            toastr.success('Data saved successfully');
            
            d.resolve(true);

        }, err => {
            
            toastr.error(err['message']);

            d.reject(false);
        }));

        return d.promise;
    }
}


class CompDept {

    compdivs_id: string
    compdept_descr: string
    compdept_title: string
}