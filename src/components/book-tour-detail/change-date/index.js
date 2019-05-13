import React, { Component } from 'react';
import moment from 'moment';
import { apiPost } from '../../../services/api';

class ChangeDate extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            period: ''
        }
    }

    componentDidMount = () => {
        this.setState({
            id: this.props.id,
            period: this.props.period
        });
    }

    handleChange = ({ target }) => {
        this.setState({ period: target.value });
    }

    handleChangeDate = async (event) => {
        event.preventDefault();
        if(this.state.id !== '' && this.state.period !== '') {
            try {
                await apiPost('api', {
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
                <section className="content">
                    <div className="row invoice-info">
                        <form onSubmit={this.handleChangeDate} className="form-horizontal">
                            <div className="box-body">
                                <div className="form-group">
                                    <label className="col-sm-3 control-label">Hạn hoàn tiền</label>
                                    <div className="col-sm-8">
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