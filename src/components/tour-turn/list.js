import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
// import Modal from 'react-bootstrap-modal';
import * as actions from './../../actions/index';
import { apiGet } from '../../services/api';
import { formatCurrency } from '../../helper'
import moment from 'moment';
import './list.css';
import './../../custom.css';

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
                        Danh Sách Chuyến Đi
                    </h1>
                    <div className="right_header">
                        <button
                            onClick={this.handleCreatetour}
                            style={{
                                marginBottom: '2px',
                                marginRight: '15px'
                            }}
                            type="button"
                            className="btn btn-success pull-right">
                            <i className="fa fa-plus" />&nbsp;Thêm
                        </button>
                    </div>
                </section>
                <section className="content">
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
                                    width: 70,
                                    maxWidth: 80,
                                    minWidth: 60
                                },
                                {
                                    Header: "Tên",
                                    accessor: "tour.name",
                                    sortable: true,
                                    filterable: true,
                                    style: {
                                        textAlign: 'center'
                                    }
                                },
                                {
                                    Header: "Ngày Bắt Đầu",
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
                                    Header: "Ngày Kết Thúc",
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
                                    Header: "Giá Tiền/Người vnđ",
                                    accessor: "price",
                                    Cell: props => {
                                        return (<p>{formatCurrency(props.original.price)}</p>)
                                    },
                                    sortable: true,
                                    filterable: false,
                                    style: {
                                        textAlign: 'center'
                                    },
                                    width: 120,
                                    maxWidth: 120,
                                    minWidth: 120
                                },
                                {
                                    Header: "Giảm Giá (%)",
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
                                    Header: "SL Tối Đa",
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
                                    Header: "SL Hiện Tại",
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
                                    Header: "Trạng Thái",
                                    Cell: props => {
                                        const status = props.original.status;
                                        const css = status === 'public' ? 'info' : 'default';
                                        return (
                                            <h4>
                                                <label className={`label label-${css} disabled`}
                                                >
                                                    {status === 'public' ? 'công khai' : 'ẩn'}
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
                                    Header:  props => <i className="fa fa-suitcase" />,
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
                                                title="chỉnh sửa"
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