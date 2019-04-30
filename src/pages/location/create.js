import React, { Component } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';
import CreateLocationComponent from '../../components/location/create/'


class CreateLocationPage extends Component {
    render() {
        return (
            <div className="hold-transition skin-blue sidebar-mini">
                <div className="wrapper">
                    <Header/>
                    <Sidebar/>
                    <CreateLocationComponent/>
                    <Footer/>
                </div>
            </div>
        );
    }
}

export default CreateLocationPage;