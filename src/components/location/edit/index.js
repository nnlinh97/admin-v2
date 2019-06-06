import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Form from './form';
import MyMap from '../map';
import './index.css';

class EditLocationComponent extends Component {
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
        console.log(location)
        this.setState({ location });
    }

    render() {
        return <div className="content-wrapper">
            <section className="content-header content-header-page">
                <h1> Chỉnh Sửa Địa Điểm <i>#{this.props.match.params.id}</i></h1>
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
        </div>;
    }
}

export default withRouter(EditLocationComponent);