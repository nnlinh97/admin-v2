import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import SweetAlert from 'react-bootstrap-sweetalert';
import Modal from 'react-responsive-modal';
import * as actions from './../../actions/index';
import { apiGet, apiPost } from './../../services/api';
import CreateComponent from './create';
import EditComponent from './edit';
import { matchString } from '../../helper';
import './list.css';

class ListProvinceComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalCreateIsOpen: false,
            modalEditIsOpen: false,
            error: false,
            success: false,
            province: null,
            keySearch: ''
        };
    }

    async componentDidMount() {
        try {
            let listProvinces = await apiGet('/tour_classification/getAllProvinces_admin');
            listProvinces = listProvinces.data.data;
            this.props.getlistProvinces(listProvinces);
        } catch (error) {
            console.log(error);
        }
        try {
            let listCountries = await apiGet('/tour_classification/getAllCountries_admin');
            listCountries = listCountries.data.data;
            this.props.getListCountries(listCountries);
        } catch (error) {
            console.log(error);
        }
    }

    handleOpenEditModal = ({ original }) => {
        this.setState({ modalEditIsOpen: true, province: original });
    }

    handleCloseEditModal = () => {
        this.setState({ modalEditIsOpen: false, province: null });
    }

    handleOpenCreateModal = () => {
        this.setState({ modalCreateIsOpen: true });
    }

    handleCloseCreateModal = () => {
        this.setState({ modalCreateIsOpen: false });
    }

    handleEditProvince = async (name, country, id) => {
        if (id !== '' && name !== '' && country !== null) {
            try {
                let province = await apiPost('/tour_classification/updateProvince', {
                    id: id,
                    name: name,
                    fk_country: country.id
                });
                this.props.updateProvince(province.data.data);
                this.setState({ success: true });
            } catch (error) {
                this.setState({ error: true });
            }
        } else {
            this.setState({ error: true });
        }
    }

    handleCreateProvince = async (name, country) => {
        if (name !== '' && country !== '') {
            try {
                let province = await apiPost('/tour_classification/createProvince', { name: name, idCountry: country.id });
                await this.props.createProvince(province.data);
                this.setState({ success: true });
            } catch (error) {
                this.setState({ error: true });
            }
        } else {
            this.setState({ error: true });
        }
    }

    hideSuccessAlert = () => {
        this.handleCloseCreateModal();
        this.handleCloseEditModal();
        this.setState({ success: false });
    }

    hideFailAlert = () => {
        this.setState({ error: false });
    }

    handleChange = ({ target }) => {
        this.setState({ keySearch: target.value });
    }

    handleSearchProvince = (listProvinces, keySearch) => {
        if (keySearch !== '' && listProvinces.length > 0) {
            return listProvinces.filter(province => matchString(province.name, keySearch) || matchString(province.id.toString(), keySearch));
        }
        return listProvinces;
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
            //     width: 100,
            //     maxWidth: 100,
            //     minWidth: 100
            // },
            {
                Header: "Tỉnh Thành",
                accessor: "name",
                style: { textAlign: 'center' },
                sortable: false, 
                resizable: false, 
                filterable: false,
            },
            {
                Header: "Quốc Gia",
                accessor: "country.name",
                style: { textAlign: 'center' },
                sortable: false, 
                resizable: false, 
                filterable: false,
            },
            {
                Header: props => <i className="fa fa-pencil" />,
                Cell: props => {
                    return <button className="btn btn-xs btn-success"
                        onClick={() => this.handleOpenEditModal(props)}
                        title="chỉnh sửa" >
                        <i className="fa fa-pencil" />
                    </button>;
                },
                style: { textAlign: 'center' },
                sortable: false, 
                resizable: false, 
                filterable: false,
                width: 100,
                maxWidth: 100,
                minWidth: 100,
            }
        ];
        return <div style={{ minHeight: '100vh' }} className="content-wrapper">

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
                <CreateComponent
                    handleCreateProvince={this.handleCreateProvince}
                    listCountries={this.props.listCountries}
                />
            </Modal>

            <Modal
                open={this.state.modalEditIsOpen}
                onClose={this.handleCloseEditModal}
                center
                styles={{ 'modal': { width: '1280px' } }}
                blockScroll={true} >
                <EditComponent
                    handleEditProvince={this.handleEditProvince}
                    listCountries={this.props.listCountries}
                    province={this.state.province}
                />
            </Modal>

            <section className="content-header">
                <h1> Danh Sách Tỉnh Thành </h1>
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
                                                data={this.handleSearchProvince(this.props.listProvinces, this.state.keySearch)}
                                                pageSizeOptions={[5, 10, 20, 25]}
                                                defaultPageSize={10}
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
    }
}

const mapStateToProps = (state) => {
    return {
        listProvinces: state.listProvinces,
        listCountries: state.listCountries
    }
}

const mapDispatchToProps = (dispatch, action) => {
    return {
        getlistProvinces: (provinces) => dispatch(actions.getListProvinces(provinces)),
        updateProvince: (province) => dispatch(actions.updateProvince(province)),
        createProvince: (province) => dispatch(actions.createProvince(province)),
        getListCountries: (countries) => dispatch(actions.getListCountries(countries))
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListProvinceComponent));