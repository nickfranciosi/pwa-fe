import QrCode from 'qrcode-reader';
import { qrCodeStringToObject } from './utils/qrcode.js';

self.onmessage = (event) => {
  let qr = new QrCode();
  qr.callback = function (error, rawResult) {
    if (error) {
      self.postMessage({ error });
      return;
    }
    let result = qrCodeStringToObject(rawResult.result);
    self.postMessage({ result });
  }
  qr.decode(event.data);
}