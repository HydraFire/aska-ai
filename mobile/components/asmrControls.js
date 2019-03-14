import socket from './webSocketClient';

let trackList = [];
let prevTrack = -1;
let isPlaying = false;
let impulseInterval = false;


function chooseTrack() {
  prevTrack += 1;
  prevTrack === trackList.length ? prevTrack = 0 : '';
  return trackList[prevTrack];
}

function randomDuration(audio) {
    audio.currentTime = Math.random() * audio.duration | 0;
}

function playAsmr(state) {
  window.myconsole.log('not first time, audio3 ended state: '+state, 'err');
  typeof state != 'string' ? state = 'play' : '';
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
        })
      }
      break;
    case 'next':
      playAsmr('stop');
      playAsmr('next');
      break;
    case 'stop':
      playAsmr('stop');
      clear(impulseInterval);
      impulseInterval = false;
      break;
    default:
      //console.log(obj.command);
      break;
  }
}

export { controls };
