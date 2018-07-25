
import { aska } from './speechSynthesizer';
import { getmainInterval, play20Hz, stop20Hz } from './quest';


function clientTimeout(arr) {
  if (getmainInterval() == 0) {
    play20Hz();
  }
  arr = JSON.parse(arr);
  let r = 1;
  const int = setInterval(() => {
    if (r >= (parseFloat(arr[1]))) {
      aska(arr[0]);
      clearInterval(int);
      if (getmainInterval() == 0) {
        stop20Hz();
      }
    } else {
      r += 1;
    }
  }, 60000);
}
export default clientTimeout;
