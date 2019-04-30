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
                Header: "ID",
                accessor: "id",
                style: { textAlign: 'center' },
                width: 100,
                maxWidth: 100,
                minWidth: 100
            },
            {
                Header: "Tên Tiếng Việt",
                accessor: "name_vn",
                style: { textAlign: 'center' }
            },
            {
                Header: "Tên Tiếng Anh",
                accessor: "name_en",
                style: { textAlign: 'center' }
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

            <section className="content-header">
                <h1> Danh Sách Phương tiện Di Chuyển </h1>
                <div className="right_header">
                    <button
                        onClick={this.handleOpenCreateModal}
                        style={{ marginBottom: '2px', marginRight: '15px' }}
                        type="button"
                        className="btn btn-success pull-right">
                        <i className="fa fa-plus" />&nbsp;Create
                        </button>
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
                        name="keySearch"
                        className="search_input"
                        placeholder="Tìm kiếm..."
                    />
                    {this.state.keySearch !== '' && <div class="search_result_count">
                        <span>{this.handleSearchTransport(this.props.listTransport, this.state.keySearch).length} </span>results
                    </div>}
                </div>

                <ReactTable
                    columns={columns}
                    data={this.handleSearchTransport(this.props.listTransport, this.state.keySearch)}
                    defaultPageSize={10}
                    noDataText={'Please wait...'} >
                </ReactTable>
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