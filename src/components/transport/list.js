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
import { apiGet, apiPost } from '../../services/api';
import SweetAlert from 'react-bootstrap-sweetalert';

class ListTypesComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listTypes: [],
            createModal: false,
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
        if (!listTransport) {
            listTransport = await apiGet('/transport/getAll');
            await this.props.getListTransport(listTransport.data.data);
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
    handleEdit = async () => {
        if (this.state.id && this.checkTransport()) {
            try {
                let transport = await apiPost('/transport/update', {
                    id: this.state.id,
                    name_vn: this.state.name_vn,
                    name_en: this.state.name_en
                });
                await this.props.editTransport(transport.data.data);
                this.setState({
                    success: true
                });
            } catch (error) {
                console.log(error);
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
            createModal: true
        })
    }
    closeCreateModal = () => {
        this.setState({
            createModal: false,
            name_vn: '',
            name_en: ''
        })
    }

    checkTransport = () => {
        const { name_vn, name_en } = this.state;
        if (name_vn === '' || name_en === '') {
            return false;
        }
        return true;
    }

    handleCreate = async () => {
        if (this.checkTransport()) {
            const { name_vn, name_en } = this.state;
            try {
                let newTransport = await apiPost('/transport/create', {
                    name_vn: name_vn,
                    name_en: name_en
                });
                console.log(newTransport.data);
                await this.props.createTransport(newTransport.data);
                this.setState({
                    success: true
                });
            } catch (error) {
                console.log(error);
                this.setState({
                    error: true
                })
            }
        } else {
            this.setState({
                error: true
            })
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
        this.setState({
            success: false,
            createModal: false,
            editModal: false
        })
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
                        <button className="btn btn-success"
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
                {this.state.success &&
                    <SweetAlert success title="Successfully" onConfirm={this.hideSuccessAlert}>
                        hihihehehaha
                </SweetAlert>
                }
                {this.state.error &&
                    <SweetAlert
                        warning
                        confirmBtnText="Cancel"
                        confirmBtnBsStyle="default"
                        title="Fail!!!!!"
                        onConfirm={this.hideFailAlert}
                    >
                        Please check carefully!
                </SweetAlert>
                }
                {this.state.createModal &&
                    <div className="example-modal">
                        <div className="modal">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <button onClick={this.closeCreateModal} type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">×</span></button>
                                        <h4 className="modal-title">Create Type</h4>
                                    </div>
                                    <div className="modal-body">
                                        <form className="form-horizontal">
                                            <div className="box-body">
                                                <div className="form-group">
                                                    <label htmlFor="inputEmail3" className="col-sm-2 control-label">Name VN</label>
                                                    <div className="col-sm-10">
                                                        <input required onChange={this.handleChange} name="name_vn" value={name_vn} type="text" className="form-control" />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="inputPassword3" className="col-sm-2 control-label">Name EN</label>
                                                    <div className="col-sm-10">
                                                        <input onChange={this.handleChange} name="name_en" value={name_en} type="text" className="form-control" />
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="modal-footer">
                                        <button onClick={this.closeCreateModal} type="button" className="btn btn-default pull-left" data-dismiss="modal">Close</button>
                                        <button onClick={this.handleCreate} type="button" className="btn btn-primary">Save changes</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }


                {this.state.editModal &&
                    <div className="example-modal">
                        <div className="modal">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <button onClick={this.closeEditModal} type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">×</span></button>
                                        <h4 className="modal-title">Edit Type</h4>
                                    </div>
                                    <div className="modal-body">
                                        <form className="form-horizontal">
                                            <div className="box-body">
                                                <div className="form-group">
                                                    <label htmlFor="inputEmail" className="col-sm-2 control-label">Name VN</label>
                                                    <div className="col-sm-10">
                                                        <input onChange={this.handleChange} name="name_vn" type="text" className="form-control" value={name_vn} />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="inputPassword" className="col-sm-2 control-label">Name EN</label>
                                                    <div className="col-sm-10">
                                                        <input onChange={this.handleChange} name="name_en" type="text" className="form-control" value={name_en} />
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="modal-footer">
                                        <button onClick={this.closeEditModal} type="button" className="btn btn-default pull-left" data-dismiss="modal">Close</button>
                                        <button onClick={this.handleEdit} type="button" className="btn btn-primary">Save changes</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }

                <section style={{ opacity: (createModal || editModal) ? '0.5' : '1' }} className="content-header">
                    <h1>
                        List Transport
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
                            className="btn btn-success pull-right">
                            <i className="fa fa-plus" />&nbsp;Create
                        </button>
                    </div>

                    {this.props.listTransport &&
                        <ReactTable
                            columns={columns}
                            data={this.props.listTransport ? this.props.listTransport : []}
                            defaultPageSize={10}
                            noDataText={'Please wait...'}
                        >
                        </ReactTable>
                    }

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
        getAllType: (type) => dispatch(actions.getAllType(type)),
        getAllLocation: (locations) => dispatch(actions.getAllLocation(locations)),
        createType: (type) => dispatch(actions.createType(type)),
        editType: (type) => dispatch(actions.editType(type)),
        getListTransport: (transport) => dispatch(actions.getListTransport(transport)),
        createTransport: (transport) => dispatch(actions.createTransport(transport)),
        editTransport: (transport) => dispatch(actions.editTransport(transport))
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListTypesComponent));