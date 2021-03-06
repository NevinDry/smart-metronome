import React, { Component } from 'react';
import './Metronome.scss';
import WebWorker from '../WebWorker';
import metronomeWorker from './metronomeWorker.js';
import MeasureVisualiser from '../visuals/MeasureVisualiser.js'
import BounceVisualiser from '../visuals/BounceVisualiser.js'

class Metronome extends Component {

  constructor(props) {
    super(props);
    this.state = {
      running: false,
      bpm: 90,
      frqMain: 1200,
      frqBeat: 220,
      beatSlashMeasure: 4,
      playIntervalBeats: true,
      increaseBpm: 0,
      cycleLength: 4,
      currentMeasure: 0
    };

    this.audioContext = null;
    this.nextClickTime = 0.0;
    this.scheduleAheadTime = 0.1;
    this.currentBeat = 0;
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

    this.metronomeWorker.onmessage = (e) => {
      if (e.data === "click") {
        this.scheduler();
      }
    };

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

    const { bpm, beatSlashMeasure, playIntervalBeats, increaseBpm, cycleLength, frqMain, frqBeat } = this.state;

    return (
      <div>
        <BounceVisualiser currentMeasure={this.state.currentMeasure} animationDuration={(60.0 / this.state.bpm)} measureQuantity={this.state.cycleLength} />

        <div className="metronome">

          <MeasureVisualiser cycleLength={this.state.cycleLength} currentMeasure={this.state.currentMeasure}></MeasureVisualiser>

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
              <div className="checkbox-beats">
                <input type="checkbox" id="check" value={playIntervalBeats} onChange={this.playIntervalBeatsChange} />
                <label htmlFor="check">
                  <svg viewBox="0,0,55,50">
                    <path d="M5 30 L 20 45 L 45 5"></path>
                  </svg>
                </label>
                <span>Play Beats ?</span>
              </div>
              <div>
                <input type="text" value={beatSlashMeasure} onChange={this.beatSlashMeasureChange}>
                </input>
                <span>B/Measure</span>
              </div>
            </div>

            <div>
              increase by <input type="text" value={increaseBpm} onChange={this.increaseBpmChange} /> bpm <br />
              every <input type="text" value={cycleLength} onChange={this.cycleLengthChange} /> measure
          </div>
            <div className="frequency-container">
              <div className="range-container">
                <input
                  type="range"
                  className="range"
                  min="20"
                  max="2000"
                  step="1"
                  value={frqMain}
                  onChange={this.frqMainChange}
                />
              </div>
              <div>
                <input type="text" value={frqMain} onChange={this.frqMainChange}></input>
                <span>First Beat Frq</span>
              </div>
              <div className="range-container">
                <input
                  type="range"
                  className="range"
                  min="20"
                  max="2000"
                  step="1"
                  value={frqBeat}
                  onChange={this.frqBeatChange}
                />
              </div>
              <div>
                <input type="text" value={frqBeat} onChange={this.frqBeatChange}></input>
                <span>Beat Frq</span>
              </div>
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
      this.currentBeat = 0;
      this.setState({ currentMeasure: 0 });
      this.nextClickTime = this.audioContext.currentTime + 0.1;
      this.metronomeWorker.postMessage("start");
    } else {
      this.metronomeWorker.postMessage("stop");
    }
  }

  scheduler = () => {
    while (this.nextClickTime < this.audioContext.currentTime + this.scheduleAheadTime) {
      this.playClick();
      this.nextClick();
    }
  }

  playClick = () => {
    this.osc = this.audioContext.createOscillator();
    this.osc.connect(this.audioContext.destination);
    let isFirstBeatMesure = this.currentBeat % this.state.beatSlashMeasure === 0;

    if (isFirstBeatMesure) {
      this.osc.frequency.value = this.state.frqMain;
    } else if (this.state.playIntervalBeats) {
      this.osc.frequency.value = this.state.frqBeat;
    }

    if (this.state.playIntervalBeats || isFirstBeatMesure) {
      this.osc.start(this.nextClickTime);
      this.osc.stop(this.nextClickTime + 0.05);
    }
  }

  nextClick = () => {
    // Adjusting time using number of beat per measure and bpm
    this.nextClickTime += ((100 / this.state.beatSlashMeasure) / 100) * (60.0 / this.state.bpm);

    this.currentBeat++;
    if (this.currentBeat === this.state.beatSlashMeasure) {
      this.setState({ currentMeasure: this.state.currentMeasure + 1 });

      if (this.state.currentMeasure % this.state.cycleLength === 0) {
        const increaseBy = this.state.bpm + this.state.increaseBpm;
        this.setState({ bpm: increaseBy });
      }

      this.currentBeat = 0;
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

  cycleLengthChange = (event) => {
    const cycleLength = +event.target.value;
    this.setState({ cycleLength });
  }

  frqMainChange = (event) => {
    const frqMain = +event.target.value;
    this.setState({ frqMain });
  }

  frqBeatChange = (event) => {
    const frqBeat = +event.target.value;
    this.setState({ frqBeat });
  }

}

export default Metronome;