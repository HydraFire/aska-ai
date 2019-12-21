const fs = require('fs');
const https = require('https');
const fetch = require('node-fetch');
const md5 = require('blueimp-md5');
const sha1 = require('sha1');
// /////////////////////////////////////////////////////////////////////////////
const socket = require('../../webSocketOnMessage');
const asyncAsk = require('../../asyncAsk');
const { checkURL } = require('../../saveAska');
// /////////////////////////////////////////////////////////////////////////////
const fileOption = './data/commands/WebInteract/option.json';
const AskaSC = JSON.parse(fs.readFileSync(fileOption));
// /////////////////////////////////////////////////////////////////////////////
function xmltoJson( xml ) {
  xml = xml.substring(xml.search('>') + 1, xml.length);
  xml = xml.substring(xml.search('>') + 1, xml.length);
  let arr = [];
  while (xml.length > 20) {
    xml = xml.substring(xml.search('>') + 1, xml.length);
    arr.push( xml.substring(0, xml.search('<')));
    xml = xml.substring(xml.search('>') + 1, xml.length);
  }
  return arr;
}

function sayApiError(ws) {
  socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'bankApiError')));
}
function checkMoney() {
  const agent = new https.Agent({
    rejectUnauthorized: false
  })

  let data = `<oper>cmt</oper>
  <wait>0</wait>
  <test>0</test>
  <payment id="">
  <prop name="cardnum" value="${process.env.CARD_NUM}" />
  <prop name="country" value="UA" />
  </payment>`;

  return fetch(`https://api.privatbank.ua/p24api/balance`, {
        method: 'post',
        body:    `<?xml version="1.0" encoding="UTF-8"?>
              <request version="1.0">
                  <merchant>
                      <id>${process.env.MARCHENT_ID}</id>
                      <signature>${sha1(md5(`${data}${process.env.MARCHENT_PASSWORD}`))}</signature>
                  </merchant>
                  <data>
                      ${data}
                  </data>
              </request>`,
        headers: { 'Content-Type': 'text/xml' },
        agent
    })
    .then(res => res.text())
    .then(xml => {
      console.log(xml);
      return '333.00'
      /*JSON.parse(convert.xml2json(xml, {compact: true, spaces: 2}))
       .response
       .data
       .info
       .cardbalance
       .balance
       ._text
       */
    }).catch( err => console.log(err))
}

function checkMyMoney() {
  const agent = new https.Agent({
    rejectUnauthorized: false
  })

  let data = `<oper>cmt</oper>
  <wait>0</wait>
  <test>0</test>
  <payment id="">
  <prop name="cardnum" value="${process.env.CARD_NUM2}" />
  <prop name="country" value="UA" />
  </payment>`;

  return fetch(`https://api.privatbank.ua/p24api/balance`, {
        method: 'post',
        body:    `<?xml version="1.0" encoding="UTF-8"?>
              <request version="1.0">
                  <merchant>
                      <id>${process.env.MARCHENT_ID}</id>
                      <signature>${sha1(md5(`${data}${process.env.MARCHENT_PASSWORD}`))}</signature>
                  </merchant>
                  <data>
                      ${data}
                  </data>
              </request>`,
        headers: { 'Content-Type': 'text/xml' },
        agent
    })
    .then(res => res.text())
    .then(xml => {
      return '777.00'
      /*JSON.parse(convert.xml2json(xml, {compact: true, spaces: 2}))
       .response
       .data
       .info
       .cardbalance
       .balance
       ._text
       */
    }).catch( err => console.log(err))
}

function sayMoney(ws) {
  function say(money) {
    console.log(`money = ${money}`);
    money = money.split('.')[0];
    socket.send(ws, 'aska', `${money} ${AskaSC.currency[0]}`);
  }
  checkMoney()
    .then(say)
    .catch((err) => {
      console.log(err);
      sayApiError(ws);
    });
}
// /////////////////////////////////////////////////////////////////////////////
module.exports = { checkMoney, sayMoney, checkMyMoney };
