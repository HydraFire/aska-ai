import iconsole from './interface/iconsole';
import pushNotification from './pushNotification';
import aska from './speechSynthesizer';
import clientFunction from './functions/functionStart';
import { newImagesLoad } from './graphics/animation/Kaleidoscope';
// ////////////////////////// SOCKET CLIENT /////////////////////////////////////
// ////////////////////////// SOCKET CLIENT /////////////////////////////////////
// ////////////////////////// SOCKET CLIENT /////////////////////////////////////
// ////////////////////////// SOCKET CLIENT /////////////////////////////////////
let socket = null;
let impulseInterval;
// Функция которая используеться для отправки на сервер
function send(data, type) {
  if (data !== '') {
    !type ? type = 'aska' : '';
    type === 'aska' ? data = data.toLowerCase() : '';
    if (type === 'upload') {
      socket.send(data);
    } else {
      const obj = {
        type,
        data
      };
      socket.send(JSON.stringify(obj));
      // Чтобы мы всегда видели отправляюшийся сокет
      iconsole.logC('socket.send(string)');
      // Добавляет в память последний отправленый сокет
      localStorage.inputMemory = data;
    }
  }
}
function goToUrl(url) {
  document.location.href = url;
}
// Чтобы веб сокеты запускалить после прогрузки страници и графики на ней
// ////////////////////////// SOCKET CLIENT /////////////////////////////////////
// ////////////////////////// SOCKET CLIENT /////////////////////////////////////
// ////////////////////////// SOCKET CLIENT /////////////////////////////////////
// ////////////////////////// SOCKET CLIENT /////////////////////////////////////
// ////////////////////////// SOCKET CLIENT /////////////////////////////////////
// ////////////////////////// SOCKET CLIENT /////////////////////////////////////
function start(ip) {
  if (localStorage.aska_ip) {
    ip = localStorage.aska_ip;
  }
  socket = new WebSocket(ip);

  socket.onopen = function onopen() {
    iconsole.logC('SOCKET CONNECT');
    localStorage.aska_ip = ip;
    localStorage.test_token ? send([0,0,localStorage.test_token], 'TOKEN') : send('*', 'TOKEN');
    impulseInterval = setInterval(() => {
      send([0,0],'impulse');
    }, 5*60*1000);
  };

  socket.onmessage = function onmessage(event) {
    const message = JSON.parse(event.data);
    switch (message.type) {
      case 'aska':
        aska(message.data);
        break;
      case 'clientFunction':
        clientFunction(message.data);
        break;
        /*
      case 'notificationPublicKey':
        pushNotification.setVapidPublicKey(message.data);
        iconsole.logS(message.data);
        break;
        */
      case 'token':
        localStorage.test_token = message.data;
        iconsole.logS('TOKEN is accepted');
        break;
      case 'music':
        if (message.data.name === 'stop') {
          window.musicPlayer.pause();
        } else if (message.data.name === 'volume') {
          window.musicPlayer.volume(message.data.data);
        } else if (message.data.name === 'tag') {
          window.musicPlayer.addTag(message.data.tag, message.data.alltags);
        } else {
          window.musicPlayer.play(message.data);
        }
        break;
      case 'getImgsKaleidos':
        newImagesLoad(message.data);
        break;
      case 'goToUrl':
        goToUrl(message.data);
        break;
      default:
        iconsole.logS(message.data);
        break;
    }
  };
// ////////////////////////// SOCKET CLIENT /////////////////////////////////////
// ////////////////////////// SOCKET CLIENT /////////////////////////////////////
// ////////////////////////// SOCKET CLIENT /////////////////////////////////////
  socket.onclose = function onclose(event) {
    clearInterval(impulseInterval);
    if (event.wasClean) {
      iconsole.logCE('Соединение закрыто чисто');
    } else {
      iconsole.logCE('Обрыв соединения'); // например, "убит" процесс сервера
    }
    iconsole.logCE(`Код: ${event.code} причина: ${event.reason}`);
  };
}

export default { start, send };
