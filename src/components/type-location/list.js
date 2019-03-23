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
        this.addOpacityBody();
        this.setState({
            editModal: true,
            name: props.original.name,
            marker: props.original.marker,
            id: props.original.id
        })
    }
    handleEdit = async () => {
        if (!this.state.id || this.state.name === '') {
            this.setState({
                error: true
            })
        } else {
            try {
                let typeEdit = await apiPost('/type/update', {
                    id: this.state.id,
                    name: this.state.name,
                    marker: this.state.marker
                });
                await this.props.editType(typeEdit.data.data);
                this.setState({
                    success: true
                })
            } catch (error) {
                console.log(error);
                this.setState({
                    error: true
                })
            }
        }
    }

    closeEditModal = () => {
        this.removeOpacityBody();
        this.setState({
            editModal: false,
            id: null,
            name: '',
            marker: ''
        })
    }

    redirectToCreateTypePage = () => {
        this.setState({
            createModal: true
        })
    }

    openCreateModal = () => {
        this.addOpacityBody();
        this.setState({
            createModal: true
        })
    }
    closeCreateModal = () => {
        this.removeOpacityBody();
        this.setState({
            createModal: false,
            name: '',
            marker: ''
        })
    }
    handleCreate = async () => {
        if (this.state.name === '') {
            this.setState({
                error: true
            })
        } else {
            try {
                let newType = await apiPost('/type/create', {
                    name: this.state.name,
                    marker: this.state.marker
                });
                await this.props.createType(newType.data);
                this.setState({
                    success: true
                })
            } catch (error) {
                console.log(error);
                this.setState({
                    error: true
                })
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

    addOpacityBody = () => {
        document.body.classList.toggle('no-scroll');
    }

    removeOpacityBody = () => {
        document.body.classList.remove('no-scroll');
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
                Header: "NAME",
                accessor: "name",
                sortable: true,
                filterable: true,
                style: {
                    textAlign: 'center'
                }
            },
            {
                Header: "MARKER",
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
        const { createModal, editModal, name, marker } = this.state;
        return (
            <div style={{ height: '100vh' }} className="content-wrapper">
                {this.state.success &&
                    <SweetAlert success title="Successfully" onConfirm={this.hideSuccessAlert}>
                        Continute...
                </SweetAlert>
                }
                {this.state.error &&
                    <SweetAlert
                        warning
                        confirmBtnText="Cancel"
                        confirmBtnBsStyle="default"
                        title="Something went wrong!"
                        onConfirm={this.hideFailAlert}
                    >
                        Please check carefully!
                </SweetAlert>
                }
                <div style={{ display: createModal ? "block" : "none" }} className="example-modal">
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
                                                <label htmlFor="inputEmail3" className="col-sm-2 control-label">Name</label>
                                                <div className="col-sm-10">
                                                    <input required onChange={this.handleChange} name="name" value={name} type="text" className="form-control" id="inputEmail3" placeholder="Name" />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="inputPassword3" className="col-sm-2 control-label">Marker</label>
                                                <div className="col-sm-10">
                                                    <input onChange={this.handleChange} name="marker" value={marker} type="text" className="form-control" id="inputPassword3" placeholder="Marker" />
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

                <div style={{ display: editModal ? "block" : "none" }} className="example-modal">
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
                                                <label htmlFor="inputEmail" className="col-sm-2 control-label">Name</label>
                                                <div className="col-sm-10">
                                                    <input onChange={this.handleChange} name="name" type="text" className="form-control" id="inputEmail" placeholder="Name" value={name} />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="inputPassword" className="col-sm-2 control-label">Marker</label>
                                                <div className="col-sm-10">
                                                    <input onChange={this.handleChange} name="marker" type="text" className="form-control" id="inputPassword" placeholder="Marker" value={marker} />
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
                <section style={{ opacity: (createModal || editModal) ? '0.5' : '1' }} className="content-header">
                    <h1>
                        List Type
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