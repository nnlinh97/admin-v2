import React, { Component } from 'react';
import { apiPost } from '../../../services/api';

class CancelRequestComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            optionReciever: '',
            nameReciever: '',
            passportReciever: '',
            noteReciever: ''
        }
    }

    componentDidMount() {
        this.setState({
            optionReciever: this.props.people.helper ? 'op2' : 'op1',
            nameReciever: this.props.people.name,
            passportReciever: this.props.people.passport,
            noteReciever: this.props.people.note
        });
    }


    handleChangeRefundPeople = async (event) => {
        event.preventDefault();
        if (this.checkInputReceiver()) {
            try {
                await apiPost('/cancel_booking/updateRefundMessage', {
                    idCancelBooking: this.props.id,
                    refund_message: {
                        name: this.state.nameReciever,
                        passport: this.state.passportReciever,
                        note: this.state.noteReciever,
                        helper: this.state.optionReciever === 'op1' ? false : true
                    }
                });
                this.props.handleChangeRefundPeople(true);
            } catch (error) {
                this.props.handleChangeRefundPeople(false);
            }
        } else {
            this.props.handleChangeRefundPeople(false);
        }
    }

    checkInputReceiver = () => {
        const { nameReciever, passportReciever } = this.state;
        if (nameReciever === '' || passportReciever === '') {
            return false;
        }
        return true;
    }

    handleChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;
        this.setState({ [name]: value });
    }

    handleChangeRadioReciever = ({ target }) => {
        if (this.props.people.helper) {
            this.setState({
                optionReciever: target.value,
                nameReciever: target.value === 'op1' ? this.props.contactInfo.fullname : this.props.people.name,
                passportReciever: target.value === 'op1' ? this.props.contactInfo.passport : this.props.people.passport,
                noteReciever: target.value === 'op1' ? '' : this.props.people.note
            });
        } else {
            this.setState({
                optionReciever: target.value,
                passportReciever: target.value === 'op1' ? this.props.people.passport : '',
                nameReciever: target.value === 'op1' ? this.props.people.name : '',
                noteReciever: target.value === 'op1' ? this.props.people.note : '',
            });
        }
    }

    render() {
        return <div style={{ marginLeft: '0px' }} className="content-wrapper">
            <section style={{ marginBottom: "0px" }} className="content-header">
                <h1>Thay Đổi Người Nhận Tiền</h1>
            </section>
            <section style={{ minHeight: '160px' }} className="content">
                <div className="row">
                    <div className="col-lg-12 col-xs-12 ">
                        <div className="box box-info">
                            <form onSubmit={this.handleChangeRefundPeople} className="form-horizontal">
                                <div className="box-body">
                                    <div className="form-group">
                                    </div>
                                    <div className="form-group">
                                        <div className="col-sm-12">
                                            <div className="col-sm-12">
                                                <div className="form-group">
                                                    <label className="col-sm-2 control-label">Nhận Tiền</label>
                                                    <div className="col-sm-6">
                                                        <div className="col-sm-6 radio">
                                                            <label>
                                                                <input
                                                                    onChange={this.handleChangeRadioReciever}
                                                                    type="radio"
                                                                    name="optionReciever"
                                                                    value="op1"
                                                                    checked={this.state.optionReciever === 'op1' ? true : false} />
                                                                Người đặt tour
                                                                </label>
                                                        </div>
                                                        <div className="col-sm-6 radio">
                                                            <label>
                                                                <input
                                                                    onChange={this.handleChangeRadioReciever}
                                                                    type="radio"
                                                                    name="optionReciever"
                                                                    value="op2"
                                                                    checked={this.state.optionReciever === 'op2' ? true : false} />
                                                                Người nhận hộ
                                                                </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-12">
                                                <div className="form-group">
                                                    <label className="col-sm-2 control-label">Tên</label>
                                                    <div className="col-sm-10">
                                                        <input
                                                            onChange={this.handleChange}
                                                            value={this.state.nameReciever}
                                                            type="text"
                                                            name="nameReciever"
                                                            className="form-control"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-sm-2 control-label">CMND</label>
                                                    <div className="col-sm-10">
                                                        <input
                                                            onChange={this.handleChange}
                                                            value={this.state.passportReciever}
                                                            type="text"
                                                            name="passportReciever"
                                                            className="form-control"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-sm-2 control-label">Chú thích</label>
                                                    <div className="col-sm-10">
                                                        <textarea
                                                            onChange={this.handleChange}
                                                            value={this.state.noteReciever}
                                                            type="text"
                                                            name="noteReciever"
                                                            className="form-control"
                                                            row={3}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="box-footer col-sm-12">
                                    <button type="submit" className="btn btn-info pull-right">Lưu Thay Đổi</button>
                                </div>
                            </form><br />
                        </div>
                    </div>
                </div>
            </section>
        </div>;
    }
}

export default CancelRequestComponent;