import React, { Component } from 'react';
import moment from 'moment';
import dateFns from 'date-fns';
import { apiPost } from '../../../services/api';

class ChangeDate extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            period: '',
            fromDate: ''
        }
    }

    componentDidMount = () => {
        this.setState({
            id: this.props.id,
            period: this.props.period,
            fromDate: moment( dateFns.addDays(new Date(this.props.fromDate), 3)).format('YYYY-MM-DD')
        });
    }

    handleChange = ({ target }) => {
        this.setState({ period: target.value });
    }

    handleChangeDate = async (event) => {
        event.preventDefault();
        if(this.state.id !== '' && this.state.period !== '') {
            try {
                await apiPost('/cancel_booking/updateRefundPeriod', {
                    idCancelBooking: this.state.id,
                    refund_period: moment(this.state.period).format('YYYY-MM-DD')
                });
                this.props.handleChangeDate(true);
            } catch (error) {
                this.props.handleChangeDate(false);
            }
        } else {
            this.props.handleChangeDate(false);
        }
    }

    render() {
        return (
            <div className="">
                <section className="content-header">
                    <h1>Thay Đổi Hạn Hoàn Tiền</h1>
                </section>
                <section style={{minHeight: '110px'}} className="content">
                    <div className="row invoice-info">
                        <form onSubmit={this.handleChangeDate} className="form-horizontal">
                            <div className="box-body">
                                <div className="form-group">
                                    <label className="col-sm-2 control-label">Ngày hẹn</label>
                                    <div className="col-sm-4">
                                        <input
                                            readOnly
                                            type="date"
                                            value={this.state.fromDate}
                                            name="fullname"
                                            className="form-control" />
                                    </div>
                                    <label className="col-sm-2 control-label">đến</label>
                                    <div className="col-sm-4">
                                        <input
                                            type="date"
                                            onChange={this.handleChange}
                                            value={this.state.period}
                                            name="fullname"
                                            className="form-control" />
                                    </div>
                                </div>
                            </div>
                            <div className="box-footer col-sm-11">
                                <button type="submit" className="btn btn-info pull-right">Lưu Thay Đổi</button>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        );
    }
}

export default ChangeDate;
// const mapStateToProps = (state) => {
//     return {
//     }
// }

// const mapDispatchToProps = (dispatch, action) => {
//     return {
//     }
// }
// export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ChangeDate));