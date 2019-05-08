import React, { Component } from 'react';
import { formatCurrency } from './../../../helper';
import { apiPost } from '../../../services/api';
import './index.css';

class PaymentComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            message: ''
        }
    }

    handlePayment = async (event) => {
        event.preventDefault();
        try {
            await apiPost('/book_tour/payBookTour', { code: this.props.code, message: this.state.message });
            this.props.handlePayment(true);
        } catch (error) {
            console.log(error);
        }
    }

    handleChange = ({ target }) => {
        this.setState({ message: target.value });
    }

    render() {
        return <div style={{ marginLeft: '0px' }} className="content-wrapper">
            <section style={{ marginBottom: "0px" }} className="content-header">
                <h1> Tổng Tiền {formatCurrency(this.props.totalPay)} VND</h1>
            </section>
            <section style={{minHeight: '160px'}} className="content">
                <div className="row">
                    <div className="col-lg-12 col-xs-12 ">
                        <div className="box box-info">
                            <form onSubmit={this.handlePayment} className="form-horizontal">
                                <div className="box-body">
                                    <div className="form-group">
                                        <label className="col-sm-3 control-label">Chú thích</label>
                                        <div className="col-sm-8">
                                            <textarea
                                                onChange={this.handleChange}
                                                value={this.state.message}
                                                name="message"
                                                className="form-control"
                                                rows={3}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="box-footer col-sm-11">
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

export default PaymentComponent;