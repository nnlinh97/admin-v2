import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import SweetAlert from 'react-bootstrap-sweetalert';
// import Modal from 'react-responsive-modal';
import moment from 'moment';
import * as actions from './../../actions/index';
import { apiGet, apiPost } from './../../services/api';
// import { matchString } from '../../helper';
import 'react-table/react-table.css';
import './index.css';

// const Completionist = () => <span>Hết hạn</span>;

// Renderer callback with condition
// const renderer = ({ days, hours, minutes, seconds, completed }) => {
//     if (completed) {
//         return <Completionist />;
//     } else {
//         return <span>{days > 0 ? `${days}d : ` : ''}{hours}h : {minutes}m : {seconds}s</span>;
//     }
// };

class ListProvinceComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalCreateIsOpen: false,
            modalEditIsOpen: false,
            error: false,
            success: false,
            province: null,
            keySearch: '',
            listPhoneCall: []
        };
    }

    async componentDidMount() {
        try {
            let listPhoneCall = await apiGet('/book_tour/getListNeedCall');
            listPhoneCall = listPhoneCall.data.data;
            console.log(listPhoneCall)
            this.setState({ listPhoneCall })
        } catch (error) {
            console.log(error);
        }
    }

    handleOpenEditModal = ({ original }) => {
        this.setState({ modalEditIsOpen: true, province: original });
    }

    handleCloseEditModal = () => {
        this.setState({ modalEditIsOpen: false, province: null });
    }

    handleOpenCreateModal = () => {
        this.setState({ modalCreateIsOpen: true });
    }

    handleCloseCreateModal = () => {
        this.setState({ modalCreateIsOpen: false });
    }

    handleEditProvince = async (name, country, id) => {
        if (id !== '' && name !== '' && country !== null) {
            try {
                let province = await apiPost('/tour_classification/updateProvince', {
                    id: id,
                    name: name,
                    fk_country: country.id
                });
                this.props.updateProvince(province.data.data);
                this.setState({ success: true });
            } catch (error) {
                this.setState({ error: true });
            }
        } else {
            this.setState({ error: true });
        }
    }

    handleCreateProvince = async (name, country) => {
        if (name !== '' && country !== '') {
            try {
                let province = await apiPost('/tour_classification/createProvince', { name: name, idCountry: country.id });
                await this.props.createProvince(province.data);
                this.setState({ success: true });
            } catch (error) {
                this.setState({ error: true });
            }
        } else {
            this.setState({ error: true });
        }
    }

    hideSuccessAlert = () => {
        this.handleCloseCreateModal();
        this.handleCloseEditModal();
        this.setState({ success: false });
    }

    hideFailAlert = () => {
        this.setState({ error: false });
    }

    handleChange = ({ target }) => {
        this.setState({ keySearch: target.value });
    }

    // handleSearchProvince = (listProvinces, keySearch) => {
    //     if (keySearch !== '' && listProvinces.length > 0) {
    //         return listProvinces.filter(province => matchString(province.name, keySearch) || matchString(province.id.toString(), keySearch));
    //     }
    //     return listProvinces;
    // }

    render() {
        const columns = [
            {
                Header: "STT",
                Cell: props => <p>{props.index + 1}</p>,
                style: { textAlign: 'center' },
                width: 40,
                maxWidth: 50,
                minWidth: 40
            },
            {
                Header: "Mã đặt tour",
                accessor: "code",
                Cell: props => <p>
                    #{props.original.code}
                </p>,
                style: { textAlign: 'center' },
                width: 100,
                maxWidth: 100,
                minWidth: 100
            },
            {
                Header: "Người liên hệ",
                accessor: "book_tour_contact_info.fullname",
                style: { textAlign: 'center' }
            },
            {
                Header: "Số điện thoại",
                accessor: "book_tour_contact_info.phone",
                style: { textAlign: 'center' },
                width: 100,
                maxWidth: 100,
                minWidth: 100
            },
            // {
            //     Header: "Email",
            //     accessor: "book_tour_contact_info.email",
            //     style: { textAlign: 'center' }
            // },
            {
                Header: "Tour",
                accessor: "tour_turn.tour.name",
                style: { textAlign: 'center' }
            },
            {
                Header: "Ngày đặt tour",
                accessor: "book_time",
                Cell: props => <p>{moment(props.original.book_time).format('DD/MM/YYYY')}</p>,
                style: { textAlign: 'center' },
                width: 100,
                maxWidth: 100,
                minWidth: 100
            },
            {
                Header: "Ngày bắt đầu",
                accessor: "tour_turn.start_date",
                Cell: props => <p>{moment(props.original.tour_turn.start_date).format('DD/MM/YYYY')}</p>,
                style: { textAlign: 'center' },
                width: 100,
                maxWidth: 100,
                minWidth: 100
            },
            {
                Header: "Hạn thanh toán",
                accessor: "payment_term",
                Cell: props => <p>{moment(new Date(props.original.payment_term)).format('DD/MM/YYYY')}</p>,
                style: { textAlign: 'center' },
                width: 115,
                maxWidth: 115,
                minWidth: 115
            },
            {
                Header: "Đếm ngược",
                accessor: "payment_term",
                // Cell: props => <Countdown date={new Date(props.original.payment_term).getTime()} renderer={renderer} />,
                style: { textAlign: 'center' },
                width: 125,
                maxWidth: 125,
                minWidth: 125
            },
            {
                Header: props => <i className="fa fa-eye" />,
                Cell: props => {
                    return <button className="btn btn-xs btn-success"
                        onClick={() => this.props.history.push(`/book-tour-detail/${props.original.code}`)}
                        title="chi tiết" >
                        <i className="fa fa-eye" />
                    </button>;
                },
                style: { textAlign: 'center' },
                width: 100,
                maxWidth: 100,
                minWidth: 100
            }
        ];
        return (
            <div style={{ height: '100vh' }} className="content-wrapper">

                {this.state.success && <SweetAlert
                    success
                    title="Lưu Thành Công"
                    onConfirm={this.hideSuccessAlert}>
                    Tiếp Tục...
                </SweetAlert>}

                {this.state.error && <SweetAlert
                    warning
                    confirmBtnText="Cancel"
                    confirmBtnBsStyle="default"
                    title="Đã Có Lỗi Xảy Ra!"
                    onConfirm={this.hideFailAlert}>
                    Vui Lòng Kiểm Tra Lại...
                </SweetAlert>}

                <section className="content-header">
                    <h1> Danh Sách Cần Thanh Toán </h1>
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
                                                    columns={columns}
                                                    // data={this.handleSearchProvince(this.props.listProvinces, this.state.keySearch)}
                                                    data={this.state.listPhoneCall}
                                                    defaultPageSize={10}
                                                    noDataText={'Please wait...'} >
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

const mapStateToProps = (state) => {
    return {
        listProvinces: state.listProvinces,
        listCountries: state.listCountries
    }
}

const mapDispatchToProps = (dispatch, action) => {
    return {
        getlistProvinces: (provinces) => dispatch(actions.getListProvinces(provinces)),
        updateProvince: (province) => dispatch(actions.updateProvince(province)),
        createProvince: (province) => dispatch(actions.createProvince(province)),
        getListCountries: (countries) => dispatch(actions.getListCountries(countries))
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListProvinceComponent));