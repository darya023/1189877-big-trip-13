import {createElement} from "../utils/render.js";

const SHAKE_ANIMATION_TIMEOUT = 600;

export default class Abstract {
  constructor() {
    if (new.target === Abstract) {
      throw new Error(`Can't instantiate Abstract, only concrete one.`);
    }

    this._element = null;
    this._callback = {};
  }

  getTemplate() {
    throw new Error(`Abstract method not implemented: getTemplate`);
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

  shake(callback) {
    const form = this.getElement().querySelector(`.event--edit`);

    form.classList.add(`shake`);

    setTimeout(() => {
      callback();
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  show() {
    throw new Error(`Abstract method not implemented: show`);
  }

  hide() {
    throw new Error(`Abstract method not implemented: hide`);
  }
}
