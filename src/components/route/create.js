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
import './create.css';

class CreateTourTurnComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            success: false,
            error: false,
            arriveTime: null,
            leaveTime: null,
            day: '',
            location: null,
            locations: null,
            title: '',
            transports: null,
            transport: null
        }
    }

    async componentDidMount() {
        let listLocation = this.props.allLocation;
        let listTransport = this.props.listTransport;
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
                listTransport = listTransport.data.data
                await this.props.getListTransport(listTransport);
            } catch (error) {
                console.log(error);
            }
        }
        this.updateState(listLocation, listTransport);
    }

    updateState = (listLocation, listTransport) => {
        listLocation.forEach(item => {
            item.label = item.name;
        });
        listTransport.forEach(item => {
            item.label = item.name_vn;
        });
        this.setState({
            locations: listLocation,
            transports: listTransport
        })
    }

    handleChangeSelect = (selected) => {
        this.setState({
            location: selected
        })
    }

    handleChangeTransport = (selected) => {
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
        const { location, day, arriveTime, leaveTime, title, transport } = this.state;
        console.log(this.checkRoute());
        if (this.checkRoute()) {
            try {
                const newRoute = await apiPost('/route/create', {
                    idLocation: location.id,
                    arrive_time: arriveTime,
                    leave_time: leaveTime,
                    day: parseInt(day),
                    title: title,
                    idTransport: transport.id
                });
                if (!this.props.listRoute) {
                    try {
                        let listRoute = await apiGet('/route/getAll');
                        this.props.getListRoute(listRoute.data.data);
                    } catch (error) {
                        console.log(error);
                    }
                } else {
                    await this.props.createRoute({
                        ...newRoute.data,
                        location: {
                            id: location.id,
                            name: location.name
                        },
                        transport: {
                            ...transport
                        }
                    });
                }
                this.setState({
                    success: true
                })
            } catch (error) {
                console.log(error);
                this.setState({
                    error: true
                })
            }
        } else {
            this.setState({
                error: true
            })
        }
    }

    handleCancel = (event) => {
        event.preventDefault();
        this.props.history.push('/route/list');
    }

    checkRoute = () => {
        const { location, day, transport } = this.state;
        if (!location || !Number.isInteger(parseInt(day)) || parseInt(day) < 1 || !transport) {
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
            arriveTime: time + ":00",
            save: false
        });
    }

    onHandleChangeleaveTime = (time) => {
        this.setState({
            leaveTime: time + ":00",
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
                        Create Route
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
                                                // defaultValue={{ label: selected.name ? selected.name : 'linh', value: selected.id ? selected.id : '' }}
                                                />}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="col-sm-3 control-label">Arrive Time</label>
                                            <div className="col-sm-9">
                                                <TimePicker
                                                    value={this.state.arriveTime}
                                                    onChange={this.onHandleChangeArriveTime}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="col-sm-3 control-label">Leave Time</label>
                                            <div className="col-sm-9">
                                                <TimePicker
                                                    value={this.state.leaveTime}
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
                                                    onChange={this.handleChangeTransport}
                                                    options={this.state.transports}
                                                // defaultValue={{ label: selected.name ? selected.name : 'linh', value: selected.id ? selected.id : '' }}
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
        createRoute: (route) => dispatch(actions.createRoute(route)),
        getListRoute: (route) => dispatch(actions.getListRoute(route))
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateTourTurnComponent));