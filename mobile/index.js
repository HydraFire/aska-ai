/* eslint-disable */
import React from 'react';
import { render } from 'react-dom';
// import ScrollSnap from 'scroll-snap';

import App from './components/App';
import './css/logotype.css';
import './css/inputCommandLine.css';

import socket from './components/webSocketClient';
import { speechRec, startStopRec } from './components/speechRecognition';
import { newMessage } from './components/interface/displayCanvasMessage';
// import Kaleidoscope from './graphics/Kaleidoscope';
// import Coub from './graphics/Coub';
// import pushNotification from './components/pushNotification';

render(<App />, document.querySelector('#main'));
// ////////////////////////////////////////////////////////////////////////////
socket.askaSwitchMute();
speechRec();
//turn_Off_On_Sound();
// /////////////////////////////////////////////////////////////////////////////
const askaButton = document.querySelector('.main');
askaButton.addEventListener('click', startStopRec);
// /////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////

/*
function turn_Off_On_Sound() {
  chrome.tabs.query({url: []}, function (tabs) {
    for (var i = 0; i < tabs.length; i++) {
      var mutedInfo = tabs[i].mutedInfo;
      if (mutedInfo) chrome.tabs.update(tabs[i].id, {"muted": true});
    }
  });
}
*/
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
// /////////////////////////////////////////////////////////////////////////////
// pushNotification.subscribeBS();
// ////////////////////////////////////////////////////////////////////////////
// Coub();
/*
window.requestIdleCallback = () => {
  alert('lol')
}
*/
// Kaleidoscope();
