import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import * as actions from './../../actions/index';
import { apiGet, apiPost } from './../../services/api';
import { matchString } from '../../helper';
import './list.css';

class ListLocationComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            keySearch: ''
        };
    }

    async componentDidMount() {
        try {
            const listLocation = await apiGet('/location/getAllWithoutPagination');
            this.props.getListLocation(listLocation.data.data);
        } catch (error) {
            console.log(error);
        }
    }

    handleEditLocation = ({ original }) => {
        this.props.history.push(`/location/edit/${original.id}`);
    }

    toCreateLocationPage = () => {
        this.props.history.push('/location/create');
    }

    handleChange = ({ target }) => {
        this.setState({ keySearch: target.value });
    }

    handleSearchLocation = (listLocation, keySearch) => {
        if (keySearch !== '' && listLocation.length > 0) {
            return listLocation.filter(location => matchString(location.name, keySearch) || matchString(location.id.toString(), keySearch));
        }
        return listLocation;
    }

    render() {
        const columns = [
            {
                Header: "ID",
                accessor: "id",
                style: { textAlign: 'center' },
                width: 90,
                maxWidth: 100,
                minWidth: 80
            },
            {
                Header: "Tên Địa Điểm",
                accessor: "name",
                width: 320,
                maxWidth: 320,
                minWidth: 320
            },
            {
                Header: "Địa Chỉ",
                accessor: "address",
            },
            {
                Header: "Loại",
                accessor: "type.name",
                width: 200,
                maxWidth: 200,
                minWidth: 200
            },
            {
                Header: "Trạng Thái",
                Cell: props => {
                    return (
                        <h4>
                            <label className={`label label-${props.original.status === 'active' ? 'primary' : 'danger'} disabled`}>
                                {props.original.status === 'active' ? 'mở cửa' : 'đóng cửa'}
                            </label>
                        </h4>
                    );
                },
                style: { textAlign: 'center' },
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
                            onClick={() => this.handleEditLocation(props)} >
                            <i className="fa fa-pencil" />
                        </button>
                    )
                },
                style: { textAlign: 'center' },
                width: 60,
                maxWidth: 80,
                minWidth: 60
            }
        ];
        return (
            <div style={{ height: '100vh' }} className="content-wrapper">
                <section className="content-header">
                    <h1> Danh Sách Địa Điểm </h1>
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
                            onClick={this.toCreateLocationPage}
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
                        data={this.handleSearchLocation(this.props.listLocation, this.state.keySearch)}
                        defaultPageSize={10} >
                    </ReactTable>
                </section>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        listLocation: state.listLocation
    }
}

const mapDispatchToProps = (dispatch, action) => {
    return {
        getListLocation: (locations) => dispatch(actions.getListLocation(locations))
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListLocationComponent));