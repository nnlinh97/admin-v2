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
            name_vn: '',
            name_en: '',
        }
    }

    componentDidMount = () => {
        const { name_en, name_vn } = this.props;
        this.setState({ name_vn, name_en });
    }


    handleEdit = () => {
        const { name_vn, name_en } = this.state;
        this.props.handleEdit(name_vn, name_en);
    }

    handleChange = (event) => {
        let target = event.target;
        let name = target.name;
        let value = target.value;
        this.setState({
            [name]: value
        });
    }

    render() {
        const { name_vn, name_en } = this.state;
        return <div className="modal-content">
            <div className="modal-header">
                <h4 className="modal-title">Edit Transport</h4>
            </div>
            <div className="modal-body">
                <form className="form-horizontal">
                    <div className="box-body">
                        <div className="form-group">
                            <label htmlFor="inputEmail3" className="col-sm-2 control-label">Name VN</label>
                            <div className="col-sm-10">
                                <input required onChange={this.handleChange} name="name_vn" value={name_vn} type="text" className="form-control" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="inputPassword3" className="col-sm-2 control-label">Name EN</label>
                            <div className="col-sm-10">
                                <input onChange={this.handleChange} name="name_en" value={name_en} type="text" className="form-control" />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div className="modal-footer">
                <button onClick={this.handleEdit} type="button" className="btn btn-primary">Save</button>
            </div>
        </div>;
    }
}

export default withRouter(ListTypesComponent);
