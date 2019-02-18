const fs = require('fs');
const fetch = require('node-fetch');
const socket = require('../../webSocketOnMessage');
// ////////////////////////////////////////////////////////////////////////////
const { checkURL } = require('../../saveAska');
const { searchDate } = require('../../textToTime');
const { sayForecast, sayWeatherNow } = require('./calcForecast');
const { getWeather, getForecast, dataBuild } = require('./fetchAndBuildObj');
// ////////////////////////////////////////////////////////////////////////////
function sayWeather(ws) {
  getWeather(ws).then((json) => {
    socket.send(ws, 'aska', sayWeatherNow(json));
  });
}

function startForecast(ws, params) {
  getForecast(ws).then(dataArr => {
    let text = sayForecast(dataBuild(dataArr, parseFloat(searchDate(params[0]).split('-')[2]), ws), params);
    socket.send(ws, 'aska', text);
  });
}

function sayMorning(ws) {
  return new Promise((resolve, reject) => {
    getWeather(ws).then((json) => {
       let text = sayWeatherNow(json);
       getForecast(ws).then(dataArr => {
         text += '. ' + sayForecast(dataBuild(dataArr, new Date().getDate()), 'now');
         resolve(text);
       });
    });
  });
}
module.exports.sayMorning = sayMorning;
// ////////////////////////////////////////////////////////////////////////////

function Weather(ws, option, params) {
  console.log(`params = ${params}`);
  switch (option) {
    case '1':
      sayWeather(ws);
      break;
    case '2':
      startForecast(ws, params);
      break;
    case '3':
      console.log('error option');
      break;
    case '4':
      console.log('error option');
      break;
    default:
      console.log('error option');
  }
}
module.exports.Weather = Weather;
