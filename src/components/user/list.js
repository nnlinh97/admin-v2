import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import * as actions from './../../actions/index';
import {
    apiGet,
    // apiPost
} from './../../services/api';
// import SweetAlert from 'react-bootstrap-sweetalert';
import Modal from 'react-responsive-modal';
import InfoUser from './info';
import './list.css';

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
        if (!this.props.listUser) {
            try {
                let listUser = await apiGet('/user/getAllUser');
                this.props.getListUser(listUser.data.data);
            } catch (error) {
                console.log(error);
            }
        }
    }

    openEditModal = (props) => {
        this.setState({
            editModal: true,
            user: props.original
        });
    }

    closeEditModal = () => {
        this.setState({
            editModal: false,
            user: null
        })
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
            {
                Header: "ID",
                accessor: "id",
                Cell: props => <i>#{props.original.id}</i>,
                style: { textAlign: 'center' },
                width: 90,
                maxWidth: 100,
                minWidth: 80
            },
            {
                Header: "USERNAME",
                accessor: "username",
                sortable: false,
                filterable: true,
                style: {
                    textAlign: 'center'
                },
                width: 150,
                maxWidth: 150,
                minWidth: 150
            },
            {
                Header: "FULLNAME",
                accessor: "fullname",
                sortable: false,
                filterable: true,
                style: {
                    textAlign: 'center'
                },
                width: 300,
                maxWidth: 300,
                minWidth: 300
            },
            {
                Header: "PHONE",
                accessor: "phone",
                sortable: false,
                filterable: true,
                style: {
                    textAlign: 'center'
                },
                width: 300,
                maxWidth: 300,
                minWidth: 300
            },
            {
                Header: "EMAIL",
                accessor: "email",
                sortable: false,
                filterable: true,
                style: {
                    textAlign: 'center'
                }
            },
            {
                Header: "STATUS",
                Cell: props => {
                    const status = props.original.isActive ? 'active' : 'inactive';
                    const css = props.original.isActive ? 'info' : 'default';
                    return (
                        <h4>
                            <label className={`label label-${css} disabled`}
                            >
                                {status}
                            </label>
                        </h4>
                    );
                },
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
        const { createModal, editModal } = this.state;
        return (
            <div style={{ height: '100vh' }} className="content-wrapper">
                <Modal
                    open={editModal}
                    onClose={this.closeEditModal}
                    center
                    styles={{ 'modal': { width: '400px', height: '250px' } }}
                    blockScroll={true}
                >
                    {this.state.user && <InfoUser user={this.state.user} />}
                </Modal>
                <section style={{ opacity: (createModal || editModal) ? '0.5' : '1' }} className="content-header">
                    <h1>
                        List User
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
                        data={this.props.listUser ? this.props.listUser : []}
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
        listUser: state.listUser
    }
}

const mapDispatchToProps = (dispatch, action) => {
    return {
        changeLocationInfo: (info) => dispatch(actions.changeLocationInfo(info)),
        getListTypeLocation: (type) => dispatch(actions.getListTypeLocation(type)),
        createType: (type) => dispatch(actions.createType(type)),
        editType: (type) => dispatch(actions.editType(type)),
        getListUser: (users) => dispatch(actions.getListUser(users))
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListTypesComponent));