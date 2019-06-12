import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import { menus, menuManger } from './../../constants/menu';

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            indexActive: '',
            menus: []
        };
    }

    componentDidMount = () => {
        const path = window.location.pathname;
        const { profile } = this.props;
        if (profile.fk_role === 1) {
            this.setState({ menus: menuManger });
        } else {
            this.setState({ menus: menus });
        }
        // let index = _.findIndex(menus, (menu) => {
        //     return menu.path === path;
        // });
        // if (index !== -1) {
        //     this.setState({ indexActive: index });
        // }
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
                        {this.state.menus.map((menu, index) => {
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

const mapStateToProps = (state) => {
    return {
        profile: state.profile
    };
}

export default withRouter(connect(mapStateToProps, null)(Sidebar));

// export default withRouter(Sidebar);