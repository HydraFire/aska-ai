// let's go!
import ScrollSnap from 'scroll-snap';
import './css/logotype.css';
import './css/inputCommandLine.css';

import socket from './components/webSocketClient';
import DisplayWordsClass from './components/interface/displayWordsClass';
import { speechRec, startStopRec } from './components/speechRecognition';
import Kaleidoscope from './Kaleidoscope';

socket.start();
speechRec();

const askaButton = document.querySelector('#main_div');
askaButton.addEventListener('click', startStopRec);


const display = new DisplayWordsClass();
const commandLine = document.querySelector('.inputCommandLine');
commandLine.onkeydown = function onkeydown(e) {
  if (e.keyCode === 13) {
    if (this.value !== '') {
      display.displayWords(this.value);
      display.displayWordsFinal('🎤');
      socket.send(this.value);
      this.value = '';
    }
  }
};

const snapConfig = {
  scrollSnapDestination: '100% 0%',
  scrollTimeout: 300,
  scrollTime: 500
};

function callback() {
  console.log('called when snap animation ends');
}

const element = document.getElementById('container');
const snapObject = new ScrollSnap(element, snapConfig);
snapObject.bind(callback);

Kaleidoscope();
