const fs = require('fs');
const asyncAsk = require('../../asyncAsk');
const { writeData } = require('./fetchAndBuildObj');
// /////////////////////////////////////////////////////////////////////////////
const fileOption = './data/commands/Weather/option.json';
const AskaSC = JSON.parse(fs.readFileSync(fileOption));
// /////////////////////////////////////////////////////////////////////////////
function sayWind(windValue, par) {
  windValue = windValue | 0;
  let arr = par =='now' ? AskaSC.windNow : AskaSC.wind;
  return arr[windValue];
}

function preToText(params) {
  if (params === 'now') {
    return asyncAsk.whatToSay(AskaSC, 'a1');
  } else if (params == 'завтра' || params == 'послезавтра') {
    return `${params} ${asyncAsk.whatToSay(AskaSC, 'a2')}`;
  }
  return `в ${params} ${asyncAsk.whatToSay(AskaSC, 'a2')}`;
}

function tempHotOrCold(temp) {
  temp = Math.round(temp);
  if (temp > 0) {
    return asyncAsk.whatToSay(AskaSC, 't0');
  } else if (temp < 0) {
    return asyncAsk.whatToSay(AskaSC, 't1');
  }
  return '';
}

function tempToTextDo(temp) {
  let g = '';
  temp = Math.round(temp);
  if (temp == 1 || temp == -1 || temp == 21 || temp == -21 || temp == 31) {
    g = 'градуса';
  } else {
    g = 'градусов';
  }
  return `${temp} ${g}`;
}

function tempToText(temp) {
  let g = '';
  temp = Math.round(temp);
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
  arr = arr.map(v => Math.round(v));
  if (arr[i-1] < arr[i]) {
    return `${asyncAsk.whatToSay(AskaSC, 't2')} ${tempToTextDo(arr[i])}`;
  } else if (arr[i-1] > arr[i]) {
    return `${asyncAsk.whatToSay(AskaSC, 't3')} ${tempToText(arr[i])}`;
  }
  return asyncAsk.whatToSay(AskaSC, 't4');
}

function dateToText(v) {
  let arr = ['в воскресенье', 'в понедельник', 'в вторник', 'в среду', 'в четверг', 'в пятницу', 'в субботу'];
  if (v == 0) {
    return 'сегодня, и ';
  }
  return arr[new Date(Date.now() + (86400000 * v)).getDay()];
}
// ////////////////////////////////////////////////////////////////////////////
function sayAnalyticWeather(collection, param) {
  let pre = '';
  let err = '';
  let search = [];

  if (param === 'sunny') {
    pre = asyncAsk.whatToSay(AskaSC, 'ana0');
    err = asyncAsk.whatToSay(AskaSC, 'ana1');
    search = AskaSC.searchSunny;
  } else if (param === 'rain') {
    pre = asyncAsk.whatToSay(AskaSC, 'ana2');
    err = asyncAsk.whatToSay(AskaSC, 'ana3');
    search = AskaSC.searchRain;
  }

  let arr = collection.map((v, i) => { v.date = i; return v })
  .filter(f => f.weather.filter(v => search.some(s => s === v)).length >= 2)
  .map(v => dateToText(v.date));

  if (arr.length == 0) {
    return err;
  } else if (arr.length == 1) {
    arr.push(' и всё');
  }
  return `${pre} ${arr.join(', ')}`;
}
module.exports.sayAnalyticWeather = sayAnalyticWeather;

function sayForecast(obj, params) {
  let weatherArr = obj.weather.map(v => {
    v === 'ясно' ? v = asyncAsk.whatToSay(AskaSC, 'p0') : '';
    return v;
  });
  let morning = `${preToText(params)} ${tempToText(obj.temp[0])} ${tempHotOrCold(obj.temp[0])},${weatherArr[0]},${sayWind(obj.wind[0])},`;
  let noon = `${asyncAsk.whatToSay(AskaSC, 'a3')} ${calcTemp(obj.temp, 1)},${weatherArr[1]},${sayWind(obj.wind[1])},`;
  let evening = `${asyncAsk.whatToSay(AskaSC, 'a4')} ${calcTemp(obj.temp, 2)},${weatherArr[2]},${sayWind(obj.wind[2])}`;
  if (new Date().getHours() > 7 && params === 'now') {
    return noon + evening;
  }
  return morning + noon + evening;
}
module.exports.sayForecast = sayForecast;

