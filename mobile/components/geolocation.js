
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
};

function error() {
  window.myconsole.log('Unable to retrieve your location', 'err');
};

var geo_options = {
  enableHighAccuracy: true,
//  maximumAge        : 30000,
//  timeout           : 27000
};

function promiseGeo() {
  return new Promise((res, req) => {
    navigator.geolocation.getCurrentPosition( position => {
      lastCoords = [position.coords.latitude, position.coords.longitude];
      window.myconsole.log(`<p>Latitude is ${lastCoords[0]} <br>Longitude is ${lastCoords[1]} accuracy ${coords.accuracy}</p>`, 'html');
      res([position.coords.latitude, position.coords.longitude])
    }, () => {
      window.myconsole.log('Unable to retrieve your location', 'err');
      req()
    })
  })
}

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

module.exports.promiseGeo = promiseGeo;
module.exports.init = init;
module.exports.getCoords = getCoords;
