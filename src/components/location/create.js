import React, { Component } from 'react';
import Info from './info';
import MyMap from './my-map';

class CreateLocationComponent extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            location: null
        }
    }

    handleChangeLocation = (location) => {
        this.setState({ location });
    }

    handleInputLocation = (location) => {
        this.setState({ location });
    }

    render() {
        return (
            <div className="content-wrapper">
                <section className="content-header">
                    <h1> Thêm Mới Địa Điểm</h1>
                </section>
                <section className="content">
                    <div className="row">
                        <div className="col-lg-12 col-xs-12">
                            <MyMap locationInfo={this.state.location} handleChangeLocation={this.handleChangeLocation} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12 col-xs-12">
                            <Info locationInfo={this.state.location} handleInputLocation={this.handleInputLocation} />
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

export default CreateLocationComponent;