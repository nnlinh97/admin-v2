import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import Modal from 'react-responsive-modal';
import * as actions from './../../actions/index';
import { apiGet } from '../../services/api';
// import moment from 'moment';
import CreateRouteComponent from './create';
import EditRouteComponent from './edit';
import { matchString } from '../../helper';
import SweetAlert from 'react-bootstrap-sweetalert';
import './list.css';

class ListRouteComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listRoute: [],
            routeDetail: null,
            modalCreateIsOpen: false,
            modalEditIsOpen: false,
            error: false,
            success: false,
            keySearch: ''
        };
    }

    async componentDidMount() {
        let { listRoute } = this.props;
        if (!listRoute.length) {
            try {
                listRoute = await apiGet('/route/getAll');
                listRoute = listRoute.data.data;
                this.props.getListRoute(listRoute);
            } catch (error) {
                console.log(error);
            }
        }
        this.setState({ listRoute });
    }

    openModalCreateRoute = (event) => {
        event.preventDefault();
        this.setState({ modalCreateIsOpen: true });
    }

    openModalEditRoute = (routeDetail) => {
        this.setState({ modalEditIsOpen: true, routeDetail: routeDetail });
    }

    handleCreateRoute = (result) => {
        this.setState({ success: result, error: !result });
    }

    handleEditRoute = (result) => {
        this.setState({ success: result, error: !result });
    }

    handleCloseModalCreateRoute = () => {
        this.setState({ modalCreateIsOpen: false });
    }

    handleCloseModalEditRoute = () => {
        this.setState({ modalEditIsOpen: false });
    }

    handleHiddenSuccess = () => {
        this.handleCloseModalCreateRoute();
        this.handleCloseModalEditRoute();
        this.setState({ success: false });
    }

    handleHiddenError = () => {
        this.setState({ error: false });
    }

    handleChange = ({ target }) => {
        this.setState({ keySearch: target.value });
    }

    handleSearchRoute = (listRoute, keySearch) => {
        if (keySearch !== '' && listRoute.length > 0) {
            return listRoute.filter(route => matchString(route.location.name, keySearch) || matchString(route.id.toString(), keySearch));
        }
        return listRoute;
    }

    render() {
        const columns = [
            {
                Header: "STT",
                Cell: props => <p>{props.index + 1}</p>,
                style: { textAlign: 'center' },
                width: 80,
                maxWidth: 80,
                minWidth: 80
            },
            {
                Header: "ID",
                accessor: "id",
                Cell: props => <i>#{props.original.id}</i>,
                style: { textAlign: 'center' },
                width: 90,
                maxWidth: 100,
                minWidth: 80
            },
            // {
            //     Header: "Title",
            //     accessor: "title",
            //     style: {
            //         textAlign: 'left'
            //     }
            // },
            {
                Header: "Tên",
                accessor: "location.name",
                // Cell: props => <p title={props.original.location.name}>
                //     {props.original.location.name.length > 25 ? `${props.original.location.name.substring(0, 25)}...` : props.original.location.name}
                // </p>,
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
                            onClick={() => this.openModalEditRoute(props.original)}
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

        ];
        return (
            <div style={{ minHeight: '90vh' }} className="content-wrapper">
                {this.state.success && <SweetAlert
                    success
                    title="Lưu Thành Công"
                    onConfirm={this.handleHiddenSuccess}>
                    Tiếp Tục...
                </SweetAlert>}

                {this.state.error && <SweetAlert
                    warning
                    confirmBtnText="Hủy"
                    confirmBtnBsStyle="default"
                    title="Đã Có Lỗi Xảy Ra!"
                    onConfirm={this.handleHiddenError}>
                    Vui Lòng Kiểm Tra Lại...
                </SweetAlert>}

                <Modal
                    open={this.state.modalCreateIsOpen}
                    onClose={this.handleCloseModalCreateRoute}
                    center
                    styles={{ 'modal': { width: '1280px' } }}
                    blockScroll={true} >
                    <CreateRouteComponent handleCreateRoute={this.handleCreateRoute} />
                </Modal>

                <Modal
                    open={this.state.modalEditIsOpen}
                    onClose={this.handleCloseModalEditRoute}
                    center
                    styles={{ 'modal': { width: '1280px' } }}
                    blockScroll={true} >
                    <EditRouteComponent handleEditRoute={this.handleEditRoute} routeDetail={this.state.routeDetail} />
                </Modal>

                <section className="content-header">
                    <h1> Danh Sách Điểm Lộ Trình </h1>
                    <div className="right_header">
                        <button
                            onClick={this.openModalCreateRoute}
                            style={{ marginBottom: '2px', marginRight: '15px' }}
                            type="button"
                            title="thêm mới"
                            className="btn btn-success pull-right">
                            <i className="fa fa-plus" />&nbsp;Thêm
                        </button>
                    </div>
                </section>
                <section className="content">
                    <div className="row">
                        <div className="col-lg-12 col-xs-12">
                            <form className="form-horizontal">
                                <div className="box-body book_tour_detail-book_tour_history">
                                    <div className="book_tour_detail-book_tour_history-title">
                                        <h2>&nbsp;</h2>
                                        <div style={{ top: '10px' }} className="search_box">
                                            <div className="search_icon">
                                                <i className="fa fa-search"></i>
                                            </div>
                                            <input
                                                type="text"
                                                onChange={this.handleChange}
                                                value={this.state.keySearch}
                                                name="keySearch"
                                                className="search_input"
                                                placeholder="Tìm kiếm..."
                                            />
                                        </div>
                                    </div>
                                    <div className="container">
                                        <div className="row">
                                            <div className="col-xs-12 book_tour_history">
                                                <ReactTable
                                                    data={this.handleSearchRoute(this.props.listRoute, this.state.keySearch)}
                                                    defaultPageSize={10}
                                                    noDataText={'vui lòng chờ...'}
                                                    columns={columns} >
                                                </ReactTable>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        listRoute: state.listRoute
    }
}

const mapDispatchToProps = (dispatch, action) => {
    return {
        getListRoute: (route) => dispatch(actions.getListRoute(route)),
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListRouteComponent));