import React from 'react';
import { aska } from '../speechSynthesizer';
import '../../css/inputLayer.css';

window.SpeechRecognitionInputWindow = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognitionInputWindow = new SpeechRecognitionInputWindow();
recognitionInputWindow.interimResults = true;
recognitionInputWindow.lang = 'ru-RU';

function transcriptText(text) {
  /* eslint-disable */
  text = Array.from(text)
    .map(v => v[0])
    .map(v => v.transcript)
    .join('').toLowerCase();
  /* eslint-enable */
  return text;
}
// /////////////////////////////////////////////////////////////////////////////
class InputLayer extends React.Component {
  componentWillMount() {
    recognitionInputWindow.addEventListener('result', (e) => {
      // Финальное значение разпознавания
      if (e.results[0].isFinal) {
        let inp = document.querySelector('.input_tag');
        inp.value += transcriptText(e.results);;
        this.props.editHardChange(inp.value);
      }
    });
  }
  testwithAska = () => {
    aska(this.props.newText);
  }

  micAska = () => {
    recognitionInputWindow.start();
  }

  render() {
    let defvalue = this.props.nowpicktext;
    if (defvalue === '+') {
      defvalue = '';
    }
    return (
      <div className="input_bg">
        <div className="main_window">
          <div className="emoji_window">
            <span role="img" onClick={this.testwithAska} aria-label="speaker" className="voice_output">🔊</span>
            <span role="img" onClick={this.micAska} aria-label="mic" className="voice_input">🎤</span>
          </div>
          <div className="input_window">
            <input defaultValue={defvalue} onChange={this.props.editChange} className="input_tag" type="text" />
          </div>
          <button onClick={this.props.editCancelHandler}className="button_input">Cancel</button>
          <button onClick={this.props.editStateHandler} className="button_input">Save</button>
        </div>
      </div>
    );
  }
}


export default InputLayer;
