import React, { Component } from 'react';
import Select from 'react-select';
import { apiGet, apiPost } from '../../../services/api';

class CreateRoleComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            roles: [],
            role: null
        }
    }

    async componentDidMount() {
        try {
            let roles = await apiGet('/roles_admin/getAll');
            roles = roles.data.data;
            roles.forEach((item) => {
                item.label = item.name;
            });
            this.setState({ roles });
        } catch (error) {
            console.log(error);
        }
    }

    checkAdmin = () => {
        const { name, username, password, role } = this.state;
        if(name === '' || username === '' || password === '' || role === null) {
            return false;
        }
        return true;
    }

    handleCreate = async (event) => {
        event.preventDefault();
        const { name, username, password, role } = this.state;
        if (this.checkAdmin()) {
            try {
                await apiPost('/admin/register', {
                    name,
                    username,
                    password,
                    fk_role: role.id
                });
                this.props.handleCreateAdmin(true);
            } catch (error) {
                this.props.handleCreateAdmin(false);
            }
        } else {
            this.props.handleCreateAdmin(false);
        }
    }

    handleChange = (event) => {
        let target = event.target;
        let name = target.name;
        let value = target.value;
        this.setState({ [name]: value });
    }



    handleChangeRole = (selected) => {
        this.setState({ role: selected });
    }

    render() {
        return <div style={{ marginLeft: '0px', height: '230px' }} className="content-wrapper">
            <section style={{ marginBottom: "20px" }} className="content-header">
                <h1> Thêm Mới Nhân Viên </h1>
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
                                            <Select
                                                onChange={this.handleChangeRole}
                                                options={this.state.roles}
                                                placeholder=""
                                            />
                                            {/* <input
                                                type="text"
                                                onChange={this.handleChange}
                                                value={this.state.name}
                                                name="name"
                                                className="form-control" /> */}
                                        </div>
                                    </div>
                                </div>
                                <div className="box-body">
                                    <div className="form-group">
                                        <label className="col-sm-3 control-label">Tên nhân viên</label>
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
                                <div className="box-body">
                                    <div className="form-group">
                                        <label className="col-sm-3 control-label">Tên đăng nhập</label>
                                        <div className="col-sm-8">
                                            <input
                                                type="text"
                                                onChange={this.handleChange}
                                                value={this.state.username}
                                                name="username"
                                                className="form-control" />
                                        </div>
                                    </div>
                                </div>
                                <div className="box-body">
                                    <div className="form-group">
                                        <label className="col-sm-3 control-label">Mật khẩu</label>
                                        <div className="col-sm-8">
                                            <input
                                                type="password"
                                                onChange={this.handleChange}
                                                value={this.state.password}
                                                name="password"
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
