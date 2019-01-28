const fs = require('fs');
const brain = require('brain.js');

function calcLayers(data) {
  const input = data.reduce((a, b) => Object.keys(b.input).length + a, 0);
  const output = data.reduce((a, b) => Object.keys(b.output).length + a, 0);
  return [input, ((input + output) * 2), output];
}
module.exports.calcLayers = calcLayers;
// ////////////////////////////////////////////////////////////////////////////
function buildData() {
  const obj = {};
  const list = fs.readdirSync('./data/commands');
  list.forEach((v) => {
    if (v != 'System') {
      obj[v] = JSON.parse(fs.readFileSync(`./data/commands/${v}/description.json`));
    }
  });
  const arr = Object.keys(obj).reduce((prev, next) => {
    return prev.concat(obj[next].map((w) => {
      return {
        input: w.split(' ').reduce((a, b, i) => Object.assign(a, { [b]: (99 - i) / 100 }), {}),
        output: { [next]: 0.99 }
      };
    }));
  }, []);
  return arr;
}
module.exports.buildData = buildData;
// ////////////////////////////////////////////////////////////////////////////
function trainMain() {
  // Собираем обект в котором названиям команд соответствуют length файлов
  // настроики для нейроной сети, есть настройки для основной сети, а также
  // для под сети каждой команды
  const data = buildData();
  // Со слоями еще посмотрим как будет лучше работать
  const net = new brain.NeuralNetwork({
    hiddenLayers: calcLayers(data)
  });
  net.train(data, {
    errorThresh: 0.005,
    iterations: 10000,
    log: true,
    logPeriod: 10,
    learningRate: 0.05
  });
  // Протренированую сеть сохраняем в файл
  const jsonTrain = net.toJSON();
  console.log('train ...Done');
  fs.writeFileSync('./data/NN_train_buffer.json', JSON.stringify(jsonTrain), 'utf8');
}
module.exports.trainMain = trainMain;
