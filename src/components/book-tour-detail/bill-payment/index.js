import React, { Component } from 'react';
import moment from 'moment';
import { apiGet } from '../../../services/api';
import { formatCurrency } from '../../../helper/index';
import './index.css';

class BillPayment extends Component {

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
            passengers: bookTourDetail.type_passenger_detail
        });
    }

    render() {
        return (
            <div className="bill_payment">
                <div className="row_print row_1_bill_payment">
                    <div className="logo">
                        <img src="url" />
                    </div>
                    <div className="infor">
                        <h2>Travel Tourist</h2>
                        <p>Địa chỉ: 227 Nguyễn Văn Cừ - Phường 4 - Quận 5 - TP.Hồ Chí Minh</p>
                        <p>Điện thoại: (08) 3864 1828</p>
                        <p>Website: traveltourist.com</p>
                    </div>
                </div>
                <p className="title_bill_payment">Hóa Đơn Thanh Toán</p>
                <div className="row_print row_2_bill_payment">
                    {/* <p className="date">Thứ năm, 22/07/2010</p> */}
                    <p className="code">Hóa đơn số: 83</p>
                </div>
                <div className="row_print row_3_bill_payment">
                    <div className="row_3_bill_payment--left">
                        {this.state.contactInfo && <><div className="row_3_bill_payment--left__parent">
                            <p className="row_3_bill_payment--left--left">Người đặt tour</p>
                            <p className="row_3_bill_payment--left--right">: &nbsp;&nbsp; {this.state.contactInfo.fullname}</p>
                        </div>
                            <div className="row_3_bill_payment--left__parent">
                                <p className="row_3_bill_payment--left--left">CMND/Passport</p>
                                <p className="row_3_bill_payment--left--right">: &nbsp;&nbsp; {this.state.contactInfo.passport}</p>
                            </div>
                            <div className="row_3_bill_payment--left__parent">
                                <p className="row_3_bill_payment--left--left">Địa chỉ</p>
                                <p className="row_3_bill_payment--left--right">: &nbsp;&nbsp; {this.state.contactInfo.address}</p>
                            </div>
                            <div className="row_3_bill_payment--left__parent">
                                <p className="row_3_bill_payment--left--left">Số điện thoại</p>
                                <p className="row_3_bill_payment--left--right">: &nbsp;&nbsp; {this.state.contactInfo.phone}</p>
                            </div>
                            </>}
                        {(this.state.messagePayment && this.state.messagePayment.helper) && <><div className="row_3_bill_payment--left__parent">
                            <p className="row_3_bill_payment--left--left">Người thanh toán</p>
                            <p className="row_3_bill_payment--left--right">: &nbsp;&nbsp; {this.state.messagePayment.name}</p>
                        </div>
                            <div className="row_3_bill_payment--left__parent">
                                <p className="row_3_bill_payment--left--left">CMND/Passport</p>
                                <p className="row_3_bill_payment--left--right">: &nbsp;&nbsp; {this.state.messagePayment.passport}</p>
                            </div>
                            <div className="row_3_bill_payment--left__parent">
                                <p className="row_3_bill_payment--left--left">Chú thích</p>
                                <p className="row_3_bill_payment--left--right">: &nbsp;&nbsp; {this.state.messagePayment.note}</p>
                            </div>
                            </>}
                    </div>
                    <div className="row_3_bill_payment--right">
                        {this.state.tourTurn && <><div className="row_3_bill_payment--right__parent">
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
                <div className="row_print row_4_bill_payment">
                    <div className="row_4_bill_payment--left">
                        <p>&nbsp;&nbsp;</p>
                        <p>&nbsp;&nbsp;</p>
                        <p>&nbsp;&nbsp;</p>
                        <p>&nbsp;&nbsp;</p>
                        <p>&nbsp;&nbsp;</p>
                        <p>&nbsp;&nbsp;</p>
                        <p>&nbsp;&nbsp;</p>
                        <p>Đã bao gồm thuế VAT</p>
                    </div>
                    <div className="row_4_bill_payment--right">
                        <div className="row_4_bill_payment--right--left">
                            <p>Chi Tiết</p>
                            <p>Giá tour</p>
                            <p>&nbsp;&nbsp;</p>
                            <p>Giảm</p>
                            <p>Số người</p>
                            {this.state.passengers.map((passenger, index) => {
                                return <p key={index}>{passenger.name_vi}</p>
                            })}
                            {/* <p>Người lớn</p>
                            <p>Trẻ em</p> */}
                            <p>Tổng cộng</p>
                        </div>
                        <div className="row_4_bill_payment--right--right">
                            <p>  &nbsp;&nbsp; </p>
                            {this.state.passengers.map((passenger, index) => {
                                return <p key={index}>: &nbsp;&nbsp; {formatCurrency(parseInt(passenger.price))} VND / {passenger.name_vi}</p>
                            })}
                            {/* <p>: &nbsp;&nbsp; 50 / người lớn</p>
                            <p>: &nbsp;&nbsp; 40 / trẻ em</p> */}
                            <p>: &nbsp;&nbsp; {this.state.tourTurn ? this.state.tourTurn.discount : ''}%</p>
                            <p>: &nbsp;&nbsp; {this.state.numPassengers}</p>
                            {this.state.passengers.map((passenger, index) => {
                                return <p key={index}>: &nbsp;&nbsp; {passenger.num_passenger}</p>
                            })}
                            {/* <p>: &nbsp;&nbsp; 2</p>
                            <p>: &nbsp;&nbsp; 2</p> */}
                            <p>: &nbsp;&nbsp; {formatCurrency(this.state.totalPay)} VND</p>
                        </div>
                    </div>
                </div>
                <div className="row_print row_5_bill_payment">
                    <p className="cashier">Thu ngân</p>
                    <p className="guest">Khách</p>
                </div>
            </div>
        );
    }
}

export default BillPayment;
// const mapStateToProps = (state) => {
//     return {
//     }
// }

// const mapDispatchToProps = (dispatch, action) => {
//     return {
//     }
// }
// export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BillPayment));