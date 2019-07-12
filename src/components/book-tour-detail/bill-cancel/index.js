import React, { Component } from 'react';
import moment from 'moment';
import { apiGet } from '../../../services/api';
import { formatCurrency } from '../../../helper/index';
import './index.css';

class BillCancelBooking extends Component {

    constructor(props) {
        super(props);
        this.state = {
            contactInfo: null,
            code: '',
            messagePayment: null,
            tourTurn: null,
            passengers: [],
            numPassengers: '',
            totalPay: '',
            message: null
        };
    }

    async componentDidMount() {
        try {
            const { code } = this.props.match.params;
            const bookTourDetail = await apiGet(`/book_tour/getHistoryBookTourByCode/${code}?tour=true&isAdmin=true`);
            console.log(bookTourDetail.data.data)
            this.updateState(bookTourDetail.data.data);
            setTimeout(() => {
                window.print();
            }, 700);
        } catch (error) {
            console.log(error);
        }
    }

    updateState = (bookTourDetail) => {
        this.setState({
            id: bookTourDetail.id,
            bookTime: bookTourDetail.book_time,
            contactInfo: bookTourDetail.book_tour_contact_info,
            idTourTurn: bookTourDetail.fk_tour_turn,
            status: bookTourDetail.status,
            paymentMethod: bookTourDetail.payment_method,
            totalPay: bookTourDetail.total_pay,
            typePassenger: bookTourDetail.type_passenger_detail,
            passengers: bookTourDetail.passengers,
            numPassengers: bookTourDetail.num_passenger,
            tourTurn: bookTourDetail.tour_turn,
            message: bookTourDetail.cancel_bookings.length > 0 ? bookTourDetail.cancel_bookings[0] : null,
            bookTourDetail: bookTourDetail,
            code: bookTourDetail.code,
            messagePayment: bookTourDetail.message_pay,
            // passengers: bookTourDetail.type_passenger_detail
        });
    }

