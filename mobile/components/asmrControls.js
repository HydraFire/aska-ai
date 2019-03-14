import socket from './webSocketClient';

let trackList = [];
let prevTrack = -1;
let isPlaying = false;
let impulseInterval = false;
let waitingInterval = false;

function keepPlaing() {
  if (waitingInterval) {
    clearInterval(waitingInterval);
  }
}

function pausedWaiting() {
  let i = 0;
  if (!waitingInterval) {
    waitingInterval = setInterval(() => {
      i += 1;
      window.myconsole.log(i, 'err');
      if (i > 20) {
        stopAll();
        clearInterval(waitingInterval);
        waitingInterval = false;
      }
    }, 1000);
  }
}

function chooseTrack() {
  prevTrack += 1;
  prevTrack === trackList.length ? prevTrack = 0 : '';
  return trackList[prevTrack];
}

function randomDuration(audio) {
    audio.currentTime = Math.random() * audio.duration | 0;
}

function playAsmr(state) {
  typeof state != 'string' ? state = 'play' : '';
  window.myconsole.log('not first time, audio3 ended state: '+state, 'err');
  const audio = document.getElementById('audio3');
  //console.log(`state = ${state}`);
  if (state != 'stop') {
    audio.src = `http://localhost:8080/asmr/${chooseTrack()}`;
    audio.onloadeddata = () => {
      if (state == 'play') {
        audio.addEventListener('ended', playAsmr, { once: true });
      }
      if (state == 'next') {
        randomDuration(audio);
        audio.addEventListener('ended', playAsmr, { once: true });
      }
      isPlaying = true;
      audio.play();
    };
  } else {
    if (isPlaying) {
      audio.removeEventListener('ended', playAsmr, { once: true });
      audio.pause();
      isPlaying = false;
    }
  }
}

function stopAll() {
  playAsmr('stop');
  clearInterval(impulseInterval);
  impulseInterval = false;
}

function controls(obj) {
  //console.log(obj);
  switch (obj.command) {
    case 'start':
      playAsmr('stop');
      prevTrack = -1;
      trackList = obj.trackList;
      playAsmr('next');
      if (!impulseInterval) {
        impulseInterval = setInterval(() => {
          socket.send('impulse', 'impulse');
        }, 5*60*1000);
        document.getElementById('audio3').addEventListener('pause',() => {
          window.myconsole.log('audio3 paused', 'err');
          pausedWaiting();
        });
        document.getElementById('audio3').addEventListener('play',() => {
          window.myconsole.log('audio3 play', 'err');
          keepPlaing();
        });
      }
      break;
    case 'next':
      playAsmr('stop');
      playAsmr('next');
      break;
    case 'stop':
      stopAll();
      break;
    default:
      //console.log(obj.command);
      break;
  }
}

export { controls };