function sayWeatherNow(json) {
  return `${asyncAsk.whatToSay(AskaSC, 'a0')} ${json.weather[0].description},${tempToText(json.main.temp)} ${tempHotOrCold(json.main.temp)},${sayWind(json.wind.speed, 'now')}`;
}
module.exports.sayWeatherNow = sayWeatherNow;

function calcWatchWeather(pastCollection, nextDayForecast) {
  // console.log(pastCollection);
  // console.log('//////////////////////////////');
  // console.log(nextDayForecast);
  // console.log('//////////////////////////////');
  let str = '';

  let sunnyWeatherPast = pastCollection.filter(f => f.weather.filter(v => AskaSC.searchSunny.some(s => s === v)).length >= 2).length == 3;
  // console.log(`sunnyWeatherPast = ${sunnyWeatherPast}`);
  let rainWeatherPast = pastCollection.filter(f => f.weather.filter(v => AskaSC.searchRain.some(s => s === v)).length >= 2).length == 3;
  // console.log(`rainWeatherPast = ${rainWeatherPast}`);
  let sunnyWeatherToMorrow = nextDayForecast.weather.filter(v => AskaSC.searchSunny.some(s => s === v)).length >= 2;
  // console.log(`sunnyWeatherToMorrow = ${sunnyWeatherToMorrow}`);
  let rainWeatherToMorrow = nextDayForecast.weather.filter(v => AskaSC.searchRain.some(s => s === v)).length >= 2;
  // console.log(`rainWeatherToMorrow = ${rainWeatherToMorrow}`);
  if (sunnyWeatherPast && rainWeatherToMorrow) {
    str = asyncAsk.whatToSay(AskaSC, 'calcWatch2');
  } else if (rainWeatherPast && sunnyWeatherToMorrow) {
    str = asyncAsk.whatToSay(AskaSC, 'calcWatch1');
  }
  // console.log(`str = ${str}`);
  // console.log('//////////////////////////////');
  let tempPast = pastCollection.map(v => v.temp.reduce((p,n) => p += n, 0) / 3).every((v, i, arr) => {
    if (i == 2) {
      return true;
    }
    // console.log(Math.abs(v - arr[i+1]) < 5);
    return Math.abs(v - arr[i+1]) < 5;
  })
  // console.log(`tempPast = ${tempPast}`);
  let tempToDay = (pastCollection[2].temp[0]+pastCollection[2].temp[1]+pastCollection[2].temp[2]) / 3;
  // console.log(`tempToDay = ${tempToDay}`);
  let tempToMorrow = (nextDayForecast.temp[0]+nextDayForecast.temp[1]+nextDayForecast.temp[2]) / 3;
  // console.log(`tempToMorrow = ${tempToMorrow}`);
  if (Math.abs(tempToDay - tempToMorrow) > 4 && tempPast) {
    if (tempToDay > tempToMorrow) {
      str += `, ${asyncAsk.whatToSay(AskaSC, 'calcWatch3')} ${tempToText(Math.abs(tempToDay - tempToMorrow))}`;
    } else {
      str += `, ${asyncAsk.whatToSay(AskaSC, 'calcWatch4')} ${tempToText(Math.abs(tempToDay - tempToMorrow))}`;
    }
  }
  // console.log(`${y} ${str}`);
  if (str.length > 0) {
    str = `${asyncAsk.whatToSay(AskaSC, 'calcWatch0')} ${str}`;
    writeData(checkURL(str));
    writeData(3);
  }

}
module.exports.calcWatchWeather = calcWatchWeather;
