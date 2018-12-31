const fs = require('fs');
const brain = require('brain.js');
const { load, test } = require('../aska_script/NN/MainNN');
const { testOptions } = require('../aska_script/NN/optionalNN');

// Собераем массив всех даных которые будем проверят
const allData = {};
const list = fs.readdirSync('./data/commands');
list.forEach((v) => {
  if (v != 'System') {
    allData[v] = JSON.parse(fs.readFileSync(`./data/commands/${v}/description.json`));
  }
});
// Инициализируем нейроную сеть
const net = new brain.NeuralNetwork();
// Грузим пре-трейн файл
load();
// запускаем тесты
describe("TEST NN", function() {
  Object.keys(allData).forEach(fName => {
    allData[fName].forEach(v => {
      it(` func = ${fName}, input = ${v}`, function() {
        expect(test(v)).toBe(fName);
      })
    });
  });
});

// Собераем массив всех второстепеных даных которые будут проверятся
const allSecondData = {};

list.forEach((v) => {
  if (v != 'System') {
    allSecondData[v] = JSON.parse(fs.readFileSync(`./data/commands/${v}/option.json`)).nn;
  }
});

describe("TEST Second NN", function() {
  Object.keys(allSecondData).forEach(fName => {
    allSecondData[fName].forEach((arr, i) => {
      arr.forEach(v => {
        it(` func = ${fName}, option = ${i} ,input = ${v}`, function() {
          expect(parseFloat(testOptions(v, fName))).toBe((i + 1));
        })
      });
    });
  });
});
