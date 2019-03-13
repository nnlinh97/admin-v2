import React, { Component } from 'react';
import Map from './map';
import SearchBox from './searchbox';
import Map1 from './map1';
import Info from './info';
import MyMap from './my-map';

class CreateLocationComponent extends Component {


    render() {
        return (
            <div className="content-wrapper">
                {/* Content Header (Page header) */}
                <section className="content-header">
                    <h1>
                        Create Location
                    </h1>
                    {/* <SearchBox/> */}
                </section>
                <section className="content">
                    <div className="row">
                        <div className="col-lg-9 col-xs-9">
                            <MyMap/>
                        </div>
                        <div className="col-lg-3 col-xs-3">
                            <Info />
                        </div>
                    </div>

                </section>
            </div>
        );
    }
}

export default CreateLocationComponent;