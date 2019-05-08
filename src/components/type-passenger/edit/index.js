import React, { Component } from 'react';

class EditTypePassenger extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            id: ''
        }
    }

    componentDidMount = () => {
        const { name, id } = this.props;
        this.setState({ name, id });
    }


    handleEdit = (event) => {
        event.preventDefault();
        this.props.handleEdit(this.state);
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
                <h1> Chỉnh Sửa Loại Hành Khách <i>#{this.state.id}</i> </h1>
            </section>
            <section className="content">
                <div className="row">
                    <div className="col-lg-12 col-xs-12 ">
                        <div className="box box-info">
                            <form onSubmit={this.handleEdit} className="form-horizontal">
                                <div className="box-body">
                                    <div className="form-group">
                                        <label className="col-sm-2 control-label">Tên Quốc Gia</label>
                                        <div className="col-sm-9">
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

export default EditTypePassenger;
