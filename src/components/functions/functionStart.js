import { read, translate } from './readClipboard';

const functionType = function functionType(type) {
  switch (type) {
    case 'read':
      read();
      break;
    case 'translate':
      translate();
      break;
    default:
      break;
  }
};
export default functionType;
