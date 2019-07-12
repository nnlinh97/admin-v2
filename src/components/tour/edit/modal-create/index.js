import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Select from 'react-select';
import * as actions from './../../../../actions/index';
import {
    apiGet,
    // apiPost
} from './../../../../services/api';
import './index.css';

class CreateRouteComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrive_time: '',
            leave_time: '',
            location: null,
            locations: [],
            transports: [],
            transport: null,
            detail: '',
            day: '',
        }
    }

    async componentDidMount() {
        let listLocation = this.props.listLocation;
        let listTransport = this.props.listTransport;
        if (!listLocation) {
            try {
                listLocation = await apiGet('/location/getAllWithoutPagination');
                listLocation = listLocation.data.data;
                this.props.getListLocation(listLocation);
            } catch (error) {
                console.log(error);
            }
        }
        if (!listTransport) {
            try {
                listTransport = await apiGet('/transport/getAll');
                listTransport = listTransport.data.data
                this.props.getListTransport(listTransport);
            } catch (error) {
                console.log(error);
            }
        }
        this.updateState(listLocation, listTransport);
    }

    updateState = (listLocation, listTransport) => {
        listLocation.forEach(item => { item.label = item.name; });
        listTransport.forEach(item => { item.label = item.name_vn; });
        this.setState({ locations: listLocation, transports: listTransport });
    }

    checkRoute = () => {
        const { location, day, transport } = this.state;
        if (!location || !Number.isInteger(parseInt(day)) || parseInt(day) < 1 || !transport) {
            return false;
        }
        return true;
    }

    handleChangeLocation = (selected) => {
        this.setState({ location: selected });
    }

    handleChangeTransport = (selected) => {
        this.setState({ transport: selected });
    }

    handleChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;
        this.setState({ [name]: value });
    }

    handleChangeTime = (event) => {
        const value = event.target.value;
        const name = event.target.name;
        this.setState({ [name]: value + ':00' });
    }

    handleCreateRoute = async (event) => {
        event.preventDefault();
        // const { location, day, arriveTime, leaveTime, title, transport, detail } = this.state;
        if (this.checkRoute()) {
            let state = this.state;
            delete state.locations;
            delete state.transports;
            this.props.handleCreateRoute(state);
        } else {
            this.props.handleCreateRoute(null);
        }
    }

    render() {
        return <div style={{ marginLeft: '0px' }} className="content-wrapper">
            <section style={{ marginBottom: "20px" }} className="content-header">
                <h1> Thêm Địa Điểm Tour </h1>
            </section>
            <section className="content">
                <div className="row">
                    <div className="col-lg-12 col-xs-12 ">
                        <div className="box box-info">
                            <form onSubmit={this.handleCreateRoute} className="form-horizontal">
                                <div className="box-body">
                                    <div className="form-group">
                                        <label className="col-sm-3 control-label">Địa Điểm (*)</label>
                                        <div className="col-sm-8">
                                            <Select
                                                onChange={this.handleChangeLocation}
                                                options={this.state.locations}
                                                placeholder=""
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-sm-3 control-label">Thời Gian Đến</label>
                                        <div className="col-sm-8">
                                            <input
                                                type="time"
                                                onChange={this.handleChangeTime}
                                                value={this.state.arrive_time}
                                                name="arrive_time"
                                                className="form-control" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-sm-3 control-label">Thời Gian Đi</label>
                                        <div className="col-sm-8">
                                            <input
                                                type="time"
                                                onChange={this.handleChangeTime}
                                                value={this.state.leave_time}
                                                name="leave_time"
                                                className="form-control" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-sm-3 control-label">Ngày (*)</label>
                                        <div className="col-sm-8">
                                            <input type="number" onChange={this.handleChange} value={this.state.day} name="day" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-sm-3 control-label">Phương Tiện (*)</label>
                                        <div className="col-sm-8">
                                            <Select
                                                onChange={this.handleChangeTransport}
                                                options={this.state.transports}
                                                placeholder=""
                                            />
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
        createRoute: (route) => dispatch(actions.createRoute(route)),
        getListLocation: (locations) => dispatch(actions.getListLocation(locations))
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateRouteComponent));
