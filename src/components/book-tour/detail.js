import 'froala-editor/js/froala_editor.pkgd.min.js';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import * as actions from './../../actions/index';
import _ from 'lodash';
import moment from 'moment';
import DatePicker from "react-datepicker";
import TimePicker from 'react-time-picker';
import 'font-awesome/css/font-awesome.css';
import SweetAlert from 'react-bootstrap-sweetalert';
import { apiGet, apiPost } from '../../services/api';
import Select from 'react-select';
import { mergeBookHistory, filterBookHistory, formatCurrency } from './../../helper';
import Modal from 'react-responsive-modal';
import Payment from './payment';
import PassengerUpdate from './passenger-update';
import ContactInfoUpdate from './contact-info';

class CreateTourTurnComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            success: false,
            error: false,
            bookTourHistory: null,
            tourTurn: null,
            tour: null,
            modalPayIsOpen: false,
            modalUpdatePassengerIsOpen: false,
            modalUpdateContactInfoIsOpen: false,
            bookPay: null,
            passengerUpdate: null,
            contactInfoUpdate: null,
            confirmRefund: false,
            refundCode: ''
        }
    }

    async componentDidMount() {
        let { bookTourTurnDetail } = this.props;
        if (!bookTourTurnDetail) {
            try {
                const { id } = this.props.match.params;
                const detail = await apiGet(`/book_tour/getBookTourHistoryByTourTurn/${id}`);
                bookTourTurnDetail = detail.data.data;
                console.log(bookTourTurnDetail);
                await this.props.getBookTourTurnById(bookTourTurnDetail);
            } catch (error) {
                console.log(error);
            }
        }
        this.updateState(bookTourTurnDetail);
    }

    updateState = (bookTourTurnDetail) => {
        this.setState({
            bookTourHistory: bookTourTurnDetail.book_tour_history,
            tourTurn: bookTourTurnDetail.tour_turn,
            tour: bookTourTurnDetail.tour_turn.tour
        });
    }

    handleChangeSelect = (selected) => {
        this.setState({
            location: selected
        })
    }

    handleChangeSelectTransport = (selected) => {
        this.setState({
            transport: selected
        })
    }

    handleChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;
        this.setState({
            [name]: value
        })
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
            bookPay: props.original
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

    openUpdatePassenger = ({ passenger }) => {
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
            const { id } = this.props.match.params;
            const detail = await apiGet(`/book_tour/getBookTourHistoryByTourTurn/${id}`);
            const bookTourTurnDetail = detail.data.data;
            await this.props.getBookTourTurnById(bookTourTurnDetail);
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
        console.log(info);
        this.setState({ confirmRefund: true, refundCode: info.code });
    }

    handleConfirmRefund = async () => {
        try {
            const refund = await apiPost('/book_tour/unpayBookTour', { code: this.state.refundCode });
            this.reRender();
        } catch (error) {

        }
        this.setState({ confirmRefund: false, refundCode: '' });
    }

    render() {
        const { bookTourHistory, tourTurn, tour } = this.state;
        console.log(tourTurn);
        const bookHistory = mergeBookHistory(bookTourHistory);
        const columnHistory = [
            {
                Header: "ID",
                accessor: "id",
                sortable: true,
                filterable: true,
                style: {
                    textAlign: 'center'
                },
                width: 60,
                maxWidth: 60,
                minWidth: 60
            },
            {
                Header: "CONTACT NAME",
                accessor: "book_tour_contact_info.fullname",
                sortable: true,
                filterable: true,
                style: {
                    textAlign: 'center'
                }
            },
            {
                Header: "EMAIL",
                accessor: "book_tour_contact_info.email",
                sortable: true,
                filterable: true,
                style: {
                    textAlign: 'center'
                }
            },
            {
                Header: "PHONE",
                accessor: "book_tour_contact_info.phone",
                sortable: true,
                filterable: true,
                style: {
                    textAlign: 'center'
                },
                width: 130,
                maxWidth: 130,
                minWidth: 130
            },
            {
                Header: "NUM PASSENGER",
                accessor: "num_passenger",
                sortable: false,
                filterable: false,
                style: {
                    textAlign: 'center'
                },
                width: 125,
                maxWidth: 125,
                minWidth: 125
            },
            {
                Header: "TOTAL PAY",
                accessor: "total_pay",
                Cell: props => {
                    return (<p>{formatCurrency(props.original.total_pay)} VND</p>)
                },
                sortable: false,
                filterable: false,
                style: {
                    textAlign: 'center'
                },
                width: 130,
                maxWidth: 130,
                minWidth: 130
            },
            {
                Header: "BOOK TIME",
                accessor: "book_time",
                Cell: props => {
                    return (<p>{moment(props.original.book_time).format('DD/MM/YYYY HH:mm')}</p>)
                },
                sortable: false,
                filterable: false,
                style: {
                    textAlign: 'center'
                }
            },
            {
                Header: "STATUS",
                accessor: "status",
                Cell: props => {
                    const { status } = props.original;
                    let css = 'success';
                    if (status === 'booked') {
                        css = 'warning';
                    } else if (status === 'cancelled') {
                        css = 'default';
                    }
                    return (
                        <h4>
                            <label className={`label label-${css} disabled`}
                            >
                                {status}
                            </label>
                        </h4>

                    )
                },
                sortable: false,
                filterable: false,
                style: {
                    textAlign: 'center'
                },
                width: 100,
                maxWidth: 150,
                minWidth: 100
            },
            {
                Header: props => <i className="fa fa-money" />,
                Cell: props => {
                    if (props.original.status === 'cancelled' || props.original.status === 'paid') {
                        return (
                            <button className="btn btn-xs btn-info" disabled>
                                <i className="fa fa-money" />
                            </button>
                        );
                    }
                    return (
                        <button className="btn btn-xs btn-info"
                            onClick={() => this.handleOpenModalPay(props)}
                        >
                            <i className="fa fa-money" />
                        </button>
                    )
                },
                style: {
                    textAlign: 'center'
                },
                width: 60,
                maxWidth: 60,
                minWidth: 60
            },
            {
                Header: props => <i className="fa fa-credit-card" />,
                Cell: props => {
                    if (props.original.status !== 'paid') {
                        return (
                            <button className="btn btn-xs btn-info" disabled>
                                <i className="fa fa-credit-card" />
                            </button>
                        );
                    }
                    return (
                        <button title="refund" className="btn btn-xs btn-danger"
                            onClick={() => this.handleRefund(props.original)}
                        >
                            <i className="fa fa-credit-card" />
                        </button>
                    )
                },
                style: {
                    textAlign: 'center'
                },
                width: 60,
                maxWidth: 60,
                minWidth: 60
            },
            {
                Header: props => <i className="fa fa-pencil" />,
                Cell: props => {
                    if (props.original.status === 'cancelled') {
                        return (
                            <button className="btn btn-xs btn-success" disabled>
                                <i className="fa fa-pencil" />
                            </button>
                        );
                    }
                    return (
                        <button className="btn btn-xs btn-success"
                            onClick={() => this.openUpdateContactInfo(props.original.book_tour_contact_info)}
                        >
                            <i className="fa fa-pencil" />
                        </button>
                    )
                },
                style: {
                    textAlign: 'center'
                },
                width: 60,
                maxWidth: 60,
                minWidth: 60
            },
        ];
        const columns = [
            {
                Header: "ID",
                accessor: "id",
                sortable: true,
                filterable: true,
                style: {
                    textAlign: 'center'
                },
                width: 60,
                maxWidth: 60,
                minWidth: 60
            },
            {
                Header: "NAME",
                accessor: "passenger.fullname",
                sortable: true,
                filterable: true,
                style: {
                    textAlign: 'center'
                }
            },
            {
                Header: "TYPE",
                accessor: "passenger.type_passenger.name",
                sortable: true,
                filterable: true,
                style: {
                    textAlign: 'center'
                },
                width: 100,
                maxWidth: 100,
                minWidth: 100
            },
            {
                Header: "CONTACT NAME",
                accessor: "book_tour_contact_info.fullname",
                sortable: true,
                filterable: true,
                style: {
                    textAlign: 'center'
                }
            },
            {
                Header: "CONTACT PHONE",
                accessor: "book_tour_contact_info.phone",
                sortable: true,
                filterable: true,
                style: {
                    textAlign: 'center'
                }
            },
            {
                Header: props => <i className="fa fa-pencil" />,
                Cell: props => {
                    if (props.original.status === 'cancelled') {
                        return (
                            <button className="btn btn-xs btn-success" disabled>
                                <i className="fa fa-pencil" />
                            </button>
                        );
                    }
                    return (
                        <button className="btn btn-xs btn-success"
                            onClick={() => this.openUpdatePassenger(props.original)}
                        >
                            <i className="fa fa-pencil" />
                        </button>
                    )
                },
                style: {
                    textAlign: 'center'
                },
                width: 60,
                maxWidth: 60,
                minWidth: 60
            },
            {
                Header: props => <i className="fa fa-trash" />,
                Cell: props => {
                    if (props.original.status === 'cancelled') {
                        return (
                            <button className="btn btn-xs btn-danger" disabled>
                                <i className="fa fa-trash" />
                            </button>
                        );
                    }
                    return (
                        <button className="btn btn-xs btn-danger"
                            onClick={() => this.handleEditRoute(props)}
                        >
                            <i className="fa fa-trash" />
                        </button>
                    );
                },
                style: {
                    textAlign: 'center'
                },
                width: 60,
                maxWidth: 60,
                minWidth: 60
            }
        ];
        return (
            <div style={{ height: '100vh' }} className="content-wrapper">
                {this.state.success &&
                    <SweetAlert success title="Successfully" onConfirm={this.hideSuccessAlert}>
                        hihihehehaha
                    </SweetAlert>
                }
                {this.state.error &&
                    <SweetAlert
                        warning
                        confirmBtnText="Cancel"
                        confirmBtnBsStyle="default"
                        title="Fail!!!!!"
                        onConfirm={this.hideFailAlert}
                    >
                        Please check carefully!
                    </SweetAlert>
                }

                {this.state.confirmRefund && <SweetAlert
                    warning
                    confirmBtnText="Confirm"
                    confirmBtnBsStyle="danger"
                    title="Refund money"
                    onConfirm={this.handleConfirmRefund}
                >
                    Please check carefully!!!
                    </SweetAlert>
                }
                <Modal
                    open={this.state.modalPayIsOpen}
                    onClose={this.handleOncloseModalPay}
                    center
                    styles={{ 'modal': { width: '1280px' } }}
                    blockScroll={true}
                >
                    {this.state.bookPay && <Payment handlePayment={this.handlePayment} data={this.state.bookPay} tourTurn={this.state.tourTurn} tour={this.state.tour} />}
                </Modal>
                <Modal
                    open={this.state.modalUpdatePassengerIsOpen}
                    onClose={this.handleCloseModalUpdatePassenger}
                    center
                    styles={{ 'modal': { width: '1280px' } }}
                    blockScroll={true}
                >
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
                    blockScroll={true}
                >
                    {this.state.contactInfoUpdate && <ContactInfoUpdate
                        handleUpdateContactInfo={this.handleUpdateContactInfo}
                        contactInfo={this.state.contactInfoUpdate}
                    />}
                </Modal>
                <section className="content-header">
                    <h1> Thông Tin & Danh Sách Đặt Tour <i>#{this.props.match.params.id}</i> </h1>
                </section>
                <section className="content">
                    <div className="row">
                        <i
                            onClick={() => window.open(`/print-passengers/${this.props.match.params.id}`, '_blank')}
                            style={{
                                fontSize: '35px',
                                marginBottom: '2px',
                                marginRight: '15px',
                                color: '#3c8dbc',
                                cursor: 'pointer'
                            }}
                            className="fa fa-print pull-right"
                            title="print"
                        />
                    </div>
                    <div className="row">
                        <div className="col-lg-12 col-xs-12">
                            <div className="nav-tabs-custom">
                                <ul className="nav nav-tabs">
                                    <li className="active"><a href="#activity" data-toggle="tab">Information</a></li>
                                    <li><a href="#settings" data-toggle="tab">Book Tour History</a></li>
                                    <li><a href="#timeline" data-toggle="tab">List Passengers</a></li>
                                </ul>
                                <div className="tab-content">
                                    <div className="active tab-pane" id="activity">
                                        <div className="post">
                                            <div className="user-block">
                                                <form onSubmit={this.handleSave} className="form-horizontal">
                                                    <div className="box-body">
                                                        <div className="form-group">
                                                            <label className="col-sm-4 control-label">Name</label>
                                                            <div className="col-sm-5">
                                                                <input type="text" readOnly value={tour ? tour.name : ''} name="price" className="form-control" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="col-sm-4 control-label">Start Date</label>
                                                            <div className="col-sm-5">
                                                                <input type="text" readOnly value={tourTurn ? moment(tourTurn.start_date).format('DD/MM/YYYY') : ''} name="discount" className="form-control" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="col-sm-4 control-label">End Date</label>
                                                            <div className="col-sm-5">
                                                                <input type="text" readOnly value={tourTurn ? moment(tourTurn.end_date).format('DD/MM/YYYY') : ''} name="limitPeople" className="form-control" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="col-sm-4 control-label">Price</label>
                                                            <div className="col-sm-5">
                                                                <input type="text" readOnly value={tourTurn ? formatCurrency(tourTurn.price.toString()) + ' VND' : ''} name="limitPeople" className="form-control" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="col-sm-4 control-label">Limit People</label>
                                                            <div className="col-sm-5">
                                                                <input type="number" readOnly value={tourTurn ? tourTurn.num_max_people : ''} name="limitPeople" className="form-control" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="col-sm-4 control-label">Current People</label>
                                                            <div className="col-sm-5">
                                                                <input type="number" readOnly value={tourTurn ? tourTurn.num_current_people : ''} name="limitPeople" className="form-control" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="box-footer">
                                                        <button onClick={this.handleCancel} type="button" className="btn btn-default">Cancel</button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="tab-pane" id="settings">
                                        <div className="post">
                                            <div className="user-block">
                                                <form onSubmit={this.handleSave} className="form-horizontal">
                                                    <div className="box-body">
                                                        <ReactTable
                                                            columns={columnHistory}
                                                            data={bookTourHistory ? bookTourHistory : []}
                                                            defaultPageSize={10}
                                                            noDataText={'Please wait...'}
                                                        >
                                                        </ReactTable>
                                                    </div>
                                                    <div className="box-footer">
                                                        <button onClick={this.handleCancel} type="button" className="btn btn-default">Cancel</button>
                                                        {/* <button type="submit" className="btn btn-info pull-right">Confirm</button> */}
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="tab-pane" id="timeline">
                                        <div className="post">
                                            <div className="user-block">
                                                <form onSubmit={this.handleSave} className="form-horizontal">
                                                    <div className="box-body">
                                                        <ReactTable
                                                            columns={columns}
                                                            data={bookHistory ? bookHistory : []}
                                                            defaultPageSize={10}
                                                            noDataText={'Please wait...'}
                                                        >
                                                        </ReactTable>
                                                    </div>
                                                    <div className="box-footer">
                                                        <button onClick={this.handleCancel} type="button" className="btn btn-default">Cancel</button>
                                                        {/* <button type="submit" className="btn btn-info pull-right">Confirm</button> */}
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
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