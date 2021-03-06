import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import SweetAlert from 'react-bootstrap-sweetalert';
import Modal from 'react-responsive-modal';
import * as actions from './../../actions/index';
import { apiGet, apiPost } from '../../services/api';
import { matchString } from '../../helper';
import CreateComponent from './create';
import EditComponent from './edit';
import 'react-table/react-table.css';
import './list.css';

class ListTypesComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalCreateIsOpen: false,
            modalEditIsOpen: false,
            transport: null,
            error: false,
            success: false,
            keySearch: ''
        };
    }

    async componentDidMount() {
        let listTransport = this.props.listTransport;
        if (!listTransport.length) {
            listTransport = await apiGet('/transport/getAll');
            this.props.getListTransport(listTransport.data.data);
        }
    }

    handleOpenEditModal = ({ original }) => {
        this.setState({ modalEditIsOpen: true, transport: original });
    }

    handleCloseEditModal = () => {
        this.setState({ modalEditIsOpen: false, transport: null });
    }

    handleOpenCreateModal = () => {
        this.setState({ modalCreateIsOpen: true });
    }

    handleCloseCreateModal = () => {
        this.setState({ modalCreateIsOpen: false });
    }

    checkTransportCreate = (transport) => {
        if (transport.name_vn === '' || transport.name_en === '') {
            return false;
        }
        return true;
    }

    handleCreateTransport = async (transport) => {
        if (this.checkTransportCreate(transport)) {
            try {
                let newTransport = await apiPost('/transport/create', transport);
                await this.props.createTransport(newTransport.data);
                this.setState({ success: true });
            } catch (error) {
                this.setState({ error: true });
            }
        } else {
            this.setState({ error: true });
        }
    }

    checkTransportEdit = (transport) => {
        if (transport.id === '' || transport.name_vn === '' || transport.name_en === '') {
            return false;
        }
        return true;
    }

    handleEditTransport = async (transport) => {
        if (this.checkTransportEdit(transport)) {
            try {
                let newTransport = await apiPost('/transport/update', transport);
                await this.props.editTransport(newTransport.data.data);
                this.setState({ success: true });
            } catch (error) {
                this.setState({ error: true });
            }
        } else {
            this.setState({ error: true });
        }
    }

    handleChange = (event) => {
        let target = event.target;
        let name = target.name;
        let value = target.value;
        this.setState({ [name]: value });
    }

    handleSearchTransport = (listTransport, keySearch) => {
        if (keySearch !== '' && listTransport.length > 0) {
            return listTransport.filter(transport => matchString(transport.name_en, keySearch) || matchString(transport.name_vn, keySearch) || matchString(transport.id.toString(), keySearch));
        }
        return listTransport;
    }

    hideSuccessAlert = () => {
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
                sortable: false,
                resizable: false,
                filterable: false,
                width: 80,
                maxWidth: 80,
                minWidth: 80
            },
            // {
            //     Header: "ID",
            //     accessor: "id",
            //     Cell: props => <i>#{props.original.id}</i>,
            //     style: { textAlign: 'center' },
            //     sortable: false, 
            //     resizable: false, 
            //     filterable: false,
            //     width: 100,
            //     maxWidth: 100,
            //     minWidth: 100
            // },
            {
                Header: "Tên Tiếng Việt",
                accessor: "name_vn",
                style: { textAlign: 'center' },
                sortable: false,
                resizable: false,
                filterable: false,
            },
            {
                Header: "Tên Tiếng Anh",
                accessor: "name_en",
                style: { textAlign: 'center' },
                sortable: false,
                resizable: false,
                filterable: false,
            },
            {
                Header: props => <i className="fa fa-pencil" />,
                Cell: props => {
                    return (
                        <button className="btn btn-xs btn-success"
                            onClick={() => this.handleOpenEditModal(props)}
                        >
                            <i className="fa fa-pencil" />
                        </button>
                    )
                },
                style: { textAlign: 'center' },
                sortable: false,
                resizable: false,
                filterable: false,
                width: 100,
                maxWidth: 100,
                minWidth: 100
            }
        ];
        return <div style={{ height: '100vh' }} className="content-wrapper">

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
                <CreateComponent handleCreateTransport={this.handleCreateTransport} />
            </Modal>

            <Modal
                open={this.state.modalEditIsOpen}
                onClose={this.handleCloseEditModal}
                center
                styles={{ 'modal': { width: '1280px' } }}
                blockScroll={true} >
                <EditComponent handleEditTransport={this.handleEditTransport} transport={this.state.transport} />
            </Modal>

            <section className="content-header content-header-page">
                <h1> Danh Sách Phương tiện Di Chuyển </h1>
                <div className="right_header">
                    <button
                        onClick={this.handleOpenCreateModal}
                        style={{ marginBottom: '2px', marginRight: '15px' }}
                        type="button"
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
                                                columns={columns}
                                                data={this.handleSearchTransport(this.props.listTransport, this.state.keySearch)}
                                                pageSizeOptions={[5, 10, 20, 25]}
                                                defaultPageSize={5}
                                                noDataText={'Vui lòng đợi...'}
                                                previousText={'Trang trước'}
                                                nextText={'Trang sau'}
                                                pageText={'Trang'}
                                                ofText={'/'}
                                                rowsText={'dòng'}  >
                                            </ReactTable>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </div>;
    }
}

const mapStateToProps = (state) => {
    return {
        listTransport: state.listTransport
    }
}

const mapDispatchToProps = (dispatch, action) => {
    return {
        getListTransport: (transport) => dispatch(actions.getListTransport(transport)),
        createTransport: (transport) => dispatch(actions.createTransport(transport)),
        editTransport: (transport) => dispatch(actions.editTransport(transport))
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListTypesComponent));