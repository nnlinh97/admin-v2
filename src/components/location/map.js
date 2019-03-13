import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    withGoogleMap,
    GoogleMap,
    withScriptjs,
    InfoWindow,
    Marker
} from "react-google-maps";
import { mapOption } from '../../constants/map-option';
import Geocode from "react-geocode";
// import ReactAutocomplete from 'react-autocomplete';
Geocode.setApiKey("AIzaSyA5aHhKGZxiy_9OZ0vyakabi1FCbOHrEWI");
Geocode.enableDebug();




class Map extends Component {
    constructor(props) {
        super(props);
        this.googleMap = React.createRef();
        this.state = {
            address: '',
            city: '',
            area: '',
            state: '',
            mapPosition: {
                lat: this.props.center.lat,
                lng: this.props.center.lng
            },
            markerPosition: {
                lat: 10.8230989,
                lng: 106.6296638
            },
            location: '',
            zoom: 8,
            showInfoWindow: false,
            isLoading: false,
            clicked: false,

            value: ''
        }
    }

    componentDidMount() {
        Geocode.fromAddress("hcmus").then((result) => {
            const { lat, lng } = result.results[0].geometry.location;
            this.setState({
                mapPosition: {
                    lat: lat,
                    lng: lng
                },
                markerPosition: {
                    lat: lat,
                    lng: lng
                },
                address: result.results[0].formatted_address
            })
        })
    }

    onMarkerDragEnd = (event) => {
        let newLat = event.latLng.lat(),
            newLng = event.latLng.lng();
        const newCenter = this.googleMap.current.getCenter();

        Geocode.fromLatLng(newLat, newLng).then((result) => {
            const { lat, lng } = result.results[0].geometry.location;
            this.setState({
                mapPosition: {
                    lat: newCenter.lat(),
                    lng: newCenter.lng()
                },
                markerPosition: {
                    lat: lat,
                    lng: lng
                },
                address: result.results[0].formatted_address,
                zoom: this.googleMap.current.getZoom(),
                isLoading: true
            })
        })
    };

    onClickedMap = (event) => {
        let newLat = event.latLng.lat();
        let newLng = event.latLng.lng();
        const newCenter = this.googleMap.current.getCenter();
        Geocode.fromLatLng(newLat, newLng).then((result) => {
            const { lat, lng } = result.results[0].geometry.location;
            this.setState({
                mapPosition: {
                    lat: newCenter.lat(),
                    lng: newCenter.lng()
                },
                markerPosition: {
                    lat: lat,
                    lng: lng
                },
                address: result.results[0].formatted_address,
                zoom: this.googleMap.current.getZoom(),
            })
        })
    }

    onClickedMaker = () => {
        this.setState({
            showInfoWindow: !this.state.showInfoWindow,
            zoom: this.googleMap.current.getZoom()
        })
    }

    render() {
        let defaultZoom = 10;
        if (this.state.zoom) {
            defaultZoom = this.state.zoom;
        }
        if (this.props.searchLocation) {
            defaultZoom = this.googleMap.current ? this.googleMap.current.getZoom() : defaultZoom;
        }
        const AsyncMap = withScriptjs(
            withGoogleMap(
                props => (
                    <GoogleMap
                        onClick={this.onClickedMap}
                        google={this.props.google}
                        defaultZoom={defaultZoom}
                        defaultCenter={
                            !this.props.searchLocation ?
                                { lat: this.state.mapPosition.lat, lng: this.state.mapPosition.lng } :
                                { lat: this.props.searchLocation.lat, lng: this.props.searchLocation.lng }
                        }
                        ref={this.googleMap}
                        defaultOptions={mapOption}
                    >
                        <div>
                            {this.state.showInfoWindow && (
                                    <div style={{ display: "block"}} className="example-modal">
                                        <div className="modal">
                                            <div className="modal-dialog">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <button onClick={this.closeEditModal} type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                            <span aria-hidden="true">×</span></button>
                                                        <h4 className="modal-title">Edit Type</h4>
                                                    </div>
                                                    <div className="modal-body">
                                                        <form className="form-horizontal">
                                                            <div className="box-body">
                                                                <div className="form-group">
                                                                    <label htmlFor="inputEmail" className="col-sm-2 control-label">Name</label>
                                                                    <div className="col-sm-10">
                                                                        <input onChange={this.handleChange} name="name" type="text" className="form-control" id="inputEmail" placeholder="Name" />
                                                                    </div>
                                                                </div>
                                                                <div className="form-group">
                                                                    <label htmlFor="inputPassword" className="col-sm-2 control-label">Marker</label>
                                                                    <div className="col-sm-10">
                                                                        <input onChange={this.handleChange} name="marker" type="text" className="form-control" id="inputPassword" placeholder="Marker" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button onClick={this.closeEditModal} type="button" className="btn btn-default pull-left" data-dismiss="modal">Close</button>
                                                        <button onClick={this.handleEdit} type="button" className="btn btn-primary">Save changes</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                            )}
                            {this.props.searchLocation ?
                                <Marker google={this.props.google}
                                    draggable={true}
                                    onDragEnd={this.onMarkerDragEnd}
                                    position={{ lat: this.props.searchLocation.lat, lng: this.props.searchLocation.lng }}
                                    onClick={this.onClickedMaker}
                                    title={this.props.searchLocation.address}
                                />
                                : null}
                        </div>
                    </GoogleMap>
                )
            )
        );
        let map;
        if (this.props.center.lat !== undefined) {
            map = <div>
                <AsyncMap
                    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyA5aHhKGZxiy_9OZ0vyakabi1FCbOHrEWI&libraries=places"
                    loadingElement={
                        <div style={{ height: `100%` }} />
                    }
                    containerElement={
                        <div style={{ height: this.props.height }} />
                    }
                    mapElement={
                        <div style={{ height: `100%` }} />
                    }
                />
            </div>
        } else {
            map = <div style={{ height: this.props.height }} />
        }
        return (
            <div>
                {map}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        zoom: state.zoom,
        searchLocation: state.searchLocation
    }
}

const mapDispatchToProps = (dispatch, action) => {
    return {
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Map);