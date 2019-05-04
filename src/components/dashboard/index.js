import React, { Component } from 'react';
import { apiGet } from '../../services/api';
import './index.css';

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
                <section class="content_body">
                    <form className="form-horizontal">
                        <div className="box-body book_tour_detail-book_tour_history">
                            <div class="book_tour_detail-book_tour_history-title">
                                <h2>Danh Sách Hủy Tour</h2>
                                <div className="search_box">
                                    <div class="search_icon">
                                        <i class="fa fa-search"></i>
                                    </div>
                                    <input
                                        type="text"
                                        onChange={this.handleChange}
                                        value="78acc210-5059-11e9-aa13-03259040952a1235325"
                                        name="keySearch"
                                        className="search_input"
                                        placeholder="Tìm kiếm..."
                                    />
                                </div>
                            </div>
                            <div className="container">
                                <div className="row">
                                    <div className="col-xs-12 book_tour_history">
                                        <table className="table table-bordered table-hover dt-responsive">
                                            <caption className="text-center"></caption>
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Code</th>
                                                    <th>Num Passengers</th>
                                                    <th>Payment Method</th>
                                                    <th>Total Pay</th>
                                                    <th>Message</th>
                                                    <th>Time</th>
                                                    <th>Status</th>
                                                    <th><i className="fa fa-pencil" /></th>
                                                    <th><i class="fa fa-ellipsis-h"></i></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>1</td>
                                                    <td>"78acc210-5059-11e9-aa13-03259040952a"</td>
                                                    <td>1</td>
                                                    <td>incash</td>
                                                    <td>10 000</td>
                                                    <td>Bận đột xuất nên không thể đi được, mong được chấp nhận</td>
                                                    <td>12-12-2012</td>
                                                    <td>pending_cancel</td>
                                                    <td><i className="fa fa-pencil" /></td>
                                                    <td><i class="fa fa-ellipsis-h"></i></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </section>
            </div>
        );
    }
}

export default Dashboard;