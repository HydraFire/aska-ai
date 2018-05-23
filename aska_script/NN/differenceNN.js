const fs = require('fs');
const { trainMain } = require('./trainMainNN');
const MainNN = require('./MainNN');
const { train } = require('./optionalNN');

const filepath = './aska_script/NN/difference.json';

function createDiff() {
  const obj = {};
  const list = fs.readdirSync('./aska_script/commands');
  list.forEach((v) => {
    obj[v] = {
      description: fs.readFileSync(`./aska_script/commands/${v}/description.json`).length,
      option: fs.readFileSync(`./aska_script/commands/${v}/option.json`).length
    };
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
  // Берем наш сохраненый файл с даными о размере файлов настройки нейронок
  // как основной так и меленьких нейронок
  const differenceFile = JSON.parse(fs.readFileSync(filepath));
  // Считаем размеры файлов настроек
  const difference = createDiff();
  // Сравниваем изменились ли настройки для оснойной нейронки
  if (differenceBetweenMain(differenceFile, difference)) {
    trainMain();
    saveDiffFile(difference);
  }
  // Прогружаем нейронку с файла
  MainNN.load();
  // Сравниваем изменились ли настройки у каждой маленькой нейроночьки
  differenceBetweenArray(differenceFile, difference).forEach((v) => {
    train(v);
    saveDiffFile(difference);
  });
}
module.exports.SmartTrain = SmartTrain;
