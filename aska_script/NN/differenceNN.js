/*
const fs = require('fs');
const { trainMain } = require('./trainMainNN');
const MainNN = require('./MainNN');
const { train } = require('./optionalNN');

const filepath = './data/difference.json';

function createDiff() {
  const obj = {};
  const list = fs.readdirSync('./data/commands');
  list.forEach((v) => {
    if (v != 'System') {
      obj[v] = {
        description: fs.readFileSync(`./data/commands/${v}/description.json`).length,
        option: fs.readFileSync(`./data/commands/${v}/option.json`).length
      };
    }
  });
  return obj;
}
function saveDiffFile(obj) {
  fs.writeFileSync(filepath, JSON.stringify(obj), 'utf8');
}
function differenceBetweenMain(a, b) {
  return Object.keys(a).some(v => a[v].description !== b[v].description);
}
function differenceBetweenArray(a, b) {
  return Object.keys(a).filter(v => a[v].option !== b[v].option);
}

function SmartTrain() {
  console.log('SmartTrain');
  // Берем наш сохраненый файл с даными о размере файлов настройки нейронок
  // как основной так и меленьких нейронок
  const differenceFile = JSON.parse(fs.readFileSync(filepath));
  // Считаем размеры файлов настроек
  const difference = createDiff();
  // Сравниваем изменились ли настройки для оснойной нейронки
  if (differenceBetweenMain(differenceFile, difference)) {
    console.log('new difference');
    trainMain();
    saveDiffFile(difference);
  }
  // Прогружаем нейронку с файла
  MainNN.load();
  console.log('done ...');
  // Сравниваем изменились ли настройки у каждой маленькой нейроночьки
  differenceBetweenArray(differenceFile, difference).forEach((v) => {
    console.log('new difference Between Array');
    train(v);
    saveDiffFile(difference);
  });
}
module.exports.SmartTrain = SmartTrain;
*/
