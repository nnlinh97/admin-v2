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
import './list.css';
import { apiGet, apiPost } from './../../services/api';

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
        if (!this.props.allLocation) {
            try {
                let listLocation = await apiGet('/location/getAllWithoutPagination');
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
                Header: "ID",
                accessor: "id",
                sortable: true,
                filterable: true,
                style: {
                    textAlign: 'center'
                },
                width: 90,
                maxWidth: 100,
                minWidth: 80
            },
            {
                Header: "Tên Địa Điểm",
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
                Header: "Địa Chỉ",
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
                Header: "Loại",
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
                Header: "Trạng Thái",
                Cell: props => {
                    return (
                        <h4>
                            <label className={`label label-${props.original.status === 'active' ? 'primary' : 'danger'} disabled`}
                            >
                                {props.original.status === 'active' ? 'mở cửa' : 'đóng cửa'}
                            </label>
                        </h4>
                    );
                    // return (
                    //     <button className={`btn btn-${props.original.status === 'active' ? 'primary' : 'danger'}`}
                    //         onClick={() => this.handleEditLocation(props)}
                    //     >
                    //         {props.original.status}
                    //     </button>
                    // )
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
                        <button className="btn btn-xs btn-success"
                        title="chỉnh sửa"
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
                width: 60,
                maxWidth: 80,
                minWidth: 60
            }
        ];
        const { createModal, editModal, name, marker } = this.state;
        return (
            <div style={{ height: '100vh' }} className="content-wrapper">
                <section className="content-header">
                    <h1>
                        Danh Sách Địa Điểm
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
                            title="thêm mới"
                            className="btn btn-success pull-right">
                            <i className="fa fa-plus" />&nbsp;Thêm
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