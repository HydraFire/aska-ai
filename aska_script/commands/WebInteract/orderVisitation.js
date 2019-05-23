const fs = require('fs');
// /////////////////////////////////////////////////////////////////////////////
const socket = require('../../webSocketOnMessage');
const asyncAsk = require('../../asyncAsk');
const { checkURL } = require('../../saveAska');
const { checkMoney } = require('./checkMoney');
const { checkOnline, sendAnswer, assembleTheParts, sayConnectError } = require('./instrument');
// /////////////////////////////////////////////////////////////////////////////
const fileOption = './data/commands/WebInteract/option.json';
const AskaSC = JSON.parse(fs.readFileSync(fileOption));
// /////////////////////////////////////////////////////////////////////////////

// /////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////
function sayDataError(ws, err) {
  console.log(err);
  ws.lifeCirclesResponse = 'error';
  socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, arguments.callee.name)));
}

function allIsDone(ws) {
  asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, arguments.callee.name)));
  ws.lifeCirclesResponse = 'done';
}

// /////////////////////////////////////////////////////////////////////////////
function scenario(ws, typeVisit, visitOt, visitDo, isAuto) {
  console.log(`${typeVisit} ${visitOt} ${visitDo} ${isAuto}`);
  let part0, part1;
  //
  part0 = `
    nightmare
    .goto('https://www.ipay.ua/ua/bills/oplata-kommunalnyh-uslug-cherez-internet-komfort-taun')
    .wait(4000)
    .type('#billform-acc', '${process.env.MAIN_KV}')
    .select('#billform-address', "вул. Регенераторна 4")
    .type('#billform-fio', '${process.env.MAIN_NAME_FULL}')
    .type('#billform-invoice', ${tarif})
    .wait(1000)
    .click('#first_step_continue')
    .wait(3000)
    .type('#cardform-pan', '${process.env.CARD_NUM}')
    .type('#cardform-expm', '${process.env.CARD_MY}')
    .type('#cardform-cvv', '${process.env.CARD_CVV}')
    .type('#cardform-fio', '${process.env.MAIN_NAME}')
    .wait(1000)
    .click('button[type="submit"]')
    .wait(10000)
    .evaluate(() => {
      return document.querySelector('.paymentRequisites-step4-success').outerText;
    })
  `;

  function allOk(obj) {
    console.log(obj.value);
    if (obj.value == "Платіж успішно здійснений") {
      allIsDone(ws, money);
    } else {
      payError(ws, obj.value)
    }
    sendAnswer(ws, 'answer', { ok: 'ok' }, empty);
  }

  part1 = `
    nightmare
    .wait(1000)
    .evaluate(() => {
      return "ok";
    })
  `;

  function empty() {
    console.log('all is ok');
  }

  sendAnswer(ws, 'sendCode', assembleTheParts(part0, part1), allOk);

}
// /////////////////////////////////////////////////////////////////////////////

// ////////////////////////////////////////////////////////////////////////////

// /////////////////////////////////////////////////////////////////////////////
function askAutoIsIt(ws, typeVisit, visitOt, visitDo) {
  asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, arguments.callee.name)), () => {
    asyncAsk.selectFunctionFromWords(ws, [
      {
        func: () => {
          scenario(ws, typeVisit, visitOt, visitDo, ws.ClientSay);
        },
        words: AskaSC.isIt,
        end: true
      }
    ], () => {
      socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'answerTOVDef3')));
  });
}

function askTimeOfVisitDo(ws, typeVisit, visitOt) {
  asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, arguments.callee.name)), () => {
    asyncAsk.selectFunctionFromWords(ws, [
      {
        func: () => {
          askAutoIsIt(ws, typeVisit, visitOt, ws.ClientSay);
        },
        words: [''],
        isNumber: true,
        end: true
      }
    ], () => {
      socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'answerTOVDef2')));
  });
}

function askTimeOfVisitOt(ws, typeVisit) {
  asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, arguments.callee.name)), () => {
    asyncAsk.selectFunctionFromWords(ws, [
      {
        func: () => {
          askTimeOfVisitDo(ws, typeVisit, ws.ClientSay);
        },
        words: [''],
        isNumber: true,
        end: true
      }
    ], () => {
      socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'answerTOVDef2')));
  });
}

function askTypeOfVisit(ws) {
  asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, arguments.callee.name)), () => {
    asyncAsk.selectFunctionFromWords(ws, [
      {
        func: () => {
          askTimeOfVisitOt(ws, ws.ClientSay)
        },
        words: AskaSC.typeOfVisit,
        end: true
      },{
        func: () => {
          socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'cancel')));
        },
        words: AskaSC.cansel,
        end: true
      }
    ], () => {
      socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'answerTOVDef')));
    });
  });
}
// /////////////////////////////////////////////////////////////////////////////
function orderVisitation(ws) {
  checkOnline(ws).then((res) => {
    res.status === 200 ? askMeterReadingsDay(ws) : sayConnectError(ws);
  });
}
module.exports = { orderVisitation };
