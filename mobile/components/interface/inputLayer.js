import React from 'react';
import { aska } from '../speechSynthesizer';
import '../../css/inputLayer.css';

window.SpeechRecognitionInputWindow = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognitionInputWindow = new SpeechRecognitionInputWindow();
recognitionInputWindow.interimResults = true;
recognitionInputWindow.lang = 'ru-RU';

 function stringSplice(text, idx, rem, str) {
    return text.slice(0, idx) + str + text.slice(idx + Math.abs(rem));
};

function transcriptText(text) {
  text = Array.from(text)
    .map(v => v[0])
    .map(v => v.transcript)
    .join('').toLowerCase();
  return text;
}

recognitionInputWindow.addEventListener('result', (e) => {
  if (e.results[0].isFinal) {
    let input_textarea = document.querySelector('.input_tag');
    let caretPos = input_textarea.selectionStart;
    input_textarea.value = stringSplice(input_textarea.value, caretPos, 0, transcriptText(e.results));
    window.editorComponent.editHardChange(input_textarea.value);
  }
});
// /////////////////////////////////////////////////////////////////////////////
class InputLayer extends React.Component {

  testwithAska = () => {
    aska(this.props.newText);
  }

  micAska = () => {
    recognitionInputWindow.start();
  }

  textareaSizer = (string) => {
    let x = Math.ceil(string.length / 30);
    x > 19 ? x = 19 : '';
    return x;
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
            <textarea defaultValue={defvalue} onChange={this.props.editChange} cols="2" rows={this.textareaSizer(this.props.nowpicktext)} className="input_tag" wrap="soft" />
          </div>
          <button onClick={this.props.editCancelHandler}className="button_input">Cancel</button>
          <button onClick={this.props.editStateHandler} className="button_input">Save</button>
        </div>
      </div>
    );
  }
}


export default InputLayer;
