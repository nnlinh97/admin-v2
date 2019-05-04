import React, { Component } from 'react';
import { formatCurrency } from './../../../helper';
import { apiPost } from '../../../services/api';
import './index.css';

class ViewDetailComponent extends Component {

    handlePayment = async () => {
        try {
            const payment = await apiPost('/book_tour/payBookTour', { code: this.props.data.code });
            this.props.handlePayment(true);
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        const { data, tour, tourTurn } = this.props;
        return <div className="">
            <section className="content-header">
                <h1> Kiểm Tra Thanh Toán </h1>
            </section>
            <section className="content">
                <div className="row invoice-info">
                    <div style={{ textAlign: 'right' }} className="col-sm-5 invoice-col">
                        <address>
                            <strong>Tour</strong><br />
                            <strong>Ngày bắt đầu</strong><br />
                            <strong>Ngày kết thúc</strong><br />
                            <strong>Giá tiền/ người</strong><br />
                            <strong>Tổng người đi</strong><br />
                            <strong>Tổng tiền</strong><br />
                            <strong>Người liên hệ</strong><br />
                            <strong>Số điện thoại</strong><br />
                        </address>
                    </div>
                    <div className="col-sm-7 invoice-col">
                        <address>
                            {tour.name}<br />
                            {tourTurn.start_date}<br />
                            {tourTurn.end_date}<br />
                            {formatCurrency(tourTurn.price)} VND<br />
                            {data.passengers.length}<br />
                            {formatCurrency(data.total_pay)} VND<br />
                            {data.book_tour_contact_info.fullname}<br />
                            {data.book_tour_contact_info.phone}<br />
                        </address>
                    </div>
                    <div className="row">
                        <div className="col-xs-12 table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Tên</th>
                                        <th>Loại Hành Khách</th>
                                        <th>Giới Tính</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.passengers.map((item, index) => {
                                        return (<tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.fullname}</td>
                                            <td>{item.type_passenger.name}</td>
                                            <td>{item.sex}</td>
                                        </tr>)
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="row no-print">
                        <div className="col-xs-12">
                            <button onClick={this.handlePayment} type="button" className="btn btn-success pull-right">
                                Thanh Toán
                                </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>;
    }
}

export default ViewDetailComponent;