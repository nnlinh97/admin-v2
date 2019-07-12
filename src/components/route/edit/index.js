import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
// import Modal from 'react-responsive-modal';
// import TimePicker from 'react-time-picker';
import Select from 'react-select';
import * as actions from './../../../actions/index';
import { apiGet, apiPost } from './../../../services/api';
import './index.css';

class EditRouteComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arriveTime: '',
            leaveTime: '',
            location: null,
            locations: null,
            transports: null,
            transport: null,
            detail: '',
            day: '',
            title: '',
            id: ''
        }
    }

    async componentDidMount() {
        let { listLocation, listTransport, routeDetail } = this.props;
        if (!listLocation) {
            try {
                listLocation = await apiGet('/location/getAllWithoutPagination');
                listLocation = listLocation.data.data;
                await this.props.getListLocation(listLocation);
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
        this.updateState(listLocation, listTransport, routeDetail);
    }

    updateState = (listLocation, listTransport, routeDetail) => {
        listLocation.forEach(item => { item.label = item.name; });
        listTransport.forEach(item => { item.label = item.name_vn; });
        this.setState({
            locations: listLocation,
            transports: listTransport,
            title: routeDetail.title ? routeDetail.title : '',
            day: routeDetail.day,
            location: routeDetail.location,
            transport: routeDetail.transport,
            id: routeDetail.id,
            detail: routeDetail.detail ? routeDetail.detail : '',
            arriveTime: routeDetail.arrive_time,
            leaveTime: routeDetail.leave_time
        });
    }

    checkRoute = () => {
        const { location, day, transport } = this.state;
        if (!location || !Number.isInteger(parseInt(day)) || parseInt(day) < 1 || !transport) {
            return false;
        }
        return true;

    }

    handleChange = (event) => {
        let target = event.target;
        let name = target.name;
        let value = target.value;
        this.setState({ [name]: value });
    }

    onHandleChangeArriveTime = (time) => {
        this.setState({ arriveTime: time + ":00" });
    }

    onHandleChangeleaveTime = (time) => {
        this.setState({ leaveTime: time + ":00" });
    }

    handleChangeLocation = (selected) => {
        this.setState({ location: selected });
    }

    handleChangeTransport = (selected) => {
        this.setState({ transport: selected });
    }

    handleEditRoute = async (event) => {
        event.preventDefault();
        const { id, location, day, arriveTime, leaveTime, title, transport, detail } = this.state;
        if (this.checkRoute()) {
            try {
                const routeEdited = await apiPost('/route/update', {
                    id: id,
                    arrive_time: arriveTime ? arriveTime : '',
                    leave_time: leaveTime ? leaveTime : '',
                    day: parseInt(day),
                    title: title,
                    idLocation: location.id,
                    idTransport: transport.id,
                    location,
                    transport,
                    detail
                });
                this.props.updateRoute(routeEdited.data.data);
                this.props.handleEditRoute(true);
            } catch (error) {
                this.props.handleEditRoute(false);
            }
        } else {
            this.props.handleEditRoute(false);
        }
    }

    render() {
        return <div style={{ marginLeft: '0px' }} className="content-wrapper">
            <section style={{ marginBottom: "20px" }} className="content-header">
                <h1> Chỉnh Sửa Điểm Lộ Trình <i>#{this.state.id}</i> </h1>
            </section>
            <section className="content">
                <div className="row">
                    <div className="col-lg-12 col-xs-12 ">
                        <div className="box box-info">
                            <form onSubmit={this.handleEditRoute} className="form-horizontal">
                                <div className="box-body">
                                    {/* <div className="form-group">
                                        <label className="col-sm-3 control-label">ID</label>
                                        <div className="col-sm-8">
                                            <input
                                                type="text"
                                                value={this.state.id}
                                                className="form-control"
                                                readOnly
                                            />
                                        </div>
                                    </div> */}
                                    <div className="form-group">
                                        <label className="col-sm-3 control-label">Title</label>
                                        <div className="col-sm-8">
                                            <input
                                                type="text"
                                                onChange={this.handleChange}
                                                value={this.state.title}
                                                name="title"
                                                className="form-control" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-sm-3 control-label">Địa Điểm (*)</label>
                                        <div className="col-sm-8">
                                            {this.state.locations && <Select
                                                onChange={this.handleChangeLocation}
                                                options={this.state.locations}
                                                defaultValue={{
                                                    label: this.state.location ? this.state.location.name : '',
                                                    value: this.state.location ? this.state.location.id : ''
                                                }}
                                                placeholder=""
                                            />}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-sm-3 control-label">Thời Gian Đến</label>
                                        <div className="col-sm-8">
                                            <input
                                                type="time"
                                                onChange={this.handleChange}
                                                value={this.state.arriveTime}
                                                name="arriveTime"
                                                className="form-control" />
                                            {/* <TimePicker
                                                value={this.state.arriveTime}
                                                onChange={this.onHandleChangeArriveTime}
                                            /> */}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-sm-3 control-label">Thời Gian Đi</label>
                                        <div className="col-sm-8">
                                            <input
                                                type="time"
                                                onChange={this.handleChange}
                                                value={this.state.leaveTime}
                                                name="leaveTime"
                                                className="form-control" />
                                            {/* <TimePicker
                                                value={this.state.leaveTime}
                                                onChange={this.onHandleChangeleaveTime}
                                            /> */}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-sm-3 control-label">Ngày (*)</label>
                                        <div className="col-sm-8">
                                            <input
                                                type="number"
                                                onChange={this.handleChange}
                                                value={this.state.day}
                                                name="day"
                                                className="form-control" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-sm-3 control-label">Phương Tiện (*)</label>
                                        <div className="col-sm-8">
                                            {this.state.transports && <Select
                                                onChange={this.handleChangeTransport}
                                                options={this.state.transports}
                                                defaultValue={{
                                                    label: this.state.transport ? this.state.transport.name_vn : '',
                                                    value: this.state.transport ? this.state.transport.id : ''
                                                }}
                                                placeholder=""
                                            />}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-sm-3 control-label">Chi Tiết</label>
                                        <div className="col-sm-8">
                                            <textarea
                                                onChange={this.handleChange}
                                                value={this.state.detail}
                                                name="detail"
                                                className="form-control"
                                                rows={3}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="box-footer col-sm-11">
                                    <button type="submit" className="btn btn-info pull-right">Lưu Thay Đổi</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>;
    }
}

const mapStateToProps = (state) => {
    return {
        listLocation: state.allLocation,
        listRoute: state.listRoute
    }
}

const mapDispatchToProps = (dispatch, action) => {
    return {
        getListTransport: (transport) => dispatch(actions.getListTransport(transport)),
        updateRoute: (route) => dispatch(actions.editRoute(route)),
        getListLocation: (locations) => dispatch(actions.getListLocation(locations))
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditRouteComponent));
