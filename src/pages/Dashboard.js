import React, { Component } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import DashboardComponent from '../components/dashboard/content';
import { URL } from '../constants/url';
import { withRouter } from 'react-router-dom';

class Dashboard extends Component {

    componentDidMount() {
        
    }

    render() {
        return (
            <div className="hold-transition skin-blue sidebar-mini">
                <div className="wrapper">
                    <Header />
                    {/* Left side column. contains the logo and sidebar */}
                    <Sidebar />
                    {/* Content Wrapper. Contains page content */}
                    <DashboardComponent />
                    {/* /.content-wrapper */}
                    <Footer />
                    {/* Control Sidebar */}
                </div>

            </div>
        );
    }
}

export default withRouter(Dashboard);