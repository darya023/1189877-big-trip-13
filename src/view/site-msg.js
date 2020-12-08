import AbstractView from "./abstract.js";

const createSiteMsgTemplate = (msg) => {
  return `<p class="trip-events__msg">${msg}</p>`;
};

export default class SiteMsg extends AbstractView {
  constructor(msg) {
    super();
    this._msg = msg;
    this._element = null;
  }

  getTemplate() {
    return createSiteMsgTemplate(this._msg);
  }
}
