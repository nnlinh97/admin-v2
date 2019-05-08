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
        let { listTour } = this.props;
        if (!listTour.length) {
            try {
                listTour = await apiGet('/tour/getAllWithoutPagination');
                this.props.getListTour(listTour.data.data);
            } catch (error) {
                console.log(error);
            }
        }
    }

    handleCreatetour = (event) => {
        event.preventDefault();
        this.props.history.push("/tour/create")
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
                Header: "Tên",
                accessor: "name",
                style: { textAlign: 'center' },
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
                width: 130,
                maxWidth: 130,
                minWidth: 130
            }
        ];
        return (
            <div style={{ minHeight: '100vh' }} className="content-wrapper">
                <section className="content-header">
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
                                                    defaultPageSize={10}
                                                    noDataText={'Please wait...'} >
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