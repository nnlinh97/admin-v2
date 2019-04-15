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

    componentDidMount = () => {
        const { name } = this.props;
        this.setState({ name });
    }


    handleEdit = () => {
        const { name } = this.state;
        this.props.handleEdit(name);
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
        const { name } = this.state;
        return (<div className="modal-content">
            <div className="modal-header">
                <h4 className="modal-title">Edit Country</h4>
            </div>
            <div className="modal-body">
                <form className="form-horizontal">
                    <div className="box-body">
                        <div className="form-group">
                            <label htmlFor="inputEmail3" className="col-sm-2 control-label">Name</label>
                            <div className="col-sm-10">
                                <input required onChange={this.handleChange} name="name" value={name} type="text" className="form-control" id="inputEmail3" placeholder="Name" />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div className="modal-footer">
                <button onClick={this.handleEdit} type="button" className="btn btn-primary">Save changes</button>
            </div>
        </div>);
    }
}

export default withRouter(ListTypesComponent);
