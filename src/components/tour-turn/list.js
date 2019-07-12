import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import moment from 'moment';
import * as actions from './../../actions/index';
import { apiGet } from '../../services/api';
import { formatCurrency, matchString, getStatusTourTurn } from '../../helper';
import 'react-table/react-table.css';
import './list.css';

class ListTourTurnComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            keySearch: '',
            listTourTurn: []
        }
    }

    async componentDidMount() {
        let listTourTurn = [];
        try {
            listTourTurn = await apiGet('/tour_turn/getAllWithoutPagination');
            listTourTurn = listTourTurn.data.data
            console.log(listTourTurn)
            this.props.getListTourTurn(listTourTurn);
        } catch (error) {
            console.log(error);
        }
        const search = this.getCode(window.location.search);
        this.setState({
            listTourTurn: listTourTurn,
            keySearch: search ? search : ''
        });
    }

    getCode = (query) => {
        const search = new URLSearchParams(query);
        return search.get('search');
    }

    handleChange = ({ target }) => {
        this.setState({ keySearch: target.value });
    }

    handleSearchTourTurn = (listTourTurn, keySearch) => {
        if (keySearch !== '' && listTourTurn.length > 0) {
            return listTourTurn.filter(item => matchString(item.code, keySearch) || matchString(item.tour.name, keySearch) || matchString(item.id.toString(), keySearch));
        }
        return listTourTurn;
    }

    getDateMonthYear = (data) => {
        // const year = data.substring(0, 4);
        const result = data.split('-');
        return {
            year: result[0],
            month: result[1],
            date: result[2]
        };
    }

    FromDateTo = (date1, date2) => {
        const data1 = this.getDateMonthYear(date1);
        const data2 = this.getDateMonthYear(date2);
        if (data1.year === data2.year) {
            return `${data1.date}/${data1.month} - ${data2.date}/${data2.month}/${data2.year}`;
        }
        return `${data1.date}/${data1.month}/${data1.year} - ${data2.date}/${data2.month}/${data2.year}`;
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
                width: 40,
                maxWidth: 50,
                minWidth: 40
            },
            {
                Header: "Mã chuyến đi",
                accessor: "code",
                // Cell: props => <i>#{props.original.code}</i>,
                style: { textAlign: 'left' },
                sortable: false, 
                resizable: false, 
                filterable: false,
                width: 105,
                maxWidth: 115,
                minWidth: 105
            },
            {
                Header: "Tên",
                accessor: "tour.name",
                style: { textAlign: 'left', whiteSpace: 'unset' },
                sortable: false, 
                resizable: false, 
                filterable: false,
            },
            {
                Header: "Thời Gian",
                accessor: "start_date",
                Cell: props => <p>{this.FromDateTo(props.original.start_date, props.original.end_date)}</p>,
                style: { textAlign: 'center' },
                sortable: false, 
                resizable: false, 
                filterable: false,
                width: 200,
                maxWidth: 200,
                minWidth: 200
            },
            // {
            //     Header: "Ngày Kết Thúc",
            //     accessor: "end_date",
            //     Cell: props => <p>{moment(props.original.start_date).format('DD/MM/YYYY')}</p>,
            //     style: { textAlign: 'center' },
            //     width: 105,
            //     maxWidth: 105,
            //     minWidth: 105
            // },
            {
                Header: "Giá Tiền/Người VND",
                accessor: "price",
                Cell: props => <p>{formatCurrency(props.original.price)}</p>,
                style: { textAlign: 'right' },
                sortable: false, 
                resizable: false, 
                filterable: false,
                width: 140,
                maxWidth: 140,
                minWidth: 140
            },
            {
                Header: "Giảm",
                accessor: "discount",
                Cell: props => <p>{props.original.discount} %</p>,
                style: { textAlign: 'right' },
                sortable: false, 
                resizable: false, 
                filterable: false,
                width: 80,
                maxWidth: 80,
                minWidth: 80
            },
            {
                Header: "Số Lượng",
                accessor: "num_max_people",
                Cell: props => <p>{props.original.num_current_people}/{props.original.num_max_people}</p>,
                style: { textAlign: 'right' },
                sortable: false, 
                resizable: false, 
                filterable: false,
                width: 100,
                maxWidth: 100,
                minWidth: 100
            },
            // {
            //     Header: "SL Hiện Tại",
            //     accessor: "num_current_people",
            //     style: { textAlign: 'center' },
            //     width: 100,
            //     maxWidth: 100,
            //     minWidth: 100
            // },
            {
                Header: "Trạng Thái",
                Cell: props => {
                    const status = props.original.status;
                    const css = status === 'public' ? 'info' : 'default';
                    return <label className={`label label-${css} disabled`} >
                        {status === 'public' ? 'công khai' : 'ẩn'}
                    </label>;
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
                Header: props => <i className="fa fa-suitcase" />,
                Cell: props => {
                    const status = getStatusTourTurn(props.original.start_date, props.original.end_date);
                    return <label className={`label label-${status.css} disabled`} >
                        {status.status}
                    </label>;
                },
                style: { textAlign: 'left' },
                sortable: false, 
                resizable: false, 
                filterable: false,
                width: 80,
                maxWidth: 100,
                minWidth: 80
            },
            {
                Header: props => <i className="fa fa-pencil" />,
                Cell: props => {
                    const startDate = props.original.start_date;
                    // const endDate = props.original.end_date;
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
                sortable: false, 
                resizable: false, 
                filterable: false,
                width: 40,
                maxWidth: 50,
                minWidth: 40
            }
        ];

        const expanderDefaults = {
            sortable: false,
            resizable: false,
            filterable: false,
        };
        return (
            <div style={{ minHeight: '100vh' }} className="content-wrapper">
                <section className="content-header content-header-page">
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
                                                    data={this.handleSearchTourTurn(this.state.listTourTurn, this.state.keySearch)}
                                                    defaultPageSize={10}
                                                    noDataText={'vui lòng chờ...'}
                                                    columns={columns}
                                                    expanderDefaults={expanderDefaults}
                                                    previousText={'Trang trước'}
                                                    nextText={'Trang sau'}
                                                    pageText={'Trang'}
                                                    ofText={'/'}
                                                    rowsText={'dòng'}
                                                >
                                                </ReactTable>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            </div >
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