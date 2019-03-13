import React, { Component } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';
import EditTourComponent from '../../components/tour/edit';


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