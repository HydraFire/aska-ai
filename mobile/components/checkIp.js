import socket from './webSocketClient';
import { switchModeOnMute } from './speechSynthesizer';
import { animeteIPcheck } from './interface/animation';
import { getCoords, init, promiseGeo } from './geolocation';

const home_ip = JSON.parse(process.env.ASKA_HOME_IP);
const home_gps = [50.435256, 30.620723]

function impulseToServer() {

  promiseGeo().then( gps => {

    switchModeOnMute( !(Math.abs(home_gps[0] - gps[0]) < 0.002 && Math.abs(home_gps[1] - gps[1]) < 0.002) )
    socket.send(getCoords(), 'impulse');

  }, () => {

    animeteIPcheck(true);
    if (navigator.connection.type == 'wifi') {
      getIp()
      .then(
            result => {
              animeteIPcheck(false)
              switchModeOnMute(result)
              socket.send(getCoords(), 'impulse');
            },
            error => {
              //window.myconsole.log('ip error = ' + error, 'err');
              animeteIPcheck(false);
              switchModeOnMute(result);
              socket.send(getCoords(), 'impulse');
            }
        );
    } else {
      animeteIPcheck(false);
      switchModeOnMute(true);
      socket.send(getCoords(), 'impulse');
      //window.myconsole.log('socket.send(impulse, impulse);', 'string');
    }
  })

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
