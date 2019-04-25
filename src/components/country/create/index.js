import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import './../modal.css';
import * as actions from './../../../actions/index';
import { URL } from '../../../constants/url';
import axios from 'axios';
import { apiGet, apiPost } from './../../../services/api';
import Modal from 'react-responsive-modal';

class ListTypesComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: ''
        }
    }

    handleCreate = (event) => {
        event.preventDefault();
        const { name } = this.state;
        this.props.handleCreate(name);
    }

    handleChange = (event) => {
        let target = event.target;
        let name = target.name;
        let value = target.value;
        this.setState({ [name]: value });
    }

    render() {
        return <div style={{ marginLeft: '0px', height: '250px' }} className="content-wrapper">
            <section style={{ marginBottom: "20px" }} className="content-header">
                <h1> Thêm Mới Quốc Gia </h1>
            </section>
            <section className="content">
                <div className="row">
                    <div className="col-lg-12 col-xs-12 ">
                        <div className="box box-info">
                            <form onSubmit={this.handleCreate} className="form-horizontal">
                                <div className="box-body">
                                    <div className="form-group">
                                        <label className="col-sm-3 control-label">Tên Quốc Gia</label>
                                        <div className="col-sm-8">
                                            <input
                                                type="text"
                                                onChange={this.handleChange}
                                                value={this.state.name}
                                                name="name"
                                                className="form-control" />
                                        </div>
                                    </div>
                                </div>
                                <div className="box-footer col-sm-11">
                                    <button type="submit" className="btn btn-info pull-right">Lưu Thay Đổi</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>;
    }
}

export default withRouter(ListTypesComponent);
