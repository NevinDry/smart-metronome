import React, { Component } from 'react';
import logo from './logo.svg';
import './App.scss';
import Metronome from './metronome/Metronome';
import MobileDialog from './dialog/MobileDialog'

class App extends Component {


  render() {
    let iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
    let dialog;
    if(iOS){
      dialog = (<MobileDialog />);
    }

    return (
      <div className="App">
        {dialog}
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <Metronome />
      </div>
    );
  }
}

export default App;
