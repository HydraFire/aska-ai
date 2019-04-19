import socket from './webSocketClient';
import { switchModeOnMute } from './speechSynthesizer';
import { animeteIPcheck } from './interface/animation';
let home_ip = JSON.parse(process.env.ASKA_HOME_IP);
function impulseToServer() {
  //window.myconsole.log('navigator.connection.type = ' + navigator.connection.type, 'err');
  animeteIPcheck(true);
  if (navigator.connection.type == 'wifi') {
    getIp()
    .then(
          result => {
            animeteIPcheck(false);
            switchModeOnMute(result);
            socket.send('impulse', 'impulse');
          },
          error => {
            //window.myconsole.log('ip error = ' + error, 'err');
            animeteIPcheck(false);
            switchModeOnMute(result);
            socket.send('impulse', 'impulse');
          }
      );
  } else {
    animeteIPcheck(false);
    switchModeOnMute(true);
    socket.send('impulse', 'impulse');
    //window.myconsole.log('socket.send(impulse, impulse);', 'string');
  }
}

function getIp() {
  let promise = new Promise((resolve, reject) => {
    //window.myconsole.log('start', 'err');
    let i = 0;
    let int = setInterval(() => {
      i += 1;
      //window.myconsole.log(i, 'err');
      if (i > 35) {
        clearInterval(int);
        resolve(true);
      }
    }, 100);
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then((obj) => {
        window.myconsole.log('ip = ' + obj.ip, 'text');
        if (home_ip.some(v => v == obj.ip)) {
          clearInterval(int);
          resolve(false);
        } else {
          clearInterval(int);
          resolve(true);
        }
      })
      .catch((err) => {
        clearInterval(int);
        //window.myconsole.log('ip promise fetch = ' + err, 'err');
      });
  });
  return promise;
}
export { impulseToServer, getIp };
