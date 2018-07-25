
require('dotenv').load();
// /////////////////////////////////////////////////////////////////////////////
const WebSocketServer = require('ws').Server;
const https = require('https');
const http = require('http');
const express = require('express');
const fs = require('fs');
// Модули программы
const { webSocketOnConnect } = require('./aska_script/webSocketOnConnect');
const { SmartTrain } = require('./aska_script/NN/differenceNN');
//
const exp = express();
exp.use(express.static(`${__dirname}/public`));
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
// Тренеруэм нейроную сеть если обновились команды
SmartTrain();
