
import { aska } from './speechSynthesizer';


function clientTimeout(arr) {
  window.myconsole.noSleep();
  arr = JSON.parse(arr);
  let r = 1;
  const int = setInterval(() => {
    if (r >= (parseFloat(arr[1]))) {
      aska(arr[0]);
      clearInterval(int);
      window.myconsole.noSleep();
    } else {
      r += 1;
    }
  }, 60000);
}
export default clientTimeout;
