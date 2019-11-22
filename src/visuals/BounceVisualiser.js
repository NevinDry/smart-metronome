import React, { Component } from 'react';
import './BounceVisualiser.scss';
import logo from '../assets/logo.svg';


class BounceVisualiser extends Component {
    render() {
        return (
            <header className="App-header">
                <img 
                style={{ 
                    'transform': 'rotate(' + (this.props.currentMeasure * (360/this.props.measureQuantity)) + 'deg)',
                    'transitionDuration':  this.props.animationDuration + "s",
                    'WebkitTransitionDuration':  this.props.animationDuration + "s"
                }}
                src={logo} className="App-logo" alt="logo" />
            </header>
        )
    }
}

export default BounceVisualiser;
