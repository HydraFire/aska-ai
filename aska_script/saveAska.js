const fs = require('fs');
const fetch = require('node-fetch');
// //////////////////////////////
const filepath = './data/saveAska.json';
const savepath = './public/sample/';
// //////////////////////////////////////
function readFile() {
  try {
    return JSON.parse(fs.readFileSync(filepath));
  } catch (err) {
    return { all: [] };
  }
}
function delquestionMark(str) {
  return str.replace(/[?]/gi, '@');
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
      fs.writeFile(`${savepath}${filename}.mp3`, data);
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
    arrAska.all.push(text);
    fs.writeFileSync(filepath, JSON.stringify(arrAska), 'utf8');
  }
  return text;
}
module.exports.checkURL = checkURL;
