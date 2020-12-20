import AbstractView from "./abstract.js";

const createSiteMessageTemplate = (message) => {
  return `<p class="trip-events__msg">${message}</p>`;
};

export default class SiteMessage extends AbstractView {
  constructor(message) {
    super();
    this._message = message;
  }

  getTemplate() {
    return createSiteMessageTemplate(this._message);
  }
}
