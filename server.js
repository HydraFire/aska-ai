
require('dotenv').load();
// /////////////////////////////////////////////////////////////////////////////
const WebSocketServer = require('ws').Server;
const https = require('https');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
// Модули программы
const { webSocketOnConnect } = require('./aska_script/webSocketOnConnect');
const { init } = require('./aska_script/NN/fuckOffNN');
const { readFileActions } = require('./aska_script/mainTimeCircle');
const {
  renderLargeURL,
  renderCount,
  renderDay,
  renderTime
} = require('./aska_script/saveAska');
//
const exp = express();
exp.use(express.static(`${__dirname}/public`));
exp.use(bodyParser.json());

exp.get('/actions', function(req, res){
  res.sendFile(`${__dirname}/data/actions.json`);
  console.log('SendData to nightmare');
});
exp.post('/actions', function(req, res){
  fs.writeFileSync('./data/actions.json', JSON.stringify(JSON.parse(fs.readFileSync('./data/actions.json')).map(v => {
    let temp = req.body.filter(f => v.name === f.name);
    if (temp.length > 0) {
      return temp[0];
    }
    return v;
  })), 'utf8');
  console.log('GetData from nightmare');
  readFileActions();
  res.end('saved');
});
//
const key = fs.readFileSync('./private.key');
const cert = fs.readFileSync('./primary.crt');
const ca = fs.readFileSync('./intermediate.crt');
const options = {
  key,
  cert,
  ca
};
//
//
// http Server
const server = http.createServer(exp).listen(process.env.PORT);
// https server
const serverHttps = https.createServer(options, exp).listen(process.env.PORTS);
// WebSocketServer
const wss = new WebSocketServer({ server });
const wsp = new WebSocketServer({ server: serverHttps });
webSocketOnConnect(wss);
webSocketOnConnect(wsp);

renderLargeURL();
renderCount();
renderDay();
renderTime();
