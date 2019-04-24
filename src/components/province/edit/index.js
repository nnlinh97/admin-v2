import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import './../modal.css';
import * as actions from './../../../actions/index';
import { URL } from '../../../constants/url';
import axios from 'axios';
import { apiGet, apiPost } from './../../../services/api';
import { newListSelect } from '../../../helper';
import Modal from 'react-responsive-modal';
import Select from 'react-select';

class ListTypesComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            listCountries: [],
            country: ''
        }
    }

    componentDidMount = () => {
        const { name, listCountries, country } = this.props;
        this.setState({ name, listCountries, country });
    }


    handleEdit = () => {
        const { name, country } = this.state;
        console.log(name, country.id);
        this.props.handleEdit(name, country);
    }

    handleChange = (event) => {
        let target = event.target;
        let name = target.name;
        let value = target.value;
        this.setState({
            [name]: value
        });
    }

    handleChangeCountry = (selected) => {
        this.setState({ country: selected });
    }

    render() {
        const { name, listCountries, country } = this.state;
        return (<div className="modal-content">
            <div className="modal-header">
                <h4 className="modal-title">Chỉnh Sửa</h4>
            </div>
            <div className="modal-body">
                <form className="form-horizontal">
                    <div className="box-body">
                        <div className="form-group">
                            <label htmlFor="inputEmail3" className="col-sm-3 control-label">Tên Tỉnh Thành</label>
                            <div className="col-sm-9">
                                <input required onChange={this.handleChange} name="name" value={name} type="text" className="form-control" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="inputEmail3" className="col-sm-3 control-label">Quốc Gia</label>
                            <div className="col-sm-9">
                                {listCountries.length > 0 && <Select
                                    defaultValue={{ label: country !== '' ? country.name : '', value: country !== '' ? country.id : '' }}
                                    onChange={this.handleChangeCountry}
                                    options={newListSelect(listCountries)}
                                    maxMenuHeight={200}
                                    placeholder=""
                                />}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div className="modal-footer">
                <button onClick={this.handleEdit} type="button" className="btn btn-primary">Lưu Thay Đổi</button>
            </div>
        </div>);
    }
}

export default withRouter(ListTypesComponent);
