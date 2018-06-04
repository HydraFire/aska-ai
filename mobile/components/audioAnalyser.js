// WebAudioAnalyser
import webAnalyser from 'web-audio-analyser';

function analyserGetReady() {
  const audio = document.getElementById('audio');
  audio.crossOrigin = 'Anonymous';
  const analyser = webAnalyser(audio);
  return analyser;
}

export default analyserGetReady;
