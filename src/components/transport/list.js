import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import * as actions from './../../actions/index';
import { apiGet, apiPost } from '../../services/api';
import SweetAlert from 'react-bootstrap-sweetalert';
import Modal from 'react-responsive-modal';
import CreateComponent from './create';
import EditComponent from './edit';
import './list.css';

class ListTypesComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listTypes: [],
            modalCreateIsOpen: false,
            editModal: false,
            type: null,
            name_vn: '',
            name_en: '',
            error: false,
            success: false,
            id: null
        }
    }

    async componentDidMount() {
        let listTransport = this.props.listTransport;
        if (!listTransport.length) {
            listTransport = await apiGet('/transport/getAll');
            this.props.getListTransport(listTransport.data.data);
        }
    }

    openEditModal = (props) => {
        this.setState({
            editModal: true,
            name_vn: props.original.name_vn,
            name_en: props.original.name_en,
            id: props.original.id
        })
    }

    closeEditModal = () => {
        this.setState({
            editModal: false,
            id: null,
            name_vn: '',
            name_en: ''
        })
    }

    redirectToCreateTypePage = () => {
        // this.props.history.push('/type/create');
        this.setState({
            createModal: true
        })
    }

    openCreateModal = () => {
        this.setState({
            modalCreateIsOpen: true
        })
    }
    closeCreateModal = () => {
        this.setState({
            modalCreateIsOpen: false,
            name_vn: '',
            name_en: ''
        })
    }

    checkTransport = (name_vn, name_en) => {
        if (name_vn === '' || name_en === '') {
            return false;
        }
        return true;
    }

    handleCreate = async (name_vn, name_en) => {
        if (this.checkTransport(name_vn, name_en)) {
            try {
                let newTransport = await apiPost('/transport/create', {
                    name_vn: name_vn,
                    name_en: name_en
                });
                await this.props.createTransport(newTransport.data);
                this.setState({
                    success: true
                });
            } catch (error) {
                this.setState({
                    error: true
                });
            }
        } else {
            this.setState({
                error: true
            });
        }
    }

    handleEdit = async (name_vn, name_en) => {
        if (this.state.id && this.checkTransport(name_vn, name_en)) {
            try {
                let transport = await apiPost('/transport/update', {
                    id: this.state.id,
                    name_vn: name_vn,
                    name_en: name_en
                });
                await this.props.editTransport(transport.data.data);
                this.setState({
                    success: true
                });
            } catch (error) {
                this.setState({
                    error: true
                });
            }
        } else {
            this.setState({
                error: true
            });
        }

    }

    handleChange = (event) => {
        let target = event.target;
        let name = target.name;
        let value = target.value;
        this.setState({
            [name]: value
        });
    }


    hideSuccessAlert = () => {
        this.closeCreateModal();
        this.closeEditModal();
        this.setState({
            success: false
        });
    }

    hideFailAlert = () => {
        this.setState({
            error: false
        })
    }


    render() {
        const columns = [
            {
                Header: "ID",
                accessor: "id",
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
                Header: "NAME VN",
                accessor: "name_vn",
                sortable: false,
                filterable: true,
                style: {
                    textAlign: 'center'
                }
            },
            {
                Header: "NAME EN",
                accessor: "name_en",
                sortable: false,
                filterable: true,
                style: {
                    textAlign: 'center'
                }
            },
            {
                Header: props => <i className="fa fa-pencil" />,
                Cell: props => {
                    return (
                        <button className="btn btn-xs btn-success"
                            onClick={() => this.openEditModal(props)}
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
                width: 100,
                maxWidth: 100,
                minWidth: 100
            }
        ];
        const { createModal, editModal, name_vn, name_en } = this.state;
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
                    confirmBtnText="Hủy"
                    confirmBtnBsStyle="default"
                    title="Đã Có Lỗi Xảy Ra!"
                    onConfirm={this.hideFailAlert}>
                    Vui Lòng Kiểm Tra Lại...
                </SweetAlert>}
                <Modal
                    open={this.state.modalCreateIsOpen}
                    onClose={this.closeCreateModal}
                    center
                    styles={{ 'modal': { width: '1280px' } }}
                    blockScroll={true} >
                    <CreateComponent handleCreate={this.handleCreate} />
                </Modal>

                <Modal
                    open={editModal}
                    onClose={this.closeEditModal}
                    center
                    styles={{ 'modal': { width: '1280px' } }}
                    blockScroll={true} >
                    <EditComponent handleEdit={this.handleEdit} name_vn={name_vn} name_en={name_en} />
                </Modal>

                <section className="content-header">
                    <h1> Danh Sách Phương tiện Di Chuyển </h1>
                </section>
                <section className="content">
                    <div className="row">
                        <button
                            onClick={this.openCreateModal}
                            style={{ marginBottom: '2px', marginRight: '15px' }}
                            type="button"
                            className="btn btn-success pull-right">
                            <i className="fa fa-plus" />&nbsp;Create
                        </button>
                    </div>

                    {this.props.listTransport && <ReactTable
                        columns={columns}
                        data={this.props.listTransport ? this.props.listTransport : []}
                        defaultPageSize={10}
                        noDataText={'Please wait...'} >
                    </ReactTable>}

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
        listTransport: state.listTransport
    }
}

const mapDispatchToProps = (dispatch, action) => {
    return {
        changeLocationInfo: (info) => dispatch(actions.changeLocationInfo(info)),
        getListTypeLocation: (type) => dispatch(actions.getListTypeLocation(type)),
        createType: (type) => dispatch(actions.createType(type)),
        editType: (type) => dispatch(actions.editType(type)),
        getListTransport: (transport) => dispatch(actions.getListTransport(transport)),
        createTransport: (transport) => dispatch(actions.createTransport(transport)),
        editTransport: (transport) => dispatch(actions.editTransport(transport))
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListTypesComponent));