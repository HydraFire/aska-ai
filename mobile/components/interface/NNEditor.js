import React from 'react';
import InputLayer from './inputLayer';
import socket from '../webSocketClient';
import myRender from './NNEditorRender';
import '../../css/nneditor.css';



class NNEditor extends React.Component {
  constructor() {
    super();
    this.state = {
      loadbutton: true,
      inputLayer: false,
      nowpickFunc: '',
      nowpickSector: '',
      nowpickArr: '',
      nowpicktext: '',
      newText: '',
      data: null
    };
  }
  // ////////////// При нажатии на елемент открывает компонент Editor //////////
  editHandler = (e) => {
    this.setState({
      inputLayer: true,
      nowpickArr: e.target.parentElement.getAttribute("description"),
      nowpicktext: e.target.innerText,
      newText: e.target.innerText
    });
  }
  // ////////////////// После нажатия на SAVE вносит изменения в state  ///////
  editStateHandler = () => {
    const newText = this.state.newText;
    const pickF = this.state.nowpickFunc;
    const pickS = this.state.nowpickSector;
    const pickA = this.state.nowpickArr;
    const pickT = this.state.nowpicktext;

    const objFunc = this.state.data[pickF];

    if (pickS === 'ignor' || pickS === 'description') {
      if (pickT === '+' && newText != '' && newText != '+') {
        objFunc[pickS].push(newText);
      } else if (pickT !== '+' && newText === '') {
        objFunc[pickS].splice(objFunc[pickS].indexOf(pickT), 1);
      } else if (pickT !== '+' && newText != '') {
        objFunc[pickS].splice(objFunc[pickS].indexOf(pickT), 1, newText);
      }
    }

    if (pickS === 'option') {
      if (pickT === '+' && newText != '' && newText != '+') {
        objFunc.nn[pickA].push(newText);
      } else if (pickT !== '+' && newText === '') {
        objFunc.nn[pickA].splice(objFunc.nn[pickA].indexOf(pickT), 1);
      } else if (pickT !== '+' && newText != '') {
        objFunc.nn[pickA].splice(objFunc.nn[pickA].indexOf(pickT), 1, newText);
      }
    }

    if (pickS === 'says') {
      if (pickT === '+' && newText != '' && newText != '+') {
        objFunc[pickA].push(newText);
      } else if (pickT !== '+' && newText === '') {
        objFunc[pickA].splice(objFunc[pickA].indexOf(pickT), 1);
      } else if (pickT !== '+' && newText != '') {
        objFunc[pickA].splice(objFunc[pickA].indexOf(pickT), 1, newText);
      }
    }

    const copystate = this.state.data;
    copystate[pickF] = objFunc;

    this.setState({
       inputLayer: false,
       data: copystate
     });
  }
  // ////////////////// Закрывает компонент при нажатии CANCEL ////////////////
  editCancelHandler = () => {
    this.setState({ inputLayer: false });
  }
  // ////////////////// Вносит изменения поля инпут в state ///////////////////
  editChange = (e) => {
    this.setState({ newText: e.target.value });
  }
  // ///////// Главная функция прорисовует весь основной интерфейс ////////////

  // //////////////////////////////////////////////////////////////////////////
  sectionHendler = (e) => {
    this.setState({ nowpickSector: e.target.innerText});
  }
  selectorHendler = (e) => {
    this.setState({ nowpickFunc: e.target.value});
  }
  inputRender = () => {
    if (this.state.inputLayer) {
      return <InputLayer
        editChange = {this.editChange}
        editStateHandler = {this.editStateHandler}
        editCancelHandler = {this.editCancelHandler}
        nowpicktext = {this.state.nowpicktext}
        newText = {this.state.newText}
        />;
    }
  }
  // //////////////////////////////////////////////////////////////////////////
  buttonloadSocket = () => {
    socket.send('load','editor');
  }
  loadSocket = function (data) {
    data = JSON.parse(data);

    this.setState({
      loadbutton: false,
      nowpickFunc: 'LifeCircles',
      nowpickSector: 'description',
      data
    });
  };
  saveSocket = () => {
    socket.send(this.state.data, 'editor');
  }
  doneSocket = () => {
    this.setState({ loadbutton: 'done' });
  }
  loadButton = () => {
    if (this.state.loadbutton === true) {
      return <button onClick={this.buttonloadSocket} className="buttonSave">Load</button>
    } else if (this.state.loadbutton === false) {
      return <button onClick={this.saveSocket} className="buttonSave">Save</button>
    } else {
      return <button className="buttonSave">Done</button>
    }
  }
  buildOption = () => {
    if (this.state.data != null) {
      return Object.keys(this.state.data).map(v => <option key={v} value={v}>{v}</option>)
    }
  }
  // //////////////////////////////////////////////////////////////////////////
  render() {
    return (
      <div>
        {this.inputRender()}
        <select onChange={this.selectorHendler} className="droplist">
          {this.buildOption()}
        </select>
        {this.loadButton()}
        <div className="section">
          <button onClick={this.sectionHendler} className="buttonSection">description</button>
          <button onClick={this.sectionHendler} className="buttonSection">option</button>
          <button onClick={this.sectionHendler} className="buttonSection">ignor</button>
          <button onClick={this.sectionHendler} className="buttonSection">says</button>
        </div>
        <div className="editor_container">
          {myRender(this.state, this.editHandler)}
        </div>
      </div>
    );
  }
}


export default NNEditor;
