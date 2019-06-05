import React, { Component } from 'react';
import moment from 'moment';
import {
    formatCurrency,
    getStatusItem,
    getDateAfter
} from './../../../helper';
import * as actions from './../../../actions/index';
import { apiGet, apiPost } from '../../../services/api';

class CancelBooking extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            optionCancel: 'op1',
            nameCancel: '',
            passportCancel: '',
            noteCancel: '',
            fromDate: getDateAfter(3),
            toDate: getDateAfter(15),
            reason: 'Hủy tour do thiếu hành khách.'
        }
    }

    componentDidMount() {
        console.log('bôking', this.props.booking)
        const info = this.props.booking.book_tour_contact_info;
        this.setState({
            nameCancel: info.fullname,
            passportCancel: info.passport
        });
    }

    handleChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;
        this.setState({ [name]: value });
    }

    handleChangeRadioCancel = ({ target }) => {
        const info = this.props.booking.book_tour_contact_info;
        this.setState({
            optionCancel: target.value,
            passportCancel: target.value === 'op1' ? info.passport : '',
            nameCancel: target.value === 'op1' ? info.fullname : '',
        });
    }

    checkInput = () => {
        const { nameCancel, passportCancel } = this.state;
        if (nameCancel === '' || passportCancel === '') {
            return false;
        }
        return true;
    }

    handleChangeDate = ({ target }) => {
        this.setState({ toDate: target.value });
    }

    handleCancelBookingBooked = async (event) => {
        event.preventDefault();
        try {
            await apiPost('/cancel_booking/cancelTourTurn_CancelBookTourStatusBooked', {
                code: this.props.booking.code,
                request_message: this.state.reason
            });
            this.props.handleCancelBooking(true);
        } catch (error) {
            this.props.handleCancelBooking(false);
        }
    }

    handleCancelBookingMoney = async (event) => {
        event.preventDefault();
        if (this.checkInput()) {
            try {
                await apiPost('', {
                    code: this.props.booking.code,
                    money_refunded: this.props.booking.total_pay,
                    refund_period: moment(this.state.toDate).format('YYYY-MM-DD'),
                    refund_message: {
                        name: this.state.nameCancel,
                        passport: this.state.passportCancel,
                        note: this.state.passportCancel,
                        helper: this.state.optionCancel === 'op1' ? false : true
                    },
                    request_message: this.state.reason
                });
            } catch (error) {
                this.props.handleCancelBooking(false);
            }
        } else {
            this.props.handleCancelBooking(false);
        }
    }

    render() {
        if (this.props.booking.status === 'booked') {
            return <div className="">
                <section className="content-header">
                    <h1>Hủy Đặt Tour</h1>
                </section>
                <section style={{ minHeight: '160px' }} className="content">
                    <div className="row">
                        <div className="col-lg-12 col-xs-12 ">
                            <div className="box box-info">
                                <form onSubmit={this.handleCancelBookingBooked} className="form-horizontal">
                                    <div className="box-body">
                                        <div className="form-group">
                                            <div className="col-sm-12">
                                                <strong style={{ fontSize: '20px' }}>Thông tin</strong><br />
                                            </div>
                                            <div className="col-sm-6">
                                                - Tour: <strong>{this.props.tour.name}</strong><br />
                                                - Ngày khởi hành: <strong>{moment(this.props.tourTurn.start_date).format('DD/MM/YYYY')}</strong><br />
                                                - Thời điểm: <strong>{this.props.tourTurn.isHoliday ? 'Ngày lễ, tết' : 'Ngày thường'}</strong><br />
                                                - Trạng thái: <span style={{ backgroundColor: getStatusItem(this.props.booking.status).colorStatus }} className={`label disabled`} >
                                                    {getStatusItem(this.props.booking.status).textStatus}
                                                </span>
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
            </div>
        }
        return (
            <div className="">
                <section className="content-header">
                    <h1>Hủy Đặt Tour</h1>
                </section>
                <section style={{ minHeight: '160px' }} className="content">
                    <div className="row">
                        <div className="col-lg-12 col-xs-12 ">
                            <div className="box box-info">
                                <form onSubmit={this.handleCancelBookingMoney} className="form-horizontal">
                                    <div className="box-body">
                                        <div className="form-group">
                                            <div className="col-sm-12">
                                                <strong style={{ fontSize: '20px' }}>Thông tin</strong><br />
                                            </div>
                                            <div className="col-sm-6">
                                                - Tour: <strong>{this.props.tour.name}</strong><br />
                                                - Ngày khởi hành: <strong>{moment(this.props.tourTurn.start_date).format('DD/MM/YYYY')}</strong><br />
                                                - Thời điểm: <strong>{this.props.tourTurn.isHoliday ? 'Ngày lễ, tết' : 'Ngày thường'}</strong><br />
                                                - Trạng thái: <span style={{ backgroundColor: getStatusItem(this.props.booking.status).colorStatus }} className={`label disabled`} >
                                                    {getStatusItem(this.props.booking.status).textStatus}
                                                </span>
                                            </div>
                                            {this.props.booking.status !== 'booked' && <div className="col-sm-6">
                                                - Phần trăm hoàn trả: <strong>100%</strong><br />
                                                - Tổng Tiền: <strong>{formatCurrency(this.props.booking.total_pay)} VND</strong><br />
                                                - Số tiền hoàn trả: <strong>
                                                    {formatCurrency(this.props.booking.total_pay)} VND</strong><br />
                                            </div>}
                                        </div>
                                        <div className="form-group">
                                            <div className="col-sm-12">
                                                <div className="col-sm-12">
                                                    <div className="form-group">
                                                        <label className="col-sm-2 control-label">Nhận tiền</label>
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
                                                    <div className="form-group">
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
            </div>
        );
    }
}

export default CancelBooking;