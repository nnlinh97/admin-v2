import React, { Component } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';
import EditRoutenComponent from '../../components/route/edit';



class ListTourPage extends Component {
    render() {
        return (
            <div className="hold-transition skin-blue sidebar-mini">
                <div className="wrapper">
                    <Header/>
                    <Sidebar/>
                    <EditRoutenComponent/>
                    <Footer/>
                </div>
            </div>
        );
    }
}

export default ListTourPage;