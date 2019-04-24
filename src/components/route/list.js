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
        if (!this.props.listRoute) {
            try {
                let listRoute = await apiGet('/route/getAll');
                this.props.getListRoute(listRoute.data.data);
            } catch (error) {
                console.log(error);
            }
        }

    }

    handleCreateRoute = (event) => {
        event.preventDefault();
        this.props.history.push("/route/create");
    }

    handleEditRoute = async (props) => {
        const id = props.original.id;
        const routeDetail = await apiGet(`/route/getById/${id}`);
        await this.props.getRouteById(routeDetail.data.data);
        this.props.history.push(`/route/edit/${id}`);
    }


    render() {
        return (
            <div style={{height: '100vh'}} className="content-wrapper">
                <section className="content-header">
                    <h1>
                        Danh Sách Điểm Lộ Trình
                    </h1>
                </section>
                <section className="content">
                    <div className="row">
                        <button
                            onClick={this.handleCreateRoute}
                            style={{
                                marginBottom: '2px',
                                marginRight: '15px'
                            }}
                            type="button"
                            title="thêm mới"
                            className="btn btn-success pull-right">
                            <i className="fa fa-plus" />&nbsp;Thêm
                        </button>
                    </div>
                    {this.props.listRoute &&
                        <ReactTable
                            data={this.props.listRoute ? this.props.listRoute : []}
                            defaultPageSize={10}
                            noDataText={'Please wait...'}
                            columns={[
                                {
                                    Header: "ID",
                                    accessor: "id",
                                    filterable: true,
                                    style: {
                                        textAlign: 'center'
                                    },
                                    width: 90,
                                    maxWidth: 100,
                                    minWidth: 80
                                }, 
                                {
                                    Header: "Tên",
                                    accessor: "location.name",
                                    filterable: true,
                                    style: {
                                        textAlign: 'left'
                                    }
                                },
                                {
                                    Header: "Thời Gian Đến",
                                    accessor: "arrive_time",
                                    style: {
                                        textAlign: 'center'
                                    },
                                    width: 140,
                                    maxWidth: 140,
                                    minWidth: 140
                                },
                                {
                                    Header: "Thời Gian Đi",
                                    accessor: "leave_time",
                                    style: {
                                        textAlign: 'center'
                                    },
                                    width: 140,
                                    maxWidth: 140,
                                    minWidth: 140
                                },
                                {
                                    Header: "Ngày",
                                    accessor: "day",
                                    style: {
                                        textAlign: 'center'
                                    },
                                    width: 100,
                                    maxWidth: 100,
                                    minWidth: 100
                                },
                                {
                                    Header: "Phương Tiện",
                                    accessor: "transport.name_vn",
                                    style: {
                                        textAlign: 'center'
                                    },
                                    width: 140,
                                    maxWidth: 140,
                                    minWidth: 140
                                },
                                {
                                    Header: props => <i className="fa fa-pencil" />,
                                    Cell: props => {
                                        return (
                                            <button className="btn btn-xs btn-success"
                                            title="chỉnh sửa"
                                                onClick={() => this.handleEditRoute(props)}
                                            >
                                                <i className="fa fa-pencil" />
                                            </button>
                                        )
                                    },
                                    style: {
                                        textAlign: 'center'
                                    },
                                    width: 100,
                                    maxWidth: 100,
                                    minWidth: 100
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
        listRoute: state.listRoute
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
        getListRoute: (route) => dispatch(actions.getListRoute(route)),
        getRouteById: (route) => dispatch(actions.getRouteById(route)),
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListTypesComponent));