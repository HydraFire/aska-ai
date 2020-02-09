import React from 'react';
import NNEditor from './interface/NNEditor';
import ChallengeLog from './interface/challengeLog';
import ChartCom from './interface/chartComponent';
import clientTimeout from './clientTimeout';
import { initAudio } from './speechSynthesizer';
import { init } from './geolocation';
import Logo from './interface/logo';


import '../css/logotype.css';

class App extends React.Component {
  componentDidMount() {
    initAudio();
    //init()
  }
  render() {
    return (
      <div>
        <div id="container">
          <div className="page2" id="main_div">
            <Logo ref={(myconsole) => { window.myconsole = myconsole }}/>
          </div>
          <div className="page">
            <div id="cube2">
              <NNEditor ref={(editorComponent) => { window.editorComponent = editorComponent }}/>
            </div>
          </div>
          <div className="page">
            <div id="cube1">
              <ChallengeLog ref={(cLogComponent) => { window.cLogComponent = cLogComponent }} />
            </div>
          </div>
          <div className="page2x">
            <ChartCom ref={(chartComponent) => { window.chartComponent = chartComponent }}/>
          </div>
        </div>
        <audio src="" id="audio" />
        <audio src="" id="audio2" />
        <audio src="" id="audio3" />
      </div>
    );
  }
}


export default App;
