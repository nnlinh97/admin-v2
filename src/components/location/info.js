import React, { Component } from 'react';
import Select from 'react-select';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from './../../actions/index';
import { URL } from '../../constants/url';
import axios from 'axios';
import { apiGet, apiPost } from './../../services/api';
import SweetAlert from 'react-bootstrap-sweetalert';
import Geocode from "react-geocode";
import './index.css';

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
        let { allType, listCountries, listProvinces, locationInfo } = this.props;
        if (!allType) {
            try {
                allType = await apiGet('/type/getAll');
                allType = allType.data.data;
                allType.forEach(item => {
                    item.value = item.id;
                    item.label = item.name;
                });
                this.props.getAllType(allType);
            } catch (error) {
                console.log(error);
            }
        }
        if (!listCountries) {
            try {
                listCountries = await apiGet('/tour_classification/getAllCountries_admin');
                listCountries = listCountries.data.data;
                listCountries.forEach(item => {
                    item.value = item.id;
                    item.label = item.name;
                });
                this.props.getListCountries(listCountries);
            } catch (error) {
                console.log(error);
            }
        }
        if (!listProvinces) {
            try {
                listProvinces = await apiGet('/tour_classification/getAllProvinces_admin');
                listProvinces = listProvinces.data.data;
                listProvinces.forEach(item => {
                    item.value = item.id;
                    item.label = item.name;
                });
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


    componentWillUnmount = () => {
        this.props.changeLocationInfo(null);
    }

    handleChangeSelect = (selected) => {
        this.setState({ selected });
    }

    handleSelectProvince = (selected) => {
        this.setState({ province: selected });
    }

    handleChangeCountry = (selected) => {
        const { listProvinces } = this.props;
        const provinces = listProvinces.filter((item) => item.fk_country === selected.id);
        this.setState({ country: selected, listProvinces: provinces });
    }

    checkLocation = () => {
        if (!this.props || !this.props.info || !this.props.info.marker ||
            this.props.info.marker.lat === '' || this.props.info.marker.lng === '' ||
            this.props.info.address === '' || this.state.name === '' || !this.state.selected || !this.state.image) {
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
                form.append('latitude', this.props.info.marker.lat);
                form.append('longitude', this.props.info.marker.lng);
                form.append('name', this.state.name);
                form.append('description', this.state.desc);
                form.append('address', this.props.info.address);
                form.append('image', this.state.image, 'name.jpg');
                form.append('status', this.state.status);
                form.append('fk_type', this.state.selected.id);
                form.append('fk_country', this.state.country.id);
                form.append('fk_province', this.state.province.id);

                const locationCreate = await apiPost('/location/create', form);
                if (!this.props.listLocation) {
                    try {
                        let listLocation = await apiGet('/location/getAllWithoutPagination');
                        this.props.getAllLocation(listLocation.data.data);
                    } catch (error) {
                        console.log(error);
                    }
                } else {
                    await this.props.createLocation(locationCreate.data);
                }
                this.setState({
                    success: true
                });
            } catch (error) {
                console.log(error);
                this.setState({
                    error: true
                });
            }
        } else {
            this.setState({
                error: true
            })
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
                this.setState({ address, lat, lng });
            }
        }, 500);
    }

    hideSuccessAlert = () => {
        this.props.history.push('/location/list');
    }

    hideFailAlert = () => {
        this.setState({
            error: false
        });
    }

    handleChangeImage = (event) => {
        let file = event.target.files[0];
        let reader = new FileReader();
        event.target.value = null;
        reader.onloadend = () => {
            event.target = null;
            this.setState({
                image: file,
                previewImage: reader.result
            });
        }
        reader.readAsDataURL(file)
    }

    deletePreviewImage = () => {
        this.setState({
            image: null,
            previewImage: null
        })
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
        let allType = this.props.allType ? this.props.allType : [];
        let listCountries = this.props.listCountries ? this.props.listCountries : [];
        let listProvinces = this.props.listProvinces ? this.props.listProvinces : [];
        return (
            <section className="content">
                <div className="row">
                    <div className="col-lg-4 col-xs-12">
                        <div className="box box-warning">
                            <form role="form">
                                <div className="box-body">
                                    <div className="form-group">
                                        <label>Latitude</label>
                                        <input
                                            onChange={this.handleChangeLatLng}
                                            value={this.state.lat}
                                            name="lat"
                                            required
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter ..." />
                                    </div>
                                    <div className="form-group">
                                        <label>Name</label>
                                        <input type="text" onChange={this.handleChange} name="name" value={name} required className="form-control" placeholder="Enter ..." />
                                    </div>
                                    <div className="form-group">
                                        <label>Country</label>
                                        {listCountries.length > 0 && <Select
                                            value={this.state.country}
                                            onChange={this.handleChangeCountry}
                                            options={listCountries}
                                            maxMenuHeight={200}
                                        />}
                                    </div>
                                    <div className="form-group">
                                        <label>Address</label>
                                        <textarea
                                            onChange={this.handleChange}
                                            value={this.state.address}
                                            name="address"
                                            required
                                            className="form-control"
                                            rows={3}
                                            placeholder="Enter ..." />
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
                                        <label>Longitude</label>
                                        <input
                                            onChange={this.handleChangeLatLng}
                                            value={this.state.lng}
                                            name="lng"
                                            required
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter ..." />
                                    </div>
                                    <div className="form-group">
                                        <label>Type</label>
                                        {allType.length > 0 && <Select
                                            value={this.state.selected}
                                            onChange={this.handleChangeSelect}
                                            options={allType}
                                            maxMenuHeight={250}
                                        />}
                                    </div>
                                    <div className="form-group">
                                        <label>Province</label>
                                        {this.state.listProvinces.length > 0 && <Select
                                            value={this.state.province}
                                            onChange={this.handleSelectProvince}
                                            options={this.state.listProvinces}
                                            maxMenuHeight={200}
                                        />}
                                    </div>

                                    <div className="form-group">
                                        <label>Description</label>
                                        <textarea onChange={this.handleChange} name="desc" value={desc} className="form-control" rows={3} placeholder="Enter ..." />
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
                                        <label>Image</label>
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
                                        <label>Active</label>
                                        <select value={this.state.status} onChange={this.handleChange} name="status" className="form-control">
                                            <option value="active">Yes</option>
                                            <option value="inactive">No</option>
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
                        <button onClick={this.handleSubmit} type="button" className="btn btn-primary pull-right">Save</button>
                    </div>
                </div>
                {this.state.success && <SweetAlert success title="Successfully" onConfirm={this.hideSuccessAlert}>
                    Continute...
                </SweetAlert>}
                {this.state.error && <SweetAlert
                    warning
                    confirmBtnText="Cancel"
                    confirmBtnBsStyle="default"
                    title="Something went wrong!"
                    onConfirm={this.hideFailAlert} >
                    Please check carefully!
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
        listCountries: state.listCountries,
        listProvinces: state.listProvinces
    }
}

const mapDispatchToProps = (dispatch, action) => {
    return {
        changeLocationInfo: (info) => dispatch(actions.changeLocationInfo(info)),
        getAllType: (type) => dispatch(actions.getAllType(type)),
        createLocation: (location) => dispatch(actions.createLocation(location)),
        getAllLocation: (locations) => dispatch(actions.getAllLocation(locations)),
        getListCountries: (countries) => dispatch(actions.getListCountries(countries)),
        getListProvinces: (provinces) => dispatch(actions.getListProvinces(provinces))
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(info));