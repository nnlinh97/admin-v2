import React, { Component } from 'react';
import { connect } from 'react-redux';
import Geocode from "react-geocode";
import * as actions from './../../actions/index';
Geocode.setApiKey("AIzaSyDGe5vjL8wBmilLzoJ0jNIwe9SAuH2xS_0");
Geocode.enableDebug();

class SearchBox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            txtSearch: ''
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

    handleSubmit = (event) => {
        event.preventDefault();
        Geocode.fromAddress(this.state.txtSearch).then((result) => {
            // console.log(result.results[0]);
            const { lat, lng } = result.results[0].geometry.location;
            const item = {
                lat,
                lng,
                address: result.results[0].formatted_address
            }
            this.props.searchLocation(item);
            this.setState({
                txtSearch: ''
            })
        });
    }
    render() {
        return (
            <ol className="breadcrumb">
                <form onSubmit={this.handleSubmit}>
                    <input
                        onChange={this.handleChange}
                        name="txtSearch" type="text"
                        style={{
                            boxSizing: `border-box`,
                            border: `1px solid transparent`,
                            width: `240px`,
                            height: `32px`,
                            marginTop: `0px`,
                            padding: `0 12px`,
                            borderRadius: `3px`,
                            boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                            fontSize: `14px`,
                            outline: `none`,
                            textOverflow: `ellipses`,
                        }}
                        className="form-control" id="inputEmail3" placeholder="search location ..." />
                </form>
            </ol>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        searchLocation: state.searchLocation
    }
}

const mapDispatchToProps = (dispatch, action) => {
    return {
        searchLocation: (location) => dispatch(actions.searchLocation(location))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SearchBox);