import React, { Component } from 'react';
import Select from 'react-select';
import { apiGet, apiPost, apiPostAdmin } from '../../../services/api';

class EditAdminComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            roles: [],
            role: null,
            username: '',
            birthdate: ''
        }
    }

    async componentDidMount() {
        try {
            let roles = await apiGet('/roles_admin/getAll');
            roles = roles.data.data;
            roles.forEach((item) => {
                item.label = item.name;
            });
            const { admin } = this.props;
            this.setState({
                roles,
                name: admin.name,
                birthdate: admin.birthdate,
                username: admin.username,
                role: admin.roles_admin
            });
        } catch (error) {
            console.log(error);
        }
    }

    checkAdmin = () => {
        const { name, birthdate, role } = this.state;
        if (name === '' || role === null || birthdate === '') {
            return false;
        }
        return true;
    }

    handleEditAdmin = async (event) => {
        event.preventDefault();
        const { name, birthdate, role } = this.state;
        if (this.checkAdmin()) {
            try {
                await apiPostAdmin('/admin/update', {
                    adminId: this.props.admin.id,
                    name,
                    birthdate,
                    fk_role: role.id
                });
                this.props.handleEditAdmin(true);
            } catch (error) {
                this.props.handleEditAdmin(false);
            }
        } else {
            this.props.handleEditAdmin(false);
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
                <h1> Chỉnh Sửa Nhân Viên </h1>
            </section>
            <section className="content">
                <div className="row">
                    <div className="col-lg-12 col-xs-12 ">
                        <div className="box box-info">
                            <form onSubmit={this.handleEditAdmin} className="form-horizontal">
                                <div className="box-body">
                                    <div className="form-group">
                                        <label className="col-sm-3 control-label">Loại nhân viên</label>
                                        <div className="col-sm-8">
                                            {/* <Select
                                                onChange={this.handleChangeRole}
                                                options={this.state.roles}
                                                placeholder=""
                                            /> */}
                                            {this.state.role && <Select
                                                onChange={this.handleChangeRole}
                                                options={this.state.roles}
                                                defaultValue={{
                                                    label: this.state.role ? this.state.role.name : '',
                                                    value: this.state.role ? this.state.role.id : ''
                                                }}
                                                maxMenuHeight={200}
                                                placeholder=""
                                            />}
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
                                        <label className="col-sm-3 control-label">Ngày sinh *</label>
                                        <div className="col-sm-8">
                                            <input
                                                type="date"
                                                onChange={this.handleChange}
                                                value={this.state.birthdate}
                                                name="birthdate"
                                                className="form-control" />
                                        </div>
                                    </div>
                                </div>
                                <div className="box-body">
                                    <div className="form-group">
                                        <label className="col-sm-3 control-label">Tên đăng nhập *</label>
                                        <div className="col-sm-8">
                                            <input
                                                type="text"
                                                value={this.state.username}
                                                readOnly
                                                name="username"
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

export default EditAdminComponent;
