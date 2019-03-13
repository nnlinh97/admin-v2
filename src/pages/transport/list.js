import React, { Component } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';
import ListTransportComponent from '../../components/transport/list';


class Location extends Component {
    render() {
        return (
            <div className="hold-transition skin-blue sidebar-mini">
                <div className="wrapper">
                    <Header/>
                    <Sidebar/>
                    <ListTransportComponent/>
                    <Footer/>
                </div>
            </div>
        );
    }
}

export default Location;