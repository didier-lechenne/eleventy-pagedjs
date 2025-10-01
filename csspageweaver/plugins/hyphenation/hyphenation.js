import { Handler } from "../../../lib/paged.esm.js";

export default class Hyphenation extends Handler {
  
  afterRendered() {
    setTimeout(() => {
      ['hyphen-main', 'hyphen-footnotes'].forEach(id => {
        const cb = document.getElementById(id);
        if (cb) {
          cb.checked = localStorage.getItem(id) !== 'false';
          cb.addEventListener('change', () => {
            localStorage.setItem(id, cb.checked);
            location.reload();
          });
        }
      });
    }, 500);
  }
}