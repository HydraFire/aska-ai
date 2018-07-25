const { webSocketOnMessage, send } = require('./webSocketOnMessage');

function webSocketOnConnect(wss) {
  wss.on('connection', (ws) => {
    // Дальше сделаем проверку по IP адресу и логин и команду запомнить адрем
    let userIp = ws._socket.remoteAddress;
    userIp = userIp.substring(7, userIp.length);
    send(ws, 'console', userIp);
    // NNListen переключает режим когда сказаное поступает в нейроную сеть
    // для выбора команды и режимом когда интервалы запушеные предыдушей
    // фразой ожидают новых разговорных даных от клиента для продолжения
    // своего функционала, после чего NNListen станет сново true, чо
    // Доступ нужно получить
    ws.accessed = false;
    // позволит запустить новую комманду
    ws.NNListen = true;
    // статус проигрования аудио на клиенте, speech_end тоесть сейчас не проигрываеться
    ws.audio = 'speech_end';
    ws.endedTracks = [];
    // Все интервалы проверяют этот параметер, если поставить true они все завершаться
    ws.closeAllInterval = false;
    // Стирает интервал проверки заданий
    ws.closeTimeInterval = false;
    // Стейт обозначаюший что еще не одна комаднда не была запущена
    ws.onlyOpened = true;
    // Запуск евент листенера на меседжи
    webSocketOnMessage(ws);
    // Впринципе хотелось бы зделать чтоб был лог всег IP заходивших на nerv
    ws.addEventListener('close', () => {
      ws.closeAllInterval = true;
      ws.closeTimeInterval = true;
      clearInterval(ws.idleInterval);
    });
  });
}
module.exports.webSocketOnConnect = webSocketOnConnect;
