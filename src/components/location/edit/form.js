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

class InfoEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: null,
            name: '',
            desc: '',
            status: null,
            listTypeLocation: null,
            success: false,
            error: false,
            image: null,
            newImage: null,
            newPreviewImage: null,
            listProvinces: null,
            listCountries: null,
            country: null,
            province: null,
            lat: '',
            lng: '',
            address: ''
        }
    }
    async componentDidMount() {
        let { listTypeLocation, listCountries, listProvinces } = this.props;
        const { id } = this.props.match.params;
        let location = null;
        try {
            location = await apiGet(`/location/getById/${id}`)
            location = location.data.data;
            this.props.handleInputLocation({
                marker: { lat: parseFloat(location.latitude), lng: parseFloat(location.longitude) },
                address: location.address
            });
            console.log(location)
        } catch (error) {
            console.log(error);
        }
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
                listProvinces = listProvinces.data.data;
                this.props.getListProvinces(listProvinces);
            } catch (error) {
                console.log(error);
            }
        }
        this.setState({
            name: location.name,
            desc: location.description,
            status: location.status,
            selected: { ...location.type },
            province: location.province,
            country: location.province.country,
            image: location.featured_img,
            listTypeLocation: listTypeLocation,
            listProvinces,
            listCountries
        });
    }

    componentWillReceiveProps = (nextProps) => {
        console.log('componentWillReceiveProps')
        const { locationInfo } = nextProps;
        if (locationInfo) {
            this.setState({
                lat: locationInfo.marker.lat,
                lng: locationInfo.marker.lng,
                address: locationInfo.address
            });
        }
    }

    handleChangeSelect = (selected) => {
        this.setState({ selected });
    }

    handleSelectProvince = (selected) => {
        this.setState({ province: selected });
    }

    handleChangeCountry = (selected) => {
        const { listProvinces } = this.state;
        const provinces = listProvinces.filter((item) => item.country.id === selected.id);
        this.setState({ country: selected, listProvinces: provinces });
    }

    handleChange = (event) => {
        let target = event.target;
        let name = target.name;
        let value = target.value;
        this.setState({ [name]: value });
    }

    checkLocation = () => {
        if (this.state.lat === '' || this.state.lng === '' ||
            this.state.address === '' || this.state.name === '' || !this.state.selected.id || (!this.state.image && !this.state.newImage)) {
            return false;
        }
        return true;
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        if (this.checkLocation()) {
            try {
                let form = new FormData();
                form.append('id', this.props.match.params.id);
                form.append('latitude', this.state.lat);
                form.append('longitude', this.state.lng);
                form.append('name', this.state.name);
                form.append('address', this.state.address);
                form.append('description', this.state.desc);
                form.append('status', this.state.status);
                form.append('fk_type', this.state.selected.id);
                if (this.state.newImage) {
                    form.append('image', this.state.newImage);
                }
                form.append('fk_country', this.state.country.id);
                form.append('fk_province', this.state.province.id);
                let itemEdit = await apiPost('/location/update', form);
                if (!this.props.listLocation) {
                    try {
                        let listLocation = await apiGet('/location/getAllWithoutPagination');
                        this.props.getListLocation(listLocation.data.data);
                    } catch (error) {
                        console.log(error);
                    }
                } else {
                    this.props.editLocation({
                        ...itemEdit.data.data,
                        type: this.state.selected
                    });
                }
                this.setState({ success: true });
            } catch (error) {
                this.setState({ error: true });
            }
        } else {
            this.setState({ error: true });
        }
    }

    hideSuccessAlert = () => {
        this.props.history.push('/location/list');
    }

    hideFailAlert = () => {
        this.setState({ error: false });
    }

    handleChangeImage = (event) => {
        let file = event.target.files[0];
        // if (file.size > 1024 * 1024) {
        //     return;
        // }
        let reader = new FileReader();
        event.target.value = null;
        reader.onloadend = () => {
            event.target = null;
            this.setState({ newImage: file, newPreviewImage: reader.result });
        }
        reader.readAsDataURL(file)
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
                this.setState({ address, lat: parseFloat(lat), lng: parseFloat(lng) });
            }
        }, 500);
    }

    deletePreviewImage = () => {
        this.setState({ newImage: null, newPreviewImage: null });
    }

    render() {
        // let { name, desc, listType, selected, status, listProvinces, lat, lng, address, province, country, listCountries } = this.state;
        return (<section className="content">
            <div className="row">
                <div className="col-lg-4 col-xs-12">
                    <div className="box box-warning">
                        <form >
                            <div className="box-body">
                                <div className="form-group">
                                    <label>Vĩ Độ</label>
                                    <input
                                        onChange={this.handleChangeLatLng}
                                        name="lat"
                                        value={this.state.lat}
                                        required
                                        type="text"
                                        className="form-control" />
                                </div>
                                <div className="form-group">
                                    <label>Tên</label>
                                    <input
                                        required
                                        type="text"
                                        onChange={this.handleChange}
                                        name="name"
                                        value={this.state.name}
                                        className="form-control" />
                                </div>
                                <div className="form-group">
                                    <label>Tỉnh Thành</label>
                                    {this.state.listCountries && <Select
                                        onChange={this.handleChangeCountry}
                                        options={newListSelect(this.state.listCountries)}
                                        defaultValue={{
                                            label: this.state.country ? this.state.country.name : '',
                                            value: this.state.country ? this.state.country.id : ''
                                        }}
                                        maxMenuHeight={200}
                                        placeholder=""
                                    />}
                                </div>
                                <div className="form-group">
                                    <label>Địa Chỉ</label>
                                    <textarea
                                        onChange={this.handleChange}
                                        name="address"
                                        value={this.state.address}
                                        required
                                        className="form-control" rows={3} />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="col-lg-4 col-xs-12">
                    <div className="box box-warning">
                        <form>
                            <div className="box-body">
                                <div className="form-group">
                                    <label>Kinh Độ</label>
                                    <input
                                        onChange={this.handleChangeLatLng}
                                        name="lng"
                                        value={this.state.lng}
                                        required
                                        type="text"
                                        className="form-control" />
                                </div>
                                <div className="form-group">
                                    <label>Loại</label>
                                    {this.state.listTypeLocation && <Select
                                        onChange={this.handleChangeSelect}
                                        options={newListSelect(this.state.listTypeLocation)}
                                        defaultValue={{
                                            label: this.state.selected ? this.state.selected.name : '',
                                            value: this.state.selected ? this.state.selected.id : ''
                                        }}
                                        maxMenuHeight={250}
                                        placeholder=""
                                    />}
                                </div>
                                <div className="form-group">
                                    <label>Thành Phố</label>
                                    {this.state.listProvinces && <Select
                                        onChange={this.handleSelectProvince}
                                        options={newListSelect(this.state.listProvinces.filter(province => province.country.id === this.state.country.id))}
                                        defaultValue={{
                                            label: this.state.province ? this.state.province.name : '',
                                            value: this.state.province ? this.state.province.id : ''
                                        }}
                                        maxMenuHeight={200}
                                    />}
                                </div>
                                <div className="form-group">
                                    <label>Mô Tả</label>
                                    <textarea
                                        onChange={this.handleChange}
                                        name="desc"
                                        value={this.state.desc}
                                        className="form-control"
                                        rows={3} />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="col-lg-4 col-xs-12">
                    <div className="box box-warning">
                        <form>
                            <div className="box-body">
                                <div className="form-group">
                                    <label>Hình Ảnh</label>
                                    <input onChange={this.handleChangeImage} type="file" id="exampleInputFile" />
                                    <div style={{ width: '100%', margin: '1px' }} className="gallery">
                                        <div className="container-image">
                                            {this.state.newPreviewImage ?
                                                <img src={this.state.newPreviewImage} alt="" width="300" height="195" /> :
                                                (this.state.image ?
                                                    <img src={this.state.image} alt="" width="300" height="195" /> :
                                                    <img src="http://denrakaev.com/wp-content/uploads/2015/03/no-image-800x511.png" alt="Cinque Terre" width="300" height="195" />
                                                )
                                            }
                                            <div className="topright-image">
                                                {this.state.newPreviewImage ? <i onClick={this.deletePreviewImage} className="fa fa-times-circle-o delete-icon" /> : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Trạng Thái</label>
                                    <select
                                        value={this.state.status ? this.state.status : 'active'}
                                        onChange={this.handleChange}
                                        name="status"
                                        className="form-control">
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
                    <button
                        onClick={this.handleSubmit}
                        type="button"
                        className="btn btn-primary pull-right">
                        Lưu Thay Đổi
                    </button>
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
        listTypeLocation: state.listTypeLocation,
        listLocation: state.allLocation,
        listCountries: state.listCountries,
        listProvinces: state.listProvinces
    }
}

const mapDispatchToProps = (dispatch, action) => {
    return {
        getListTypeLocation: (type) => dispatch(actions.getListTypeLocation(type)),
        editLocation: (location) => dispatch(actions.editLocation(location)),
        getListLocation: (location) => dispatch(actions.getListLocation(location)),
        getListCountries: (countries) => dispatch(actions.getListCountries(countries)),
        getListProvinces: (provinces) => dispatch(actions.getListProvinces(provinces))
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(InfoEdit));