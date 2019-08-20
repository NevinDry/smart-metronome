import React, { Component } from 'react';
import './MobileToast.scss';


class MobileToast extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show: props.show,
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ show: nextProps.show });  
    }

    render() {
        return (
            <div id="snackbar" className={this.state.show ? 'show' : ''}>
                A new update is avaible, please hard reload the app
            <button onClick={this.updateApp}>  OK </button>
            </div>);
    }

    updateApp = () => {
        this.setState({ show: false });
        window.location.reload(true);
    }
}

export default MobileToast;