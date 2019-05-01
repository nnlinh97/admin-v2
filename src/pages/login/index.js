import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {apiPost, apiGet} from '../../services/api';
import * as actions from '../../actions/index';
import { URL } from '../../constants/url';
import axios from 'axios';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            error: ''
        }
    }

    async componentDidMount() {
        const headers = {
            'Content-Type': 'application/json',
            Authorization: localStorage.token
        }
        try {
            axios.defaults.headers.common['Authorization'] = `${localStorage.token}`;
            let data = await axios.get(`${URL}/admin/me`, null, { headers: headers });
            if (data) {
                this.props.history.push('/')
            }
        } catch (error) {
            console.log(error);
        }
    }

    handleLogin = async (event) => {
        event.preventDefault();
        try {
            let res = await apiPost('/admin/login', this.state);
            localStorage.setItem('token', res.data.token);
            this.props.login(res.data.profile)
            this.props.history.push('/');
        } catch (error) {
            console.log(error)
            this.setState({error: 'Tên đăng nhập hoặc mật khẩu chưa đúng!'})
        }
    }

    handleChange = (event) => {
        let target = event.target;
        let name = target.name;
        let value = target.value;
        this.setState({ [name]: value });
    }
    render() {
        return (
            <div style={{ height: '100vh' }} className="hold-transition login-page">
                <div className="login-box">
                    <div className="login-logo">
                        <b>Admin</b>
                    </div>
                    <div className="login-box-body">
                        <form onSubmit={this.handleLogin}>
                            <div className="form-group has-feedback">
                                <input
                                    onChange={this.handleChange}
                                    name="username"
                                    value={this.state.username}
                                    type="text"
                                    className="form-control"
                                    placeholder="Tên đăng nhập"
                                    required />
                                <span className="glyphicon glyphicon-user form-control-feedback" />
                            </div>
                            <div className="form-group has-feedback">
                                <input
                                    onChange={this.handleChange}
                                    name="password"
                                    value={this.state.password}
                                    type="password"
                                    className="form-control"
                                    placeholder="Mật khẩu"
                                    required />
                                <span className="glyphicon glyphicon-lock form-control-feedback" />
                            </div>
                            <p>{this.state.error}</p>
                            <div className="row">
                                <div className="col-md-4 col-md-offset-4 col-xs-4 col-xs-offset-4">
                                    <button type="submit" className="btn btn-primary btn-block btn-flat">Đăng Nhập</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
    }
}

const mapDispatchToProps = (dispatch, action) => {
    return {
        login: (profile) => dispatch(actions.login(profile))
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));