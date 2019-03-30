import 'froala-editor/js/froala_editor.pkgd.min.js';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import * as actions from './../../actions/index';
import _ from 'lodash';
import moment from 'moment';
import DatePicker from "react-datepicker";
import TimePicker from 'react-time-picker';
import './create.css';
import "react-datepicker/dist/react-datepicker.css";
// Require Font Awesome.
import 'font-awesome/css/font-awesome.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';

import FroalaEditor from 'react-froala-wysiwyg';
import SuccessNotify from '../notification/success';
import 'react-notifications/lib/notifications.css';
import { useAlert } from "react-alert";
import { configEditor } from './config';
import Route from './route';
import SweetAlert from 'react-bootstrap-sweetalert';

import { helper } from '../../helper';
import { apiGet, apiPost } from '../../services/api';
import Select from 'react-select';

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
            startDate: null,
            endDate: null,
            tours: null,
            tourTurnDetail: null,
            status: '',
            typePassenger: [],
        }
        this.inputFocus = React.createRef();
    }

    async componentDidMount() {
        const { id } = this.props.match.params;
        let tourTurnDetail = this.props.tourTurnDetail;
        let listTour = this.props.listTour;
        let listTypePassenger = this.props.listTypePassenger;
        if (!tourTurnDetail) {
            try {
                tourTurnDetail = await apiGet(`/tour_turn/getById_admin/${id}`);
                tourTurnDetail = tourTurnDetail.data.data;
                await this.props.getTourTurnDetail(tourTurnDetail);
            } catch (error) {
                console.log(error)
            }
        }

        if (!listTour) {
            try {
                listTour = await apiGet('/tour/getAllWithoutPagination');
                listTour = listTour.data.data;
                await this.props.getListTour(listTour);
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
        this.updateState(tourTurnDetail, listTour, listTypePassenger);
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
        if (tourTurnDetail && listTour) {
            listTour.forEach(item => {
                item.label = item.name;
            });
            listTypePassenger.forEach(item => {
                item.checked = false;
                item.percent = '';
            });
            listTypePassenger = this.mergeTypePassenger(listTypePassenger, tourTurnDetail.price_passengers);
            this.setState({
                id: tourTurnDetail.id,
                tours: listTour,
                startDate: new Date(tourTurnDetail.start_date),
                endDate: new Date(tourTurnDetail.end_date),
                discount: tourTurnDetail.discount,
                price: tourTurnDetail.price,
                limitPeople: tourTurnDetail.num_max_people,
                tour: tourTurnDetail.tour,
                tourTurnDetail: tourTurnDetail,
                status: tourTurnDetail.status,
                typePassenger: [...listTypePassenger],
                currentPeople: tourTurnDetail.num_current_people
            })
        }

    }


    handleChangeEndDate = (time) => {
        this.setState({
            endDate: time
        })
    }

    handleChangeStartDate = (time) => {
        this.setState({
            startDate: time
        })
    }

    handleChangeSelect = (selected) => {
        this.setState({
            tour: selected
        })
    }

    handleChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;
        this.setState({
            [name]: value
        })
    }

    getListTypePassenger = () => {
        return this.state.typePassenger.filter(item => item.checked);
    }

    checkListTypePassenger = (typePassenger) => {
        let flag = 1;
        typePassenger.forEach(item => {
            const percent = parseInt(item.percent);
            if (item.percent === '' || !Number.isInteger(percent) || percent < 0 || percent > 100) {
                flag = -1;
            }
        });
        if(!typePassenger.length){
            flag = -1;
        }
        return flag === 1;
    }

    handleSave = async (event) => {
        event.preventDefault();
        console.log(this.state);
        const typePassenger = this.getListTypePassenger();
        if (this.checkTourTurn() && this.checkListTypePassenger(typePassenger)) {
            try {
                const { id, startDate, endDate, limitPeople, price, discount, tour, status } = this.state;
                const updateTourTurn = await apiPost('/tour_turn/updateWithPricePassenger', {
                    id,
                    num_max_people: limitPeople,
                    discount: discount,
                    start_date: startDate,
                    end_date: endDate,
                    idTour: tour.id,
                    price,
                    price_passenger: typePassenger,
                    status
                });
                if (!this.props.listTourTurn) {
                    try {
                        let listTourTurn = await apiGet('/tour_turn/getAllWithoutPagination');
                        this.props.getListTourTurn(listTourTurn.data.data);
                    } catch (error) {
                        console.log(error);
                    }
                } else {
                    await this.props.updateTourTurn({
                        id: id,
                        price: price,
                        num_max_people: limitPeople,
                        discount,
                        start_date: moment(startDate).format('YYYY-MM-DD'),
                        end_date: moment(endDate).format('YYYY-MM-DD'),
                        tour,
                        status: this.state.status,
                        num_current_people: this.state.tourTurnDetail.num_current_people
                    });
                }
                this.setState({
                    success: true
                });
            } catch (error) {
                this.setState({
                    error: true
                });
            }
        } else {
            this.setState({
                error: true
            });
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

    hideSuccessAlert = () => {
        this.props.history.push('/tour-turn/list');
    }

    hideFailAlert = () => {
        this.setState({
            error: false
        })
    }

    handleChangeSelectCheckBox = (props) => {
        const index = _.findIndex(this.state.typePassenger, (item) => {
            return item.id === props.id;
        });
        this.state.typePassenger[index].checked = !props.checked;
        this.setState({
            typePassenger: [...this.state.typePassenger]
        })
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
                    return (
                        <div className="checkbox checkbox-modal">
                            <input
                                className="input-modal"
                                type="checkbox"
                                name="choose"
                                onChange={() => this.handleChangeSelectCheckBox(props.original)}
                                checked={props.original.checked ? true : false}
                            />
                        </div>
                    )
                },
                sortable: false,
                filterable: false,
                style: {
                    textAlign: 'center'
                },
                width: 100,
                maxWidth: 100,
                minWidth: 100
            },
            {
                Header: "ID",
                accessor: "id",
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
                Header: "NAME",
                accessor: "name",
                sortable: true,
                filterable: true,
                style: {
                    textAlign: 'center'
                }
            },
            {
                Header: "PRICE PERCENT",
                accessor: "percent",
                Cell: props => {
                    if (props.original.checked) {
                        if (this.state.idFocus === props.original.id) {
                            return (
                                <input type="number"
                                    onChange={(event) => this.onChangePricePercent(event, props.original)}
                                    value={props.original.percent}
                                    name="percent"
                                    className="form-control"
                                    ref={this.inputFocus}
                                />
                            );
                        }
                        return (
                            <input type="number"
                                onChange={(event) => this.onChangePricePercent(event, props.original)}
                                value={props.original.percent}
                                name="percent"
                                className="form-control"
                            />
                        );
                    }
                    return (
                        <input type="number"
                            name="percent"
                            className="form-control"
                            disabled
                        />
                    );
                },
                sortable: false,
                filterable: false,
                style: {
                    textAlign: 'center'
                },
                width: 150,
                maxWidth: 150,
                minWidth: 150
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
                        title="Something went wrong!"
                        onConfirm={this.hideFailAlert}
                    >
                        Please check carefully!
                    </SweetAlert>
                }
                <section className="content-header">
                    <h1>
                        Update Tour Turn
                    </h1>
                </section>
                <section className="content">
                    <div className="row">
                        <div className="col-lg-8 col-lg-offset-2 col-xs-8 col-xs-offset-2">
                            <div className="nav-tabs-custom">
                                <ul className="nav nav-tabs">
                                    <li className="active"><a href="#activity" data-toggle="tab">Information</a></li>
                                    <li><a href="#timeline" data-toggle="tab">Type Passenger</a></li>
                                    {/* <li><a href="#settings" data-toggle="tab">Settings</a></li> */}
                                </ul>
                                <div className="tab-content">
                                    <div className="active tab-pane" id="activity">
                                        <div className="post">
                                            <div className="user-block">
                                                <form onSubmit={this.handleSave} className="form-horizontal">
                                                    <div className="box-body">
                                                        <div className="form-group">
                                                            <label className="col-sm-4 control-label">Tour (*)</label>
                                                            <div className="col-sm-8">
                                                                {this.state.tours && <Select
                                                                    // value={selected}
                                                                    onChange={this.handleChangeSelect}
                                                                    options={this.state.tours}
                                                                    defaultValue={{ label: this.state.tour ? this.state.tour.name : 'linh', value: this.state.tour ? this.state.tour.id : '0' }}
                                                                />}
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="col-sm-4 control-label">Price (*)</label>
                                                            <div className="col-sm-8">
                                                                <input type="number" onChange={this.handleChange} value={this.state.price} name="price" className="form-control" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="col-sm-4 control-label">Discount</label>
                                                            <div className="col-sm-8">
                                                                <input type="number" onChange={this.handleChange} value={this.state.discount} name="discount" className="form-control" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="col-sm-4 control-label">Start Date (*)</label>
                                                            <div className="col-sm-8">
                                                                <DatePicker
                                                                    className="form-control"
                                                                    selected={this.state.startDate}
                                                                    onChange={this.handleChangeStartDate}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="col-sm-4 control-label">End Date (*)</label>
                                                            <div className="col-sm-8">
                                                                <DatePicker
                                                                    className="form-control"
                                                                    selected={this.state.endDate}
                                                                    onChange={this.handleChangeEndDate}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="col-sm-4 control-label">People Limit (*)</label>
                                                            <div className="col-sm-8">
                                                                <input type="number" onChange={this.handleChange} value={this.state.limitPeople} name="limitPeople" className="form-control" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="col-sm-4 control-label">Public (*)</label>
                                                            <div className="col-sm-8">
                                                                <select value={this.state.status} onChange={this.handleChange} name="status" className="form-control">
                                                                    <option value="public">Yes</option>
                                                                    <option value="private">No</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="form-group">
                                                            <label className="col-sm-4 control-label">Current People</label>
                                                            <div className="col-sm-8">
                                                                <input type="number" disabled value={this.state.currentPeople} name="limitPeople" className="form-control" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="box-footer">
                                                        <button onClick={this.handleCancel} type="button" className="btn btn-default">Cancel</button>
                                                        <button type="submit" className="btn btn-info pull-right">Save</button>
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
                                                            data={this.state.typePassenger ? this.state.typePassenger : []}
                                                            defaultPageSize={5}
                                                            noDataText={'Please wait...'}
                                                        >
                                                        </ReactTable>
                                                    </div>
                                                    <div className="box-footer">
                                                        <button onClick={this.handleCancel} type="button" className="btn btn-default">Cancel</button>
                                                        <button type="submit" className="btn btn-info pull-right">Save</button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>

                                    </div>
                                    {/* <div className="tab-pane" id="settings">
                                    </div> */}
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
        tourTurnDetail: state.tourTurnDetail,
        listTourTurn: state.listTourTurn,
        listTypePassenger: state.listTypePassenger
    }
}

const mapDispatchToProps = (dispatch, action) => {
    return {
        changeLocationInfo: (info) => dispatch(actions.changeLocationInfo(info)),
        getAllType: (type) => dispatch(actions.getAllType(type)),
        getAllLocation: (locations) => dispatch(actions.getAllLocation(locations)),
        createType: (type) => dispatch(actions.createType(type)),
        editType: (type) => dispatch(actions.editType(type)),
        getListTour: (tour) => dispatch(actions.getListTour(tour)),
        getTourTurnDetail: (tourTurn) => dispatch(actions.getTourTurnById(tourTurn)),
        getListTourTurn: (tourTurn) => dispatch(actions.getListTourTurn(tourTurn)),
        updateTourTurn: (tourTurn) => dispatch(actions.EditTourTurn(tourTurn))
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateTourTurnComponent));