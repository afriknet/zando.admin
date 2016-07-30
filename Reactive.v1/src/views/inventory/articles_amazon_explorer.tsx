// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import React = require('react');
import ReactDOM = require('react-dom');
import core = require('../../lib/core');
import pn = require('../../ctrls/panels');

import rb = require('react-bootstrap');
var b: any = rb;


export interface AmazonArticlesExplorerProps extends core.base.BaseProps {
    params?: any
}


export class AmazonArticlesExplorer extends core.base.BaseView {

    props:AmazonArticlesExplorerProps;
    

    render() {

        var html =
            <b.Row className="animated fadeInRight">

                <b.Col md={5} sm={6} xs={12}>

                    <pn.BasePanel style={{ minHeight: 350 }}>
                                                
                        <h2>Articles <button className="btn btn-primary pull-right btn-new-cat" onClick={this.add_new_article.bind(this)}>
                            <i className="fa fa-plus-circle"></i> Ajouter 
                            </button>
                        </h2>

                        <hr />
                        
                    </pn.BasePanel>

                </b.Col>

                <b.Col md={7} xs={12} className="active-content">

                    

                </b.Col>

            </b.Row>

        return html;

    }


    componentDidMount() {

        super.componentDidMount();

        this.update_url_path();
     
        this.exit_login();
        
           
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


    highlight_active_menu() {

        $('.sidebar-collapse li').removeClass('active');
        $('.sidebar-collapse li a').removeClass('active');

        var menu = this.props.params;

        if (!menu || menu === '/') {
            menu = '/inventaire/amazon'
        }

        $('.nav-second-level [href="{0}"]'.format(menu)).closest('li').addClass('active');
        $('.nav-second-level [href="{0}"]'.format(menu)).parents('li').last().addClass('active');
    }


    add_new_article(){

        ReactDOM.unmountComponentAtNode(this.root.find('.active-content')[0]);

        ReactDOM.render(<AmazonArticleWizard title={<span><i className="fa fa-plus-circle"></i> Ajouter un article</span>} />, this.root.find('.active-content')[0]);
    }
}



interface AmazonArticleWizardProps extends core.base.BaseProps {
    title: any
}
class AmazonArticleWizard extends core.base.BaseView{

    props: AmazonArticleWizardProps;

    render() {

        var html =

            <pn.BasePanel className="animated fadeInRight" style={{ minHeight: 350 }}>

                <h2>{this.props.title}</h2>

                <hr />

            </pn.BasePanel>


        return html;

    }

}