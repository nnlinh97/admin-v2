import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import SweetAlert from 'react-bootstrap-sweetalert';
import * as actions from './../../actions/index';
import axios from 'axios';
import { apiGet, apiPost } from '../../services/api';
import './index.css';

class ChangePasswordComponent extends Component {

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
            const body = { new_password: this.state.newPassword, old_password: this.state.currentPassword };
            axios.defaults.headers.common['Authorization'] = `${localStorage.token}`;
            try {
                const result = await apiPost(`/admin/updatePassword`, body, { headers: headers });
                if (result && result.status === 200) {
                    this.setState({ success: true });
                } else {
                    this.setState({ error: true, message: "Đã có lỗi xảy ra!" });
                }
            } catch (error) {
                this.setState({ error: true, message: "Đã có lỗi xảy ra!" });
            }
        } else {
            if (this.checkWarning()) {
                this.setState({ error: true, message: "Mật khẩu mới phải khác mật khẩu hiện tại!" });
            } else {
                this.setState({ error: true, message: "Đã có lỗi xảy ra!" });
            }
        }
    }

    hideSuccessAlert = () => {
        this.props.history.push('/');
    }

    hideFailAlert = () => {
        this.setState({ error: false });
    }

    render() {
        return (
            <div style={{ height: '100vh', paddingTop: '70px' }} className="content-wrapper">

                {this.state.success && <SweetAlert
                    success
                    title="Lưu Thành Công"
                    onConfirm={this.hideSuccessAlert}>
                    Tiếp Tục...
                </SweetAlert>}

                {this.state.error && <SweetAlert
                    warning
                    confirmBtnText="Hủy"
                    confirmBtnBsStyle="default"
                    title={this.state.message}
                    onConfirm={this.hideFailAlert}>
                    Vui Lòng Kiểm Tra Lại...
                </SweetAlert>}

                <section style={{ marginBottom: '20px' }} className="content-header">
                    <h1> ĐỔI MẬT KHẨU </h1>
                </section>
                <section className="content">
                    <div className="row">
                        <div className="col-lg-8 col-lg-offset-2 col-xs-8 col-xs-offset-2">
                            <div className="box box-info">
                                <form onSubmit={this.handleSave} className="form-horizontal">
                                    <div className="box-body">
                                        <div className="form-group">
                                            <label className="col-sm-3 control-label">Mật khẩu hiện tại</label>
                                            <div className="col-sm-8">
                                                <input type="password" onChange={this.handleChange} value={this.state.currentPassword} name="currentPassword" className="form-control" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="col-sm-3 control-label">Mật khẩu mới</label>
                                            <div className="col-sm-8">
                                                <input type="password" onChange={this.handleChange} value={this.state.newPassword} name="newPassword" className="form-control" />
                                            </div>
                                            {this.checkWarning() && <i title="like current password" className="fa fa-exclamation checked warning" />}

                                        </div>
                                        <div className="form-group">
                                            <label className="col-sm-3 control-label">Nhập lại mật khẩu mới</label>
                                            <div className="col-sm-8">
                                                <input type="password" onChange={this.handleChange} value={this.state.confirmPassword} name="confirmPassword" className="form-control" />
                                            </div>
                                            {this.checkNewAndConfirmPassword() && <i className="fa fa-check checked" />}
                                        </div>
                                    </div>
                                    <div className="box-footer col-sm-11">
                                        {/* <button onClick={this.handleCancel} type="button" className="btn btn-default">Cancel</button> */}
                                        <button type="submit" className="btn btn-info pull-right">Lưu Thay Đổi</button>
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

export default withRouter(ChangePasswordComponent);