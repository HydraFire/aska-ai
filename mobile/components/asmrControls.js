let trackList = [];
let prevTrack = -1;
let isPlaying = false;

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
      break;
    case 'next':
      playAsmr('stop');
      playAsmr('next');
      break;
    case 'stop':
      playAsmr('stop');
      break;
    default:
      //console.log(obj.command);
      break;
  }
}

export { controls };
