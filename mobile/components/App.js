import React from 'react';
import NNEditor from './interface/NNEditor';
import ChallengeLog from './interface/challengeLog';
import ChartCom from './interface/chartComponent';
import StyleOption from './interface/styleOption';
import clientTimeout from './clientTimeout';
import { initAudio } from './speechSynthesizer';
import Logo from './interface/logo.js';


import '../css/logotype.css';

class App extends React.Component {
  componentDidMount() {
    initAudio();
  }
  handler = () => {
    clientTimeout(JSON.stringify(['молодец', 15]));
  }
  render() {
    const audio = `${process.env.FILESERVER}20Hz.mp3`;
    return (
      <div>
        <div id="container">
          <div className="page" id="main_div">
            <Logo onClick={this.handler} />
            <div className="words" />
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
        <audio src={audio} id="audio" />
        <audio src="" id="audio2" />
      </div>
    );
  }
}


export default App;
