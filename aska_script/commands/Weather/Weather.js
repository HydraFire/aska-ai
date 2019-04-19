const fs = require('fs');
const fetch = require('node-fetch');
const socket = require('../../webSocketOnMessage');
// ////////////////////////////////////////////////////////////////////////////
const mainTimeCircle = require('../../mainTimeCircle');
const asyncAsk = require('../../asyncAsk');
const { checkURL } = require('../../saveAska');
const { searchDate } = require('../../textToTime');
const { sayForecast, sayWeatherNow, sayAnalyticWeather, calcWatchWeather } = require('./calcForecast');
const { getWeather, getForecast, dataBuild, buildForecastDaysColection, writeData, readData } = require('./fetchAndBuildObj');
// ////////////////////////////////////////////////////////////////////////////
function sayWeather(ws) {
  getWeather(ws).then((json) => {
    socket.send(ws, 'aska', sayWeatherNow(json));
  });
}

function startForecast(ws, params) {
  getForecast(ws).then(dataArr => {
    let obj = dataBuild(dataArr, parseFloat(searchDate(params[0]).split('-')[2]), ws);
    sayForecast(obj, params)
      .split(',')
      .filter(v => v != '' && v != ' ' && v != ', ' && v != ' ,')
      .forEach(v => asyncAsk.readEndWait(ws, checkURL(v)));
  });
}

function startAnalyticWeather(ws, param) {
  getForecast(ws).then(dataArr => {
    let arr = buildForecastDaysColection(dataArr.list);
    socket.send(ws, 'aska', checkURL(sayAnalyticWeather(arr, param)));
  });
}

function checkWatchWeather() {
  return readData().watch.length > 0;
}
module.exports.checkWatchWeather = checkWatchWeather;

function sayWatchWeather(ws) {
  let obj = readData();
  socket.send(ws, 'aska', obj.watch);
  obj.times > 1 ? writeData(obj.times - 1) : writeData('');
  mainTimeCircle.shortInterval(ws);
}
module.exports.sayWatchWeather = sayWatchWeather;

function sayMorning(ws) {
  return new Promise((resolve, reject) => {
    getWeather(ws).then((json) => {
       let text = sayWeatherNow(json);
       getForecast(ws).then(dataArr => {
         let arr = buildForecastDaysColection(dataArr.list);
         //console.log(arr);
         text += ', ' + sayForecast(arr[0], 'now');
         resolve(text);
         calcWatchWeather(writeData(arr[0]), arr[1]);
       });
    });
  });
}
module.exports.sayMorning = sayMorning;
// ////////////////////////////////////////////////////////////////////////////

function Weather(ws, option, params) {
  switch (option) {
    case '1':
      sayWeather(ws);
      break;
    case '2':
      startForecast(ws, params);
      break;
    case '3':
      startAnalyticWeather(ws, 'rain');
      break;
    case '4':
      startAnalyticWeather(ws, 'sunny');
      break;
    default:
      console.log('error option');
  }
}
module.exports.Weather = Weather;
