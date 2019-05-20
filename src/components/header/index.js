import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../actions/index';
import './index.css';

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            username: '',
            name: ''
        }
    }

    componentDidMount = () => {
        const { profile } = this.props;
        this.setState({
            id: profile ? profile.id : '',
            name: profile ? profile.name : '',
            username: profile ? profile.username : ''
        });
    }


    handleLogout = (event) => {
        event.preventDefault();
        localStorage.setItem('token', null);
        this.props.login(null);
        this.props.history.push("/login")
    }

    handleChangePassword = (event) => {
        event.preventDefault();
        this.props.history.push('/admin/change-password');
    }

    handleToDashboard = (event) => {
        event.preventDefault();
        this.props.history.push('/');
    }

    render() {
        return (
            <header className="main-header">
                <a href="" className="logo">
                    <span onClick={this.handleToDashboard} className="logo-lg">
                        <b>Admin</b></span>
                </a>
                {/* <div class="dropdown">
                    <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                        <img src="http://tinyurl.com/y6lnpbbx" className="user-image" alt="User Image" />
                        <span className="hidden-xs">{this.state.username}</span>
                    </a>
                    <div class="dropdown-content">
                        <a onClick={this.handleChangePassword} href="#" className="btn btn-default btn-flat">Đổi Mật Khẩu</a>
                        <a onClick={this.handleLogout} href="#" className="btn btn-default btn-flat">Đăng Xuất</a>
                    </div>
                </div> */}
                <nav className="navbar navbar-static-top">
                    <div className="navbar-custom-menu">
                        <ul className="nav navbar-nav">
                            <li className="dropdown user user-menu">
                                <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                                    <img src="http://tinyurl.com/y6lnpbbx" className="user-image" alt="User Image" />
                                    <span className="hidden-xs">{this.state.username}</span>
                                </a>
                                <div class="dropdown-content">
                                    <a onClick={this.handleChangePassword} href="#" className="btn btn-default btn-flat">Đổi Mật Khẩu</a>
                                    <a onClick={this.handleLogout} href="#" className="btn btn-default btn-flat">Đăng Xuất</a>
                                </div>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        profile: state.profile
    };
}

const mapDispatchToProps = (dispatch, action) => {
    return {
        login: (profile) => dispatch(actions.login(profile))
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));