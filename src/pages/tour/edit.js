import React, { Component } from 'react';
import Header from '../../components/header/';
import Footer from '../../components/footer/';
import Sidebar from '../../components/sidebar/';
import EditTourComponent from '../../components/tour/edit/index';


class EditTourPage extends Component {
    render() {
        return (
            <div className="hold-transition skin-blue sidebar-mini">
                <div className="wrapper">
                    <Header/>
                    <Sidebar/>
                    <EditTourComponent/>
                    <Footer/>
                </div>
            </div>
        );
    }
}

export default EditTourPage;