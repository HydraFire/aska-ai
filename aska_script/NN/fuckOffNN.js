const fs = require('fs');
const socket = require('../webSocketOnMessage');
const { getOptions } = require('./optionalNN');
const { getParameters } = require('./parameterNN');
// ////////////////////////////////////////////////////////////////////////////
const { Asmr } = require('../commands/Asmr/Asmr');
const { LifeCircles } = require('../commands/LifeCircles/LifeCircles');
const { Quest } = require('../commands/Quest/Quest');
const { Logbook } = require('../commands/Logbook/Logbook');
const { Reaction } = require('../commands/Reaction/Reaction');
const { Login } = require('../commands/Login/Login');
const { ReadClipboard } = require('../commands/ReadClipboard/ReadClipboard');
const { Music } = require('../commands/Music/Music');
const { Weather } = require('../commands/Weather/Weather');
const { WebScraping } = require('../commands/WebScraping/WebScraping');
const { WebInteract } = require('../commands/WebInteract/WebInteract');
// /////////////////////////////////////////////////////////////////////////////
const commands = {
  Asmr,
  LifeCircles,
  Quest,
  Logbook,
  Reaction,
  Login,
  ReadClipboard,
  Music,
  Weather,
  WebScraping,
  WebInteract
};
// /////////////////////////////////////////////////////////////////////////////
let intelligentObjects = [];
// /////////////////////////////////////////////////////////////////////////////
function buildIntelligentObjects(src, fileName, exception) {
  const list = fs.readdirSync(src).filter(f => f != exception).map((v) =>
      ({ [v]: JSON.parse(fs.readFileSync(`${src}${v}${fileName}`)).nn })
  );
  const collection = list.reduce((prev, next) => {
    let [fname] = Object.keys(next);
    return prev.concat(next[fname].reduce((p, n, i) => {
      return p.concat(n.map(v => {
        return {
          keyWords: v,
          decisionName: fname,
          option: i,
          mass: v.length
        };
      }));
    },[]));
  },[]);
  return collection;
}
// /////////////////////////////////////////////////////////////////////////////
function checkWordPattern(pattern, text){
  let arr = pattern.split('...');
  let mass = arr.join(' ').length;
  // console.log(mass);
  arr = arr.map(v => text.search(v))
  // console.log(arr);
  arr = arr.reduce((prev, next) => {
    if (next >= prev) {
      return next;
    } else {
      return undefined;
    }
  }, 0);
  // console.log(arr);
  mass = mass <= text.length;
  arr = arr != undefined;
  return mass && arr;
}
// /////////////////////////////////////////////////////////////////////////////
function decisionMaking(text) {
 return intelligentObjects.filter(f => {
   if (f.keyWords.search('...') != -1) {
     return checkWordPattern(f.keyWords, text);
   }
   return text.search(f.keyWords) != -1;
 }).sort((a, b) => {
   return b.mass - a.mass
 });
}
// /////////////////////////////////////////////////////////////////////////////
function start(ws, text) {
  ws.onlyOpened = false;
  let decision = decisionMaking(text);
  console.log(decision);
  if (decision.length == 0) {
    commands['Reaction'](ws, '1', '');
  } else {
    decision = decision[0];
    commands[decision.decisionName](ws, `${decision.option + 1}`, getParameters(text, decision.decisionName));
  }
}
module.exports.start = start;
// /////////////////////////////////////////////////////////////////////////////
function init() {
 intelligentObjects = buildIntelligentObjects('./data/commands/','/option.json','System');
}
module.exports.init = init;
