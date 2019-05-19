import React, { Component } from 'react';
import moment from 'moment';
import dateFns from 'date-fns';
import {
    formatCurrency,
    getNumberDays,
    getPercentRefund,
    getFeeCancelBooking,
    getStatusItem,
    getDateAfter,
    getNumberDays1,
    percentMoneyRefund
} from './../../../helper';
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
            note: '',
            fromDate: getDateAfter(3),
            toDate: getDateAfter(15),
            policy: false,
            optionCancel: 'op1',
            nameCancel: this.props.contactInfo.fullname,
            passportCancel: this.props.contactInfo.passport,
            noteCancel: '',
            optionReciever: 'op1',
            nameReciever: this.props.contactInfo.fullname,
            passportReciever: this.props.contactInfo.passport,
            noteReciever: ''
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
        if (this.checkInputReceiver() && this.props.status === 'pending_cancel') {
            const days = getNumberDays1(moment(this.props.message.request_time).format('YYYY-MM-DD'), this.props.startDate);
            try {
                await apiPost('/cancel_booking/confirmCancel', {
                    idCancelBooking: this.props.message.id,
                    refund_period: moment(this.state.toDate).format('YYYY-MM-DD'),
                    money_refunded: this.props.totalPay * percentMoneyRefund(days, this.props.holiday) / 100,
                    refund_message: {
                        name: this.state.nameReciever,
                        passport: this.state.passportReciever,
                        note: this.state.noteReciever,
                        helper: this.state.optionReciever === 'op1' ? false : true
                    }
                });
                this.props.handleConfirmRequest(true);
            } catch (error) {
                this.props.handleConfirmRequest(false);
            }
        } else if (this.checkDate() && this.checkInputCancel() && this.checkInputReceiver() && this.props.status === 'paid') {
            const days = getNumberDays1(moment(new Date()).format('YYYY-MM-DD'), this.props.startDate);
            try {
                await apiPost('/book_tour/confirmCancelBookTourOffline', {
                    code: this.props.code,
                    refund_period: moment(this.state.toDate).format('YYYY-MM-DD'),
                    money_refunded: this.props.totalPay * percentMoneyRefund(days, this.props.holiday) / 100,
                    request_message: this.state.noteCancel,
                    request_offline_person: {
                        name: this.state.nameCancel,
                        passport: this.state.passportCancel,
                        helper: this.state.optionCancel === 'op1' ? false : true
                    },
                    refund_message: {
                        name: this.state.nameReciever,
                        passport: this.state.passportReciever,
                        note: this.state.noteReciever,
                        helper: this.state.optionReciever === 'op1' ? false : true
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

    handleConfirmRequestBooked = async (event) => {
        event.preventDefault();
        if (this.checkInputCancel()) {
            try {
                await apiPost('/book_tour/cancelBookTourStatusBooked', {
                    code: this.props.code,
                    request_message: this.state.noteCancel,
                    request_offline_person: {
                        name: this.state.nameCancel,
                        passport: this.state.passportCancel,
                        helper: this.state.optionCancel === 'op1' ? false : true
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
        if (this.checkInputCancel()) {
            try {
                await apiPost('/book_tour/cancelBookTourWithNoMoneyRefund', {
                    code: this.props.code,
                    request_message: this.state.noteCancel,
                    request_offline_person: {
                        name: this.state.nameCancel,
                        passport: this.state.passportCancel,
                        helper: this.state.optionCancel === 'op1' ? false : true,
                        note: this.state.noteCancel
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

    checkInputCancel = () => {
        const { nameCancel, passportCancel } = this.state;
        if (nameCancel === '' || nameCancel === '') {
            return false;
        }
        return true;
    }

    checkInputReceiver = () => {
        const { nameReciever, passportReciever } = this.state;
        if (nameReciever === '' || passportReciever === '') {
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
        this.setState({ toDate: target.value });
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

    handleChangeRadioCancel = ({ target }) => {
        this.setState({
            optionCancel: target.value,
            passportCancel: target.value === 'op1' ? this.props.contactInfo.passport : '',
            nameCancel: target.value === 'op1' ? this.props.contactInfo.fullname : '',
        });
    }

    handleChangeRadioReciever = ({ target }) => {
        this.setState({
            optionReciever: target.value,
            passportReciever: target.value === 'op1' ? this.props.contactInfo.passport : '',
            nameReciever: target.value === 'op1' ? this.props.contactInfo.fullname : '',
        });
    }

    showPolicy = () => {
        this.setState({ policy: !this.state.policy });
    }

    render() {
        let days = getNumberDays1(moment(new Date()).format('YYYY-MM-DD'), this.props.startDate);
        if (this.props.status === 'pending_cancel') {
            days = getNumberDays1(moment(this.props.message.request_time).format('YYYY-MM-DD'), this.props.startDate);
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
                                                <div className="col-sm-12">
                                                    <div className="form-group">
                                                        <label className="col-sm-2 control-label">Hủy tour</label>
                                                        <div className="col-sm-6">
                                                            <div className="col-sm-6 radio">
                                                                <label>
                                                                    <input
                                                                        onChange={this.handleChangeRadioCancel}
                                                                        type="radio"
                                                                        name="optionCancel"
                                                                        value="op1"
                                                                        checked={this.state.optionCancel === 'op1' ? true : false} />
                                                                    Người đặt tour
                                                                </label>
                                                            </div>
                                                            <div className="col-sm-6 radio">
                                                                <label>
                                                                    <input
                                                                        onChange={this.handleChangeRadioCancel}
                                                                        type="radio"
                                                                        name="optionCancel"
                                                                        value="op2"
                                                                        checked={this.state.optionCancel === 'op2' ? true : false} />
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
                                                                onChange={this.handleChange}
                                                                value={this.state.nameCancel}
                                                                type="text"
                                                                name="nameCancel"
                                                                className="form-control"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="col-sm-2 control-label">CMND</label>
                                                        <div className="col-sm-10">
                                                            <input
                                                                onChange={this.handleChange}
                                                                value={this.state.passportCancel}
                                                                type="text"
                                                                name="passportCancel"
                                                                className="form-control"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="col-sm-2 control-label">Chú thích</label>
                                                        <div className="col-sm-10">
                                                            <textarea
                                                                onChange={this.handleChange}
                                                                value={this.state.noteCancel}
                                                                type="text"
                                                                name="noteCancel"
                                                                className="form-control"
                                                                row={3}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="box-footer col-sm-12">
                                        <button type="submit" className="btn btn-danger pull-right">Xác Nhận Hủy</button>
                                    </div>
                                </form><br />
                            </div>
                        </div>
                    </div>
                </section>
            </div>;
        }
        return <div style={{ marginLeft: '0px', overflowY: 'scroll', maxHeight: '605px' }} className="content-wrapper">
            <section style={{ marginBottom: "0px" }} className="content-header">
                <h1> Xác Nhận Hủy Đặt Tour</h1>
            </section>
            <section style={{ minHeight: '160px' }} className="content">
                <div className="row">
                    <div className="col-lg-12 col-xs-12 ">
                        <div className="box box-info">
                            <form onSubmit={this.handleConfirmRequest} className="form-horizontal">
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
                                    {(this.props.status === 'paid' || this.props.status === 'pending_cancel') && this.state.policy &&
                                        <div className="form-group">
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
                                            <strong style={{ fontSize: '20px' }}>Thông tin</strong><br />
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
                                            - Phần trăm hoàn trả: <strong>{percentMoneyRefund(days, this.props.holiday)}%</strong><br />
                                            - Tổng Tiền: <strong><mark style={{ backgroundColor: '#ff0' }}>{formatCurrency(this.props.totalPay)}</mark> VND</strong><br />
                                            - Số tiền hoàn trả: <strong><mark style={{ backgroundColor: '#ff0' }}>
                                                {formatCurrency(this.props.totalPay * percentMoneyRefund(days, this.props.holiday) / 100)}
                                            </mark> VND</strong><br /><br />
                                        </div>
                                    </div>
                                    {this.props.status === 'paid' && <div className="form-group">
                                        <div className="col-sm-12">
                                            <div className="form-group">
                                                <label className="col-sm-2 control-label">Hủy tour</label>
                                                <div className="col-sm-6">
                                                    <div className="col-sm-6 radio">
                                                        <label>
                                                            <input
                                                                onChange={this.handleChangeRadioCancel}
                                                                type="radio"
                                                                name="optionCancel"
                                                                value="op1"
                                                                checked={this.state.optionCancel === 'op1' ? true : false} />
                                                            Người đặt tour
                                                </label>
                                                    </div>
                                                    <div className="col-sm-6 radio">
                                                        <label>
                                                            <input
                                                                onChange={this.handleChangeRadioCancel}
                                                                type="radio"
                                                                name="optionCancel"
                                                                value="op2"
                                                                checked={this.state.optionCancel === 'op2' ? true : false} />
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
                                                        onChange={this.handleChange}
                                                        value={this.state.nameCancel}
                                                        type="text"
                                                        name="nameCancel"
                                                        className="form-control"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label className="col-sm-2 control-label">CMND</label>
                                                <div className="col-sm-10">
                                                    <input
                                                        onChange={this.handleChange}
                                                        value={this.state.passportCancel}
                                                        type="text"
                                                        name="passportCancel"
                                                        className="form-control"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label className="col-sm-2 control-label">Chú thích</label>
                                                <div className="col-sm-10">
                                                    <textarea
                                                        onChange={this.handleChange}
                                                        value={this.state.noteCancel}
                                                        type="text"
                                                        name="noteCancel"
                                                        className="form-control"
                                                        row={3}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>}
                                    {(this.props.status === 'paid' || this.props.status === 'pending_cancel') && days >= 2 &&
                                        <div className="form-group">
                                            <div className="col-sm-12">
                                                <div className="form-group">
                                                    <label className="col-sm-2 control-label">Nhận tiền</label>
                                                    <div className="col-sm-6">
                                                        <div className="col-sm-6 radio">
                                                            <label>
                                                                <input
                                                                    onChange={this.handleChangeRadioReciever}
                                                                    type="radio"
                                                                    name="optionReciever"
                                                                    value="op1"
                                                                    checked={this.state.optionReciever === 'op1' ? true : false} />
                                                                Người đặt tour
                                                        </label>
                                                        </div>
                                                        <div className="col-sm-6 radio">
                                                            <label>
                                                                <input
                                                                    onChange={this.handleChangeRadioReciever}
                                                                    type="radio"
                                                                    name="optionReciever"
                                                                    value="op2"
                                                                    checked={this.state.optionReciever === 'op2' ? true : false} />
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
                                                            onChange={this.handleChange}
                                                            value={this.state.nameReciever}
                                                            type="text"
                                                            name="nameReciever"
                                                            className="form-control"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-sm-2 control-label">CMND</label>
                                                    <div className="col-sm-10">
                                                        <input
                                                            onChange={this.handleChange}
                                                            value={this.state.passportReciever}
                                                            type="text"
                                                            name="passportReciever"
                                                            className="form-control"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-sm-2 control-label">Chú thích</label>
                                                    <div className="col-sm-10">
                                                        <textarea
                                                            onChange={this.handleChange}
                                                            value={this.state.noteReciever}
                                                            type="text"
                                                            name="noteReciever"
                                                            className="form-control"
                                                            row={3}
                                                        />
                                                    </div>
                                                </div>
                                                {days >= 2 && <div className="form-group">
                                                    <label className="col-sm-2 control-label">Ngày hẹn</label>
                                                    <div className="col-sm-4">
                                                        <input
                                                            value={this.state.fromDate}
                                                            type="date"
                                                            name="datePeriod"
                                                            className="form-control"
                                                            readOnly
                                                        />
                                                    </div>
                                                    <label className="col-sm-2 control-label">đến</label>
                                                    <div className="col-sm-4">
                                                        <input
                                                            onChange={this.handleChangeDate}
                                                            value={this.state.toDate}
                                                            type="date"
                                                            name="datePeriod"
                                                            className="form-control"
                                                        />
                                                    </div>
                                                </div>}
                                            </div>
                                        </div>}
                                </div>
                                {days >= 2 && <div className="box-footer col-sm-12">
                                    <button style={{marginLeft: '5px'}} onClick={this.handleConfirmRequest} type="button" className="btn btn-danger pull-right">Xác Nhận Hủy</button>
                                    <button onClick={this.handleConfirmRequest} type="button" className="btn btn-info pull-right">Hủy Yêu Cầu</button>
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