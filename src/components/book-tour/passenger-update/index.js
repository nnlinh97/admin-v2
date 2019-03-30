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
            passenger: null,
            name: '',
            phone: '',
            birthdate: '',
            sex: '',
            passport: '',
            type: null

        }
    }


    handlePayment = async () => {
        try {
            const payment = await apiPost('/book_tour/payBookTour', {
                code: this.props.data.code
            });
            this.props.handlePayment(true);
        } catch (error) {
            console.log(error);
        }

    }

    componentDidMount = async () => {
        this.updateState(this.props.passenger);
    }

    updateState = (passenger) => {
        this.setState({
            passenger: passenger
        })
    }


    render() {
        const { passenger } = this.state;
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
                                        <input type="text" onChange={this.handleChange} value={passenger ? passenger.fullname : ''} name="name" className="form-control" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-sm-3 control-label">Phone</label>
                                    <div className="col-sm-8">
                                        <input type="text" onChange={this.handleChange} value={passenger ? passenger.phone : ''} name="phone" className="form-control" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-sm-3 control-label">BirthDate</label>
                                    <div className="col-sm-8">
                                        <DatePicker
                                            className="form-control"
                                            selected={passenger ? passenger.birthdate : null}
                                            onChange={this.handleChangeBirthDate}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-sm-3 control-label">Sex</label>
                                    <div className="col-sm-8">
                                        <select onChange={this.handleChange} value={passenger ? passenger.sex : 'male'} name="sex" className="form-control">
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-sm-3 control-label">Passport</label>
                                    <div className="col-sm-8">
                                        <input type="text" onChange={this.handleChange} value={passenger ? passenger.passport : ''} name="passport" className="form-control" />

                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-sm-3 control-label">Type</label>
                                    <div className="col-sm-8">
                                        <select onChange={this.handleChange} value={passenger ? passenger.type_passenger.name : ''} name="type" className="form-control">
                                            <option value="adults">Adult</option>
                                            <option value="children">Children</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="box-footer">
                                <button onClick={this.handleCancel} type="button" className="btn btn-default">Cancel</button>
                                <button type="submit" className="btn btn-info pull-right">Save</button>
                            </div>
                        </form>
                        {/* <div className="row no-print">
                            <div className="col-xs-12">
                                <button onClick={this.handlePayment} type="button" className="btn btn-success pull-right"> Confirm
                                </button>
                            </div>
                        </div> */}
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
        getAllType: (type) => dispatch(actions.getAllType(type)),
        getAllLocation: (locations) => dispatch(actions.getAllLocation(locations)),
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