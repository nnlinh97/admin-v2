import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import _ from 'lodash';
import moment from 'moment';
import SweetAlert from 'react-bootstrap-sweetalert';
import Modal from 'react-responsive-modal';
import dateFns from 'date-fns';
import PassengerUpdate from './passenger-update';
import ContactInfoUpdate from './contact-info';
import Payment from './payment';
import CancelRequest from './cancel-request';
import ChangeDate from './change-date';
import Refund from './refund';
import RemoveRequest from './remove-request';
import ChangeRefundPeople from './change-refund-people';
import * as actions from './../../actions/index';
import { apiGet, apiPost } from '../../services/api';
import {
    mergeBookHistory,
    filterBookHistory,
    formatCurrency,
    pagination,
    matchString,
    getStatusItem,
    getSex,
    getCancelChecked,
    getPaymentChecked,
    getPaymentType,
    getNumberDays
} from './../../helper';
import 'font-awesome/css/font-awesome.css';
import './index.css';

class CreateTourTurnComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            success: false,
            error: false,
            bookTourHistory: [],
            // tourTurn: null,
            tour: null,
            modalPayIsOpen: false,
            modalUpdatePassengerIsOpen: false,
            modalUpdateContactInfoIsOpen: false,
            modalCancelRequestIsOpen: false,
            modalChangeDateIsOpen: false,
            modalRefundIsOpen: false,
            modalRemoveRequest: false,
            modalChangeRefundPeopleIsOpen: false,
            bookPay: null,
            passengerUpdate: null,
            contactInfoUpdate: null,
            confirmRefund: false,
            refundCode: '',
            keySearch: '',
            cancelCode: '',
            confirmCancelRequest: false,

            bookTime: '',
            id: '',
            contactInfo: null,
            idTourTurn: '',
            status: '',
            paymentMethod: null,
            totalPay: '',
            typePassenger: null,
            passengers: [],
            numPassengers: '',
            tourTurn: null,
            passenger: null,
            cancelChecked: false,
            paymentChecked: false,
            message: null,
            bookTourDetail: null,
            code: '',
            messagePayment: null
        }
    }

    async componentDidMount() {
        let bookTourDetail = null;
        try {
            const { code } = this.props.match.params;
            const detail = await apiGet(`/book_tour/getHistoryBookTourByCode/${code}?tour=true&isAdmin=true`);
            bookTourDetail = detail.data.data;
            console.log(bookTourDetail)
            this.updateState(bookTourDetail);
        } catch (error) {
            console.log(error);
        }
    }

    updateState = (bookTourDetail) => {
        this.setState({
            id: bookTourDetail.id,
            bookTime: bookTourDetail.book_time,
            contactInfo: bookTourDetail.book_tour_contact_info,
            idTourTurn: bookTourDetail.fk_tour_turn,
            status: bookTourDetail.status,
            paymentMethod: bookTourDetail.payment_method,
            totalPay: bookTourDetail.total_pay,
            typePassenger: bookTourDetail.type_passenger_detail,
            passengers: bookTourDetail.passengers,
            numPassengers: bookTourDetail.num_passenger,
            tourTurn: bookTourDetail.tour_turn,
            message: bookTourDetail.cancel_bookings.length > 0 ? bookTourDetail.cancel_bookings[0] : null,
            bookTourDetail: bookTourDetail,
            code: bookTourDetail.code,
            messagePayment: bookTourDetail.message_pay
        });
    }

    getCode = (query) => {
        const search = new URLSearchParams(query);
        return search.get('code');
    }

    handleChangeSelect = (selected) => {
        this.setState({ location: selected });
    }

    handleChangeSelectTransport = (selected) => {
        this.setState({ transport: selected });
    }

    handleChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;
        this.setState({ [name]: value });
    }

    checkStatus = (status) => {
        if (status === 'finished' || status === 'cancelled' || status === '') {
            return true;
        }
        return false;
    }

    handleSave = async (event) => {
        event.preventDefault();
        const { location, day, arrive_time, leave_time, title, transport } = this.state;
        if (this.checkRoute()) {
            try {
                const item = {
                    id: parseInt(this.props.match.params.id),
                    arrive_time,
                    leave_time,
                    day: parseInt(day),
                    title: title,
                    idLocation: location.id,
                    idTransport: transport.id,
                    location,
                    transport
                }
                const route = await apiPost('/route/update', item);
                if (!this.props.listRoute) {
                    try {
                        let listRoute = await apiGet('/route/getAll');
                        this.props.getListRoute(listRoute.data.data);
                    } catch (error) {
                        console.log(error);
                    }
                } else {
                    await this.props.editRoute(item);
                }
                this.setState({ success: true });
            } catch (error) {
                console.log(error);
            }
        } else {
            this.setState({ error: true })
        }
    }

    handleOpenModalPay = (event) => {
        event.preventDefault();
        this.setState({ modalPayIsOpen: true });
    }

    handleOpenModalCancelRequest = (event) => {
        event.preventDefault();
        this.setState({ modalCancelRequestIsOpen: true });
    }

    handleOpenModalRefund = (event) => {
        event.preventDefault();
        this.setState({ modalRefundIsOpen: true });
    }

    handleOpenRemoveRequest = (event) => {
        event.preventDefault();
        this.setState({ modalRemoveRequest: true });
    }

    handleCloseRemoveRequest = () => {
        this.setState({ modalRemoveRequest: false });
    }

    handleCloseRefundModal = () => {
        this.setState({ modalRefundIsOpen: false });
    }

    handleOncloseModalPay = () => {
        this.setState({ modalPayIsOpen: false });
    }

    handleCloseModalCancelRequest = () => {
        this.setState({ modalCancelRequestIsOpen: false });
    }

    handleCloseModalUpdatePassenger = () => {
        this.setState({
            modalUpdatePassengerIsOpen: false,
            passengerUpdate: null
        });
    }

    handleCloseModalUpdateContactInfo = () => {
        this.setState({ modalUpdateContactInfoIsOpen: false, contactInfoUpdate: null });
    }

    openUpdatePassenger = (passenger) => {
        this.setState({ passengerUpdate: passenger, modalUpdatePassengerIsOpen: true });
    }

    openUpdateContactInfo = (contactInfo) => {
        this.setState({ modalUpdateContactInfoIsOpen: true, contactInfoUpdate: contactInfo });
    }

    handleOpenModalChangeDate = () => {
        this.setState({ modalChangeDateIsOpen: true });
    }

    handleOpenModalChangeRefundPeople = () => {
        this.setState({ modalChangeRefundPeopleIsOpen: true });
    }

    handleCloseChangeDateModal = () => {
        this.setState({ modalChangeDateIsOpen: false });
    }

    handleCloseModalChangeRefundPeople = () => {
        this.setState({ modalChangeRefundPeopleIsOpen: false });
    }

    hideSuccessAlert = () => {
        this.reRender();
        this.handleOncloseModalPay();
        this.handleCloseRefundModal();
        this.handleCloseModalUpdatePassenger();
        this.handleCloseModalUpdateContactInfo();
        this.handleCloseModalCancelRequest();
        this.handleCloseChangeDateModal();
        this.handleCloseRemoveRequest();
        this.handleCloseModalChangeRefundPeople();
        this.setState({ success: false });
    }

    hideFailAlert = () => {
        this.setState({ error: false });
    }

    reRender = async () => {
        try {
            const { code } = this.props.match.params;
            const detail = await apiGet(`/book_tour/getHistoryBookTourByCode/${code}?tour=true&isAdmin=true`);
            let bookTourDetail = detail.data.data;
            this.updateState(bookTourDetail);
        } catch (error) {
            console.log(error);
        }
    }

    handleUpdatePassenger = async (passenger) => {
        if (passenger) {
            try {
                passenger.fk_type_passenger = parseInt(passenger.type_passenger, 10);
                const passengerUpdate = await apiPost('/book_tour/updatePassenger', { ...passenger });
                this.setState({ success: true });
            } catch (error) {
                this.setState({ error: true });
            }
        } else {
            this.setState({ error: true });
        }
    }

    handleUpdateContactInfo = async (contactInfo) => {
        if (contactInfo) {
            try {
                const contactInfoUpdate = await apiPost('/book_tour/updateContactInfo', { ...contactInfo });
                this.setState({ success: true });
            } catch (error) {
                this.setState({ error: true });
            }
        } else {
            this.setState({ error: true });
        }
    }

    handlePayment = (flag) => {
        if (flag) {
            this.setState({ success: true });
        } else {
            this.setState({ error: true });
        }
    }

    handleConfirmRequest = (result) => {
        if (result) {
            this.setState({ success: true });
        } else {
            this.setState({ error: true });
        }
    }

    handleChangeDate = (result) => {
        if (result) {
            this.setState({ success: true });
        } else {
            this.setState({ error: true });
        }
    }

    handleChangeRefundPeople = (result) => {
        if (result) {
            this.setState({ success: true });
        } else {
            this.setState({ error: true });
        }
    }

    handleRemoveRequest = (result) => {
        if (result) {
            this.setState({ success: true });
        } else {
            this.setState({ error: true });
        }
    }

    handleRefundMoney = (result) => {
        if (result) {
            this.setState({ success: true });
        } else {
            this.setState({ error: true });
        }
    }

    handleRefund = (info) => {
        this.setState({ confirmRefund: true, refundCode: info.code });
    }

    handleConfirmRefund = async () => {
        try {
            const refund = await apiPost('/book_tour/unpayBookTour', { code: this.state.refundCode });
            this.reRender();
            this.setState({ confirmRefund: false, refundCode: '' });
        } catch (error) {

        }
    }

    handleConfirmReq = async () => {
        try {
            const confirm = await apiPost('/book_tour/cancelBookTour', { code: this.state.cancelCode });
            this.reRender();
            this.setState({ confirmCancelRequest: false, cancelCode: '' });
        } catch (error) {

        }
    }

    handleCancelReq = () => {
        this.setState({ confirmCancelRequest: false, cancelCode: '' });
    }

    handlePageClick = (data) => {
        this.setState({ page: data.selected + 1 });
    }

    handlePageClickSearch = (data) => {
        this.setState({ pageSearch: data.selected + 1 });
    }

    handleSearchPassenger = (listPassenger, keySearch) => {
        if (keySearch !== '' && listPassenger.length > 0) {
            return listPassenger.filter(item => matchString(item.phone, keySearch) || matchString(item.fullname, keySearch) || matchString(item.id.toString(), keySearch));
        }
        return listPassenger;
    }

    handleChangeCancelChecked = (event) => {
        this.setState({ cancelChecked: !this.state.cancelChecked, paymentChecked: false });
    }

    handleChangePaymentChecked = (event) => {
        this.setState({ paymentChecked: !this.state.paymentChecked, cancelChecked: false });
    }

    render() {
        const { bookTourHistory, tourTurn, tour } = this.state;
        const columnHistory = [
            {
                Header: "ID",
                accessor: "id",
                Cell: props => {
                    return <p>#{props.original.id}</p>
                },
                style: { textAlign: 'center' },
                width: 90,
                maxWidth: 95,
                minWidth: 85
            },
            {
                Header: "Tên",
                accessor: "fullname",
                style: { textAlign: 'center' }
            },
            {
                Header: "Số điện thoại",
                accessor: "phone",
                style: { textAlign: 'center' },
                // width: 130,
                // maxWidth: 130,
                // minWidth: 130
            },
            {
                Header: "Giới tính",
                accessor: "sex",
                Cell: props => {
                    return <p>{getSex(props.original.sex)}</p>
                },
                style: { textAlign: 'center' }
            },
            {
                Header: "Loại hành khách",
                accessor: "type_passenger.name_vi",
                style: { textAlign: 'center' },
                // width: 80,
                // maxWidth: 90,
                // minWidth: 70
            },
            {
                Header: props => <i className="fa fa-pencil" />,
                Cell: props => {
                    if (this.checkStatus(this.state.status)) {
                        return <button className="btn btn-xs btn-success disabled" >
                            <i className="fa fa-pencil" />
                        </button>;
                    }
                    return <button className="btn btn-xs btn-success"
                        onClick={() => this.openUpdatePassenger(props.original)} >
                        <i className="fa fa-pencil" />
                    </button>;
                },
                style: { textAlign: 'center' },
                width: 60,
                maxWidth: 60,
                minWidth: 60
            },
        ];
        return (
            <div style={{ minHeight: '100vh' }} className="content-wrapper">

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
                    title="Đã Có Lỗi Xảy Ra!"
                    onConfirm={this.hideFailAlert}>
                    Vui Lòng Kiểm Tra Lại...
                </SweetAlert>}

                {this.state.confirmRefund && <SweetAlert
                    warning
                    confirmBtnText="Confirm"
                    confirmBtnBsStyle="danger"
                    title="Refund money"
                    onConfirm={this.handleConfirmRefund} >
                    Vui lòng kiểm tra cẩn thận!!!
                </SweetAlert>}

                {this.state.confirmCancelRequest && <SweetAlert
                    warning
                    showCancel
                    cancelBtnText="Hủy"
                    confirmBtnText="Đồng ý"
                    confirmBtnBsStyle="danger"
                    cancelBtnBsStyle="default"
                    title="Chấp nhận yêu cầu hủy đặt tour!!!!"
                    onConfirm={this.handleConfirmReq}
                    onCancel={this.handleCancelReq} >
                    Vui lòng kiểm tra cẩn thận!!!
                </SweetAlert>}

                <Modal
                    open={this.state.modalPayIsOpen}
                    onClose={this.handleOncloseModalPay}
                    center
                    styles={{ 'modal': { width: '1280px' } }}
                    blockScroll={true} >
                    {this.state.bookTourDetail && <Payment
                        handlePayment={this.handlePayment}
                        code={this.state.code}
                        totalPay={this.state.totalPay}
                        contactInfo={this.state.contactInfo}
                    />}
                </Modal>

                <Modal
                    open={this.state.modalCancelRequestIsOpen}
                    onClose={this.handleCloseModalCancelRequest}
                    center
                    styles={{ 'modal': { width: '1280px' } }}
                    blockScroll={true} >
                    {this.state.bookTourDetail && <CancelRequest
                        handleConfirmRequest={this.handleConfirmRequest}
                        code={this.state.code}
                        message={this.state.message}
                        status={this.state.status}
                        startDate={this.state.tourTurn.start_date}
                        tour={this.state.tourTurn.tour.name}
                        totalPay={this.state.totalPay}
                        holiday={this.state.tourTurn.isHoliday}
                        contactInfo={this.state.contactInfo}
                    />}
                </Modal>

                <Modal
                    open={this.state.modalUpdatePassengerIsOpen}
                    onClose={this.handleCloseModalUpdatePassenger}
                    center
                    styles={{ 'modal': { width: '1280px' } }}
                    blockScroll={true} >
                    {this.state.passengerUpdate && <PassengerUpdate
                        handleUpdatePassenger={this.handleUpdatePassenger}
                        passenger={this.state.passengerUpdate}
                    />}
                </Modal>

                <Modal
                    open={this.state.modalUpdateContactInfoIsOpen}
                    onClose={this.handleCloseModalUpdateContactInfo}
                    center
                    styles={{ 'modal': { width: '1280px' } }}
                    blockScroll={true} >
                    {this.state.contactInfoUpdate && <ContactInfoUpdate
                        handleUpdateContactInfo={this.handleUpdateContactInfo}
                        contactInfo={this.state.contactInfoUpdate}
                    />}
                </Modal>

                <Modal
                    open={this.state.modalChangeDateIsOpen}
                    onClose={this.handleCloseChangeDateModal}
                    center
                    styles={{ 'modal': { width: '1280px' } }}
                    blockScroll={true} >
                    {this.state.message && <ChangeDate
                        handleChangeDate={this.handleChangeDate}
                        id={this.state.message.id}
                        period={this.state.message.refund_period}
                        fromDate={this.state.message.confirm_time}
                    />}
                </Modal>

                <Modal
                    open={this.state.modalChangeRefundPeopleIsOpen}
                    onClose={this.handleCloseModalChangeRefundPeople}
                    center
                    styles={{ 'modal': { width: '1280px' } }}
                    blockScroll={true} >
                    {this.state.message && <ChangeRefundPeople
                        handleChangeRefundPeople={this.handleChangeRefundPeople}
                        people={this.state.message.refund_message}
                        contactInfo={this.state.contactInfo}
                        id={this.state.message.id}
                    />}
                </Modal>

                <Modal
                    open={this.state.modalRemoveRequest}
                    onClose={this.handleCloseRemoveRequest}
                    center
                    styles={{ 'modal': { width: '1280px' } }}
                    blockScroll={true} >
                    {this.state.message && <RemoveRequest
                        handleRemoveRequest={this.handleRemoveRequest}
                        id={this.state.message.id}
                    />}
                </Modal>

                <Modal
                    open={this.state.modalRefundIsOpen}
                    onClose={this.handleCloseRefundModal}
                    center
                    styles={{ 'modal': { width: '1280px' } }}
                    blockScroll={true} >
                    {this.state.message && <Refund
                        handleRefundMoney={this.handleRefundMoney}
                        code={this.state.code}
                        message={this.state.message}
                        people={this.state.message.refund_message}
                        status={this.state.status}
                        startDate={this.state.tourTurn.start_date}
                        tour={this.state.tourTurn.tour.name}
                        totalPay={this.state.totalPay}
                        holiday={this.state.tourTurn.isHoliday}
                        contactInfo={this.state.contactInfo}
                    />}
                </Modal>

                <section className="content-header">
                    <div style={{
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        marginTop: '6vh',
                        marginLeft: '5%'
                    }}
                        className="right_header">
                        <i
                            onClick={() => this.props.history.push(`/book-tour/${this.state.idTourTurn}`)}
                            title="quay về trang trước"
                            style={{
                                fontSize: '35px',
                                marginBottom: '2px',
                                marginRight: '15px',
                                marginTop: '10px',
                                color: '#6c757d',
                                cursor: 'pointer'
                            }}
                            className="fa fa-arrow-left pull-left"
                        />
                    </div>
                    <h1> Thông Tin Chi Tiết Đặt Tour <i>#{this.state.id}</i> </h1>
                    <div className="right_header">
                        {this.state.status === 'paid' && <i
                            onClick={() => window.open(`/print/bill-payment/${this.state.code}`, '_blank')}
                            style={{
                                fontSize: '35px',
                                marginBottom: '2px',
                                marginRight: '15px',
                                marginTop: '10px',
                                color: '#3c8dbc',
                                cursor: 'pointer'
                            }}
                            className="fa fa-print pull-right"
                            title="in hóa đơn thanh toán"
                        />}
                        {this.state.status === 'refunded' && <i
                            onClick={() => window.open(`/print/bill-cancel-booking/${this.state.code}`, '_blank')}
                            style={{
                                fontSize: '35px',
                                marginBottom: '2px',
                                marginRight: '15px',
                                marginTop: '10px',
                                color: '#3c8dbc',
                                cursor: 'pointer'
                            }}
                            className="fa fa-print pull-right"
                            title="in hóa đơn hoàn tiền"
                        />}
                    </div>
                </section>
                <section className="content">
                    {/* <div className="row">
                        <div className="col-lg-12 col-xs-12">
                            <h2>Thông Tin Người Đặt và Đặt Tour #{this.state.code}</h2>
                        </div>
                    </div> */}
                    <div className="row">
                        <div className="col-lg-12 col-xs-12">
                            <div className="col-lg-6 col-xs-6">
                                <div style={{ fontSize: '16px', paddingLeft: '0px' }} className="form-group">
                                    <label className="col-sm-4 control-label">Mã đặt tour</label>
                                    <label className="col-sm-8 control-label">
                                        {this.state.code}
                                    </label>
                                </div>
                                <div style={{ fontSize: '16px', paddingLeft: '0px' }} className="form-group">
                                    <label className="col-sm-4 control-label">Người đặt tour</label>
                                    <label className="col-sm-6 control-label">
                                        {this.state.contactInfo ? this.state.contactInfo.fullname : ''}
                                    </label>
                                    <label className="col-sm-2">
                                        {!this.checkStatus(this.state.status) && <i
                                            title="chỉnh sửa thông tin người đặt"
                                            onClick={() => this.openUpdateContactInfo(this.state.contactInfo)}
                                            style={{ cursor: 'pointer' }}
                                            className="fa fa-pencil" />}
                                    </label>
                                </div>
                                <div style={{ fontSize: '16px', paddingLeft: '0px' }} className="form-group">
                                    <label className="col-sm-4 control-label">CMND/Passport</label>
                                    <label className="col-sm-8 control-label">
                                        {this.state.contactInfo ? this.state.contactInfo.passport : ''}
                                    </label>
                                </div>
                                <div style={{ fontSize: '16px', paddingLeft: '0px' }} className="form-group">
                                    <label className="col-sm-4 control-label">Số điện thoại</label>
                                    <label className="col-sm-8 control-label">
                                        {this.state.contactInfo ? this.state.contactInfo.phone : ''}
                                    </label>
                                </div>
                                <div style={{ fontSize: '16px', paddingLeft: '0px' }} className="form-group">
                                    <label className="col-sm-4 control-label">Email</label>
                                    <label className="col-sm-8 control-label">
                                        {this.state.contactInfo ? this.state.contactInfo.email : ''}
                                    </label>
                                </div>
                                <div style={{ fontSize: '16px', paddingLeft: '0px' }} className="form-group">
                                    <label className="col-sm-4 control-label">Tour</label>
                                    <label className="col-sm-8 control-label">
                                        {this.state.tourTurn ? this.state.tourTurn.tour.name : ''}
                                    </label>
                                </div>
                                <div style={{ fontSize: '16px', paddingLeft: '0px' }} className="form-group">
                                    <label className="col-sm-4 control-label">Mã chuyến đi</label>
                                    <label className="col-sm-8 control-label">
                                        {this.state.tourTurn ? this.state.tourTurn.code : ''}
                                    </label>
                                </div>
                                <div style={{ fontSize: '16px', paddingLeft: '0px' }} className="form-group">
                                    <label className="col-sm-4 control-label">Ngày khởi hành</label>
                                    <label className="col-sm-8 control-label">
                                        {this.state.tourTurn ? moment(this.state.tourTurn.start_date).format('DD/MM/YYYY') : ''}
                                    </label>
                                </div>
                                <div style={{ fontSize: '16px', paddingLeft: '0px' }} className="form-group">
                                    <label className="col-sm-4 control-label">Ngày kết thúc</label>
                                    <label className="col-sm-8 control-label">
                                        {this.state.tourTurn ? moment(this.state.tourTurn.end_date).format('DD/MM/YYYY') : ''}
                                    </label>
                                </div>
                                <div style={{ fontSize: '16px', paddingLeft: '0px' }} className="form-group">
                                    <label className="col-sm-4 control-label">Giá ban đầu</label>
                                    <label className="col-sm-8 control-label">
                                        {this.state.tourTurn ? formatCurrency(this.state.tourTurn.price) : ''} VND
                                    </label>
                                </div>
                                <div style={{ fontSize: '16px', paddingLeft: '0px' }} className="form-group">
                                    <label className="col-sm-4 control-label">Giảm</label>
                                    <label className="col-sm-8 control-label">
                                        {this.state.tourTurn ? this.state.tourTurn.discount : ''} %
                                    </label>
                                </div>
                                {this.state.typePassenger &&
                                    this.state.typePassenger.map((type, index) => {
                                        return <div key={index} style={{ fontSize: '16px', paddingLeft: '0px' }} className="form-group">
                                            <label className="col-sm-4 control-label">Giá {type.name_vi}</label>
                                            <label className="col-sm-8 control-label">
                                                {formatCurrency(type.price)} VND/Vé
                                        </label>
                                        </div>
                                    })
                                }
                            </div>
                            <div className="col-lg-6 col-xs-6">
                                {this.state.typePassenger &&
                                    this.state.typePassenger.map((type, i) => {
                                        return <div key={i} style={{ fontSize: '16px', paddingLeft: '0px' }} className="form-group">
                                            <label className="col-sm-4 control-label">Số {type.name_vi}</label>
                                            <label className="col-sm-8 control-label">
                                                {type.num_passenger}
                                            </label>
                                        </div>
                                    })
                                }
                                <div style={{ fontSize: '16px', paddingLeft: '0px' }} className="form-group">
                                    <label className="col-sm-4 control-label">Tổng tiền</label>
                                    <label className="col-sm-8 control-label">
                                        {formatCurrency(this.state.totalPay)} VND
                                    </label>
                                </div>
                                {this.state.paymentMethod && <div style={{ fontSize: '16px', paddingLeft: '0px' }} className="form-group">
                                    <label className="col-sm-4 control-label">Thanh toán</label>
                                    <label className="col-sm-8 control-label">
                                        {getPaymentType(this.state.paymentMethod.name)}
                                    </label>
                                </div>}
                                <div style={{ fontSize: '16px', paddingLeft: '0px' }} className="form-group">
                                    <label className="col-sm-4 control-label">Trạng thái</label>
                                    <label className="col-sm-8 control-label">
                                        <span style={{ backgroundColor: getStatusItem(this.state.status).colorStatus }} className={`label disabled`} >
                                            {getStatusItem(this.state.status).textStatus}
                                        </span>
                                    </label>
                                </div>

                                {/* pending_cancel */}
                                {(this.state.status === 'pending_cancel' && this.state.message) && <>
                                    <div style={{ fontSize: '16px', paddingLeft: '0px' }} className="form-group">
                                        <label className="col-sm-4 control-label">Chú thích hủy tour</label>
                                        <label className="col-sm-8 control-label">
                                            {this.state.message.request_message !== '' ? this.state.message.request_message : 'không có'}
                                        </label>
                                    </div></>}

                                {/* confirm_cancel */}
                                {(this.state.status === 'confirm_cancel' && this.state.message) && <>
                                    <div style={{ fontSize: '16px', paddingLeft: '0px' }} className="form-group">
                                        <label className="col-sm-4 control-label">Chú thích hủy tour</label>
                                        <label className="col-sm-8 control-label">
                                            {this.state.message.request_message !== '' ? this.state.message.request_message : 'không có'}
                                        </label>
                                    </div>
                                    <div style={{ fontSize: '16px', paddingLeft: '0px' }} className="form-group">
                                        <label className="col-sm-4 control-label">Xác nhận</label>
                                        <label className="col-sm-8 control-label">
                                            {moment(this.state.message.confirm_time).format('MM/DD/YYYY HH:MM')}
                                        </label>
                                    </div>
                                    <div style={{ fontSize: '16px', paddingLeft: '0px' }} className="form-group">
                                        <label className="col-sm-4 control-label">Tiền hoàn trả</label>
                                        <label className="col-sm-8 control-label">
                                            {formatCurrency(this.state.message.money_refunded)} VND
                                        </label>
                                    </div>
                                    <div style={{ fontSize: '16px', paddingLeft: '0px' }} className="form-group">
                                        <label className="col-sm-4 control-label">Hạn hoàn tiền</label>
                                        <label className="col-sm-6 control-label">
                                            {moment(dateFns.addDays(new Date(this.state.message.confirm_time), 3)).format('MM/DD/YYYY')} đến {moment(this.state.message.refund_period).format('MM/DD/YYYY')}
                                        </label>
                                        <label className="col-sm-2">
                                            <i
                                                title="Chỉnh sửa ngày hẹn"
                                                onClick={this.handleOpenModalChangeDate}
                                                style={{ cursor: 'pointer' }}
                                                className="fa fa-pencil" />
                                        </label>
                                    </div>
                                    <div style={{ fontSize: '16px', paddingLeft: '0px' }} className="form-group">
                                        <label className="col-sm-4 control-label">Người Nhận tiền</label>
                                        <label className="col-sm-6 control-label">
                                            {this.state.message.refund_message.name}
                                        </label>
                                        <label className="col-sm-2">
                                            <i
                                                title="Chỉnh sửa người nhận tiền"
                                                onClick={this.handleOpenModalChangeRefundPeople}
                                                style={{ cursor: 'pointer' }}
                                                className="fa fa-pencil" />
                                        </label>
                                    </div>
                                    <div style={{ fontSize: '16px', paddingLeft: '0px' }} className="form-group">
                                        <label className="col-sm-4 control-label">CMND/Passport</label>
                                        <label className="col-sm-8 control-label">
                                            {this.state.message.refund_message.passport}
                                        </label>
                                    </div>
                                    {(this.state.message.refund_message.note && this.state.message.refund_message.note !== '') &&
                                        <div style={{ fontSize: '16px', paddingLeft: '0px' }} className="form-group">
                                            <label className="col-sm-4 control-label">Chú thích</label>
                                            <label className="col-sm-8 control-label">
                                                {this.state.message.refund_message.note}
                                            </label>
                                        </div>}
                                    </>}

                                {/* paid */}
                                {(this.state.status === 'paid' && this.state.messagePayment) && <>
                                    <div style={{ fontSize: '16px', paddingLeft: '0px' }} className="form-group">
                                        <label className="col-sm-4 control-label">Người thanh toán</label>
                                        <label className="col-sm-8 control-label">
                                            {this.state.messagePayment.name}
                                        </label>
                                    </div>
                                    <div style={{ fontSize: '16px', paddingLeft: '0px' }} className="form-group">
                                        <label className="col-sm-4 control-label">CMND/Passport</label>
                                        <label className="col-sm-8 control-label">
                                            {this.state.messagePayment.passport}
                                        </label>
                                    </div>
                                    {this.state.messagePayment.note !== '' && <div style={{ fontSize: '16px', paddingLeft: '0px' }} className="form-group">
                                        <label className="col-sm-4 control-label">Chú thích</label>
                                        <label className="col-sm-8 control-label">
                                            {this.state.messagePayment.note}
                                        </label>
                                    </div>}
                                    </>}

                                {/* refunded */}
                                {(this.state.status === 'refunded' && this.state.message) && <>
                                    <div style={{ fontSize: '16px', paddingLeft: '0px' }} className="form-group">
                                        <label className="col-sm-4 control-label">Chú thích hủy tour</label>
                                        <label className="col-sm-8 control-label">
                                            {this.state.message.request_message !== '' ? this.state.message.request_message : 'không có'}
                                        </label>
                                    </div>
                                    <div style={{ fontSize: '16px', paddingLeft: '0px' }} className="form-group">
                                        <label className="col-sm-4 control-label">Xác nhận</label>
                                        <label className="col-sm-8 control-label">
                                            {moment(this.state.message.confirm_time).format('MM/DD/YYYY HH:MM')}
                                        </label>
                                    </div>
                                    <div style={{ fontSize: '16px', paddingLeft: '0px' }} className="form-group">
                                        <label className="col-sm-4 control-label">Tiền hoàn trả</label>
                                        <label className="col-sm-8 control-label">
                                            {formatCurrency(this.state.message.money_refunded)} VND
                                        </label>
                                    </div>
                                    {/* <div style={{ fontSize: '16px', paddingLeft: '0px' }} className="form-group">
                                        <label className="col-sm-4 control-label">Hạn hoàn tiền</label>
                                        <label className="col-sm-6 control-label">
                                            {moment(dateFns.addDays(new Date(this.state.message.confirm_time), 3)).format('MM/DD/YYYY')} đến {moment(this.state.message.refund_period).format('MM/DD/YYYY')}
                                        </label>
                                    </div> */}
                                    {this.state.message.refund_message && <> <div style={{ fontSize: '16px', paddingLeft: '0px' }} className="form-group">
                                        <label className="col-sm-4 control-label">Người Nhận tiền</label>
                                        <label className="col-sm-8 control-label">
                                            {this.state.message.refund_message.name}
                                        </label>
                                    </div>
                                        <div style={{ fontSize: '16px', paddingLeft: '0px' }} className="form-group">
                                            <label className="col-sm-4 control-label">CMND/Passport</label>
                                            <label className="col-sm-8 control-label">
                                                {this.state.message.refund_message.passport}
                                            </label>
                                        </div>
                                        <div style={{ fontSize: '16px', paddingLeft: '0px' }} className="form-group">
                                            <label className="col-sm-4 control-label">Thời gian nhận tiền</label>
                                            <label className="col-sm-8 control-label">
                                                {moment(this.state.message.refunded_time).format('MM/DD/YYYY')}
                                            </label>
                                        </div> </>
                                        // {this.state.message.refund_message.note !== '' && <div style={{ fontSize: '16px', paddingLeft: '0px' }} className="form-group">
                                        //     <label className="col-sm-4 control-label">Chú thích</label>
                                        //     <label className="col-sm-8 control-label">
                                        //         {this.state.message.refund_message.note}
                                        //     </label>
                                        // </div>} 
                                    }

                                    </>}

                                {/* cancelled */}
                                {(this.state.status === 'cancelled' && this.state.message) && <>
                                    <div style={{ fontSize: '16px', paddingLeft: '0px' }} className="form-group">
                                        <label className="col-sm-4 control-label">Người hủy</label>
                                        <label className="col-sm-8 control-label">
                                            {this.state.message.request_offline_person.name}
                                        </label>
                                    </div>
                                    <div style={{ fontSize: '16px', paddingLeft: '0px' }} className="form-group">
                                        <label className="col-sm-4 control-label">CMND/Passport</label>
                                        <label className="col-sm-8 control-label">
                                            {this.state.message.request_offline_person.passport}
                                        </label>
                                    </div>
                                    {(this.state.message.request_offline_person.note && this.state.message.request_offline_person.note !== '') &&
                                        <div style={{ fontSize: '16px', paddingLeft: '0px' }} className="form-group">
                                            <label className="col-sm-4 control-label">Chú thích</label>
                                            <label className="col-sm-8 control-label">
                                                {this.state.message.request_offline_person.note}
                                            </label>
                                        </div>}
                                    </>}

                                {/* finished */}
                                {(this.state.status === 'finished' && this.state.messagePayment) && <>
                                    <div style={{ fontSize: '16px', paddingLeft: '0px' }} className="form-group">
                                        <label className="col-sm-4 control-label">Người thanh toán</label>
                                        <label className="col-sm-8 control-label">
                                            {this.state.messagePayment.name}
                                        </label>
                                    </div>
                                    <div style={{ fontSize: '16px', paddingLeft: '0px' }} className="form-group">
                                        <label className="col-sm-4 control-label">CMND/Passport</label>
                                        <label className="col-sm-8 control-label">
                                            {this.state.messagePayment.passport}
                                        </label>
                                    </div>
                                    {(this.state.messagePayment.note && this.state.messagePayment.note !== '') &&
                                        <div style={{ fontSize: '16px', paddingLeft: '0px' }} className="form-group">
                                            <label className="col-sm-4 control-label">Chú thích</label>
                                            <label className="col-sm-8 control-label">
                                                {this.state.messagePayment.note}
                                            </label>
                                        </div>}
                                    </>}

                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12 col-xs-12">
                            <form className="form-horizontal">
                                <div className="box-body book_tour_detail-information">
                                    <div className="manager_btn">
                                        {getPaymentChecked(this.state.status) && <button
                                            style={{ right: '130px' }}
                                            onClick={this.handleOpenModalPay}
                                            className="btn btn-xs btn-info custom-btn-infor" >
                                            Thanh Toán
                                        </button>}
                                        {this.state.status === 'pending_cancel' && <button
                                            style={{ right: '130px' }}
                                            onClick={this.handleOpenRemoveRequest}
                                            className="btn btn-xs btn-info custom-btn-infor" >
                                            Hủy Yêu Cầu
                                        </button>}
                                        {getCancelChecked(this.state.status) && <button
                                            onClick={this.handleOpenModalCancelRequest}
                                            className="btn btn-xs btn-danger custom-btn-danger" >
                                            Xác Nhận Hủy
                                        </button>}
                                        {this.state.status === 'confirm_cancel' && <button
                                            onClick={this.handleOpenModalRefund}
                                            className="btn btn-xs btn-danger custom-btn-danger" >
                                            Hoàn Tiền
                                        </button>}
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12 col-xs-12">
                            <form className="form-horizontal">
                                <div className="box-body book_tour_detail-book_tour_history">
                                    <div className="book_tour_detail-book_tour_history-title">
                                        <h2>Danh Sách Hành Khách</h2>
                                        <div style={{ top: '10px' }} className="search_box">
                                            <div className="search_icon">
                                                <i className="fa fa-search"></i>
                                            </div>
                                            <input
                                                type="text"
                                                onChange={this.handleChange}
                                                value={this.state.keySearch}
                                                name="keySearch"
                                                className="search_input"
                                                placeholder="Tìm kiếm..."
                                            />
                                        </div>
                                    </div>
                                    <div className="container">
                                        <div className="row">
                                            <div className="col-xs-12 book_tour_history">
                                                <ReactTable
                                                    columns={columnHistory}
                                                    data={this.handleSearchPassenger(this.state.passengers, this.state.keySearch)}
                                                    defaultPageSize={5}
                                                    noDataText={'Vui lòng đợi...'} >
                                                </ReactTable>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        info: state.infoLocation,
        allType: state.allType,
        allLocation: state.allLocation,
        listTour: state.listTour,
        listTransport: state.listTransport,
        routeDetail: state.routeDetail,
        listRoute: state.listRoute,
        bookTourTurnDetail: state.bookTourTurnDetail
    }
}

const mapDispatchToProps = (dispatch, action) => {
    return {
        changeLocationInfo: (info) => dispatch(actions.changeLocationInfo(info)),
        getListTypeLocation: (type) => dispatch(actions.getListTypeLocation(type)),
        getListLocation: (locations) => dispatch(actions.getListLocation(locations)),
        createType: (type) => dispatch(actions.createType(type)),
        editType: (type) => dispatch(actions.editType(type)),
        getListTour: (tour) => dispatch(actions.getListTour(tour)),
        getListTransport: (transport) => dispatch(actions.getListTransport(transport)),
        getRouteById: (route) => dispatch(actions.getRouteById(route)),
        editRoute: (route) => dispatch(actions.editRoute(route)),
        getListRoute: (route) => dispatch(actions.getListRoute(route)),
        getBookTourTurnById: (book) => dispatch(actions.getBookTourTurnById(book))
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateTourTurnComponent));