import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';

class Sidebar extends Component {

    toDashboard = (event) => {
        event.preventDefault();
        this.props.history.push("/");
    }

    redirectToListLocationPage = (event) => {
        event.preventDefault();
        this.props.history.push("/location/list");
    }

    redirectToCreateLocationPage = (event) => {
        event.preventDefault();
        this.props.history.push("/location/create");
    }

    redirectToListTypesPage = (event) => {
        event.preventDefault();
        this.props.history.push("/type/list");
    }

    toTourPage = (event) => {
        event.preventDefault();
        this.props.history.push("/tour/list");
    }

    toTourTurnPage = (event) => {
        event.preventDefault();
        this.props.history.push("/tour-turn/list");
    }

    toRoutePage = (event) => {
        event.preventDefault();
        this.props.history.push("/route/list");
    }

    toTransportPage = (event) => {
        event.preventDefault();
        this.props.history.push("/transport/list");
    }
    
    render() {
        return (
            <aside className="main-sidebar">
                <section className="sidebar">
                    <ul className="sidebar-menu">
                        <li className="header">Version 1.0.0</li>
                        <li>
                            <a onClick={this.toDashboard} href="">
                                <i className="fa fa-dashboard" />&nbsp;
                                <span>DASHBOARD</span>
                            </a>
                        </li>
                        {/* <li className="treeview">
                            <a href="#">
                                <i className="fa fa-pie-chart" />
                                <span>LOCATION</span>
                                <span className="pull-right-container">
                                    <i className="fa fa-angle-left pull-right" />
                                </span>
                            </a>
                            <ul className="treeview-menu">
                                <li className="active">
                                    <a onClick={this.redirectToListLocationPage} href="">
                                        <i className="fa fa-circle-o" /> LIST</a>
                                </li>
                                <li className="active">
                                    <a onClick={this.redirectToCreateLocationPage} href="">
                                        <i className="fa fa-circle-o" /> CREATE</a>
                                </li>
                                <li>
                                    <a href="">
                                        <i className="fa fa-circle-o" /> Flot</a>
                                </li>
                                <li>
                                    <a href="pages/charts/inline.html">
                                        <i className="fa fa-circle-o" /> Inline charts</a>
                                </li>
                            </ul>
                        </li> */}
                        <li>
                            <a onClick={this.redirectToListTypesPage} href="">
                                <i className="fa fa-pie-chart" />&nbsp;
                                <span>TYPE LOCATION</span>
                            </a>
                        </li>
                        <li>
                            <a onClick={this.redirectToListLocationPage} href="">
                                <i className="fa fa-location-arrow" />&nbsp;
                                <span>LOCATION</span>
                            </a>
                        </li>
                        <li>
                            <a onClick={this.toRoutePage} href="">
                                <i className="fa fa-map-pin" />&nbsp;
                                <span>ROUTE</span>
                            </a>
                        </li>
                        <li>
                            <a onClick={this.toTourPage} href="">
                                <i className="fa fa-hourglass" />&nbsp;
                                <span>TOUR</span>
                            </a>
                        </li>
                        <li>
                            <a onClick={this.toTourTurnPage} href="">
                                <i className="fa fa-plane" />&nbsp;
                                <span>TOUR TURN</span>
                            </a>
                        </li>
                        <li>
                            <a onClick={this.toTransportPage} href="">
                                <i className="fa fa-rocket" />&nbsp;
                                <span>TRANSPORT</span>
                            </a>
                        </li>
                        {/* <li>
                            <a onClick={this.toDashboard} href="">
                                <i className="fa fa-user" />
                                <span>Admin</span>
                            </a>
                        </li>
                        <li className="treeview">
                            <a href="#">
                                <i className="fa fa-files-o" />
                                <span>Layout Options</span>
                                <span className="pull-right-container">
                                    <span className="label label-primary pull-right">4</span>
                                </span>
                            </a>
                            <ul className="treeview-menu">
                                <li>
                                    <a href="pages/layout/top-nav.html">
                                        <i className="fa fa-circle-o" /> Top Navigation</a>
                                </li>
                                <li>
                                    <a href="pages/layout/boxed.html">
                                        <i className="fa fa-circle-o" /> Boxed</a>
                                </li>
                                <li>
                                    <a href="pages/layout/fixed.html">
                                        <i className="fa fa-circle-o" /> Fixed</a>
                                </li>
                                <li>
                                    <a href="pages/layout/collapsed-sidebar.html">
                                        <i className="fa fa-circle-o" /> Collapsed Sidebar</a>
                                </li>
                            </ul>
                        </li>
                        
                        
                        <li className="treeview">
                            <a href="#">
                                <i className="fa fa-laptop" />
                                <span>UI Elements</span>
                                <span className="pull-right-container">
                                    <i className="fa fa-angle-left pull-right" />
                                </span>
                            </a>
                            <ul className="treeview-menu">
                                <li>
                                    <a href="pages/UI/general.html">
                                        <i className="fa fa-circle-o" /> General</a>
                                </li>
                                <li>
                                    <a href="pages/UI/icons.html">
                                        <i className="fa fa-circle-o" /> Icons</a>
                                </li>
                                <li>
                                    <a href="pages/UI/buttons.html">
                                        <i className="fa fa-circle-o" /> Buttons</a>
                                </li>
                                <li>
                                    <a href="pages/UI/sliders.html">
                                        <i className="fa fa-circle-o" /> Sliders</a>
                                </li>
                                <li>
                                    <a href="pages/UI/timeline.html">
                                        <i className="fa fa-circle-o" /> Timeline</a>
                                </li>
                                <li>
                                    <a href="pages/UI/modals.html">
                                        <i className="fa fa-circle-o" /> Modals</a>
                                </li>
                            </ul>
                        </li>
                        <li className="treeview">
                            <a href="#">
                                <i className="fa fa-edit" />
                                <span>Forms</span>
                                <span className="pull-right-container">
                                    <i className="fa fa-angle-left pull-right" />
                                </span>
                            </a>
                            <ul className="treeview-menu">
                                <li>
                                    <a href="pages/forms/general.html">
                                        <i className="fa fa-circle-o" /> General Elements</a>
                                </li>
                                <li>
                                    <a href="pages/forms/advanced.html">
                                        <i className="fa fa-circle-o" /> Advanced Elements</a>
                                </li>
                                <li>
                                    <a href="pages/forms/editors.html">
                                        <i className="fa fa-circle-o" /> Editors</a>
                                </li>
                            </ul>
                        </li>
                        <li className="treeview">
                            <a href="#">
                                <i className="fa fa-table" />
                                <span>Tables</span>
                                <span className="pull-right-container">
                                    <i className="fa fa-angle-left pull-right" />
                                </span>
                            </a>
                            <ul className="treeview-menu">
                                <li>
                                    <a href="pages/tables/simple.html">
                                        <i className="fa fa-circle-o" /> Simple tables</a>
                                </li>
                                <li>
                                    <a href="pages/tables/data.html">
                                        <i className="fa fa-circle-o" /> Data tables</a>
                                </li>
                            </ul>
                        </li> */}
                    </ul>
                </section>
            </aside>
        );
    }
}

export default withRouter(Sidebar);