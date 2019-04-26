import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import DatePicker from "react-datepicker";
import * as actions from './../../../actions/index';
import { apiGet, apiPost } from '../../../services/api';
import moment from 'moment';
import './../list.css';
import './index.css'

class ListTypesComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fullname: '',
            phone: '',
            birthdate: null,
            sex: '',
            passport: '',
            type_passenger: '',
            id: ''
        }
    }

    componentDidMount = async () => {
        const { passenger } = this.props;
        this.setState({
            fullname: passenger.fullname ? passenger.fullname : '',
            phone: passenger.phone ? passenger.phone : '',
            birthdate: passenger.birthdate,
            sex: passenger.sex ? passenger.sex : '',
            type_passenger: passenger.type_passenger ? passenger.type_passenger.id : '',
            passport: passenger.passport ? passenger.passport : '',
            id: passenger.id
        });
    }

    handleChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;
        this.setState({ [name]: value });
    }

    validatePassenger = (passenger) => {
        const { fullname, phone, id } = passenger;
        const phoneRegex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
        if (!fullname || fullname === '') {
            return false;
        }
        if (!phone || !phoneRegex.test(phone)) {
            return false;
        }
        if(!id || id === '') {
            return false;
        }
        return true;
    }

    handleSave = (event) => {
        event.preventDefault();
        if (this.validatePassenger(this.state)) {
            this.props.handleUpdatePassenger(this.state);
        } else {
            this.props.handleUpdatePassenger(null);
        }
    }

    handleChangeBirthDate = (time) => {
        this.setState({ birthdate: time });
    }

    render() {
        const { fullname, phone, sex, birthdate, passport, type_passenger } = this.state;
        return (
            <div className="">
                <section className="content-header">
                    <h1>
                        Update Passenger
                    </h1>
                </section>
                <section className="content">
                    <div className="row invoice-info">
                        <form onSubmit={this.handleSave} className="form-horizontal">
                            <div className="box-body">
                                <div className="form-group">
                                    <label className="col-sm-3 control-label">Name</label>
                                    <div className="col-sm-8">
                                        <input
                                            type="text"
                                            onChange={this.handleChange}
                                            value={fullname}
                                            name="fullname"
                                            className="form-control" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-sm-3 control-label">Phone</label>
                                    <div className="col-sm-8">
                                        <input type="text" onChange={this.handleChange} value={phone} name="phone" className="form-control" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-sm-3 control-label">BirthDate</label>
                                    <div className="col-sm-8">
                                        <DatePicker
                                            className="form-control"
                                            selected={new Date(birthdate)}
                                            onChange={this.handleChangeBirthDate}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-sm-3 control-label">Sex</label>
                                    <div className="col-sm-8">
                                        <select onChange={this.handleChange} value={sex} name="sex" className="form-control">
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-sm-3 control-label">Passport</label>
                                    <div className="col-sm-8">
                                        <input type="text" onChange={this.handleChange} value={passport} name="passport" className="form-control" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-sm-3 control-label">Type</label>
                                    <div className="col-sm-8">
                                        <select onChange={this.handleChange} value={type_passenger ? type_passenger : ''} name="type_passenger" className="form-control">
                                            <option value="1">Adult</option>
                                            <option value="2">Children</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="box-footer">
                                <button type="submit" className="btn btn-info pull-right">Save</button>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        );
    }
}

// export default withRouter(ListTypesComponent);
const mapStateToProps = (state) => {
    return {
        info: state.infoLocation,
        allType: state.allType,
        allLocation: state.allLocation,
        listTour: state.listTour,
        listTourTurn: state.listTourTurn,
        listBookTourTurn: state.listBookTourTurn
    }
}

const mapDispatchToProps = (dispatch, action) => {
    return {
        changeLocationInfo: (info) => dispatch(actions.changeLocationInfo(info)),
        getListTypeLocation: (type) => dispatch(actions.getListTypeLocation(type)),
        createType: (type) => dispatch(actions.createType(type)),
        editType: (type) => dispatch(actions.editType(type)),
        getListTour: (tour) => dispatch(actions.getListTour(tour)),
        getListTourTurn: (tourTurn) => dispatch(actions.getListTourTurn(tourTurn)),
        getTourTurnDetail: (tourTurn) => dispatch(actions.getTourTurnById(tourTurn)),
        getListBookTourTurn: (listBook) => dispatch(actions.getListBookTourTurn(listBook)),
        getBookTourTurnById: (book) => dispatch(actions.getBookTourTurnById(book))
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListTypesComponent));