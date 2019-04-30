import React from 'react';
import { compose, withProps, withStateHandlers, lifecycle } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps";
import { SearchBox } from "react-google-maps/lib/components/places/SearchBox";
import _ from 'lodash';
import Geocode from "react-geocode";
import { mapOption } from '../../../constants/map-option';
import MapComponent from './map-component';
const KEY_GOOGLE_MAP = 'AIzaSyDL7sUf9bCXYdpq5RGDBvnxD1VG9C1619Q'
Geocode.setApiKey(KEY_GOOGLE_MAP);

class MyMap extends React.Component {
    displayName = 'Google Map';

    static defaultProps = {
        isMarkerShown: false,
        isSearchBox: false
    };

    constructor(props) {
        super(props)
        this.state = {
            myLocation: '',
            locationInfo: null
        };
    }

    componentDidMount() {
        if (this.props.userLocation) {
            Geocode.fromLatLng(this.props.userLocation.latitude, this.props.userLocation.longitude).then((result) => {
                this.setState({ myLocation: result.results[0].formatted_address });
            });
        }
        this.setState({ locationInfo: this.props.locationInfo });
    }

    componentWillReceiveProps = (nextProps) => {
        this.setState({ locationInfo: nextProps.locationInfo });
    }

    handleChangeLocation = (location) => {
        this.props.handleChangeLocation(location);
    }

    render() {
        return <div className="custom-map">
            <MapComponent
                isMarkerShown={this.props.isMarkerShown}
                isSearchBox={this.props.isSearchBox}
                googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${KEY_GOOGLE_MAP}&v=3.exp&libraries=geometry,drawing,places`}
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `100vh` }} />}
                mapElement={<div style={{ height: `100%` }} />}
                myLocation={{ position: this.props.userLocation, address: this.state.myLocation }}
                handleChangeLocation={this.handleChangeLocation}
                locationInfo={this.state.locationInfo}
            />
        </div>;
    }
}

export default MyMap;
