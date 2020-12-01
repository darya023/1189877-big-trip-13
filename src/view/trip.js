import {createElement} from "../utils.js";

const createTripTemplate = () => {
  return `<ul class="trip-events__list"></ul>`;
};

export default class Trip {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTripTemplate();
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
