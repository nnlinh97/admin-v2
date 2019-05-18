import React, { Component } from 'react';
import { formatCurrency, getSex } from './../../../helper';
import { apiGet } from '../../../services/api';
import moment from 'moment';
import './index.css';

class PrintPassenger extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bookTour: [],
            tourTurn: null
        }
    }

    async componentDidMount() {
        try {
            const { id } = this.props.match.params;
            let detail = await apiGet(`/book_tour/getBookTourHistoryByTourTurn/${id}`);
            let tourTurn = detail.data.data.tour_turn;
            detail = detail.data.data.book_tour_history.filter(item => item.status === 'paid');
            this.setState({ bookTour: detail, tourTurn: tourTurn });
            setTimeout(() => {
                window.print();
            }, 700);
        } catch (error) {
            console.log(error);
        }
    }

    countPassenger = (passengers) => {
        let count = 0;
        passengers.forEach(item => {
            count += item.passengers.length;
        });
        return count;
    }

    handlePrint = () => {
        window.print();
    }

    render() {
        return (
            <div className="">
                <section className="content print_infor_tour">
                    <div className="title_tour">{this.state.tourTurn ? this.state.tourTurn.tour.name : ''}</div>
                    <div className="row invoice-info">
                        <div className="row_title_h2">
                            <h2>Thông tin chuyến đi</h2>
                            <i style={{cursor: 'pointer'}} onClick={this.handlePrint} className="fa fa-print"></i>
                        </div>
                        <div className="box-body-main">
                            <div className="box-body-main-left">
                                <div className="box-body-left">
                                    <div className="">Ngày Bắt Đầu</div>
                                    <div className="">Giá/ Người</div>
                                    <div className="">Giảm</div>
                                </div>
                                <div className="box-body-right">
                                    <div className="">
                                        {this.state.tourTurn ? moment(this.state.tourTurn.start_date).format('DD/MM/YYYY') : ''}
                                    </div>
                                    <div className="">
                                        {this.state.tourTurn ? formatCurrency(this.state.tourTurn.price) : ''} VND
                                    </div>
                                    <div className="">
                                        {this.state.tourTurn ? this.state.tourTurn.discount : ''} %
                                    </div>
                                </div>
                            </div>
                            <div className="box-body-main-right">
                                <div className="box-body-left">
                                    <div className="">Ngày Kết Thúc</div>
                                    <div className="">Tổng Người</div>
                                    {/* <div className="">Tổng tiền</div> */}
                                </div>
                                <div className="box-body-right">
                                    <div className="">
                                        {this.state.tourTurn ? moment(this.state.tourTurn.end_date).format('DD/MM/YYYY') : ''}
                                    </div>
                                    <div className="">{this.countPassenger(this.state.bookTour)}</div>
                                    {/* <div className="">90000 VND</div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <h2>Thông tin hành khách</h2>
                        <div className="col-xs-12 table-responsive custom-table-responsive">
                            <table className="table table-striped table_info_passengers">
                                <thead>
                                    <tr>
                                        <th width="20%">Người liên hệ</th>
                                        <th width="20%">Số điện thoại</th>
                                        <th width="45%">Danh sách người đi</th>
                                        <th>Chú thích</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.bookTour.map((item, index) => {
                                        return <tr key={index}>
                                            <td>{item.book_tour_contact_info.fullname}</td>
                                            <td>{item.book_tour_contact_info.phone}</td>
                                            <td>
                                                <table className="table table-striped mini_table">
                                                    <tbody>
                                                        {item.passengers.map((passenger, i) => {
                                                            return <tr key={i}>
                                                                <td>{passenger.fullname}</td>
                                                                <td>{getSex(passenger.sex)}</td>
                                                                <td>{passenger.type_passenger.name}</td>
                                                            </tr>
                                                        })}
                                                    </tbody>
                                                </table>
                                            </td>
                                            <td></td>
                                        </tr>;
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

export default PrintPassenger;