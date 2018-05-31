// let's go!
import './css/logotype.css';
import WebSocketClient from './components/webSocketClient';
import { speechRec, startStopRec } from './components/speechRecognition';


WebSocketClient.start();
speechRec();

const askaButton = document.querySelector('#projectName');
console.log(askaButton);
askaButton.addEventListener('click', startStopRec);
