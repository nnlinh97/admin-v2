import React, { Component } from 'react';
class EditTypeLocationComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            marker: '',
            id: ''
        }
    }

    componentDidMount = () => {
        const { type } = this.props;
        this.setState({
            name: type ? type.name : '',
            marker: type ? type.marker : '',
            id: type ? type.id : ''
        });
    }

    handleEditTypeLocation = (event) => {
        event.preventDefault();
        this.props.handleEditTypeLocation(this.state);
    }

    handleChange = (event) => {
        let target = event.target;
        let name = target.name;
        let value = target.value;
        this.setState({ [name]: value });
    }

    render() {
        const { name, marker, id } = this.state;
        return <div style={{ marginLeft: '0px', height: '285px' }} className="content-wrapper">
            <section style={{ marginBottom: "20px" }} className="content-header">
                <h1> Chỉnh Sửa Loại Địa Điểm</h1>
            </section>
            <section className="content">
                <div className="row">
                    <div className="col-lg-12 col-xs-12 ">
                        <div className="box box-info">
                            <form onSubmit={this.handleEditTypeLocation} className="form-horizontal">
                                <div className="box-body">
                                    <div className="form-group">
                                        <label className="col-sm-3 control-label">ID</label>
                                        <div className="col-sm-8">
                                            <input
                                                type="text"
                                                value={this.state.id}
                                                name="id"
                                                readOnly
                                                className="form-control" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-sm-3 control-label">Tên Tiếng Việt</label>
                                        <div className="col-sm-8">
                                            <input
                                                type="text"
                                                onChange={this.handleChange}
                                                value={this.state.name}
                                                name="name"
                                                className="form-control" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-sm-3 control-label">Tên Tiếng Anh</label>
                                        <div className="col-sm-8">
                                            <input
                                                type="text"
                                                onChange={this.handleChange}
                                                value={this.state.marker}
                                                name="marker"
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

export default EditTypeLocationComponent;
