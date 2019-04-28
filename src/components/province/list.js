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
            listProvinces: [],
            createModal: false,
            editModal: false,
            error: false,
            success: false,
            country: ''
        }
    }

    async componentDidMount() {
        let { listProvinces, listCountries } = this.props;
        if (!listProvinces) {
            try {
                listProvinces = await apiGet('/tour_classification/getAllProvinces_admin');
                listProvinces = listProvinces.data.data;
                console.log(listProvinces);
                this.props.getlistProvinces(listProvinces);
            } catch (error) {
                console.log(error);
            }
        }
        if (!listCountries) {
            try {
                listCountries = await apiGet('/tour_classification/getAllCountries_admin');
                listCountries = listCountries.data.data;
                this.props.getListCountries(listCountries);
            } catch (error) {
                console.log(error);
            }
        }
        this.setState({ listProvinces });
    }

    openEditModal = (props) => {
        this.setState({
            editModal: true,
            name: props.original.name,
            marker: props.original.marker,
            id: props.original.id,
            country: props.original.country
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
        this.setState({ createModal: true })
    }

    openCreateModal = () => {
        this.setState({ createModal: true })
    }

    closeCreateModal = () => {
        this.setState({
            createModal: false,
            name: '',
            marker: ''
        })
    }

    handleEdit = async (name, country) => {
        if (!this.state.id || name === '' || country === '') {
            this.setState({ error: true });
        } else {
            try {
                let province = await apiPost('/tour_classification/updateProvince', { 
                    id: this.state.id, 
                    name: name,
                    fk_country: country.id
                 });
                await this.props.updateProvince(province.data.data);
                this.setState({ success: true });
            } catch (error) {
                this.setState({ error: true });
            }
        }
    }

    handleCreate = async (name, country) => {
        if (name === '' || country === '') {
            this.setState({ error: true });
        } else {
            try {
                let province = await apiPost('/tour_classification/createProvince', { name: name, idCountry: country.id });
                await this.props.createProvince(province.data);
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
                Header: "Tỉnh Thành",
                accessor: "name",
                sortable: true,
                filterable: true,
                style: {
                    textAlign: 'center'
                }
            },
            {
                Header: "Quốc Gia",
                accessor: "country.name",
                sortable: true,
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
        const { createModal, editModal, name, country } = this.state;
        const { listProvinces, listCountries } = this.props;
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
                    <CreateComponent handleCreate={this.handleCreate} listCountries={listCountries ? listCountries : []} />
                </Modal>

                <Modal
                    open={editModal}
                    onClose={this.closeEditModal}
                    center
                    styles={{ 'modal': { width: '1280px' } }}
                    blockScroll={true}
                >
                    <EditComponent 
                    handleEdit={this.handleEdit} 
                    name={name} 
                    listCountries={listCountries ? listCountries : []} 
                    country={country}
                    />
                </Modal>

                <section style={{ opacity: (createModal || editModal) ? '0.5' : '1' }} className="content-header">
                    <h1>
                        Danh Sách Tỉnh Thành
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
                        data={listProvinces ? listProvinces : []}
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
        listProvinces: state.listProvinces,
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
        getlistProvinces: (provinces) => dispatch(actions.getListProvinces(provinces)),
        updateProvince: (province) => dispatch(actions.updateProvince(province)),
        createProvince: (province) => dispatch(actions.createProvince(province)),
        getListCountries: (countries) => dispatch(actions.getListCountries(countries))
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListTypesComponent));