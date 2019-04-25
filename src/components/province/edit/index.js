import React, { Component } from 'react';
// import './../modal.css';
import { newListSelect } from '../../../helper';
import Modal from 'react-responsive-modal';
import Select from 'react-select';

class EditProvinceComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            listCountries: null,
            country: ''
        }
    }

    componentDidMount = () => {
        const { name, listCountries, country } = this.props;
        this.setState({ name, listCountries, country });
    }

    handleEdit = (event) => {
        event.preventDefault();
        const { name, country } = this.state;
        this.props.handleEdit(name, country);
    }

    handleChange = (event) => {
        let target = event.target;
        let name = target.name;
        let value = target.value;
        this.setState({ [name]: value });
    }

    handleChangeCountry = (selected) => {
        this.setState({ country: selected });
    }

    render() {
        const { name, listCountries, country } = this.state;
        return <div style={{ marginLeft: '0px', height: '285px' }} className="content-wrapper">
            <section style={{ marginBottom: "20px" }} className="content-header">
                <h1> Thêm Mới Tỉnh Thành </h1>
            </section>
            <section className="content">
                <div className="row">
                    <div className="col-lg-12 col-xs-12 ">
                        <div className="box box-info">
                            <form onSubmit={this.handleEdit} className="form-horizontal">
                                <div className="box-body">
                                    <div className="form-group">
                                        <label className="col-sm-3 control-label">Tỉnh Thành</label>
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
                                        <label className="col-sm-3 control-label">Quốc Gia</label>
                                        <div className="col-sm-8">
                                            {this.state.listCountries && <Select
                                                onChange={this.handleChangeCountry}
                                                options={newListSelect(this.state.listCountries)}
                                                defaultValue={{
                                                    label: country !== '' ? country.name : '',
                                                    value: country !== '' ? country.id : ''
                                                }}
                                                maxMenuHeight={200}
                                                placeholder=""
                                            />}
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

export default EditProvinceComponent;
