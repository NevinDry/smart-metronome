import React from 'react';
import logo from './logo.svg';
import './App.scss';
import Metronome from './metronome/Metronome';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <Metronome />
    </div>
  );
}

export default App;
