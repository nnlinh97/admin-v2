import 'froala-editor/js/froala_editor.pkgd.min.js';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
// import Modal from 'react-bootstrap-modal';
import * as actions from './../../actions/index';

// import { EditorState, convertToRaw, ContentState } from 'draft-js';
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
            startDate: null,
            endDate: null,
            tours: null,
            discount: 0
        }
    }

    async componentDidMount() {
        let listTour = this.props.listTour;
        if (!listTour) {
            try {
                listTour = await apiGet('/tour/getAllWithoutPagination');
                listTour = listTour.data.data
                await this.props.getListTour(listTour);
            } catch (error) {
                console.log(error);
            }
        }
        this.updateState(listTour);
    }

    updateState = (state) => {
        // console.log(state);
        state.forEach(item => {
            item.label = item.name;
        });
        this.setState({
            tours: state
        })
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

    handleSave = async (event) => {
        event.preventDefault();
        if (this.checkTourTurn()) {
            const { discount, price, limitPeople, tour, startDate, endDate } = this.state;
            try {
                const newTourTurn = await apiPost('/tour_turn/create', {
                    idTour: tour.id,
                    start_date: moment(startDate).format('YYYY-MM-DD'),
                    end_date: moment(endDate).format('YYYY-MM-DD'),
                    discount,
                    num_max_people: limitPeople,
                    price
                });
                const { data } = newTourTurn;
                if (!this.props.listTourTurn) {
                    console.log('noooooo');
                    try {
                        let listTourTurn = await apiGet('/tour_turn/getAllWithoutPagination');
                        this.props.getListTourTurn(listTourTurn.data.data);
                    } catch (error) {
                        console.log(error);
                    }
                } else {
                    await this.props.createTourTurn({
                        discount: data.discount,
                        end_date: data.end_date,
                        id: data.id,
                        num_current_people: data.num_current_people,
                        start_date: data.end_date,
                        num_max_people: data.num_max_people,
                        price: data.price,
                        tour: {
                            id: tour.id,
                            name: tour.name
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
        this.props.history.push('/tour-turn/list');
    }

    checkTourTurn = () => {
        let { tour, price, startDate, endDate, limitPeople, discount } = this.state;
        const currentDate = moment(new Date()).format('YYYY-MM-DD').toString();
        startDate = moment(startDate).format('YYYY-MM-DD').toString();
        endDate = moment(endDate).format('YYYY-MM-DD').toString();
        if (!tour || !Number.isInteger(parseInt(price)) || parseInt(price) < 0 || !Number.isInteger(parseInt(discount)) || parseInt(discount) < 0 || parseInt(discount) > 100 || startDate > endDate || !Number.isInteger(parseInt(limitPeople)) || parseInt(limitPeople) < 0 || startDate < currentDate) {
            return false;
        }
        return true;
    }

    hideSuccessAlert = () => {
        this.props.history.push('/tour-turn/list');
        // this.setState({
        //     success: false
        // })
    }

    hideFailAlert = () => {
        this.setState({
            error: false
        })
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
                        Create Tour Turn
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
                                            <label className="col-sm-3 control-label">Tour (*)</label>
                                            <div className="col-sm-9">
                                                {this.state.tours && <Select
                                                    // value={selected}
                                                    onChange={this.handleChangeSelect}
                                                    options={this.state.tours}
                                                // defaultValue={{ label: selected.name ? selected.name : 'linh', value: selected.id ? selected.id : '' }}
                                                />}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="col-sm-3 control-label">Price (*)</label>
                                            <div className="col-sm-9">
                                                <input type="number" onChange={this.handleChange} value={this.state.price} name="price" className="form-control" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="col-sm-3 control-label">Discount</label>
                                            <div className="col-sm-9">
                                                <input type="number" onChange={this.handleChange} value={this.state.discount} name="discount" className="form-control" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="col-sm-3 control-label">Start Date (*)</label>
                                            <div className="col-sm-9">
                                                <DatePicker
                                                    className="form-control"
                                                    selected={this.state.startDate}
                                                    onChange={this.handleChangeStartDate}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="col-sm-3 control-label">End Date (*)</label>
                                            <div className="col-sm-9">
                                                <DatePicker
                                                    className="form-control"
                                                    selected={this.state.endDate}
                                                    onChange={this.handleChangeEndDate}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="col-sm-3 control-label">People Limit (*)</label>
                                            <div className="col-sm-9">
                                                <input type="number" onChange={this.handleChange} value={this.state.limitPeople} name="limitPeople" className="form-control" />
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
        listTourTurn: state.listTourTurn
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
        createTourTurn: (tour) => dispatch(actions.createTourTurn(tour)),
        getListTourTurn: (tourTurn) => dispatch(actions.getListTourTurn(tourTurn))
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateTourTurnComponent));