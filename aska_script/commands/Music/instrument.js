const fs = require('fs');
const music = require('./Music');
// //////////////////////////////////////////////////////////////////////////
const fileDBpath = './data/musicDB.json';
const filepath = './public/music/';
let filename = '';
// ///////////////////////////////////////////////////////////////////////////
function saveFile(message) {
  fs.writeFileSync(`${filepath}${filename}`, message);
}
module.exports.saveFile = saveFile;
function newFile(name) {
  filename = name;
}
module.exports.newFile = newFile;
// /////////////////////////////////////////////////////////////////////////////
function refreshDB() {
  let arr = [];
  try {
    arr = JSON.parse(fs.readFileSync(fileDBpath));
  } catch (err) {
    console.log(err);
  }
  const list = fs.readdirSync(filepath);

  arr = arr.filter((v) => {
    return list.some(value => value === v.name);
  });

  let newTracks = list.filter((v) => {
    return !arr.some(value => value.name === v);
  });

  newTracks = newTracks.map((v) => {
    return {
      name: v,
      tag: [],
      value: 0
    };
  });

  arr = arr.concat(newTracks);
  fs.writeFileSync(fileDBpath, JSON.stringify(arr), 'utf8');
}
module.exports.refreshDB = refreshDB;
// /////////////////////////////////////////////////////////////////////////////
function addValue(ws, track, n, play) {
  const arr = JSON.parse(fs.readFileSync(fileDBpath));
  arr.map((v) => {
    if (v.name === track.name) {
      v.value += n;
      v.tag = track.tag;
    }
    return v;
  });
  fs.writeFileSync(fileDBpath, JSON.stringify(arr), 'utf8');
  play ? music.playMusic(ws, track.nowTag) : '';
}
module.exports.addValue = addValue;
// /////////////////////////////////////////////////////////////////////////////
function deleteT(ws, track) {
  fs.unlinkSync(`${filepath}${track.name}`);
  refreshDB();
  music.playMusic(ws, track.nowTag);
}
module.exports.deleteT = deleteT;
// /////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////
function commands(ws, data) {
  console.log(data);
  switch (data.type) {
    case 'ended':
      addValue(ws, data.track, 1, true);
      break;
    case 'uploadName':
      newFile(data.data);
      break;
    case 'uploadEnd':
      refreshDB();
      break;
    default:
      console.log('err');
  }
}
module.exports.commands = commands;
