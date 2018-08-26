const fs = require('fs');
const socket = require('../../webSocketOnMessage');
const asyncAsk = require('../../asyncAsk');
const { checkURL } = require('../../saveAska');
const { addValue, deleteT } = require('./instrument');
// ///////////////////////////////
// ///////////////////////////////
const fileOption = './data/commands/Music/option.json';
const fileDBpath = './data/musicDB.json';
const AskaSC = JSON.parse(fs.readFileSync(fileOption));
// /////////////////////////////////////////////////////////////////////////////
let arrAllTag = [];
function getAllTag() {
  let arr = [];
  try {
    arr = JSON.parse(fs.readFileSync(fileDBpath));
  } catch (err) {
    console.log(err);
  }
  arrAllTag = arr.reduce((a, b) => {
    return a.concat(b.tag.filter(v => !a.some(w => w === v)));
  }, []);
}
getAllTag();
// /////////////////////// ВКЛЮЧИ МУЗЫКУ ///////////////////////////////////////
function playMusic(ws, parameters) {
  let arr = JSON.parse(fs.readFileSync(fileDBpath));
  if (parameters != '') {
    arr = arr.filter(v => v.tag.some(w => w === parameters));
  }
  arr.sort((a, b) => {
    if (a.value > b.value) {
      return 1;
    }
    if (a.value < b.value) {
      return -1;
    }
    return 0;
  });
  if (arr != '') {
    const random = Math.random() * (arr.length / 10 | 0) | 0;
    const obj = arr[random];
    obj.nowTag = parameters;
    obj.allTag = arrAllTag;
    ws.endedTracks.push(obj);
    socket.send(ws, 'music', obj);
    setTimeout(() => {
      socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'y0')));
    }, 1000);
    // console.log(ws.endedTracks);
  } else {
    socket.send(ws, 'aska', checkURL(`${asyncAsk.whatToSay(AskaSC, 'z1')}`));
  }
}
module.exports.playMusic = playMusic;
// ////////////////////// ВЫКЛЮЧИ МУЗЫКУ ///////////////////////////////////////
function stopMusic(ws) {
  socket.send(ws, 'music', { name: 'stop' });
  socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'y1')));
}
// ////////////////////// следующий трек ///////////////////////////////////////
function nextTrack(ws) {
  addValue(ws, ws.endedTracks[ws.endedTracks.length - 1], 4, true);
}
function prevTrack(ws) {
  ws.endedTracks.splice(ws.endedTracks.length - 1, 1);
  // console.log(ws.endedTracks);
  socket.send(ws, 'music', ws.endedTracks[ws.endedTracks.length - 1]);
}
function starTrack(ws) {
  addValue(ws, ws.endedTracks[ws.endedTracks.length - 1], -7, false);
  socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'y2')));
}
function deleteTrack(ws) {
  const text = `${asyncAsk.whatToSay(AskaSC, 's0')}, ${ws.endedTracks[ws.endedTracks.length - 1].name}`;
  const defaultFunction = function defaultFunction() {
    socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 's1')));
  };
  function deleteTrack2() {
    const nowTag = ws.endedTracks[ws.endedTracks.length - 1].nowTag;
    deleteT(ws, ws.endedTracks[ws.endedTracks.length - 1]);
    socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 's5')));
  }
  const negative = function negative() {
    socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 's2')));
  };
  const packaging = function packaging() {
    asyncAsk.selectFunctionFromWords(ws, [
      {
        func: deleteTrack2,
        words: AskaSC.s3,
        end: true
      }, {
        func: negative,
        words: AskaSC.s4,
        end: true
      }
    ], defaultFunction);
  };
  asyncAsk.readEndWait(ws, text, packaging);
}
function volumeTrack(ws, parameters) {
  parameters = parameters.join(' ');
  let n = 0;
  if (parameters === AskaSC.z0[0]) {
    n = -0.4;
  } else if (parameters === AskaSC.z0[1]) {
    n = -0.2;
  } else if (parameters === AskaSC.z0[2]) {
    n = 0.2;
  } else if (parameters === AskaSC.z0[3]) {
    n = 0.4;
  }
  socket.send(ws, 'music', { name: 'volume', data: n });
}
function addTag(ws, parameters) {
  parameters = parameters.join(' ');
  if (parameters != '') {
    arrAllTag.push(parameters);
    socket.send(ws, 'music', { name: 'tag', tag: parameters, alltags: arrAllTag });
  }
}
// ////////////////////////////////////////////////////////////////////////////
function Music(ws, options, parameters) {
  console.log(`options = ${options} // parameters = ${parameters}`);
  switch (options) {
    case '1':
      playMusic(ws, parameters.join(' '));
      break;
    case '2':
      stopMusic(ws);
      break;
    case '3':
      nextTrack(ws);
      break;
    case '4':
      prevTrack(ws);
      break;
    case '5':
      starTrack(ws);
      break;
    case '6':
      deleteTrack(ws);
      break;
    case '7':
      volumeTrack(ws, parameters);
      break;
    case '8':
      addTag(ws, parameters);
      break;
    default:
      // console.log('err');
  }
}
module.exports.Music = Music;
