import React, { Component } from 'react';
import moment from 'moment';
import { formatCurrency, getNumberDays, getPercentRefund, getFeeCancelBooking, getStatusItem } from './../../../helper';
import { apiPost } from '../../../services/api';
import './index.css';

class CancelRequestComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            message: '',
            datePeriod: '',
            person: 'op1',
            name: this.props.contactInfo.fullname,
            passport: this.props.contactInfo.passport,
            note: ''
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
        if (this.checkData() && this.props.status === 'pending_cancel') {
            const days = getNumberDays(moment(this.props.message.request_time).format('YYYY-MM-DD'), this.props.startDate);
            try {
                await apiPost('/cancel_booking/confirmCancel', {
                    idCancelBooking: this.props.message.id,
                    refund_period: moment(this.state.datePeriod).format('YYYY-MM-DD'),
                    money_refunded: this.props.totalPay * (100 - getFeeCancelBooking(days, this.props.holiday)) / 100
                });
                this.props.handleConfirmRequest(true);
            } catch (error) {
                this.props.handleConfirmRequest(false);
            }
        } else if (this.checkData() && this.checkInput() && this.state.note !== '' && this.props.status === 'paid') {
            const days = getNumberDays(moment(new Date()).format('YYYY-MM-DD'), this.props.startDate);
            try {
                await apiPost('/book_tour/confirmCancelBookTourOffline', {
                    code: this.props.code,
                    refund_period: moment(this.state.datePeriod).format('YYYY-MM-DD'),
                    money_refunded: this.props.totalPay * (100 - getFeeCancelBooking(days, this.props.holiday)) / 100,
                    request_offline_person: {
                        name: this.state.name,
                        passport: this.state.passport,
                        helper: this.state.person === 'op1' ? false : true
                    },
                    request_message: this.state.note
                });
                this.props.handleConfirmRequest(true);
            } catch (error) {
                this.props.handleConfirmRequest(false);
            }
        } else {
            this.props.handleConfirmRequest(false);
        }
    }

    handleConfirmRequestBooked = async (event) => {
        event.preventDefault();
        if (this.checkInput()) {
            try {
                const res = await apiPost('/book_tour/cancelBookTourStatusBooked', {
                    code: this.props.code,
                    request_message: this.state.note,
                    request_offline_person: {
                        name: this.state.name,
                        passport: this.state.passport,
                        helper: this.state.person === 'op1' ? false : true
                    }
                });
                this.props.handleConfirmRequest(true);
            } catch (error) {
                this.props.handleConfirmRequest(false);
            }
        } else {
            this.props.handleConfirmRequest(false);
        }
    }

    handleConfirmRequestNoMoney = async (event) => {
        event.preventDefault();
        if(this.checkInput()) {
            try {
                await apiPost('/book_tour/cencelBookTourWithNoMoneyRefund', {
                    code: this.props.code,
                    request_message: this.state.note,
                    request_offline_person: {
                        name: this.state.name,
                        passport: this.state.passport,
                        helper: this.state.person === 'op1' ? false : true,
                        note: this.state.note
                    }
                });
                this.props.handleConfirmRequest(true);
            } catch (error) {
                this.props.handleConfirmRequest(false);
            }
        } else {
            this.props.handleConfirmRequest(false);
        }
    }

    checkInput = () => {
        const { name, passport } = this.state;
        if (name === '' || passport === '') {
            return false;
        }
        return true;
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

    handleChangeDate = ({ target }) => {
        this.setState({ datePeriod: target.value });
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

    render() {
        let days = getNumberDays(moment(new Date()).format('YYYY-MM-DD'), this.props.startDate);
        if (this.props.status === 'pending_cancel') {
            days = getNumberDays(moment(this.props.message.request_time).format('YYYY-MM-DD'), this.props.startDate);
        }
        if (this.props.status === 'booked') {
            return <div style={{ marginLeft: '0px' }} className="content-wrapper">
                <section style={{ marginBottom: "0px" }} className="content-header">
                    <h1> Xác Nhận Hủy Đặt Tour</h1>
                </section>
                <section style={{ minHeight: '160px' }} className="content">
                    <div className="row">
                        <div className="col-lg-12 col-xs-12 ">
                            <div className="box box-info">
                                <form onSubmit={this.handleConfirmRequestBooked} className="form-horizontal">
                                    <div className="box-body">
                                        <div className="form-group">
                                            <div className="col-sm-12">
                                                - Tour: <strong>{this.props.tour}</strong><br />
                                                - Ngày khởi hành: <strong>{moment(this.props.startDate).format('MM/DD/YYYY')}</strong><br />
                                                - Thời điểm: <strong>{this.props.holiday ? 'Ngày lễ, tết' : 'Ngày thường'}</strong><br />
                                                - Trạng thái: <span style={{ backgroundColor: getStatusItem(this.props.status).colorStatus }} className={`label disabled`} >
                                                    {getStatusItem(this.props.status).textStatus}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="col-sm-12">
                                                <div className="form-group">
                                                    <label className="col-sm-2 control-label">Hủy tour</label>
                                                    <div className="col-sm-6">
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
                                                                Người khác
                                                    </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-12">
                                                <div className="form-group">
                                                    <label className="col-sm-2 control-label">Tên</label>
                                                    <div className="col-sm-6">
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
                                                    <label className="col-sm-2 control-label">CMND</label>
                                                    <div className="col-sm-6">
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
                                                    <label className="col-sm-2 control-label">Chú thích</label>
                                                    <div className="col-sm-6">
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
                                    {(this.props.status === 'paid' || this.props.status === 'pending_cancel') && <div className="form-group">
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
                                            <strong>Thông tin:</strong><br />
                                        </div>
                                        <div className="col-sm-6">
                                            - Tour: <strong>{this.props.tour}</strong><br />
                                            - Ngày khởi hành: <strong>{moment(this.props.startDate).format('MM/DD/YYYY')}</strong><br />
                                            - Thời điểm: <strong>{this.props.holiday ? 'Ngày lễ, tết' : 'Ngày thường'}</strong><br />
                                        </div>
                                        <div className="col-sm-6">
                                            {this.props.status === 'pending_cancel' && <>
                                                - Thời gian hủy tour: <strong>{moment(this.props.message.request_time).format('MM/DD/YYYY HH:MM')}</strong><br />
                                                </>}
                                            {this.props.status === 'paid' && <>
                                                - Thời gian hủy tour: <strong>{moment(new Date()).format('MM/DD/YYYY HH:MM')}</strong><br />
                                                </>}
                                            - Hủy tour trước ngày khởi hành: <strong>{days}</strong> ngày<br />
                                            - Chi phí hủy tour: <strong>{getFeeCancelBooking(days, this.props.holiday)}%</strong><br />
                                            - Tổng Tiền: <strong><mark style={{ backgroundColor: '#ff0' }}>{formatCurrency(this.props.totalPay)}</mark> VND</strong><br />
                                            - Số tiền hoàn trả: <strong><mark style={{ backgroundColor: '#ff0' }}>{formatCurrency(this.props.totalPay * (100 - getFeeCancelBooking(days, this.props.holiday)) / 100)}</mark> VND</strong><br /><br />
                                        </div>
                                    </div>
                                    {this.props.status === 'paid' && <div className="form-group">
                                        <div className="col-sm-12">
                                            <div className="form-group">
                                                <label className="col-sm-2 control-label">Hủy tour</label>
                                                <div className="col-sm-6">
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
                                                            Người nhận hộ
                                                    </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-12">
                                            <div className="form-group">
                                                <label className="col-sm-2 control-label">Tên</label>
                                                <div className="col-sm-6">
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
                                                <label className="col-sm-2 control-label">CMND</label>
                                                <div className="col-sm-6">
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
                                                <label className="col-sm-2 control-label">Chú thích</label>
                                                <div className="col-sm-6">
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
                                            {days >= 2 && <div className="form-group">
                                                <label className="col-sm-2 control-label">Ngày hẹn</label>
                                                <div className="col-sm-6">
                                                    <input
                                                        onChange={this.handleChangeDate}
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
                                            </div>}
                                        </div>
                                    </div>}
                                    {this.props.status === 'pending_cancel' && <div className="form-group">
                                        <label className="col-sm-2 control-label">Ngày hẹn</label>
                                        <div className="col-sm-6">
                                            <input
                                                onChange={this.handleChangeDate}
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
                                    </div>}
                                </div>
                                {days >= 2 && <div className="box-footer col-sm-12">
                                    <button onClick={this.handleConfirmRequest} type="button" className="btn btn-danger pull-right">Xác Nhận Hủy</button>
                                </div>}
                                {days < 2 && <div className="box-footer col-sm-12 no-money">
                                    <button onClick={this.handleConfirmRequestNoMoney} type="button" className="btn btn-danger pull-right">Xác Nhận Hủy</button>
                                </div>}
                            </form>
                            <br />
                        </div>
                    </div>
                </div>
            </section>
        </div>;
    }
}

export default CancelRequestComponent;