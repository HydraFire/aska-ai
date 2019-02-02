
let isitPlaying = false;
let trackList = [];
let prevTrack;
let questInterval;

function playAsmr(state) {
  typeof state != 'string' ? state = 'play' : '';
  const audio = document.getElementById('audio3');
  console.log(`state = ${state}`);
  if (state != 'stop') {
    let track = chooseTrack();
    console.log(`track = ${track}`);
    audio.src = `http://localhost:8080/asmr/${track}`;
    audio.onloadeddata = () => {
      audio.currentTime = Math.random() * audio.duration | 0;
      console.log(`Math.random() = ${Math.random() * audio.duration | 0}`);
      audio.play();
      console.log(`audio.currentTime = ${audio.currentTime}`);
      isitPlaying = true;
    };
    if (state == 'play') {
      audio.addEventListener('ended', playAsmr, { once: true });
    }
  } else {
    audio.removeEventListener('ended', playAsmr, { once: true });
    audio.pause();
    isitPlaying = false;
  }
}

function chooseTrack() {
  let test = trackList;
  console.log(test);
  test = test.filter(v => v != prevTrack);
  console.log(test);
  if (test.length > 0) {
    prevTrack = test[Math.random() * test.length | 0];
  } else {
    prevTrack = trackList[0];
  }
  return prevTrack;
}

function checkPlaing(arr) {
  trackList = arr;
  if (isitPlaying) {
    playAsmr('next');
  } else {
    playAsmr('play');
    getControlQuestInterval('start');
  }
}

function getControlQuestInterval(state) {
  console.log(`getControlQuestInterval = ${state};`);
  if (state == 'start') {
    /*
    questInterval = setInterval(()=>{
      impulseToServer();
    }, 5*60*1000);
    */
  } else {
    clearInterval(questInterval);
  }
}

function stopAsmr() {
  console.log(`isitPlaying = ${isitPlaying}`);
  if(isitPlaying) {
    playAsmr('stop');
    getControlQuestInterval('stop');
  }
}

function controls(obj) {
  console.log(obj);
  switch (obj.command) {
    case 'start':
      checkPlaing(obj.trackList);
      break;
    case 'stop':
      stopAsmr();
      break;
    default:
      console.log(obj.command);
      break;
  }
}

export { controls };
