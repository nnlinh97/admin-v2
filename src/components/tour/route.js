import 'froala-editor/js/froala_editor.pkgd.min.js';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from './../../actions/index';
import { URL } from '../../constants/url';
import TimePicker from 'react-time-picker';
import 'font-awesome/css/font-awesome.css';
import FroalaEditor from 'react-froala-wysiwyg';
import Autosuggest from 'react-autosuggest';
import Select from 'react-select';
import axios from 'axios';
import { configEditor } from './config';
import './create.css'



class Route extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arriveTime: null,
            leaveTime: null,
            day: '',
            display: true,
            save: false,
            selected: null,
            error: false,
            isPlus: false
        }
    }

    async componentDidMount() {
        if (!this.props.allLocation) {
            try {
                let listLocation = await axios.get(`${URL}/location/getAllWithoutPagination`);
                this.props.getListLocation(listLocation.data.data);
            } catch (error) {
                console.log(error);
            }
        }
        this.setState({
            arriveTime: this.props.data.route !== '' ? this.props.data.route.arriveTime : '',
            leaveTime: this.props.data.route  !== '' ? this.props.data.route.leaveTime : '',
            day: this.props.data.route  !== '' ? this.props.data.route.day : '',
            detail: this.props.data.route  !== '' ? this.props.data.route.detail : '',
            selected: this.props.data.route  !== '' ? this.props.data.route.selected : '',
        })
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            arriveTime: nextProps.data.route  !== '' ? nextProps.data.route.arriveTime : '',
            leaveTime: nextProps.data.route  !== '' ? nextProps.data.route.leaveTime : '',
            day: nextProps.data.route  !== '' ? nextProps.data.route.day : '',
            detail: nextProps.data.route  !== '' ? nextProps.data.route.detail : '',
            selected: nextProps.data.route  !== '' ? nextProps.data.route.selected : '',
            save: nextProps.data.route  !== '' ? nextProps.data.route.save : false,
            error: nextProps.data.error
        })
    }

    checkRoute = () => {
        const route = this.state;
        if (route.selected && Number.isInteger(parseInt(route.day)) && parseInt(route.day) > 0) {
            return true;
        }
        return false;
    }



    hideRouteContent = () => {
        this.setState({
            display: !this.state.display
        })
    }

    handleChange = (event) => {
        let target = event.target;
        let name = target.name;
        let value = target.value;

        this.setState({
            [name]: value,
            save: false
        });
    }

    onHandleChangeArriveTime = (time) => {
        this.setState({
            arriveTime: time + ":00",
            save: false
        });
    }

    onHandleChangeleaveTime = (time) => {
        this.setState({
            leaveTime: time + ":00",
            save: false
        });
    }

    onHandleSave = () => {
        if (this.checkRoute()) {
            this.props.onSave({
                data: {
                    arriveTime: this.state.arriveTime !== '' ? this.state.arriveTime : null,
                    leaveTime: this.state.leaveTime !== '' ? this.state.leaveTime : null,
                    day: parseInt(this.state.day),
                    selected: this.state.selected,
                    save: true,
                    id: this.state.selected.id
                },
                index: this.props.data.index
            });
            this.setState({
                save: true,
                error: false,
                isPlus: true
            })
        } else {
            this.setState({
                error: true
            })
        }

    }

    handleDeleteRoute = () => {
        this.props.onDelete(this.props.data.index);
    }

    handleChangeSelect = (selected) => {
        this.setState({
            selected: {
                id: selected.id,
                label: selected.label
            },
            save: false
        })
    }

    render() {
        let { data, allLocation } = this.props;
        let listLocation = allLocation ? allLocation : [];
        if (listLocation.length) {
            listLocation.forEach(item => {
                item.label = item.name;
            });
        }
        return (
            <div className={`box box-primary ${this.state.error ? 'bd-red' : ''}`}>
                <form role="form">
                    <div className="box-header with-border">
                        <h3 className="box-title">Địa điểm {data.index + 1}</h3>
                        <div className="pull-right">
                            <i onClick={this.onHandleSave} className={`fa fa-save icons-form ${this.state.save ? 'color' : ''}`} />&nbsp;&nbsp;
                            <i onClick={this.hideRouteContent} className={`glyphicon glyphicon-chevron-${this.state.display ? 'down' : 'left'} icons-form`} />&nbsp;&nbsp;
                            <i onClick={this.handleDeleteRoute} className="glyphicon glyphicon-remove-circle icons-form" />
                        </div>
                    </div>
                    {this.state.display &&
                        <div className="box-body">
                            <div className="form-group">
                                <label htmlFor="exampleInputEmail1">Tên (*)</label>
                                {listLocation.length > 0 && <Select
                                    value={this.state.selected}
                                    onChange={this.handleChangeSelect}
                                    options={allLocation}
                                />}
                                {/* <input onChange={this.handleChange} value={this.state.name} name="name" type="text" className="form-control" placeholder="Name" /> */}
                            </div>
                            <div className="form-group w-30">
                                <label>Thời gian đến</label><br />
                                <TimePicker
                                    value={this.state.arriveTime}
                                    onChange={this.onHandleChangeArriveTime}
                                />
                            </div>
                            <div className="form-group w-30">
                                <label>Thời gian đi</label><br />
                                <TimePicker
                                    value={this.state.leaveTime}
                                    onChange={this.onHandleChangeleaveTime}
                                />
                            </div>
                            <div className="form-group w-30">
                                <label>Ngày thứ (*)</label>
                                <input onChange={this.handleChange} value={this.state.day} name="day" type="number" className="form-control" />
                            </div>
                        </div>
                    }

                </form>
            </div>
        );
    }
}

// export default Route;
const mapStateToProps = (state) => {
    return {
        info: state.infoLocation,
        allType: state.allType,
        allLocation: state.allLocation
    }
}

const mapDispatchToProps = (dispatch, action) => {
    return {
        changeLocationInfo: (info) => dispatch(actions.changeLocationInfo(info)),
        getListTypeLocation: (type) => dispatch(actions.getListTypeLocation(type)),
        getListLocation: (locations) => dispatch(actions.getListLocation(locations))
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Route));