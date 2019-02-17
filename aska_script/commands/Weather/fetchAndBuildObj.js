const fs = require('fs');
const fetch = require('node-fetch');
const socket = require('../../webSocketOnMessage');
const asyncAsk = require('../../asyncAsk');
const { checkURL } = require('../../saveAska');
// ////////////////////////////////////////////////////////////////////////////
const fileOption = './data/commands/Weather/option.json';
const AskaSC = JSON.parse(fs.readFileSync(fileOption));
// /////////////////////////////////////////////////////////////////////////////
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
  return arr.filter(v => v.dt_txt.split(' ')[0].split('-')[2] == n)
  .filter(v => v.dt_txt.split(' ')[1].split(':')[0] === '09' || v.dt_txt.split(' ')[1].split(':')[0] === '15' || v.dt_txt.split(' ')[1].split(':')[0] === '21');
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
