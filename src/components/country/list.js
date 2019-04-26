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
import './modal.css';
import './list.css';

class ListCountryComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listCountries: [],
            modalCreateIsOpen: false,
            modalEditIsOpen: false,
            error: false,
            success: false,
            keySearch: '',
            id: ''
        }
    }

    async componentDidMount() {
        let { listCountries } = this.props;
        if (!listCountries.length) {
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

    handleOpenEditModal = ({ original }) => {
        this.setState({
            modalEditIsOpen: true,
            name: original.name,
            marker: original.marker,
            id: original.id
        });
    }

    handleCloseEditModal = () => {
        this.setState({
            modalEditIsOpen: false,
            id: '',
            name: ''
        });
    }

    handleOpenCreateModal = () => {
        this.setState({ modalCreateIsOpen: true });
    }

    handleCloseCreateModal = () => {
        this.setState({ modalCreateIsOpen: false, name: '' });
    }

    handleEditCountry = async (name, id) => {
        if (id === '' || name === '') {
            this.setState({ error: true });
        } else {
            try {
                let country = await apiPost('/tour_classification/updateCountry', { id: id, name: name });
                await this.props.updateCountry(country.data.data);
                this.setState({ success: true });
            } catch (error) {
                this.setState({ error: true });
            }
        }
    }

    handleCreateCountry = async (name) => {
        if (name !== '') {
            try {
                let country = await apiPost('/tour_classification/createCountry', { name });
                await this.props.createCountry(country.data);
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

    handleSearchCountry= (listCountries, keySearch) => {
        if (keySearch !== '' && listCountries.length > 0) {
            return listCountries.filter(country => matchString(country.name, keySearch) || matchString(country.id.toString(), keySearch));
        }
        return listCountries;
    }

    render() {
        const columns = [
            {
                Header: "ID",
                accessor: "id",
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
                            onClick={() => this.handleOpenEditModal(props)}
                            title="chỉnh sửa" >
                            <i className="fa fa-pencil" />
                        </button>
                    )
                },
                style: {
                    textAlign: 'center'
                },
                width: 100,
                maxWidth: 100,
                minWidth: 100
            }
        ];
        return (
            <div style={{ height: '90vh' }} className="content-wrapper">

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
                    <CreateComponent handleCreateCountry={this.handleCreateCountry} />
                </Modal>

                <Modal
                    open={this.state.modalEditIsOpen}
                    onClose={this.handleCloseEditModal}
                    center
                    styles={{ 'modal': { width: '1280px' } }}
                    blockScroll={true} >
                    <EditComponent
                        handleEditCountry={this.handleEditCountry}
                        name={this.state.name}
                        id={this.state.id}
                    />
                </Modal>

                <section className="content-header">
                    <h1>
                        Danh sách Quốc Gia
                    </h1>
                </section>
                <section className="content">
                    <div className="row">
                        <div style={{ width: '150px', float: 'left' }}>
                            <input
                                type="text"
                                onChange={this.handleChange}
                                value={this.state.keySearch}
                                name="title"
                                className="form-control"
                                placeholder="tìm kiếm..."
                            />
                        </div>
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

                    <ReactTable
                        columns={columns}
                        data={this.handleSearchCountry(this.props.listCountries, this.state.keySearch)}
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
        listCountries: state.listCountries
    };
}

const mapDispatchToProps = (dispatch, action) => {
    return {
        getListCountries: (countries) => dispatch(actions.getListCountries(countries)),
        updateCountry: (country) => dispatch(actions.updateCountry(country)),
        createCountry: (country) => dispatch(actions.createCountry(country))
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListCountryComponent));