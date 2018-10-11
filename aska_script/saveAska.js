const fs = require('fs');
const fetch = require('node-fetch');
const md5 = require('blueimp-md5');
const { countToText } = require('./commands/LifeCircles/calcTime');
const asyncAsk = require('./asyncAsk');
// //////////////////////////////
const filepath = './data/saveAska.json';
const savepath = './public/sample/';
const configpath = './config.json';
const logbookpath = './data/LogBook.json';
const fileOption = './data/commands/LifeCircles/option.json';
const AskaSC = JSON.parse(fs.readFileSync(fileOption));
// //////////////////////////////////////
/*
function delquestionMark(str) {
  return str.replace(/[?]/gi, '@');
}
*/
function readFile() {
  try {
    return JSON.parse(fs.readFileSync(filepath));
  } catch (err) {
    console.log('// BUILD new saveAska file list');
    return { all: [] };
  }
}
// //////////////////////////////////////
const arrAska = readFile();
// /////////////////////////////////////////////////////////////////////////////
function saveAudio(text, p) {
  /* eslint-disable */
  let tex = text;
  tex.length > 50 ? tex = tex.substring(0, 50) : '';
  console.log('SAVE // '+tex);
  let hash = md5(text);
  let url = 'https://tts.voicetech.yandex.net/generate?'+
      'key=222499e2-1e45-4b6d-aaaa-70b53b87c2ec'+
      '&text='+encodeURI(text)+
      '&format=mp3'+
      '&lang=ru-RU'+
      '&topic=queries'+
      '&speaker=oksana'+
      '&speed=1'+
      '&robot=1'+
      '&emotion=evil';
  /* eslint-enable */
  fetch(url)
    .then((res) => {
      return res.buffer();
    })
    .then((data) => {
      fs.writeFile(`${savepath}${hash}.mp3`, data, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
        if (p != 'big') {
          arrAska.all.push(text);
          fs.writeFileSync(filepath, JSON.stringify(arrAska), 'utf8');
        }
      });
    })
    .catch((error) => {
      console.log('request failed', error);
      if (p == 'big') {
        configOn(true, 'logbook');
      }
    });
}
// ////////////////////////////////////////////
function checkURL(text, p) {
  if (arrAska.all.some(v => v == text)) {
    text = `#${text}`;
  } else {
    setTimeout(() => {
      saveAudio(text, p);
    }, 3000);
  }
  return text;
}
module.exports.checkURL = checkURL;
// ////////////////////////////////////////////
function checkArray(arr, p) {
  return arr.map((v) => {
    if (v.substring(0, 1) != '#') {
      return checkURL(v, p);
    }
    return v;
  });
}
module.exports.checkArray = checkArray;

function checkSmartURL(str) {
  return checkArray(str.split('@*@')).join('@*@');
}
module.exports.checkSmartURL = checkSmartURL;
// //////////////////////////////////////////////////////////////////////////
function saveURL(text, i) {
  setTimeout(() => {
    saveAudio(text, 'big');
  }, 2000 + (1000 * i));
}
function splitOnParts(text) {
  const part = text.slice(0, 1000);
  let m = [...part].reverse().join('');
  const dot = m.indexOf('.');
  const coma = m.indexOf(',');
  if (dot != -1) {
    dot > coma ? m = coma : m = dot;
  } else {
    m = coma;
  }
  const chankStart = part.slice(0, 1000 - m);
  const chankEnd = text.slice(1000 - m);
  return [chankStart, chankEnd];
}
function checkBigURL(text) {
  let arr = [];
  const [a, b] = splitOnParts(text);
  arr.push(a);
  if (b.length != 0) {
    arr = arr.concat(checkBigURL(b));
  }
  return arr;
}
function checkLargeURL(text) {
  checkBigURL(text).forEach((v, i) => saveURL(v, i));
}
module.exports.checkLargeURL = checkLargeURL;
// ////////////////////////////////////////////////////////////////////////////
function readListMD5() {
  return fs.readdirSync(savepath);
}
function readLogBookFile() {
  try {
    return JSON.parse(fs.readFileSync(logbookpath));
  } catch (err) {
    console.log('// Config__logbook file not found');
    return [];
  }
}
function readConfig() {
  try {
    return JSON.parse(fs.readFileSync(configpath));
  } catch (err) {
    console.log('// Config file not found');
    return false;
  }
}
module.exports.readConfig = readConfig;

