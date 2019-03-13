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

class CreateTourTurnComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            success: false,
            error: false,
            arrive_time: null,
            leave_time: null,
            day: '',
            location: null,
            transport: null,
            locations: null,
            transports: null,
            title: ''
        }
    }

    async componentDidMount() {
        let listLocation = this.props.allLocation;
        let listTransport = this.props.listTransport;
        let routeDetail = this.props.routeDetail;
        const id = this.props.match.params.id;
        if (!listLocation) {
            try {
                listLocation = await apiGet('/location/getAllWithoutPagination');
                listLocation = listLocation.data.data;
                await this.props.getAllLocation(listLocation);
            } catch (error) {
                console.log(error);
            }
        }
        if (!listTransport) {
            try {
                listTransport = await apiGet('/transport/getAll');
                listTransport = listTransport.data.data;
                await this.props.getListTransport(listTransport);
            } catch (error) {
                console.log(error);
            }
        }
        if (!routeDetail) {
            try {
                routeDetail = await apiGet(`/route/getById/${id}`);
                routeDetail = routeDetail.data.data
                await this.props.getRouteById(routeDetail);
            } catch (error) {
                console.log(error);
            }
        }
        this.updateState(listLocation, listTransport, routeDetail);
    }

    updateState = (listLocation, listTransport, routeDetail) => {
        console.log(routeDetail);
        listLocation.forEach(item => {
            item.label = item.name;
        });
        listTransport.forEach(item => {
            item.label = item.name_vn;
        });
        this.setState({
            locations: listLocation,
            transports: listTransport,
            title: routeDetail.title ? routeDetail.title : '',
            arrive_time: routeDetail.arrive_time,
            leave_time: routeDetail.leave_time,
            day: routeDetail.day,
            transport: routeDetail.transport,
            location: routeDetail.location
        })
    }

    handleChangeSelect = (selected) => {
        this.setState({
            location: selected
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
                this.setState({
                    success: true
                })
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
        this.props.history.push('/tour-turn/list');
    }

    checkRoute = () => {
        const { location, day, arriveTime, leaveTime } = this.state;
        if (!location || !Number.isInteger(parseInt(day)) || parseInt(day) < 1) {
            return false;
        }
        return true;

    }

    hideSuccessAlert = () => {
        this.props.history.push('/route/list');
    }

    hideFailAlert = () => {
        this.setState({
            error: false
        })
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

    render() {
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
                <section className="content-header">
                    <h1>
                        Edit Route
                    </h1>
                </section>
                <section className="content">
                    <div className="row">
                        <div className="col-lg-6 col-lg-offset-3 col-xs-6 col-xs-offset-3">
                            <div className="box box-info">
                                <div className="box-header with-border">
                                    <h3 className="box-title">Create Form</h3>
                                </div>
                                <form onSubmit={this.handleSave} className="form-horizontal">
                                    <div className="box-body">
                                        <div className="form-group">
                                            <label className="col-sm-3 control-label">Title</label>
                                            <div className="col-sm-9">
                                                <input type="text" onChange={this.handleChange} value={this.state.title} name="title" className="form-control" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="col-sm-3 control-label">Location (*)</label>
                                            <div className="col-sm-9">
                                                {this.state.locations && <Select
                                                    // value={selected}
                                                    onChange={this.handleChangeSelect}
                                                    options={this.state.locations}
                                                    defaultValue={{ label: this.state.location ? this.state.location.name : '', value: this.state.location ? this.state.location.id : '' }}
                                                />}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="col-sm-3 control-label">Arrive Time</label>
                                            <div className="col-sm-9">
                                                <TimePicker
                                                    value={this.state.arrive_time}
                                                    onChange={this.onHandleChangeArriveTime}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="col-sm-3 control-label">Leave Time</label>
                                            <div className="col-sm-9">
                                                <TimePicker
                                                    value={this.state.leave_time}
                                                    onChange={this.onHandleChangeleaveTime}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="col-sm-3 control-label">Day (*)</label>
                                            <div className="col-sm-9">
                                                <input type="number" onChange={this.handleChange} value={this.state.day} name="day" className="form-control" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="col-sm-3 control-label">Transport (*)</label>
                                            <div className="col-sm-9">
                                                {this.state.transports && <Select
                                                    // value={selected}
                                                    onChange={this.handleChangeSelect}
                                                    options={this.state.transports}
                                                    defaultValue={{ label: this.state.transport ? this.state.transport.name_vn : '', value: this.state.transport ? this.state.transport.id : '' }}
                                                />}
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
        listRoute: state.listRoute
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
        getListTransport: (transport) => dispatch(actions.getListTransport(transport)),
        getRouteById: (route) => dispatch(actions.getRouteById(route)),
        editRoute: (route) => dispatch(actions.editRoute(route)),
        getListRoute: (route) => dispatch(actions.getListRoute(route))
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateTourTurnComponent));