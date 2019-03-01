const fs = require('fs');
//const brain = require('brain.js');
const socket = require('../webSocketOnMessage');
const { getOptions } = require('./optionalNN');
const { getParameters } = require('./parameterNN');
// Нужно сделать автоматический require
const { Asmr } = require('../commands/Asmr/Asmr');
const { LifeCircles } = require('../commands/LifeCircles/LifeCircles');
const { Quest } = require('../commands/Quest/Quest');
const { Logbook } = require('../commands/Logbook/Logbook');
const { Reaction } = require('../commands/Reaction/Reaction');
const { Login } = require('../commands/Login/Login');
const { ReadClipboard } = require('../commands/ReadClipboard/ReadClipboard');
const { Music } = require('../commands/Music/Music');
const { Weather } = require('../commands/Weather/Weather');

const commands = {
  Asmr,
  LifeCircles,
  Quest,
  Logbook,
  Reaction,
  Login,
  ReadClipboard,
  Music,
  Weather
};
// /////////////////////////////////////////////////////////////////////////////
const net = new brain.NeuralNetwork();

function load() {
  net.fromJSON(JSON.parse(fs.readFileSync('./data/NN_train_buffer.json')));
}
module.exports.load = load;
// ////////////////////////////////////////////////////////////////////////////
function start(ws, text) {
  // статус того что уже начался разговор со стороный клиента
  ws.onlyOpened = false;
  // превращаем наш текст в формат для нейронки
  const textObjLike = text.split(' ')
    .reduce((a, b, i) => Object.assign(a, { [b]: (99 - i) / 100 }), {});
  const output = net.run(textObjLike);
  // Сортируем полученые даный на предмет большого процентного соотношения
  const commandSelect = Object.keys(output).sort((a, b) => output[b] - output[a]);
  socket.send(ws, 'console', output);
  // Определяем подроздел выбраной команды, еще одна нейронка
  // уточьняет какая имено функция из нескольких возможных у одной
  // команды должна будет запуститься
  const options = getOptions(ws, text, commandSelect[0]);
  // Какую команду наша нейронка выбрала идем в ее настройки
  // и на основе этих настроек из текста выделяем для неё параметры
  const parameters = getParameters(text, commandSelect[0]);
  // Пиздец строчька, запускает функцию которая набрала больше всего процентов
  // в нейроной сети
  commands[commandSelect[0]](ws, options, parameters);
}
module.exports.start = start;
// /////////////////////////////////////////////////////////////////////////////
function test(text) {
  // статус того что уже начался разговор со стороный клиента
  // превращаем наш текст в формат для нейронки
  const textObjLike = text.split(' ')
    .reduce((a, b, i) => Object.assign(a, { [b]: (99 - i) / 100 }), {});
  const output = net.run(textObjLike);
  // Сортируем полученые даный на предмет большого процентного соотношения
  const commandSelect = Object.keys(output).sort((a, b) => output[b] - output[a]);

  return commandSelect[0];
}
module.exports.test = test;
