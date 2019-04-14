import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import * as actions from './../../../actions/index';
import { apiGet, apiPost } from '../../../services/api';
import { formatCurrency } from './../../../helper';
import moment from 'moment';
import './../list.css';
import './index.css'

class ListTypesComponent extends Component {

    handlePayment = async () => {
        try {
            const payment = await apiPost('/book_tour/payBookTour', { code: this.props.data.code });
            this.props.handlePayment(true);
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        const { data, tour, tourTurn } = this.props;
        return (
            <div className="">
                <section className="content-header">
                    <h1>
                        Payment
                    </h1>
                </section>
                <section className="content">
                    <div className="row invoice-info">
                        <div style={{ textAlign: 'right' }} className="col-sm-5 invoice-col">
                            <address>
                                <strong>Tour</strong><br />
                                <strong>Start Date</strong><br />
                                <strong>End Date</strong><br />
                                <strong>Price/People</strong><br />
                                <strong>Total People</strong><br />
                                <strong>Total Pay</strong><br />
                                <strong>Contact Name</strong><br />
                                <strong>Contact Phone</strong><br />
                            </address>
                        </div>
                        <div className="col-sm-7 invoice-col">
                            <address>
                                {tour.name}<br />
                                {tourTurn.start_date}<br />
                                {tourTurn.end_date}<br />
                                {formatCurrency(tourTurn.price)} VND<br />
                                {data.passengers.length}<br />
                                {formatCurrency(data.total_pay)} VND<br />
                                {data.book_tour_contact_info.fullname}<br />
                                {data.book_tour_contact_info.phone}<br />
                            </address>
                        </div>
                        <div className="row">
                            <div className="col-xs-12 table-responsive">
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Name</th>
                                            <th>Type</th>
                                            <th>Sex</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.passengers.map((item, index) => {
                                            return (<tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.fullname}</td>
                                                <td>{item.type_passenger.name}</td>
                                                <td>{item.sex}</td>
                                            </tr>)
                                        })}

                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="row no-print">
                            <div className="col-xs-12">
                                <button onClick={this.handlePayment} type="button" className="btn btn-success pull-right"> Confirm
                                </button>
                            </div>
                        </div>
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