import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import SweetAlert from 'react-bootstrap-sweetalert';
import Modal from 'react-responsive-modal';
import * as actions from './../../actions/index';
import { apiGet, apiPost } from './../../services/api';
import { matchString } from '../../helper';
import CreateComponent from './create';
import EditComponent from './edit';
import './list.css';

class ListTypesComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalCreateIsOpen: false,
            modalEditIsOpen: false,
            type: null,
            error: false,
            success: false,
            keySearch: ''
        }
    }

    async componentDidMount() {
        let { listTypeLocation } = this.props;
        if (!listTypeLocation.length) {
            try {
                listTypeLocation = await apiGet('/type/getAll');
                this.props.getListTypeLocation(listTypeLocation.data.data);
            } catch (error) {
                console.log(error);
            }
        }
    }

    handleOpenEditModal = ({ original }) => {
        this.setState({ modalEditIsOpen: true, type: original });
    }

    handleCloseEditModal = () => {
        this.setState({ modalEditIsOpen: false, type: null });
    }

    handleOpenCreateModal = () => {
        this.setState({ modalCreateIsOpen: true });
    }

    handleCloseCreateModal = () => {
        this.setState({ modalCreateIsOpen: false, name: '', marker: '' });
    }

    handleEditTypeLocation = async (type) => {
        if (type.id !== '' && type.name !== '') {
            try {
                let typeEdit = await apiPost('/type/update', type);
                this.props.editType(typeEdit.data.data);
                this.setState({ success: true });
            } catch (error) {
                this.setState({ error: true });
            }
        } else {
            this.setState({ error: true });
        }
    }

    handleCreateTypeLocation = async (type) => {
        if (type.name !== '') {
            try {
                let newType = await apiPost('/type/create', type);
                this.props.createType(newType.data);
                this.setState({ success: true });
            } catch (error) {
                this.setState({ error: true });
            }
        } else {
            this.setState({ error: true });
        }
    }

    handleChange = ({ target }) => {
        this.setState({ keySearch: target.value });
    }

    handleSearchTypeLocation = (listTypeLocation, keySearch) => {
        if (keySearch !== '' && listTypeLocation.length > 0) {
            return listTypeLocation.filter(type => matchString(type.name, keySearch) || matchString(type.marker, keySearch) || matchString(type.id.toString(), keySearch));
        }
        return listTypeLocation;
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
                accessor: "name",
                style: { textAlign: 'center' },
            },
            {
                Header: "Tên Tiếng Anh",
                accessor: "marker",
                style: { textAlign: 'center' },
                width: 300,
                maxWidth: 300,
                minWidth: 300
            },
            {
                Header: props => <i className="fa fa-pencil" />,
                Cell: props => {
                    return (
                        <button className="btn btn-xs btn-success"
                            onClick={() => this.handleOpenEditModal(props)}
                            title="chỉnh sửa" >
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
        return (
            <div style={{ height: '100vh' }} className="content-wrapper">

                {this.state.success && <SweetAlert
                    success
                    title="Lưu Thành Công"
                    onConfirm={this.hideSuccessAlert}>
                    Tiếp Tục...
                </SweetAlert>}

                {this.state.error && <SweetAlert
                    warning
                    confirmBtnText="Cancel"
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
                    <CreateComponent handleCreateTypeLocation={this.handleCreateTypeLocation} />
                </Modal>

                <Modal
                    open={this.state.modalEditIsOpen}
                    onClose={this.handleCloseEditModal}
                    center
                    styles={{ 'modal': { width: '1280px' } }}
                    blockScroll={true} >
                    <EditComponent handleEditTypeLocation={this.handleEditTypeLocation} type={this.state.type} />
                </Modal>

                <section className="content-header">
                    <h1> Danh Sách Loại Địa Điểm </h1>
                    <div className="right_header">
                        <button
                            onClick={this.handleOpenCreateModal}
                            style={{ marginBottom: '2px', marginRight: '15px' }}
                            type="button"
                            title="thêm mới"
                            className="btn btn-success pull-right">
                            <i className="fa fa-plus" />&nbsp;Thêm
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
                            name="title"
                            className="search_input"
                            placeholder="Tìm kiếm..."
                        />
                        {this.state.keySearch !== '' && <div class="search_result_count">
                            <span>{this.handleSearchTypeLocation(this.props.listTypeLocation, this.state.keySearch).length} </span>results
                        </div>}
                    </div>

                    <ReactTable
                        columns={columns}
                        data={this.handleSearchTypeLocation(this.props.listTypeLocation, this.state.keySearch)}
                        defaultPageSize={10}
                        noDataText={'Please wait...'} >
                    </ReactTable>
                </section>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        listTypeLocation: state.listTypeLocation,
    }
}

const mapDispatchToProps = (dispatch, action) => {
    return {
        getListTypeLocation: (list) => dispatch(actions.getListTypeLocation(list)),
        createType: (type) => dispatch(actions.createType(type)),
        editType: (type) => dispatch(actions.editType(type))
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListTypesComponent));