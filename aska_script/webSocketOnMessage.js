const { getKey, setKey } = require('./notification/typeNotification');
const { start } = require('./NN/MainNN');
const { verifToken, verifAccess } = require('./commands/Login/Login');
const { editorLoad, editorSave } = require('./NN/editor');
const { challengeLogLoad } = require('./challengeLog');
const { chartLoad } = require('./chartLoad');
const { checkAssignments } = require('./mainTimeCircle');
const { saveFile, commands } = require('./commands/Music/instrument');
const { writeResultEXP } = require('./commands/Logbook/Logbook');
// Функция нужна для автоматизации создания обэкта и стрингификации
function send(ws, type, data, buttons) {
  if (!ws.closeAllInterval) {
    if (type === 'console' && typeof data === 'object') {
      data = Object.keys(data).reduce((a, b) => a.concat(`${b}: ${data[b]}<br>`), '');
    }
    ws.send(JSON.stringify({ type, data, buttons }));
  }
}
module.exports.send = send;
// ////////////////////////// SERVER ///////////////////////////////////////////
// ////////////////////////// SERVER ///////////////////////////////////////////
// ////////////////////////// SERVER ///////////////////////////////////////////
// ////////////////////////// SERVER ///////////////////////////////////////////
// ////////////////////////// SERVER ///////////////////////////////////////////
// А в этой функции мы разбераем сокет пришедший с клиента по типам
function webSocketOnMessage(ws) {
  const arr = verifAccess();
  ws.on('message', (message) => {
    if (ws.accessed) {
      if (message.length < 30000) {
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
          case 'chart':
            if (obj.data === 'load') {
              send(ws, 'chart', JSON.stringify(chartLoad()));
            }
            break;
            // Загрузка музыки
          case 'music':
            commands(ws, obj.data);
            break;
          case 'impulse':
            checkAssignments(ws);
            break;
          case 'expClick':
            writeResultEXP(ws, obj.data);
            break;
          default:
            // console.log(`Unknown type ${obj.type}`);
        }
      } else {
        saveFile(message);
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
          // console.log(`Unknown type ${obj.type}`);
      }
    }
  });
}
module.exports.webSocketOnMessage = webSocketOnMessage;
