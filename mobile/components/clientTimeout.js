
import NoSleep from 'nosleep.js';
import { aska } from './speechSynthesizer';


function clientTimeout(arr) {
  const noSleep = new NoSleep();
  noSleep.enable();
  arr = JSON.parse(arr);
  let r = 1;
  const int = setInterval(() => {
    if (r >= (parseFloat(arr[1]))) {
      aska(arr[0]);
      clearInterval(int);
      noSleep.disable();
    } else {
      r += 1;
    }
  }, 60000);
}
export default clientTimeout;
