
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
// import ReactTable from 'react-table';
import 'react-table/react-table.css';
import * as actions from './../../../actions/index';
import _ from 'lodash';
import moment from 'moment';
// import DatePicker from "react-datepicker";
import SweetAlert from 'react-bootstrap-sweetalert';
import { formatCurrency, getDays, getNumberDays1 } from '../../../helper';
import { apiGet, apiPost } from '../../../services/api';
import Select from 'react-select';
import './index.css';
// import "react-datepicker/dist/react-datepicker.css";
import 'font-awesome/css/font-awesome.css';

class CreateTourTurnComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            success: false,
            error: false,
            tour: null,
            price: '',
            limitPeople: '',
            currentPeople: '',
            startDate: '',
            endDate: '',
            tours: [],
            tourTurnDetail: null,
            status: '',
            typePassenger: [],
            id: '',
            discount: '',
            numDay: '',
            bookingTerm: '',
            paymentTerm: '',
            numBookingTeem: '',
            numPaymentTerm: '',
            holiday: false,
            adultPrice: '',
            adultChecked: false,
            childrenPrice: '',
            childrenChecked: false
        }
        this.inputFocus = React.createRef();
    }

    async componentDidMount() {
        const { id } = this.props.match.params;
        let tourTurnDetail = null;
        let listTour = this.props.listTour;
        let listTypePassenger = this.props.listTypePassenger;
        try {
            tourTurnDetail = await apiGet(`/tour_turn/getById_admin/${id}`);
            tourTurnDetail = tourTurnDetail.data.data;
            console.log(tourTurnDetail)
            await this.props.getTourTurnDetail(tourTurnDetail);
        } catch (error) {
            console.log(error)
        }

        if (!listTour.length) {
            try {
                listTour = await apiGet('/tour/getAllWithoutPagination');
                listTour = listTour.data.data;
                await this.props.getListTour(listTour);
            } catch (error) {
                console.log(error);
            }
        }

        if (!listTypePassenger.length) {
            try {
                listTypePassenger = await apiGet('/type_passenger/getAll');
                listTypePassenger = listTypePassenger.data.data;
            } catch (error) {
                console.log(error);
            }
        }
        this.updateState(tourTurnDetail, listTour, tourTurnDetail.price_passengers);
    }

    mergeTypePassenger = (listTypePassenger, pricePassenger) => {
        for (const type of listTypePassenger) {
            for (const price of pricePassenger) {
                if (type.id === price.type_passenger.id) {
                    type.percent = price.percent;
                    type.checked = true;
                }
            }
        }
        return listTypePassenger;
    }

    updateState = (tourTurnDetail, listTour, listTypePassenger) => {
        let adultPrice = 100;
        let adultChecked = false;
        let childrenPrice = 50;
        let childrenChecked = false;
        listTypePassenger.forEach((item) => {
            if (item.type_passenger.id === 1) {
                adultPrice = item.percent;
                adultChecked = true;
            }
            if (item.type_passenger.id === 2) {
                childrenPrice = item.percent;
                childrenChecked = true;
            }
        });
        if (tourTurnDetail && listTour) {
            listTour.forEach(item => {
                item.label = item.name;
            });
            // listTypePassenger.forEach(item => {
            //     item.checked = false;
            //     item.percent = '';
            // });
            // listTypePassenger = this.mergeTypePassenger(listTypePassenger, tourTurnDetail.price_passengers);
            this.setState({
                id: tourTurnDetail.id,
                tours: listTour,
                startDate: tourTurnDetail.start_date,
                endDate: tourTurnDetail.end_date,
                discount: tourTurnDetail.discount,
                price: tourTurnDetail.price,
                limitPeople: tourTurnDetail.num_max_people,
                tour: tourTurnDetail.tour,
                tourTurnDetail: tourTurnDetail,
                status: tourTurnDetail.status,
                typePassenger: [...listTypePassenger],
                currentPeople: tourTurnDetail.num_current_people,
                bookingTerm: getDays(tourTurnDetail.start_date, 0 - tourTurnDetail.booking_term),
                numBookingTeem: tourTurnDetail.booking_term,
                numPaymentTerm: tourTurnDetail.payment_term,
                paymentTerm: getDays(tourTurnDetail.start_date, 0 - tourTurnDetail.payment_term),
                holiday: tourTurnDetail.isHoliday,
                adultPrice,
                adultChecked,
                childrenPrice,
                childrenChecked,
                numDay: tourTurnDetail.tour.num_days
            });
        }
    }

    handleChangeTour = (selected) => {
        this.setState({
            tour: selected,
            numDay: selected.num_days,
            endDate: getDays(this.state.startDate, selected.num_days - 1)
        });
    }

    handleChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;
        this.setState({ [name]: value });
    }

    handleChangeBookingTerm = (event) => {
        const value = event.target.value;
        this.setState({ bookingTerm: value, numBookingTeem: getNumberDays1(value, this.state.startDate) });
    }

    handleChangePaymentTerm = (event) => {
        const value = event.target.value;
        this.setState({ paymentTerm: value, numPaymentTerm: getNumberDays1(value, this.state.startDate) });
    }

    handleChangeStartDate = (event) => {
        const value = event.target.value;
        const name = event.target.name;
        this.setState({
            [name]: value,
            endDate: getDays(value, this.state.numDay - 1),
            bookingTerm: getDays(value, 0 - this.state.numBookingTeem),
            paymentTerm: getDays(value, 0 - this.state.numPaymentTerm),
        });
    }

    handleChangeNumber = (event) => {
        const value = event.target.value;
        const name = event.target.name;
        this.setState({ [name]: parseInt(value) });
    }

    handleChangeBoolean = (event) => {
        const value = event.target.value;
        const name = event.target.name;
        this.setState({ [name]: value === 'true' ? true : false });
    }

    getListTypePassenger = () => {
        const { adultPrice, adultChecked, childrenPrice, childrenChecked } = this.state;
        let type = [];
        if (adultChecked) {
            type.push({
                id: 1,
                percent: adultPrice
            });
        }
        if (childrenChecked) {
            type.push({
                id: 2,
                percent: childrenPrice
            });
        }
        return type;
        // return this.state.typePassenger.filter(item => item.checked);
    }

    checkListTypePassenger = (typePassenger) => {
        typePassenger.filter(type => type.checked);
        typePassenger.forEach(item => {
            const percent = parseInt(item.percent);
            if (item.percent === '' || !Number.isInteger(percent) || percent < 0 || percent > 100) {
                return false;
            }
        });
        return typePassenger.length ? true : false;
    }

    handleSave = async (event) => {
        event.preventDefault();
        const typePassenger = this.getListTypePassenger();
        if (this.checkTourTurn() && this.checkListTypePassenger(typePassenger) && this.checkTerm()) {
            try {
                const { id, startDate, endDate, limitPeople, price, discount, tour, status, bookingTerm, paymentTerm } = this.state;
                await apiPost('/tour_turn/updateWithPricePassenger', {
                    id,
                    num_max_people: limitPeople,
                    discount: discount,
                    start_date: startDate,
                    end_date: endDate,
                    idTour: tour.id,
                    price,
                    price_passenger: typePassenger,
                    status,
                    booking_term: getNumberDays1(bookingTerm, startDate),
                    payment_term: getNumberDays1(paymentTerm, startDate),
                    isHoliday: this.state.holiday
                });
                this.setState({ success: true });
            } catch (error) {
                this.setState({ error: true });
            }
        } else {
            this.setState({ error: true });
        }
    }

    handleCancel = (event) => {
        event.preventDefault();
        this.props.history.push('/tour-turn/list');
    }

    checkTourTurn = () => {
        let { tour, price, startDate, endDate, limitPeople, discount } = this.state;
        const currentDate = moment(new Date()).format('YYYY-MM-DD').toString();
        startDate = moment(startDate).format('YYYY-MM-DD').toString();
        endDate = moment(endDate).format('YYYY-MM-DD').toString();
        if (!tour || !Number.isInteger(parseInt(price)) ||
            parseInt(price) < 0 || !Number.isInteger(parseInt(discount)) ||
            parseInt(discount) < 0 || parseInt(discount) > 100 || startDate > endDate ||
            !Number.isInteger(parseInt(limitPeople)) || parseInt(limitPeople) < 0 ||
            startDate < currentDate || limitPeople < this.state.tourTurnDetail.num_current_people) {
            return false;
        }
        return true;
    }

    checkTerm = () => {
        let { bookingTerm, paymentTerm, startDate, endDate } = this.state;
        const currentDate = moment(new Date()).format('YYYY-MM-DD').toString();
        startDate = moment(new Date(startDate)).format('YYYY-MM-DD').toString();
        // const days = getNumberDays(currentDate, startDate);

        if(bookingTerm === '' || paymentTerm === '' || startDate === '' || endDate === ''){
            return false;
        }
        if(startDate > endDate) {
            return false;
        }
        if(paymentTerm <= bookingTerm || paymentTerm >= startDate || bookingTerm >= startDate) {
            return false;
        }
        if(currentDate >= startDate || currentDate >= bookingTerm) {
            return false;
        }
        return true;
    }

    hideSuccessAlert = () => {
        this.props.history.push('/tour-turn/list');
    }

    hideFailAlert = () => {
        this.setState({ error: false });
    }

    handleChangeSelectCheckBox = (props) => {
        const index = _.findIndex(this.state.typePassenger, (item) => {
            return item.id === props.id;
        });
        let types = [...this.state.typePassenger];
        types[index].checked = !props.checked;
        this.setState({ typePassenger: types });
    }

    onChangePricePercent = (event, props) => {
        const index = _.findIndex(this.state.typePassenger, (item) => {
            return item.id === props.id;
        });
        let types = [...this.state.typePassenger];
        types[index].percent = event.target.value;
        this.setState({
            typePassenger: types,
            idFocus: props.id
        }, () => {
            this.inputFocus.current.focus();
        });
    }

    getPrice = (price) => {
        if (price === '') {
            return null;
        }
        return formatCurrency(price) + ' VND';
    }

    getPeoplePrice = (price, discount, percent) => {
        if (price === '' || discount > 100 || percent <= 0 || percent > 100) {
            return null;
        }
        return formatCurrency(price * (100 - discount) * percent / 10000) + ' VND';
    }

    getPriceDiscount = (price, discount) => {
        if (price === '' || discount > 100 || discount <= 0) {
            return null;
        }
        return 'Còn ' + formatCurrency((price * (100 - discount)) / 100) + ' VND';
    }

    handleChangeAdultChecked = () => {
        this.setState({ adultChecked: !this.state.adultChecked });
    }

    handleChangeChildrenChecked = () => {
        this.setState({ childrenChecked: !this.state.childrenChecked });
    }

    render() {
        // const columns = [
        //     {
        //         Header: props => <i className="fa fa-check-square" />,
        //         Cell: props => {
        //             // let index = _.findIndex(this.state.tempRoutes, (item) => {
        //             //     return item.id === props.original.id;
        //             // });
        //             return (
        //                 <div className="checkbox checkbox-modal">
        //                     <input
        //                         style={{ width: '15px', height: '15px', marginTop: '0px', marginLeft: '-7px' }}
        //                         className="input-modal"
        //                         type="checkbox"
        //                         name="choose"
        //                         onChange={() => this.handleChangeSelectCheckBox(props.original)}
        //                         checked={props.original.checked ? true : false}
        //                     />
        //                 </div>
        //             )
        //         },
        //         style: { textAlign: 'center' },
        //         width: 100,
        //         maxWidth: 100,
        //         minWidth: 100
        //     },
        //     {
        //         Header: "ID",
        //         accessor: "id",
        //         Cell: props => <p>{props.original.id}</p>,
        //         style: { textAlign: 'center' },
        //         width: 100,
        //         maxWidth: 100,
        //         minWidth: 100
        //     },
        //     {
        //         Header: "Loại khách",
        //         accessor: "name_vi",
        //         style: { textAlign: 'center' }
        //     },
        //     {
        //         Header: "Phần trăm giá vé",
        //         accessor: "percent",
        //         Cell: props => {
        //             if (props.original.checked) {
        //                 if (this.state.idFocus === props.original.id) {
        //                     return (
        //                         <input type="number"
        //                             onChange={(event) => this.onChangePricePercent(event, props.original)}
        //                             value={props.original.percent}
        //                             name="percent"
        //                             className="form-control"
        //                             ref={this.inputFocus}
        //                         />
        //                     );
        //                 }
        //                 return (
        //                     <input type="number"
        //                         onChange={(event) => this.onChangePricePercent(event, props.original)}
        //                         value={props.original.percent}
        //                         name="percent"
        //                         className="form-control"
        //                     />
        //                 );
        //             }
        //             return (
        //                 <input type="number"
        //                     name="percent"
        //                     className="form-control"
        //                     disabled
        //                 />
        //             );
        //         },
        //         sortable: false,
        //         filterable: false,
        //         style: {
        //             textAlign: 'center'
        //         },
        //         width: 150,
        //         maxWidth: 150,
        //         minWidth: 150
        //     }
        // ];
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

                <section className="content-header content-header-page">
                    <h1> Chỉnh Sửa Chuyến Đi <i>#{this.state.id}</i> </h1>
                </section>
                <section className="content">
                    <div className="row">
                        <div className="col-lg-12 col-xs-12">
                            <form className="form-horizontal">
                                <div className="box-body book_tour_detail-information">
                                    <h2>Thông Tin Chuyến Đi</h2>
                                    <div className="box-body">
                                        <div className="form-group">
                                            <label className="col-sm-2 control-label">Tour (*)</label>
                                            <div className="col-sm-6">
                                                {this.state.tours.length > 0 && <Select
                                                    // value={selected}
                                                    onChange={this.handleChangeTour}
                                                    options={this.state.tours}
                                                    defaultValue={{ label: this.state.tour ? this.state.tour.name : 'linh', value: this.state.tour ? this.state.tour.id : '0' }}
                                                />}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="col-sm-2 control-label">Số ngày (*)</label>
                                            <div className="col-sm-6">
                                                <input
                                                    type="number"
                                                    value={this.state.numDay}
                                                    readOnly
                                                    name="price"
                                                    className="form-control" />
                                            </div>
                                            <label className="col-sm-4 control-label">
                                                <i style={{ textAlign: 'left', fontWeight: '400', fontSize: '14px', left: '0', marginTop: '0' }}>
                                                    {this.getPrice(this.state.price)}
                                                </i>
                                            </label>
                                        </div>
                                        <div className="form-group">
                                            <label className="col-sm-2 control-label">Giá tiền (*)</label>
                                            <div className="col-sm-6">
                                                <input
                                                    type="number"
                                                    onChange={this.handleChange}
                                                    value={this.state.price}
                                                    name="price"
                                                    className="form-control" />
                                            </div>
                                            <label className="col-sm-4 control-label">
                                                <i style={{ textAlign: 'left', fontWeight: '400', fontSize: '14px', left: '0', marginTop: '0' }}>
                                                    {this.getPrice(this.state.price)}
                                                </i>
                                            </label>
                                        </div>
                                        <div className="form-group">
                                            <label className="col-sm-2 control-label">Giảm giá (%)</label>
                                            <div className="col-sm-6">
                                                <input
                                                    type="number"
                                                    onChange={this.handleChange}
                                                    value={this.state.discount}
                                                    name="discount"
                                                    className="form-control" />
                                            </div>
                                            <label className="col-sm-4 control-label">
                                                <i style={{ textAlign: 'left', fontWeight: '400', fontSize: '14px', left: '0', marginTop: '0' }}>
                                                    {this.getPriceDiscount(this.state.price, this.state.discount)}
                                                </i>
                                            </label>
                                        </div>
                                        <div className="form-group">
                                            <label className="col-sm-2 control-label">Giá người lớn (%)</label>
                                            <div className="col-sm-6">
                                                <input
                                                    type="number"
                                                    onChange={this.handleChange}
                                                    value={this.state.adultPrice}
                                                    name="adultPrice"
                                                    className="form-control" />
                                            </div>
                                            <label className="col-sm-4 control-label">
                                                <input
                                                    style={{ width: '22px', height: '35px', marginTop: '-7px', marginLeft: '-20px', float: 'left' }}
                                                    className="input-modal"
                                                    type="checkbox"
                                                    name="adultChecked"
                                                    readOnly
                                                    checked
                                                // onChange={this.handleChangeAdultChecked}
                                                // checked={this.state.adultChecked ? true : false}
                                                />
                                                <i style={{ textAlign: 'left', fontWeight: '400', fontSize: '14px', left: '40px', marginTop: '0', float: 'left' }}>
                                                    {this.getPeoplePrice(this.state.price, this.state.discount, this.state.adultPrice)}
                                                </i>
                                            </label>
                                        </div>
                                        <div className="form-group">
                                            <label className="col-sm-2 control-label">Giá trẻ em (%)</label>
                                            <div className="col-sm-6">
                                                <input
                                                    type="number"
                                                    onChange={this.handleChange}
                                                    value={this.state.childrenPrice}
                                                    name="childrenPrice"
                                                    className="form-control" />
                                            </div>
                                            <label className="col-sm-4 control-label">
                                                <input
                                                    style={{ width: '22px', height: '35px', marginTop: '-7px', marginLeft: '-20px', float: 'left' }}
                                                    className="input-modal"
                                                    type="checkbox"
                                                    name="childrenChecked"
                                                    onChange={this.handleChangeChildrenChecked}
                                                    checked={this.state.childrenChecked ? true : false}
                                                />
                                                <i style={{ textAlign: 'left', fontWeight: '400', fontSize: '14px', left: '40px', marginTop: '0' }}>
                                                    {this.getPeoplePrice(this.state.price, this.state.discount, this.state.childrenPrice)}
                                                </i>
                                            </label>
                                        </div>
                                        <div className="form-group">
                                            <label className="col-sm-2 control-label">Ngày khởi hành (*)</label>
                                            <div className="col-sm-6">
                                                <input
                                                    type="date"
                                                    onChange={this.handleChangeStartDate}
                                                    value={this.state.startDate}
                                                    name="startDate"
                                                    className="form-control" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="col-sm-2 control-label">Ngày kết thúc (*)</label>
                                            <div className="col-sm-6">
                                                <input
                                                    type="date"
                                                    // onChange={this.handleChange}
                                                    readOnly
                                                    value={this.state.endDate}
                                                    name="endDate"
                                                    className="form-control" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="col-sm-2 control-label">Hạn đặt tour (*)</label>
                                            <div className="col-sm-6">
                                                <input
                                                    type="date"
                                                    onChange={this.handleChangeBookingTerm}
                                                    value={this.state.bookingTerm}
                                                    name="bookingTerm"
                                                    className="form-control" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="col-sm-2 control-label">Hạn thanh toán (*)</label>
                                            <div className="col-sm-6">
                                                <input
                                                    type="date"
                                                    onChange={this.handleChangePaymentTerm}
                                                    value={this.state.paymentTerm}
                                                    name="paymentTerm"
                                                    className="form-control" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="col-sm-2 control-label">Thời điểm (*)</label>
                                            <div className="col-sm-6">
                                                <select
                                                    value={this.state.holiday}
                                                    onChange={this.handleChangeBoolean}
                                                    name="holiday"
                                                    className="form-control">
                                                    <option value="false">Ngày thường</option>
                                                    <option value="true">Lễ, tết</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="col-sm-2 control-label">SL tối đa (*)</label>
                                            <div className="col-sm-6">
                                                <input
                                                    type="number"
                                                    onChange={this.handleChange}
                                                    value={this.state.limitPeople}
                                                    name="limitPeople"
                                                    className="form-control" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="col-sm-2 control-label">Trạng thái (*)</label>
                                            <div className="col-sm-6">
                                                <select
                                                    value={this.state.status}
                                                    onChange={this.handleChange}
                                                    name="status"
                                                    className="form-control">
                                                    <option value="public">Công Khai</option>
                                                    <option value="private">Ẩn</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="col-sm-2 control-label">Đã đặt</label>
                                            <div className="col-sm-6">
                                                <input
                                                    type="number"
                                                    disabled
                                                    value={this.state.currentPeople}
                                                    name="limitPeople"
                                                    className="form-control" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <form style={{ marginBottom: '20px' }} className="form-horizontal">
                                <div className="box-body book_tour_detail-book_tour_history">
                                    {/* <div className="book_tour_detail-book_tour_history-title">
                                        <h2>Loại Hành Khách và Giá Tiền</h2>
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
                                    </div> */}
                                    {/* <div className="container">
                                        <div className="row">
                                            <div className="col-xs-12 book_tour_history">
                                                <ReactTable
                                                    columns={columns}
                                                    data={this.state.typePassenger ? this.state.typePassenger : []}
                                                    defaultPageSize={5}
                                                    noDataText={'Please wait...'} >
                                                </ReactTable>
                                            </div>
                                        </div>
                                    </div> */}
                                    <div style={{ marginTop: '10px', marginBottom: '20px' }} className="footer">
                                        <button onClick={this.handleCancel} type="button" className="btn btn-default pull-right">Hủy</button>&nbsp;
                                        <button style={{ marginRight: '10px' }} onClick={this.handleSave} type="button" className="btn btn-info pull-right">Lưu Thay Đổi</button>
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
        tourTurnDetail: state.tourTurnDetail,
        listTourTurn: state.listTourTurn,
        listTypePassenger: state.listTypePassenger
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
        getTourTurnDetail: (tourTurn) => dispatch(actions.getTourTurnById(tourTurn)),
        getListTourTurn: (tourTurn) => dispatch(actions.getListTourTurn(tourTurn)),
        updateTourTurn: (tourTurn) => dispatch(actions.EditTourTurn(tourTurn))
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateTourTurnComponent));