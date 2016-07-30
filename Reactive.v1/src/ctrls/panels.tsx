/// <reference path="../lib/core.tsx" />

// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX


import React = require('react');
import ReactDOM = require('react-dom');

import core = require('../lib/core');



export interface BasePanelProps extends core.base.BaseProps {
    title?: string,
    toolbox?: boolean,
    onfooter?: (panel: BasePanel, $footer) => {

    },
    style?: any,
    className?: any
}
export class BasePanel extends core.base.BaseView {
    
    props: BasePanelProps;

    constructor(props: BasePanelProps) {
        super(props);
    }

    render() {

        var props = _.extend({}, this.props);

        var toolbox = !this.props.toolbox ? 'hidden' : null;

        var html =
            <div className="ibox" {...props}>

                <div className="ibox-title hidden">

                  <h5 className="title" >{this.props.title}</h5>

                  <div className={"ibox-tools {0}".format(toolbox)}>

                    <a className="collapse-link">
                      <i className="fa fa-chevron-up" />
                    </a>

                    <a className="dropdown-toggle" data-toggle="dropdown" href="#">
                      <i className="fa fa-wrench" />
                    </a>

                   <ul className="dropdown-menu dropdown-user">
                      <li><a href="#">Config option 1</a></li>
                      <li><a href="#">Config option 2</a></li>
                    </ul>

                    <a className="close-link">
                      <i className="fa fa-times" />
                    </a>

                 </div>

            </div>

                <div className="ibox-content col-lg-12">
                {this.props.children}
            </div>

            <div className={"ibox-footer hidden"}>
            </div>

        </div>

        return html;

    }


    componentDidMount() {

        this.init_toolbox();        
    }


    init_toolbox() {

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

            this.jget('.ibox-footer').removeClass('hidden')

            this.props.onfooter(this, this.jget('.ibox-footer'));
        }

    }

}