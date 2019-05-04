import React, { Component } from 'react';
import moment from 'moment';
import * as actions from './../../../actions/index';
import { apiGet, apiPost } from '../../../services/api';
import { mergeBookHistory, filterBookHistory, formatCurrency } from './../../../helper';

class UpdateContactInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isChild: false,
        }
    }

    getStatusItem = (status) => {
        let colorStatus = 'danger';
        let textStatus = 'yêu cầu hủy';
        switch (status) {
            case 'paid':
                colorStatus = 'success';
                textStatus = 'đã thanh toán';
                break;
            case 'booked':
                colorStatus = 'warning';
                textStatus = 'chưa thanh toán';
                break;
            case 'cancelled':
                colorStatus = 'default';
                textStatus = 'đã hủy';
                break;
        }
        return {
            colorStatus,
            textStatus
        };
    }

    getSex = (sex) => {
        let name = '';
        switch (sex) {
            case 'male':
                name = 'Nam';
                break;
            case 'female':
                name = 'Nữ';
                break;
            case 'other':
                name = 'Khác';
                break;
        }
        return name;
    }

    handleShowChildList = () => {
        this.setState({ isChild: !this.state.isChild });
    }

    openUpdateContactInfo = (event, item) => {
        event.preventDefault();
        this.props.openUpdateContactInfo(item);
    }

    openUpdatePassenger = (event, item) => {
        event.preventDefault();
        this.props.openUpdatePassenger(item);
    }

    handleOpenModalPay = (event, item) => {
        event.preventDefault();
        this.props.handleOpenModalPay(item);
    }

    handleCancelRequest = (code) => {
        this.props.handleCancelRequest(code);
    }

    render() {
        const { item, index, passengers } = this.props;
        const status = this.getStatusItem(item.status);
        return <>
            <tr>
                <td>{index + 1}</td>
                <td>#{item.id}</td>
                <td>{item.book_tour_contact_info.fullname}</td>
                <td>{item.book_tour_contact_info.phone}</td>
                <td>{item.book_tour_contact_info.email}</td>
                <td>
                    {item.num_passenger} &nbsp;
                    <i onClick={this.handleShowChildList} style={{ cursor: 'pointer' }} className="fa fa-eye" />
                </td>
                <td>{formatCurrency(item.total_pay)}</td>
                <td>{moment(item.book_time).format('DD/MM/YYYY HH:mm')}</td>
                <td>
                    {status.colorStatus !== 'danger' && <label className={`label label-${status.colorStatus} disabled`} >
                        {status.textStatus}
                    </label>}
                    {status.colorStatus === 'danger' && <label
                        onClick={() => this.handleCancelRequest(item.code)}
                        style={{ cursor: 'pointer' }}
                        className={`label label-${status.colorStatus}`}>
                        {status.textStatus}
                    </label>}
                </td>
                <td>
                    {status.colorStatus === 'warning' ? <button
                        onClick={(event) => this.handleOpenModalPay(event, item)}
                        title="thanh toán"
                        className="btn btn-xs btn-success">
                        <i className="fa fa-money" />
                    </button> : <button
                        className="btn btn-xs btn-success"
                        disabled>
                            <i className="fa fa-money" />
                    </button>}
                </td>
                <td>
                    {status.colorStatus == 'success' ? <button
                        type="button"
                        title="hoàn tiền"
                        className="btn btn-xs btn-success" >
                        <i className="fa fa-credit-card" />
                    </button> : <button
                        type="button"
                        disabled
                        className="btn btn-xs btn-success" >
                        <i className="fa fa-credit-card" />
                    </button>}
                </td>
                <td>
                    <button
                        onClick={(event) => this.openUpdateContactInfo(event, item.book_tour_contact_info)}
                        type="button"
                        title="chỉnh sửa"
                        className="btn btn-xs btn-success" >
                        <i className="fa fa-pencil" />
                    </button>
                </td>
            </tr>
            {this.state.isChild && <tr>
                <td colSpan="12" className="td_mini_table">
                    <table className="table table-bordered table-hover dt-responsive mini_table">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>ID</th>
                                <th>Tên</th>
                                <th>Ngày sinh</th>
                                <th>Loại hành khách </th>
                                <th>Số điện thoại</th>
                                <th>Giới tính</th>
                                <th><i className="fa fa-pencil" /></th>
                            </tr>
                        </thead>
                        <tbody>
                            {passengers.map((passenger, i) => {
                                return <tr key={i}>
                                    <td>#{i + 1}</td>
                                    <td>{passenger.id}</td>
                                    <td>{passenger.fullname}</td>
                                    <td>{moment(passenger.birthdate).format('DD/MM/YYYY')}</td>
                                    <td>{passenger.type_passenger.name}</td>
                                    <td>{passenger.phone}</td>
                                    <td>{this.getSex(passenger.sex)}</td>
                                    <td>
                                        <button onClick={(event) => this.openUpdatePassenger(event, passenger)} className="btn btn-xs btn-success">
                                            <i className="fa fa-pencil" />
                                        </button>
                                    </td>
                                </tr>;
                            })}
                        </tbody>
                    </table>
                </td>
            </tr>}
            </>;
    }
}

export default UpdateContactInfo;
// const mapStateToProps = (state) => {
//     return {
//     }
// }

// const mapDispatchToProps = (dispatch, action) => {
//     return {
//     }
// }
// export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UpdateContactInfo));