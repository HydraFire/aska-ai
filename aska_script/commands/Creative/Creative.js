const fs = require('fs');
const fetch = require('node-fetch');
const socket = require('../../webSocketOnMessage');
const asyncAsk = require('../../asyncAsk');
const { checkURL } = require('../../saveAska');
// ////////////////////////////////////////////////////////////////////////////
const fileData = './data/weather.json';
const fileOption = './data/commands/Creative/option.json';
const AskaSC = JSON.parse(fs.readFileSync(fileOption));

function Creative(ws, option, parameters) {
  function test() {
  /*
  let a = [{id: 1, int: 300}, {id: 333, int: 1000}, {id: 672, int: 5000}];

  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += a[i].int;
  }

  let rand = Math.floor(Math.random() * sum);

  let i = 0;
  for (let s = a[0].int; s <= rand; s += a[i].int) {
    i++;
  }

  console.log(a[i].id);
  */

    /*
    const arrA = {
      small: ['s0','s1','s2','s3','s4','s5'],
      meddium: ['mmm0','mmm1','mmm2','mmm3','mmm4','mmm5'],
      big: ['bbbbbb0','bbbbbb1','bbbbbb2','bbbbbb3','bbbbbb4','bbbbbb5']
    }
    */
    const settings = {
      small: 3,
      meddium: 2,
      big: 1,
      goodMorning: 1
    }

    const choices = Object.keys(settings);

    function anotherOneRecurse(arr, choice) {
      let r = AskaSC[choice][Math.random()*AskaSC[choice].length|0];
      if (arr.some(v => v == r)) {
        r = anotherOneRecurse(arr, choice);
      }
      /*
      if (choice == 'big') {
        r += '.'
      } else {
        r += ','
      }
      */
      return r;
    }

    function randomRecurse(arr) {
      let choice = choices[Math.random()*choices.length|0];
// //////////////////////////// Привила // ////////////////////////////////////
      if (settings[choice] != 0 && arr.length != 0) {
        arr.push(anotherOneRecurse(arr, choice));
        settings[choice] -= 1;
      }

      if (choice == 'goodMorning' && arr.length == 0) {
        arr.push(anotherOneRecurse(arr, choice));
        settings[choice] -= 1;
      }
// ////////////////////////////////////////////////////////////////////////////
      if (settings.goodMorning == 0 &&
          settings.small == 0 &&
          settings.meddium == 0 &&
          settings.big == 0) {} else {
        arr = randomRecurse(arr);
      }
      return arr;
    }

    let arr = [];
    arr = randomRecurse(arr);
    //arr = arr.join(' ');
    //arr = arr.substring(0, arr.length -1);
    //arr += '.';
    return arr;
  }
  return test();
}
module.exports.Creative = Creative;
