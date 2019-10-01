import React from 'react';
// Компоненты UI елементы страници
import Header from './interface/header';
import Logotype from './interface/logotype';
import InputCommandLine from './interface/inputCommandLine';
import SliderAudioVolume from './interface/sliderAudioVolume';
import IconsoleUI from './interface/iconsoleUI';
import iconsole from './interface/iconsole';
import Music from './interface/music';
// Style Main Page
import '../css/app.css';
// OpenGL or Canvas animation
import graphicsStart from './graphics/graphicsStart';
// WebSocket Connect
import socket from './webSocketClient';
// Speech Recognition
import { speechRec } from './speechRecognition';
// Main Page HTML
class App extends React.Component {
  componentDidMount() {
    iconsole.start();

    socket.start(process.env.HOSTNAME);
    speechRec();
  }
  resize = (e) => {
    console.log(e.clientY);
    const size = document.querySelector('#draw');
    size.style.height = `${e.clientY + 50}px`;
    graphicsStart();
    console.log(size.style.height);
  }
  render() {
    return (
      <div>
        <Header />
        <div className="underCanvas">
          <Logotype />
          <SliderAudioVolume />
          <IconsoleUI logType="serverLog" />
          <IconsoleUI logType="clientLog" />
        </div>
        <canvas  onClick={this.resize} id="draw" />
        <InputCommandLine />
        <Music ref={(musicPlayer) => { window.musicPlayer = musicPlayer }} />
        <audio src="" id="audio" />
        <audio src="" id="audio2" />
      </div>
    );
  }
}


export default App;
