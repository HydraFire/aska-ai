
let pastTime = Date.now();

let lastCoords = [0,0]

function getCoords() {
  return lastCoords;
}

function success(position) {
  let latitude  = position.coords.latitude;
  let longitude = position.coords.longitude;
  lastCoords = [latitude, longitude];

  window.myconsole.log(`<p>Latitude is ${latitude} <br>Longitude is ${longitude}</p>`, 'html');
/*
  const now = Date.now();
  const sum = (now - pastTime) / 1000 | 0;
  const min = sum / 60 | 0;
  const sec = sum % 60;
  if (min == 0) {
    window.myconsole.log(`${sec}s`,'str');
  } else {
    window.myconsole.log(`${min}m ${sec}s`,'str');
  }
  pastTime = now;
  window.myconsole.log(`-----------------------`, 'str');
  */
};

function error() {
  window.myconsole.log('Unable to retrieve your location', 'err');
};

var geo_options = {
  enableHighAccuracy: true,
//  maximumAge        : 30000,
//  timeout           : 27000
};


function init() {
  /*
  if (!navigator.geolocation){
    window.myconsole.log('Geolocation is not supported by your browser', 'err');
    return;
  }
  */
  navigator.geolocation.getCurrentPosition(success, error, geo_options);
  //navigator.geolocation.watchPosition(success, error, geo_options);
}

module.exports.init = init;
module.exports.getCoords = getCoords;
