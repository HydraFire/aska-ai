const { getKey, setKey } = require('./notification/typeNotification');
const { start } = require('./NN/MainNN');
const { verifToken, verifAccess } = require('./commands/Login/Login');
const { editorLoad, editorSave } = require('./NN/editor');
const { challengeLogLoad } = require('./challengeLog');
// Функция нужна для автоматизации создания обэкта и стрингификации
function send(ws, type, data) {
  if (!ws.closeAllInterval) {
    if (typeof data === 'object') {
      data = Object.keys(data).reduce((a, b) => a.concat(`${b}: ${data[b]}<br>`), '');
    }
    ws.send(JSON.stringify({ type, data }));
  }
}
module.exports.send = send;


// А в этой функции мы разбераем сокет пришедший с клиента по типам
function webSocketOnMessage(ws) {
  const arr = verifAccess();
  ws.on('message', (message) => {
    if (ws.accessed) {
      const obj = JSON.parse(message);
      // Пошол розбор полетов
      switch (obj.type) {
        // Основной тип aska, это текст полученый с микрофона клиента
        case 'aska':
          // Глобальная переменая со значением последнего сказаного клиентом,
          // нужна для внутрених интервалов некоторых команд
          ws.ClientSay = obj.data;
          // Тригер переключаюший идут даные в нейроную сеть или только
          // для внутрених интервалов
          ws.NNListen ? start(ws, obj.data) : '';
          // Отправляет обратно пользователю в консоль
          send(ws, 'console', obj.data);
          break;
          // Запрос на получение ключа для подписки на уведомление
        case 'notificationGetKey':
          getKey(ws);
          break;
          // После подписки приходит ключь уже подписаный клиентом
        case 'notificationSetKey':
          setKey(obj.data);
          break;

        case 'AUDIO':
          ws.audio = obj.data;
          break;
          // Подгружает даные для editora на клиенте
        case 'editor':
          if (obj.data === 'load') {
            send(ws, 'editor', JSON.stringify(editorLoad()));
          } else {
            send(ws, 'editor', editorSave(obj.data));
          }
          break;
        case 'challengeLog':
          if (obj.data === 'load') {
            send(ws, 'challengeLog', JSON.stringify(challengeLogLoad()));
          }
          break;
          // Если тип сокета не совпадает
        default:
          console.log(`Unknown type ${obj.type}`);
      }
    } else {
      const obj = JSON.parse(message);
      switch (obj.type) {
        case 'aska':
          ws.ClientSay = obj.data;
          // NN(ws, obj.data);
          arr.forEach(v => v === obj.data ? start(ws, obj.data) : '');
          // Отправляет обратно пользователю в консоль
          send(ws, 'console', obj.data);
          break;
        case 'TOKEN':
          verifToken(ws, obj.data);
          break;
        case 'AUDIO':
          ws.audio = obj.data;
          break;
        default:
          console.log(`Unknown type ${obj.type}`);
      }
    }
  });
}
module.exports.webSocketOnMessage = webSocketOnMessage;
