import React, { Component } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';
import CreateTourComponent from '../../components/tour/create';



class ListTourPage extends Component {
    render() {
        return (
            <div className="hold-transition skin-blue sidebar-mini">
                <div className="wrapper">
                    <Header/>
                    <Sidebar/>
                    <CreateTourComponent/>
                    <Footer/>
                </div>
            </div>
        );
    }
}

export default ListTourPage;