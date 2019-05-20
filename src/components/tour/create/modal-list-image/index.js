import React, { Component } from 'react';
import './index.css';

class CreateRouteComponent extends Component {

    deletePreviewImage = (index) => {
        this.props.deletePreviewImage(index);
    }

    render() {
        return <div style={{ marginLeft: '0px' }} className="content-wrapper modal_list_image_pop_up">
            <section style={{ marginBottom: "20px" }} className="content-header">
                <h1> Danh Sách Hình Ảnh </h1>
            </section>
            <section className="content">
                <div style={{height: '550px', maxHeight: '565px'}} className="listImage">
                    {this.props.listImage.length > 0 &&
                        this.props.listImage.map((image, index) => {
                            return <div key={index} className="imageOfListImage">
                                <img src={image}></img>
                                <i onClick={() => this.deletePreviewImage(index)} style={{ cursor: 'pointer' }} class="fa fa-times" aria-hidden="true"></i>
                            </div>;
                        })}
                    {this.props.listImage.length === 0 && <div className="imageOfListImage">
                        <p>không có hình ảnh...</p>
                    </div>}
                </div>
            </section>
        </div>;
    }
}

export default CreateRouteComponent;
