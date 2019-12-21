const fs = require('fs');
const fetch = require('node-fetch');
const convert = require('xml-js');
const { from, merge, of } = require('rxjs');
const { switchMap, concatMap, map, delay, reduce } = require( 'rxjs/operators');

// /////////////////////////////////////////////////////////////////////////////
function isOK( arrWords ) {
  return arrWords.length > 0;
}

function writeIgnoredVidioArray( alreadyListened ) {
  try {
    fs.writeFileSync('./data/ignorVideo.json', JSON.stringify(JSON.parse(fs.readFileSync('./data/ignorVideo.json')).concat(alreadyListened)), 'utf8');
  } catch (err) {
    fs.writeFileSync('./data/ignorVideo.json', JSON.stringify(alreadyListened), 'utf8');
  }
}

function readIgnoredVidioArray() {
  try {
    return JSON.parse(fs.readFileSync('./data/ignorVideo.json'))
  } catch (err) {
    return []
  }
}


function getSubtitles( videoID ) {
  return from( fetch(`https://video.google.com/timedtext?type=track&v=${videoID}&id=0&lang=ru`))
  .pipe(
    switchMap(response => response.text()),
    map(v => JSON.parse(convert.xml2json(v, {compact: true, spaces: 2}))),
    map(v =>({ id: videoID, arrText: v.transcript.text.map( s => s._text) }))
  )
}



function getArrFromCannel( channel ) {
  return from( fetch(`https://www.googleapis.com/youtube/v3/search?key=AIzaSyCocLXZCsXxn9R3470GjQNXERVDcz7sPk8&channelId=${channel}&part=snippet,id&order=date&maxResults=4`))
  .pipe(
    switchMap(response => response.json()),
    map(v => v.items.map(s=>s.id.videoId).filter(f=>f))
  )
}
//;



function getNewKnowledgeFromInternet(arr, arrIgnor) {
  merge(...arr.map(v => getArrFromCannel(v)))
    .pipe(
      map(v =>v.filter(f => !arrIgnor.some(s => s == f))),
      reduce((acc, currentValue) => [ ...acc, ...currentValue ], [])
    )
    .subscribe(arr => circleToAllVideo(arr));
}


function circleToAllVideo( arr ) {

  let arrayText = [];
  let alreadyListened = [];

  from(arr)
  .pipe(
    concatMap(item => of(item).pipe(delay(2000))),
    switchMap(v => getSubtitles(v))
  )
  .subscribe(obj => {
    if(!isOK(obj.arrText)) return;
    arrayText.push(obj.arrText)
    alreadyListened.push(obj.id)
  },
  null,
  () => {
    concatAndRandomizeArray(arrayText)
    writeIgnoredVidioArray(alreadyListened)
  }
  )
}


function concatAndRandomizeArray( arrayText ) {
  if (arrayText.length == 0) {
    console.log('нет новыйх видео');
  } else {
    arrayText = arrayText
      .reduce((a,c) => a.concat(c),[])
      .map(a => [Math.random(), a])
      .sort((a, b) => a[0] - b[0]).map(a => a[1]);
    fs.writeFileSync('./data/arrayText.json', JSON.stringify(arrayText), 'utf8');
  }
}

function updateKnowsFromInternet() {
  getNewKnowledgeFromInternet(['UCQuDYVdemGofgSX9LujILcQ','UCo-gAYrvd7WIrCRsNueddtQ','UC5X7iRFTg24q8X01_W42OGg'], readIgnoredVidioArray())
}

module.exports.updateKnowsFromInternet = updateKnowsFromInternet;
