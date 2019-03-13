import React, { Component } from 'react';
import { compose, withProps } from "recompose";
import { withRouter } from 'react-router-dom';
import { withScriptjs, withGoogleMap, GoogleMap, InfoWindow, Marker } from "react-google-maps"
import { SearchBox } from "react-google-maps/lib/components/places/SearchBox"
import { InfoBox } from "react-google-maps/lib/components/addons/InfoBox"
import _ from 'lodash'
import Geocode from "react-geocode"
import { mapOption } from '../../constants/map-option'
import { connect } from 'react-redux';
import * as actions from './../../actions/index';
import { URL } from '../../constants/url';
import axios from 'axios';

class MapComponent extends React.Component {


    static defaultProps = {
        center: { lat: 10.762622, lng: 106.660172 }, //Vietnam
        myLocation: null
    }

    constructor(props) {
        super(props)
        this.googleMap = React.createRef()
        this.searchBox = React.createRef()
        this.state = {
            bounds: null,
            markerChoose: null,
            zoom: 8,
            address: '',
            center: this.props.center,
            marker: null,
            isShowInfo: false,
            isEdit: false
        }
    }

    async componentDidMount() {
        // console.log(this.props.match.params.id);
        if(this.props.match){
            // console.log(this.props.match.params.id);
            const location = await axios.get(`${URL}/location/getById/${this.props.match.params.id}`);
            // console.log(location.data.data);
            const data = location.data.data;
            this.props.getLocationDetail(data);
            this.setState({
                center: {
                    lat: data.latitude,
                    lng: data.longitude
                },
                marker: {
                    lat: data.latitude,
                    lng: data.longitude
                },
                address: data.address,
                zoom: this.googleMap.current.getZoom(),
                isShowInfo: false,
                isEdit: true
            })
        }
    }

    onBoundsChanged() {
        this.setState({
            bounds: this.googleMap.current.getBounds()
        })
    }

    onClickedMap(event) {
        let newLat = event.latLng.lat();
        let newLng = event.latLng.lng();
        const newCenter = this.googleMap.current.getCenter();

        Geocode.fromLatLng(newLat, newLng).then((result) => {
            const { lat, lng } = result.results[0].geometry.location;
            this.props.changeLocationInfo({
                marker: {
                    lat,
                    lng
                },
                address: result.results[0].formatted_address,
            })
            this.setState({
                center: {
                    lat: newCenter.lat(),
                    lng: newCenter.lng()
                },
                marker: {
                    lat: lat,
                    lng: lng
                },
                address: result.results[0].formatted_address,
                zoom: this.googleMap.current.getZoom(),
                isShowInfo: false
            })
        })
    }

    onPlacesChanged() {
        const places = this.searchBox.current.getPlaces();
        Geocode.fromAddress(places[0].formatted_address).then((result) => {
            const { lat, lng } = result.results[0].geometry.location;
            this.props.changeLocationInfo({
                marker: {
                    lat,
                    lng
                },
                address: result.results[0].formatted_address,
            })
            this.setState({
                center: {
                    lat,
                    lng
                },
                marker: {
                    lat,
                    lng
                },
                address: result.results[0].formatted_address,
                zoom: this.googleMap.current.getZoom(),
                isShowInfo: false
            });
        })
    }

    onToggleOpenClickedMarker = () => {
        this.setState({
            isShowInfo: !this.state.isShowInfo
        })
    }

    render() {
        return (
            <GoogleMap
                ref={this.googleMap}
                center={this.state.center}
                onBoundsChanged={this.onBoundsChanged.bind(this)}
                defaultZoom={this.state.zoom}
                defaultOptions={mapOption}
                onClick={this.onClickedMap.bind(this)}
            >
                {true &&
                    <SearchBox
                        ref={this.searchBox}
                        bounds={this.state.bounds}
                        controlPosition={window.google.maps.ControlPosition.TOP_LEFT}
                        onPlacesChanged={this.onPlacesChanged.bind(this)}>
                        <input
                            type="text"
                            placeholder="Search location"
                            style={{
                                boxSizing: `border-box`,
                                border: `1px solid transparent`,
                                width: `240px`,
                                height: `32px`,
                                marginTop: `14px`,
                                padding: `0 12px`,
                                borderRadius: `3px`,
                                boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                                fontSize: `14px`,
                                outline: `none`,
                                textOverflow: `ellipses`,
                            }}
                        />
                    </SearchBox>
                }
                {this.state.marker &&  //Clicked marker location
                    <Marker
                        position={{ lat: this.state.marker.lat, lng: this.state.marker.lng }}
                        onClick={this.onToggleOpenClickedMarker}
                        >
                        {this.state.isShowInfo && <InfoBox
                            // onCloseClick={props.onToggleOpenClickedMarker}
                            options={{ closeBoxURL: ``, enableEventPropagation: true }}
                        >
                            <div style={{ backgroundColor: `yellow`, opacity: 0.75, padding: `12px` }}>
                            <div style={{ fontSize: `16px`, fontColor: `#08233B` }}>
                              {this.state.address}
                            </div>
                          </div>
                        </InfoBox>}
                    </Marker>
                }
            </GoogleMap>
        )
    }
}

// export default (compose(withScriptjs, withGoogleMap)(MapComponent))

const mapStateToProps = (state) => {
    return {
    }
}

const mapDispatchToProps = (dispatch, action) => {
    return {
        changeLocationInfo: (info) => dispatch(actions.changeLocationInfo(info)),
        getLocationDetail: (location) => dispatch(actions.getLocationDetail(location))
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)((compose(withScriptjs, withGoogleMap)(MapComponent))));