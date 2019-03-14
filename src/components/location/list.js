import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
// import Modal from 'react-bootstrap-modal';
import * as actions from './../../actions/index';
import { URL } from '../../constants/url';
import axios from 'axios';
import './modal.css';

class ListLocationComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listTypes: [],
            createModal: false,
            editModal: false,
            type: null,
            name: '',
            marker: ''
        }
    }

    async componentDidMount() {
        if(!this.props.allLocation){
            try {
                let listLocation = await axios.get(`${URL}/location/getAllWithoutPagination`);
                this.props.getAllLocation(listLocation.data.data);
            } catch (error) {
                console.log(error);
            }
        }
    }
    handleEditLocation = (props) => {
        console.log(props.original);
        this.props.history.push(`/location/edit/${props.original.id}`);
    }

    redirectCreateLocationPage = () => {
        this.props.history.push('/location/create');
    }


    render() {
        const columns = [
            {
                Header: "NAME",
                accessor: "name",
                sortable: true,
                filterable: true,
                style: {
                    // textAlign: 'center'
                },
                width: 320,
                maxWidth: 320,
                minWidth: 320
            },
            {
                Header: "ADDRESS",
                accessor: "address",
                sortable: true,
                filterable: true,
                style: {
                    // textAlign: 'center'
                },
                sortable: false,
                filterable: false,
            },
            {
                Header: "TYPE",
                accessor: "type.name",
                sortable: true,
                filterable: true,
                style: {
                    // textAlign: 'center'
                },
                width: 200,
                maxWidth: 200,
                minWidth: 200
            },
            {
                Header: "STATUS",
                Cell: props => {
                    return (
                        <button className={`btn btn-${props.original.status === 'active' ? 'primary' : 'danger'}`}
                        onClick={() => this.handleEditLocation(props)}
                        >
                            {props.original.status}
                        </button>
                    )
                },
                sortable: true,
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
                        <button className="btn btn-success"
                        onClick={() => this.handleEditLocation(props)}
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
            <div style={{height: '100vh'}} className="content-wrapper">
                <section className="content-header">
                    <h1>
                        List Location
                    </h1>
                </section>
                <section className="content">
                    <div className="row">
                        <button
                            onClick={this.redirectCreateLocationPage}
                            style={{
                                marginBottom: '2px',
                                marginRight: '15px'
                            }}
                            type="button"
                            className="btn btn-success pull-right">
                            <i className="fa fa-plus" />&nbsp;Create
                        </button>
                    </div>

                    {this.props.allLocation && <ReactTable
                        columns={columns}
                        data={this.props.allLocation}
                        defaultPageSize={10}
                        noDataText={'Please wait...'}
                    >
                    </ReactTable>}
                </section>



            </div>
        );
    }
}

// export default withRouter(ListLocationComponent);
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
        getAllLocation: (locations) => dispatch(actions.getAllLocation(locations))
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListLocationComponent));