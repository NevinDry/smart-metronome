import React, { Component } from 'react';
import './MeasureVisualiser.scss';


class MeasureVisualiser extends Component {
    
    render() {
        const measures = [];


        for(let i = 0; i < 4; i++){
            if(this.props.measureCount % this.props.measurePerCycle === i){
                measures.push(<div className="full-circle" key={i}></div>);
            }else{
                measures.push(<div className="empty-circle" key={i}></div>);
            }
        }

        return <div className="circle-visual-container">{measures}</div>;
    }
}

export default MeasureVisualiser;