import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import _ from 'lodash';
import moment from 'moment';
import SweetAlert from 'react-bootstrap-sweetalert';
import Modal from 'react-responsive-modal';
import Select from 'react-select';
import * as actions from './../../../actions/index';
import { apiGet, apiPost } from '../../../services/api';
import {
    mergeBookHistory,
    filterBookHistory,
    formatCurrency,
    pagination,
    matchString,
    getStatusItem,
    getStatusTourTurn,
} from './../../../helper';
import CancelBooking from '../cancel-booking';
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
            modalCancelBookingIsOpen: false,
            bookingCancel: null
        }
    }

    async componentDidMount() {
        let bookTourTurnDetail = null;
        try {
            const { id } = this.props.match.params;
            const detail = await apiGet(`/book_tour/getBookTourHistoryByTourTurn/${id}`);
            bookTourTurnDetail = detail.data.data;
        } catch (error) {
            console.log(error);
        }
        const code = this.getCode(window.location.search);
        console.log(bookTourTurnDetail)
        this.updateState(bookTourTurnDetail, code);
    }

    updateState = (bookTourTurnDetail, code) => {
        this.setState({
            bookTourHistory: bookTourTurnDetail.book_tour_history,
            tourTurn: bookTourTurnDetail.tour_turn,
            tour: bookTourTurnDetail.tour_turn.tour,
            keySearch: code ? code : ''
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
            this.setState({
                error: true
            })
        }
    }

    handleCancel = (event) => {
        event.preventDefault();
        this.props.history.push('/book-tour/list');
    }

    checkRoute = () => {
        const { location, day, arriveTime, leaveTime, transport } = this.state;
        if (!location || !Number.isInteger(parseInt(day)) || parseInt(day) < 1 || !transport) {
            return false;
        }
        return true;

    }

    onHandleChangeArriveTime = (time) => {
        this.setState({
            arrive_time: time + ":00",
            save: false
        });
    }

    onHandleChangeleaveTime = (time) => {
        this.setState({
            leave_time: time + ":00",
            save: false
        });
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
        this.handleCloseModalCancelBooking();
        this.reRender();
        this.setState({ success: false });
    }

    hideFailAlert = () => {
        this.setState({ error: false });
    }

    reRender = async () => {
        try {
            const { id } = this.props.match.params;
            const detail = await apiGet(`/book_tour/getBookTourHistoryByTourTurn/${id}`);
            const bookTourTurnDetail = detail.data.data;
            this.updateState(bookTourTurnDetail);
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

    handleSearch = (listBookHistory, keySearch) => {
        if (keySearch !== '' && listBookHistory.length > 0) {
            return listBookHistory.filter(item => matchString(item.code, keySearch) || matchString(item.book_tour_contact_info.phone, keySearch) || matchString(item.book_tour_contact_info.email, keySearch) || matchString(item.book_tour_contact_info.fullname, keySearch) || matchString(item.id.toString(), keySearch));
        }
        return listBookHistory;
    }

    handleOpenModalCancelBooking = (booking) => {
        this.setState({ modalCancelBookingIsOpen: true, bookingCancel: booking });
    }

    handleCloseModalCancelBooking = () => {
        this.setState({ modalCancelBookingIsOpen: false, bookingCancel: null });
    }

    handleCancelBooking = (res) => {
        if (res) {
            this.setState({ success: true });
        } else {
            this.setState({ error: true });
        }
    }

    render() {
        const { bookTourHistory, tourTurn, tour } = this.state;
        console.log('tourTurn', tourTurn)
        const columnHistory = [
            {
                Header: "STT",
                Cell: props => <p>{props.index + 1}</p>,
                style: { textAlign: 'center' },
                sortable: false,
                resizable: false,
                filterable: false,
                width: 50,
                maxWidth: 50,
                minWidth: 50
            },
            {
                Header: "Mã đặt tour",
                accessor: "code",
                // Cell: props => {
                //     return <i>#{props.original.code}</i>
                // },
                style: { textAlign: 'left' },
                sortable: false,
                resizable: false,
                filterable: false,
                width: 100,
                maxWidth: 105,
                minWidth: 95
            },
            {
                Header: "Người liên hệ",
                accessor: "book_tour_contact_info.fullname",
                style: { textAlign: 'left', whiteSpace: 'unset' },
                sortable: false,
                resizable: false,
                filterable: false,
            },
            {
                Header: "Số điện thoại",
                accessor: "book_tour_contact_info.phone",
                style: { textAlign: 'center' },
                sortable: false,
                resizable: false,
                filterable: false,
                width: 130,
                maxWidth: 130,
                minWidth: 130
            },
            // {
            //     Header: "Email",
            //     accessor: "book_tour_contact_info.email",
            //     style: { textAlign: 'left', whiteSpace: 'unset' }
            // },
            {
                Header: "Số lượng",
                accessor: "num_passenger",
                style: { textAlign: 'center' },
                sortable: false,
                resizable: false,
                filterable: false,
                width: 80,
                maxWidth: 90,
                minWidth: 70
            },
            {
                Header: "Tổng tiền VND",
                accessor: "total_pay",
                Cell: props => {
                    return (<p>{formatCurrency(props.original.total_pay)}</p>)
                },
                style: { textAlign: 'center' },
                sortable: false,
                resizable: false,
                filterable: false,
                width: 110,
                maxWidth: 110,
                minWidth: 110
            },
            {
                Header: "Thời gian đặt",
                accessor: "book_time",
                Cell: props => {
                    return <p>{moment(props.original.book_time).format('DD/MM/YYYY')}</p>
                },
                style: { textAlign: 'center' },
                sortable: false,
                resizable: false,
                filterable: false,
                width: 130,
                maxWidth: 130,
                minWidth: 130
            },
            {
                Header: "Trạng thái",
                accessor: "status",
                Cell: props => {
                    const status = getStatusItem(props.original.status);
                    return <span style={{ backgroundColor: status.colorStatus }} className={`label disabled`} >
                        {status.textStatus}
                    </span>
                },
                style: { textAlign: 'left' },
                sortable: false,
                resizable: false,
                filterable: false,
                width: 110,
                maxWidth: 150,
                minWidth: 110
            },
            {
                Header: props => <i className="fa fa-eye" />,
                Cell: props => {
                    return <button
                        title="chi tiết"
                        className="btn btn-xs btn-info"
                        onClick={() => this.props.history.push(`/book-tour-detail/${props.original.code}`)} >
                        <i className="fa fa-eye" />
                    </button>
                },
                style: { textAlign: 'center' },
                sortable: false,
                resizable: false,
                filterable: false,
                width: 60,
                maxWidth: 60,
                minWidth: 60
            },
            {
                Header: props => <i className="fa fa-ban" />,
                Cell: props => {
                    const { status } = props.original;
                    if (this.state.tourTurn) {
                        const statusTT = getStatusTourTurn(tourTurn.start_date, tourTurn.end_date);
                        if ((status === 'pending_cancel' || status === 'paid' || status === 'booked') && statusTT.css === 'success') {
                            return <button
                                title="hủy booking"
                                className="btn btn-xs btn-danger"
                                onClick={() => this.handleOpenModalCancelBooking(props.original)} >
                                <i className="fa fa-ban" />
                            </button>;
                        }
                        return <button
                            title="hủy booking"
                            className="btn btn-xs btn-danger"
                            disabled >
                            <i className="fa fa-ban" />
                        </button>;
                    }
                    return null;
                },
                style: { textAlign: 'center' },
                sortable: false,
                resizable: false,
                filterable: false,
                width: 60,
                maxWidth: 60,
                minWidth: 60
            }
        ];
        const columns = [
            {
                Header: "ID",
                accessor: "id",
                style: { textAlign: 'center' },
                width: 60,
                maxWidth: 60,
                minWidth: 60
            },
            {
                Header: "NAME",
                accessor: "passenger.fullname",
                style: { textAlign: 'center' }
            },
            {
                Header: "TYPE",
                accessor: "passenger.type_passenger.name",
                style: { textAlign: 'center' },
                width: 100,
                maxWidth: 100,
                minWidth: 100
            },
            {
                Header: "CONTACT NAME",
                accessor: "book_tour_contact_info.fullname",
                style: { textAlign: 'center' }
            },
            {
                Header: "CONTACT PHONE",
                accessor: "book_tour_contact_info.phone",
                style: { textAlign: 'center' }
            },
            {
                Header: props => <i className="fa fa-pencil" />,
                Cell: props => {
                    if (props.original.status === 'cancelled') {
                        return <button className="btn btn-xs btn-success" disabled>
                            <i className="fa fa-pencil" />
                        </button>
                    }
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
            {
                Header: props => <i className="fa fa-trash" />,
                Cell: props => {
                    if (props.original.status === 'cancelled') {
                        return <button className="btn btn-xs btn-danger" disabled>
                            <i className="fa fa-trash" />
                        </button>
                    }
                    return <button className="btn btn-xs btn-danger"
                        onClick={() => this.handleEditRoute(props)} >
                        <i className="fa fa-trash" />
                    </button>
                },
                style: { textAlign: 'center' },
                width: 60,
                maxWidth: 60,
                minWidth: 60
            }
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
                    open={this.state.modalCancelBookingIsOpen}
                    onClose={this.handleCloseModalCancelBooking}
                    center
                    styles={{ 'modal': { width: '1280px' } }}
                    blockScroll={true} >
                    {this.state.modalCancelBookingIsOpen && <CancelBooking
                        tourTurn={this.state.tourTurn}
                        booking={this.state.bookingCancel}
                        tour={this.state.tour}
                        handleCancelBooking={this.handleCancelBooking}
                    />}
                </Modal>

                <section className="content-header content-header-page">
                    <h1> Thông Tin & Danh Sách Đặt Tour <i>#{this.props.match.params.id}</i> </h1>
                    <div className="right_header">
                        <i
                            onClick={() => window.open(`/print-passengers/${this.props.match.params.id}`, '_blank')}
                            style={{
                                fontSize: '35px',
                                marginBottom: '2px',
                                marginRight: '15px',
                                marginTop: '10px',
                                color: '#3c8dbc',
                                cursor: 'pointer'
                            }}
                            className="fa fa-print pull-right"
                            title="print"
                        />
                    </div>
                </section>
                <section className="content">
                    <div className="row">
                        <div className="col-lg-12 col-xs-12">
                            <form className="form-horizontal">
                                <div className="box-body book_tour_detail-information">
                                    <h2>Thông Tin Chuyến Đi</h2>
                                    <div className="box-body-main">
                                        <div className="box-body-left">
                                            <div className="">Tour</div>
                                            <div className="">Mã chuyến đi</div>
                                            <div className="">Giá</div>
                                            <div className="">Giảm</div>
                                            <div className="">Ngày bắt đầu</div>
                                            <div className="">Ngày kết thúc</div>
                                            <div className="">Số lượng</div>
                                        </div>
                                        <div className="box-body-right">
                                            <div className="">{tour ? tour.name : ''}</div>
                                            <div className="">{tourTurn ? tourTurn.code : ''}</div>
                                            <div className="">{tourTurn ? formatCurrency(tourTurn.price.toString()) + ' VND' : ''}</div>
                                            <div className="">{tourTurn ? tourTurn.discount : ''} %</div>
                                            <div className="">{tourTurn ? moment(tourTurn.start_date).format('DD/MM/YYYY') : ''}</div>
                                            <div className="">{tourTurn ? moment(tourTurn.end_date).format('DD/MM/YYYY') : ''}</div>
                                            <div className="">{tourTurn ? tourTurn.num_current_people : ''}/{tourTurn ? tourTurn.num_max_people : ''}</div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <form className="form-horizontal">
                                <div className="box-body book_tour_detail-book_tour_history">
                                    <div className="book_tour_detail-book_tour_history-title">
                                        <h2>Danh Sách Đặt Tour</h2>
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
                                                    data={this.handleSearch(this.state.bookTourHistory, this.state.keySearch)}
                                                    pageSizeOptions={[5, 10, 20, 25]}
                                                    defaultPageSize={5}
                                                    noDataText={'Vui lòng đợi...'}
                                                    previousText={'Trang trước'}
                                                    nextText={'Trang sau'}
                                                    pageText={'Trang'}
                                                    ofText={'/'}
                                                    rowsText={'dòng'} >
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