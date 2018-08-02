import iconsole from './interface/iconsole';
import socket from './webSocketClient';
import { recStop, recStart } from './speechRecognition';
/* eslint-disable */
function aska(text) {
  const audio = document.getElementById('audio');
  const audio2 = document.getElementById('audio2');
  // iconsole.logC(text);

  function choseAudioTag(text, audioTag, num) {
    function playAudio(text) {
      let url = 'https://tts.voicetech.yandex.net/generate?'+
          'key=222499e2-1e45-4b6d-aaaa-70b53b87c2ec'+
          '&text='+encodeURI(text)+
          '&format=mp3'+
          '&lang=ru-RU'+
          '&topic=queries'+
          '&speaker=oksana'+
          '&speed=1'+
          '&robot=1'+
          '&emotion=evil';//evil

      audioTag.src = url;
      audioTag.onloadeddata = function onloadeddata() {
        iconsole.logC('audioTag.play()');
        audioTag.play();
        socket.send('speech_start','AUDIO');
        recStop();
      }
    };
    function splitOnParts(text){
      let part = text.slice(0,1000);
      let m = [...part].reverse().join('').indexOf('.');
      let chankStart = part.slice(0,1000-m);
      let chankEnd = text.slice(1000-m);
      return [chankStart,chankEnd]
    };
    function splitAndPlay(text){
      let playText = '';
      [playText,text] = splitOnParts(text);
      // console.log([playText,text]);
      playAudio(playText);
      if(text.length == 0){
        // console.log(audioTag);
        audioTag.addEventListener('pause',()=>{
          // console.log('SHUT_UP')
          socket.send('speech_end','AUDIO');
          // startStopRec();
          recStart();
        },{once:true})
      }
      return text
    }

    text = splitAndPlay(text)

    if (text.length > 0) {
      const p = new Promise((resolve) => {
        audioTag.addEventListener('ended', () => text.length > 0 ? text = splitAndPlay(text):resolve('d'));
      });
      p.then((data) => {
        audioTag.removeEventListener('ended',() => text.length > 0 ? text=splitAndPlay(text):resolve('d'));
      });
    }
  }
  if (text.length > 0) {
    audio.paused ? choseAudioTag(text, audio, 1) : choseAudioTag(text, audio2, 2);
  }
}

export default aska;
