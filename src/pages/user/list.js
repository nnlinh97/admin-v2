import React, { Component } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';
import ListTypesComponent from '../../components/user/list';


class Location extends Component {
    render() {
        return (
            <div className="hold-transition skin-blue sidebar-mini">
                <div className="wrapper">
                    <Header/>
                    <Sidebar/>
                    <ListTypesComponent/>
                    <Footer/>
                </div>
            </div>
        );
    }
}

export default Location;