import socket from './webSocketClient';

let mainInterval = 0;
let impulseInterval = 0;

function intervalGO(arr) {
  function impulse(obj) {
    impulseInterval = setInterval(() => {
      // console.log(Date.now());

      v.startDate
    }, 10000);
  
    socket.send('impulse', 'impulse');
  }
  mainInterval = setInterval(() => {
    // console.log(Date.now());
    arr.forEach(v => Date.now() > v.startDate && impulseInterval == 0 ? impulse(v) : '');
  }, 60000);
}

function twoArr(arr) {
  if (mainInterval == 0) {
    intervalGO(arr);
  } else {
    clearInterval(mainInterval);
    intervalGO(arr);
  }
}

export default twoArr;
