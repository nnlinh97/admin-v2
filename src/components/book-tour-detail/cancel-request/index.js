import React, { Component } from 'react';
import moment from 'moment';
import { formatCurrency, getNumberDays, getPercentRefund, getFeeCancelBooking } from './../../../helper';
import { apiPost } from '../../../services/api';
import './index.css';

class CancelRequestComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            message: '',
            datePeriod: ''
        }
    }

    componentDidMount = async () => {
        this.setState({
            message: this.props.message ? this.props.message.message : ''
        })
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

    handleConfirmRequest = async (event) => {
        event.preventDefault();
        if (this.checkData()) {
            const days = getNumberDays(moment(new Date()).format('YYYY-MM-DD'), this.props.startDate);
            try {
                await apiPost('/cancel_booking/confirmCancel', {
                    idCancelBooking: this.props.message.id,
                    refund_period: moment(this.state.datePeriod).format('YYYY-MM-DD'),
                    money_refunded: this.props.totalPay * (100 - getFeeCancelBooking(days, this.props.holiday)) / 100
                });
                this.props.handleConfirmRequest(true);
            } catch (error) {
                console.log(error);
            }
        } else {
            this.props.handleConfirmRequest(false);
        }
    }

    checkData = () => {
        const current = moment(new Date()).format('YYYY-MM-DD');
        const period = moment(this.state.datePeriod).format('YYYY-MM-DD');
        const days = getNumberDays(current, period);
        if (this.state.datePeriod === '') {
            return false;
        }
        return days >= 3;
    }

    handleChange = ({ target }) => {
        this.setState({ datePeriod: target.value });
    }

    render() {
        const days = getNumberDays(moment(new Date()).format('YYYY-MM-DD'), this.props.startDate);
        return <div style={{ marginLeft: '0px' }} className="content-wrapper">
            <section style={{ marginBottom: "0px" }} className="content-header">
                <h1> Xác Nhận Hủy Đặt Tour</h1>
            </section>
            <section style={{ minHeight: '160px' }} className="content">
                <div className="row">
                    <div className="col-lg-12 col-xs-12 ">
                        <div className="box box-info">
                            <form onSubmit={this.handleConfirmRequest} className="form-horizontal">
                                <div className="box-body">
                                    {this.props.status === 'paid' || this.props.status === 'pending_cancel' && <div className="form-group">
                                        <div className="col-sm-6">
                                            <strong>Chi phí khi hủy tour ngày thường:</strong><br />
                                            - Trước <strong>20</strong> ngày: <strong>0%</strong> (trên giá tour du lịch)<br />
                                            - Từ <strong>15</strong> đến <strong>19</strong> ngày: <strong>15%</strong><br />
                                            - Từ <strong>12</strong> đến <strong>14</strong> ngày: <strong>30%</strong><br />
                                            - Từ <strong>08</strong> đến <strong>11</strong> ngày: <strong>50%</strong><br />
                                            - Từ <strong>05</strong> đến <strong>07</strong> ngày: <strong>70%</strong><br />
                                            - Từ <strong>02</strong> đến <strong>04</strong> ngày: <strong>90%</strong><br />
                                            - Dưới <strong>02</strong> ngày: <strong>100%</strong><br /><br />
                                        </div>
                                        <div className="col-sm-6">
                                            <strong>Chi phí khi hủy tour ngày lễ, tết:</strong><br />
                                            - Trước <strong>30</strong> ngày: <strong>0%</strong> (trên giá tour du lịch)<br />
                                            - Từ <strong>25</strong> đến <strong>29</strong> ngày: <strong>15%</strong><br />
                                            - Từ <strong>22</strong> đến <strong>24</strong> ngày: <strong>30%</strong> <br />
                                            - Từ <strong>17</strong> đến <strong>19</strong> ngày: <strong>50%</strong> <br />
                                            - Từ <strong>08</strong> đến <strong>16</strong> ngày: <strong>70%</strong> <br />
                                            - Từ <strong>02</strong> đến <strong>07</strong> ngày: <strong>90%</strong> <br />
                                            - Dưới <strong>02</strong> ngày: <strong>100%</strong> <br /><br />
                                        </div>
                                    </div>}
                                    <div className="form-group">
                                        <div className="col-sm-12">
                                            <>
                                            - Tour: <strong>{this.props.tour}</strong><br />
                                            - Ngày khởi hành: <strong>{moment(this.props.startDate).format('MM/DD/YYYY')}</strong><br />
                                            - Thời điểm: <strong>{this.props.holiday ? 'Ngày lễ, tết' : 'Ngày thường'}</strong><br />
                                            - Thời gian hủy tour: <strong>{moment(this.props.message.request_time).format('MM/DD/YYYY HH:MM')}</strong><br />
                                            - Hủy tour trước ngày khởi hành: <strong>{days}</strong> ngày<br />
                                            - Chi phí hủy tour: <strong>{getFeeCancelBooking(days, this.props.holiday)}</strong>%<br />
                                            - Số tiền hoàn trả: <strong>{formatCurrency(this.props.totalPay * (100 - getFeeCancelBooking(days, this.props.holiday)) / 100)} VND</strong><br /><br />
                                            </>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-sm-2 control-label">Hẹn gặp</label>
                                        <div className="col-sm-6">
                                            <input
                                                onChange={this.handleChange}
                                                value={this.state.datePeriod}
                                                type="date"
                                                name="datePeriod"
                                                className="form-control"
                                                rows={3}
                                            />
                                        </div>
                                        <label className="col-sm-4 control-label">
                                            <i style={{ textAlign: 'left', fontWeight: '400', fontSize: '12px', left: '0', marginTop: '0' }}>
                                                3 đến 15 ngày kể từ ngày xác nhận hủy
                                            </i>
                                        </label>
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