import React, { Component } from 'react';
import { formatCurrency } from './../../../helper';
import { connect } from 'react-redux';
import { apiPost, apiPostAdmin } from '../../../services/api';
import './index.css';

class PaymentComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            message: '',
            name: '',
            passport: '',
            note: '',
            person: 'op1',
            staff: null
        }
    }

    componentDidMount = () => {
        // console.log('profile: ', this.props.profile)
        this.setState({
            name: this.props.contactInfo.fullname,
            passport: this.props.contactInfo.passport,
            staff: this.props.profile
        });
    }


    handlePayment = async (event) => {
        event.preventDefault();
        if (this.checkData()) {
            try {
                await apiPostAdmin('/book_tour/payBookTour', {
                    code: this.props.code,
                    message_pay: {
                        name: this.state.name,
                        passport: this.state.passport,
                        note: this.state.note,
                        helper: this.state.person === 'op1' ? false : true
                    }
                });
                this.props.handlePayment(true);
            } catch (error) {
                this.props.handlePayment(false);
            }
        } else {
            this.props.handlePayment(false);
        }
    }

    handleChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;
        this.setState({ [name]: value });
    }

    handleChangeRadio = ({ target }) => {
        this.setState({
            person: target.value,
            passport: target.value === 'op1' ? this.props.contactInfo.passport : '',
            name: target.value === 'op1' ? this.props.contactInfo.fullname : '',
        });
    }

    checkData = () => {
        const { name, passport } = this.state;
        if (name === '' || passport === '') {
            return false;
        }
        return true;
    }

    render() {
        return <div style={{ marginLeft: '0px' }} className="content-wrapper">
            <section style={{ marginBottom: "0px" }} className="content-header">
                <h1> Tổng Tiền {formatCurrency(this.props.totalPay)} VND</h1>
            </section>
            <section style={{ minHeight: '160px' }} className="content">
                <div className="row">
                    <div className="col-lg-12 col-xs-12 ">
                        <div className="box box-info">
                            <form onSubmit={this.handlePayment} className="form-horizontal">

                                <div className="box-body">
                                    <div className="form-group">
                                        <div className="col-sm-4">
                                            <div className="form-group">
                                                <label className="col-sm-4 control-label">Thanh toán</label>
                                                <div className="col-sm-8">
                                                    <div className="radio">
                                                        <label>
                                                            <input
                                                                onChange={this.handleChangeRadio}
                                                                type="radio"
                                                                name="person"
                                                                value="op1"
                                                                checked={this.state.person === 'op1' ? true : false} />
                                                            Người đặt tour
                                                    </label>
                                                    </div>
                                                    <div className="radio">
                                                        <label>
                                                            <input
                                                                onChange={this.handleChangeRadio}
                                                                type="radio"
                                                                name="person"
                                                                value="op2"
                                                                checked={this.state.person === 'op2' ? true : false} />
                                                            Người Khác
                                                    </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-8">
                                            <div className="form-group">
                                                <label className="col-sm-3 control-label">Tên *</label>
                                                <div className="col-sm-9">
                                                    <input
                                                        onChange={this.handleChange}
                                                        value={this.state.name}
                                                        type="text"
                                                        name="name"
                                                        className="form-control"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label className="col-sm-3 control-label">CMND *</label>
                                                <div className="col-sm-9">
                                                    <input
                                                        onChange={this.handleChange}
                                                        value={this.state.passport}
                                                        type="text"
                                                        name="passport"
                                                        className="form-control"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label className="col-sm-3 control-label">Chú thích</label>
                                                <div className="col-sm-9">
                                                    <textarea
                                                        onChange={this.handleChange}
                                                        value={this.state.note}
                                                        type="text"
                                                        name="note"
                                                        className="form-control"
                                                        row={3}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label className="col-sm-3 control-label">NV thanh toán</label>
                                                <div className="col-sm-9">
                                                    <input
                                                        value={this.state.staff ? this.state.staff.name : ''}
                                                        readOnly
                                                        type="text"
                                                        name="passport"
                                                        className="form-control"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="box-footer col-sm-12">
                                    <button type="submit" className="btn btn-info pull-right">Thanh Toán</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>;
    }
}

// export default PaymentComponent;
const mapStateToProps = (state) => {
    return {
        profile: state.profile
    };
}

const mapDispatchToProps = (dispatch, action) => {
    return {
        
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentComponent);