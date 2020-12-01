import {createElement} from "../utils.js";

const createSiteMsgTemplate = (msg) => {
  return `<p class="trip-events__msg">${msg}</p>`;
};

export default class SiteMsg {
  constructor(msg) {
    this._msg = msg;
    this._element = null;
  }

  getTemplate() {
    return createSiteMsgTemplate(this._msg);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
