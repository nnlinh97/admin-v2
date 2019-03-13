import React, { Component } from 'react';
import Map from './map';
import SearchBox from './searchbox';
import Map1 from './map1';
import InfoEdit from './info-edit';
import MyMap from './my-map';

class EditLocationComponent extends Component {

    render() {
        return (
            <div className="content-wrapper">
                <section className="content-header">
                    <h1>
                        Edit Location
                    </h1>
                </section>
                <section className="content">
                    <div className="row">
                        <div className="col-lg-9 col-xs-9">
                            <MyMap/>
                        </div>
                        <div className="col-lg-3 col-xs-3">
                            <InfoEdit />
                        </div>
                    </div>

                </section>
            </div>
        );
    }
}

export default EditLocationComponent;