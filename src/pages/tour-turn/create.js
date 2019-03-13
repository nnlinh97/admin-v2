import React, { Component } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';
import CreateTourTurnComponent from '../../components/tour-turn/create';



class ListTourPage extends Component {
    render() {
        return (
            <div className="hold-transition skin-blue sidebar-mini">
                <div className="wrapper">
                    <Header/>
                    <Sidebar/>
                    <CreateTourTurnComponent/>
                    <Footer/>
                </div>
            </div>
        );
    }
}

export default ListTourPage;