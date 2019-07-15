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
import { sortRoute } from './../../helper';
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
            success: false,
            error: false,
            openModal: false,
            listRoutes: null,
            tempRoutes: [],

            currentFeatureImage: null,

            newFeatureImage: [],
            newPreviewFeatureImage: null,

            tourDetail: null,
            modalListImages: false,

            currentListImages: [],
            tempCurrentListImages: [],
            deletedImagesList: [],
            tempDeletedImagesList: [],

            newListImages: [],
            newPreviewImages: [],
            typeTour: 0
        }
    }

    componentDidMount = async () => {
        let listRoute = null;
        if (!listRoute) {
            listRoute = await apiGet('/route/getAllNotHaveTour');
            listRoute = listRoute.data.data
        }
        let tourDetail = this.props.tourDetail;
        if (!tourDetail) {
            const id = this.props.match.params.id;
            try {
                tourDetail = await apiGet(`/tour/getById/${id}`);
                tourDetail = tourDetail.data.data;
                console.log(tourDetail);
                await this.props.getTourById(tourDetail);
            } catch (error) {
                console.log(error);
            }
        }
        this.updateState(listRoute, tourDetail);
    }
    updateState = (listRoute, tourDetail) => {
        console.log(tourDetail.featured_img);
        this.setState({
            listRoute: [...tourDetail.routes, ...listRoute],
            routes: [...tourDetail.routes],
            tempRoutes: [...tourDetail.routes],
            tourDetail: tourDetail,
            name: tourDetail.name,
            currentFeatureImage: tourDetail.featured_img ? tourDetail.featured_img : '',
            policy: tourDetail.policy,
            desc: tourDetail.description,
            detail: tourDetail.detail,
            currentListImages: [...tourDetail.tour_images],
            tempCurrentListImages: [...tourDetail.tour_images],
            newListImages: [],
            newPreviewImages: [],
            tempNewListImages: [],
            tempNewPreviewImages: [],
            typeTour: tourDetail.fk_type_tour
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

    handleChangeDesc = (model) => {
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

    checkTour = () => {
        const { name, desc, routes, currentFeatureImage, newFeatureImage } = this.state;
        if (name !== '' && desc !== '' && routes.length && (currentFeatureImage || newFeatureImage.length)) {
            return true;
        }
        return false;
    }

    handleSave = async () => {
        if (this.checkTour()) {
            try {
                const { name, desc, routes, currentFeatureImage, newFeatureImage, tourDetail, deletedImagesList, newListImages, detail, policy } = this.state;
                let form = new FormData();
                form.append('id', tourDetail.id)
                form.append('name', name);
                console.log(newFeatureImage);
                if (newFeatureImage.length) {
                    console.log(newFeatureImage[0]);
                    form.append('featured_image', newFeatureImage[0], 'name.jpg');
                }
                if (deletedImagesList.length) {
                    form.append('deleted_images', JSON.stringify(deletedImagesList));
                }
                if (newListImages.length) {
                    newListImages.forEach(item => {
                        form.append('new_images', item);
                    });
                }
                form.append('policy', policy);
                form.append('detail', detail);
                form.append('fk_type_tour', this.state.typeTour);
                form.append('description', desc);
                form.append('routes', JSON.stringify(routes));
                const tour = await apiPost('/tour/updateWithRoutesAndListImage', form);
                // console.log(tour);
                if(!this.state.listTour) {
                    try {
                        let listTour = await apiGet('/tour/getAllWithoutPagination');
                        this.props.getListTour(listTour.data.data);
                    } catch (error) {
                        console.log(error);
                    }
                } else {
                    this.props.editTour({
                        id: tour.data.data.id,
                        name: tour.data.data.name
                    });
                }
                this.setState({
                    success: true
                });
            } catch (error) {
                this.setState({
                    error: true
                });
            }
        }
    }

    hideSuccessAlert = () => {
        this.props.history.push('/tour/list');
    }

    hideFailAlert = () => {
        this.setState({ error: false });
    }
    openModal = () => {
        this.addOpacityBody();
        this.setState({ openModal: true });
    }
    closeModal = () => {
        this.removeOpacityBody();
        this.setState({
            openModal: false,
            tempRoutes: [...this.state.routes]
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
        this.removeOpacityBody();
        this.setState({
            routes: [...this.state.tempRoutes],
            openModal: false
        })
    }
    handleDelete = (props) => {
        const id = props.original.id;
        const indexRoute = _.findIndex(this.state.routes, (item) => item.id === id);
        if (indexRoute !== -1) {
            this.state.routes.splice(indexRoute, 1);
        }
        this.setState({
            tempRoutes: [...this.state.routes],
            routes: [...this.state.routes]
        });
    }

    handleChangeImage = (event) => {
        let file = event.target.files[0];
        event.target.value = null;
        // if (file.size > 1024 * 1024) {
        //     return;
        // }
        let reader = new FileReader();
        reader.onloadend = () => {
            this.setState({
                newFeatureImage: [file],
                newPreviewFeatureImage: reader.result
            });
        }
        reader.readAsDataURL(file)
    }
    openModalListImages = (event) => {
        this.addOpacityBody();
        event.preventDefault();
        this.setState({
            modalListImages: true
        })
    }

    closeModalListImages = () => {
        this.removeOpacityBody();
        this.setState({
            modalListImages: false,
            tempCurrentListImages: [...this.state.currentListImages],
            tempDeletedImagesList: [...this.state.deletedImagesList],
            tempNewListImages: [...this.state.newListImages],
            tempNewPreviewImages: [...this.state.newPreviewImages]
        })
    }

    handleChangeListImages = (event) => {
        let files = Array.from(event.target.files);
        if (files.length) {
            // files.forEach((item, index) => {
            //     if (item.size > 1024 * 1024) {
            //         return;
            //     }
            // });
            event.target.value = null;
            files.forEach(item => {
                let reader = new FileReader();
                reader.onloadend = () => {
                    this.setState({
                        newListImages: [...this.state.newListImages, item],
                        newPreviewImages: [...this.state.newPreviewImages, reader.result],
                        tempNewListImages: [...this.state.tempNewListImages, item],
                        tempNewPreviewImages: [...this.state.tempNewPreviewImages, reader.result]
                    })
                };
                reader.readAsDataURL(item);
            });

        }
    }

    deleteCurrentImage = (event, index) => {
        event.preventDefault();
        this.state.tempDeletedImagesList.push(this.state.tempCurrentListImages[index]);
        this.state.tempCurrentListImages.splice(index, 1);
        this.setState({
            tempDeletedImagesList: [...this.state.tempDeletedImagesList],
            tempCurrentListImages: [...this.state.tempCurrentListImages]
        })
    }

    handleComfirmChangeImages = () => {
        this.removeOpacityBody();
        this.setState({
            currentListImages: [...this.state.tempCurrentListImages],
            deletedImagesList: [...this.state.tempDeletedImagesList],
            modalListImages: false,
            newListImages: [...this.state.tempNewListImages],
            newPreviewImages: [...this.state.tempNewPreviewImages]
        })
    }

    deleteNewImage = (event, index) => {
        event.preventDefault();
        this.state.tempNewListImages.splice(index, 1);
        this.state.tempNewPreviewImages.splice(index, 1);
        this.setState({
            tempNewListImages: [...this.state.tempNewListImages],
            tempNewPreviewImages: [...this.state.tempNewPreviewImages]
        });
    }

    handleRefreshFeatureImage = () => {
        this.setState({
            newPreviewFeatureImage: null,
            newFeatureImage: []
        })
    }

    addOpacityBody = () => {
        document.body.classList.toggle('no-scroll');
    }

    removeOpacityBody = () => {
        document.body.classList.remove('no-scroll');
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
                <section className="content-header content-header-page">
                    <h1> Chỉnh Sửa Tour <i>#{this.props.match.params.id}</i> </h1>
                </section>
                <section className={`content ${(this.state.openModal || this.state.modalListImages) ? 'opacity-05' : ''}`}>
                    <div className="row">
                        <button
                            onClick={this.handleSave}
                            style={{
                                marginBottom: '2px',
                                marginRight: '15px',
                                position: 'relative'
                            }}
                            type="button"
                            className="btn btn-success pull-right">
                            <i className="fa fa-save" />&nbsp;Lưu Thay Đổi
                        </button>
                    </div>
                    <div className="row">
                        <div className="col-lg-5 col-xs-5">
                            <div className="box box-primary">
                                <form role="form">
                                    <div className="box-body">
                                        <div className="form-group">
                                            <label htmlFor="exampleInputEmail1">Tên (*)</label>
                                            <input onChange={this.onHandleChange} value={this.state.name} name="name" type="text" className="form-control" />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="exampleInputEmail1">Loại Tour (*)</label>
                                            <select value={this.state.typeTour} onChange={this.onHandleChange} name="typeTour" className="form-control">
                                                <option value="1">Trong nước</option>
                                                <option value="2">Quốc tế</option>
                                            </select>
                                        </div>
                                        <div style={{ height: '300px' }} className="form-group">
                                            <label>Ảnh đại diện (*)</label>
                                            <input onChange={this.handleChangeImage} type="file" id="exampleInputFile" />
                                            <div className="gallery w-100">
                                                <div className="container-image">
                                                    {this.state.newPreviewFeatureImage ?
                                                        <img style={{ width: '100%', height: '250px' }} src={this.state.newPreviewFeatureImage} /> :
                                                        (this.state.currentFeatureImage ?
                                                            <img style={{ width: '100%', height: '250px' }} src={this.state.currentFeatureImage} /> :
                                                            <img style={{ width: '100%', height: '250px' }} src="http://denrakaev.com/wp-content/uploads/2015/03/no-image-800x511.png" />
                                                        )
                                                    }
                                                    {/* {this.state.currentFeatureImage ?
                                                        <img style={{ width: '100%', height: '250px' }} src={this.state.currentFeatureImage} /> :
                                                        <img style={{ width: '100%', height: '250px' }} src="http://denrakaev.com/wp-content/uploads/2015/03/no-image-800x511.png" />
                                                    } */}
                                                    <div className="topright-image">
                                                        {this.state.newPreviewFeatureImage ?
                                                            <i onClick={this.handleRefreshFeatureImage} title="refresh" className="fa fa-refresh refresh-icon" />
                                                            : null}
                                                    </div>
                                                </div>
                                            </div>
                                        </div><br />
                                        <div className="form-group">
                                            <label>Danh sách ảnh</label>
                                            <button onClick={this.openModalListImages} className="pull-right btn btn-default">
                                                <i className="fa fa-pencil" />
                                            </button>
                                            <input onChange={this.handleChangeListImages} type="file" multiple />
                                        </div>
                                        <div className="form-group">
                                            <label>Policy</label>
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
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="col-lg-7 col-xs-7">
                            <div className="box box-primary">
                                <form role="form">
                                    <div className="box-body">
                                        {/* <div className="form-group">
                                            <label>Detail</label>
                                            <FroalaEditor
                                                config={{
                                                    placeholderText: '',
                                                    heightMax: 120,
                                                    heightMin: 120,
                                                    toolbarButtons: configEditor.policy,
                                                }}
                                                model={this.state.detail}
                                                onModelChange={this.handleChangeDetail}
                                            />
                                        </div> */}
                                        <div className="form-group">
                                            <label>Mô tả (*)</label>
                                            <FroalaEditor
                                                config={{
                                                    heightMax: 362,
                                                    heightMin: 362,
                                                    placeholderText: '',
                                                    toolbarButtons: configEditor.description,
                                                    imageUploadParam: 'file',
                                                    imageUploadURL: `http://localhost:5000/admin/upload_image`,
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

                {this.state.modalListImages &&
                    <div className="example-modal">
                        <div className="modal">
                            <div className="modal-dialog modal-size">
                                <div className="modal-content opacity-1">
                                    <div className="modal-header">
                                        <button onClick={this.closeModalListImages} type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">×</span></button>
                                        <h4 className="modal-title">List Images</h4>
                                    </div>
                                    <div className="modal-body height-images">
                                        {this.state.tempCurrentListImages.length &&
                                            this.state.tempCurrentListImages.map((item, index) => {
                                                return (
                                                    <div key={index} style={{ width: '300px', height: '270px' }} className="gallery">
                                                        <div className="container-image">
                                                            <img src={item.name} alt="Cinque Terre" width="300" height="300" />
                                                            <div className="topright-image">
                                                                <i onClick={(event) => this.deleteCurrentImage(event, index)} className="fa fa-times-circle-o delete-icon" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }

                                        {this.state.tempNewPreviewImages.length &&
                                            this.state.tempNewPreviewImages.map((item, index) => {
                                                return (
                                                    <div key={index} style={{ width: '300px', height: '270px' }} className="gallery">
                                                        <div className="container-image">
                                                            <img src={item} alt="Cinque Terre" width="300" height="300" />
                                                            <div className="topright-image">
                                                                <i onClick={(event) => this.deleteNewImage(event, index)} className="fa fa-times-circle-o delete-icon" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }

                                    </div>
                                    <div className="modal-footer">
                                        <button onClick={this.closeModalListImages} type="button" className="btn btn-default pull-left" data-dismiss="modal">Close</button>
                                        <button onClick={this.handleComfirmChangeImages} type="button" className="btn btn-primary">Confirm</button>
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
        getListTypeLocation: (type) => dispatch(actions.getListTypeLocation(type)),
        getListLocation: (locations) => dispatch(actions.getListLocation(locations)),
        createType: (type) => dispatch(actions.createType(type)),
        editType: (type) => dispatch(actions.editType(type)),
        getListTour: (tour) => dispatch(actions.getListTour(tour)),
        getListRoute: (route) => dispatch(actions.getListRoute(route)),
        getTourById: (tour) => dispatch(actions.getTourById(tour)),
        editTour: (tour) => dispatch(actions.editTour(tour)),
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListTypesComponent));