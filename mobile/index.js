// let's go!
import React from 'react';
import { render } from 'react-dom';
import ScrollSnap from 'scroll-snap';

import App from './components/App';
import './css/logotype.css';
import './css/inputCommandLine.css';

import socket from './components/webSocketClient';
import { speechRec, startStopRec } from './components/speechRecognition';
import { newMessage } from './components/interface/displayCanvasMessage';
// import Kaleidoscope from './graphics/Kaleidoscope';
import Coub from './graphics/Coub';
import pushNotification from './components/pushNotification';

render(<App />, document.querySelector('#main'));
// ////////////////////////////////////////////////////////////////////////////
socket.start();
speechRec();
// /////////////////////////////////////////////////////////////////////////////
const askaButton = document.querySelector('#main_div');
askaButton.addEventListener('click', startStopRec);
// /////////////////////////////////////////////////////////////////////////////
const commandLine = document.querySelector('.inputCommandLine');
commandLine.onkeydown = function onkeydown(e) {
  if (e.keyCode === 13) {
    if (this.value !== '') {
      newMessage(this.value, true);
      socket.send(this.value);
      this.value = '';
    }
  }
};
// /////////////////////////////////////////////////////////////////////////////
const snapConfig = {
  scrollSnapDestination: '100% 0%',
  scrollTimeout: 300,
  scrollTime: 500
};

function callback(e) {
  console.log('called when snap animation ends');
}

const element = document.getElementById('container');
const snapObject = new ScrollSnap(element, snapConfig);
snapObject.bind(callback);
element.style.overflowY = 'hidden';
// /////////////////////////////////////////////////////////////////////////////
pushNotification.subscribeBS();
// ////////////////////////////////////////////////////////////////////////////
Coub();
// Kaleidoscope();
