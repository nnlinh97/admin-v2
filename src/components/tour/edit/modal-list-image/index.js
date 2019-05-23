import React, { Component } from 'react';
import './index.css';

class ListImagesComponent extends Component {

    deleteImage = (index, status) => {
        this.props.deleteImage(index, status);
    }

    render() {
        return <div style={{ marginLeft: '0px' }} className="content-wrapper modal_list_image_pop_up">
            <section style={{ marginBottom: "20px" }} className="content-header">
                <h1> Danh Sách Hình Ảnh </h1>
            </section>
            <section className="content">
                <div style={{ height: '550px', maxHeight: '565px' }} className="listImage">
                    {this.props.listImages.length > 0 &&
                        this.props.listImages.map((image, index) => {
                            return <div key={index} className="imageOfListImage">
                                <img src={image.name} alt='hinh anh' />
                                <i
                                    onClick={() => this.deleteImage(index, 'old')}
                                    style={{ cursor: 'pointer' }}
                                    className="fa fa-times" aria-hidden="true">
                                </i>
                            </div>;
                        })}
                    {this.props.listImagesPreviview.length > 0 &&
                        this.props.listImagesPreviview.map((img, i) => {
                            return <div key={i} className="imageOfListImage">
                                <img src={img} alt='hinh anh' />
                                <i
                                    onClick={() => this.deleteImage(i, 'new')} style={{ cursor: 'pointer' }}
                                    className="fa fa-times" aria-hidden="true">
                                </i>
                            </div>;
                        })}
                    {(this.props.listImages.length === 0 && this.props.listImagesPreviview.length === 0) &&
                        <div className="imageOfListImage">
                            <p>không có hình ảnh...</p>
                        </div>}
                </div>
            </section>
        </div>;
    }
}

export default ListImagesComponent;
