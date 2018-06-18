
require('dotenv').load();
// /////////////////////////////////////////////////////////////////////////////
const WebSocketServer = require('ws').Server;
const https = require('https');
// const http = require('http');
const express = require('express');
const fs = require('fs');
// Модули программы
const { webSocketOnConnect } = require('./aska_script/webSocketOnConnect');
const { SmartTrain } = require('./aska_script/NN/differenceNN');
const { mainTimeCircle } = require('./aska_script/mainTimeCircle');
//
const exp = express();
exp.use(express.static(`${__dirname}/public`));
//
const key = fs.readFileSync('./privkey.pem');
const cert = fs.readFileSync('./cert.pem');
const ca = fs.readFileSync('./fullchain.pem');
const options = {
  key,
  cert,
  ca
};
//
//
// http Server
// const server = http.createServer(exp).listen(process.env.PORT);
// https server
const server = https.createServer(options, exp).listen(process.env.PORT);
// WebSocketServer
const wss = new WebSocketServer({ server });
webSocketOnConnect(wss);
// Тренеруэм нейроную сеть если обновились команды
SmartTrain();
// Главный цикл обслуживает все задания и напоминания
setInterval(() => {
  mainTimeCircle();
}, 60000 * 5);
