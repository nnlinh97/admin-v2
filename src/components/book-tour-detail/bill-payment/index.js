import React, { Component } from 'react';
import './index.css';

class BillPayment extends Component {

    render() {
        return (
            <div className="bill_payment">
                <div className="row_print row_1_bill_payment">
                    <div className="logo">
                        <img src="url"/>
                    </div>
                    <div className="infor">
                        <h2>Travel Tourist</h2>
                        <p>Địa chỉ: 68/18 Lữ Gia - Phường 15 - Quận 11 - TP.Hồ Chí Minh</p>
                        <p>Điện thoại: (08) 3864 1828</p>
                        <p>Website: traveltourist.com</p>
                    </div>
                </div>
                <p className="title_bill_payment">Hóa Đơn Thanh Toán</p>
                <div className="row_print row_2_bill_payment">
                    <p className="date">Thứ năm, 22/07/2010</p>
                    <p className="code">Hóa đơn số: 83</p>
                </div>
                <div className="row_print row_3_bill_payment">
                    <div className="row_3_bill_payment--left">
                        <div className="row_3_bill_payment--left__parent">
                            <p className="row_3_bill_payment--left--left">Tên(người thanh toán)</p>
                            <p className="row_3_bill_payment--left--right">: &nbsp;&nbsp; Nguyễn Văn A</p>
                        </div>
                        <div className="row_3_bill_payment--left__parent">
                            <p className="row_3_bill_payment--left--left">Địa chỉ</p>
                            <p className="row_3_bill_payment--left--right">: &nbsp;&nbsp; 123 ABC XYZ, P 1, Q 1, TH ABC</p>
                        </div>
                        <div className="row_3_bill_payment--left__parent">
                            <p className="row_3_bill_payment--left--left">Số điện thoại</p>
                            <p className="row_3_bill_payment--left--right">: &nbsp;&nbsp; (+84) 111 111 111</p>
                        </div>
                        <div className="row_3_bill_payment--left__parent">
                            <p className="row_3_bill_payment--left--left">Tên tài khoản(nếu có)</p>
                            <p className="row_3_bill_payment--left--right">: &nbsp;&nbsp; Hello Văn A</p>
                        </div>
                    </div>
                    <div className="row_3_bill_payment--right">
                        <div className="row_3_bill_payment--right__parent">
                            <p className="row_3_bill_payment--right--left">Mã tour</p>
                            <p className="row_3_bill_payment--right--right">: &nbsp;&nbsp; ABA000111010</p>
                        </div>
                        <div className="row_3_bill_payment--right__parent">
                            <p className="row_3_bill_payment--right--left">Tên tour</p>
                            <p className="row_3_bill_payment--right--right">: &nbsp;&nbsp; Tour đi ABC và XYZ</p>
                        </div>
                        <div className="row_3_bill_payment--right__parent">
                            <p className="row_3_bill_payment--right--left">Mã chuyến đi</p>
                            <p className="row_3_bill_payment--right--right">: &nbsp;&nbsp; ABC</p>
                        </div>
                        <div className="row_3_bill_payment--right__parent">
                            <p className="row_3_bill_payment--right--left">Ngày đi</p>
                            <p className="row_3_bill_payment--right--right">: &nbsp;&nbsp; 12/12/2012</p>
                        </div>
                        <div className="row_3_bill_payment--right__parent">
                            <p className="row_3_bill_payment--right--left">Ngày về</p>
                            <p className="row_3_bill_payment--right--right">: &nbsp;&nbsp; 12/12/2012</p>
                        </div>
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
                            <p>Người lớn</p>
                            <p>Trẻ em</p>
                            <p>Tổng cộng</p>
                        </div>
                        <div className="row_4_bill_payment--right--right">
                            <p>  &nbsp;&nbsp; </p>
                            <p>: &nbsp;&nbsp; 50 / người lớn</p>
                            <p>: &nbsp;&nbsp; 40 / trẻ em</p>
                            <p>: &nbsp;&nbsp; 10%</p>
                            <p>: &nbsp;&nbsp; 4</p>
                            <p>: &nbsp;&nbsp; 2</p>
                            <p>: &nbsp;&nbsp; 2</p>
                            <p>: &nbsp;&nbsp; 200.000.000</p>
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