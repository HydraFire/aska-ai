/* eslint-disable */
import React from 'react';
import { render } from 'react-dom';
// import ScrollSnap from 'scroll-snap';

import App from './components/App';
import './css/logotype.css';
import './css/inputCommandLine.css';

import socket from './components/webSocketClient';
import { speechRecInit, startStopRec } from './components/speechRecognition';
//import { newMessage } from './components/interface/displayCanvasMessage';

render(<App />, document.querySelector('#main'));
// ////////////////////////////////////////////////////////////////////////////
socket.askaSwitchMute();
speechRecInit();
// /////////////////////////////////////////////////////////////////////////////
document.addEventListener('contextmenu', evt => evt.preventDefault());
// /////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////
/*
const snapConfig = {
  scrollSnapDestination: '100% 0%',
  scrollTimeout: 300,
  scrollTime: 500
};

function callback(e) {
  // console.log('called when snap animation ends');
}

const element = document.getElementById('container');
const snapObject = new ScrollSnap(element, snapConfig);
snapObject.bind(callback);
element.style.overflowY = 'hidden';
*/
