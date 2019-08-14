import React, { Component } from 'react';
import './Metronome.scss';
import click1 from './sounds/click.wav'

class Metronome extends Component {

  constructor(props) {
    super(props);
    this.state = {
      running: false,
      bpm: 90,
      beatSlashMeasure: 4
    };

    this.click1 = new Audio(click1);
  }


  render() {
    let btnClass = "btn ";
    let btnText = "";

    if (this.state.running) {
      btnClass += "btn-stop";
      btnText = "Stop";
    } else {
      btnClass += "btn-start";
      btnText = "Start";
    }

    const { bpm,  beatSlashMeasure} = this.state;

    return (
      <div className="metronome">

        <button onClick={this.startStop} className={btnClass}>{btnText}</button>

        <div className="settings-container">
          <div className="range-container">
            <input
              type="range"
              className="range"
              min="60"
              max="240"
              step="1"
              value={bpm}
              onChange={this.bpmChange}
            />
          </div>

          <div className='bpm-container'><input type="text" value={bpm} onChange={this.bpmChange}></input> BPM</div>
          <div className='bpm-container'><input type="text" value={beatSlashMeasure} onChange={this.beatSlashMeasureChange}></input> Beats / Measure</div>

        </div>
      </div>

    );

  }

  startStop = () => {
    if (this.state.running) {
      clearInterval(this.timer);
      this.setState({
        running: !this.state.running
      });
    } else {
      this.timer = setInterval(this.playClick, (60 / this.state.bpm) * 1000);
      this.setState({
        running: true
      }, this.playClick);
    }
  }

  bpmChange = (event) => {
    const bpm = +event.target.value;
    this.setState({ bpm });
  }


  beatSlashMeasureChange = (event) => {
    const beatSlashMeasure = +event.target.value;
    this.setState({ beatSlashMeasure });
  }


  playClick = () => {
    this.click1.play();
  }

}

export default Metronome;