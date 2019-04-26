import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import * as actions from './../../../actions/index';
import { apiGet, apiPost } from '../../../services/api';
import { formatCurrency } from './../../../helper';
import moment from 'moment';

class ListTypesComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bookTour: null
        }
    }


    async componentDidMount() {
        try {
            const { id } = this.props.match.params;
            const detail = await apiGet(`/book_tour/getBookTourHistoryByTourTurn/${id}`);
            this.setState({ bookTour: detail.data.data });
        } catch (error) {
            console.log(error);
        }
    }


    render() {
        const { bookTour } = this.state;
        console.log(bookTour);
        return (
            <div className="">
                {/* <section className="content-header">
                    <h1>
                        Payment
                    </h1>
                </section> */}
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
                        <div className="row">
                            <div className="col-xs-12 table-responsive">
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            {/* <th>STT</th> */}
                                            <th>Contact Name</th>
                                            <th>Phone</th>
                                            <th>List Passengers</th>
                                            <th>Note</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bookTour && bookTour.book_tour_history.map((item, index) => {
                                            if (item.status === "paid") {
                                                return <tr key={index}>
                                                    {/* <td>{index + 1}</td> */}
                                                    <td>{item.book_tour_contact_info.fullname}</td>
                                                    <td>{item.book_tour_contact_info.phone}</td>
                                                    <td>{item.passengers.map((passenger, i) => {
                                                        return <p key={i}>
                                                            {passenger.fullname}<br />
                                                        </p>;
                                                    })}</td>
                                                    <td></td>
                                                </tr>;
                                            }
                                            return null;
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
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
        getListTypeLocation: (type) => dispatch(actions.getListTypeLocation(type)),
        getListLocation: (locations) => dispatch(actions.getListLocation(locations)),
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