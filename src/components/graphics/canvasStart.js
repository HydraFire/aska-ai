import Equalizer from './animation/Equalizer';
import Kaleidoscope from './animation/Kaleidoscope';
import Anime from './animation/Anime';

function canvasStart(options) {
  // Выбираем анимацию
  switch (options.effectName) {
    case 'Equalizer':
      Equalizer();
      break;
    case 'Kaleidoscope':
      Kaleidoscope();
      break;
    case 'Anime':
      Anime();
      break;
    default:
      Equalizer();
      break;
  }
}
export default canvasStart;
