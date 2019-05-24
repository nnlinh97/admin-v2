import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import { menus } from './../../constants/menu';

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            indexActive: ''
        };
    }

    componentDidMount = () => {
        const path = window.location.pathname;
        let index = _.findIndex(menus, (menu) => {
            return menu.path === path;
        });
        if (index !== -1) {
            this.setState({ indexActive: index });
        }
    }

    redirectPath = (event, path) => {
        event.preventDefault();
        this.props.history.push(path);
    }

    render() {
        return (
            <aside className="main-sidebar" style={{ position: 'fixed' }} >
                <section className="sidebar">
                    <ul className="sidebar-menu">
                        <li className="header">Version 1.0.0</li>
                        {menus.map((menu, index) => {
                            return (
                                <li key={index} className={index === this.state.indexActive ? 'active' : ''}>
                                    <a onClick={(event) => this.redirectPath(event, menu.path)} href="">
                                        <i className={menu.icon} />&nbsp;
                                        <span>{menu.title}</span>
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </section>
            </aside>
        );
    }
}

export default withRouter(Sidebar);