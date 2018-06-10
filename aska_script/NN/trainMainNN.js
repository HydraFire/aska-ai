const fs = require('fs');
const brain = require('brain.js');

function calcLayers(data) {
  const input = data.reduce((a, b) => Object.keys(b.input).length + a, 0);
  const output = data.reduce((a, b) => Object.keys(b.output).length + a, 0);
  return [input, (input + output), output];
}
module.exports.calcLayers = calcLayers;
// ////////////////////////////////////////////////////////////////////////////
function buildData() {
  const obj = {};
  const list = fs.readdirSync('./data/commands');
  list.forEach((v) => {
    obj[v] = JSON.parse(fs.readFileSync(`./data/commands/${v}/description.json`));
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
    iterations: 5000,
    log: true,
    logPeriod: 50,
    learningRate: 0.3
  });
  // Протренированую сеть сохраняем в файл
  const jsonTrain = net.toJSON();
  console.log('train ...Done');
  fs.writeFileSync('./data/NN_train_buffer.json', JSON.stringify(jsonTrain), 'utf8');
}
module.exports.trainMain = trainMain;