    render() {
        return (
            <div className="bill_cancel">
                <div className="row_print row_1_bill_cancel">
                    <div className="logo">
                        <img src="" alt='' />
                    </div>
                    <div className="infor">
                        <h2>Travel Tourist</h2>
                        <p>Địa chỉ: 227 Nguyễn Văn Cừ - Phường 4 - Quận 5 - TP.Hồ Chí Minh</p>
                        <p>Điện thoại: (08) 3864 1828</p>
                        <p>Website: traveltourist.com</p>
                    </div>
                </div>
                <p className="title_bill_cancel">Hóa Đơn Hoàn Tiền</p>
                <div className="row_print row_2_bill_cancel">
                    {/* <p className="date">Thứ năm, 22/07/2010</p> */}
                    <p className="code">Hóa đơn số: 83</p>
                </div>
                <div className="row_print row_3_bill_cancel">
                    <div className="row_3_bill_cancel--left">
                        {this.state.contactInfo && <>
                            <div className="row_3_bill_cancel--left__parent">
                                <p className="row_3_bill_cancel--left--left">Người đặt tour</p>
                                <p className="row_3_bill_cancel--left--right">: &nbsp;&nbsp; {this.state.contactInfo.fullname}</p>
                            </div>
                            <div className="row_3_bill_cancel--left__parent">
                                <p className="row_3_bill_cancel--left--left">Địa chỉ</p>
                                <p className="row_3_bill_cancel--left--right">: &nbsp;&nbsp; {this.state.contactInfo.address}</p>
                            </div>
                            <div className="row_3_bill_cancel--left__parent">
                                <p className="row_3_bill_cancel--left--left">Số điện thoại</p>
                                <p className="row_3_bill_cancel--left--right">: &nbsp;&nbsp; {this.state.contactInfo.phone}</p>
                            </div> </>}
                        {/* {(this.state.message && this.state.message.refund_message.helper) && <>
                            <div className="row_3_bill_cancel--left__parent">
                                <p className="row_3_bill_cancel--left--left">Người nhận tiền</p>
                                <p className="row_3_bill_cancel--left--right">: &nbsp;&nbsp; {this.state.message.refund_message.name}</p>
                            </div>
                            <div className="row_3_bill_cancel--left__parent">
                                <p className="row_3_bill_cancel--left--left">CMND/passport</p>
                                <p className="row_3_bill_cancel--left--right">: &nbsp;&nbsp; {this.state.message.refund_message.passport}</p>
                            </div>
                            <div className="row_3_bill_cancel--left__parent">
                                <p className="row_3_bill_cancel--left--left">Chú thích</p>
                                <p className="row_3_bill_cancel--left--right">: &nbsp;&nbsp; {this.state.message.refund_message.note}</p>
                            </div> </>} */}
                        <div className="row_3_bill_cancel--left__parent">
                            <p className="row_3_bill_cancel--left--left">Tên tài khoản(nếu có)</p>
                            <p className="row_3_bill_cancel--left--right">: &nbsp;&nbsp; </p>
                        </div>
                    </div>
                    <div className="row_3_bill_cancel--right">
                        {this.state.tourTurn && <>
                            <div className="row_3_bill_payment--right__parent">
                                <p className="row_3_bill_payment--right--left">Mã tour</p>
                                <p className="row_3_bill_payment--right--right">: &nbsp;&nbsp; {this.state.tourTurn.code}</p>
                            </div>
                            <div className="row_3_bill_payment--right__parent">
                                <p className="row_3_bill_payment--right--left">Tour</p>
                                <p className="row_3_bill_payment--right--right">: &nbsp;&nbsp; {this.state.tourTurn.tour.name}</p>
                            </div>
                            <div className="row_3_bill_payment--right__parent">
                                <p className="row_3_bill_payment--right--left">Mã chuyến đi</p>
                                <p className="row_3_bill_payment--right--right">: &nbsp;&nbsp; {this.state.code}</p>
                            </div>
                            <div className="row_3_bill_payment--right__parent">
                                <p className="row_3_bill_payment--right--left">Ngày khởi hành</p>
                                <p className="row_3_bill_payment--right--right">: &nbsp;&nbsp; {moment(this.state.tourTurn.start_date).format('MM/DD/YYYY')}</p>
                            </div>
                            <div className="row_3_bill_payment--right__parent">
                                <p className="row_3_bill_payment--right--left">Ngày về</p>
                                <p className="row_3_bill_payment--right--right">: &nbsp;&nbsp; {moment(this.state.tourTurn.end_date).format('MM/DD/YYYY')}</p>
                            </div></>}
                    </div>
                </div>
                <div className="row_print row_4_bill_cancel">
                    {(this.state.message && this.state.message.money_refunded > 0) && <div className="row_4_bill_cancel--left">
                        <div className="row_3_bill_cancel--left__parent">
                            <p className="row_3_bill_cancel--left--left">Người nhận tiền</p>
                            <p className="row_3_bill_cancel--left--right">: &nbsp;&nbsp; {this.state.message.refund_message.name}</p>
                        </div>
                        <div className="row_3_bill_cancel--left__parent">
                            <p className="row_3_bill_cancel--left--left">CMND/passport</p>
                            <p className="row_3_bill_cancel--left--right">: &nbsp;&nbsp; {this.state.message.refund_message.passport}</p>
                        </div>
                        <div className="row_3_bill_cancel--left__parent">
                            <p className="row_3_bill_cancel--left--left">Chú thích</p>
                            <p className="row_3_bill_cancel--left--right">: &nbsp;&nbsp; {this.state.message.refund_message.note}</p>
                        </div>
                    </div>}
                    {(this.state.message && this.state.message.money_refunded === 0) && <div className="row_4_bill_cancel--left">
                        <div className="row_3_bill_cancel--left__parent">
                            <p className="row_3_bill_cancel--left--left">Người nhận tiền</p>
                            <p className="row_3_bill_cancel--left--right">: &nbsp;&nbsp; {this.state.message.request_offline_person.name}</p>
                        </div>
                        <div className="row_3_bill_cancel--left__parent">
                            <p className="row_3_bill_cancel--left--left">CMND/passport</p>
                            <p className="row_3_bill_cancel--left--right">: &nbsp;&nbsp; {this.state.message.request_offline_person.passport}</p>
                        </div>
                        <div className="row_3_bill_cancel--left__parent">
                            <p className="row_3_bill_cancel--left--left">Chú thích</p>
                            <p className="row_3_bill_cancel--left--right">: &nbsp;&nbsp; {this.state.message.request_offline_person.note}</p>
                        </div>
                    </div>}
                    {this.state.message && <div className="row_4_bill_cancel--right">
                        <div className="row_4_bill_cancel--right__parent">
                            <p className="row_4_bill_cancel--right--left">Số tiền</p>
                            <p className="row_4_bill_cancel--right--right">: &nbsp;&nbsp; {formatCurrency(this.state.message.money_refunded)} VND</p>
                        </div>
                        {this.state.message.money_refunded > 0 && <div className="row_4_bill_cancel--right__parent">
                            <p className="row_4_bill_cancel--right--left">Thanh toán</p>
                            <p className="row_4_bill_cancel--right--right">: &nbsp;&nbsp; Tiền mặt</p>
                        </div>}
                    </div>}
                </div>
                <div className="row_print row_5_bill_cancel">
                    <p className="guest">Khách hàng</p>
                    <p className="cashier"></p>
                    <p className="manager">Nhân viên</p>
                </div>
            </div>
        );
    }
}

export default BillCancelBooking;
// const mapStateToProps = (state) => {
//     return {
//     }
// }

// const mapDispatchToProps = (dispatch, action) => {
//     return {
//     }
// }
// export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BillCancelBooking));