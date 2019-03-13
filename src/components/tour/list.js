import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import * as actions from './../../actions/index';

import { apiGet } from '../../services/api';

class ListTourComponent extends Component {

    async componentDidMount() {
        if (!this.props.listTour) {
            try {
                let listTour = await apiGet('/tour/getAllWithoutPagination');
                this.props.getListTour(listTour.data.data);
            } catch (error) {
                console.log(error);
            }
        }

    }

    handleCreatetour = (event) => {
        event.preventDefault();
        this.props.history.push("/tour/create")
    }

    handleEditTour = async (id) => {
        try {
            const tourDetail = await apiGet(`/tour/getById/${id}`);
            this.props.getTourById(tourDetail.data.data);
            this.props.history.push(`/tour/edit/${id}`);
        } catch (error) {
            console.log(error)
        }
    }

    render() {
        const columns = [
            {
                Header: "NAME",
                accessor: "name",
                sortable: true,
                filterable: true,
                style: {
                    textAlign: 'center'
                }
            },
            {
                Header: props => <i className="fa fa-pencil" />,
                Cell: props => {
                    return (
                        <button className="btn btn-success"
                            onClick={() => this.handleEditTour(props.original.id)}
                        >
                            <i className="fa fa-pencil" />
                        </button>
                    )
                },
                sortable: false,
                filterable: false,
                style: {
                    textAlign: 'center'
                },
                width: 130,
                maxWidth: 130,
                minWidth: 130
            }
        ];
        return (
            <div className="content-wrapper">
                <section className="content-header">
                    <h1>
                        List Tour
                    </h1>
                </section>
                <section className="content">
                    <div className="row">
                        <button
                            onClick={this.handleCreatetour}
                            style={{
                                marginBottom: '2px',
                                marginRight: '15px'
                            }}
                            type="button"
                            className="btn btn-success pull-right">
                            <i className="fa fa-plus" />&nbsp;Create
                        </button>
                    </div>

                    <ReactTable
                        columns={columns}
                        data={this.props.listTour ? this.props.listTour : []}
                        defaultPageSize={10}
                        noDataText={'Please wait...'}
                    >
                    </ReactTable>
                </section>
            </div>
        );
    }
}

// export default withRouter(ListTourComponent);
const mapStateToProps = (state) => {
    return {
        info: state.infoLocation,
        allType: state.allType,
        allLocation: state.allLocation,
        listTour: state.listTour,
    }
}

const mapDispatchToProps = (dispatch, action) => {
    return {
        changeLocationInfo: (info) => dispatch(actions.changeLocationInfo(info)),
        getAllType: (type) => dispatch(actions.getAllType(type)),
        getAllLocation: (locations) => dispatch(actions.getAllLocation(locations)),
        createType: (type) => dispatch(actions.createType(type)),
        editType: (type) => dispatch(actions.editType(type)),
        getListTour: (tour) => dispatch(actions.getListTour(tour)),
        getTourById: (tour) => dispatch(actions.getTourById(tour))
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListTourComponent));