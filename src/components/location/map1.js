import React, { Component } from 'react';
import { compose, withProps, withStateHandlers, lifecycle } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import { InfoBox } from "react-google-maps/lib/components/addons/InfoBox"
import { SearchBox } from "react-google-maps/lib/components/places/SearchBox"
import _ from 'lodash'
import Geocode from "react-geocode";
import { connect } from 'react-redux';
import { mapOption } from '../../constants/map-option';
import * as actions from './../../actions/index';

const KEY_GOOGLE_MAP = 'AIzaSyA5aHhKGZxiy_9OZ0vyakabi1FCbOHrEWI'
Geocode.setApiKey(KEY_GOOGLE_MAP);

class Map1 extends Component {

    displayName = 'Google Map'

    static defaultProps = {
        isMarkerShown: false,
        isSearchBox: false
    }

    constructor(props) {
        super(props)
    }

    componentDidMount() {

    }

    changeLocationInfo = (item) => {
        this.props.changeLocationInfo(item)
    }
    render() {
        const { userLocation, google } = this.props
        const MapComponent = compose(
            withProps({
                googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${KEY_GOOGLE_MAP}&v=3.exp&libraries=geometry,drawing,places`,
                loadingElement: <div style={{ height: `100%` }} />,
                containerElement: <div style={{ height: `100vh` }} />,
                mapElement: <div style={{ height: `100%` }} />,
                center: { lat: 10.762622, lng: 106.660172 }, //Vietnam
            }),
            lifecycle({
                componentDidMount() {
                    const refs = {}

                    this.setState({
                        bounds: null,
                        markers: [],
                        markerClick: null,
                        mapPosition: null,
                        zoom: 8,
                        address: '',
                        onMapMounted: ref => {
                            refs.map = ref;
                        },
                        onBoundsChanged: () => {
                            this.setState({
                                bounds: refs.map.getBounds(),
                            })
                        },
                        onSearchBoxMounted: ref => {
                            refs.searchBox = ref;
                        },
                        onPlacesChanged: () => {
                            const places = refs.searchBox.getPlaces();
                            const bounds = new window.google.maps.LatLngBounds();

                            places.forEach(place => {
                                if (place.geometry.viewport) {
                                    bounds.union(place.geometry.viewport)
                                } else {
                                    bounds.extend(place.geometry.location)
                                }
                            });
                            const nextMarkers = places.map(place => ({
                                position: place.geometry.location,
                            }));
                            const nextCenter = _.get(nextMarkers, '0.position', this.state.center);
                            Geocode.fromAddress(places[0].formatted_address).then((result) => {
                                const { lat, lng } = result.results[0].geometry.location;
                                this.setState({
                                    center: nextCenter,
                                    markers: nextMarkers,
                                    markerClick: {
                                        latitude: lat,
                                        longitude: lng
                                    }
                                });
                            })
                            // refs.map.fitBounds(bounds);
                        },
                        onClickedMap: (event) => {
                            let newLat = event.latLng.lat();
                            let newLng = event.latLng.lng();
                            const newCenter = refs.map.getCenter();
                            Geocode.fromLatLng(newLat, newLng).then((result) => {
                                const { lat, lng } = result.results[0].geometry.location;
                                this.setState({
                                    mapPosition: {
                                        latitude: newCenter.lat(),
                                        longitude: newCenter.lng()
                                    },
                                    markerClick: {
                                        latitude: lat,
                                        longitude: lng
                                    },
                                    address: result.results[0].formatted_address,
                                    zoom: refs.map.getZoom()
                                })
                            })
                        },
                    })
                },
            }),
            withStateHandlers(() => ({
                isOpen: false,
                isOpenClickedMarker: false
            }), {
                    onToggleOpen: ({ isOpen }) => () => ({
                        isOpen: !isOpen,
                    }),
                    onToggleOpenClickedMarker: ({ isOpenClickedMarker }) => () => ({
                        isOpenClickedMarker: !isOpenClickedMarker,
                    })
                }),
            withScriptjs,
            withGoogleMap
        )
        (props =>
            <GoogleMap
                ref={props.onMapMounted}
                center={props.center}
                onBoundsChanged={props.onBoundsChanged}
                defaultZoom={props.zoom}
                defaultCenter={props.center}
                defaultOptions={mapOption}
                onClick={props.onClickedMap}>
                {true &&
                    <SearchBox
                        ref={props.onSearchBoxMounted}
                        bounds={props.bounds}
                        controlPosition={window.google.maps.ControlPosition.TOP_LEFT}
                        onPlacesChanged={props.onPlacesChanged}>
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
                {true && props.markerClick &&  //Clicked marker location
                    <Marker
                        position={{ lat: props.markerClick.latitude, lng: props.markerClick.longitude }}
                        onClick={props.onToggleOpenClickedMarker}>
                        {props.isOpenClickedMarker && <InfoBox
                            onCloseClick={props.onToggleOpenClickedMarker}
                            options={{ closeBoxURL: ``, enableEventPropagation: true }}
                        >
                            <div style={{ backgroundColor: `yellow`, opacity: 1, padding: `12px` }}>
                                <div className="box box-warning">
                                    {/* <div className="box-header with-border">
                                        <h3 className="box-title">General Elements</h3>
                                    </div> */}
                                    <div className="box-body">
                                        <form role="form">
                                            <div className="form-group">
                                                <label>Latitude</label>
                                                <input type="text" className="form-control" placeholder="Enter ..." />
                                            </div>
                                            <div className="form-group">
                                                <label>Longitude</label>
                                                <input type="text" className="form-control" placeholder="Enter ..." />
                                            </div>
                                            <div className="form-group">
                                                <label>Address</label>
                                                <input type="text" className="form-control" placeholder="Enter ..." />
                                            </div>
                                            <div className="form-group">
                                                <label>Description</label>
                                                <textarea className="form-control" rows={3} placeholder="Enter ..." defaultValue={""} />
                                            </div>
                                            <div className="form-group">
                                                <label>Type</label>
                                                <select className="form-control">
                                                    <option>option 1</option>
                                                    <option>option 2</option>
                                                    <option>option 3</option>
                                                    <option>option 4</option>
                                                    <option>option 5</option>
                                                </select>
                                            </div>
                                        </form>
                                    </div>
                                </div>

                            </div>
                        </InfoBox>}
                    </Marker>
                }
            </GoogleMap>
            )
        return (
            <div className="custom-map">
                <MapComponent isMarkerShown={this.props.isMarkerShown} isSearchBox={this.props.isSearchBox} />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
    }
}

const mapDispatchToProps = (dispatch, action) => {
    return {
        changeLocationInfo: (info) => dispatch(actions.changeLocationInfo(info))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Map1);