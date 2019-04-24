import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import * as actions from './../../actions/index';
import { apiGet, apiPost } from '../../services/api';
import moment from 'moment';
import './list.css';

class ListTypesComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listTypes: []
        }
    }

    async componentDidMount() {
        try {
            let listBook = await apiGet('/book_tour/getAllBookTourHistoryGroupByTourTurn');
            console.log(listBook.data.data);
            this.props.getListBookTourTurn(listBook.data.data.filter((item) => item.num_current_people > 0));
        } catch (error) {
            console.log(error);
        }
    }

    getBookTourTurnDetail = async (props) => {
        try {
            const { id } = props.original;
            const detail = await apiGet(`/book_tour/getBookTourHistoryByTourTurn/${id}`);
            await this.props.getBookTourTurnById(detail.data.data);
            this.props.history.push(`/book-tour/detail/${id}`);
        } catch (error) {
            console.log(error);
        }
    }


    render() {
        return (
            <div style={{ height: '100vh' }} className="content-wrapper">
                <section className="content-header">
                    <h1>
                        List Book Tour
                    </h1>
                </section>
                <section className="content">
                    {this.props.listBookTourTurn &&
                        <ReactTable
                            data={this.props.listBookTourTurn ? this.props.listBookTourTurn : []}
                            defaultPageSize={10}
                            noDataText={'Please wait...'}
                            columns={[
                                {
                                    Header: "ID",
                                    accessor: "id",
                                    sortable: false,
                                    filterable: true,
                                    style: {
                                        textAlign: 'center'
                                    },
                                    width: 90,
                                    maxWidth: 100,
                                    minWidth: 80
                                },
                                {
                                    Header: "NAME",
                                    accessor: "tour.name",
                                    sortable: true,
                                    filterable: true,
                                    style: {
                                        textAlign: 'center'
                                    }
                                },
                                {
                                    Header: "START DATE",
                                    accessor: "start_date",
                                    Cell: props => {
                                        return (<p>{moment(props.original.start_date).format('DD/MM/YYYY')}</p>)
                                    },
                                    sortable: true,
                                    filterable: true,
                                    style: {
                                        textAlign: 'center'
                                    },
                                    width: 140,
                                    maxWidth: 140,
                                    minWidth: 140
                                },
                                {
                                    Header: "END DATE",
                                    accessor: "end_date",
                                    Cell: props => {
                                        return (<p>{moment(props.original.end_date).format('DD/MM/YYYY')}</p>)
                                    },
                                    sortable: true,
                                    filterable: true,
                                    style: {
                                        textAlign: 'center'
                                    },
                                    width: 140,
                                    maxWidth: 140,
                                    minWidth: 140
                                },
                                {
                                    Header: "MAX PEOPLE",
                                    accessor: "num_max_people",
                                    sortable: true,
                                    filterable: false,
                                    style: {
                                        textAlign: 'center'
                                    },
                                    width: 100,
                                    maxWidth: 100,
                                    minWidth: 100
                                },
                                {
                                    Header: "CURRENT",
                                    accessor: "num_current_people",
                                    sortable: false,
                                    filterable: false,
                                    style: {
                                        textAlign: 'center'
                                    },
                                    width: 100,
                                    maxWidth: 100,
                                    minWidth: 100
                                },
                                {
                                    Header: props => <i className="fa fa-pencil" />,
                                    Cell: props => {
                                        return (
                                            <button className='btn btn-xs btn-success'
                                                onClick={() => this.getBookTourTurnDetail(props)}
                                            >
                                                <i className="fa fa-pencil" />
                                            </button>
                                        )
                                    },
                                    sortable: false,
                                    filterable: false,
                                    style: {
                                        textAlign: 'center'
                                    },
                                    width: 50,
                                    maxWidth: 70,
                                    minWidth: 50
                                }

                            ]}
                        >
                        </ReactTable>
                    }
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