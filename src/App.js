import React, { Component } from 'react';
import logo from './logo.svg';
import './App.scss';
import Metronome from './metronome/Metronome';
import MobileDialog from './dialog/MobileDialog'
import MobileToast from './toast/MobileToast'


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updateToast: false,
    };
  }

  componentDidMount = () => {
    // Listening to ServiceWorker event for PWA update integration
    window.addEventListener('update', (e) => {
      this.setState({ updateToast: true });
    }, false);
  }

  render() {
    let iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
    let dialog;
    if (iOS) {
      dialog = (<MobileDialog />);
    }



    return (
      <div>
        <div className="App">
          {dialog}
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
          </header>
          <Metronome />
        </div>
        <MobileToast show={this.state.updateToast} />

      </div>

    );
  }
}

export default App;
