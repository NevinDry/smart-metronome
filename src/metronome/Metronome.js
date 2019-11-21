import React, { Component } from 'react';
import './Metronome.scss';
import WebWorker from '../WebWorker';
import metronomeWorker from './metronomeWorker.js';
import MeasureVisualiser from '../visuals/MeasureVisualiser.js'

class Metronome extends Component {

  constructor(props) {
    super(props);
    this.state = {
      running: false,
      bpm: 90,
      playIntervalBeats: true,
      measureCount: 0,
      measurePerCycle: 4
    };

    this.audioContext = null;
    this.nextClickTime = 0.0;
    this.scheduleAheadTime = 0.1;
    this.metronomeWorker = new WebWorker(metronomeWorker);
    this.osc = null;
  }

  componentDidMount = () => {
    // Creating AudioContext supporting IOS
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContext();
    const source = this.audioContext.createBufferSource();
    source.buffer = this.audioContext.createBuffer(1, 1, 22050);
    source.start(0);

    // listening to the metronome ServiceWorker messages
    this.metronomeWorker.onmessage = (e) => {
      if (e.data === "click") {
        this.scheduler();
      }
    };

    // Sets the interval on how frequently we want to call the scheduler
    this.metronomeWorker.postMessage({ "interval": 25 });
  };

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

    const { bpm } = this.state;

    return (
      <div>

        <div className="metronome">
          <MeasureVisualiser measureCount={this.state.measureCount} measurePerCycle={this.state.measurePerCycle} ></MeasureVisualiser>

          <button onClick={this.startStop} className={btnClass}>{btnText}</button>

          <div className="settings-container">
            <div className="range-container">
              <input
                type="range"
                className="range"
                min="20"
                max="240"
                step="1"
                value={bpm}
                onChange={this.bpmChange}
              />
            </div>
            <div className='bpm-container'>
              <div>
                <input type="text" value={bpm} onChange={this.bpmChange}></input>
                <span>BPM</span>
              </div>
              <br></br>

            </div>
          </div>
        </div>
      </div>
    );

  }

  startStop = () => {
    // Unlocking audio API for IOS browser (it can only start from a user input)
    if (!this.osci) {
      this.osc = this.audioContext.createOscillator();
      this.osc.start(this.audioContext.currentTime);
      this.osc.stop(this.audioContext.currentTime);
    }

    // getting the value of running in this context
    const running = !this.state.running;

    // //we set the state for ui purpose
    this.setState({
      running: running
    });

    if (running) {
      // We set the first click at the current audiocontext time, and start the ServiceWorker job
      this.nextClickTime = this.audioContext.currentTime + 0.1;
      this.metronomeWorker.postMessage("start");
    } else {
      this.metronomeWorker.postMessage("stop");
    }
  }

  // this function will look ahead of time to schedule a click for perfect timing and will update the time for the click 
  scheduler = () => {
    while (this.nextClickTime < this.audioContext.currentTime + this.scheduleAheadTime) {
      this.scheduleClick();
      this.nextClick();
    }
  }

  scheduleClick = () => {
    this.osc = this.audioContext.createOscillator();
    this.osc.connect(this.audioContext.destination);

    this.osc.frequency.value = 1200;

    //using the oscillator to play the click at the exact time
    this.osc.start(this.nextClickTime);
    this.osc.stop(this.nextClickTime + 0.05);
  }

  nextClick = () => {
    //Calculating the next click
    this.nextClickTime += (60.0 / this.state.bpm);
    this.setState({ measureCount: this.state.measureCount + 1 });
  }

  bpmChange = (event) => {
    const bpm = +event.target.value;
    this.setState({ bpm });
  }
}

export default Metronome;