import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
// import Modal from 'react-bootstrap-modal';
import * as actions from './../../actions/index';
import { apiGet } from '../../services/api';
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
        if (!this.props.listTourTurn) {
            try {
                let listTourTurn = await apiGet('/tour_turn/getAllWithoutPagination');
                this.props.getListTourTurn(listTourTurn.data.data);
            } catch (error) {
                console.log(error);
            }
        }

    }

    handleCreatetour = (event) => {
        event.preventDefault();
        this.props.history.push("/tour-turn/create")
    }

    handleEditTourTurn = async (props) => {
        const id = props.original.id;
        try {
            const tourTurnDetail = await apiGet(`/tour_turn/getById_admin/${id}`);
            await this.props.getTourTurnDetail(tourTurnDetail.data.data);
            this.props.history.push(`/tour-turn/edit/${id}`);
        } catch (error) {
            console.log(error)
        }

    }


    render() {
        console.log(this.props.listTourTurn);
        return (
            <div style={{ height: '100vh' }} className="content-wrapper">
                <section className="content-header">
                    <h1>
                        List Tour Turn
                    </h1>
                </section>
                <section className="content">
                    <div className="row">
                        <button
                            onClick={this.handleCreatetour}
                            style={{
                                marginBottom: '2px',
                                marginRight: '15px'
                            }}
                            type="button"
                            className="btn btn-success pull-right">
                            <i className="fa fa-plus" />&nbsp;Create
                        </button>
                    </div>
                    {this.props.listTourTurn &&
                        <ReactTable
                            data={this.props.listTourTurn ? this.props.listTourTurn : []}
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
                                    Header: "PRICE",
                                    accessor: "price",
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
                                    Header: "DISCOUNT(%)",
                                    accessor: "discount",
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
                                    Header: "PUBLICED",
                                    Cell: props => {
                                        const status = props.original.status;
                                        const css = status === 'public' ? 'info' : 'default';
                                        return (
                                            <h4>
                                                <label className={`label label-${css} disabled`}
                                                >
                                                    {status}
                                                </label>
                                            </h4>
                                        );
                                    },
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
                                    Header: "STATUS",
                                    Cell: props => {
                                        const startDate = props.original.start_date;
                                        const endDate = props.original.end_date;
                                        const currentDate = moment(new Date()).format('YYYY-MM-DD');
                                        let status = "Đã đi";
                                        let css = 'default';
                                        if (startDate <= currentDate && currentDate <= endDate) {
                                            status = "Đang đi";
                                            css = 'warning'
                                        }
                                        if (startDate > currentDate) {
                                            status = "Chưa đi";
                                            css = 'success';
                                        }
                                        return (
                                            <h4>
                                                <label className={`label label-${css} disabled`}
                                                >
                                                    {status}
                                                </label>
                                            </h4>

                                        )
                                    },
                                    sortable: true,
                                    filterable: false,
                                    style: {
                                        textAlign: 'center'
                                    },
                                    width: 80,
                                    maxWidth: 100,
                                    minWidth: 80
                                },
                                {
                                    Header: props => <i className="fa fa-pencil" />,
                                    Cell: props => {
                                        const startDate = props.original.start_date;
                                        const endDate = props.original.end_date;
                                        const currentDate = moment(new Date()).format('YYYY-MM-DD');
                                        if (startDate <= currentDate) {
                                            return (
                                                <button className="btn btn-xs btn-success disabled">
                                                    <i className="fa fa-pencil" />
                                                </button>
                                            );
                                        }
                                        return (
                                            <button className={`btn btn-xs btn-success ${startDate > currentDate ? '' : 'disabled'}`}
                                                onClick={() => this.handleEditTourTurn(props)}
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
                                    width: 40,
                                    maxWidth: 50,
                                    minWidth: 40
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
        getListTourTurn: (tourTurn) => dispatch(actions.getListTourTurn(tourTurn)),
        getTourTurnDetail: (tourTurn) => dispatch(actions.getTourTurnById(tourTurn))
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListTypesComponent));