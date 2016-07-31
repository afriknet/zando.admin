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

                <b.Row className="wizard-content" style={{ paddingLeft: 20, paddingRight: 20 }}>

                    {this.build_wizard() }

                </b.Row>

            </pn.BasePanel>


        return html;

    }


    componentDidMount() {
        
        this.root.find('#new-art-wiz')['steps']({
            headerTag: "h3",
            bodyTag: "section",
            transitionEffect: "fade",
            autoFocus: true,
            onInit: (event, currentIndex) =>{
                
            }
        });
        
    }


    build_wizard() {

        var html =

            <div id="new-art-wiz">
                <h3>Recherche</h3>
                <section>
                    <AmazonArticlesSearchPage />
                </section>
                <h3>Selection</h3>
                <section>
                    <AmazonArticleWizardPage />
                </section>
                <h3>Sauvegarde</h3>
                <section>
                    <AmazonArticleWizardPage />
                </section>
            </div>
            
        return html;
    }
}


interface AmazonArticleWizardPageProps extends core.base.BaseProps{
}
class AmazonArticleWizardPage extends core.base.BaseView {

    props:AmazonArticleWizardPageProps;

    render() {

        var html =
            <div className="row" style={{ minHeight:300 }}>

                <div className="col-lg-12">

                    <h2>{this.get_title()}</h2>

                    <hr />

                    {this.build_content()}

                </div>

            </div>


        return html;
    }

    get_title() {

        return <span>Wizard page</span>
    }


    build_content() {

        return null;

    }

}


class AmazonArticlesSearchPage extends AmazonArticleWizardPage {

    get_title() {

        return <span>Recherche d'articles</span>
    }

    componentDidMount(){

        super.componentDidMount();

        this.root.find(":checkbox")['labelauty']( { label: false } );
    }


    add_radios(){

        var views = [];

        _.each(Object.keys(AmazonArticlesSearchPage.searchIndex), index => {

            var view =
                <b.Col lg={4}>
                    <table width="100%">
                        <tr>
                            <td style={ { width:'10%' } }><input type="checkbox"/></td>
                            <td>
                                <h3 className="pull-left" style={{ paddingLeft:10 }}>{index}</h3>
                            </td>
                        </tr>
                    </table>
                </b.Col>

            views.push(view);
        });

        
        return views;
        
    }
    

    build_content() {
        
        var html =
            <div className="row">

                <div className="col-lg-12">
                    
                    <h4>Rubriques</h4>

                    <br />

                    <h5>Selectionnez une rubrique</h5>

                    <div className="row">

                        {this.add_radios() }

                    </div>

                    

                </div>

                <div className="col-lg-12">
                    
                </div>

            </div>


        return html;

    }


    static searchIndex = {
        
        "Vêtements et accessoires":"Apparel",
        
        'Bagages':'Luggage',

        'Beauté et Parfum':'Beauty',

        'Bijoux':'Jewelry',

        'Bébés':'Baby',

        'Chaussures et Sacs':'Shoes',

        'High-Tech':'Electronics',

        'Informatique':'PCHardware',

        'Montres':'Watches',

        'Musique ':'Music'
    }

}