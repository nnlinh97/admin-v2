import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import moment from 'moment';
import * as actions from './../../actions/index';
import { apiGet } from '../../services/api';
import { formatCurrency, matchString } from '../../helper';
import 'react-table/react-table.css';
import './list.css';

class ListTourTurnComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            keySearch: ''
        }
    }

    async componentDidMount() {
        try {
            let listTourTurn = await apiGet('/tour_turn/getAllWithoutPagination');
            this.props.getListTourTurn(listTourTurn.data.data);
        } catch (error) {
            console.log(error);
        }
    }

    handleChange = ({ target }) => {
        this.setState({ keySearch: target.value });
    }

    handleSearchTourTurn = (listTourTurn, keySearch) => {
        if (keySearch !== '' && listTourTurn.length > 0) {
            return listTourTurn.filter(item => matchString(item.tour.name, keySearch) || matchString(item.id.toString(), keySearch));
        }
        return listTourTurn;
    }

    render() {
        return (
            <div style={{ height: '100vh' }} className="content-wrapper">
                <section className="content-header">
                    <h1> Danh Sách Chuyến Đi </h1>
                    <div className="right_header">
                        <button
                            onClick={() => this.props.history.push('/tour-turn/create')}
                            style={{ marginBottom: '2px', marginRight: '15px' }}
                            type="button"
                            className="btn btn-success pull-right">
                            <i className="fa fa-plus" />&nbsp;Thêm
                        </button>
                    </div>
                </section>
                <section className="content">
                    <div class="search_box">
                        <div class="search_icon">
                            <i class="fa fa-search"></i>
                        </div>
                        <input
                            type="text"
                            onChange={this.handleChange}
                            value={this.state.keySearch}
                            name="title"
                            className="search_input"
                            placeholder="Tìm kiếm..."
                        />
                        {this.state.keySearch !== '' && <div class="search_result_count">
                            <span>{this.handleSearchTourTurn(this.props.listTourTurn, this.state.keySearch).length} </span>results
                        </div>}
                    </div>
                    <ReactTable
                        data={this.handleSearchTourTurn(this.props.listTourTurn, this.state.keySearch)}
                        defaultPageSize={10}
                        noDataText={'Please wait...'}
                        columns={[
                            {
                                Header: "ID",
                                accessor: "id",
                                style: { textAlign: 'center' },
                                width: 70,
                                maxWidth: 80,
                                minWidth: 60
                            },
                            {
                                Header: "Tên",
                                accessor: "tour.name",
                                style: { textAlign: 'center' }
                            },
                            {
                                Header: "Ngày Bắt Đầu",
                                accessor: "start_date",
                                Cell: props => <p>{moment(props.original.start_date).format('DD/MM/YYYY')}</p>,
                                style: {
                                    textAlign: 'center'
                                },
                                width: 140,
                                maxWidth: 140,
                                minWidth: 140
                            },
                            {
                                Header: "Ngày Kết Thúc",
                                accessor: "end_date",
                                Cell: props => <p>{moment(props.original.end_date).format('DD/MM/YYYY')}</p>,
                                style: { textAlign: 'center' },
                                width: 140,
                                maxWidth: 140,
                                minWidth: 140
                            },
                            {
                                Header: "Giá Tiền/Người vnđ",
                                accessor: "price",
                                Cell: props => <p>{formatCurrency(props.original.price)}</p>,
                                style: { textAlign: 'center' },
                                width: 120,
                                maxWidth: 120,
                                minWidth: 120
                            },
                            {
                                Header: "Giảm Giá (%)",
                                accessor: "discount",
                                style: { textAlign: 'center' },
                                width: 100,
                                maxWidth: 100,
                                minWidth: 100
                            },
                            {
                                Header: "SL Tối Đa",
                                accessor: "num_max_people",
                                style: { textAlign: 'center' },
                                width: 100,
                                maxWidth: 100,
                                minWidth: 100
                            },
                            {
                                Header: "SL Hiện Tại",
                                accessor: "num_current_people",
                                style: { textAlign: 'center' },
                                width: 100,
                                maxWidth: 100,
                                minWidth: 100
                            },
                            {
                                Header: "Trạng Thái",
                                Cell: props => {
                                    const status = props.original.status;
                                    const css = status === 'public' ? 'info' : 'default';
                                    return <h4>
                                        <label className={`label label-${css} disabled`} >
                                            {status === 'public' ? 'công khai' : 'ẩn'}
                                        </label>
                                    </h4>;
                                },
                                style: { textAlign: 'center' },
                                width: 100,
                                maxWidth: 100,
                                minWidth: 100
                            },
                            {
                                Header: props => <i className="fa fa-suitcase" />,
                                Cell: props => {
                                    const startDate = props.original.start_date;
                                    const endDate = props.original.end_date;
                                    const currentDate = moment(new Date()).format('YYYY-MM-DD');
                                    let status = "Đã đi";
                                    let css = 'default';
                                    if (startDate <= currentDate && currentDate <= endDate) {
                                        status = "Đang đi";
                                        css = 'warning'
                                    }
                                    if (startDate > currentDate) {
                                        status = "Chưa đi";
                                        css = 'success';
                                    }
                                    return <h4>
                                        <label className={`label label-${css} disabled`} >
                                            {status}
                                        </label>
                                    </h4>;
                                },
                                style: { textAlign: 'center' },
                                width: 80,
                                maxWidth: 100,
                                minWidth: 80
                            },
                            {
                                Header: props => <i className="fa fa-pencil" />,
                                Cell: props => {
                                    const startDate = props.original.start_date;
                                    const endDate = props.original.end_date;
                                    const currentDate = moment(new Date()).format('YYYY-MM-DD');
                                    if (startDate <= currentDate) {
                                        return <button className="btn btn-xs btn-success disabled">
                                            <i className="fa fa-pencil" />
                                        </button>;
                                    }
                                    return <button className={`btn btn-xs btn-success ${startDate > currentDate ? '' : 'disabled'}`}
                                        title="chỉnh sửa"
                                        onClick={() => this.props.history.push(`/tour-turn/edit/${props.original.id}`)} >
                                        <i className="fa fa-pencil" />
                                    </button>;
                                },
                                style: { textAlign: 'center' },
                                width: 40,
                                maxWidth: 50,
                                minWidth: 40
                            }
                        ]} >
                    </ReactTable>
                </section>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        listTourTurn: state.listTourTurn
    }
}

const mapDispatchToProps = (dispatch, action) => {
    return {
        getListTourTurn: (tourTurn) => dispatch(actions.getListTourTurn(tourTurn))
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListTourTurnComponent));