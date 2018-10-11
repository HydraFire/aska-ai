const fs = require('fs');
const brain = require('brain.js');
const { calcLayers } = require('./trainMainNN');
const { configOn, readConfig } = require('../saveAska');

const nnbufferpath = './data/commands/Logbook/nnexp';
const trainFilepath = './data/commands/Logbook/exp.json';

function buildData() {
  const list = JSON.parse(fs.readFileSync(trainFilepath)).nn;
  const arr = list.reduce((prev, next, index) => {
    return prev.concat(next.map((w) => {
      return {
        input: w.split(' ').reduce((a, b, i) => Object.assign(a, { [b]: (99 - i) / 100 }), {}),
        output: { [index + 1]: 0.99 }
      };
    }));
  }, []);
  return arr;
}

function train() {
  const data = buildData();
  const net = new brain.NeuralNetwork({
    hiddenLayers: calcLayers(data)
  });
  net.train(data, {
    errorThresh: 0.005,
    iterations: 10000,
    log: true,
    logPeriod: 50,
    learningRate: 0.05
  });
  const jsonTrain = net.toJSON();
  console.log('Done');
  fs.writeFileSync(nnbufferpath, JSON.stringify(jsonTrain), 'utf8');
  configOn(false, 'logbooknntrain');
}

function askaChoice(text) {
  const net = new brain.NeuralNetwork();
  // превращаем наш текст в формат для нейронки
  net.fromJSON(JSON.parse(fs.readFileSync(nnbufferpath)));
  const textObjLike = text.split(' ')
    .reduce((a, b, i) => Object.assign(a, { [b]: (99 - i) / 100 }), {});
  const output = net.run(textObjLike);
  // Сортируем полученые даный на предмет большого процентного соотношения
  const commandSelect = Object.keys(output).sort((a, b) => output[b] - output[a])[0];
  return commandSelect;
}
module.exports.askaChoice = askaChoice;

function LogbookNNtrain() {
  if (readConfig().logbooknntrain) {
    console.log('LOGBOOK NN Start Train ...');
    train();
  }
}
module.exports.LogbookNNtrain = LogbookNNtrain;
