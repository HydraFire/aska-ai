import aska from './speechSynthesizer';

function clientTimeout(arr) {
  arr = JSON.parse(arr);
  const audio = document.getElementById('audio');
  let r = 0;
  const int = setInterval(() => {
    /*
    if (r === 0) {
      audio.volume = 0.01;
      aska('ой');
    }
    */
    if (r >= (parseFloat(arr[1]) * 2)) {
      audio.volume = 0.7;
      aska(arr[0]);
      clearInterval(int);
    } else {
      r += 1;
      // audio.play();
    }
  }, 30000);
}
export default clientTimeout;
