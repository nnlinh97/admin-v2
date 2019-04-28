import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
// import Modal from 'react-bootstrap-modal';
import './modal.css';
import * as actions from './../../actions/index';
import { URL } from '../../constants/url';
import axios from 'axios';
import { apiGet, apiPost } from './../../services/api';
import SweetAlert from 'react-bootstrap-sweetalert';
import Modal from 'react-responsive-modal';
import CreateComponent from './create';
import EditComponent from './edit';
import './list.css';
import './../../custom.css';

class ListTypesComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listTypes: [],
            createModal: false,
            editModal: false,
            type: null,
            name: '',
            marker: '',
            error: false,
            success: false
        }
    }

    async componentDidMount() {
        try {
            let listType = await apiGet('/type/getAll');
            this.props.getAllType(listType.data.data);
        } catch (error) {
            console.log(error);
        }
    }

    openEditModal = (props) => {
        this.setState({
            editModal: true,
            name: props.original.name,
            marker: props.original.marker,
            id: props.original.id
        })
    }

    closeEditModal = () => {
        this.setState({
            editModal: false,
            id: null,
            name: '',
            marker: ''
        });
    }

    redirectToCreateTypePage = () => {
        this.setState({
            createModal: true
        })
    }

    openCreateModal = () => {
        this.setState({
            createModal: true
        })
    }

    closeCreateModal = () => {
        this.setState({
            createModal: false,
            name: '',
            marker: ''
        })
    }

    handleEdit = async (name, marker) => {
        if (!this.state.id || name === '') {
            this.setState({
                error: true
            });
        } else {
            try {
                let typeEdit = await apiPost('/type/update', {
                    id: this.state.id,
                    name: name,
                    marker: marker
                });
                await this.props.editType(typeEdit.data.data);
                this.setState({
                    success: true
                });
            } catch (error) {
                this.setState({
                    error: true
                });
            }
        }
    }

    handleCreate = async (name, marker) => {
        if (name === '') {
            this.setState({
                error: true
            });
        } else {
            try {
                let newType = await apiPost('/type/create', {
                    name: name,
                    marker: marker
                });
                await this.props.createType(newType.data);
                this.setState({
                    success: true
                });
            } catch (error) {
                this.setState({
                    error: true
                });
            }
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
        });
    }

    render() {
        const columns = [
            {
                Header: "ID",
                accessor: "id",
                sortable: true,
                filterable: true,
                style: {
                    textAlign: 'center'
                },
                width: 100,
                maxWidth: 100,
                minWidth: 100
            },
            {
                Header: "Tên Tiếng Việt",
                accessor: "name",
                sortable: true,
                filterable: true,
                style: {
                    textAlign: 'center'
                }
            },
            {
                Header: "Tên Tiếng Anh",
                accessor: "marker",
                sortable: true,
                filterable: true,
                style: {
                    textAlign: 'center'
                },
                width: 300,
                maxWidth: 300,
                minWidth: 300
            },
            {
                Header: props => <i className="fa fa-pencil" />,
                Cell: props => {
                    return (
                        <button className="btn btn-xs btn-success"
                            onClick={() => this.openEditModal(props)}
                            title="chỉnh sửa"
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
        const { createModal, editModal, name, marker } = this.state;
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
                    open={createModal}
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
                    blockScroll={true}
                >
                    <EditComponent handleEdit={this.handleEdit} name={name} marker={marker} />
                </Modal>

                <section style={{ opacity: (createModal || editModal) ? '0.5' : '1' }} className="content-header">
                    <h1>
                        Danh Sách Loại Địa Điểm
                    </h1>
                    <div className="right_header">
                        <button
                            onClick={this.openCreateModal}
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
                <section style={{ opacity: (createModal || editModal) ? '0.5' : '1' }} className="content">
                    <ReactTable
                        columns={columns}
                        data={this.props.allType ? this.props.allType : []}
                        defaultPageSize={10}
                        noDataText={'Please wait...'}
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
        allLocation: state.allLocation
    }
}

const mapDispatchToProps = (dispatch, action) => {
    return {
        changeLocationInfo: (info) => dispatch(actions.changeLocationInfo(info)),
        getAllType: (type) => dispatch(actions.getAllType(type)),
        getAllLocation: (locations) => dispatch(actions.getAllLocation(locations)),
        createType: (type) => dispatch(actions.createType(type)),
        editType: (type) => dispatch(actions.editType(type))
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListTypesComponent));