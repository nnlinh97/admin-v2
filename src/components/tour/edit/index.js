import 'froala-editor/js/froala_editor.pkgd.min.js';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import 'react-table/react-table.css';
import * as actions from './../../../actions/index';
import _ from 'lodash';
import moment from 'moment';
import randomstring from 'randomstring';
import DatePicker from "react-datepicker";
import TimePicker from 'react-time-picker';
import "react-datepicker/dist/react-datepicker.css";
import 'font-awesome/css/font-awesome.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';

import FroalaEditor from 'react-froala-wysiwyg';
import { useAlert } from "react-alert";
import { configEditor } from './../config';
import SweetAlert from 'react-bootstrap-sweetalert';
import Modal from 'react-responsive-modal';
import { helper } from '../../../helper';
import ReactTable from 'react-table';
import { apiGet, apiPost } from '../../../services/api';
import { sortRoute } from './../../../helper';
import CreateRouteComponent from './modal-create';
import EditRouteComponent from './modal-edit';
import ListImageComponent from './modal-list-image';
import stateManager from 'react-select/lib/stateManager';
import './index.css';

class ListTypesComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            routes: [],
            name: '',
            desc: '',
            policy: '',
            success: false,
            error: false,
            tempRoutes: [],
            image: [],
            featuredImg: '',
            featuredImgTemp: '',
            listImages: [],
            listImagesNew: [],
            listImagesPreviview: [],
            typeTour: '',
            modalCreateRouteIsOpen: false,
            modalEditRouteIsOpen: false,
            modalListImageIsOpen: false,
            routeEdit: null
        }
    }

    componentDidMount = async () => {
        const id = this.props.match.params.id;
        try {
            const tourDetail = await apiGet(`/tour/getById/${id}`);
            this.updateState(tourDetail.data.data);
        } catch (error) {
            console.log(error);
        }
    }

    updateState = (tourDetail) => {
        console.log(tourDetail);
        this.setState({
            name: tourDetail.name,
            typeTour: tourDetail.fk_type_tour,
            id: tourDetail.id,
            policy: tourDetail.policy ? tourDetail.policy : '',
            featuredImg: tourDetail.featured_img,
            listImages: tourDetail.tour_images,
            desc: tourDetail.description,
            routes: tourDetail.routes
        });
    }

    onHandleChange = (event) => {
        let target = event.target;
        let name = target.name;
        let value = target.value;
        this.setState({ [name]: value });
    }

    handleChangeDesc = (model) => {
        this.setState({ desc: model });
    }

    handleChangePolicy = (model) => {
        this.setState({ policy: model });
    }

    checkTour = () => {
        const { name, desc, routes } = this.state;
        if (name !== '' && desc !== '' && routes.length) {
            return true;
        }
        return false;
    }

    handleSave = async () => {
        if (this.checkTour()) {
            const { name, image, detail, policy, desc, routes, listImages } = this.state;
            let form = new FormData();
            form.append('name', name);
            form.append('detail', detail);
            form.append('policy', policy);
            form.append('routes', JSON.stringify(routes));
            form.append('description', desc);
            if (image.length) {
                form.append('featured_image', image[0], 'name.jpg');
            }
            if (listImages.length) {
                listImages.forEach((item) => {
                    form.append('list_image', item.item);
                });
            }
            try {
                let newTour = await apiPost('/tour/createWithRoutesAndListImage', form);
                newTour = newTour.data;
                if (!this.props.listTour) {
                    try {
                        let listTour = await apiGet('/tour/getAllWithoutPagination');
                        await this.props.getListTour(listTour.data.data);
                    } catch (error) {
                        console.log(error);
                    }
                } else {
                    await this.props.createTour({
                        id: newTour.id,
                        name: newTour.name,
                    });
                }
                this.setState({
                    success: true
                })
            } catch (error) {
                this.setState({
                    error: true
                });
            }
        } else {
            this.setState({
                error: true
            })
        }
    }

    handleHiddenSuccess = () => {
        this.setState({ success: false, modalCreateRouteIsOpen: false });
    }

    handleHiddenError = () => {
        this.setState({ error: false });
    }

    openModal = () => {
        this.addOpacityBody();
        this.setState({
            openModal: true
        });
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
        this.setState({ routes: [...this.state.routes] });
    }

    handleEdit = ({ original }) => {
        this.setState({ routeEdit: original, modalEditRouteIsOpen: true });
    }

    handleOpenModalListImage = () => {
        this.setState({ modalListImageIsOpen: true });
    }

    handleChangeImage = (event) => {
        let file = event.target.files[0];
        let reader = new FileReader();
        reader.onloadend = () => {
            event.target = null;
            this.setState({
                image: [file],
                featuredImgTemp: reader.result
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
            modalListImages: false
        })
    }

    handleChangeListImages = (event) => {
        let files = Array.from(event.target.files);
        if (files.length) {
            event.target.value = null;
            files.forEach(item => {
                let reader = new FileReader();
                reader.onloadend = () => {
                    this.setState({
                        listImagesNew: [...this.state.listImages, item],
                        listImagesPreviview: [...this.state.listImagesPreviview, reader.result]
                    });
                };
                reader.readAsDataURL(item);
            });

        }
    }
    addOpacityBody = () => {
        document.body.classList.toggle('no-scroll');
    }

    removeOpacityBody = () => {
        document.body.classList.remove('no-scroll');
    }

    deleteImage = (index, status) => {
        if (status === 'new') {
            this.state.listImagesNew.splice(index, 1);
            this.state.listImagesPreviview.splice(index, 1);
            this.setState({
                listImagesNew: [...this.state.listImagesNew],
                listImagesPreviview: [...this.state.listImagesPreviview]
            });
        } else {
            this.state.listImages.splice(index, 1);
            this.setState({ listImages: [...this.state.listImages] });
        }
    }

    openModalRoute = () => {
        this.setState({ modalCreateRouteIsOpen: true });
    }

    closeModalRoute = () => {
        this.setState({ modalCreateRouteIsOpen: false });
    }

    closeModalEditRoute = () => {
        this.setState({ modalEditRouteIsOpen: false, routeEdit: null });
    }

    closeModalListImage = () => {
        this.setState({ modalListImageIsOpen: false });
    }

    handleCreateRoute = (data) => {
        if (data) {
            this.setState({
                routes: [...this.state.routes, { id: randomstring.generate(8), ...data }],
                modalCreateRouteIsOpen: false
            });
        } else {
            this.setState({ error: true });
        }
    }

    handleEditRoute = (data) => {
        if (data) {
            let routes = [...this.state.routes];
            const index = _.findIndex(routes, (route) => {
                return route.id === data.id;
            });
            routes[index] = data;
            this.setState({
                modalEditRouteIsOpen: false,
                routeEdit: null,
                routes: routes
            });
        } else {
            this.setState({ error: true });
        }
    }

    swap = (arr, x, y) => {
        arr.splice(y, 1, arr.splice(x, 1, arr[y])[0]);
        return arr;
    }

    handleUp = (props) => {
        if (props.index === 0) {
            return;
        }
        let routes = [...this.state.routes];
        this.setState({ routes: this.swap(routes, props.index, props.index - 1) });
    }

    handleDown = (props) => {
        if (props.index === this.state.routes.length - 1) {
            return;
        }
        let routes = [...this.state.routes];
        this.setState({ routes: this.swap(routes, props.index, props.index + 1) });
    }

    render() {
        const columns = [
            {
                Header: "STT",
                Cell: props => <p>{props.index + 1}</p>,
                style: { textAlign: 'center' },
                width: 50,
                maxWidth: 55,
                minWidth: 50
            },
            {
                Header: "ID",
                accessor: "location.id",
                sortable: false,
                filterable: false,
                style: { textAlign: 'center' },
                width: 60,
                maxWidth: 60,
                minWidth: 60
            },
            {
                Header: "Địa điểm",
                accessor: "location.name",
                sortable: false,
                filterable: false,
                style: { textAlign: 'center', whiteSpace: 'unset' }
            },
            {
                Header: "Thời gian đến",
                accessor: "arrive_time",
                sortable: false,
                filterable: false,
                style: { textAlign: 'center' },
                width: 120,
                maxWidth: 120,
                minWidth: 120
            },
            {
                Header: "Thời gian đi",
                accessor: "leave_time",
                sortable: false,
                filterable: false,
                style: { textAlign: 'center' },
                width: 120,
                maxWidth: 120,
                minWidth: 120
            },
            {
                Header: "Phương tiện",
                accessor: "transport.name_vn",
                sortable: false,
                filterable: false,
                style: { textAlign: 'center', whiteSpace: 'unset' },
                width: 120,
                maxWidth: 120,
                minWidth: 120
            },
            {
                Header: "Ngày",
                accessor: "day",
                sortable: false,
                filterable: false,
                style: { textAlign: 'center' },
                width: 80,
                maxWidth: 80,
                minWidth: 80
            },
            {
                Header: props => <i className="fa fa-pencil" />,
                Cell: props => {
                    return <button style={{ padding: '1px 7px', marginTop: '5px' }} className="btn btn-info"
                        onClick={() => this.handleEdit(props)} >
                        <i className="fa fa-pencil" />
                    </button>
                },
                sortable: false,
                filterable: false,
                style: { textAlign: 'center' },
                width: 70,
                maxWidth: 70,
                minWidth: 70
            },
            {
                Header: props => <i className="fa fa-sort" />,
                Cell: props => {
                    return <>
                        <button
                            style={{ padding: '0px 7px', position: 'absolute', height: '17px' }}
                            className="btn btn-default"
                            onClick={() => this.handleUp(props)} >
                            <i className="fa fa-sort-asc" />
                        </button>
                        <button
                            style={{ padding: '0px 7px', marginTop: '11px', height: '20px' }}
                            className="btn btn-default"
                            onClick={() => this.handleDown(props)} >
                            <i className="fa fa-sort-desc" />
                        </button>
                        </>
                },
                sortable: false,
                filterable: false,
                style: { textAlign: 'center' },
                width: 70,
                maxWidth: 70,
                minWidth: 70
            },
            {
                Header: props => <i className="fa fa-trash" />,
                Cell: props => {
                    return <button style={{ padding: '1px 7px', marginTop: '5px' }} className="btn btn-danger"
                        onClick={() => this.handleDelete(props)} >
                        <i className="fa fa-trash" />
                    </button>
                },
                sortable: false,
                filterable: false,
                style: { textAlign: 'center' },
                width: 70,
                maxWidth: 70,
                minWidth: 70
            }
        ];
        return (
            <div className="content-wrapper">
                {this.state.success && <SweetAlert
                    success
                    title="Lưu Thành Công"
                    onConfirm={this.handleHiddenSuccess}>
                    Tiếp Tục...
                </SweetAlert>}

                {this.state.error && <SweetAlert
                    warning
                    confirmBtnText="Hủy"
                    confirmBtnBsStyle="default"
                    title="Đã Có Lỗi Xảy Ra!"
                    onConfirm={this.handleHiddenError}>
                    Vui Lòng Kiểm Tra Lại...
                </SweetAlert>}

                <Modal
                    open={this.state.modalCreateRouteIsOpen}
                    onClose={this.closeModalRoute}
                    center
                    styles={{ 'modal': { width: '1280px' } }}
                    blockScroll={true} >
                    <CreateRouteComponent handleCreateRoute={this.handleCreateRoute} />
                </Modal>

                <Modal
                    open={this.state.modalEditRouteIsOpen}
                    onClose={this.closeModalEditRoute}
                    center
                    styles={{ 'modal': { width: '1280px' } }}
                    blockScroll={true} >
                    {this.state.routeEdit && <EditRouteComponent
                        route={this.state.routeEdit}
                        handleEditRoute={this.handleEditRoute}
                    />}
                </Modal>

                <Modal
                    open={this.state.modalListImageIsOpen}
                    onClose={this.closeModalListImage}
                    center
                    styles={{ 'modal': { width: '1280px', maxWidth: '1280px', maxHeight: '670px' } }}
                    blockScroll={true} >
                    <ListImageComponent
                        listImages={this.state.listImages}
                        listImagesPreviview={this.state.listImagesPreviview}
                        deleteImage={this.deleteImage}
                    />
                </Modal>

                <section className="content-header">
                    <h1>Chỉnh Sửa Tour</h1>
                    <div className="right_header">
                        <button
                            onClick={this.handleCreateTour}
                            style={{ marginBottom: '2px', marginRight: '15px' }}
                            type="button"
                            className="btn btn-success pull-right">Lưu Lại
                        </button>
                    </div>
                </section>
                <section className="content">
                    <div className="row row_1">
                        <div className="left_row_1">
                            <div className="tour">
                                <label className="title_row">Tour *</label>
                                <input onChange={this.onHandleChange} value={this.state.name} name="name" type="text" className="form-control" />
                            </div>
                            <div className="type_tour">
                                <label className="title_row">Loại tour *</label>
                                <select value={this.state.typeTour} onChange={this.onHandleChange} name="typeTour" className="form-control">
                                    <option value="1">Trong nước</option>
                                    <option value="2">Quốc tế</option>
                                </select>
                            </div>
                            <div>
                                <label className="title_row">Ảnh đại diện *</label>
                                <input id="upload-image" className="upload_image_create_tour" onChange={this.handleChangeImage} type="file" /><br />
                                <div className="inputImage">
                                    {this.state.featuredImgTemp !== '' ?
                                        <img src={this.state.featuredImgTemp} /> :
                                        (this.state.featuredImg !== '' ?
                                            <div className="cover_image_of_tour">
                                                <img src={this.state.featuredImg} />
                                                <i class="fa fa-times" aria-hidden="true"></i>
                                            </div>
                                             :
                                            <img src="http://denrakaev.com/wp-content/uploads/2015/03/no-image-800x511.png" />
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="right_row_1">
                            <label className="title_row">Qui định</label>
                            <FroalaEditor
                                config={{
                                    placeholderText: '',
                                    heightMin: 425,
                                    heightMax: 425,
                                    toolbarButtons: configEditor.policy,
                                }}
                                model={this.state.policy}
                                onModelChange={this.handleChangePolicy}
                            />
                        </div>
                    </div>
                    <div className="row row_2">
                        <label className="title_row">Danh sách hình ảnh</label>
                        <input className="upload_image_create_tour" onChange={this.handleChangeListImages} type="file" multiple />
                        <i
                            style={{ cursor: 'pointer' }}
                            onClick={this.handleOpenModalListImage}
                            class="fa fa-picture-o icon_show_pop_up"
                            title="Xem danh sách ảnh"
                            aria-hidden="true">
                        </i>
                    </div>
                    <div className="row row_4">
                        <label className="title_row">Mô tả *</label>
                        <FroalaEditor
                            config={{
                                heightMax: 362,
                                heightMin: 362,
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
                                        editor.image.insert(`http://localhost:5000${response.link.replace('/public', '')}`, true, null, editor.image.get(), null)
                                        return false
                                    }
                                }

                            }}
                            model={this.state.desc}
                            onModelChange={this.handleChangeDesc}
                        />
                    </div>
                    <div className="row row_5">
                        <div className="header_row">
                            <label className="title_row">Danh sách địa điểm</label>
                            <div style={{ top: '10px', right: '160px' }} className="mini_search_box">
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
                            <button
                                onClick={this.openModalRoute}
                                type="button"
                                className="btn btn-success pull-right addForTableCreateTour">Thêm Địa Điểm
                            </button>
                        </div>
                        <div className="table_row">
                            <ReactTable
                                columns={columns}
                                data={this.state.routes}
                                defaultPageSize={10}
                                noDataText={'Không có dữ liệu...'} >
                            </ReactTable>
                        </div>
                    </div>
                </section>
            </div>
        );
        return (
            <div className="content-wrapper">
                {this.state.success && <SweetAlert
                    success
                    title="Lưu Thành Công"
                    onConfirm={this.handleHiddenSuccess}>
                    Tiếp Tục...
                </SweetAlert>}

                {this.state.error && <SweetAlert
                    warning
                    confirmBtnText="Hủy"
                    confirmBtnBsStyle="default"
                    title="Đã Có Lỗi Xảy Ra!"
                    onConfirm={this.handleHiddenError}>
                    Vui Lòng Kiểm Tra Lại...
                </SweetAlert>}

                <Modal
                    open={this.state.modalCreateRouteIsOpen}
                    onClose={this.closeModalRoute}
                    center
                    styles={{ 'modal': { width: '1280px' } }}
                    blockScroll={true} >
                    <CreateRouteComponent handleCreateRoute={this.handleCreateRoute} />
                </Modal>

                {/*<Modal
                    open={this.state.modalEditRouteIsOpen}
                    onClose={this.closeModalEditRoute}
                    center
                    styles={{ 'modal': { width: '1280px' } }}
                    blockScroll={true} >
                    {this.state.routeEdit && <EditRouteComponent
                        route={this.state.routeEdit}
                        handleEditRoute={this.handleEditRoute}
                    />}
                </Modal> */}

                <Modal
                    open={this.state.modalListImageIsOpen}
                    onClose={this.closeModalListImage}
                    center
                    styles={{ 'modal': { width: '1280px', maxWidth: '1280px' } }}
                    blockScroll={true} >
                    <ListImageComponent
                        listImage={this.state.listImages}
                        deleteImage={this.deleteImage}
                    />
                </Modal>

                <section className="content-header">
                    <h1>Thêm Mới Tour</h1>
                    <div className="right_header">
                        <button
                            onClick={this.handleSave}
                            style={{
                                marginBottom: '2px',
                                marginRight: '15px'
                            }}
                            type="button"
                            className="btn btn-success pull-right">Lưu Lại
                        </button>
                    </div>
                </section>
                <section className="content">
                    <div className="row row_1">
                        <div className="left_row_1">
                            <div className="tour">
                                <label className="title_row">Tour *</label>
                                <input onChange={this.onHandleChange} value={this.state.name} name="name" type="text" className="form-control" />
                            </div>
                            <div className="type_tour">
                                <label className="title_row">Loại tour *</label>
                                <select value={this.state.typeTour} onChange={this.onHandleChange} name="typeTour" className="form-control">
                                    <option value="1">Trong nước</option>
                                    <option value="2">Quốc tế</option>
                                </select>
                            </div>
                            <div>
                                <label className="title_row">Ảnh đại diện *</label>
                                <input className="upload_image_create_tour" id="upload-image" onChange={this.handleChangeImage} type="file" /><br />
                                <div className="inputImage">
                                    {this.state.featuredImgTemp !== '' ?
                                        <img src={this.state.featuredImgTemp} /> :
                                        (this.state.featuredImg !== '' ?
                                            <img src={this.state.featuredImg} /> :
                                            <img src="http://localhost:5000/assets/images/locationFeatured/SaiGonCenter.jpg" />
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="right_row_1">
                            <label className="title_row">Qui định</label>
                            <FroalaEditor
                                config={{
                                    placeholderText: '',
                                    heightMin: 425,
                                    heightMax: 425,
                                    toolbarButtons: configEditor.policy,
                                }}
                                model={this.state.policy}
                                onModelChange={this.handleChangePolicy}
                            />
                        </div>
                    </div>
                    <div className="row row_2">
                        <label className="title_row">Danh sách hình ảnh</label>
                        <input className="upload_image_create_tour" onChange={this.handleChangeListImages} type="file" multiple />
                        <div className="slideshow">
                            {/* {this.state.listImagesPreviview.length > 0 &&
                                this.getListImage(this.state.listImagesPreviview).map((item, index) => {
                                    return <div key={index} className="imageOfSlideshow">
                                        <img src={item.image}></img>
                                        <i onClick={(event) => this.deleteImage(event, item.id)} style={{ cursor: 'pointer' }} className="fa fa-times" aria-hidden="true"></i>
                                    </div>
                                })
                            } */}
                            <div className="imageOfSlideshow">
                                <p onClick={this.handleOpenModalListImage} style={{ fontSize: '20px', marginTop: '40%' }}>không có dữ liệu...</p>
                            </div>
                        </div>
                    </div>
                    <div className="row row_4">
                        <label className="title_row">Mô tả *</label>
                        <FroalaEditor
                            config={{
                                heightMax: 362,
                                heightMin: 362,
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
                                        editor.image.insert(`http://localhost:5000${response.link.replace('/public', '')}`, true, null, editor.image.get(), null)
                                        return false
                                    }
                                }

                            }}
                            model={this.state.desc}
                            onModelChange={this.handleChangeDesc}
                        />
                    </div>
                    <div className="row row_5">
                        <div className="header_row">
                            <label className="title_row">Danh sách địa điểm</label>
                            <div style={{ top: '10px', right: '160px' }} className="mini_search_box">
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
                            <button
                                onClick={this.openModalRoute}
                                type="button"
                                className="btn btn-success pull-right addForTableCreateTour">Thêm Địa Điểm
                            </button>
                        </div>
                        <div className="table_row">
                            <ReactTable
                                columns={columns}
                                data={this.state.routes}
                                defaultPageSize={10}
                                noDataText={'Không có dữ liệu...'} >
                            </ReactTable>
                        </div>
                    </div>
                </section>
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
        createTour: (tour) => dispatch(actions.createTour(tour))
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListTypesComponent));