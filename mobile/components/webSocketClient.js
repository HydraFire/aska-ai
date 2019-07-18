// import iconsole from './interface/iconsole';
//import pushNotification from './pushNotification';
import { aska, setVolume } from './speechSynthesizer';
import { animeteErr } from './interface/animation';
import clientTimeout from './clientTimeout';
import { twoArr, chargeImpulse } from './quest';
import { controls } from './asmrControls';

let socket = null;

const serverAddress = process.env.HOSTNAME;
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
    // iconsole.logC('socket.send(string)');
    // Добавляет в память последний отправленый сокет
    localStorage.inputMemory = data;
  }
}
function goToUrl(url) {
  document.location.href = url;
}
function askaSwitchMute() {
  let text = 'Включить звук ?';
  let arr = [{ type: 'MuteMode', value: true, name: 'Нет' }, { type: 'MuteMode', value: false, name: 'Да' }];
  window.myconsole.handlerInteractWindow({ type: 'typeSwitchMuteMode', text, arr });
}
// Чтобы веб сокеты запускалить после прогрузки страници и графики на ней
function start() {
  socket = new WebSocket(serverAddress);

  socket.onopen = function onopen() {
    // iconsole.logC('SOCKET CONNECT');
    localStorage.test_token ? send(localStorage.test_token, 'TOKEN') : send('*', 'TOKEN');
  };

  socket.onmessage = function onmessage(event) {
    let message = JSON.parse(event.data);
    console.log(message);
    switch (message.type) {
      case 'aska':
        window.myconsole.log(message.data, 'aska');
        aska(message.data, message.buttons);
        break;
      case 'console':
        window.myconsole.log(message.data, 'html');
        break;
      case 'token':
        localStorage.test_token = message.data;
        window.myconsole.log('TOKEN is accepted', 'string');
        break;
      case 'clientTimeout':
        clientTimeout(message.data);
        window.myconsole.log(`clientTimeout ${message.data}`, 'string');
        break;
      case 'editor':
        if (message.data === 'done') {
          window.editorComponent.doneSocket();
        } else {
          window.editorComponent.loadSocket(message.data);
        }
        break;
      case 'challengeLog':
        window.cLogComponent.loadState(message.data);
        break;
      case 'chart':
        window.chartComponent.loadChart(message.data);
        break;
      case 'quest':
        twoArr(message.data);
        break;
      case 'chargeImpulse':
        chargeImpulse();
        break;
      case 'asmr':
        controls(message.data);
        break;
      case 'goToUrl':
        goToUrl(message.data);
        break;
      case 'volume':
        setVolume(message.data);
        break;
      default:
        // iconsole.logS(message.data);
        break;
    }
  };

  socket.onclose = function onclose(event) {
    if (event.wasClean) {
      window.myconsole.log('Соединение закрыто чисто', 'err');
    } else {
      window.myconsole.log('Обрыв соединения', 'err');
    }
    animeteErr();
    window.myconsole.log(`Код: ${event.code} причина: ${event.reason}`, 'err');
  };
}

export default { start, send, askaSwitchMute };
