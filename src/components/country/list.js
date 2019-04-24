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

class ListTypesComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listCountries: [],
            createModal: false,
            editModal: false,
            error: false,
            success: false
        }
    }

    async componentDidMount() {
        let { listCountries } = this.props;
        if (!listCountries) {
            try {
                listCountries = await apiGet('/tour_classification/getAllCountries_admin');
                listCountries = listCountries.data.data;
                this.props.getListCountries(listCountries);
            } catch (error) {
                console.log(error);
            }
        }
        this.setState({ listCountries });
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
                let country = await apiPost('/tour_classification/updateCountry', {
                    id: this.state.id,
                    name: name
                });
                await this.props.updateCountry(country.data.data);
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
                let country = await apiPost('/tour_classification/createCountry', { name });
                await this.props.createCountry(country.data);
                this.setState({ success: true });
            } catch (error) {
                this.setState({ error: true });
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
                Header: "Tên Quốc Gia",
                accessor: "name",
                sortable: true,
                filterable: true,
                style: {
                    textAlign: 'left',
                    marginLeft: '50px'
                }
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
        const { createModal, editModal, name } = this.state;
        const { listCountries } = this.props;
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
                    <EditComponent handleEdit={this.handleEdit} name={name} />
                </Modal>

                <section style={{ opacity: (createModal || editModal) ? '0.5' : '1' }} className="content-header">
                    <h1>
                        Danh sách Quốc Gia
                    </h1>
                </section>
                <section style={{ opacity: (createModal || editModal) ? '0.5' : '1' }} className="content">
                    <div className="row">
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

                    <ReactTable
                        columns={columns}
                        data={listCountries ? listCountries : []}
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
        allLocation: state.allLocation,
        listCountries: state.listCountries
    }
}

const mapDispatchToProps = (dispatch, action) => {
    return {
        changeLocationInfo: (info) => dispatch(actions.changeLocationInfo(info)),
        getAllType: (type) => dispatch(actions.getAllType(type)),
        getAllLocation: (locations) => dispatch(actions.getAllLocation(locations)),
        createType: (type) => dispatch(actions.createType(type)),
        editType: (type) => dispatch(actions.editType(type)),
        getListCountries: (countries) => dispatch(actions.getListCountries(countries)),
        updateCountry: (country) => dispatch(actions.updateCountry(country)),
        createCountry: (country) => dispatch(actions.createCountry(country))
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListTypesComponent));