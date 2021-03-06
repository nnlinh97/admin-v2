import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import ReactTable from 'react-table';
import Modal from 'react-responsive-modal';
import SweetAlert from 'react-bootstrap-sweetalert';
import moment from 'moment';
import CreateComponent from '../create';
import EditComponent from '../edit';
// import * as actions from './../../../actions/index';
import { apiGet, apiPostAdmin } from '../../../services/api';
import {
    matchString,
    // getStatusTourTurn
} from '../../../helper';
import 'react-table/react-table.css';
import './index.css';

class listAdmin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listAdmin: [],
            keySearch: '',
            modalCreateIsOpen: false,
            modalEditIsOpen: false,
            adminEditing: null,
            success: false,
            error: false,
            resetPassword: false,
            adminReset: null
        }
    }

    async componentDidMount() {
        try {
            let admins = await apiGet('/admin/getListAdmins');
            console.log(admins.data.data);
            this.setState({ listAdmin: admins.data.data });
        } catch (error) {
            console.log(error);
        }
    }

    handleOpenCreateModal = () => {
        this.setState({ modalCreateIsOpen: true });
    }

    handleCloseCreateModal = () => {
        this.setState({ modalCreateIsOpen: false });
    }

    handleOpenEditModal = ({ original }) => {
        this.setState({ modalEditIsOpen: true, adminEditing: original });
    }

    handleCloseEditModal = () => {
        this.setState({ modalEditIsOpen: false, adminEditing: null });
    }

    handleOpenModalResetPassword = ({ original }) => {
        this.setState({ resetPassword: true, adminReset: original });
    }

    handleResetPassword = async () => {
        const { id } = this.state.adminReset;
        try {
            await apiPostAdmin('/admin/resetPassword', { adminId: id });
            this.setState({ success: true, resetPassword: false, adminReset: null });
        } catch (error) {
            console.log(error)
        }
    }

    handleCreateAdmin = (res) => {
        if (res) {
            this.setState({ success: true });
        } else {
            this.setState({ error: true });
        }
    }

    handleEditAdmin = (res) => {
        if (res) {
            this.setState({ success: true });
        } else {
            this.setState({ error: true });
        }
    }

    hideSuccessAlert = () => {
        this.handleCloseCreateModal();
        this.handleCloseEditModal();
        this.componentDidMount();
        this.setState({ success: false });
    }

    hideFailAlert = () => {
        this.setState({ error: false });
    }

    hideFailAlertReset = () => {
        this.setState({ resetPassword: false, adminReset: null });
    }

    handleSearchAdmin = (listAdmins, keySearch) => {
        if (keySearch !== '' && listAdmins.length > 0) {
            return listAdmins.filter(admin => matchString(admin.name, keySearch) || matchString(admin.username, keySearch));
        }
        return listAdmins;
    }

    handleChange = ({ target }) => {
        this.setState({ keySearch: target.value });
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
                Header: "Tên đăng nhập",
                accessor: "username",
                style: { textAlign: 'left' }
            },
            {
                Header: "Tên",
                accessor: "name",
                style: { textAlign: 'left' }
            },
            {
                Header: "Ngày sinh",
                accessor: "birthdate",
                Cell: props => <p> {moment(props.original.birthdate).format('DD/MM/YYYY')} </p>,
                style: { textAlign: 'left' }
            },
            {
                Header: "Loại nhân viên",
                accessor: "roles_admin.name",
                style: { textAlign: 'left' },
            },
            {
                Header: props => <i className="fa fa-pencil" />,
                Cell: props => {
                    return <button
                        className='btn btn-xs btn-success'
                        title="chỉnh sửa thông tin"
                        onClick={() => this.handleOpenEditModal(props)} >
                        <i className="fa fa-pencil" />
                    </button>
                },
                style: { textAlign: 'center' },
                width: 50,
                maxWidth: 70,
                minWidth: 50
            },
            {
                Header: props => <i className="fa fa-refresh" />,
                Cell: props => {
                    return <button
                        className='btn btn-xs btn-danger'
                        title="reset mật khẩu"
                        onClick={() => this.handleOpenModalResetPassword(props)} >
                        <i className="fa fa-refresh" />
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
                    title={this.state.message}
                    onConfirm={this.hideFailAlert}>
                    Vui Lòng Kiểm Tra Lại...
                </SweetAlert>}

                {this.state.resetPassword && <SweetAlert
                    warning
                    showCancel
                    confirmBtnText="Reset"
                    cancelBtnText="Hủy"
                    confirmBtnBsStyle="danger"
                    cancelBtnBsStyle="default"
                    // customIcon="thumbs-up.jpg"
                    title="Reset mật khẩu!!!"
                    onConfirm={this.handleResetPassword}
                    onCancel={this.hideFailAlertReset}
                >
                    Nhân viên: {this.state.adminReset.username}
                </SweetAlert>}

                <Modal
                    open={this.state.modalCreateIsOpen}
                    onClose={this.handleCloseCreateModal}
                    center
                    styles={{ 'modal': { width: '1280px' } }}
                    blockScroll={true} >
                    <CreateComponent handleCreateAdmin={this.handleCreateAdmin} />
                </Modal>

                <Modal
                    open={this.state.modalEditIsOpen}
                    onClose={this.handleCloseEditModal}
                    center
                    styles={{ 'modal': { width: '1280px' } }}
                    blockScroll={true} >
                    {this.state.adminEditing && <EditComponent
                        admin={this.state.adminEditing}
                        handleEditAdmin={this.handleEditAdmin}
                    />}
                </Modal>

                <section className="content-header content-header-page">
                    <h1> Danh Sách Admin </h1>
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
                                                    data={this.handleSearchAdmin(this.state.listAdmin, this.state.keySearch)}
                                                    columns={columns}
                                                    pageSizeOptions={[5, 10, 20, 25]}
                                                    defaultPageSize={10}
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