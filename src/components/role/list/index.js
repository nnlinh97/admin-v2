import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import ReactTable from 'react-table';
import Modal from 'react-responsive-modal';
import SweetAlert from 'react-bootstrap-sweetalert';
import * as actions from './../../../actions/index';
import { apiGet, apiPost } from '../../../services/api';
import CreateComponent from '../create';
import EditComponent from '../edit';
import { matchString, getStatusTourTurn } from '../../../helper';
import 'react-table/react-table.css';
// import './index.css';

class listAdmin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            roles: [],
            keySearch: '',
            modalCreateIsOpen: false,
            modalEditIspOpen: false,
            roleEditing: null,
            success: false,
            error: false
        }
    }

    async componentDidMount() {
        try {
            let roles = await apiGet('/roles_admin/getAll');
            console.log(roles.data.data);
            this.setState({ roles: roles.data.data });
        } catch (error) {
            console.log(error);
        }
    }

    handleCreateRole = (res) => {
        if (res) {
            this.setState({ success: true });
        } else {
            this.setState({ error: true });
        }
    }

    handleEditRole = (res) => {
        if (res) {
            this.setState({ success: true });
        } else {
            this.setState({ error: true });
        }
    }

    handleOpenCreateModal = () => {
        this.setState({ modalCreateIsOpen: true });
    }

    handleCloseCreateModal = () => {
        this.setState({ modalCreateIsOpen: false });
    }

    handleOpenModalEdit = ({ original }) => {
        this.setState({ modalEditIspOpen: true, roleEditing: original });
    }

    handleCloseEditModal = () => {
        this.setState({ modalEditIspOpen: false });
    }

    hideSuccessAlert = () => {
        this.componentDidMount();
        this.handleCloseCreateModal();
        this.handleCloseEditModal();
        this.setState({ success: false });
    }

    hideFailAlert = () => {
        this.setState({ error: false });
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
                Header: "Loại nhân viên",
                accessor: "name",
                style: { textAlign: 'left' }
            },
            {
                Header: props => <i className="fa fa-pencil" />,
                Cell: props => {
                    return <button onClick={() => this.handleOpenModalEdit(props)} className='btn btn-xs btn-success' >
                        <i className="fa fa-pencil" />
                    </button>
                },
                style: { textAlign: 'center' },
                width: 50,
                maxWidth: 70,
                minWidth: 50
            }
        ];
        return (
            <div style={{ minHeight: '100vh' }} className="content-wrapper">

                {this.state.success && <SweetAlert
                    success
                    title="Lưu Thành Công"
                    onConfirm={this.hideSuccessAlert}>
                    Tiếp Tục...
                </SweetAlert>}

                {this.state.error && <SweetAlert
                    warning
                    confirmBtnText="Hủy"
                    confirmBtnBsStyle="default"
                    title="Đã Có Lỗi Xảy Ra!"
                    onConfirm={this.hideFailAlert}>
                    Vui Lòng Kiểm Tra Lại...
                </SweetAlert>}

                <Modal
                    open={this.state.modalCreateIsOpen}
                    onClose={this.handleCloseCreateModal}
                    center
                    styles={{ 'modal': { width: '1280px' } }}
                    blockScroll={true} >
                    <CreateComponent handleCreateRole={this.handleCreateRole} />
                </Modal>

                <Modal
                    open={this.state.modalEditIspOpen}
                    onClose={this.handleCloseEditModal}
                    center
                    styles={{ 'modal': { width: '1280px' } }}
                    blockScroll={true} >
                    {this.state.roleEditing && <EditComponent
                        role={this.state.roleEditing}
                        handleEditRole={this.handleEditRole}
                    />}
                </Modal>

                <section className="content-header content-header-page">
                    <h1> Danh Sách Loại Nhân Viên </h1>
                    <div className="right_header">
                        <button
                            onClick={this.handleOpenCreateModal}
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
                                                    data={this.state.roles}
                                                    columns={columns}
                                                    pageSizeOptions={[5, 10, 20, 25]}
                                                    defaultPageSize={5}
                                                    noDataText={'Vui lòng đợi...'}
                                                    previousText={'Trang trước'}
                                                    nextText={'Trang sau'}
                                                    pageText={'Trang'}
                                                    ofText={'/'}
                                                    rowsText={'dòng'} >
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

export default withRouter(listAdmin);