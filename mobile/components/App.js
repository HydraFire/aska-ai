import React from 'react';
import NNEditor from './interface/NNEditor';
import ChallengeLog from './interface/challengeLog';
import ChartCom from './interface/chartComponent';
import StyleOption from './interface/styleOption';
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
    let video = `${process.env.FILESERVER}video0.mp4`;
    let audio = `${process.env.FILESERVER}audio0.mp3`;
    if (localStorage.styleOption) {
      let obj = JSON.parse(localStorage.styleOption);
      const x = new Date().getHours();
      console.log(x);
      if (x > 21) {
        video = obj.int2.video;
        audio = obj.int2.music;
      } else if (x > 11) {
        video = obj.int1.video;
        audio = obj.int1.music;

      } else if (x > 4) {
        video = obj.int0.video;
        audio = obj.int0.music;
      }
    }
    console.log(audio)
      console.log(video);
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
            <div id="cube0">
              <StyleOption />
            </div>
          </div>
          <div className="page">
            <div id="cube1">
              <ChallengeLog ref={(cLogComponent) => { window.cLogComponent = cLogComponent }} />
            </div>
          </div>
          <div className="page">
            <div id="cube2">
              <NNEditor ref={(editorComponent) => { window.editorComponent = editorComponent }}/>
            </div>
          </div>
          <div className="page2x">
            <ChartCom ref={(chartComponent) => { window.chartComponent = chartComponent }}/>
          </div>
        </div>
        <video id="video" src={video} autoPlay loop />
        <audio src={audio} id="audio" />
        <audio src={audio} id="audio2" />
      </div>
    );
  }
}


export default App;
