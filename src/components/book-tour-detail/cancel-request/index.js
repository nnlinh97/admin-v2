import React, { Component } from 'react';
import moment from 'moment';
import { formatCurrency, getNumberDays, getPercentRefund } from './../../../helper';
import { apiPost } from '../../../services/api';
import './index.css';

class CancelRequestComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            message: ''
        }
    }

    componentDidMount = async () => {
        this.setState({ message: this.props.message ? this.props.message.message : '' })
    }

    getNumberDays = (date1, date2) => {
        date1 = date1.split('-');
        date2 = date2.split('-');

        date1 = new Date(date1[0], date1[1], date1[2]);
        date2 = new Date(date2[0], date2[1], date2[2]);

        let date1_unixtime = parseInt(date1.getTime() / 1000);
        let date2_unixtime = parseInt(date2.getTime() / 1000);

        const timeDifference = date2_unixtime - date1_unixtime;

        const timeDifferenceInHours = timeDifference / 60 / 60;

        const timeDifferenceInDays = timeDifferenceInHours / 24;

        return timeDifferenceInDays;
    }

    handleCancelRequest = async () => {
        try {
            const payment = await apiPost('/book_tour/cancel_boook', {
                code: this.props.code,
                message: this.props.message ? this.state.message : null
            });
            this.props.handleCancelRequest(true);
        } catch (error) {
            console.log(error);
        }
    }

    handleChange = ({ target }) => {
        this.setState({ message: target.value });
    }

    render() {
        console.log(this.props.startDate)
        console.log(moment(new Date()).format('YYYY-MM-DD'))
        console.log(getNumberDays(moment(new Date()).format('YYYY-MM-DD'), this.props.startDate))
        const days = getNumberDays(moment(new Date()).format('YYYY-MM-DD'), this.props.startDate);
        return <div style={{ marginLeft: '0px' }} className="content-wrapper">
            <section style={{ marginBottom: "0px" }} className="content-header">
                <h1> Kiểm Tra Hủy Đặt Tour</h1>
            </section>
            <section style={{ minHeight: '160px' }} className="content">
                <div className="row">
                    <div className="col-lg-12 col-xs-12 ">
                        <div className="box box-info">
                            <form onSubmit={this.handleCancelRequest} className="form-horizontal">
                                <div className="box-body">
                                    <div className="form-group">
                                        <label className="col-sm-3 control-label"></label>
                                        <div className="col-sm-8">
                                            {this.props.status === 'paid' && <>
                                                Qui định hoàn trả chi phí khi hủy tour:<br />
                                                    - Trước <strong>15</strong> ngày: <strong>100%</strong><br />
                                                    - Từ <strong>8</strong> đến <strong>14</strong> ngày: <strong>50%</strong><br />
                                                    - Từ <strong>5</strong> đến <strong>7</strong> ngày: <strong>30%</strong><br />
                                                    - Từ <strong>2</strong> đến <strong>4</strong> ngày: <strong>10%</strong><br />
                                                    - Dưới <strong>2</strong> ngày: <strong>0%</strong><br /><br />

                                                Bạn đã hủy tour trước ngày bắt đầu: <strong>{days}</strong> ngày<br />
                                                Chi phí của bạn sẽ được hoàn trả: <strong>{getPercentRefund(days)}%</strong><br />
                                                Số tiền bạn đã thanh toán: <strong>{formatCurrency(this.props.totalPay)} VND</strong><br />
                                                Số tiền bạn sẽ được hoàn trả: <strong>{formatCurrency(this.props.totalPay)} VND</strong><br />
                                                </>}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-sm-3 control-label">Chú thích</label>
                                        <div className="col-sm-8">
                                            <textarea
                                                readOnly={this.props.message ? true : false}
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
                                    <button type="submit" className="btn btn-danger pull-right">Xác Nhận Hủy</button>
                                </div>
                            </form><br />

                        </div>
                    </div>
                </div>
            </section>
        </div>;
    }
}

export default CancelRequestComponent;