import React, { Component } from 'react';
import Header from '../../components/header/';
import Footer from '../../components/footer/';
import Sidebar from '../../components/sidebar/';
import ListTypesPassengerComponent from '../../components/type-passenger/list';


class Location extends Component {
    render() {
        return (
            <div className="hold-transition skin-blue sidebar-mini">
                <div className="wrapper">
                    <Header/>
                    <Sidebar/>
                    <ListTypesPassengerComponent/>
                    <Footer/>
                </div>
            </div>
        );
    }
}

export default Location;