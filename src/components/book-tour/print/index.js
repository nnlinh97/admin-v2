import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import * as actions from './../../../actions/index';
import { apiGet, apiPost } from '../../../services/api';
import { formatCurrency } from './../../../helper';
import moment from 'moment';
import './index.css';

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
            console.log(detail);
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
                        <h2>Thông tin chuyến đi</h2>
                        <div className="box-body-main">
                            <div className="box-body-left">
                                <div className="">Tour</div>
                                <div className="">Start Date</div>
                                <div className="">End Date</div>
                                <div className="">Price/People</div>
                                <div className="">Total People</div>
                                <div className="">Sale</div>
                                <div className="">Total Pay</div>
                            </div>
                            <div className="box-body-right">
                                <div className="">Tour From A To B.</div>
                                <div className="">12/12/2012</div>
                                <div className="">12/12/2012</div>
                                <div className="">10000 VND</div>
                                <div className="">10 People</div>
                                <div className="">10%</div>
                                <div className="">90000 VND</div>

                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <h2>Thông tin hành khách</h2>
                            <div className="col-xs-12 table-responsive">
                                <table className="table table-striped table_info_passengers">
                                    <thead>
                                        <tr>
                                            {/* <th>STT</th> */}
                                            <th width="10%">Contact Name</th>
                                            <th width="10%">Phone</th>
                                            <th width="15%">Email</th>
                                            <th width="30%">List Passengers</th>
                                            <th>Note</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* {bookTour && bookTour.book_tour_history.map((item, index) => {
                                            if (item.status === "paid") {
                                                return <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.book_tour_contact_info.fullname}</td>
                                                    <td>{item.book_tour_contact_info.phone}</td>

                                                    <td></td>
                                                </tr>;
                                            }
                                            return null;
                                        })} */}
                                        <td>Lorem Ipsum</td>
                                        <td>(+111) 111 111 111</td>
                                        <td>abc_xyz@gmail.com</td>
                                        <td>
                                            <table class="table table-striped mini_table">
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Type</th>
                                                        <th>Gender</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>Nguyan Van A</td>
                                                        <td>Adult</td>
                                                        <td>Man</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Nguyan Van B</td>
                                                        <td>Children</td>
                                                        <td>Woman</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Nguyan Van C</td>
                                                        <td>Adult</td>
                                                        <td>Man</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                        <td>Lorem ipsum dolor sit amet, te eum sumo option expetenda, quo te cibo ubique ignota. Per volumus forensibus mediocritatem eu. Eu aeque nemore vim. Nobis eirmod expetendis sit ei, repudiare maiestatis cum et. Eos hinc recteque cu, sed eu virtute indoctum.</td>
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