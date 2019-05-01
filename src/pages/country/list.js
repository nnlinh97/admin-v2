import React, { Component } from 'react';
import Header from '../../components/header/';
import Footer from '../../components/footer/';
import Sidebar from '../../components/sidebar/';
import ListTypesComponent from '../../components/country/list';


class Location extends Component {
    render() {
        return (
            <div className="hold-transition skin-blue sidebar-mini">
                <div className="wrapper">
                    <Header />
                    <Sidebar />
                    <ListTypesComponent />
                    <Footer />
                </div>
            </div>
        );
    }
}

export default Location;