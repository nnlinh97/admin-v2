import React, { Component } from 'react';
import './index.css';
import '../list.css';

class InfoUser extends Component {
    render() {
        const { user } = this.props;
        return (
            <div>
                <section className="content-header">
                    <h1>
                        Infomation
                    </h1>
                </section>
                <section className="content">
                    <div className="row invoice-info">
                        <div style={{textAlign: 'right'}} className="col-sm-6 invoice-col">
                            <address>
                                <strong>ID</strong><br />
                                <strong>Username</strong><br />
                                <strong>Fullname</strong><br />
                                <strong>Phone</strong><br />
                                <strong>Email</strong><br />
                                <strong>Sex</strong><br />
                            </address>
                        </div>
                        <div style={{textAlign: 'left'}} className="col-sm-6 invoice-col">
                            <address>
                                {user.id}<br />
                                {user.username}<br />
                                {user.fullname}<br />
                                {user.phone}<br />
                                {user.email}<br />
                                {user.sex}<br />
                            </address>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

export default InfoUser;