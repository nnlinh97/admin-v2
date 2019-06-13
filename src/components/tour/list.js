import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import * as actions from './../../actions/index';
import { apiGet } from '../../services/api';
import { matchString } from '../../helper';
import './list.css';

class ListTourComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            keySearch: ''
        }
    }

    async componentDidMount() {
        let listTour = []
        try {
            listTour = await apiGet('/tour/getAllWithoutPagination');
            console.log(listTour.data.data)
            this.props.getListTour(listTour.data.data);
        } catch (error) {
            console.log(error);
        }
    }

    handleCreatetour = (event) => {
        event.preventDefault();
        this.props.history.push("/tour/create");
    }

    handleEditTour = async (id) => {
        this.props.history.push(`/tour/edit/${id}`);
    }

    handleChange = ({ target }) => {
        this.setState({ keySearch: target.value });
    }

    handleSearchTour = (listTour, keySearch) => {
        if (keySearch !== '' && listTour.length > 0) {
            return listTour.filter(tour => matchString(tour.name, keySearch) || matchString(tour.id.toString(), keySearch));
        }
        return listTour;
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
            //     // Cell: props => <i>#{props.original.id}</i>,
            //     style: { textAlign: 'center' },
            //     width: 90,
            //     maxWidth: 100,
            //     minWidth: 80
            // },
            {
                Header: "Tên tour",
                accessor: "name",
                style: { textAlign: 'left', whiteSpace: 'unset' },
                sortable: false, 
                resizable: false, 
                filterable: false,
            },
            {
                Header: "Sô ngày",
                accessor: "num_days",
                style: { textAlign: 'center', whiteSpace: 'unset' },
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
                    return <button className="btn btn-xs btn-success"
                        title="chỉnh sửa"
                        onClick={() => this.props.history.push(`/tour/edit/${props.original.id}`)} >
                        <i className="fa fa-pencil" />
                    </button>;
                },
                style: { textAlign: 'center' },
                sortable: false, 
                resizable: false, 
                filterable: false,
                width: 100,
                maxWidth: 100,
                minWidth: 100
            },
            {
                Header: props => <i className="fa fa-files-o" />,
                Cell: props => {
                    return <button className="btn btn-xs btn-info"
                        title="Copy địa điểm"
                        onClick={() => this.props.history.push(`/tour/create?copyID=${props.original.id}`)} >
                        <i className="fa fa-files-o" />
                    </button >;
                },
                style: { textAlign: 'center' },
                sortable: false, 
                resizable: false, 
                filterable: false,
                width: 100,
                maxWidth: 100,
                minWidth: 100
            }
        ];
        return (
            <div style={{ minHeight: '100vh' }} className="content-wrapper">
                <section className="content-header content-header-page">
                    <h1> Danh Sách Tour </h1>
                    <div className="right_header">
                        <button
                            onClick={this.handleCreatetour}
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
                                                    data={this.handleSearchTour(this.props.listTour, this.state.keySearch)}
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
        listTour: state.listTour,
    }
}

const mapDispatchToProps = (dispatch, action) => {
    return {
        getListTour: (tour) => dispatch(actions.getListTour(tour)),
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListTourComponent));