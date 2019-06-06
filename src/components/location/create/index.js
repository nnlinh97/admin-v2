import React, { Component } from 'react';
import Form from './form';
import MyMap from '../map';
import './index.css';

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
                <section className="content-header content-header-page">
                    <h1> Thêm Mới Địa Điểm</h1>
                </section>
                <section className="content">
                    <div className="row">
                        <div className="col-lg-12 col-xs-12">
                            <MyMap locationInfo={this.state.location} handleChangeLocation={this.handleChangeLocation} />
                        </div>
                    </div>
                    <div className="row row_2_create_location" style={{ padding: '40px 0' }}>
                        <div className="col-lg-12 col-xs-12">
                            <Form locationInfo={this.state.location} handleInputLocation={this.handleInputLocation} />
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

export default CreateLocationComponent;