import socket from './webSocketClient';
import { aska } from './speechSynthesizer';

let mainInterval = 0;
let impulseInterval = 0;
let removeEvent = false;

function play20Hz() {
  const audio2 = document.getElementById('audio2');
  function lol() {
    audio2.play();
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
  window.myconsole.log('chargeImpulse', 'err');
  window.addEventListener('devicemotion', deviceHandler, { once: true });
}
// /////////////////////////////////////////////////////////////////////////////
function intervalGO(arr) {
  function finishIntervals(obj) {
    window.myconsole.log(JSON.stringify(obj), 'string');

    clearInterval(impulseInterval);
    impulseInterval = 0;

    arr = arr.filter(v => v.quest != obj.quest);

    if (arr.length == 0) {
      clearInterval(mainInterval);
      mainInterval = 0;
      stop20Hz();
    }
  }
  function impulse(obj) {
    let i = 0;
    let t = 0;
    impulseInterval = setInterval(() => {
      i += 10;
      t += 10;
      t < 70 ? aska(obj.say[Math.random() * obj.say.length | 0]) : '';
      t > 300 ? t = 0 : '';
      i > 1800 ? finishIntervals(obj) : '';
    }, 10000);
    window.addEventListener('devicemotion', () => {
      finishIntervals(obj);
    }, { once: true });
  }

  mainInterval = setInterval(() => {
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
