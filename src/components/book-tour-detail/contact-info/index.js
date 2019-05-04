import React, { Component } from 'react';
import * as actions from './../../../actions/index';
import { apiGet, apiPost } from '../../../services/api';

class UpdateContactInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            fullname: '',
            phone: '',
            email: '',
            address: '',
        }
    }

    componentDidMount = async () => {
        const { contactInfo } = this.props;
        this.setState({
            fullname: contactInfo.fullname ? contactInfo.fullname : '',
            phone: contactInfo.phone ? contactInfo.phone : '',
            id: contactInfo.id,
            email: contactInfo.email ? contactInfo.email : '',
            address: contactInfo.address ? contactInfo.address : ''
        });
    }

    handleChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;
        this.setState({ [name]: value });
    }

    validateContactInfo = (passenger) => {
        const { fullname, phone, id, email } = passenger;
        const phoneRegex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
        const emailRegex = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@[*[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+]*/;
        if (!fullname || fullname === '') {
            return false;
        }
        if (!phone || !phoneRegex.test(phone)) {
            return false;
        }
        if (!id || id === '') {
            return false;
        }
        if(!email || !emailRegex.test(String(email).toLocaleLowerCase())){
            return false;
        }
        return true;
    }

    handleSave = (event) => {
        event.preventDefault();
        if (this.validateContactInfo(this.state)) {
            this.props.handleUpdateContactInfo(this.state);
        } else {
            this.props.handleUpdateContactInfo(null);
        }
    }

    handleChangeBirthDate = (time) => {
        this.setState({ birthdate: time });
    }

    render() {
        const { fullname, phone, email, id, address } = this.state;
        return (
            <div className="">
                <section className="content-header">
                    <h1>Chỉnh Sửa Thông Tin Người Liên Hệ <i>#{this.state.id}</i> </h1>
                </section>
                <section className="content">
                    <div className="row invoice-info">
                        <form onSubmit={this.handleSave} className="form-horizontal">
                            <div className="box-body">
                                <div className="form-group">
                                    <label className="col-sm-3 control-label">Tên</label>
                                    <div className="col-sm-8">
                                        <input type="text" onChange={this.handleChange} value={fullname} name="fullname" className="form-control" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-sm-3 control-label">SĐT</label>
                                    <div className="col-sm-8">
                                        <input type="text" onChange={this.handleChange} value={phone} name="phone" className="form-control" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-sm-3 control-label">Email</label>
                                    <div className="col-sm-8">
                                        <input type="text" onChange={this.handleChange} value={email} name="email" className="form-control" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-sm-3 control-label">Địa Chỉ</label>
                                    <div className="col-sm-8">
                                        <textarea type="text" onChange={this.handleChange} value={address} name="address" row={3} className="form-control" />
                                    </div>
                                </div>
                            </div>
                            <div className="box-footer col-sm-11">
                                <button type="submit" className="btn btn-info pull-right">Lưu Thay Đổi</button>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        );
    }
}

export default UpdateContactInfo;
// const mapStateToProps = (state) => {
//     return {
//     }
// }

// const mapDispatchToProps = (dispatch, action) => {
//     return {
//     }
// }
// export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UpdateContactInfo));