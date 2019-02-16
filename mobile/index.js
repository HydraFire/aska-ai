/* eslint-disable */
import React from 'react';
import { render } from 'react-dom';
import SystemSetting from 'react-native-system-setting'
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
// /////////////////////////////////////////////////////////////////////////////
const askaButton = document.querySelector('.main');
askaButton.addEventListener('click', startStopRec);
// /////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////
const volumeListener = SystemSetting.addVolumeListener((data) => {
    const volume = data.value;
    window.myconsole.log(volume, 'err');
});
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
