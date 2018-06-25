import socket from './webSocketClient';
import { newMessage } from './interface/displayCanvasMessage';
// import { startStopRec } from './speechRecognition';
/* eslint-disable */
let audio
let audio2
let aska_mute = false;

function handleMediaError() {
  aska_mute = true;
}

function initAudio() {
  audio = document.getElementById('audio');
  audio2 = document.getElementById('audio2');
  audio.addEventListener('error', handleMediaError);
}
// /////////////////////////////////////////////////////////////////////////////
function aska(text) {
  newMessage(text, false);

  if (aska_mute){
    socket.send('speech_start','AUDIO');
    setTimeout(()=>{
      socket.send('speech_end','AUDIO');
    }, 1500);
  } else {
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
          // iconsole.logC('audioTag.play()');
          // console.log(audioTag.volume)
          audioTag.play();
          socket.send('speech_start','AUDIO');
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
        playAudio(playText);
        if(text.length == 0){
          audioTag.addEventListener('pause',()=>{
            // console.log('SHUT_UP')
            socket.send('speech_end','AUDIO');
            // startStopRec();
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
}

export { aska, initAudio };
