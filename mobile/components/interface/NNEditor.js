import React from 'react';

import '../../css/nneditor.css';

class NNEditor extends React.Component {
  componentDidMount() {
    // graphicsStart();
    // socket.start(process.env.HOSTNAME);
    // speechRec();
  }
  render() {
    return (
      <div>
        <select className="droplist">
          <option value="LifeCircles">LifeCircles</option>
          <option value="Logbook">Logbook</option>
          <option value="Quest">Quest</option>
          <option value="Reaction">Reaction</option>
          <option value="Login">Login</option>
          <option value="ReadClipboard">ReadClipboard</option>
        </select>
        <button className="buttonSave">save</button>
        <div className="section">
          <button className="buttonSection">description</button>
          <button className="buttonSection">option</button>
          <button className="buttonSection">ignore</button>
          <button className="buttonSection">says</button>
        </div>
        <div className="editor_container">
          <div className="editor_view">
            h1:
            <div className="editor_count" >
              <div className="editor_text">
                привет
              </div>
              <div className="editor_text">
                как дела
              </div>
              <div className="editor_text">
                тут разные
              </div>
              <div className="editor_text">
                так не пойдет
              </div>
              <div className="editor_text">
                ну давай чтото разное
              </div>
              <div className="editor_text">
                приколы и не только
              </div>
              <div className="editor_text">
                а когда
              </div>
              <div className="editor_text">
                нужно проверить
              </div>
              <div className="editor_text">
                еще больше
              </div>
              <div className="editor_text">
                нужно подганять под размер
              </div>
              <div className="editor_text">
                +
              </div>
            </div>
          </div>
          <div className="editor_view">
            h2:
            <div className="editor_count" >
              <div className="editor_text">
                привет
              </div>
              <div className="editor_text">
                как дела
              </div>
              <div className="editor_text">
                тут разные
              </div>
              <div className="editor_text">
                так не пойдет
              </div>
              <div className="editor_text">
                ну давай чтото разное
              </div>
              <div className="editor_text">
                приколы и не только
              </div>
              <div className="editor_text">
                а когда
              </div>
              <div className="editor_text">
                нужно проверить
              </div>
              <div className="editor_text">
                еще больше
              </div>
              <div className="editor_text">
                нужно подганять под размер
              </div>
              <div className="editor_text">
                +
              </div>
            </div>
          </div>
          <div className="editor_view">
            h3:
            <div className="editor_count" >
              <div className="editor_text">
                привет
              </div>
              <div className="editor_text">
                как дела
              </div>
              <div className="editor_text">
                тут разные
              </div>
              <div className="editor_text">
                так не пойдет
              </div>
              <div className="editor_text">
                нужно проверить
              </div>
              <div className="editor_text">
                еще больше
              </div>
              <div className="editor_text">
                нужно подганять под размер
              </div>
              <div className="editor_text">
                +
              </div>
            </div>
          </div>
          <div className="editor_view">
            h4:
            <div className="editor_count" >
              <div className="editor_text">
                привет
              </div>
              <div className="editor_text">
                ну давай чтото разное
              </div>
              <div className="editor_text">
                приколы и не только
              </div>
              <div className="editor_text">
                нужно проверить
              </div>
              <div className="editor_text">
                еще больше
              </div>
              <div className="editor_text">
                нужно подганять под размер
              </div>
              <div className="editor_text">
                +
              </div>
            </div>
          </div>
          <div className="editor_view">
            h5:
            <div className="editor_count" >
              <div className="editor_text">
                привет
              </div>
              <div className="editor_text">
                как дела
              </div>
              <div className="editor_text">
                тут разные
              </div>
              <div className="editor_text">
                так не пойдет
              </div>
              <div className="editor_text">
                ну давай чтото разное
              </div>
              <div className="editor_text">
                приколы и не только
              </div>
              <div className="editor_text">
                а когда
              </div>
              <div className="editor_text">
                нужно проверить
              </div>
              <div className="editor_text">
                еще больше
              </div>
              <div className="editor_text">
                нужно подганять под размер
              </div>
              <div className="editor_text">
                +
              </div>
            </div>
          </div>
          <div className="editor_view">
            h6:
            <div className="editor_count" >
              <div className="editor_text">
                привет
              </div>
              <div className="editor_text">
                как дела
              </div>
              <div className="editor_text">
                тут разные
              </div>
              <div className="editor_text">
                так не пойдет
              </div>
              <div className="editor_text">
                ну давай чтото разное
              </div>
              <div className="editor_text">
                еще больше
              </div>
              <div className="editor_text">
                нужно подганять под размер
              </div>
              <div className="editor_text">
                +
              </div>
            </div>
          </div>
          <div className="editor_view">
            h7:
            <div className="editor_count" >
              <div className="editor_text">
                привет
              </div>
              <div className="editor_text">
                как дела
              </div>
              <div className="editor_text">
                нужно проверить
              </div>
              <div className="editor_text">
                еще больше
              </div>
              <div className="editor_text">
                нужно подганять под размер
              </div>
              <div className="editor_text">
                +
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default NNEditor;
