import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Route } from 'react-router-dom'
import { connect } from 'react-redux';
import * as actions from '../../actions/index';
import axios from 'axios';
import { URL } from '../../constants/url';
// import { generateKeyPair } from 'crypto';

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
            let data = await axios.get(`${process.env.REACT_APP_REST_API_LOCATION}/admin/me`, null, { headers: headers });
            // console.log('profile: ',data.data.profile)
            this.props.login(data.data.profile);
            if(data.status === 200){
                this.setState({ block: false })
            }
        } catch (error) {
            this.props.history.push('/login')
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
