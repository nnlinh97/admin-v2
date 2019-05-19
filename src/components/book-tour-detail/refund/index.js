import React, { Component } from 'react';
import moment from 'moment';
import {
    formatCurrency,
    getNumberDays,
    getPercentRefund,
    getFeeCancelBooking,
    getStatusItem,
    getNumberDays1,
    percentMoneyRefund
} from './../../../helper';
import { apiPost } from '../../../services/api';
import './index.css';

class RefundComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            passport: this.props.contactInfo.passport,
            name: this.props.contactInfo.fullname,
            note: '',
            person: 'op1',
            policy: false
        }
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

    handleRefundMoney = async (event) => {
        event.preventDefault();
        if (this.checkData()) {
            try {
                await apiPost('/cancel_booking/refunded', {
                    idCancelBooking: this.props.message.id,
                    refund_message: {
                        name: this.state.name,
                        passport: this.state.passport,
                        note: this.state.note,
                        helper: this.state.person === 'op1' ? false : true
                    }
                });
                this.props.handleRefundMoney(true);
            } catch (error) {
                this.props.handleRefundMoney(false);
            }
        } else {
            this.props.handleRefundMoney(false);
        }
    }

    checkData = () => {
        if (this.state.name === '' || this.state.passport === '') {
            return false;
        }
        return true;
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

    showPolicy = () => {
        this.setState({ policy: !this.state.policy });
    }

    render() {
        const days = getNumberDays1(moment(this.props.message.request_time).format('YYYY-MM-DD'), this.props.startDate);
        return <div style={{ marginLeft: '0px', maxHeight: '670px', overflowY: 'scroll' }} className="content-wrapper">
            <section style={{ marginBottom: "0px" }} className="content-header">
                <h1> Xác Nhận Hoàn Tiền </h1>
            </section>
            <section style={{ minHeight: '160px' }} className="content">
                <div className="row">
                    <div className="col-lg-12 col-xs-12 ">
                        <div className="box box-info">
                            <form onSubmit={this.handleRefundMoney} className="form-horizontal">
                                <div className="box-body">
                                    <div className="form-group">
                                        <div className="col-sm-6">
                                            <strong onClick={this.showPolicy} style={{ fontSize: '20px', cursor: 'pointer' }}>Quy định hủy tour</strong>
                                        </div>
                                        <div className="col-sm-6">
                                            <span><i
                                                onClick={this.showPolicy}
                                                title={this.state.policy ? 'Ẩn quy định hủy tour' : 'Hiện quy định hủy tour'}
                                                style={{ marginTop: '5px', fontSize: '20px', cursor: 'pointer' }}
                                                className={`fa fa-angle-${this.state.policy ? 'down' : 'left'} pull-right`} />
                                            </span>
                                        </div>
                                    </div>
                                    {this.state.policy && <div style={{ marginBottom: '0px' }} className="form-group">
                                        <div className="col-sm-6">
                                            <strong>Tour ngày thường:</strong><br />
                                            - Trước <strong>20</strong> ngày: hoàn trả <strong>100%</strong><br />
                                            - Từ <strong>15</strong> đến <strong>19</strong> ngày: hoàn trả <strong>85%</strong><br />
                                            - Từ <strong>12</strong> đến <strong>14</strong> ngày: hoàn trả <strong>70%</strong><br />
                                            - Từ <strong>08</strong> đến <strong>11</strong> ngày: hoàn trả <strong>50%</strong><br />
                                            - Từ <strong>05</strong> đến <strong>07</strong> ngày: hoàn trả <strong>30%</strong><br />
                                            - Từ <strong>02</strong> đến <strong>04</strong> ngày: hoàn trả <strong>10%</strong><br />
                                            - Dưới <strong>02</strong> ngày: <strong>0%</strong><br /><br />
                                        </div>
                                        <div className="col-sm-6">
                                            <strong>Tour ngày lễ, tết:</strong><br />
                                            - Trước <strong>30</strong> ngày: hoàn trả <strong>100%</strong><br />
                                            - Từ <strong>25</strong> đến <strong>29</strong> ngày: hoàn trả <strong>85%</strong><br />
                                            - Từ <strong>22</strong> đến <strong>24</strong> ngày: hoàn trả <strong>70%</strong> <br />
                                            - Từ <strong>17</strong> đến <strong>19</strong> ngày: hoàn trả <strong>50%</strong> <br />
                                            - Từ <strong>08</strong> đến <strong>16</strong> ngày: hoàn trả <strong>30%</strong> <br />
                                            - Từ <strong>02</strong> đến <strong>07</strong> ngày: hoàn trả <strong>10%</strong> <br />
                                            - Dưới <strong>02</strong> ngày: <strong>0%</strong> <br /><br />
                                        </div>
                                    </div>}
                                    <div className="form-group">
                                        <div className="col-sm-12">
                                            <strong style={{fontSize: '20px'}}>Thông tin</strong><br />
                                        </div>
                                        <div className="col-sm-6">
                                            - Tour: <strong>{this.props.tour}</strong><br />
                                            - Ngày khởi hành: <strong>{moment(this.props.startDate).format('MM/DD/YYYY')}</strong><br />
                                            - Thời điểm: <strong>{this.props.holiday ? 'Ngày lễ, tết' : 'Ngày thường'}</strong><br />
                                        </div>
                                        <div className="col-sm-6">
                                            - Thời gian hủy tour: <strong>{moment(this.props.message.request_time).format('MM/DD/YYYY HH:MM')}</strong><br />
                                            - Hủy tour trước ngày khởi hành: <strong>{days}</strong> ngày<br />
                                            - Phần trăm hoàn trả: <strong>{percentMoneyRefund(days, this.props.holiday)}</strong>%<br />
                                            - Số tiền hoàn trả: <strong>
                                                {formatCurrency(this.props.totalPay * percentMoneyRefund(days, this.props.holiday) / 100)} VND
                                            </strong><br /><br />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="col-sm-12">
                                            <div className="form-group">
                                                <label className="col-sm-2 control-label">Nhận Tiền</label>
                                                <div className="col-sm-10">
                                                    <div className="col-sm-6 radio">
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
                                                    <div className="col-sm-6 radio">
                                                        <label>
                                                            <input
                                                                onChange={this.handleChangeRadio}
                                                                type="radio"
                                                                name="person"
                                                                value="op2"
                                                                checked={this.state.person === 'op2' ? true : false} />
                                                            Người nhận hộ
                                                    </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-12">
                                            <div className="form-group">
                                                <label className="col-sm-2 control-label">Tên</label>
                                                <div className="col-sm-10">
                                                    <input
                                                        value={this.state.name}
                                                        type="text"
                                                        name="name"
                                                        className="form-control"
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label className="col-sm-2 control-label">CMND</label>
                                                <div className="col-sm-10">
                                                    <input
                                                        value={this.state.passport}
                                                        type="text"
                                                        name="passport"
                                                        className="form-control"
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label className="col-sm-2 control-label">Chú thích</label>
                                                <div className="col-sm-10">
                                                    <textarea
                                                        value={this.state.note}
                                                        type="text"
                                                        name="note"
                                                        className="form-control"
                                                        row={3}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="box-footer col-sm-12">
                                    <button type="submit" className="btn btn-danger pull-right">Xác Nhận Hoàn Tiền</button>
                                </div>
                            </form><br />
                        </div>
                    </div>
                </div>
            </section>
        </div>;
    }
}

export default RefundComponent;