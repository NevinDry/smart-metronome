import React, { Component } from 'react';
import './MeasureVisualiser.scss';


class MeasureVisualiser extends Component {
    
    render() {
        const measures = [];


        for(let i = 0; i < this.props.cycleLength; i++){
            if(this.props.currentMeasure % this.props.cycleLength === i){
                measures.push(<div className="full-circle" key={i}></div>);
            }else{
                measures.push(<div className="empty-circle" key={i}></div>);
            }
        }

        return <div className="circle-visual-container">{measures}</div>;
    }
}

export default MeasureVisualiser;