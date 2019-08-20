import React, { Component } from 'react';
import './MobileIosInstallMessage.scss';
import share from '../assets/share.png';


class MobileIosInstallMessage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            clicked: false,
        };
    }

    render() {
        if (!this.state.clicked) {
            return (
                <div className="ios-prompt">
                    <span onClick={() => { this.setState({ clicked: true }) }} class="close"></span>
                    <p>Install this Web App in your iPhone/iPad :<strong> tap </strong> <img alt="ios-share" src={share} />  and then <strong>Add to Home Screen</strong>.</p>
                </div>
            );
        }
    }
}

export default MobileIosInstallMessage;