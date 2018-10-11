const fs = require('fs');
const fetch = require('node-fetch');
const socket = require('../../webSocketOnMessage');
const asyncAsk = require('../../asyncAsk');
const { checkURL } = require('../../saveAska');
const { calcForecast } = require('./calcForecast');
// ////////////////////////////////////////////////////////////////////////////
const fileOption = './data/commands/Weather/option.json';
const AskaSC = JSON.parse(fs.readFileSync(fileOption));

async function forecastWeather() {
  const url = `https://api.openweathermap.org/data/2.5/forecast?id=703448&APPID=028445577f2c7694553877aba8e9a74a&units=metric&lang=ru`;
  const response = await fetch(url);
  const json = await response.json();
  console.log(json);
  return calcForecast(json);
}

async function currentWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?id=703448&APPID=028445577f2c7694553877aba8e9a74a&units=metric&lang=ru`;
  const response = await fetch(url);
  const json = await response.json();
  console.log(json);
  return `на улице ${json.weather[0].description}, температура ${Math.round(json.main.temp)} градусов, влажност ${json.main.humidity}%, давление ${json.main.pressure}, ветер ${json.wind.speed}`;
}
async function getWeather(ws) {
  try {
    // Wait for the result of waitAndMaybeReject() to settle,
    // and assign the fulfilled value to fulfilledValue:
    const value = await currentWeather();
    //const value = await forecastWeather();
    // If the result of waitAndMaybeReject() rejects, our code
    // throws, and we jump to the catch block.
    // Otherwise, this block continues to run:
    return value;
  }
  catch (e) {
    return `${e}`;
  }
}
module.exports.getWeather = getWeather;

async function sayWeather(ws) {
  socket.send(ws, 'aska', await getWeather());
}

function Weather(ws, options) {
  if (options == '1') {
    sayWeather(ws);
  } else {
    socket.send(ws, 'aska', `${ws.ClientSay}`);
  }
}
module.exports.Weather = Weather;
