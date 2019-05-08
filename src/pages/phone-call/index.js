import React, { Component } from 'react';
import Header from '../../components/header/';
import Footer from '../../components/footer/';
import Sidebar from '../../components/sidebar/';
import PhoneCallComponent from '../../components/phone-call';


class Location extends Component {
    render() {
        return (
            <div className="hold-transition skin-blue sidebar-mini">
                <div className="wrapper">
                    <Header />
                    <Sidebar />
                    <PhoneCallComponent />
                    <Footer />
                </div>
            </div>
        );
    }
}

export default Location;