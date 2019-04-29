import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import Modal from 'react-responsive-modal';
import * as actions from './../../actions/index';
import { apiGet } from '../../services/api';
import moment from 'moment';
import CreateRouteComponent from './create';
import EditRouteComponent from './edit';
import { matchString } from '../../helper';
import SweetAlert from 'react-bootstrap-sweetalert';
import './list.css';
import './../../custom.css';

class ListTypesComponent extends Component {

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
        this.setState({ keySearch: target.value.toLowerCase() });
    }

    handleSearchRoute = (listRoute, keySearch) => {
        if (keySearch !== '' && listRoute.length > 0) {
            return listRoute.filter(route => matchString(route.location.name, keySearch) || matchString(route.id.toString(), keySearch));
        }
        return listRoute;
    }

    render() {
        console.log(this.state.listRoute)
        return (
            <div style={{ height: '90vh' }} className="content-wrapper">
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
                    <h1>
                        Danh Sách Điểm Lộ Trình
                    </h1>
                    <div className="right_header">
                        <div style={{ float: 'right' }}>
                            <button
                                onClick={this.openModalCreateRoute}
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
                    </div>
                </section>
                <section className="content">
                    <div class="search_box">
                        <div class="search_icon">
                            <i class="fa fa-search"></i>
                        </div>
                        <input
                            type="text"
                            onChange={this.handleChange}
                            value={this.state.keySearch}
                            name="title"
                            className="search_input"
                            placeholder="Tìm kiếm..."
                        />
                        <div class="search_result_count">
                            <span>108 </span>results
                        </div>
                    </div>
                    <ReactTable
                        data={this.handleSearchRoute(this.props.listRoute, this.state.keySearch)}
                        defaultPageSize={10}
                        noDataText={'Please wait...'}
                        columns={[
                            {
                                Header: "ID",
                                accessor: "id",
                                style: {
                                    textAlign: 'center'
                                },
                                width: 90,
                                maxWidth: 100,
                                minWidth: 80
                            },
                            {
                                Header: "Title",
                                accessor: "title",
                                style: {
                                    textAlign: 'left'
                                }
                            },
                            {
                                Header: "Tên",
                                accessor: "location.name",
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

                        ]}
                    >
                    </ReactTable>
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