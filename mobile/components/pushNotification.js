import socket from './webSocketClient';
/* eslint-disable */
let vapidPublicKey = '';

function registerServiceWorker() {
  return navigator.serviceWorker.register('service-worker.js')
  .then(function(registration) {
    console.log('Service worker successfully registered.');
    return registration;
  })
  .catch(function(err) {
    console.error('Unable to register service worker.', err);
  });
}
function askPermission() {
  return new Promise(function(resolve, reject) {
    const permissionResult = Notification.requestPermission(function(result) {
      resolve(result);
    });

    if (permissionResult) {
      permissionResult.then(resolve, reject);
    }
  })
  .then(function(permissionResult) {
    if (permissionResult !== 'granted') {
      throw new Error('We weren\'t granted permission.');
    }
  });
}
////////////////////////////////////////////////////////////////////
function urlBase64ToUint8Array(base64String) {
      const padding = '='.repeat((4 - base64String.length % 4) % 4);
      const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');
      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);
      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    }
//////////////////////////////////////////////////////////////
function subscribeUserToPush() {
  return navigator.serviceWorker.register('service-worker.js')
  .then(function(registration) {
    const subscribeOptions = {
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
    };

    return registration.pushManager.subscribe(subscribeOptions);
  })
  .then(function(pushSubscription) {
    socket.send(JSON.stringify(pushSubscription),'notificationSetKey');
    localStorage.subscribeNotification = true;
    return pushSubscription;
  });
}

function unsubscribe() {
  localStorage.subscribeNotification = false;
  navigator.serviceWorker.register('service-worker.js')
    .then(function(registration) {
        registration.pushManager.getSubscription().then(
      function(pushSubscription) {
        pushSubscription.unsubscribe();
      })
    })
}

function sendSocketToGetPublicKey() {
  socket.send('doNotMatter','notificationGetKey');
}
function setVapidPublicKey(str) {
  vapidPublicKey = str;
  subscribeUserToPush();
}
function subscribeBS() {
  const subscribeButton = document.querySelector('#subscribe')
  if(subscribeButton){
    subscribeButton.addEventListener('click', sendSocketToGetPublicKey);
  }
  const unsubscribeButton = document.querySelector('#unsubscribe')
  if(unsubscribeButton){
    unsubscribeButton.addEventListener('click', unsubscribe);
  }
}
export default { subscribeBS, setVapidPublicKey }
