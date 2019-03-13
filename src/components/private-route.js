import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Route } from 'react-router-dom'
import { connect } from 'react-redux';
import axios from 'axios';
import { URL } from '../constants/url';
import { generateKeyPair } from 'crypto';

const mapDispatchToProps = (dispatch) => {
    return {
    }
}

const mapStateToProps = (state) => {
    return {
        // profile: state.profileReducer.info
    }
}

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
            if(data.status === 200){
                this.setState({
                    block: false
                })
            }
        } catch (error) {
            this.props.history.push('/login')
        }
    }

    // componentDidUpdate(prevProps) {
    //     if (this.props.location.pathname !== prevProps.location.pathname) {
    //         this.checkProfile()
    //     }
    // }

    render() {
        if (this.state.block) {
            return null
        }
        return (
            <Route {...this.props} />
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PrivateRoute));
