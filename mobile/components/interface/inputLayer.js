import React from 'react';
import { aska } from '../speechSynthesizer';
import '../../css/inputLayer.css';

class InputLayer extends React.Component {
  testwithAska = () => {
    aska(this.props.newText);
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
            <span role="img" onClick={this.testwithAska} aria-label="speaker" className="voice_input">🔊</span>
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
