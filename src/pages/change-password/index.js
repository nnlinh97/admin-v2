import React, { Component } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';
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