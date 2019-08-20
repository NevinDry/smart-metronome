import React, { Component } from 'react';
import './MobileDialog.scss';


class MobileDialog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            clicked: false,
        };
    }

    render() {
        if (!this.state.clicked) {
            return (
                <div className="modal-container">
                    <label className="modal-backdrop" htmlFor="modal-toggle"></label>
                    <div className="modal-content">
                        <span>
                            <span className="modal-arrow">&#8598;</span>
                            Iphone Users, please turn on your ring switch
                        </span>
                        <button className="btn btn-modal" onClick={() => { this.setState({ clicked: true }) }} >OK</button>
                    </div>
                </div>
            );
        }else{
            return '';
        }
    }
}

export default MobileDialog;