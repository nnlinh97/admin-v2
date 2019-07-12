import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
// import ReactTable from 'react-table';
import 'react-table/react-table.css';
// import DatePicker from "react-datepicker";
import * as actions from './../../../actions/index';
// import { apiGet, apiPost } from '../../../services/api';
// import moment from 'moment';
import './index.css'

class ListTypesComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fullname: '',
            phone: '',
            birthdate: '',
            sex: '',
            passport: '',
            type_passenger: '',
            id: ''
        }
    }

    componentDidMount = async () => {
        const { passenger } = this.props;
        this.setState({
            fullname: passenger.fullname ? passenger.fullname : '',
            phone: passenger.phone ? passenger.phone : '',
            birthdate: passenger.birthdate,
            sex: passenger.sex ? passenger.sex : '',
            type_passenger: passenger.type_passenger ? passenger.type_passenger.id : '',
            passport: passenger.passport ? passenger.passport : '',
            id: passenger.id
        });
    }

    handleChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;
        this.setState({ [name]: value });
    }

    validatePassenger = (passenger) => {
        const { fullname, phone, id } = passenger;
        const phoneRegex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
        if (fullname === '') {
            return false;
        }
        if (phone !== '' && !phoneRegex.test(phone)) {
            return false;
        }
        if (id === '') {
            return false;
        }
        return true;
    }

    handleSave = (event) => {
        event.preventDefault();
        if (this.validatePassenger(this.state)) {
            this.props.handleUpdatePassenger(this.state);
        } else {
            this.props.handleUpdatePassenger(null);
        }
    }

    render() {
        const { fullname, phone, sex, type_passenger } = this.state;
        return (
            <div className="">
                <section className="content-header">
                    <h1> Chỉnh Sửa Thông Tin Hành Khách <i>#{this.state.id}</i> </h1>
                </section>
                <section className="content">
                    <div className="row invoice-info">
                        <form onSubmit={this.handleSave} className="form-horizontal">
                            <div className="box-body">
                                <div className="form-group">
                                    <label className="col-sm-3 control-label">Tên</label>
                                    <div className="col-sm-8">
                                        <input
                                            type="text"
                                            onChange={this.handleChange}
                                            value={fullname}
                                            name="fullname"
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-sm-3 control-label">Số điện thoại</label>
                                    <div className="col-sm-8">
                                        <input
                                            type="text"
                                            onChange={this.handleChange}
                                            value={phone}
                                            name="phone"
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-sm-3 control-label">Ngày sinh</label>
                                    <div className="col-sm-8">
                                        <input
                                            type="date"
                                            onChange={this.handleChange}
                                            value={this.state.birthdate}
                                            name="birthdate"
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-sm-3 control-label">Giới tính</label>
                                    <div className="col-sm-8">
                                        <select onChange={this.handleChange} value={sex} name="sex" className="form-control">
                                            <option value="male">Nam</option>
                                            <option value="female">Nữ</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-sm-3 control-label">Loại hành khách</label>
                                    <div className="col-sm-8">
                                        <select
                                            onChange={this.handleChange}
                                            value={type_passenger ? type_passenger : ''}
                                            name="type_passenger"
                                            className="form-control">
                                            <option value="1">Người lớn</option>
                                            <option value="2">Trẻ em</option>
                                        </select>
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

// export default withRouter(ListTypesComponent);
const mapStateToProps = (state) => {
    return {
        info: state.infoLocation,
        allType: state.allType,
        allLocation: state.allLocation,
        listTour: state.listTour,
        listTourTurn: state.listTourTurn,
        listBookTourTurn: state.listBookTourTurn
    }
}

const mapDispatchToProps = (dispatch, action) => {
    return {
        changeLocationInfo: (info) => dispatch(actions.changeLocationInfo(info)),
        getListTypeLocation: (type) => dispatch(actions.getListTypeLocation(type)),
        createType: (type) => dispatch(actions.createType(type)),
        editType: (type) => dispatch(actions.editType(type)),
        getListTour: (tour) => dispatch(actions.getListTour(tour)),
        getListTourTurn: (tourTurn) => dispatch(actions.getListTourTurn(tourTurn)),
        getTourTurnDetail: (tourTurn) => dispatch(actions.getTourTurnById(tourTurn)),
        getListBookTourTurn: (listBook) => dispatch(actions.getListBookTourTurn(listBook)),
        getBookTourTurnById: (book) => dispatch(actions.getBookTourTurnById(book))
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListTypesComponent));