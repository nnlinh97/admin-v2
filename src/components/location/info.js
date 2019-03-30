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
            previewImage: null
        }
    }
    async componentDidMount() {
        let allType = await apiGet('/type/getAll');
        // let allType = await axios.get(`${URL}/type/getAll`);
        allType.data.data.forEach(item => {
            item.value = item.id;
            item.label = item.name;
        });
        this.props.getAllType(allType.data.data);
    }


    componentWillUnmount = () => {
        this.props.changeLocationInfo(null);
    }

    handleChangeSelect = (selected) => {
        this.setState({
            selected
        })
    }

    checkLocation = () => {
        if (!this.props || !this.props.info || !this.props.info.marker ||
            this.props.info.marker.lat === '' || this.props.info.marker.lng === '' ||
            this.props.info.address === '' || this.state.name === '' || !this.state.selected || !this.state.image) {
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

    render() {
        let marker = null;
        let address = null;
        const { name, desc } = this.state;
        if (this.props.info) {
            marker = this.props.info.marker;
            address = this.props.info.address;
        }
        let allType = this.props.allType ? this.props.allType : [];
        return (
            <div className="box box-warning">
                {this.state.success &&
                    <SweetAlert success title="Successfully" onConfirm={this.hideSuccessAlert}>
                        Continute...
                </SweetAlert>
                }
                {this.state.error &&
                    <SweetAlert
                        warning
                        confirmBtnText="Cancel"
                        confirmBtnBsStyle="default"
                        title="Something went wrong!"
                        onConfirm={this.hideFailAlert}
                    >
                        Please check carefully!
                </SweetAlert>
                }
                <div className="box-header with-border">
                    <h3 className="box-title">Location Info</h3>
                </div>
                <div className="box-body">
                    <form role="form" onSubmit={this.handleSubmit}>
                        <div className="form-group double-left">
                            <label>Latitude</label>
                            <input value={marker ? marker.lat : ""} required type="text" className="form-control" placeholder="Enter ..." disabled />
                        </div>
                        <div className="form-group double-right">
                            <label>Longitude</label>
                            <input value={marker ? marker.lng : ""} required type="text" className="form-control" placeholder="Enter ..." disabled />
                        </div>
                        <div className="form-group">
                            <label>Address</label>
                            <textarea value={address ? address : ""} required readOnly className="form-control" rows={2} placeholder="Enter ..." defaultValue={""} />
                            {/* <input value={address ? address : ""} type="text" className="form-control" placeholder="Enter ..." disabled /> */}
                        </div>
                        <div className="form-group">
                            <label>Name</label>
                            <input type="text" onChange={this.handleChange} name="name" value={name} required className="form-control" placeholder="Enter ..." />
                        </div>
                        <div className="form-group">
                            <label>Type</label>
                            {allType.length > 0 && <Select
                                value={this.state.selected}
                                onChange={this.handleChangeSelect}
                                options={allType}
                            />}
                        </div>
                        <div className="form-group">
                            <label>Image</label>
                            <input onChange={this.handleChangeImage} type="file" id="exampleInputFile" />
                            <div style={{ width: '100%', margin: '1px' }} className="gallery">
                                <div className="container-image">
                                    {this.state.previewImage ?
                                        <img src={this.state.previewImage} alt="Cinque Terre" width="300" height="300" /> :
                                        <img src="http://denrakaev.com/wp-content/uploads/2015/03/no-image-800x511.png" alt="Cinque Terre" width="300" height="300" />
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
                            <label>Description</label>
                            <textarea onChange={this.handleChange} name="desc" value={desc} className="form-control" rows={2} placeholder="Enter ..." defaultValue={""} />
                        </div>
                        <div className="form-group">
                            <label>Active</label>
                            <select value={this.state.status} onChange={this.handleChange} name="status" className="form-control">
                                <option value="active">Yes</option>
                                <option value="inactive">No</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary pull-right">Save</button>
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        info: state.infoLocation,
        allType: state.allType,
        listLocation: state.allLocation
    }
}

const mapDispatchToProps = (dispatch, action) => {
    return {
        changeLocationInfo: (info) => dispatch(actions.changeLocationInfo(info)),
        getAllType: (type) => dispatch(actions.getAllType(type)),
        createLocation: (location) => dispatch(actions.createLocation(location)),
        getAllLocation: (locations) => dispatch(actions.getAllLocation(locations))
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(info));