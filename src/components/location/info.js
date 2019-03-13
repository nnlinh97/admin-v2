import React, { Component } from 'react';
import Select from 'react-select';
import { connect } from 'react-redux';
import * as actions from './../../actions/index';
import { URL } from '../../constants/url';
import axios from 'axios';

class info extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: null,
            name: '',
            desc: '',
            status: 'active'
        }
    }
    async componentDidMount() {
        let allType = await axios.get(`${URL}/type/getAll`);
        allType.data.result.forEach(item => {
            item.value = item.id;
            item.label = item.name;
        });
        this.props.getAllType(allType.data.result);
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
        if (!this.props || !this.props.info || !this.props.info.marker || this.props.info.marker.lat === '' || this.props.info.marker.lng === '' || this.props.info.address === '') {
            console.log('props fail');
            return;
        }
        if (this.state.name === '' || !this.state.selected) {
            console.log('state fail');
            return;
        }
        try {
            const locationCreate = await axios.post(`${URL}/location/create`, {
                latitude: this.props.info.marker.lat,
                longitude: this.props.info.marker.lng,
                name: this.state.name,
                description: this.state.desc,
                address: this.props.info.address,
                featured_img: null,
                status: this.state.status,
                fk_type: this.state.selected.id
            });
            this.props.createLocation(locationCreate);
        } catch (error) {
            console.log(error);
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
                <div className="box-header with-border">
                    <h3 className="box-title">Location Info</h3>
                </div>
                <div className="box-body">
                    <form role="form" onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <label>Latitude</label>
                            <input value={marker ? marker.lat : ""} required type="text" className="form-control" placeholder="Enter ..." disabled />
                        </div>
                        <div className="form-group">
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
                            <label>Description</label>
                            <textarea onChange={this.handleChange} name="desc" value={desc} className="form-control" rows={3} placeholder="Enter ..." defaultValue={""} />
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
        allLocation: state.allLocation
    }
}

const mapDispatchToProps = (dispatch, action) => {
    return {
        changeLocationInfo: (info) => dispatch(actions.changeLocationInfo(info)),
        getAllType: (type) => dispatch(actions.getAllType(type)),
        createLocation: (location) => dispatch(actions.createLocation(location))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(info);