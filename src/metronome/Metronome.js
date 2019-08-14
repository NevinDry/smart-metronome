import React, { Component } from 'react';
import './Metronome.scss';
import WebWorker from '../WebWorker';
import metronomeWorker from './metronomeWorker.js';

class Metronome extends Component {

  constructor(props) {
    super(props);
    this.state = {
      running: false,
      bpm: 90,
      beatSlashMeasure: 4,
      playIntervalBeats: true,
      increaseBpm: 10,
      increaseAtMeasure: 4
    };

    this.measureCount = 0;
    this.audioContext = null;
    this.nextClickTime = 0.0;
    this.flashForward = 25.0;
    this.scheduleAheadTime = 0.1;
    this.currentBeat = 0;
    this.metronomeWorker = new WebWorker(metronomeWorker);
    this.osc = null;
  }

  nextClick = () => {
    // Adjusting time 
    this.nextClickTime += (this.flashForward / 100) * (60.0 / this.state.bpm);

    this.currentBeat++;
    if (this.currentBeat === this.state.beatSlashMeasure) {
      this.measureCount++;
      if(this.measureCount % this.state.increaseAtMeasure === 0){
        const increaseBy = this.state.bpm + this.state.increaseBpm;
        this.setState({ bpm: increaseBy });
      }

      this.currentBeat = 0;
    }
  }

  playClick = () => {
    this.osc = this.audioContext.createOscillator();
    this.osc.connect(this.audioContext.destination);
    let isFirstBeatMesure = this.currentBeat % this.state.beatSlashMeasure === 0;

    if (isFirstBeatMesure) {
      this.osc.frequency.value = 1200.0;  
    } else if (this.state.playIntervalBeats) {
      this.osc.frequency.value = 220.0;
    }

    if (this.state.playIntervalBeats || isFirstBeatMesure) {
      this.osc.start(this.nextClickTime);
      this.osc.stop(this.nextClickTime + 0.05);
    }
  }

  scheduler = () => {
    while (this.nextClickTime < this.audioContext.currentTime + this.scheduleAheadTime) {
      this.playClick();
      this.nextClick();
    }
  }

  componentDidMount = () => {
    // Creating AudioContext supporting IOS
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContext();
    const source = this.audioContext.createBufferSource();
    source.buffer = this.audioContext.createBuffer(1, 1, 22050);
    source.start(0);

    this.metronomeWorker.onmessage = (e) => {
      if (e.data === "click") {
        this.scheduler();
      }
      else
        console.log("worker message: " + e.data);
    };

    this.metronomeWorker.postMessage({ "interval": this.flashForward });
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

    const { bpm, beatSlashMeasure, playIntervalBeats,increaseBpm, increaseAtMeasure } = this.state;

    return (
      <div className="metronome">

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
            <div>
              <input type="text" value={beatSlashMeasure} onChange={this.beatSlashMeasureChange}>
              </input>
              <span>B/Measure</span>
            </div>
          </div>
          <div className="checkbox-beats">
            <input type="checkbox" id="check" value={playIntervalBeats} onChange={this.playIntervalBeatsChange} />
            <label htmlFor="check">
              <svg viewBox="0,0,55,50">
                <path d="M5 30 L 20 45 L 45 5"></path>
              </svg>
            </label>
            <span>Play Beats ?</span>
          </div>
        </div>


      increase by <input type="text" value={increaseBpm} onChange={this.increaseBpmChange} />  every               <input type="text" value={increaseAtMeasure} onChange={this.increaseAtMeasureChange} />



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
      this.currentBeat = 0;
      this.measureCount = 0;
      this.nextClickTime = this.audioContext.currentTime;
      this.metronomeWorker.postMessage("start");
    } else {
      this.metronomeWorker.postMessage("stop");
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

  playIntervalBeatsChange = (event) => {
    const playIntervalBeats = !this.state.playIntervalBeats;
    this.setState({ playIntervalBeats });
  }

  increaseBpmChange = (event) => {
    const increaseBpm = +event.target.value;
    this.setState({ increaseBpm });
  } 

  increaseAtMeasureChange = (event) => {
    const increaseAtMeasure = +event.target.value;
    this.setState({ increaseAtMeasure });
  } 

}

export default Metronome;