import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import ReactTable from 'react-table';
import moment from 'moment';
import { apiGet } from '../../services/api';
import { getStatusItem, matchString } from './../../helper/';
import './index.css';

class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            keySearch: '',
            listBooking: [],
        }
    }

    componentDidMount = async () => {
        try {
            let request = await apiGet('/book_tour/getAllBookTourHistoryWithoutPagination');
            console.log(request.data.data);
            this.setState({ listBooking: request.data.data });
        } catch (error) {
            console.log(error);
        }
    }

    handleChange = ({ target }) => {
        this.setState({ keySearch: target.value });
    }

    handleSearchRequest = (requestCancelBooking, keySearch) => {
        if (keySearch !== '' && requestCancelBooking.length > 0) {
            return requestCancelBooking.filter(request => matchString(request.user.email, keySearch) || matchString(request.book_tour_history.code, keySearch) || matchString(request.user.fullname, keySearch));
        }
        return requestCancelBooking;
    }

    render() {
        const columns = [
            {
                Header: "Mã đặt tour",
                accessor: "book_tour_history.code",
                Cell: props => {
                    return <i>#{props.original.code}</i>
                },
                style: { textAlign: 'center' },
                width: 100,
                maxWidth: 105,
                minWidth: 95
            },
            {
                Header: "Người liên hệ",
                accessor: "book_tour_contact_info.fullname",
                // style: { textAlign: 'center' }
            },
            {
                Header: "Tour",
                accessor: "tour_turn.tour.name",
                // style: { textAlign: 'center' }
            },
            {
                Header: "Ngày khởi hành",
                accessor: "tour_turn.start_date",
                style: { textAlign: 'center' }
            },
            {
                Header: "Trạng thái",
                accessor: "status",
                // Cell: props => {
                //     const status = getStatusItem(props.original.book_tour_history.status);
                //     return <label className={`label label-${status.colorStatus} disabled`} >
                //         {status.textStatus}
                //     </label>
                // },
                style: { textAlign: 'center' },
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
                        onClick={() => this.props.history.push(`/book-tour-detail/${props.original.book_tour_history.code}`)} >
                        <i className="fa fa-eye" />
                    </button>
                },
                style: { textAlign: 'center' },
                width: 60,
                maxWidth: 60,
                minWidth: 60
            }
        ];
        return <div style={{ minHeight: '100vh' }} className="content-wrapper">
            <section className="content">
                <div className="row">
                    <div className="col-lg-12 col-xs-12">
                        <form className="form-horizontal">
                            <div className="box-body book_tour_detail-book_tour_history">
                                <div style={{ marginTop: '40px' }} className="book_tour_detail-book_tour_history-title">
                                    {/* <h2>Danh Sách Yêu Cầu Hủy Đặt Tour</h2> */}
                                    {/* <div style={{ top: '10px' }} className="">
                                        <select
                                            // value={this.state.status}
                                            // onChange={this.handleChange}
                                            name="status"
                                            className="search_input">
                                            <option value="public">Công Khai</option>
                                            <option value="private">Ẩn</option>
                                        </select>
                                    </div> */}
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
                                                data={this.state.listBooking}
                                                defaultPageSize={10}
                                                noDataText={'Vui lòng đợi...'} >
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