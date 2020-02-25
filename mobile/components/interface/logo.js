import React, { Fragment } from 'react';
import { aska } from '../speechSynthesizer';
import socket from '../webSocketClient';
import InteractWindow from './interactWindow';
import { speechRecInit, startStopRec } from '../../components/speechRecognition';
import '../../css/logo.css';

let int;

function closeWindowInterval(time) {
  if (time) {
    let i = 0;
    int = setInterval(() => {
      i += 1;
      if (i > time) {
        socket.send('speech_end','AUDIO');
        window.myconsole.handlerInteractWindow(false);
        clearInterval(int);
      }
    }, 1000);
  } else {
    clearInterval(int);
  }
}
function activeInput(n) {
  const commandLine = document.querySelector('.inputCommandLine');
  if (n) {
    commandLine.onkeydown = function onkeydown(e) {
      if (e.keyCode === 13) {
        if (this.value !== '') {
          window.myconsole.log(this.value, 'chat');
          if (this.value.includes('nightmare')) {
            socket.send(this.value, 'code');
          } else {
            socket.send(this.value, 'aska');
          }
          this.value = '';
        }
      }
    };
  } else {
    commandLine.onkeydown = '';
  }
}
function restoreCharts() {
  localStorage.chartButtons = [];
  window.myconsole.log('localStorage.chartButtons = [];', 'err');
}
// /////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////

class Logo extends React.Component {
  constructor() {
    super();
    this.state = {
      interactWindow: false,
      console: false,
      arr: []
    };
  }
  log = (text, type) => {
    this.setState({ arr: [{ text, type }, ...this.state.arr] });
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    this.state.console ?
    document.querySelector('body').style.overflowX = 'auto':
    document.querySelector('body').style.overflowX = 'hidden';
  }
  // //////////////////////////////////////////////////////////////////////////
  // ///////////////////////////////////////////////////////////////////////////
  myRender = () => {
    return this.state.arr.map((v, i) => {
      if (v.type === 'string') {
        return <p key={`${v.text}${i}`} className="console_string">{v.text}</p>
      } else if (v.type === 'html') {
        return <p key={`${v.text}${i}`} className="console_html" dangerouslySetInnerHTML={{__html: v.text}}></p>
      } else if (v.type === 'chat') {
        return <p key={`${v.text}${i}`} className="console_chat">{v.text}</p>
      } else if (v.type === 'err') {
        return <p key={`${v.text}${i}`} className="console_err">{v.text}</p>
      } else {
        return <p key={`${v.text}${i}`} className="console_aska">{v.text}</p>
      }
    })
  }
  console = () => {
    if (this.state.console) {
      return (
        <div className="console">
          <div className="console_top">
            ASKA version: 3.7  <br/>  <span>I give you this pain with love</span>
          </div>
          <div className="console_bottom">
            <input className="inputCommandLine" type="text" placeholder="" />
          </div>
          <div className="console_center">
            {this.myRender()}
          </div>
        </div>
      );
    }
  }
  consoleButton = () => {
    if (this.state.console) {
      activeInput(false);
      this.setState({console: false});
    } else {
      this.setState({console: true});
      setTimeout(() => {
        activeInput(true);
      }, 200);
    }
  }
  handlerInteractWindow = (obj) => {
    if (!this.state.console || obj == false) {
      this.setState({interactWindow: obj});
      obj ? closeWindowInterval(28) : closeWindowInterval(false);
    } else {
      setTimeout(() => {
        socket.send('speech_end','AUDIO');
      }, 500);
    }
  }
  renderInteractWindow = () => {
    if (this.state.interactWindow) {
      return <InteractWindow obj={this.state.interactWindow} handlerInteractWindow={this.handlerInteractWindow}/>
    }
  }
//  componentDidMount() {

//  }
  render() {
    const svg1 = 'http://localhost:8080/coub/index-portal-red-semi-085b4e44d49b2ffe935cc1b2b3094ce8.svg';
    const svg2 = 'http://localhost:8080/coub/index-portal-red-be5d1b8a52c13bf286560aba3e4c8c30.svg';
    const svg3 = 'http://localhost:8080/coub/index-portal-orange-semi-d2010f0f8e41e03dbf2b5c52166abe4b.svg';
    const svg4 = 'http://localhost:8080/coub/index-portal-orange-b3bddfb758b91d22f43d0e14ed8e29da.svg';
    const svg5 = 'http://localhost:8080/coub/index-portal-yellow-semi-545681fe77ff01659d472bd379a9f38b.svg';
    const svg6 = 'http://localhost:8080/coub/index-portal-yellow-ff207a58ad4f450ea9ac0e17224b39f1.svg';
    const svg7 = 'http://localhost:8080/coub/index-portal-green-semi-2d5bc571ee90e710d93f7ae7ddd06e85.svg';
    const svg8 = 'http://localhost:8080/coub/index-portal-green-6ab85a1e7343a232273868031b242806.svg';
    const svg9 = 'http://localhost:8080/coub/index-portal-blue-semi-7333f1323549be50644411b691b173dd.svg';
    const svg10 = 'http://localhost:8080/coub/index-portal-blue-92fc2c151190795bd0147c03d4fb8352.svg';
    const svg11 = 'http://localhost:8080/coub/index-portal-sides-7d999cb5d5762880eef4ede55549d5c6.svg';
    return (
      <Fragment>
      <button onClick={()=>{
        console.log('test');
        startStopRec()
      }} className="micButton"></button>
      <button onClick={this.consoleButton} className="consoleButton"></button>
      <div className="main">
        <div className="hero-logo-div">
          <img className="circle" id="c1" src={svg1} alt="ASKA" />
          <img className="circle" id="c2" src={svg2} alt="ASKA" />
          <img className="circle" id="c3" src={svg3} alt="ASKA" />
          <img className="circle" id="c4" src={svg4} alt="ASKA" />
          <img className="circle" id="c5" src={svg5} alt="ASKA" />
          <img className="circle" id="c6" src={svg6} alt="ASKA" />
          <img className="circle" id="c7" src={svg7} alt="ASKA" />
          <img className="circle" id="c8" src={svg8} alt="ASKA" />
          <img className="circle" id="c9" src={svg9} alt="ASKA" />
          <img className="circle" id="c10" src={svg10} alt="ASKA" />
        </div>
        <img className="circle-static" src={svg11} alt="ASKA" />
      </div>
      {this.console()}
      {this.renderInteractWindow()}
      </Fragment>
    );
  }
}


export default Logo;
