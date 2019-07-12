import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from './../../../actions/index';
// import _ from 'lodash';
// import randomstring from 'randomstring';
import ReactTable from 'react-table';
import FroalaEditor from 'react-froala-wysiwyg';
import { configEditor } from './../config';
import SweetAlert from 'react-bootstrap-sweetalert';
import Modal from 'react-responsive-modal';
import { matchString } from '../../../helper';
import { apiGet, apiPost } from '../../../services/api';
import CreateRouteComponent from './modal-create';
import EditRouteComponent from './modal-edit';
import ListImageComponent from './modal-list-image';
import 'froala-editor/js/froala_editor.pkgd.min.js';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'react-table/react-table.css';
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
            deletedImages: [],
            listImagesNew: [],
            listImagesPreviview: [],
            typeTour: '',
            modalCreateRouteIsOpen: false,
            modalEditRouteIsOpen: false,
            modalListImageIsOpen: false,
            routeEdit: null,
            id: '',
            keySearch: '',
            numDay: ''
        }
    }

    componentDidMount = async () => {
        const id = this.props.match.params.id;
        try {
            const tourDetail = await apiGet(`/tour/getById/${id}`);
            console.log(tourDetail.data.data)
            this.updateState(tourDetail.data.data);
        } catch (error) {
            console.log(error);
        }
    }

    updateState = (tourDetail) => {
        // console.log(tourDetail);
        this.setState({
            name: tourDetail.name,
            typeTour: tourDetail.fk_type_tour,
            id: tourDetail.id,
            policy: tourDetail.policy ? tourDetail.policy : '',
            featuredImg: tourDetail.featured_img,
            listImages: tourDetail.tour_images,
            desc: tourDetail.description,
            routes: tourDetail.routes,
            numDay: tourDetail.num_days
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
        const { name, desc, routes, numDay } = this.state;
        if (name !== '' && desc !== '' && routes.length > 0 && numDay > 0) {
            return true;
        }
        return false;
    }

    handleEditTour = async () => {
        if (this.checkTour()) {
            try {
                const { id, name, image, policy, desc, routes, deletedImages, listImagesNew, typeTour, numDay } = this.state;
                let form = new FormData();
                form.append('id', id);
                form.append('name', name);
                form.append('policy', policy);
                form.append('routes', JSON.stringify(this.changeRoutes(routes)));
                form.append('fk_type_tour', typeTour);
                form.append('description', desc);
                form.append('num_days', numDay);
                if (image.length > 0) {
                    form.append('featured_image', image[0], 'name.jpg');
                }
                if (deletedImages.length > 0) {
                    form.append('deleted_images', JSON.stringify(deletedImages));
                }
                if (listImagesNew.length > 0) {
                    listImagesNew.forEach((item) => {
                        form.append('new_images', item);
                    });
                }
                await apiPost('/tour/updateWithRoutesAndListImage_v2', form);
                this.setState({ success: true });
            } catch (error) {
                this.setState({ error: true });
            }
        } else {
            this.setState({ error: true })
        }
    }

    handleHiddenSuccess = () => {
        // this.setState({ success: false, modalCreateRouteIsOpen: false });
        this.props.history.push('/tour/list')
    }

    handleHiddenError = () => {
        this.setState({ error: false });
    }

    handleDelete = (props) => {
        this.state.routes.splice(props.index, 1);
        this.setState({ routes: [...this.state.routes] });
    }

    handleEdit = (props) => {
        this.setState({
            routeEdit: {
                ...this.state.routes[props.index],
                index: props.index
            },
            modalEditRouteIsOpen: true
        });
    }

    handleOpenModalListImage = () => {
        this.setState({ modalListImageIsOpen: true });
    }

    handleChangeImage = (event) => {
        let file = event.target.files[0];
        let reader = new FileReader();
        event.target.value = null;
        reader.onloadend = () => {
            this.setState({
                image: [file],
                featuredImgTemp: reader.result
            });
        }
        reader.readAsDataURL(file)
    }

    handleChangeListImages = (event) => {
        let files = Array.from(event.target.files);
        event.target.value = null;
        if (files.length) {
            files.forEach(item => {
                let reader = new FileReader();
                reader.onloadend = () => {
                    this.setState({
                        listImagesNew: [...this.state.listImagesNew, item],
                        listImagesPreviview: [...this.state.listImagesPreviview, reader.result]
                    });
                };
                reader.readAsDataURL(item);
            });

        }
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
            const deletedImages = [...this.state.deletedImages, this.state.listImages[index]];
            this.state.listImages.splice(index, 1);
            this.setState({ listImages: [...this.state.listImages], deletedImages: deletedImages });
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
                routes: [...this.state.routes, data],
                modalCreateRouteIsOpen: false
            });
        } else {
            this.setState({ error: true });
        }
    }

    handleEditRoute = (data) => {
        if (data) {
            let routes = [...this.state.routes];
            const index = data.index;
            delete data.index;
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
        let routes = [...this.state.routes];
        this.setState({ routes: this.swap(routes, props.index, props.index - 1) });
    }

    handleDown = (props) => {
        let routes = [...this.state.routes];
        this.setState({ routes: this.swap(routes, props.index, props.index + 1) });
    }

    handleDeleteAvatar = async () => {
        const id = this.props.match.params.id;
        try {
            const tourDetail = await apiGet(`/tour/getById/${id}`);
            this.updateStateRefresh(tourDetail.data.data);
        } catch (error) {
            console.log(error);
        }
    }

    changeRoutes = (routes) => {
        let result = [];
        routes.forEach(item => {
            item.fk_location = item.location.id;
            item.fk_transport = item.transport.id;
            item.day = parseInt(item.day);
            let temp = { ...item };
            delete temp.location;
            delete temp.transport;
            delete temp.id;
            delete temp.title;
            result.push(temp);
        });
        return result;
    }

    sortRoutes = async (routes) => {
        const checkTime = (arrive, leave) => {
            return Date.parse('01/01/2011 ' + arrive) < Date.parse('01/01/2011 ' + leave)
        }
        const compare2Route = (route1, route2) => {
            if (parseInt(route1.day) === parseInt(route2.day)) {
                if (route1.arrive_time === null)
                    return -1;
                if (checkTime(route1.arrive_time, route2.arrive_time)) {
                    return -1;
                }
                else
                    return 1;
            }
            return (parseInt(route1.day) > parseInt(route2.day) ? 1 : -1)
        }
        routes.sort(compare2Route);
    }

    handleSortRoutes = async (list) => {
        let routes = [...list];
        await this.sortRoutes(routes);
        this.setState({ routes });
    }

    handleRefresh = async () => {
        const id = this.props.match.params.id;
        try {
            const tourDetail = await apiGet(`/tour/getById/${id}`);
            this.updateStateRefresh(tourDetail.data.data);
        } catch (error) {
            console.log(error);
        }
    }

    updateStateRefresh = (tourDetail) => {
        this.setState({
            name: tourDetail.name,
            typeTour: tourDetail.fk_type_tour,
            id: tourDetail.id,
            policy: tourDetail.policy ? tourDetail.policy : '',
            featuredImg: tourDetail.featured_img,
            listImages: tourDetail.tour_images,
            desc: tourDetail.description,
            routes: tourDetail.routes,
            listImagesNew: [],
            listImagesPreviview: [],
            featuredImgTemp: '',
            image: []
        });
    }

    handleSearchRoutes = (listRoutes, keySearch) => {
        if (keySearch !== '' && listRoutes.length > 0) {
            return listRoutes.filter(route => matchString(route.location.name, keySearch) || matchString(route.location.id.toString(), keySearch));
        }
        return listRoutes;
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
                            style={{ position: 'absolute', marginLeft: '-12.5px', marginTop: '-2px', height: '17px', width: '20px' }}
                            className="btn btn-default"
                            disabled={props.index === 0}
                            onClick={() => this.handleUp(props)} >
                            <i style={{ position: 'absolute', top: '5px', marginLeft: '-4px' }} className="fa fa-sort-asc" />
                        </button>
                        <button
                            style={{ position: 'absolute', marginLeft: '-12.5px', marginTop: '17px', height: '17px', width: '20px' }}
                            className="btn btn-default"
                            disabled={props.index === this.state.routes.length - 1}
                            onClick={() => this.handleDown(props)} >
                            <i style={{ position: 'absolute', top: '-2px', marginLeft: '-4px' }} className="fa fa-sort-desc" />
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

                <section className="content-header content-header-page">
                    <h1 style={{height: '8vh'}}>Chỉnh Sửa Tour</h1>
                </section>
                <section className="content">
                    <div className="row row_1">
                        <div className="left_row_1">
                            <div className="tour">
                                <label className="title_row">Tour *</label>
                                <input onChange={this.onHandleChange} value={this.state.name} name="name" type="text" className="form-control" />
                            </div>
                            <div className="tour">
                                <label className="title_row">Số ngày *</label>
                                <input onChange={this.onHandleChange} value={this.state.numDay} name="numDay" type="number" className="form-control" />
                            </div>
                            <div className="type_tour">
                                <label className="title_row">Loại tour *</label>
                                <select value={this.state.typeTour} onChange={this.onHandleChange} name="typeTour" className="form-control">
                                    <option value="1">Trong nước</option>
                                    <option value="2">Quốc tế</option>
                                </select>
                            </div>
                            <div className="list_image_tour">
                                <label className="title_row">Danh sách hình ảnh</label>
                                <input className="upload_image_create_tour" onChange={this.handleChangeListImages} type="file" multiple />
                                <i
                                    style={{ cursor: 'pointer', fontSize: '40px', marginTop: '10px' }}
                                    onClick={this.handleOpenModalListImage}
                                    className="fa fa-picture-o icon_show_pop_up"
                                    title="Xem danh sách ảnh"
                                    aria-hidden="true">
                                </i>
                            </div>

                        </div>
                        <div className="right_row_1">
                            <div>
                                <label className="title_row">Ảnh đại diện *</label>
                                <input id="upload-image" className="upload_image_create_tour" onChange={this.handleChangeImage} type="file" /><br />
                                <div className="inputImage">
                                    <div className="cover_image_of_tour">
                                        {this.state.featuredImgTemp !== '' ?
                                            <img src={this.state.featuredImgTemp} alt='' /> :
                                            (this.state.featuredImg ?
                                                <img alt='' src={this.state.featuredImg} /> :
                                                <img alt='' src="http://denrakaev.com/wp-content/uploads/2015/03/no-image-800x511.png" />
                                            )}
                                        {this.state.featuredImgTemp !== '' && <i
                                            onClick={this.handleDeleteAvatar}
                                            className="fa fa-times"
                                            aria-hidden="true" />}
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row row_2">
                        <div className="header_row">
                            <label className="title_row">Danh sách địa điểm</label>
                            <div style={{ top: '10px' }} className="mini_search_box">
                                <div className="search_icon">
                                    <i className="fa fa-search"></i>
                                </div>
                                <input
                                    type="text"
                                    onChange={this.onHandleChange}
                                    value={this.state.keySearch}
                                    name="keySearch"
                                    className="search_input"
                                    placeholder="Tìm kiếm..."
                                />
                            </div>
                            <button
                                onClick={() => this.handleSortRoutes(this.state.routes)}
                                type="button"
                                style={{ paddingBottom: '9px' }}
                                className="btn btn-default pull-right addForTableCreateTour">
                                <i className="fa fa-sort-amount-asc" aria-hidden="true"></i>
                            </button>
                            <button
                                onClick={this.openModalRoute}
                                type="button"
                                className="btn btn-success pull-right addForTableCreateTour">Thêm Địa Điểm
                            </button>
                        </div>
                        <div className="table_row">
                            <ReactTable
                                columns={columns}
                                data={this.handleSearchRoutes(this.state.routes, this.state.keySearch)}
                                defaultPageSize={10}
                                noDataText={'Không có dữ liệu...'} >
                            </ReactTable>
                        </div>
                    </div>
                    <div className="row row_3">
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
                    <div className="row row_4">
                        <label className="title_row">Mô tả *</label>
                        <FroalaEditor
                            config={{
                                heightMax: 362,
                                heightMin: 362,
                                placeholderText: '',
                                toolbarButtons: configEditor.description,
                                imageUploadParam: 'file',
                                imageUploadURL: `${process.env.REACT_APP_REST_API_LOCATION}/admin/upload_image`,
                                imageUploadParams: { id: 'my_editor' },
                                imageUploadMethod: 'POST',
                                imageMaxSize: 5 * 1024 * 1024,
                                imageAllowedTypes: ['jpeg', 'jpg', 'png'],
                                events: {
                                    'froalaEditor.image.uploaded': (e, editor, response) => {
                                        response = JSON.parse(response);
                                        editor.image.insert(`${process.env.REACT_APP_REST_API_LOCATION}${response.link.replace('/public', '')}`, true, null, editor.image.get(), null)
                                        return false
                                    }
                                }

                            }}
                            model={this.state.desc}
                            onModelChange={this.handleChangeDesc}
                        />
                    </div>
                </section>
                <section className="content-final">
                    <div className="right_final">
                        <button
                            onClick={this.handleEditTour}
                            style={{ marginBottom: '2px', marginRight: '15px' }}
                            type="button"
                            className="btn btn-success pull-right">Lưu Lại
                        </button>
                        <button
                            onClick={this.handleRefresh}
                            style={{ marginBottom: '2px', marginRight: '20px', border: 'none', padding: '0 10px', backgroundColor: '#fff', color: 'rgb(60, 141, 188)', fontSize: '36px', fontWeight: 'bold' }}
                            type="button"
                            title="làm mới"
                            className="btn btn-default pull-right">
                            <i className="fa fa-refresh" />
                        </button>
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