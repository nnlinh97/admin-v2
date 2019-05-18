import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { URL } from '../constants/url';
import axios from 'axios';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
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
            if(data){
                this.props.history.push('/')
            }
        } catch (error) {
            console.log(error);
        }
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        try {
            let res = await axios.post(`${URL}/admin/login`, this.state);
            localStorage.setItem('token', res.data.token);
            this.props.history.push('/');
        } catch (error) {
            // console.log('fail');
        }
        // this.props.history.push('/');
    }

    handleChange = (event) => {
        let target = event.target;
        let name = target.name;
        let value = target.value;
        this.setState({
            [name]: value
        });
    }
    render() {
        return (
            <div style={{ height: '100vh' }} className="hold-transition login-page">
                <div className="login-box">
                    <div className="login-logo">
                        <b>Admin</b>
                    </div>
                    <div className="login-box-body">
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-group has-feedback">
                                <input onChange={this.handleChange} name="username" value={this.state.username} type="text" className="form-control" placeholder="Username" required />
                                <span className="glyphicon glyphicon-user form-control-feedback" />
                            </div>
                            <div className="form-group has-feedback">
                                <input onChange={this.handleChange} name="password" value={this.state.password} type="password" className="form-control" placeholder="Password" required />
                                <span className="glyphicon glyphicon-lock form-control-feedback" />
                            </div>
                            <div className="row">
                                <div className="col-md-4 col-md-offset-4 col-xs-4 col-xs-offset-4">
                                    <button type="submit" className="btn btn-primary btn-block btn-flat">Sign In</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Login);