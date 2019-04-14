import React, { Component } from 'react';
import Select from 'react-select';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from './../../actions/index';
import { URL } from '../../constants/url';
import axios from 'axios';
import { apiGet, apiPost } from './../../services/api';
import SweetAlert from 'react-bootstrap-sweetalert';
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
            listProvinces: [],
            country: null,
            province: null,
            lat: '',
            lng: ''
        }
    }
    async componentDidMount() {
        let { allType, listCountries, listProvinces } = this.props;
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
                this.props.getListProvinces(listProvinces);
                this.setState({
                    name: data.name,
                    desc: data.description,
                    status: data.status,
                    selected: {
                        ...data.type
                    },
                    image: data.featured_img,
                    listType: allType,
                    listProvinces
                });
            } catch (error) {
                console.log(error);
            }

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
        const { listProvinces } = this.props;
        const provinces = listProvinces.filter((item) => item.fk_country === selected.id);
        this.setState({ country: selected, listProvinces: provinces });
    }

    checkLocation = () => {
        if (!this.props || !this.props.info || !this.props.info.marker ||
            this.props.info.marker.lat === '' || this.props.info.marker.lng === '' ||
            this.props.info.address === '' || this.state.name === '' || !this.state.selected.id || (!this.state.image && !this.state.newImage)) {
            return false;
        }
        return true;
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        console.log(this.checkLocation());
        // console.log(this.state);
        // console.log(this.props.info);
        if (this.checkLocation()) {
            try {
                let form = new FormData();
                form.append('id', this.props.match.params.id);
                form.append('latitude', this.props.info.marker.lat);
                form.append('longitude', this.props.info.marker.lng);
                form.append('name', this.state.name);
                form.append('address', this.props.info.address);
                form.append('description', this.state.desc);
                form.append('status', this.state.status);
                form.append('fk_type', this.state.selected.id);
                if (this.state.newImage) {
                    form.append('image', this.state.newImage);
                }
                let itemEdit = await apiPost('/location/update', form);
                // let itemEdit = await apiPost('/location/updateWithoutFeaturedImg', {
                //     id: this.props.match.params.id,
                //     latitude: this.props.info.marker.lat,
                //     longitude: this.props.info.marker.lng,
                //     name: this.state.name,
                //     address: this.props.info.address,
                //     description: this.state.desc,
                //     status: this.state.status,
                //     fk_type: this.state.selected.id
                // });
                if (!this.props.listLocation) {
                    try {
                        let listLocation = await apiGet('/location/getAllWithoutPagination');
                        this.props.getAllLocation(listLocation.data.data);
                    } catch (error) {
                        console.log(error);
                    }
                }
                console.log(itemEdit.data.data);
                await this.props.editLocation({
                    ...itemEdit.data.data,
                    type: this.state.selected
                });
                this.setState({
                    success: true
                })
            } catch (error) {
                this.setState({
                    error: true
                })
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

    handleRefresh = async (event) => {
        event.preventDefault();
        window.location.reload();
        try {
            let data = await axios.get(`${URL}/location/getById/${this.props.match.params.id}`);
            const location = data.data.data;
            console.log(location);
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

    deletePreviewImage = () => {
        this.setState({
            newImage: null,
            newPreviewImage: null
        });
    }

    render() {
        let marker = null;
        let address = null;
        if (this.props.info) {
            marker = this.props.info.marker;
            address = this.props.info.address;
        }
        let { name, desc, listType, selected, status, listProvinces } = this.state;
        let listCountries = this.props.listCountries ? this.props.listCountries : [];
        return (<section className="content">
            <div className="row">
                <div className="col-lg-4 col-xs-12">
                    <div className="box box-warning">
                        <form role="form">
                            <div className="box-body">
                                <div className="form-group">
                                    <label>Latitude</label>
                                    <input
                                        onChange={this.handleChange}
                                        name="lat"
                                        value={marker ? marker.lat : ''}
                                        required
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter ..." />
                                </div>
                                <div className="form-group">
                                    <label>Name</label>
                                    <input type="text" onChange={this.handleChange} name="name" value={name ? name : ''} required className="form-control" placeholder="Enter ..." />
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
                                        name="address"
                                        value={address ? address : ''}
                                        required
                                        className="form-control" rows={3}
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
                                        onChange={this.handleChange}
                                        name="lng"
                                        value={marker ? marker.lng : ''}
                                        required
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter ..." />
                                </div>
                                <div className="form-group">
                                    <label>Type</label>
                                    {listType && <Select
                                        // value={selected}
                                        onChange={this.handleChangeSelect}
                                        options={listType}
                                        defaultValue={{ label: selected.name ? selected.name : 'linh', value: selected.id ? selected.id : '' }}
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
                                    <textarea onChange={this.handleChange} name="desc" value={desc ? desc : ''} className="form-control" rows={3} placeholder="Enter ..." />
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
                                    <label>Active</label>
                                    <select value={status ? status : 'active'} onChange={this.handleChange} name="status" className="form-control">
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


            // <div className="box box-warning">
            //     {this.state.success &&
            //         <SweetAlert success title="Successfully" onConfirm={this.hideSuccessAlert}>
            //             Continute...
            //     </SweetAlert>
            //     }
            //     {this.state.error &&
            //         <SweetAlert
            //             warning
            //             confirmBtnText="Cancel"
            //             confirmBtnBsStyle="default"
            //             title="Something went wrong!"
            //             onConfirm={this.hideFailAlert}
            //         >
            //             Please check carefully!
            //     </SweetAlert>
            //     }
            //     <div className="box-header with-border">
            //         <h3 className="box-title">Location Info</h3>
            //         <button onClick={this.handleRefresh} type="button" className="btn btn-default btn-xs pull-right">
            //             <i className="glyphicon glyphicon-refresh" />
            //         </button>
            //     </div>
            //     <div className="box-body">
            //         <form role="form" onSubmit={this.handleSubmit}>
            //             <div className="form-group double-left">
            //                 <label>Latitude</label>
            //                 <input value={marker ? marker.lat : ''} required type="text" className="form-control" placeholder="Enter ..." disabled />
            //             </div>
            //             <div className="form-group double-right">
            //                 <label>Longitude</label>
            //                 <input value={marker ? marker.lng : ''} required type="text" className="form-control" placeholder="Enter ..." disabled />
            //             </div>
            //             <div className="form-group">
            //                 <label>Address</label>
            //                 <textarea value={address ? address : ''} required readOnly className="form-control" rows={2} placeholder="Enter ..." defaultValue={""} />
            //             </div>
            //             <div className="form-group">
            //                 <label>Name</label>
            //                 <input type="text" onChange={this.handleChange} name="name" value={name ? name : ''} required className="form-control" placeholder="Enter ..." />
            //             </div>
            //             <div className="form-group">
            //                 <label>Type</label>
            //                 {listType && <Select
            //                     // value={selected}
            //                     onChange={this.handleChangeSelect}
            //                     options={listType}
            //                     defaultValue={{ label: selected.name ? selected.name : 'linh', value: selected.id ? selected.id : '' }}
            //                 />}
            //             </div>
            //             <div className="form-group">
            //                 <label>Image</label>
            //                 <input onChange={this.handleChangeImage} type="file" id="exampleInputFile" />
            //                 <div style={{ width: '100%', margin: '1px' }} className="gallery">
            //                     <div className="container-image">
            //                         {this.state.newPreviewImage ?
            //                             <img src={this.state.newPreviewImage} alt="no image" width="300" height="300" /> :
            //                             (this.state.image ?
            //                                 <img src={this.state.image} alt="no image" width="300" height="300" /> :
            //                                 <img src="http://denrakaev.com/wp-content/uploads/2015/03/no-image-800x511.png" alt="Cinque Terre" width="300" height="300" />
            //                             )
            //                         }
            //                         <div className="topright-image">
            //                             {this.state.newPreviewImage ? <i onClick={this.deletePreviewImage} className="fa fa-times-circle-o delete-icon" /> : null}
            //                         </div>
            //                     </div>
            //                 </div>
            //             </div>
            //             <div className="form-group">
            //                 <label>Description</label>
            //                 <textarea onChange={this.handleChange} name="desc" value={desc ? desc : ''} className="form-control" rows={3} placeholder="Enter ..." defaultValue={""} />
            //             </div>
            //             <div className="form-group">
            //                 <label>Active</label>
            //                 <select value={status ? status : 'active'} onChange={this.handleChange} name="status" className="form-control">
            //                     <option value="active">Yes</option>
            //                     <option value="inactive">No</option>
            //                 </select>
            //             </div>
            //             <button type="submit" className="btn btn-primary pull-right">Save</button>
            //         </form>
            //     </div>
            // </div>
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