function configOn(boolean, type) {
  const config = readConfig();
  if (config[type] != boolean) {
    config[type] = boolean;
    fs.writeFileSync(configpath, JSON.stringify(config), 'utf8');
  }
}
module.exports.configOn = configOn;

function saveArrayURL(arr) {
  arr.forEach((v, i) => { if (v != '') { saveURL(v, i); } });
}
function renderLargeURL() {
  const config = readConfig();
  const listMd5 = readListMD5();
  if (config.logbook) {
    console.log('START DOWNLOAD LOGBOOK FILES');
    let arr = [];
    let logBookArray = readLogBookFile();
    logBookArray = logBookArray.filter(v => v.date > config.logbooktime);
    arr = logBookArray.reduce((a, b) => {
      let c = Object.keys(b).map(v => b[v]);
      c.splice(0, 1);
      return a.concat(c);
    }, []);
    arr = arr.reduce((a, b) => {
      return a.concat(checkBigURL(b));
    }, []);
    arr = arr.filter(v => listMd5.every(w => w != `${md5(v)}.mp3`));
    if (arr.length != 0) {
      saveArrayURL(arr);
    } else {
      configOn(false, 'logbook');
      console.log('configOn(false, logbook);');
    }
  }
}
module.exports.renderLargeURL = renderLargeURL;
// ////////////////////////////////////////////////////////////////////////////
function renderCount() {
  const config = readConfig();
  if (config.count) {
    let arr = new Array(config.countMax - config.countMin);
    for (let i = 0; i < arr.length; i += 1) {
      arr[i] = countToText(config.countMin + i);
    }
    console.log(arr);
    saveArrayURL(arr);
    configOn(false, 'count');
  }
}
module.exports.renderCount = renderCount;

function renDay(n) {
  let date = n;
  date += '';
  if (date != 0) {
    let d = date[date.length - 1];
    let dd = date[date.length - 2];
    if (dd == 1) { date += ' дней'; } else
    if (d == 0) { date += ' дней'; } else
    if (d == 1) { date += ' день'; } else
    if (d > 1 && d < 5) { date += ' дня'; } else
    if (d >= 5) { date += ' дней'; }
  } else { date = ''; }
  return date;
}
function renderDay() {
  const config = readConfig();
  if (config.day) {
    let arr = new Array(config.dayMax - config.dayMin);
    for (let i = 0; i < arr.length; i += 1) {
      arr[i] = renDay(config.dayMin + i);
    }
    saveArrayURL(arr);
    const t = asyncAsk.whatToSay(AskaSC, 'm2');
    arr = arr.map(v => `${t} ${v}`);
    saveArrayURL(arr);
    configOn(false, 'day');
  }
}
module.exports.renderDay = renderDay;

function renderT(hours, minutes) {
  hours += '';
  if (hours != 0) {
    let h = hours[hours.length - 1];
    let hh = hours[hours.length - 2];

    if (hh == 1) { hours += ' часов '; } else
    if (h == 0) { hours += ' часов '; } else
    if (h == 1) { hours += ' час '; } else
    if (h > 1 && h < 5) { hours += ' часа '; } else
    if (h >= 5) { hours += ' часов '; }
  } else { hours = ''; }

  minutes += '';
  if (minutes != 0) {
    let m = minutes[minutes.length - 1];
    let mm = minutes[minutes.length - 2];

    if (mm == 1) { minutes += ' минут '; } else
    if (m == 0) { minutes += ' минут '; } else
    if (m == 1) { minutes += ' минуту '; } else
    if (m > 1 && m < 5) { minutes += ' минуты '; } else
    if (m >= 5) { minutes += ' минут '; }
  } else { minutes = ''; }
  return `${hours}${minutes}`;
}
function renderTime() {
  const config = readConfig();
  if (config.time) {
    let arr = new Array(60);
    for (let i = 0; i < arr.length; i += 1) {
      arr[i] = renderT(config.timeH, i);
    }
    saveArrayURL(arr);
    arr = arr.map(v => `${v}назад`);
    saveArrayURL(arr);
    configOn(false, 'time');
  }
}
module.exports.renderTime = renderTime;
