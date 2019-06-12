import React, { Component } from 'react';
import { apiGet, apiPost } from '../../../services/api';

class CreateRoleComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: ''
        }
    }

    handleCreate = async (event) => {
        event.preventDefault();
        const {name} = this.state;
        if(name !== '') {
            try {
                await apiPost('/roles_admin/create', this.state);
                this.props.handleCreateRole(true);
            } catch (error) {
                this.props.handleCreateRole(false);
            }
        } else {
            this.props.handleCreateRole(false);
        }
    }

    handleChange = (event) => {
        let target = event.target;
        let name = target.name;
        let value = target.value;
        this.setState({ [name]: value });
    }

    render() {
        return <div style={{ marginLeft: '0px', height: '230px' }} className="content-wrapper">
            <section style={{ marginBottom: "20px" }} className="content-header">
                <h1> Thêm Mới Loại Nhân Viên </h1>
            </section>
            <section className="content">
                <div className="row">
                    <div className="col-lg-12 col-xs-12 ">
                        <div className="box box-info">
                            <form onSubmit={this.handleCreate} className="form-horizontal">
                                <div className="box-body">
                                    <div className="form-group">
                                        <label className="col-sm-3 control-label">Loại nhân viên</label>
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

export default CreateRoleComponent;
