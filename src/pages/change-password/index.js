import React, { Component } from 'react';
import Header from '../../components/header/';
import Footer from '../../components/footer/';
import Sidebar from '../../components/sidebar/';
import ChangePasswordComponent from '../../components/change-password'


class Location extends Component {
    render() {
        return (
            <div className="hold-transition skin-blue sidebar-mini">
                <div className="wrapper">
                    <Header/>
                    <Sidebar/>
                    <ChangePasswordComponent/>
                    <Footer/>
                </div>
            </div>
        );
    }
}

export default Location;