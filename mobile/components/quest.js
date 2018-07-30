import socket from './webSocketClient';
import { aska } from './speechSynthesizer';

let mainInterval = 0;
let impulseInterval = 0;
let nowObj = {};
let removeEvent = false;

function play20Hz() {
  const audio2 = document.getElementById('audio2');
  function lol() {
    audio2.play();
    console.log(removeEvent);
  }
  if (!removeEvent) {
    audio2.src = 'http://localhost:8080/coub/20Hz.mp3';
    audio2.addEventListener('ended', lol, false);
    audio2.play();
    audio2.volume = 0.1;
    const rrr = setInterval(() => {
      if (removeEvent) {
        audio2.removeEventListener('ended', lol, false);
        removeEvent = false;
        clearInterval(rrr);
      }
    }, 1000);
  }
}

function stop20Hz() {
  removeEvent = true;
}

function getmainInterval() {
  return mainInterval;
}
function deviceHandler() {
  socket.send('impulse', 'impulse');
  window.myconsole.log('socket.send(impulse, impulse);', 'string');
}
function chargeImpulse() {
  window.addEventListener('devicemotion', deviceHandler, { once: true });
}
// /////////////////////////////////////////////////////////////////////////////
function intervalGO(arr) {
  function deviceMotionHandler() {
  //  if ((e.acceleration.x + e.acceleration.y + e.acceleration.z | 0) > 0) {
    // setTimeout(() => {
  //    window.removeEventListener('devicemotion', deviceMotionHandler);
    clearInterval(impulseInterval);
    impulseInterval = 0;
    socket.send('impulse', 'impulse');
    window.myconsole.log('socket.send(impulse, impulse);', 'string');
    arr = arr.filter(v => v.quest != nowObj.quest);
    if (arr.length == 0) {
      clearInterval(mainInterval);
      mainInterval = 0;
      stop20Hz();
      // console.log('final');
    }
    nowObj = {};
    // }, 15000);
  //  }
  }
  function impulse(obj) {
    window.myconsole.log('impulse(obj)', 'string');
    nowObj = obj;
    window.addEventListener('devicemotion', deviceMotionHandler, { once: true });
    impulseInterval = setInterval(() => {
      aska(nowObj.say[Math.random() * nowObj.say.length | 0]);
    }, 10000);
  }
  mainInterval = setInterval(() => {
    // window.myconsole.log(JSON.stringify(arr), 'string');
    arr.forEach(v => Date.now() > v.startDate && impulseInterval == 0 ? impulse(v) : '');
  }, 60000);
}

function twoArr(arr) {
  if (mainInterval == 0) {
    window.myconsole.log('intervalGO(arr);', 'string');
    play20Hz();
    intervalGO(arr);
  } else {
    clearInterval(mainInterval);
    window.myconsole.log('clearInterval(mainInterval);', 'string');
    window.myconsole.log('intervalGO(arr);', 'string');
    intervalGO(arr);
  }
}

export { twoArr, getmainInterval, play20Hz, stop20Hz, chargeImpulse };
