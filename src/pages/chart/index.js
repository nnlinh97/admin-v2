import React, { Component } from 'react';
import Header from '../../components/header/';
import Footer from '../../components/footer/';
import Sidebar from '../../components/sidebar/';
import Chart from '../../components/chart/index';



class ListTourPage extends Component {
    render() {
        return (
            <div className="hold-transition skin-blue sidebar-mini">
                <div className="wrapper">
                    <Header/>
                    <Sidebar/>
                    <Chart/>
                    <Footer/>
                </div>
            </div>
        );
    }
}

export default ListTourPage;