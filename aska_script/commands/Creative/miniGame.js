const fs = require('fs');
const fetch = require('node-fetch');
const socket = require('../../webSocketOnMessage');
const mainTimeCircle = require('../../mainTimeCircle');
const asyncAsk = require('../../asyncAsk');
const { checkURL } = require('../../saveAska');
const { updateKnowsFromInternet }= require('./instrument')

const fileOption = './data/commands/Creative/option.json';
const AskaSC = JSON.parse(fs.readFileSync(fileOption));

function readWordsArray() {
  try {
    return JSON.parse(fs.readFileSync('./data/arrayText.json'))
  } catch (err) {
    return []
  }
}


function deleteWords( arr ) {
  arr.splice(0,1)
  fs.writeFileSync('./data/arrayText.json', JSON.stringify(arr), 'utf8');
}


function addWords( arr ) {
  let option = JSON.parse(fs.readFileSync('./data/commands/Creative/option.json'))

  if (arr[0].length > 35) {

    option.big.push(arr[0])

  } else if (arr[0].length > 18) {

    option.meddium.push(arr[0])

  } else if (arr[0].length > 2) {

    option.small.push(arr[0])
  }
  fs.writeFileSync('./data/commands/Creative/option.json', JSON.stringify(option), 'utf8');
  deleteWords( arr )
}

function nextQuestion(ws, arr ) {
  arr = readWordsArray()
  sayWords(ws, arr)
}

function sayWords(ws, arr) {
  asyncAsk.readEndWait(ws, arr[0], () => {
    asyncAsk.selectFunctionFromWords(ws, [
      {
        func: () => {
          addWords(arr)
          nextQuestion(ws, arr)
        },
        words: AskaSC.yes,
        end: true
      },
      {
        func: () => {
          deleteWords(arr)
          nextQuestion(ws, arr)
        },
        words: AskaSC.no,
        end: true
      },
      {
        func: () => {
          asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, 'gameOver')), mainTimeCircle.shortInterval)
        },
        words: AskaSC.end,
        end: true
      }
    ], () => {
      socket.send(ws, arr[0]);
    });
  });
}


function miniGame(ws) {

  let arr = readWordsArray()

  if (arr.length == 0) {

    updateKnowsFromInternet();

  } else {

    asyncAsk.readEndWait(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'gameStart')));
    sayWords(ws, arr)

  }
}
module.exports.miniGame = miniGame;
