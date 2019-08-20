import React, { Component } from 'react';
import logo from './assets/logo.svg';
import './App.scss';
import Metronome from './metronome/Metronome';
import MobileDialog from './dialog/MobileDialog'
import MobileToast from './toast/MobileToast'
import MobileIosInstallMessage from './installMessage/MobileIosInstallMessage';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updateToast: false,
      notInstalled: false
    };
  }

  componentDidMount = () => {
    // Listening to ServiceWorker event for PWA update integration
    window.addEventListener('update', (e) => {
      this.setState({ updateToast: true });
    }, false);
  }

  render() {
    // Preparing for IOS PWA integration
    let iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
    let dialog;
    let instaMessage;
    if (iOS) {
      dialog = (<MobileDialog />);
      //checking if app is installed or not
      if (!window.navigator.standalone) {
        instaMessage = (<MobileIosInstallMessage />);
      }
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
        {instaMessage}
      </div>

    );
  }
}

export default App;
