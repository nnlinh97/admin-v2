import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import SweetAlert from 'react-bootstrap-sweetalert';
import * as actions from './../../actions/index';
import { matchString } from '../../helper';
import { apiGet, apiPost } from './../../services/api';
import Modal from 'react-responsive-modal';
import CreateComponent from './create';
import EditComponent from './edit';
import './list.css';
import 'react-table/react-table.css';

class ListTypePassenger extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            success: false,
            modalCreateIsOpen: false,
            modalEditIsOpen: false,
            name: '',
            id: '',
            name_vi: '',
            keySearch: '',
            listTypePassenger: []
        }
    }

    async componentDidMount() {
        try {
            let listTypePassenger = await apiGet('/type_passenger/getAll');
            this.props.getListTypePassenger(listTypePassenger.data.data);
            console.log(listTypePassenger.data.data)
            this.setState({ listTypePassenger: listTypePassenger.data.data });
        } catch (error) {
            console.log(error);
        }
    }

    openEditModal = (props) => {
        this.setState({
            modalEditIsOpen: true,
            name: props.original.name,
            id: props.original.id,
            name_vi: props.original.name_vi
        });
    }

    closeEditModal = () => {
        this.setState({ modalEditIsOpen: false, id: null, name: '', name_vi: '' });
    }

    redirectToCreateTypePage = () => {
        this.setState({ modalCreateIsOpen: true });
    }

    handleOpenCreateModal = () => {
        this.setState({ modalCreateIsOpen: true });
    }

    closeCreateModal = () => {
        this.setState({ modalCreateIsOpen: false, name: '' });
    }

    handleCreate = async (type) => {
        if (type.name !== '' && type.name_vi !== '') {
            try {
                let newTypePassenger = await apiPost('/type_passenger/create', type);
                this.props.createTypePassenger(newTypePassenger.data);
                this.setState({ success: true });
            } catch (error) {
                this.setState({ error: true });
            }
        } else {
            this.setState({ error: true });
        }
    }

    handleEdit = async (type) => {
        if (type.id !== '' && type.name !== '') {
            try {
                let typePassenger = await apiPost('/type_passenger/update', type);
                this.props.editTypePassenger(typePassenger.data.data);
                this.setState({ success: true });
            } catch (error) {
                this.setState({ error: true });
            }
        } else {
            this.setState({ error: true });
        }
    }

    hideSuccessAlert = () => {
        this.setState({ success: false, modalCreateIsOpen: false, modalEditIsOpen: false });
    }

    hideFailAlert = () => {
        this.setState({ error: false });
    }

    handleChange = ({ target }) => {
        this.setState({ keySearch: target.value });
    }

    handleSearchTypePassenger = (listTypePassenger, keySearch) => {
        if (keySearch !== '' && listTypePassenger.length > 0) {
            return listTypePassenger.filter(type => matchString(type.name_vi, keySearch) || matchString(type.name, keySearch) || matchString(type.id.toString(), keySearch));
        }
        return listTypePassenger;
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
            // {
            //     Header: "ID",
            //     accessor: "id",
            //     Cell: props => <i>#{props.original.id}</i>,
            //     style: { textAlign: 'center' },
            //     width: 90,
            //     maxWidth: 100,
            //     minWidth: 80
            // },
            {
                Header: "Loại hành khách (EN)",
                accessor: "name",
                style: { textAlign: 'center' }
            },
            {
                Header: "Loại hành khách (VN)",
                accessor: "name_vi",
                style: { textAlign: 'center' }
            },
            {
                Header: props => <i className="fa fa-pencil" />,
                Cell: props => {
                    return <button className="btn btn-xs btn-success"
                        onClick={() => this.openEditModal(props)} >
                        <i className="fa fa-pencil" />
                    </button>
                },
                style: { textAlign: 'center' },
                width: 100,
                maxWidth: 100,
                minWidth: 100
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
                    onClose={this.closeCreateModal}
                    center
                    styles={{ 'modal': { width: '1280px' } }}
                    blockScroll={true} >
                    <CreateComponent handleCreate={this.handleCreate} />
                </Modal>

                <Modal
                    open={this.state.modalEditIsOpen}
                    onClose={this.closeEditModal}
                    center
                    styles={{ 'modal': { width: '1280px' } }}
                    blockScroll={true} >
                    <EditComponent
                        handleEdit={this.handleEdit}
                        name={this.state.name}
                        id={this.state.id}
                        name_vi={this.state.name_vi} />
                </Modal>

                <section className="content-header">
                    <h1> Danh Sách Loại Hành Khách </h1>
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
                                                    columns={columns}
                                                    data={this.handleSearchTypePassenger(this.props.listTypePassenger, this.state.keySearch)}
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
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        listTypePassenger: state.listTypePassenger
    }
}

const mapDispatchToProps = (dispatch, action) => {
    return {
        getListTypePassenger: (listTypePassenger) => dispatch(actions.getListTypePassenger(listTypePassenger)),
        createTypePassenger: (data) => dispatch(actions.createTypePassenger(data)),
        editTypePassenger: (data) => dispatch(actions.editTypePassenger(data))
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListTypePassenger));