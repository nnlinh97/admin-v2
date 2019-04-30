import React, { Component } from 'react';
import Select from 'react-select';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import SweetAlert from 'react-bootstrap-sweetalert';
import Geocode from "react-geocode";
import * as actions from './../../../actions/index';
import { apiGet, apiPost } from './../../../services/api';
import { newListSelect } from '../../../helper';
import './../index.css';

class info extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: null,
            name: '',
            desc: '',
            status: 'active',
            success: false,
            error: false,
            image: null,
            previewImage: null,
            listProvinces: [],
            country: null,
            province: null,
            lat: '',
            lng: '',
            address: ''
        }
    }

    async componentDidMount() {
        let { listTypeLocation, listCountries, listProvinces, locationInfo } = this.props;
        if (!listTypeLocation.length) {
            try {
                listTypeLocation = await apiGet('/type/getAll');
                listTypeLocation = listTypeLocation.data.data;
                this.props.getListTypeLocation(listTypeLocation);
            } catch (error) {
                console.log(error);
            }
        }
        if (!listCountries.length) {
            try {
                listCountries = await apiGet('/tour_classification/getAllCountries_admin');
                listCountries = listCountries.data.data;
                this.props.getListCountries(listCountries);
            } catch (error) {
                console.log(error);
            }
        }
        if (!listProvinces.length) {
            try {
                listProvinces = await apiGet('/tour_classification/getAllProvinces_admin');
                listProvinces = newListSelect(listProvinces.data.data);
            } catch (error) {
                console.log(error);
            }
        }
        this.setState({ listProvinces });
        this.props.getListProvinces(listProvinces);
    }

    componentWillReceiveProps = (nextProps) => {
        const { locationInfo } = nextProps;
        this.setState({
            lat: locationInfo ? locationInfo.marker.lat : '',
            lng: locationInfo ? locationInfo.marker.lng : '',
            address: locationInfo ? locationInfo.address : ''
        });
    }

    // componentWillUnmount = () => {
    //     this.props.changeLocationInfo(null);
    // }

    handleChangeSelect = (selected) => {
        this.setState({ selected });
    }

    handleSelectProvince = (selected) => {
        this.setState({ province: selected });
    }

    handleChangeCountry = (selected) => {
        const { listProvinces } = this.props;
        const provinces = listProvinces.filter((item) => item.country.id === selected.id);
        this.setState({ country: selected, listProvinces: provinces });
    }

    checkLocation = () => {
        if (this.state.lat === '' || this.state.lng === '' ||
            this.state.address === '' || this.state.name === '' || !this.state.selected || !this.state.image) {
            return false;
        }
        if (!this.state.country || !this.state.province) {
            return false;
        }
        return true;
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        if (this.checkLocation()) {
            try {
                const form = new FormData();
                form.append('latitude', this.state.lat);
                form.append('longitude', this.state.lng);
                form.append('name', this.state.name);
                form.append('description', this.state.desc);
                form.append('address', this.state.address);
                form.append('image', this.state.image, 'name.jpg');
                form.append('status', this.state.status);
                form.append('fk_type', this.state.selected.id);
                form.append('fk_country', this.state.country.id);
                form.append('fk_province', this.state.province.id);

                const locationCreate = await apiPost('/location/create', form);
                this.setState({ success: true });
            } catch (error) {
                console.log(error);
                this.setState({ error: true });
            }
        } else {
            this.setState({ error: true });
        }
    }

    handleChange = (event) => {
        let target = event.target;
        let name = target.name;
        let value = target.value;
        this.setState({ [name]: value });
    }

    handleChangeLatLng = async (event) => {
        let target = event.target;
        let name = target.name;
        let value = target.value;
        this.setState({ [name]: value });
        setTimeout(async () => {
            const newLat = this.state.lat;
            const newLng = this.state.lng;
            if (newLat !== '' && newLng !== '') {
                const result = await Geocode.fromLatLng(newLat, newLng);
                const { lat, lng } = result.results[0].geometry.location;
                const address = result.results[0].formatted_address;
                this.props.handleInputLocation({
                    marker: { lat, lng },
                    address
                });
                this.setState({ address, lat, lng });
            }
        }, 500);
    }

    hideSuccessAlert = () => {
        this.props.history.push('/location/list');
    }

    hideFailAlert = () => {
        this.setState({ error: false });
    }

    handleChangeImage = (event) => {
        let file = event.target.files[0];
        let reader = new FileReader();
        event.target.value = null;
        reader.onloadend = () => {
            event.target = null;
            this.setState({ image: file, previewImage: reader.result });
        }
        reader.readAsDataURL(file)
    }

    deletePreviewImage = () => {
        this.setState({ image: null, previewImage: null });
    }

    checkLatLngInput = async () => {
        const { lat, lng } = this.state;
        if (lat === '' || lng === '') {
            return;
        } else {
            const location = await Geocode.fromLatLng(lat, lng);
            console.log(location);
        }
    }

    render() {
        const { name, desc } = this.state;
        return (
            <section className="content">
                <div className="row">
                    <div className="col-lg-4 col-xs-12">
                        <div className="box box-warning">
                            <form role="form">
                                <div className="box-body">
                                    <div className="form-group">
                                        <label>Vĩ Độ (*)</label>
                                        <input
                                            onChange={this.handleChangeLatLng}
                                            value={this.state.lat}
                                            name="lat"
                                            required
                                            type="text"
                                            className="form-control" />
                                    </div>
                                    <div className="form-group">
                                        <label>Tên (*)</label>
                                        <input type="text" onChange={this.handleChange} name="name" value={name} required className="form-control" />
                                    </div>
                                    <div className="form-group">
                                        <label>Quốc Gia (*)</label>
                                        <Select
                                            value={this.state.country}
                                            onChange={this.handleChangeCountry}
                                            options={newListSelect(this.props.listCountries)}
                                            maxMenuHeight={200}
                                            placeholder=""
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Địa Chỉ (*)</label>
                                        <textarea
                                            onChange={this.handleChange}
                                            value={this.state.address}
                                            name="address"
                                            required
                                            className="form-control"
                                            rows={3}
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="col-lg-4 col-xs-12">
                        <div className="box box-warning">
                            <form role="form">
                                <div className="box-body">
                                    <div className="form-group">
                                        <label>Kinh Độ (*)</label>
                                        <input
                                            onChange={this.handleChangeLatLng}
                                            value={this.state.lng}
                                            name="lng"
                                            required
                                            type="text"
                                            className="form-control"
                                            placeholder="" />
                                    </div>
                                    <div className="form-group">
                                        <label>Loại (*)</label>
                                        <Select
                                            value={this.state.selected}
                                            onChange={this.handleChangeSelect}
                                            options={newListSelect(this.props.listTypeLocation)}
                                            maxMenuHeight={250}
                                            placeholder=""
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Tỉnh Thành (*)</label>
                                        <Select
                                            value={this.state.province}
                                            onChange={this.handleSelectProvince}
                                            options={newListSelect(this.state.listProvinces)}
                                            maxMenuHeight={200}
                                            placeholder=""
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Mô Tả</label>
                                        <textarea onChange={this.handleChange} name="desc" value={desc} className="form-control" rows={3} />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="col-lg-4 col-xs-12">
                        <div className="box box-warning">
                            <form role="form">
                                <div className="box-body">
                                    <div className="form-group">
                                        <label>Hình Ảnh (*)</label>
                                        <input onChange={this.handleChangeImage} type="file" id="exampleInputFile" />
                                        <div style={{ width: '100%', margin: '1px' }} className="gallery">
                                            <div className="container-image">
                                                {this.state.previewImage ?
                                                    <img src={this.state.previewImage} alt="Cinque Terre" width="300" height="195" /> :
                                                    <img src="http://denrakaev.com/wp-content/uploads/2015/03/no-image-800x511.png" alt="Cinque Terre" width="300" height="195" />
                                                }
                                                <div className="topright-image">
                                                    {this.state.previewImage ?
                                                        <i onClick={this.deletePreviewImage} className="fa fa-times-circle-o delete-icon" />
                                                        :
                                                        null
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Trạng Thái (*)</label>
                                        <select value={this.state.status} onChange={this.handleChange} name="status" className="form-control">
                                            <option value="active">Mở</option>
                                            <option value="inactive">Đóng</option>
                                        </select>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="form-group">
                        <label>&nbsp;</label>
                        <button onClick={this.handleSubmit} type="button" className="btn btn-primary pull-right">Lưu Thay Đổi</button>
                    </div>
                </div>
                {this.state.success && <SweetAlert
                    success
                    title="Lưu Thành Công"
                    onConfirm={this.hideSuccessAlert}>
                    Tiếp Tục...
                </SweetAlert>}
                {this.state.error && <SweetAlert
                    warning
                    confirmBtnText="Hủy"
                    confirmBtnBsStyle="default"
                    title="Đã Có Lỗi Xảy Ra!"
                    onConfirm={this.hideFailAlert}>
                    Vui Lòng Kiểm Tra Lại...
                </SweetAlert>}
            </section>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        // info: state.infoLocation,
        listTypeLocation: state.listTypeLocation,
        listLocation: state.listLocation,
        listCountries: state.listCountries,
        listProvinces: state.listProvinces
    }
}

const mapDispatchToProps = (dispatch, action) => {
    return {
        changeLocationInfo: (info) => dispatch(actions.changeLocationInfo(info)),
        getListTypeLocation: (type) => dispatch(actions.getListTypeLocation(type)),
        createLocation: (location) => dispatch(actions.createLocation(location)),
        getListLocation: (locations) => dispatch(actions.getListLocation(locations)),
        getListCountries: (countries) => dispatch(actions.getListCountries(countries)),
        getListProvinces: (provinces) => dispatch(actions.getListProvinces(provinces))
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(info));