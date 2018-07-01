import React from 'react';

function myRender(state, editHandler) {
  let arr;
  let mainArr;
  if (state.data != null) {
    if (state.nowpickSector === 'ignor' || state.nowpickSector === 'description') {
      arr = state.data[state.nowpickFunc][state.nowpickSector].map((v, i) => {
        return <div key={i} onClick={editHandler} className="editor_text">{v}</div>;
      });
      arr.push(<div key={arr.length} onClick={editHandler} className="editor_text">+</div>);
      mainArr = (
        <div className="editor_view" >
          {state.nowpickSector}:
          <div description={state.nowpickSector} className="editor_count">
            {arr}
          </div>
        </div>);
    // ///////////////////////////////////////////////////////////////////////////
    } else if (state.nowpickSector === 'option') {
      mainArr = state.data[state.nowpickFunc].nn.map((v, i) => {
        arr = v.map((w, index) => {
          return <div key={index} onClick={editHandler} className="editor_text">{w}</div>;
        });
        arr.push(<div key={arr.length} onClick={editHandler} className="editor_text">+</div>);
        return (
          <div key={i} className="editor_view" >
            option {i}:
            <div key={i} description={i} className="editor_count">
              {arr}
            </div>
          </div>);
      });
    } else if (state.nowpickSector === 'says') {
      const arrKey = Object.keys(state.data[state.nowpickFunc])
      arrKey.splice(0, 1);
      arrKey.splice(0, 1);
      arrKey.splice(0, 1);
      mainArr = arrKey.map((v, i) => {
        arr = state.data[state.nowpickFunc][v].map((w, index) => {
          return <div key={index} onClick={editHandler} className="editor_text">{w}</div>;
        });
        arr.push(<div key={arr.length} onClick={editHandler} className="editor_text">+</div>);
        return (
          <div key={i} className="editor_view" >
            {v}:
            <div key={i} description={v} className="editor_count">
              {arr}
            </div>
          </div>);
      });
    }
  }
  return mainArr;
}
export default myRender;
