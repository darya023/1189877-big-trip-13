import AbstractView from "./abstract.js";

const createAddButtonTemplate = (isNotDisabled) => {
  return `<button 
      class="trip-main__event-add-btn  btn  btn--big  btn--yellow" 
      type="button"
      ${isNotDisabled ? `` : `disabled`}
    >
      New event
    </button>`;
};

export default class AddButton extends AbstractView {
  constructor(isNotDisabled) {
    super();
    this._isNotDisabled = isNotDisabled;
    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createAddButtonTemplate(this._isNotDisabled);
  }

  _clickHandler(event) {
    event.preventDefault();
    this._callback.click();
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().addEventListener(`click`, this._clickHandler);
  }
}
