const fs = require('fs');
const asyncAsk = require('../../asyncAsk');
// /////////////////////////////////////////////////////////////////////////////
const fileOption = './data/commands/Weather/option.json';
const AskaSC = JSON.parse(fs.readFileSync(fileOption));
// /////////////////////////////////////////////////////////////////////////////
function sayWind(windValue, par) {
  windValue = windValue | 0;
  let arr = par =='now' ? AskaSC.windNow : AskaSC.wind;
  return arr[windValue];
}

function dateToText(params) {
  if (params === 'now') {
    return asyncAsk.whatToSay(AskaSC, 'a1');
  } else if (params == 'завтра' || params == 'послезавтра') {
    return `${params} ${asyncAsk.whatToSay(AskaSC, 'a2')}`;
  }
  return `в ${params} ${asyncAsk.whatToSay(AskaSC, 'a2')}`;
}

function tempHotOrCold(temp) {
  temp = temp | 0;
  if (temp > 0) {
    return asyncAsk.whatToSay(AskaSC, 't0');
  } else if (temp < 0) {
    return asyncAsk.whatToSay(AskaSC, 't1');
  }
  return '';
}

function tempToTextDo(temp) {
  let g = '';
  temp = temp | 0;
  if (temp == 1 || temp == -1 || temp == 21 || temp == -21 || temp == 31) {
    g = 'градуса';
  } else {
    g = 'градусов';
  }
  return `${temp} ${g}`;
}

function tempToText(temp) {
  let g = '';
  temp = temp | 0;
  if (temp == 1 || temp == -1 || temp == 21 || temp == -21 || temp == 31) {
    g = 'градус';
  } else if (temp == 2 || temp == -2 || temp == 3 || temp == -3 ||
    temp == 4 || temp == -4 || temp == 22 || temp == -22 || temp == 23 ||
    temp == -23 || temp == 24 || temp == -24
  ) {
    g = 'градуса';
  } else {
    g = 'градусов';
  }
  return `${temp} ${g}`;
}

function calcTemp(arr, i) {
  arr = arr.map(v => v | 0);
  if (arr[i-1] < arr[i]) {
    return `${asyncAsk.whatToSay(AskaSC, 't2')} ${tempToTextDo(arr[i])}`;
  } else if (arr[i-1] > arr[i]) {
    return `${asyncAsk.whatToSay(AskaSC, 't3')} ${tempToText(arr[i])}`;
  }
  return asyncAsk.whatToSay(AskaSC, 't4');
}
// ////////////////////////////////////////////////////////////////////////////
function sayForecast(obj, params) {
  obj.weather = obj.weather.map(v => {
    v === 'ясно' ? v = asyncAsk.whatToSay(AskaSC, 'p0') : '';
    return v;
  });
  let morning = `${dateToText(params)} ${tempToText(obj.temp[0])} ${tempHotOrCold(obj.temp[0])}, ${obj.weather[0]}, ${sayWind(obj.wind[0])}, `;
  let noon = `${asyncAsk.whatToSay(AskaSC, 'a3')} ${calcTemp(obj.temp, 1)}, ${obj.weather[1]}, ${sayWind(obj.wind[1])}, `;
  let evening = `${asyncAsk.whatToSay(AskaSC, 'a4')} ${calcTemp(obj.temp, 2)}, ${obj.weather[2]}, ${sayWind(obj.wind[2])}.`;
  return morning + noon + evening;
}
module.exports.sayForecast = sayForecast;

function sayWeatherNow(json) {
  return `${asyncAsk.whatToSay(AskaSC, 'a0')} ${json.weather[0].description},  ${tempToText(json.main.temp)} ${tempHotOrCold(json.main.temp)}, ${sayWind(json.wind.speed, 'now')}`;
}
module.exports.sayWeatherNow = sayWeatherNow;
