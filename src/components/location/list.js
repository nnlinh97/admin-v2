import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import * as actions from './../../actions/index';
import { apiGet, apiPost } from './../../services/api';
import { matchString } from '../../helper';
import './index.css';

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
            //     width: 90,
            //     maxWidth: 100,
            //     minWidth: 80
            // },
            {
                Header: "Tên Địa Điểm",
                accessor: "name",
                Cell: props => <p title={props.original.name}>{props.original.name}</p>,
                style: { whiteSpace: 'unSet' },
                sortable: false, 
                resizable: false, 
                filterable: false,
                width: 320,
                maxWidth: 320,
                minWidth: 320
            },
            {
                Header: "Địa Chỉ",
                accessor: "address",
                // Cell: props => <p title={props.original.address}>{props.original.address.substring(0, 40)}...</p>,
                style: { whiteSpace: 'unSet' },
                sortable: false, 
                resizable: false, 
                filterable: false,

            },
            {
                Header: "Loại",
                accessor: "type.name",
                style: { whiteSpace: 'unSet' },
                sortable: false, 
                resizable: false, 
                filterable: false,
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
                style: { textAlign: 'left' },
                sortable: false, 
                resizable: false, 
                filterable: false,
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
                sortable: false, 
                resizable: false, 
                filterable: false,
                width: 60,
                maxWidth: 80,
                minWidth: 60
            }
        ];
        return (
            <div style={{ minHeight: '100vh' }} className="content-wrapper">
                <section className="content-header content-header-page">
                    <h1> Danh Sách Địa Điểm </h1>
                    <div className="right_header">
                        <button
                            onClick={this.toCreateLocationPage}
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
                                                    data={this.handleSearchLocation(this.props.listLocation, this.state.keySearch)}
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