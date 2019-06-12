import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Route } from 'react-router-dom'
import { connect } from 'react-redux';
import * as actions from '../../actions/index';
import axios from 'axios';
import { URL } from '../../constants/url';
import { generateKeyPair } from 'crypto';

class PrivateRoute extends Component {

    constructor(props) {
        super(props)
        this.state = {
            block: true
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
            // console.log('profile: ',data.data.profile)

            if (data.status === 200 && data.data.profile.fk_role === 1) {
                this.props.login(data.data.profile);
                this.setState({ block: false });
            } else {
                localStorage.setItem('token', '');
                this.props.history.push('/login');
            }
        } catch (error) {
            this.props.history.push('/login');
        }
    }

    render() {
        if (this.state.block) {
            return null
        }
        return (
            <Route {...this.props} />
        );
    }
}

const mapStateToProps = (state) => {
    return {
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        login: (profile) => dispatch(actions.login(profile)),
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PrivateRoute));
