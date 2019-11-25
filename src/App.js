import React, { Component } from 'react';
import './App.scss';
import Metronome from './metronome/Metronome';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updateToast: false,
      notInstalled: false
    };
  }

  componentDidMount = () => {
  }

  render() {
    return (
      <div>
        <div className="App">
          <Metronome />
        </div>
      </div>

    );
  }
}

export default App;
