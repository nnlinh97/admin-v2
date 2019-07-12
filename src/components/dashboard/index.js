import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import ReactTable from 'react-table';
// import moment from 'moment';
import { apiGet } from '../../services/api';
import { getStatusItem, matchString } from './../../helper/';
import './index.css';

class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            keySearch: '',
            listBooking: [],
            status: 'all'
        }
    }

    componentDidMount = async () => {
        try {
            let request = await apiGet('/book_tour/getAllBookTourHistoryWithoutPagination');
            // console.log(request.data.data);
            this.setState({
                listBooking: request.data.data
            });
        } catch (error) {
            console.log(error);
        }
    }

    handleChange = ({ target }) => {
        this.setState({ keySearch: target.value });
    }

    handleChangeFilter = ({ target }) => {
        this.setState({ status: target.value });
    }

    handleSearchRequest = (listBooking) => {
        const { keySearch, status } = this.state;
        if (status !== 'all' && status !== '' && status !== 'call') {
            listBooking = listBooking.filter(booking => booking.status === status);
        }
        if (status === 'call') {
            listBooking = listBooking.filter(booking => booking.isNeedCall);
        }
        if (keySearch !== '' && listBooking.length > 0) {
            return listBooking.filter(booking => matchString(booking.code, keySearch) || matchString(booking.book_tour_contact_info.phone, keySearch) || matchString(booking.book_tour_contact_info.fullname, keySearch) || matchString(booking.tour_turn.tour.name, keySearch));
        }
        return listBooking;
    }

    handleRefresh = async () => {
        try {
            let request = await apiGet('/book_tour/getAllBookTourHistoryWithoutPagination');
            this.setState({ listBooking: request.data.data });
        } catch (error) {
            console.log(error);
        }
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
                accessor: "code",
                Cell: props => <p>{props.index + 1}</p>,
                style: { textAlign: 'center' },
                sortable: false, 
                resizable: false, 
                filterable: false,
                width: 50,
                maxWidth: 50,
                minWidth: 50
            },
            {
                Header: "Mã đặt tour",
                accessor: "book_tour_history.code",
                Cell: props => <p>{props.original.code}</p>,
                style: { textAlign: 'left' },
                sortable: false, 
                resizable: false, 
                filterable: false,
                width: 100,
                maxWidth: 105,
                minWidth: 95
            },
            {
                Header: "Người liên hệ",
                accessor: "book_tour_contact_info.fullname",
                style: { whiteSpace: 'unset' },
                sortable: false, 
                resizable: false, 
                filterable: false,
                width: 200,
                maxWidth: 200,
                minWidth: 200
            },
            {
                Header: "SĐT",
                accessor: "book_tour_contact_info.phone",
                style: { whiteSpace: 'unset', textAlign: 'center' },
                sortable: false, 
                resizable: false, 
                filterable: false,
                width: 150,
                maxWidth: 150,
                minWidth: 150
            },
            {
                Header: "Tour",
                accessor: "tour_turn.tour.name",
                style: { whiteSpace: 'unset' },
                sortable: false, 
                resizable: false, 
                filterable: false,
            },
            {
                Header: "Thời gian",
                accessor: "tour_turn.start_date",
                Cell: props => <p> {this.FromDateTo(props.original.tour_turn.start_date, props.original.tour_turn.end_date)} </p>,
                style: { textAlign: 'center' },
                sortable: false, 
                resizable: false, 
                filterable: false,
                width: 220,
                maxWidth: 220,
                minWidth: 220
            },
            {
                Header: "Trạng thái",
                accessor: "status",
                Cell: props => {
                    const status = getStatusItem(props.original.status);
                    return <span style={{ backgroundColor: status.colorStatus }} className={`label disabled`} >
                        {status.textStatus}
                    </span>
                },
                style: { textAlign: 'left' },
                sortable: false, 
                resizable: false, 
                filterable: false,
                width: 110,
                maxWidth: 150,
                minWidth: 110
            },
            {
                Header: props => <i className="fa fa-eye" />,
                Cell: props => {
                    return <button
                        title="chi tiết"
                        className="btn btn-xs btn-info"
                        onClick={() => this.props.history.push(`/book-tour-detail/${props.original.code}`)} >
                        <i className="fa fa-eye" />
                    </button>
                },
                style: { textAlign: 'center' },
                sortable: false, 
                resizable: false, 
                filterable: false,
                width: 60,
                maxWidth: 60,
                minWidth: 60
            }
        ];
        return <div style={{ minHeight: '100vh' }} className="content-wrapper">
            <section className="content-header content-header-page">
                <h1> Trang Chủ </h1>
                <div className="right_header">
                    <i
                        onClick={this.handleRefresh}
                        style={{
                            fontSize: '35px',
                            marginBottom: '2px',
                            marginRight: '20px',
                            marginTop: '10px',
                            color: '#3c8dbc',
                            cursor: 'pointer'
                        }}
                        className="fa fa-refresh pull-right"
                        title="cập nhật"
                    />
                </div>
            </section>
            <section className="content">
                <div className="row row_1_dashboard">
                    <select onChange={this.handleChangeFilter} value={this.state.status} name="status" className="form-control combobox">
                        <option value="all">--Tất cả--</option>
                        <option value="pending_cancel">Chờ xác nhận hủy</option>
                        <option value="booked">Chưa thanh toán</option>
                        <option value="call">Cần thanh toán gấp</option>
                        <option value="confirm_cancel">Chờ hoàn tiền</option>
                        <option value="paid">Đã thanh toán</option>
                        <option value="finished">Đã tham gia</option>
                        <option value="refunded">Đã hoàn tiền</option>
                        <option value="cancelled">Đã hủy</option>
                    </select>
                    <div className="mini_search_box">
                        <input
                            type="text"
                            onChange={this.handleChange}
                            value={this.state.keySearch}
                            name="keySearch"
                            className="search_input"
                            placeholder="Tìm kiếm..."
                        />
                        <div className="search_icon">
                            <i className="fa fa-search"></i>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12 col-xs-12">
                        <form className="form-horizontal">
                            <div className="box-body book_tour_detail-book_tour_history">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-xs-12 book_tour_history">
                                            <ReactTable
                                                columns={columns}
                                                data={this.handleSearchRequest(this.state.listBooking)}
                                                // showPageSizeOptions={false}
                                                pageSizeOptions={[5, 10, 20, 25]}
                                                defaultPageSize={20}
                                                noDataText={'Vui lòng đợi...'}
                                                previousText={'Trang trước'}
                                                nextText={'Trang sau'}
                                                pageText={'Trang'}
                                                ofText={'/'}
                                                rowsText={'dòng'} >
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
    }
}

export default withRouter(Dashboard);