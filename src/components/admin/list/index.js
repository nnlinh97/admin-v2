import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import ReactTable from 'react-table';
import * as actions from './../../../actions/index';
import { apiGet, apiPost } from '../../../services/api';
import { matchString, getStatusTourTurn } from '../../../helper';
import 'react-table/react-table.css';
import './index.css';

class listAdmin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listAdmin: [],
            keySearch: ''
        }
    }

    async componentDidMount() {
        try {
            let admins = await apiGet('/admin/getListAdmins');
            console.log(admins.data.data);
            this.setState({ listAdmin: admins.data.data });
        } catch (error) {
            console.log(error);
        }
    }


    render() {
        const columns = [
            {
                Header: "STT",
                Cell: props => <p>{props.index + 1}</p>,
                style: { textAlign: 'center' },
                style: { textAlign: 'center' },
                width: 80,
                maxWidth: 80,
                minWidth: 80
            },
            {
                Header: "ID",
                accessor: "id",
                style: { textAlign: 'center' },
                width: 100,
                maxWidth: 100,
                minWidth: 100
            },
            {
                Header: "Tên đăng nhập",
                accessor: "username",
                style: { textAlign: 'center' }
            },
            {
                Header: "Tên",
                accessor: "name",
                style: { textAlign: 'center' }
            },
            {
                Header: "Mật khẩu",
                accessor: "password",
                style: { textAlign: 'center' },
            },
            // {
            //     Header: props => <i className="fa fa-eye" />,
            //     Cell: props => {
            //         return <button className='btn btn-xs btn-success'
            //             onClick={() => this.props.history.push(`/book-tour/${props.original.id}`)} >
            //             <i className="fa fa-eye" />
            //         </button>
            //     },
            //     style: { textAlign: 'center' },
            //     width: 50,
            //     maxWidth: 70,
            //     minWidth: 50
            // }
        ];
        return (
            <div style={{ minHeight: '100vh' }} className="content-wrapper">
                <section className="content-header">
                    <h1> Danh Sách Admin </h1>
                </section>
                <section className="content">
                    <div className="row">
                        <div className="col-lg-12 col-xs-12">
                            <form className="form-horizontal">
                                <div className="box-body book_tour_detail-book_tour_history">
                                    <div className="book_tour_detail-book_tour_history-title">
                                        <h2>&nbsp;</h2>
                                        <div style={{ top: '10px' }} className="search_box">
                                            <div className="search_icon">
                                                <i className="fa fa-search"></i>
                                            </div>
                                            <input
                                                type="text"
                                                onChange={this.handleChange}
                                                value={this.state.keySearch}
                                                name="keySearch"
                                                className="search_input"
                                                placeholder="Tìm kiếm..."
                                            />
                                        </div>
                                    </div>
                                    <div className="container">
                                        <div className="row">
                                            <div className="col-xs-12 book_tour_history">
                                                <ReactTable
                                                    data={this.state.listAdmin}
                                                    defaultPageSize={10}
                                                    noDataText={'vui lòng chờ...'}
                                                    columns={columns} >
                                                </ReactTable>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

export default withRouter(listAdmin);