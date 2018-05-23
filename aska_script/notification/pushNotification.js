const webpush = require('web-push');
const fs = require('fs');

function getVapidKeys() {
  let keys;
  try {
    keys = JSON.parse(fs.readFileSync('data/vapidKeys.txt'));
  } catch (err) {
    keys = webpush.generateVAPIDKeys();
    fs.writeFile('data/vapidKeys.txt', JSON.stringify(keys), (error) => {
      if (error) throw err;
      console.log('The file vapidKeys has been saved!');
    });
  }
  return keys;
}
module.exports.getVapidKeys = getVapidKeys;

function saveNotificationID(data) {
  fs.writeFile('data/NotificationID.txt', data, (err) => {
    if (err) throw err;
    console.log('The file NotificationID has been saved!');
  });
}
module.exports.saveNotificationID = saveNotificationID;

function getNotificationID() {
  return JSON.parse(fs.readFileSync('data/NotificationID.txt'));
}
module.exports.getNotificationID = getNotificationID;

function sendNotification(pushSubscription, text) {
  console.log('<-------------TEST-------------->');
  webpush.sendNotification(pushSubscription, text);
}
module.exports.sendNotification = sendNotification;
// ////////////////////////////////////////////////////////////////////
const vapidKeys = getVapidKeys();
webpush.setGCMAPIKey('AAAArAClWUg:APA91bFucMn9GrzZ5fRkfJt6ZCWUbWLP_X4JzjnjtZaiczDzFy_DoLrTKwH010bvoX_ApN7bAnObDC_YOedpiIrmmw7LorY8kfpFmX9SjC7I_Qog2z8hcfg_lugnBHCrfgGm5l8FY8qR');
webpush.setVapidDetails(
  'mailto:example@yourdomain.org',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);
/*
setInterval(() => {
  const NotificationID = getNotificationID();
  sendNotification(NotificationID);
}, 50000);
*/
