const fs = require('fs');
const fetch = require('node-fetch');
const socket = require('../../webSocketOnMessage');
const asyncAsk = require('../../asyncAsk');
const { checkURL } = require('../../saveAska');
// ////////////////////////////////////////////////////////////////////////////
const fileData = './data/weather.json';
const fileOption = './data/commands/Weather/option.json';
const AskaSC = JSON.parse(fs.readFileSync(fileOption));
// ////////////////////////////////////////////////////////////////////////////
function readData() {
  try {
    return JSON.parse(fs.readFileSync(fileData));
  } catch (err) {
    let sample = {
      watch: '',
      times: 3,
      data: [
         { date: '21',
           temp: [ -2.07, -2.98, -8.57 ],
           weather: [ 'ясно', 'слегка облачно', 'слегка облачно' ],
           wind: [ 9.76, 8.27, 3.66 ] },
         { date: '22',
           temp: [ -6.31, -5.77, -8.57 ],
           weather: [ 'ясно', 'облачно', 'слегка облачно' ],
           wind: [ 5.2, 8.31, 7.06 ] },
         { date: '23',
           temp: [ -6.18, -3.98, -8.58 ],
           weather: [ 'ясно', 'облачно', 'пасмурно' ],
           wind: [ 7.22, 4.61, 2.07 ] } ]
    };
    fs.writeFileSync(fileData, JSON.stringify(sample), 'utf8');
    return sample;
  }
}
module.exports.readData = readData;
function writeData(obj) {
  let fileObj = readData();
  if (typeof obj == 'string') {
    fileObj.watch = obj;
  } else if (typeof obj == 'number')  {
    fileObj.times = obj;
  } else {
    fileObj.data.splice(0, 1);
    fileObj.data.push(obj);
  }
  fs.writeFileSync(fileData, JSON.stringify(fileObj), 'utf8');
  return fileObj.data;
}
module.exports.writeData = writeData;
// ////////////////////////////////////////////////////////////////////////////
function getDateFromApiDate(value) {
  return value.dt_txt.split(' ')[0].split('-')[2];
}
function getHoversFromApiDate(value) {
  return value.dt_txt.split(' ')[1].split(':')[0];
}
function createOneObj(arr) {
  return arr.reduce((prev, next) => {
    prev.date = next.dt_txt.split(' ')[0].split('-')[2];
    prev.temp.push(next.main.temp);
    prev.weather.push(next.weather[0].description);
    prev.wind.push(next.wind.speed);
    return prev;
  },{
    date: '',
    temp: [],
    weather: [],
    wind: []
  });
}
function filterOneDayData(arr, n) {
  return arr.filter(v => getDateFromApiDate(v) == n)
  .filter(v => getHoversFromApiDate(v) === '09' ||
               getHoversFromApiDate(v) === '15' ||
               getHoversFromApiDate(v) === '21');
}
// ////////////////////////////////////////////////////////////////////////////
function dataBuild(dataArr, date, ws) {
  if (filterOneDayData(dataArr.list, date).length < 1) {
    socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'err0')));
    return '';
  } else {
    return createOneObj(filterOneDayData(dataArr.list, date));
  }
}
module.exports.dataBuild = dataBuild;

function buildForecastDaysColection(arr) {
  let date = '';
  return arr.filter(v => {
    if (getDateFromApiDate(v) != date) {
      date = getDateFromApiDate(v);
      return true;
    }
  })
  .map(v => {
    return filterOneDayData(arr, getDateFromApiDate(v));
  })
  .filter(v => v.length > 0)
  .map(v => {
    return createOneObj(v);
  })
}
module.exports.buildForecastDaysColection = buildForecastDaysColection;

function getForecast(ws) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?id=703448&APPID=028445577f2c7694553877aba8e9a74a&units=metric&lang=ru`;
  return fetch(url).then(res => res.json()).catch(err => {console.log(err); socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'err1')))});
}
module.exports.getForecast = getForecast;

function getWeather(ws) {
  const url = `https://api.openweathermap.org/data/2.5/weather?id=703448&APPID=028445577f2c7694553877aba8e9a74a&units=metric&lang=ru`;
  return fetch(url).then(res => res.json()).catch(err => {console.log(err); socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'err1')))});
}
module.exports.getWeather = getWeather;
