import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
// import moment from 'moment';
import * as actions from './../../actions/index';
import {
    apiGet,
    // apiPost
} from '../../services/api';
import {
    // matchString,
    getStatusTourTurn
} from '../../helper';
import 'react-table/react-table.css';
import './list.css';

class listBookTourConponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listBookTour: [],
            keySearch: ''
        }
    }

    async componentDidMount() {
        try {
            let listBook = await apiGet('/book_tour/getAllBookTourHistoryGroupByTourTurn');
            console.log(listBook.data.data);
            listBook = listBook.data.data.filter((item) => item.num_current_people > 0);
            this.setState({ listBookTour: listBook })
        } catch (error) {
            console.log(error);
        }
    }

    getBookTourTurnDetail = async (props) => {
        try {
            const { id } = props.original;
            const detail = await apiGet(`/book_tour/getBookTourHistoryByTourTurn/${id}`);
            await this.props.getBookTourTurnById(detail.data.data);
            this.props.history.push(`/book-tour/${id}`);
        } catch (error) {
            console.log(error);
        }
    }

    getDateMonthYear = (data) => {
        // const year = data.substring(0, 4);
        const result = data.split('-');
        return {
            year: result[0],
            month: result[1],
            date: result[2]
        };
    }

    FromDateTo = (date1, date2) => {
        const data1 = this.getDateMonthYear(date1);
        const data2 = this.getDateMonthYear(date2);
        if (data1.year === data2.year) {
            return `${data1.date}/${data1.month} - ${data2.date}/${data2.month}/${data2.year}`;
        }
        return `${data1.date}/${data1.month}/${data1.year} - ${data2.date}/${data2.month}/${data2.year}`;
    }


    render() {
        const columns = [
            {
                Header: "STT",
                Cell: props => <p>{props.index + 1}</p>,
                style: { textAlign: 'center' },
                sortable: false,
                resizable: false,
                filterable: false,
                width: 80,
                maxWidth: 80,
                minWidth: 80
            },
            {
                Header: "Mã chuyến đi",
                accessor: "code",
                Cell: props => <p
                    style={{ cursor: 'pointer' }}
                    onClick={() => this.props.history.push(`/tour-turn/list?search=${props.original.code}`)}>
                    {props.original.code}
                </p>,
                style: { textAlign: 'left' },
                sortable: false,
                resizable: false,
                filterable: false,
                width: 100,
                maxWidth: 100,
                minWidth: 100
            },
            {
                Header: "Tour",
                accessor: "tour.name",
                style: { textAlign: 'left', whiteSpace: 'unset' },
                sortable: false,
                resizable: false,
                filterable: false,
            },
            {
                Header: "Thời gian",
                accessor: "start_date",
                Cell: props => {
                    return (<p>{this.FromDateTo(props.original.start_date, props.original.end_date)}</p>)
                },
                style: { textAlign: 'center' },
                sortable: false,
                resizable: false,
                filterable: false,
                width: 220,
                maxWidth: 220,
                minWidth: 220
            },
            // {
            //     Header: "Ngày kết thúc",
            //     accessor: "end_date",
            //     Cell: props => {
            //         return (<p>{moment(props.original.end_date).format('DD/MM/YYYY')}</p>)
            //     },
            //     style: { textAlign: 'center' },
            //     sortable: false, 
            //     resizable: false, 
            //     filterable: false,
            //     width: 140,
            //     maxWidth: 140,
            //     minWidth: 140
            // },
            // {
            //     Header: "SL tối đa",
            //     accessor: "num_max_people",
            //     style: { textAlign: 'center' },
            //     sortable: false, 
            //     resizable: false, 
            //     filterable: false,
            //     width: 100,
            //     maxWidth: 100,
            //     minWidth: 100
            // },
            {
                Header: "Số lượng",
                accessor: "num_current_people",
                Cell: props => {
                    return (<p>{props.original.num_current_people}/{props.original.num_max_people}</p>)
                },
                style: { textAlign: 'center' },
                sortable: false,
                resizable: false,
                filterable: false,
                width: 100,
                maxWidth: 100,
                minWidth: 100
            },
            {
                Header: props => <i className="fa fa-suitcase" />,
                Cell: props => {
                    const status = getStatusTourTurn(props.original.start_date, props.original.end_date);
                    return <label className={`label label-${status.css} disabled`} >
                        {status.status}
                    </label>;
                },
                style: { textAlign: 'center' },
                sortable: false,
                resizable: false,
                filterable: false,
                width: 80,
                maxWidth: 100,
                minWidth: 80
            },
            {
                Header: props => <i className="fa fa-eye" />,
                Cell: props => {
                    return <button className='btn btn-xs btn-success'
                        onClick={() => this.props.history.push(`/book-tour/${props.original.id}`)} >
                        <i className="fa fa-eye" />
                    </button>
                },
                style: { textAlign: 'center' },
                sortable: false,
                resizable: false,
                filterable: false,
                width: 50,
                maxWidth: 70,
                minWidth: 50
            }

        ];
        return (
            <div style={{ minHeight: '100vh' }} className="content-wrapper">
                <section className="content-header content-header-page">
                    <h1> Danh Sách Chuyến Đi Đã Được Đặt </h1>
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
                                                    data={this.state.listBookTour}
                                                    columns={columns}
                                                    pageSizeOptions={[5, 10, 20, 25]}
                                                    defaultPageSize={10}
                                                    noDataText={'Vui lòng đợi...'}
                                                    previousText={'Trang trước'}
                                                    nextText={'Trang sau'}
                                                    pageText={'Trang'}
                                                    ofText={'/'}
                                                    rowsText={'dòng'} >
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

// export default withRouter(listBookTourConponent);
const mapStateToProps = (state) => {
    return {
        info: state.infoLocation,
        allType: state.allType,
        allLocation: state.allLocation,
        listTour: state.listTour,
        listTourTurn: state.listTourTurn,
        listBookTourTurn: state.listBookTourTurn
    }
}

const mapDispatchToProps = (dispatch, action) => {
    return {
        changeLocationInfo: (info) => dispatch(actions.changeLocationInfo(info)),
        getListTypeLocation: (type) => dispatch(actions.getListTypeLocation(type)),
        // getListLocation: (locations) => dispatch(actions.getListLocation(locations)),
        createType: (type) => dispatch(actions.createType(type)),
        editType: (type) => dispatch(actions.editType(type)),
        getListTour: (tour) => dispatch(actions.getListTour(tour)),
        getListTourTurn: (tourTurn) => dispatch(actions.getListTourTurn(tourTurn)),
        getTourTurnDetail: (tourTurn) => dispatch(actions.getTourTurnById(tourTurn)),
        getListBookTourTurn: (listBook) => dispatch(actions.getListBookTourTurn(listBook)),
        getBookTourTurnById: (book) => dispatch(actions.getBookTourTurnById(book))
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(listBookTourConponent));