import React, { Fragment } from 'react';
import { aska } from '../speechSynthesizer';
import socket from '../webSocketClient';
import '../../css/logo.css';

function deviceMotionHandler(e) {
  console.log(e.acceleration);
  window.myconsole.log(JSON.stringify(e.acceleration),'string');
  let sym = e.acceleration.x + e.acceleration.y + e.acceleration.z;
  if (sym > 0) {
    window.removeEventListener("devicemotion", deviceMotionHandler);
    aska(`это победа`);
  }
}

function test2() {
  setTimeout(()=>{
    window.myconsole.log(`window.DeviceMotionEvent = ${window.DeviceMotionEvent}`,'string');
    window.addEventListener("devicemotion", deviceMotionHandler);
  },5000);
  //setInterval(() => {
  //}, 1000);
}

function test() {
  const audio = document.querySelector('#audio');
//  audio.src = `${process.env.FILESERVER}napominanie.mp3`;

  const audio2 = document.getElementById('audio2');
  audio2.src = `${process.env.FILESERVER}20Hz.mp3`;
  function lol() {
    audio2.play();
  }
  audio2.addEventListener('ended', lol, false);
  audio2.play();
  audio2.volume = 0.1;
  //window.myconsole.log('start','err');
   let r = 0;
   const int = setInterval(() => {
     let x = new Date();

    if (x.getHours() == 21 && x.getMinutes() == 15) {
       audio.removeEventListener('ended', lol, false);
       aska(`текущее время, ${x.getHours()} часов, ${x.getMinutes()} минут, четвертый тест пройден успешно`);
       clearInterval(int);
     } else {
       r += 1;
       window.myconsole.log(`цикл интервала ${r}`, 'string');
       window.myconsole.log(`${x.getHours()}:${x.getMinutes()}`, 'string');
     }
   }, 60000);
}
// var previousOrientation = window.orientation;
function checkOrientation() {
  //  if(window.orientation !== previousOrientation){
  //      previousOrientation = window.orientation;
  //  }
  if (window.orientation === 90) {
    document.querySelectorAll('.circle').forEach(v => v.className = 'circle-portable');
    document.querySelector('.circle-static').className = 'circle-static-portable';
  } else {
    document.querySelectorAll('.circle-portable').forEach(v => v.className = 'circle');
    document.querySelector('.circle-static-portable').className = 'circle-static';
  }
}
function activeInput(n) {
  const commandLine = document.querySelector('.inputCommandLine');
  if (n) {
    commandLine.onkeydown = function onkeydown(e) {
      if (e.keyCode === 13) {
        if (this.value !== '') {
          window.myconsole.log(this.value, 'chat');
          socket.send(this.value);
          this.value = '';
        }
      }
    };
  } else {
    commandLine.onkeydown = '';
  }
}

function init() {
  window.addEventListener('orientationchange', checkOrientation, false);
}
// /////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////

class Logo extends React.Component {
  constructor() {
    super();
    this.state = {
      console: false,
      arr: []
    };
  }
  log = (text, type) => {
    const arr = this.state.arr;
    arr.push({ text, type });
    this.setState({ arr });
  }
  animete = () => {
    document.querySelector('#c2').id = 'cSpeed';
  }
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
            ASKA version: 3.1    I give you this pain with love
          </div>
          <div className="console_center">
            {this.myRender()}
          </div>
          <div className="console_bottom">
            <input className="inputCommandLine" type="text" placeholder="" />
          </div>
        </div>
      );
    } else {
      return <video className="nosleep-video" src={`${process.env.FILESERVER}noSleep.mp4`}/>
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
  componentDidMount() {
    init();
    test();
    test2();
  }

  noSleep = () => {
    let video = document.querySelector('.nosleep-video');
    video.paused ? video.play() : video.pause();
  }
  render() {
    const svg1 = `${process.env.FILESERVER}index-portal-red-semi-085b4e44d49b2ffe935cc1b2b3094ce8.svg`;
    const svg2 = `${process.env.FILESERVER}index-portal-red-be5d1b8a52c13bf286560aba3e4c8c30.svg`;
    const svg3 = `${process.env.FILESERVER}index-portal-orange-semi-d2010f0f8e41e03dbf2b5c52166abe4b.svg`;
    const svg4 = `${process.env.FILESERVER}index-portal-orange-b3bddfb758b91d22f43d0e14ed8e29da.svg`;
    const svg5 = `${process.env.FILESERVER}index-portal-yellow-semi-545681fe77ff01659d472bd379a9f38b.svg`;
    const svg6 = `${process.env.FILESERVER}index-portal-yellow-ff207a58ad4f450ea9ac0e17224b39f1.svg`;
    const svg7 = `${process.env.FILESERVER}index-portal-green-semi-2d5bc571ee90e710d93f7ae7ddd06e85.svg`;
    const svg8 = `${process.env.FILESERVER}index-portal-green-6ab85a1e7343a232273868031b242806.svg`;
    const svg9 = `${process.env.FILESERVER}index-portal-blue-semi-7333f1323549be50644411b691b173dd.svg`;
    const svg10 = `${process.env.FILESERVER}index-portal-blue-92fc2c151190795bd0147c03d4fb8352.svg`;
    const svg11 = `${process.env.FILESERVER}index-portal-sides-7d999cb5d5762880eef4ede55549d5c6.svg`;
    return (
      <Fragment>
      <button onClick={this.consoleButton} className="consoleButton"></button>
      <div className="main">
        <div className="hero-logo-div">
          <img className="circle" id="c1" src={svg1} alt="lol" />
          <img className="circle" id="c2" src={svg2} alt="lol" />
          <img className="circle" id="c3" src={svg3} alt="lol" />
          <img className="circle" id="c4" src={svg4} alt="lol" />
          <img className="circle" id="c5" src={svg5} alt="lol" />
          <img className="circle" id="c6" src={svg6} alt="lol" />
          <img className="circle" id="c7" src={svg7} alt="lol" />
          <img className="circle" id="c8" src={svg8} alt="lol" />
          <img className="circle" id="c9" src={svg9} alt="lol" />
          <img className="circle" id="c10" src={svg10} alt="lol" />
        </div>
        <img className="circle-static" src={svg11} alt="lol" />
          {/*
            <div>
              <button id="unsubscribe">unsubscribe</button>
              <button id="subscribe">subscribe</button>
            </div>
          */}
      </div>
      {this.console()}
      </Fragment>
    );
  }
}


export default Logo;
