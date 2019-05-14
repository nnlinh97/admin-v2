import React, { Component } from 'react';
import './index.css';

class BillCancelBooking extends Component {

    render() {
        return (
            <div className="bill_cancel">
                <div className="row_print row_1_bill_cancel">
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
                <p className="title_bill_cancel">Hóa Đơn Hoàn Tiền</p>
                <div className="row_print row_2_bill_cancel">
                    <p className="date">Thứ năm, 22/07/2010</p>
                    <p className="code">Hóa đơn số: 83</p>
                </div>
                <div className="row_print row_3_bill_cancel">
                    <div className="row_3_bill_cancel--left">
                        <div className="row_3_bill_cancel--left__parent">
                            <p className="row_3_bill_cancel--left--left">Tên(người thanh toán)</p>
                            <p className="row_3_bill_cancel--left--right">: &nbsp;&nbsp; Nguyễn Văn A</p>
                        </div>
                        <div className="row_3_bill_cancel--left__parent">
                            <p className="row_3_bill_cancel--left--left">Địa chỉ</p>
                            <p className="row_3_bill_cancel--left--right">: &nbsp;&nbsp; 123 ABC XYZ, P 1, Q 1, TH ABC</p>
                        </div>
                        <div className="row_3_bill_cancel--left__parent">
                            <p className="row_3_bill_cancel--left--left">Số điện thoại</p>
                            <p className="row_3_bill_cancel--left--right">: &nbsp;&nbsp; (+84) 111 111 111</p>
                        </div>
                        <div className="row_3_bill_cancel--left__parent">
                            <p className="row_3_bill_cancel--left--left">Tên tài khoản(nếu có)</p>
                            <p className="row_3_bill_cancel--left--right">: &nbsp;&nbsp; Hello Văn A</p>
                        </div>
                    </div>
                    <div className="row_3_bill_cancel--right">
                        <div className="row_3_bill_cancel--right__parent">
                            <p className="row_3_bill_cancel--right--left">Mã tour</p>
                            <p className="row_3_bill_cancel--right--right">: &nbsp;&nbsp; ABA000111010</p>
                        </div>
                        <div className="row_3_bill_cancel--right__parent">
                            <p className="row_3_bill_cancel--right--left">Tên tour</p>
                            <p className="row_3_bill_cancel--right--right">: &nbsp;&nbsp; Tour đi ABC và XYZ</p>
                        </div>
                        <div className="row_3_bill_cancel--right__parent">
                            <p className="row_3_bill_cancel--right--left">Mã chuyến đi</p>
                            <p className="row_3_bill_cancel--right--right">: &nbsp;&nbsp; ABC</p>
                        </div>
                        <div className="row_3_bill_cancel--right__parent">
                            <p className="row_3_bill_cancel--right--left">Ngày đi</p>
                            <p className="row_3_bill_cancel--right--right">: &nbsp;&nbsp; 12/12/2012</p>
                        </div>
                        <div className="row_3_bill_cancel--right__parent">
                            <p className="row_3_bill_cancel--right--left">Ngày về</p>
                            <p className="row_3_bill_cancel--right--right">: &nbsp;&nbsp; 12/12/2012</p>
                        </div>
                    </div>
                </div>
                <div className="row_print row_4_bill_cancel">
                    <div className="row_4_bill_cancel--left">
                        <div className="row_4_bill_cancel--left__parent">
                            <p className="row_4_bill_cancel--left--left">Người nhận tiền</p>
                            <p className="row_4_bill_cancel--left--right">: &nbsp;&nbsp; Nguyễn Văn A</p>
                        </div>
                        <div className="row_4_bill_cancel--left__parent">
                            <p className="row_4_bill_cancel--left--left">CMND</p>
                            <p className="row_4_bill_cancel--left--right">: &nbsp;&nbsp; 111111111111</p>
                        </div>
                        <div className="row_4_bill_cancel--left__parent">
                            <p className="row_4_bill_cancel--left--left">Chú thích</p>
                            <p className="row_4_bill_cancel--left--right">: &nbsp;&nbsp; Vợ người đặt</p>
                        </div>
                    </div>
                    <div className="row_4_bill_cancel--right">
                        <div className="row_4_bill_cancel--right__parent">
                            <p className="row_4_bill_cancel--right--left">Số tiền</p>
                            <p className="row_4_bill_cancel--right--right">: &nbsp;&nbsp; 200.000.000 VND</p>
                        </div>
                        <div className="row_4_bill_cancel--right__parent">
                            <p className="row_4_bill_cancel--right--left">Thanh toán bằng</p>
                            <p className="row_4_bill_cancel--right--right">: &nbsp;&nbsp; Tiền mặt</p>
                        </div>
                    </div>
                </div>
                <div className="row_print row_5_bill_cancel">
                    <p className="guest">Khách hàng</p>
                    <p className="cashier">Tham toán viên</p>
                    <p className="manager">Giám đốc</p>
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