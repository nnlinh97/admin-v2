import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import _ from 'lodash';
import moment from 'moment';
import SweetAlert from 'react-bootstrap-sweetalert';
import Modal from 'react-responsive-modal';
import Select from 'react-select';
// import ReactPaginate from 'react-paginate';
import PassengerUpdate from './passenger-update';
import ContactInfoUpdate from './contact-info';
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
    getPaymentChecked
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
            tourTurn: null,
            tour: null,
            modalPayIsOpen: false,
            modalUpdatePassengerIsOpen: false,
            modalUpdateContactInfoIsOpen: false,
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
            paymentChecked: false
        }
    }

    async componentDidMount() {
        let bookTourDetail = null;
        try {
            const { code } = this.props.match.params;
            const detail = await apiGet(`/book_tour/getHistoryBookTourByCode/${code}?tour=true`);
            bookTourDetail = detail.data.data;
            this.updateState(bookTourDetail);
            console.log(bookTourDetail)
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

    handleOpenModalPay = (props) => {
        this.setState({
            modalPayIsOpen: true,
            bookPay: props
        });
    }

    handleCancelRequest = (code) => {
        this.setState({
            cancelCode: code,
            confirmCancelRequest: true
        });
    }

    handleOncloseModalPay = () => {
        this.setState({
            modalPayIsOpen: false,
            bookPay: null
        });
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

    hideSuccessAlert = () => {
        this.handleOncloseModalPay();
        this.handleCloseModalUpdatePassenger();
        this.handleCloseModalUpdateContactInfo();
        this.setState({ success: false })
    }

    hideFailAlert = () => {
        this.setState({ error: false });
    }

    reRender = async () => {
        try {
            const { code } = this.props.match.params;
            const detail = await apiGet(`/book_tour/getHistoryBookTourByCode/${code}?tour=true`);
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
                this.reRender();
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
                this.reRender();
                this.setState({ success: true });
            } catch (error) {
                this.setState({ error: true });
            }
        } else {
            this.setState({ error: true });
        }
    }

    handlePayment = async (flag) => {
        if (flag) {
            this.reRender();
            this.setState({ success: true });
        }
    }

    handleRefund = (info) => {
        console.log(info);
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
                accessor: "type_passenger.name",
                style: { textAlign: 'center' },
                // width: 80,
                // maxWidth: 90,
                // minWidth: 70
            },
            {
                Header: props => <i className="fa fa-pencil" />,
                Cell: props => {
                    return <button className="btn btn-xs btn-success"
                        onClick={() => this.openUpdatePassenger(props.original)} >
                        <i className="fa fa-pencil" />
                    </button>
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

                {/* <Modal
                    open={this.state.modalPayIsOpen}
                    onClose={this.handleOncloseModalPay}
                    center
                    styles={{ 'modal': { width: '1280px' } }}
                    blockScroll={true} >
                    {this.state.bookPay && <ViewDetail
                        handlePayment={this.handlePayment}
                        data={this.state.bookPay}
                        tourTurn={this.state.tourTurn}
                        tour={this.state.tour}
                    />}
                </Modal> */}
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
                </section>
                <section className="content">
                    <div className="row">
                        <div className="col-lg-12 col-xs-12">
                            <form className="form-horizontal">
                                <div className="box-body book_tour_detail-information">
                                    <h2>Thông Tin Người Đặt và Đặt Tour</h2>
                                    <i
                                        title="chỉnh sửa thông tin người đặt"
                                        onClick={() => this.openUpdateContactInfo(this.state.contactInfo)}
                                        style={{ cursor: 'pointer' }}
                                        className="fa fa-pencil" />
                                    <div className="box-body-main">
                                        <div className="box-body-left">
                                            <div className="">Tên</div>
                                            <div className="">Số điện thoại</div>
                                            <div className="">Email</div>
                                            <div className="">Tour</div>
                                            <div className="">Ngày bắt đầu</div>
                                            <div className="">Ngày kết thúc</div>
                                            <div className="">Giá/người</div>
                                            <div className="">Số người đi</div>
                                            <div className="">Tổng tiền</div>
                                            <div className="">Trạng thái</div>
                                        </div>
                                        <div className="box-body-right">
                                            <div className="">{this.state.contactInfo ? this.state.contactInfo.fullname : ''}</div>
                                            <div className="">{this.state.contactInfo ? this.state.contactInfo.phone : ''}</div>
                                            <div className="">{this.state.contactInfo ? this.state.contactInfo.email : ''}</div>
                                            <div className="">{this.state.tourTurn ? this.state.tourTurn.tour.name : ''}</div>
                                            <div className="">{this.state.tourTurn ? moment(this.state.tourTurn.start_date).format('DD/MM/YYYY') : ''}</div>
                                            <div className="">{this.state.tourTurn ? moment(this.state.tourTurn.end_date).format('DD/MM/YYYY') : ''}</div>
                                            <div className="">{this.state.tourTurn ? formatCurrency(this.state.tourTurn.price) : ''} VND</div>
                                            <div className="">{this.state.numPassengers}</div>
                                            <div className="">{formatCurrency(this.state.totalPay)} VND</div>
                                            <div className="">
                                                <label className={`label label-${getStatusItem(this.state.status).colorStatus} disabled`} >
                                                    {getStatusItem(this.state.status).textStatus}
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="manager_btn">
                                        {getPaymentChecked(this.state.status) && <button className="btn btn-xs btn-info custom-btn-infor" >
                                            Thanh Toán
                                        </button>}
                                        {getCancelChecked(this.state.status) && <button className="btn btn-xs btn-danger custom-btn-danger" >
                                            Hủy
                                        </button>}
                                    </div>
                                </div>
                            </form>
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