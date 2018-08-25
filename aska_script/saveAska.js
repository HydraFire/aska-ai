const fs = require('fs');
const fetch = require('node-fetch');
// //////////////////////////////
const filepath = './data/saveAska.json';
const savepath = './public/sample/';
// //////////////////////////////////////
function delquestionMark(str) {
  return str.replace(/[?]/gi, '@');
}
function addquestionMark(str) {
  return str.replace(/[@]/gi, '?');
}
function delmp3Mark(str) {
  return str.replace(/[.mp3]/gi, '');
}
function getlistFile() {
  const obj = { all: [] };
  const list = fs.readdirSync(savepath);
  list.forEach((v) => {
    v = addquestionMark(v);
    v = delmp3Mark(v);
    obj.all.push(v);
  });
  fs.writeFileSync(filepath, JSON.stringify(obj), 'utf8');
  return obj;
}

function readFile() {
  try {
    return JSON.parse(fs.readFileSync(filepath));
  } catch (err) {
    console.log(err);
    console.log('// BUILD new saveAska file list');
    return getlistFile();
  }
}
// //////////////////////////////////////
const arrAska = readFile();
// /////////////////////////////////////////////////////////////////////////////
function saveAudio(text) {
  /* eslint-disable */
  console.log('SAVE /////'+text);
  let filename = text;
  if (filename.includes('?')) {
    filename = delquestionMark(filename);
  }
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
      fs.writeFile(`${savepath}${filename}.mp3`, data, () => {
        console.log(`SAVE... ${savepath}${filename}.mp3 .. DONE`);
        arrAska.all.push(text);
        fs.writeFileSync(filepath, JSON.stringify(arrAska), 'utf8');
        console.log('arrAska ...UPDATE');
      });
    })
    .catch((error) => {
      console.log('request failed', error);
    });
}
// ////////////////////////////////////////////
function checkURL(text) {
  if (arrAska.all.some(v => v == text)) {
    text = `#${text}`;
  } else {
    setTimeout(() => {
      saveAudio(text);
    }, 3000);
  }
  return text;
}
module.exports.checkURL = checkURL;
