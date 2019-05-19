import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Select from 'react-select';
import * as actions from './../../../../actions/index';
import { apiGet, apiPost } from './../../../../services/api';
import './index.css';

class CreateRouteComponent extends Component {

    render() {
        return <div style={{ marginLeft: '0px' }} className="content-wrapper modal_list_image_pop_up">
            <section style={{ marginBottom: "20px" }} className="content-header">
                <h1> Danh Sách Hình Ảnh </h1>
            </section>
            <section className="content">
                <div className="listImage">
                    <div className="imageOfListImage">
                        <img></img>
                        <i class="fa fa-times" aria-hidden="true"></i>
                    </div>
                    <div className="imageOfListImage">
                        <img></img>
                        <i class="fa fa-times" aria-hidden="true"></i>
                    </div>
                    <div className="imageOfListImage">
                        <img></img>
                        <i class="fa fa-times" aria-hidden="true"></i>
                    </div>
                    <div className="imageOfListImage">
                        <img></img>
                        <i class="fa fa-times" aria-hidden="true"></i>
                    </div>
                    <div className="imageOfListImage">
                        <img></img>
                        <i class="fa fa-times" aria-hidden="true"></i>
                    </div>
                    <div className="imageOfListImage">
                        <img></img>
                        <i class="fa fa-times" aria-hidden="true"></i>
                    </div>
                    <div className="imageOfListImage">
                        <img></img>
                        <i class="fa fa-times" aria-hidden="true"></i>
                    </div>
                </div>
            </section>
        </div>;
    }
}

const mapStateToProps = (state) => {
    return {
        listLocation: state.allLocation,
        listRoute: state.listRoute
    }
}

const mapDispatchToProps = (dispatch, action) => {
    return {
        getListTransport: (transport) => dispatch(actions.getListTransport(transport)),
        createRoute: (route) => dispatch(actions.createRoute(route)),
        getListLocation: (locations) => dispatch(actions.getListLocation(locations))
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateRouteComponent));
