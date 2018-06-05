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
/*
const askaButton = document.querySelector('#projectName');
console.log(askaButton);
askaButton.addEventListener('click', startStopRec);
*/

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
/*
const askaButton = document.querySelector('#main_container');

askaButton.addEventListener('touchend', () => {
  console.log('ok');
  window.scrollTo(360,0)
});
askaButton.addEventListener('touchcancel', () => {
  console.log('ok');
  window.scrollTo(360,0)
});
*/


const snapConfig = {
  scrollSnapDestination: '100% 0%', // *REQUIRED* scroll-snap-destination css property, as defined here: https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-snap-destination
  scrollTimeout: 100, // *OPTIONAL* (default = 100) time in ms after which scrolling is considered finished
  scrollTime: 300 // *OPTIONAL* (default = 300) time in ms for the smooth snap
}

function callback () {
  console.log('called when snap animation ends')
}

const element = document.getElementById('container');
console.log(element);
const snapObject = new ScrollSnap(element, snapConfig)
console.log(snapObject);

snapObject.bind(callback)
Kaleidoscope();
