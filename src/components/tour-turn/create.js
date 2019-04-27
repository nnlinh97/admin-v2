import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import _ from 'lodash';
import moment from 'moment';
// import DatePicker from "react-datepicker";
import InputMask from 'react-input-mask';
import Select from 'react-select';
import SweetAlert from 'react-bootstrap-sweetalert';
import { apiGet, apiPost } from '../../services/api';
import * as actions from './../../actions/index';
import { formatCurrency } from '../../helper';
import './create.css';
// import "react-datepicker/dist/react-datepicker.css";
import 'font-awesome/css/font-awesome.css';
import 'react-notifications/lib/notifications.css';

class CreateTourTurnComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            success: false,
            error: false,
            tour: null,
            price: '',
            limitPeople: '',
            startDate: '',
            endDate: '',
            tours: [],
            discount: 0,
            status: 'public',
            typePassenger: [],
            idFocus: 0
        }
        this.inputFocus = React.createRef();
    }

    async componentDidMount() {
        let { listTour, listTypePassenger } = this.props;
        if (!listTour.length) {
            try {
                listTour = await apiGet('/tour/getAllWithoutPagination');
                listTour = listTour.data.data;
                this.props.getListTour(listTour);
            } catch (error) {
                console.log(error);
            }
        }
        if (!listTypePassenger) {
            try {
                listTypePassenger = await apiGet('/type_passenger/getAll');
                listTypePassenger = listTypePassenger.data.data;
            } catch (error) {
                console.log(error);
            }
        }
        this.updateState(listTour, listTypePassenger);
    }

    updateState = (listTour, listTypePassenger) => {
        // console.log(state);
        listTour.forEach(item => {
            item.label = item.name;
        });
        listTypePassenger.forEach(item => {
            item.checked = false;
            item.percent = '';
        });
        this.setState({
            tours: listTour,
            typePassenger: [...listTypePassenger]
        })
    }

    handleChangeEndDate = ({ target }) => {
        this.setState({ endDate: target.value });
    }

    handleChangeStartDate = ({ target }) => {
        this.setState({ startDate: target.value });
    }

    handleChangeTour = (selected) => {
        this.setState({ tour: selected });
    }

    handleChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;
        this.setState({ [name]: value });
    }

    getListTypePassenger = () => {
        return this.state.typePassenger.filter(item => item.checked);
    }

    checkListTypePassenger = (typePassenger) => {
        typePassenger.filter(type => type.checked);
        typePassenger.forEach(item => {
            const percent = parseInt(item.percent);
            if (item.percent === '' || !Number.isInteger(percent) || percent < 0 || percent > 100) {
                return false;
            }
        });
        console.log(typePassenger)
        return typePassenger.length ? true : false;
    }

    handleCreateTourTurn = async (event) => {
        event.preventDefault();
        const typePassenger = this.getListTypePassenger();
        if (this.checkTourTurn() && this.checkListTypePassenger(typePassenger)) {
            const { discount, price, limitPeople, tour, startDate, endDate, status } = this.state;
            try {
                const newTourTurn = await apiPost('/tour_turn/createWithPricePassenger', {
                    idTour: tour.id,
                    start_date: moment(startDate).format('YYYY-MM-DD'),
                    end_date: moment(endDate).format('YYYY-MM-DD'),
                    discount,
                    num_max_people: limitPeople,
                    price,
                    status,
                    price_passenger: typePassenger
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
        startDate = moment(new Date(startDate)).format('YYYY-MM-DD').toString();
        endDate = moment(new Date(endDate)).format('YYYY-MM-DD').toString();
        if (!tour || !Number.isInteger(parseInt(price)) || parseInt(price) < 0 ||
            !Number.isInteger(parseInt(discount)) || parseInt(discount) < 0 ||
            parseInt(discount) > 100 || startDate > endDate || !Number.isInteger(parseInt(limitPeople)) ||
            parseInt(limitPeople) < 0 || startDate < currentDate) {
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
        this.state.typePassenger[index].checked = !props.checked;
        this.setState({ typePassenger: [...this.state.typePassenger] });
    }

    onChangePricePercent = (event, props) => {
        const index = _.findIndex(this.state.typePassenger, (item) => {
            return item.id === props.id;
        });
        this.state.typePassenger[index].percent = event.target.value;
        this.setState({
            typePassenger: [...this.state.typePassenger],
            idFocus: props.id
        }, () => {
            this.inputFocus.current.focus();
        });
    }

    render() {
        const columns = [
            {
                Header: props => <i className="fa fa-check-square" />,
                Cell: props => {
                    let index = _.findIndex(this.state.tempRoutes, (item) => {
                        return item.id === props.original.id;
                    });
                    return <div className="checkbox checkbox-modal">
                        <input
                            className="input-modal"
                            type="checkbox"
                            name="choose"
                            onChange={() => this.handleChangeSelectCheckBox(props.original)}
                            checked={props.original.checked ? true : false}
                        />
                    </div>;
                },
                style: { textAlign: 'center' },
                width: 100,
                maxWidth: 100,
                minWidth: 100
            },
            {
                Header: "ID",
                accessor: "id",
                style: { textAlign: 'center' },
                width: 100,
                maxWidth: 100,
                minWidth: 100
            },
            {
                Header: "Loại Khách",
                accessor: "name",
                style: {
                    textAlign: 'center'
                }
            },
            {
                Header: "Phần Trăm Giá Vé",
                accessor: "percent",
                Cell: props => {
                    if (props.original.checked) {
                        if (this.state.idFocus === props.original.id) {
                            return <input type="number"
                                onChange={(event) => this.onChangePricePercent(event, props.original)}
                                value={props.original.percent}
                                name="percent"
                                className="form-control"
                                ref={this.inputFocus}
                            />;
                        }
                        return <input type="number"
                            onChange={(event) => this.onChangePricePercent(event, props.original)}
                            value={props.original.percent}
                            name="percent"
                            className="form-control"
                        />;
                    }
                    return <input type="number"
                        name="percent"
                        className="form-control"
                        disabled
                    />;
                },
                style: { textAlign: 'center' },
                width: 150,
                maxWidth: 150,
                minWidth: 150
            }
        ];
        return (
            <div style={{ height: '100vh' }} className="content-wrapper">

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

                <section className="content-header">
                    <h1> Thêm Mới Chuyến Đi</h1>
                </section>
                <section className="content">
                    <div className="row">
                        <div className="col-lg-8 col-lg-offset-2 col-xs-8 col-xs-offset-2">
                            <div className="nav-tabs-custom">
                                <ul className="nav nav-tabs">
                                    <li className="active"><a href="#activity" data-toggle="tab">Thông Tin Chuyến Đi</a></li>
                                    <li><a href="#timeline" data-toggle="tab">Loại Hành Khách và Giá Tiền</a></li>
                                    {/* <li><a href="#settings" data-toggle="tab">Settings</a></li> */}
                                </ul>
                                <div className="tab-content">
                                    <div className="active tab-pane" id="activity">
                                        <div className="post">
                                            <div className="user-block">
                                                <form onSubmit={this.handleCreateTourTurn} className="form-horizontal">
                                                    <div className="box-body">
                                                        <div className="form-group">
                                                            <label className="col-sm-4 control-label">Tour (*)</label>
                                                            <div className="col-sm-8">
                                                                <Select
                                                                    onChange={this.handleChangeTour}
                                                                    options={this.props.listTour}
                                                                    placeholder=""
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="col-sm-4 control-label">Giá Tiền (*)</label>
                                                            <div className="col-sm-8">
                                                                <input
                                                                    type="number"
                                                                    onChange={this.handleChange}
                                                                    value={this.state.price}
                                                                    name="price"
                                                                    className="form-control" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="col-sm-4 control-label">Giảm Giá</label>
                                                            <div className="col-sm-8">
                                                                <input
                                                                    type="number"
                                                                    onChange={this.handleChange}
                                                                    value={this.state.discount}
                                                                    name="discount"
                                                                    className="form-control" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="col-sm-4 control-label">Ngày Bắt Đầu (*)</label>
                                                            <div className="col-sm-8">
                                                                <input
                                                                    type="date"
                                                                    onChange={this.handleChange}
                                                                    value={this.state.startDate}
                                                                    name="startDate"
                                                                    className="form-control" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="col-sm-4 control-label">Ngày Kết Thúc (*)</label>
                                                            <div className="col-sm-8">
                                                                <input
                                                                    type="date"
                                                                    onChange={this.handleChange}
                                                                    value={this.state.endDate}
                                                                    name="endDate"
                                                                    className="form-control" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="col-sm-4 control-label">SL Tối Đa (*)</label>
                                                            <div className="col-sm-8">
                                                                <input
                                                                    type="number"
                                                                    onChange={this.handleChange}
                                                                    value={this.state.limitPeople}
                                                                    name="limitPeople"
                                                                    className="form-control" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="col-sm-4 control-label">Trạng Thái (*)</label>
                                                            <div className="col-sm-8">
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
                                                    </div>
                                                    <div className="box-footer">
                                                        <button onClick={this.handleCancel} type="button" className="btn btn-default">Hủy</button>
                                                        <button type="submit" className="btn btn-info pull-right">Lưu Thay Đổi</button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="tab-pane" id="timeline">
                                        <div className="post">
                                            <div className="user-block">
                                                <form onSubmit={this.handleCreateTourTurn} className="form-horizontal">
                                                    <div className="box-body">
                                                        <ReactTable
                                                            columns={columns}
                                                            data={this.state.typePassenger ? this.state.typePassenger : []}
                                                            defaultPageSize={5}
                                                            noDataText={'Please wait...'}
                                                        >
                                                        </ReactTable>
                                                    </div>
                                                    <div className="box-footer">
                                                        <button onClick={this.handleCancel} type="button" className="btn btn-default">Hủy</button>
                                                        <button type="submit" className="btn btn-info pull-right">Lưu Thay Đổi</button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                        {/* <div className="tab-pane" id="settings">
                                    </div> */}
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
        createTourTurn: (tour) => dispatch(actions.createTourTurn(tour)),
        getListTourTurn: (tourTurn) => dispatch(actions.getListTourTurn(tourTurn)),
        getListTypePassenger: (data) => dispatch(actions.getListTypePassenger(data))
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateTourTurnComponent));