import iconsole from './interface/iconsole';
import pushNotification from './pushNotification';
import aska from './speechSynthesizer';
import clientFunction from './functions/functionStart';

let socket = null;

// Функция которая используеться для отправки на сервер
function send(data, type) {
  if (data !== '') {
    !type ? type = 'aska' : '';
    type === 'aska' ? data = data.toLowerCase() : '';
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
// Чтобы веб сокеты запускалить после прогрузки страници и графики на ней

function start(ip) {
  socket = new WebSocket(ip);

  socket.onopen = function onopen() {
    iconsole.logC('SOCKET CONNECT');
    localStorage.test_token ? send(localStorage.test_token, 'TOKEN') : send('*', 'TOKEN');
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
      case 'notificationPublicKey':
        pushNotification.setVapidPublicKey(message.data);
        iconsole.logS(message.data);
        break;
      case 'token':
        localStorage.test_token = message.data;
        iconsole.logS('TOKEN is accepted');
        break;
      default:
        iconsole.logS(message.data);
        break;
    }
  };

  socket.onclose = function onclose(event) {
    if (event.wasClean) {
      iconsole.logCE('Соединение закрыто чисто');
    } else {
      iconsole.logCE('Обрыв соединения'); // например, "убит" процесс сервера
    }
    iconsole.logCE(`Код: ${event.code} причина: ${event.reason}`);
  };
}

export default { start, send };
