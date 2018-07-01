import React from 'react';
import NNEditor from './interface/NNEditor';
import { initAudio } from './speechSynthesizer';

import '../css/inputCommandLine.css';
import '../css/logotype.css';

class App extends React.Component {
  componentDidMount() {
    initAudio();
    // graphicsStart();
    // socket.start(process.env.HOSTNAME);
    // speechRec();
  }
  render() {
    return (
      <div>
        <div id="container">
          <div className="page" id="main_div">
            <canvas id="draw" width="360" height="720" />
            <div className="words" />
            <div className="inputConteiner">
              <input className="inputCommandLine" type="text" placeholder="" />
            </div>
          </div>
          <div className="page">
            <div id="cube0">360x720
              <button id="unsubscribe">unsubscribe</button>
              <button id="subscribe">subscribe</button>
            </div>
          </div>
          <div className="page">
            <div id="cube1">360x720</div>
          </div>
          <div className="page">
            <div id="cube2">
              <NNEditor ref={(editorComponent) => { window.editorComponent = editorComponent }}/>
            </div>
          </div>
        </div>
        <video id="video" src="https://localhost:8080/coub/video.mp4" autoPlay loop />
        <audio src="https://localhost:8080/coub/audio.mp3" id="audio" />
        <audio src="" id="audio2" />
      </div>
    );
  }
}


export default App;
