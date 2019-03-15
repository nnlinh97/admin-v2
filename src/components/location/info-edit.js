import React, { Component } from 'react';
import Select from 'react-select';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from './../../actions/index';
import { URL } from '../../constants/url';
import axios from 'axios';
import { apiGet, apiPost } from './../../services/api';
import SweetAlert from 'react-bootstrap-sweetalert';

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
            error: false
        }
    }
    async componentDidMount() {
        console.log(this.props.match.params.id);
        if (this.props.match) {
            const id = this.props.match.params.id;
            try {
                let location = await apiGet(`/location/getById/${id}`)
                // let location = await axios.get(`${URL}/location/getById/${this.props.match.params.id}`);
                const data = location.data.data;
                console.log(data);
                console.log(data.status);
                await this.props.changeLocationInfo({
                    marker: {
                        lat: data.latitude,
                        lng: data.longitude
                    },
                    address: data.address
                });
                let allType = await apiGet('/type/getAll');
                // let allType = await axios.get(`${URL}/type/getAll`);
                allType.data.data.forEach(item => {
                    item.value = item.id;
                    item.label = item.name;
                });
                this.setState({
                    name: data.name,
                    desc: data.description,
                    status: data.status,
                    selected: {
                        ...data.type
                    },
                    listType: allType.data.data
                })
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

    handleSubmit = async (event) => {
        event.preventDefault();
        // console.log(this.state);
        // console.log(this.props.info);
        if (!this.props || !this.props.info || !this.props.info.marker ||
            this.props.info.marker.lat === '' || this.props.info.marker.lng === '' ||
            this.props.info.address === '' || this.state.name === '' || !this.state.selected.id) {
            this.setState({
                error: true
            })
        } else {
            try {
                let itemEdit = await apiPost('/location/updateWithoutFeaturedImg', {
                    id: this.props.match.params.id,
                    latitude: this.props.info.marker.lat,
                    longitude: this.props.info.marker.lng,
                    name: this.state.name,
                    address: this.props.info.address,
                    description: this.state.desc,
                    status: this.state.status,
                    fk_type: this.state.selected.id
                });
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
        }
        // console.log('success');
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

    render() {
        let marker = null;
        let address = null;
        if (this.props.info) {
            marker = this.props.info.marker;
            address = this.props.info.address;
        }
        let { name, desc, listType, selected, status } = this.state;
        console.log(status);
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
                    <button onClick={this.handleRefresh} type="button" className="btn btn-default btn-xs pull-right">
                        <i className="glyphicon glyphicon-refresh" />
                    </button>
                </div>
                <div className="box-body">
                    <form role="form" onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <label>Latitude</label>
                            <input value={marker ? marker.lat : ''} required type="text" className="form-control" placeholder="Enter ..." disabled />
                        </div>
                        <div className="form-group">
                            <label>Longitude</label>
                            <input value={marker ? marker.lng : ''} required type="text" className="form-control" placeholder="Enter ..." disabled />
                        </div>
                        <div className="form-group">
                            <label>Address</label>
                            <textarea value={address ? address : ''} required readOnly className="form-control" rows={2} placeholder="Enter ..." defaultValue={""} />
                        </div>
                        <div className="form-group">
                            <label>Name</label>
                            <input type="text" onChange={this.handleChange} name="name" value={name ? name : ''} required className="form-control" placeholder="Enter ..." />
                        </div>
                        <div className="form-group">
                            <label>Type</label>
                            {listType && <Select
                                // value={selected}
                                onChange={this.handleChangeSelect}
                                options={listType}
                                defaultValue={{ label: selected.name ? selected.name : 'linh', value: selected.id ? selected.id : '' }}
                            />}
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea onChange={this.handleChange} name="desc" value={desc ? desc : ''} className="form-control" rows={3} placeholder="Enter ..." defaultValue={""} />
                        </div>
                        <div className="form-group">
                            <label>Active</label>
                            <select value={status ? status : 'active'} onChange={this.handleChange} name="status" className="form-control">
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
        listLocation: state.allLocation,
        locationDetail: state.locationDetail
    }
}

const mapDispatchToProps = (dispatch, action) => {
    return {
        changeLocationInfo: (info) => dispatch(actions.changeLocationInfo(info)),
        getAllType: (type) => dispatch(actions.getAllType(type)),
        getAllType: (type) => dispatch(actions.getAllType(type)),
        createLocation: (location) => dispatch(actions.createLocation(location)),
        changeMarkerPosition: (marker) => dispatch(actions.changeMarkerPosition(marker)),
        editLocation: (location) => dispatch(actions.editLocation(location)),
        getAllLocation: (location) => dispatch(actions.getAllLocation(location))
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(InfoEdit));