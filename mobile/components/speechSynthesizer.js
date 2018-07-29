import socket from './webSocketClient';
import { newMessage } from './interface/displayCanvasMessage';
// import { startStopRec } from './speechRecognition';
import { play20Hz } from './quest';
/* eslint-disable */
let audio
let audio2
let errorCount = 0;
let aska_mute = false;

function handleMediaError() {
  errorCount += 1;
  if (errorCount > 1) {
    aska_mute = true;
    alert(`aska_mute = ${aska_mute}`);
  }

}

function initAudio() {
  audio = document.getElementById('audio');
  audio2 = document.getElementById('audio2');
  audio.addEventListener('error', handleMediaError);
}
function stopAska() {
  audio.pause();
  audio2.pause();
  socket.send('speech_end','AUDIO');
}
// /////////////////////////////////////////////////////////////////////////////
function aska(text) {
  window.myconsole.log(text, 'aska');

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
        if (text == '20Hz') {
          url = 'http://localhost:8080/coub/20Hz.mp3';
        }
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

export { aska, initAudio, stopAska };
