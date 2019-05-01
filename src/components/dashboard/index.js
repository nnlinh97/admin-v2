import React, { Component } from 'react';
import { apiGet } from '../../services/api';

class Dashboard extends Component {

    componentDidMount = async () => {
        let request = await apiGet('/request_cancel_booking/getAllRequest');
        console.log(request.data.data)
    }

    render() {
        return (
            <div style={{ height: '100vh' }} className="content-wrapper">
                <section className="content-header">
                    <h1> Danh Sách Yêu Cầu Hủy Booking </h1>
                </section>
                <section className="content">
                    <div className="row">
                        <div className="col-lg-3 col-xs-6">
                            <div className="small-box bg-aqua">
                                <div className="inner">
                                    <h3>150</h3>
                                    <p>New Orders</p>
                                </div>
                                <div className="icon">
                                    <i className="ion ion-bag" />
                                </div>
                                <a href="#" className="small-box-footer">More info
                                        <i className="fa fa-arrow-circle-right" />
                                </a>
                            </div>
                        </div>
                        <div className="col-lg-3 col-xs-6">
                            <div className="small-box bg-green">
                                <div className="inner">
                                    <h3>53
                                            <sup style={{ fontSize: '20px' }}>%</sup>
                                    </h3>
                                    <p>Bounce Rate</p>
                                </div>
                                <div className="icon">
                                    <i className="ion ion-stats-bars" />
                                </div>
                                <a href="#" className="small-box-footer">More info
                                        <i className="fa fa-arrow-circle-right" />
                                </a>
                            </div>
                        </div>
                        <div className="col-lg-3 col-xs-6">
                            <div className="small-box bg-yellow">
                                <div className="inner">
                                    <h3>44</h3>
                                    <p>User Registrations</p>
                                </div>
                                <div className="icon">
                                    <i className="ion ion-person-add" />
                                </div>
                                <a href="#" className="small-box-footer">More info
                                        <i className="fa fa-arrow-circle-right" />
                                </a>
                            </div>
                        </div>
                        <div className="col-lg-3 col-xs-6">
                            <div className="small-box bg-red">
                                <div className="inner">
                                    <h3>65</h3>
                                    <p>Unique Visitors</p>
                                </div>
                                <div className="icon">
                                    <i className="ion ion-pie-graph" />
                                </div>
                                <a href="#" className="small-box-footer">
                                    More info
                                    <i className="fa fa-arrow-circle-right" />
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

export default Dashboard;