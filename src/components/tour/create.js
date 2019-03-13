import 'froala-editor/js/froala_editor.pkgd.min.js';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import 'react-table/react-table.css';
// import Modal from 'react-bootstrap-modal';
import * as actions from './../../actions/index';
import { URL } from '../../constants/url';
import axios from 'axios';
// import { EditorState, convertToRaw, ContentState } from 'draft-js';
import _ from 'lodash';
import moment from 'moment';
import DatePicker from "react-datepicker";
import TimePicker from 'react-time-picker';
import './create.css';

import "react-datepicker/dist/react-datepicker.css";
// Require Font Awesome.
import 'font-awesome/css/font-awesome.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';

import FroalaEditor from 'react-froala-wysiwyg';
import SuccessNotify from '../notification/success';
import 'react-notifications/lib/notifications.css';
import { useAlert } from "react-alert";
import { configEditor } from './config';
import Route from './route';
import SweetAlert from 'react-bootstrap-sweetalert';

import { helper } from '../../helper';
import ReactTable from 'react-table';
import { apiGet, apiPost } from '../../services/api';
import {sortRoute} from './../../helper';
import stateManager from 'react-select/lib/stateManager';



class ListTypesComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            routes: [],
            price: '',
            name: '',
            desc: '',
            policy: '',
            detail: '',
            isPlus: false,
            errorTour: false,
            errorsRoute: [],
            success: false,
            error: false,
            openModal: false,
            listRoutes: null,
            tempRoutes: []
        }
    }

    componentDidMount = async () => {
        let listRoute = this.props.listRoute;
        if (!listRoute) {
            listRoute = await apiGet('/route/getAll');
            console.log(listRoute.data.data);
            listRoute = listRoute.data.data
            await this.props.getListRoute(listRoute);
        }
        this.updateState(listRoute);
    }

    updateState = (listRoute) => {
        this.setState({
            listRoute: listRoute
        })
    }


    checkTour = () => {
        const tour = this.state;
        if (tour.routes[0] !== '' && tour.name !== '' && tour.desc !== '' && Number.isInteger(parseInt(tour.price)) && parseInt(tour.price) > 0) {
            return true;
        }
        return false;
    }

    checkRoutes = () => {
        const routes = this.state.routes;
        let errors = [];
        for (let i = 0; i < routes.length; i++) {
            if (routes[i] === '') {
                errors = [...errors, i];
            }
            if (routes[i + 1]) {
                if (routes[i].day === routes[i + 1].day) {
                    if (routes[i].leaveTime > routes[i + 1].arriveTime) {
                        errors = [...errors, i, i + 1];
                    }
                }
                if (routes[i].day > routes[i + 1].day) {
                    errors = [...errors, i, i + 1];
                }
            }
        }
        console.log(routes)
        console.log(errors)
        this.setState({
            errorsRoute: errors
        })

        return errors;
    }

    addRoute = (event) => {
        event.preventDefault();
        this.setState({
            routes: [
                ...this.state.routes,
                ''
            ],
            isPlus: false
        })
    }

    handleChange = (event, index) => {
        this.state.routes[index][event.target.name] = event.target.value;
        this.setState({
            routes: this.state.routes
        })
    }

    onHandleChange = (event) => {
        let target = event.target;
        let name = target.name;
        let value = target.value;
        this.setState({
            [name]: value
        });
    }

    deleteLocation = (event, index) => {
        event.preventDefault();
        let count = 0;
        this.state.routes.forEach((location, index) => {
            if (location) {
                count++;
            }
        })
        if (count > 1) {
            this.state.routes[index] = null;
            this.setState({
                routes: this.state.routes
            })
        }
    }

    handleChangeStartDate = (date) => {
        this.setState({
            startDate: date
        })
    }

    handleChangeEndDate = (date) => {
        // console.log(moment(date).format('YYYY-MM-DD'));
        this.setState({
            endDate: date
        })
    }

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };

    handleChangeDesc = (model) => {
        console.log(model)
        this.setState({
            desc: model
        });
    }

    handleChangePolicy = (model) => {
        this.setState({
            policy: model
        });
    }

    handleChangeDetail = (model) => {
        this.setState({
            detail: model
        });
    }

    handleChangeRoute = (data) => {
        this.state.routes[data.index] = data.data;
        this.setState({
            routes: this.state.routes,
            isPlus: true
        })
    }

    handleDeleteRoute = (index) => {
        if (this.state.routes.length > 1) {
            this.state.routes.splice(index, 1);
            this.setState({
                routes: this.state.routes
            })
        }
    }

    handleSave = async () => {
        const errors = this.checkRoutes();
        console.log(this.state);
        if (this.checkTour() && errors.length === 0) {
            console.log('save tour success')
            try {
                let createTour = await axios.post(`${URL}/tour/create`, {
                    name: this.state.name,
                    price: this.state.price,
                    policy: this.state.policy,
                    description: this.state.desc,
                    detail: this.state.detail,
                    routes: this.state.routes
                });
                console.log(createTour);
            } catch (error) {
                this.setState({
                    error: true
                })
            }
            this.setState({
                errorTour: false,
                success: true
            })
        } else {
            this.setState({
                errorTour: this.checkTour() ? false : true,
                error: true
            })
        }
    }

    disablePlusBtn = () => {
        this.setState({
            isPlus: false
        })
    }

    hideSuccessAlert = () => {
        this.props.history.push('/tour/list');
    }

    hideFailAlert = () => {
        console.log('error')
        this.setState({
            error: false
        });
    }
    openModal = () => {
        this.setState({
            openModal: true
        });
    }
    closeModal = () => {
        this.setState({
            openModal: false
        });
    }
    handleChangeSelect = (props) => {
        const index = _.findIndex(this.state.tempRoutes, (item) => {
            return item.id === props.original.id;
        });
        if (index !== -1) {
            this.state.tempRoutes.splice(index, 1);
        } else {
            this.state.tempRoutes.push(props.original);
        }
        this.setState({
            tempRoutes: [...this.state.tempRoutes]
        });
    }
    handleSaveChanges = () => {
        this.setState({
            routes: [...this.state.tempRoutes],
            openModal: false
        })
    }
    handleDelete = (props) => {
        const id = props.original.id;
        const indexTempRoute = _.findIndex(this.state.tempRoutes, (item) => item.id === id);
        if(indexTempRoute !== -1){
            this.state.tempRoutes.splice(indexTempRoute, 1);
        }
        const indexRoute = _.findIndex(this.state.routes, (item) => item.id === id);
        if(indexRoute !== -1){
            this.state.routes.splice(indexRoute, 1);
        }
        this.setState({
            tempRoutes: [...this.state.tempRoutes],
            routes: [...this.state.routes]
        });
    }
    render() {
        const columns = [
            {
                Header: "ID",
                accessor: "id",
                sortable: false,
                filterable: false,
                style: {
                    textAlign: 'center'
                },
                width: 100,
                maxWidth: 100,
                minWidth: 100
            },
            {
                Header: "TITLE",
                accessor: "title",
                sortable: false,
                filterable: false,
                style: {
                    textAlign: 'center'
                }
            },
            {
                Header: "LOCATION",
                accessor: "location.name",
                sortable: false,
                filterable: false,
                style: {
                    textAlign: 'center'
                }
            },
            {
                Header: "ARRIVE TIME",
                accessor: "arrive_time",
                sortable: false,
                filterable: false,
                style: {
                    textAlign: 'center'
                },
                width: 120,
                maxWidth: 120,
                minWidth: 120
            },
            {
                Header: "LEAVE TIME",
                accessor: "leave_time",
                sortable: false,
                filterable: false,
                style: {
                    textAlign: 'center'
                },
                width: 120,
                maxWidth: 120,
                minWidth: 120
            },
            {
                Header: "DAY",
                accessor: "day",
                sortable: false,
                filterable: false,
                style: {
                    textAlign: 'center'
                },
                width: 100,
                maxWidth: 100,
                minWidth: 100
            },
            {
                Header: props => <i className="fa fa-trash" />,
                Cell: props => {
                    return (
                        <button className="btn btn-danger"
                            onClick={() => this.handleDelete(props)}
                        >
                            <i className="fa fa-trash" />
                        </button>
                    )
                },
                sortable: false,
                filterable: false,
                style: {
                    textAlign: 'center'
                },
                width: 100,
                maxWidth: 100,
                minWidth: 100
            }
        ];
        const columnModal = [
            {
                Header: props => <i className="fa fa-check-square" />,
                Cell: props => {
                    let index = _.findIndex(this.state.tempRoutes, (item) => {
                        return item.id === props.original.id;
                    });
                    return (
                        <div className="checkbox checkbox-modal">
                            <input
                                className="input-modal"
                                type="checkbox"
                                name="choose"
                                onChange={() => this.handleChangeSelect(props)}
                                checked={index === -1 ? false : true}
                            />
                        </div>
                    )
                },
                sortable: false,
                filterable: false,
                style: {
                    textAlign: 'center'
                },
                width: 100,
                maxWidth: 100,
                minWidth: 100
            },
            {
                Header: "ID",
                accessor: "id",
                sortable: false,
                filterable: true,
                style: {
                    textAlign: 'center'
                },
                width: 100,
                maxWidth: 100,
                minWidth: 80
            },
            {
                Header: "TITLE",
                accessor: "title",
                sortable: false,
                filterable: true,
                style: {
                    textAlign: 'center'
                },
                width: 100,
                maxWidth: 100,
                minWidth: 80
            },
            {
                Header: "LOCATION",
                accessor: "location.name",
                sortable: false,
                filterable: true,
                style: {
                    textAlign: 'center'
                }
            },
            {
                Header: "ARRIVE TIME",
                accessor: "arrive_time",
                sortable: false,
                filterable: false,
                style: {
                    textAlign: 'center'
                },
                width: 120,
                maxWidth: 120,
                minWidth: 120
            },
            {
                Header: "LEAVE TIME",
                accessor: "leave_time",
                sortable: false,
                filterable: false,
                style: {
                    textAlign: 'center'
                },
                width: 120,
                maxWidth: 120,
                minWidth: 120
            },
            {
                Header: "DAY",
                accessor: "day",
                sortable: false,
                filterable: false,
                style: {
                    textAlign: 'center'
                },
                width: 100,
                maxWidth: 100,
                minWidth: 100
            }
        ];
        console.log(this.state.routes);
        return (
            <div className="content-wrapper">
                {this.state.success &&
                    <SweetAlert success title="Successfully" onConfirm={this.hideSuccessAlert}>
                        hihihehehaha
                    </SweetAlert>
                }
                {this.state.error &&
                    <SweetAlert
                        warning
                        confirmBtnText="Cancel"
                        confirmBtnBsStyle="default"
                        title="Fail!!!!!"
                        onConfirm={this.hideFailAlert}
                    >
                        Please check carefully!
                    </SweetAlert>
                }
                <section className="content-header">
                    <h1>
                        Create Tour
                    </h1>
                </section>
                <section className={`content ${this.state.openModal ? 'opacity-05' : ''}`}>
                    <div className="row">
                        <button
                            onClick={this.handleSave}
                            style={{
                                marginBottom: '2px',
                                marginRight: '15px'
                            }}
                            type="button"
                            className="btn btn-success pull-right">
                            <i className="fa fa-save" />&nbsp;Save
                        </button>
                    </div>
                    <div className="row">
                        <div className="col-lg-5 col-xs-5">
                            <div className={`box box-primary ${this.state.errorTour ? 'bd-red' : ''}`}>
                                <form role="form">
                                    <div className="box-body">
                                        <div className="form-group">
                                            <label htmlFor="exampleInputEmail1">Tên (*)</label>
                                            <input onChange={this.onHandleChange} value={this.state.name} name="name" type="text" className="form-control" />
                                        </div>
                                        <div className="form-group">
                                            <label>Giá (*)</label>
                                            <input onChange={this.onHandleChange} value={this.state.price} name='price' type="number" className="form-control" />
                                        </div>
                                        <div className="form-group">
                                            <label>Quy định hủy tour</label>
                                            <FroalaEditor
                                                config={{
                                                    placeholderText: '',
                                                    heightMin: 150,
                                                    heightMax: 150,
                                                    toolbarButtons: configEditor.policy,
                                                }}
                                                model={this.state.policy}
                                                onModelChange={this.handleChangePolicy}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Chú thích</label>
                                            <FroalaEditor
                                                config={{
                                                    placeholderText: '',
                                                    heightMax: 150,
                                                    heightMin: 150,
                                                    toolbarButtons: configEditor.policy,
                                                }}
                                                model={this.state.detail}
                                                onModelChange={this.handleChangeDetail}
                                            />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="col-lg-7 col-xs-7">
                            <div className="box box-primary">
                                <form role="form">
                                    <div className="box-body">
                                        <div className="form-group">
                                            <label>Mô tả tour (*)</label>
                                            <FroalaEditor
                                                config={{
                                                    heightMax: 488,
                                                    heightMin: 488,
                                                    placeholderText: '',
                                                    toolbarButtons: configEditor.description,
                                                    imageUploadParam: 'file',
                                                    imageUploadURL: 'http://localhost:5000/admin/upload_image',
                                                    imageUploadParams: { id: 'my_editor' },
                                                    imageUploadMethod: 'POST',
                                                    imageMaxSize: 5 * 1024 * 1024,
                                                    imageAllowedTypes: ['jpeg', 'jpg', 'png'],
                                                    events: {
                                                        'froalaEditor.image.uploaded': (e, editor, response) => {
                                                            response = JSON.parse(response);
                                                            console.log(response.link.replace('/public', ''))
                                                            editor.image.insert(`http://localhost:5000${response.link.replace('/public', '')}`, true, null, editor.image.get(), null)
                                                            return false
                                                        }
                                                    }

                                                }}
                                                model={this.state.desc}
                                                onModelChange={this.handleChangeDesc}
                                            />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <button
                            onClick={this.openModal}
                            style={{
                                marginBottom: '2px',
                                marginRight: '15px'
                            }}
                            type="button"
                            className="btn btn-success pull-right">
                            <i className="fa fa-plus" />&nbsp;Add
                        </button>
                    </div>
                    <div className="row">
                        <div className="form-group">
                            <ReactTable
                                columns={columns}
                                data={this.state.routes.length ? this.state.routes : []}
                                defaultPageSize={5}
                                noDataText={'No data...'}
                            >
                            </ReactTable>
                        </div>
                    </div>

                </section>
                {this.state.openModal &&
                    <div className="example-modal">
                        <div className="modal">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <button onClick={this.closeModal} type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">×</span></button>
                                        <h4 className="modal-title">Create Type</h4>
                                    </div>
                                    <div className="modal-body">
                                        <ReactTable
                                            columns={columnModal}
                                            data={this.state.listRoute ? this.state.listRoute : []}
                                            defaultPageSize={5}
                                            noDataText={'No data...'}
                                        >
                                        </ReactTable>
                                    </div>
                                    <div className="modal-footer">
                                        <button onClick={this.closeModal} type="button" className="btn btn-default pull-left" data-dismiss="modal">Close</button>
                                        <button onClick={this.handleSaveChanges} type="button" className="btn btn-primary">Save changes</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }

            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        info: state.infoLocation,
        allType: state.allType,
        allLocation: state.allLocation,
        listTour: state.listTour,
        listRoute: state.listRoute
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
        getListRoute: (route) => dispatch(actions.getListRoute(route))
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListTypesComponent));