import React, { Component } from 'react';
import { getStatusItem } from './../../../helper';
import { apiPost } from '../../../services/api';

class RemoveRequestComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id
        }
    }

    handleRemoveRequest = async (event) => {
        event.preventDefault();
        if (this.state.id !== '') {
            try {
                await apiPost('/cancel_booking/removeRequest', {
                    idCancelBooking: this.state.id,
                });
                this.props.handleRemoveRequest(true);
            } catch (error) {
                this.props.handleRemoveRequest(false);
            }
        } else {
            this.props.handleRemoveRequest(false);
        }
    }

    render() {
        return (
            <div className="">
                <section className="content-header">
                    <h1>Xác Nhận Hủy Yêu Cầu Hủy Đặt Tour</h1>
                </section>
                <section style={{ minHeight: '110px' }} className="content">
                    <div className="row invoice-info">
                        <form onSubmit={this.handleRemoveRequest} className="form-horizontal">
                            <div className="box-body">
                                Đơn đặt tour này sẽ thay đổi trạng thái từ&nbsp;
                                <span style={{ backgroundColor: getStatusItem('pending_cancel').colorStatus }} className={`label disabled`} >
                                    {getStatusItem('pending_cancel').textStatus}
                                </span> &nbsp;
                                thành &nbsp;
                                <span style={{ backgroundColor: getStatusItem('paid').colorStatus }} className={`label disabled`} >
                                    {getStatusItem('paid').textStatus}
                                </span><br />
                            </div>
                            <div className="box-footer col-sm-12">
                                <button type="submit" className="btn btn-info pull-right">Xác Nhận</button>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        );
    }
}

export default RemoveRequestComponent;