import React, { Component } from 'react';
import Select from 'react-select';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from './../../actions/index';
import { URL } from '../../constants/url';
import axios from 'axios';

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
            status: 'active',
            listType: null
        }
    }
    async componentDidMount() {
        if (this.props.match) {
            try {

                let location = await axios.get(`${URL}/location/getById/${this.props.match.params.id}`);
                const data = location.data.data;
                this.props.changeLocationInfo({
                    marker: {
                        lat: data.latitude,
                        lng: data.longitude
                    },
                    address: data.address
                });
                let allType = await axios.get(`${URL}/type/getAll`);
                allType.data.result.forEach(item => {
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
                    listType: allType.data.result
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
        if (!this.props || !this.props.info || !this.props.info.marker || this.props.info.marker.lat === '' || this.props.info.marker.lng === '' || this.props.info.address === '') {
            console.log('props fail');
            return;
        }
        if (this.state.name === '' || !this.state.selected.id) {
            console.log('state fail');
            return;
        }

        try {
            let itemEdit = await axios.post(`${URL}/location/updateWithoutFeaturedImg`, {
                id: this.props.match.params.id,
                latitude: this.props.info.marker.lat,
                longitude: this.props.info.marker.lng,
                name: this.state.name,
                address: this.props.info.address,
                description: this.state.desc,
                status: this.state.status,
                fk_type: this.state.selected.id
            });
            // console.log(itemEdit);
            this.props.editLocation(itemEdit.data.data)
        } catch (error) {
            console.log(error);
        }
        console.log('success');
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

    render() {
        let marker = null;
        let address = null;
        if (this.props.info) {
            marker = this.props.info.marker;
            address = this.props.info.address;
        }
        let { name, desc, listType, selected, status } = this.state;
        return (
            <div className="box box-warning">
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
        allLocation: state.allLocation,
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
        editLocation: (location) => dispatch(actions.editLocation(location))
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(InfoEdit));