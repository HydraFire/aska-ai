// let's go!
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

Kaleidoscope();
