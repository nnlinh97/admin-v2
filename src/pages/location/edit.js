import React, { Component } from 'react';
import Header from '../../components/header/';
import Footer from '../../components/footer/';
import Sidebar from '../../components/sidebar/';
import EditLocationComponent from '../../components/location/edit/'


class CreateLocationPage extends Component {
    render() {
        return (
            <div className="hold-transition skin-blue sidebar-mini">
                <div className="wrapper">
                    <Header/>
                    <Sidebar/>
                    <EditLocationComponent/>
                    <Footer/>
                </div>
            </div>
        );
    }
}

export default CreateLocationPage;