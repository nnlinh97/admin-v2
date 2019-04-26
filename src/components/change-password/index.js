import 'froala-editor/js/froala_editor.pkgd.min.js';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import * as actions from './../../actions/index';
import _ from 'lodash';
import moment from 'moment';
import DatePicker from "react-datepicker";
import TimePicker from 'react-time-picker';
import 'font-awesome/css/font-awesome.css';
import SweetAlert from 'react-bootstrap-sweetalert';
import axios from 'axios';
import { apiGet, apiPost } from '../../services/api';
import Select from 'react-select';
import './index.css';

class CreateTourTurnComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
            error: false,
            success: false,
            message: ''
        }
    }

    handleChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;
        this.setState({ [name]: value });
    }

    checkNewAndConfirmPassword = () => {
        const { newPassword, confirmPassword } = this.state;
        if (newPassword === confirmPassword && newPassword !== '') {
            return true;
        }
        return false;
    }

    checkWarning = () => {
        const { currentPassword, newPassword } = this.state;
        if (currentPassword === newPassword && currentPassword !== '') {
            return true;
        }
        return false;
    }

    checkChangePassword = () => {
        const { currentPassword, newPassword, confirmPassword } = this.state;
        if (currentPassword === '' || newPassword === '' || confirmPassword === '') {
            return false;
        }
        return true;
    }

    handleCancel = () => {
        this.props.history.push('/');
    }

    handleSave = async (event) => {
        event.preventDefault();
        if (this.checkChangePassword() && !this.checkWarning() && this.checkNewAndConfirmPassword()) {
            const headers = {
                'Content-Type': 'application/json',
                Authorization: localStorage.token
            };
            const body = {
                new_password: this.state.newPassword,
                old_password: this.state.currentPassword
            };
            axios.defaults.headers.common['Authorization'] = `${localStorage.token}`;
            try {
                const result = await apiPost(`/admin/updatePassword`, body, { headers: headers });
                if (result && result.status === 200) {
                    this.setState({
                        success: true
                    })
                } else {
                    this.setState({
                        error: true,
                        message: "Something went wrong!"
                    });
                }
            } catch (error) {
                this.setState({
                    error: true,
                    message: "Something went wrong!"
                });
            }
        } else {
            if (this.checkWarning()) {
                this.setState({
                    error: true,
                    message: "New Password must be different from Current Password!"
                });
            } else {
                this.setState({
                    error: true,
                    message: "Something went wrong!"
                });
            }
        }
    }

    hideSuccessAlert = () => {
        this.props.history.push('/');
    }

    hideFailAlert = () => {
        this.setState({
            error: false
        })
    }


    render() {
        return (
            <div style={{ height: '100vh' }} className="content-wrapper">
                {this.state.success &&
                    <SweetAlert success title="Successfully" onConfirm={this.hideSuccessAlert}>
                        hihihehehaha
                    </SweetAlert>
                }
                {this.state.error &&
                    <SweetAlert
                        warning
                        confirmBtnText="Cancel"
                        confirmBtnBsStyle="default"
                        title="Fail!!!!!"
                        onConfirm={this.hideFailAlert}
                    >
                        {this.state.message}
                    </SweetAlert>
                }
                <section className="content-header">
                    <h1>
                        ĐỔI MẬT KHẨU
                    </h1>
                </section>
                <section className="content">
                    <div className="row">
                        <div className="col-lg-8 col-lg-offset-2 col-xs-8 col-xs-offset-2">
                            <div className="box box-info">
                                <div className="box-header with-border">
                                    <h3 className="box-title">Change Password Form</h3>
                                </div>
                                <form onSubmit={this.handleSave} className="form-horizontal">
                                    <div className="box-body">
                                        <div className="form-group">
                                            <label className="col-sm-3 control-label">Current Password (*)</label>
                                            <div className="col-sm-8">
                                                <input type="password" onChange={this.handleChange} value={this.state.currentPassword} name="currentPassword" className="form-control" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="col-sm-3 control-label">New Password (*)</label>
                                            <div className="col-sm-8">
                                                <input type="password" onChange={this.handleChange} value={this.state.newPassword} name="newPassword" className="form-control" />
                                            </div>
                                            {this.checkWarning() && <i title="like current password" className="fa fa-exclamation checked warning" />}

                                        </div>
                                        <div className="form-group">
                                            <label className="col-sm-3 control-label">Confirm Password (*)</label>
                                            <div className="col-sm-8">
                                                <input type="password" onChange={this.handleChange} value={this.state.confirmPassword} name="confirmPassword" className="form-control" />
                                            </div>
                                            {this.checkNewAndConfirmPassword() &&
                                                <i className="fa fa-check checked" />
                                            }
                                        </div>
                                    </div>
                                    <div className="box-footer">
                                        <button onClick={this.handleCancel} type="button" className="btn btn-default">Cancel</button>
                                        <button type="submit" className="btn btn-info pull-right">Save</button>
                                    </div>
                                </form>
                            </div>

                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        info: state.infoLocation,
        listTypeLocation: state.listTypeLocation,
        listLocation: state.listLocation,
        listTour: state.listTour,
        listRoute: state.listRoute
    }
}

const mapDispatchToProps = (dispatch, action) => {
    return {
        changeLocationInfo: (info) => dispatch(actions.changeLocationInfo(info)),
        getListTypeLocation: (type) => dispatch(actions.getListTypeLocation(type)),
        createType: (type) => dispatch(actions.createType(type)),
        editType: (type) => dispatch(actions.editType(type)),
        getListTour: (tour) => dispatch(actions.getListTour(tour)),
        getListTransport: (transport) => dispatch(actions.getListTransport(transport)),
        createRoute: (route) => dispatch(actions.createRoute(route)),
        getListRoute: (route) => dispatch(actions.getListRoute(route))
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateTourTurnComponent));