/*
const fs = require('fs');
const brain = require('brain.js');
const socket = require('../webSocketOnMessage');
const { calcLayers } = require('./trainMainNN');

function buildData(select) {
  const list = JSON.parse(fs.readFileSync(`./data/commands/${select}/option.json`)).nn;
  const arr = list.reduce((prev, next, index) => {
    return prev.concat(next.map((w) => {
      return {
        input: w.split(' ').reduce((a, b, i) => Object.assign(a, { [b]: (99 - i) / 100 }), {}),
        output: { [index + 1]: 0.99 }
      };
    }));
  }, []);
  console.log(arr);
  return arr;
}
module.exports.buildData = buildData;

function train(select) {
  const data = buildData(select);
  const net = new brain.NeuralNetwork({
    hiddenLayers: calcLayers(data)
  });
  net.train(data, {
    errorThresh: 0.005,
    iterations: 50000,
    log: true,
    logPeriod: 100,
    learningRate: 0.05
  });
  const jsonTrain = net.toJSON();
  console.log('train ...Done');
  fs.writeFileSync(`./data/commands/${select}/nn`, JSON.stringify(jsonTrain), 'utf8');
}
module.exports.train = train;

function getOptions(ws, text, select) {
  const net = new brain.NeuralNetwork();
  // превращаем наш текст в формат для нейронки
  net.fromJSON(JSON.parse(fs.readFileSync(`./data/commands/${select}/nn`)));
  const textObjLike = text.split(' ')
    .reduce((a, b, i) => Object.assign(a, { [b]: (99 - i) / 100 }), {});
  const output = net.run(textObjLike);
  // Сортируем полученые даный на предмет большого процентного соотношения
  const commandSelect = Object.keys(output).sort((a, b) => output[b] - output[a])[0];
  socket.send(ws, 'console', output);
  return commandSelect;
}
module.exports.getOptions = getOptions;
// //////////////////////////////////////////////////////////////
function testOptions(text, select) {
  const net = new brain.NeuralNetwork();
  // превращаем наш текст в формат для нейронки
  net.fromJSON(JSON.parse(fs.readFileSync(`./data/commands/${select}/nn`)));
  const textObjLike = text.split(' ')
    .reduce((a, b, i) => Object.assign(a, { [b]: (99 - i) / 100 }), {});
  const output = net.run(textObjLike);
  // Сортируем полученые даный на предмет большого процентного соотношения
  const commandSelect = Object.keys(output).sort((a, b) => output[b] - output[a])[0];
  return commandSelect;
}
module.exports.testOptions = testOptions;
*/
