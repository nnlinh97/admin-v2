import React, { Component } from 'react';
import Header from '../../components/header/';
import Footer from '../../components/footer/';
import Sidebar from '../../components/sidebar/';
import ListTourTurnComponent from '../../components/tour-turn/list';



class ListTourPage extends Component {
    render() {
        return (
            <div className="hold-transition skin-blue sidebar-mini">
                <div className="wrapper">
                    <Header/>
                    <Sidebar/>
                    <ListTourTurnComponent/>
                    <Footer/>
                </div>
            </div>
        );
    }
}

export default ListTourPage;