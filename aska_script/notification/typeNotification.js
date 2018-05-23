const { saveNotificationID, getVapidKeys } = require('./pushNotification');

function setKey(v) {
  saveNotificationID(v);
}
module.exports.setKey = setKey;

function getKey(ws) {
  ws.send(JSON.stringify({
    type: 'notificationPublicKey',
    data: getVapidKeys().publicKey
  }));
}
module.exports.getKey = getKey;
