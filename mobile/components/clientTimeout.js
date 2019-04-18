import socket from './webSocketClient';
import { aska, askStateAskaHide } from './speechSynthesizer';
import { getmainInterval, play20Hz, stop20Hz } from './quest';

function play110Hz() {
  const audio = document.getElementById('audio');
  audio.src = 'http://localhost:8080/coub/110Hz.mp3';
  audio.onloadeddata = () => {
    audio.play();
  };
}

function clientTimeout(arr) {
  if (getmainInterval() == 0) {
    play20Hz();
  }
  arr = JSON.parse(arr);
  let r = 1;
  const int = setInterval(() => {
    if (r >= (parseFloat(arr[1]))) {
      if (askStateAskaHide()) {
        play110Hz();
      } else {
        aska(arr[0]);
      }
      clearInterval(int);
      socket.send('done', 'lifeCirclesResponse');
      if (getmainInterval() == 0) {
        stop20Hz();
      }
    } else {
      r += 1;
    }
  }, 60000);
}
export default clientTimeout;
