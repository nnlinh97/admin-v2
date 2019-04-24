import React, { Component } from 'react';
import Select from 'react-select';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from './../../actions/index';
import { URL } from '../../constants/url';
import axios from 'axios';
import { apiGet, apiPost } from './../../services/api';
import { newListSelect } from '../../helper'
import SweetAlert from 'react-bootstrap-sweetalert';
import Geocode from "react-geocode";
import './index.css'

class InfoEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: {
                name: null,
                id: null
            },
            name: '',
            desc: '',
            status: null,
            listType: null,
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
        let { allType, listCountries, listProvinces, locationInfo } = this.props;
        const id = this.props.match.params.id;
        if (this.props.match) {
            const id = this.props.match.params.id;
            try {
                let location = await apiGet(`/location/getById/${id}`)
                const data = location.data.data;
                await this.props.changeLocationInfo({
                    marker: {
                        lat: data.latitude,
                        lng: data.longitude
                    },
                    address: data.address
                });
                if (!allType) {
                    try {
                        allType = await apiGet('/type/getAll');
                        allType = allType.data.data;
                        this.props.getAllType(allType);
                    } catch (error) {
                        console.log(error);
                    }
                }
                if (!listCountries) {
                    try {
                        listCountries = await apiGet('/tour_classification/getAllCountries_admin');
                        listCountries = listCountries.data.data;
                        this.props.getListCountries(listCountries);
                    } catch (error) {
                        console.log(error);
                    }
                }
                if (!listProvinces) {
                    try {
                        listProvinces = await apiGet('/tour_classification/getAllProvinces_admin');
                        listProvinces = listProvinces.data.data;
                    } catch (error) {
                        console.log(error);
                    }
                }
                this.props.getListProvinces(listProvinces);
                this.setState({
                    name: data.name,
                    desc: data.description,
                    status: data.status,
                    selected: {
                        ...data.type
                    },
                    province: data.province,
                    country: data.province.country,
                    image: data.featured_img,
                    listType: allType,
                    listProvinces,
                    listCountries
                });
            } catch (error) {
                console.log(error);
            }

        }
    }

    componentWillReceiveProps = (nextProps) => {
        const { locationInfo } = nextProps;
        if (locationInfo) {
            this.setState({
                lat: locationInfo.marker.lat,
                lng: locationInfo.marker.lng,
                address: locationInfo.address
            });
        }
    }



    componentWillUnmount = () => {
        this.props.changeLocationInfo(null);
    }

    handleChangeSelect = (selected) => {
        this.setState({
            selected
        })
    }

    handleSelectProvince = (selected) => {
        this.setState({ province: selected });
    }

    handleChangeCountry = (selected) => {
        const { listProvinces } = this.state;
        const provinces = listProvinces.filter((item) => item.country.id === selected.id);
        this.setState({ country: selected, listProvinces: provinces });
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
        console.log('state: ', this.state);
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
                        this.props.getAllLocation(listLocation.data.data);
                    } catch (error) {
                        console.log(error);
                    }
                } else {
                    this.props.editLocation({
                        ...itemEdit.data.data,
                        type: this.state.selected
                    });
                }
                console.log('data: ', itemEdit.data.data);
                this.setState({ success: true });
            } catch (error) {
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
        this.setState({
            [name]: value
        });
    }

    handleRefresh = async (event) => {
        event.preventDefault();
        window.location.reload();
        try {
            let data = await axios.get(`${URL}/location/getById/${this.props.match.params.id}`);
            const location = data.data.data;
            this.props.changeMarkerPosition({
                lat: location.latitude,
                lng: location.longitude,
                address: location.address
            })
        } catch (error) {

        }

    }

    hideSuccessAlert = () => {
        // this.setState({
        //     success: false
        // });
        this.props.history.push('/location/list');
    }

    hideFailAlert = () => {
        this.setState({
            error: false
        });
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
            this.setState({
                newImage: file,
                newPreviewImage: reader.result
            });
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
                    marker: {
                        lat,
                        lng
                    },
                    address
                });
                this.setState({ address, lat: parseFloat(lat), lng: parseFloat(lng) });
            }
        }, 500);
    }

    deletePreviewImage = () => {
        this.setState({
            newImage: null,
            newPreviewImage: null
        });
    }

    render() {
        // let marker = null;
        // let address = null;
        // if (this.props.info) {
        //     marker = this.props.info.marker;
        //     address = this.props.info.address;
        // }
        let { name, desc, listType, selected, status, listProvinces, lat, lng, address, province, country, listCountries } = this.state;
        return (<section className="content">
            <div className="row">
                <div className="col-lg-4 col-xs-12">
                    <div className="box box-warning">
                        <form role="form">
                            <div className="box-body">
                                <div className="form-group">
                                    <label>Vĩ Độ</label>
                                    <input
                                        onChange={this.handleChangeLatLng}
                                        name="lat"
                                        value={lat}
                                        required
                                        type="text"
                                        className="form-control" />
                                </div>
                                <div className="form-group">
                                    <label>Tên</label>
                                    <input type="text" onChange={this.handleChange} name="name" value={name ? name : ''} required className="form-control" />
                                </div>
                                <div className="form-group">
                                    <label>Tỉnh Thành</label>
                                    {listCountries && <Select
                                        onChange={this.handleChangeCountry}
                                        options={newListSelect(listCountries)}
                                        defaultValue={{ label: country ? country.name : '', value: country ? country.id : '' }}
                                        maxMenuHeight={200}
                                        placeholder=""
                                    />}
                                </div>
                                <div className="form-group">
                                    <label>Địa Chỉ</label>
                                    <textarea
                                        onChange={this.handleChange}
                                        name="address"
                                        value={address}
                                        required
                                        className="form-control" rows={3} />
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
                                    <label>Kinh Độ</label>
                                    <input
                                        onChange={this.handleChangeLatLng}
                                        name="lng"
                                        value={lng}
                                        required
                                        type="text"
                                        className="form-control" />
                                </div>
                                <div className="form-group">
                                    <label>Loại</label>
                                    {listType && <Select
                                        // value={selected}
                                        onChange={this.handleChangeSelect}
                                        options={newListSelect(listType)}
                                        defaultValue={{ label: selected.name ? selected.name : '', value: selected.id ? selected.id : '' }}
                                        maxMenuHeight={250}
                                        placeholder=""
                                    />}
                                </div>
                                <div className="form-group">
                                    <label>Thành Phố</label>
                                    {listProvinces && <Select
                                        onChange={this.handleSelectProvince}
                                        options={newListSelect(this.state.listProvinces)}
                                        defaultValue={{ label: province ? province.name : '', value: province ? province.id : '' }}
                                        maxMenuHeight={200}
                                    />}
                                </div>

                                <div className="form-group">
                                    <label>Mô Tả</label>
                                    <textarea onChange={this.handleChange} name="desc" value={desc ? desc : ''} className="form-control" rows={3} />
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
                                    <label>Hình Ảnh</label>
                                    <input onChange={this.handleChangeImage} type="file" id="exampleInputFile" />
                                    <div style={{ width: '100%', margin: '1px' }} className="gallery">
                                        <div className="container-image">
                                            {this.state.newPreviewImage ?
                                                <img src={this.state.newPreviewImage} alt="no image" width="300" height="195" /> :
                                                (this.state.image ?
                                                    <img src={this.state.image} alt="no image" width="300" height="195" /> :
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
                                    <select value={status ? status : 'active'} onChange={this.handleChange} name="status" className="form-control">
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
        info: state.infoLocation,
        allType: state.allType,
        listLocation: state.allLocation,
        locationDetail: state.locationDetail,
        listCountries: state.listCountries,
        listProvinces: state.listProvinces
    }
}

const mapDispatchToProps = (dispatch, action) => {
    return {
        changeLocationInfo: (info) => dispatch(actions.changeLocationInfo(info)),
        getAllType: (type) => dispatch(actions.getAllType(type)),
        createLocation: (location) => dispatch(actions.createLocation(location)),
        changeMarkerPosition: (marker) => dispatch(actions.changeMarkerPosition(marker)),
        editLocation: (location) => dispatch(actions.editLocation(location)),
        getAllLocation: (location) => dispatch(actions.getAllLocation(location)),
        getListCountries: (countries) => dispatch(actions.getListCountries(countries)),
        getListProvinces: (provinces) => dispatch(actions.getListProvinces(provinces))
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(InfoEdit));