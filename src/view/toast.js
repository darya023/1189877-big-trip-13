import AbstractView from "./abstract.js";

const createToastItemTemplate = (message) => {
  return `<div class="toast">
    <div class="toast__item">${message}</div>
  </div>`;
};

const createToastTemplate = (message) => {
  const toastItem = createToastItemTemplate(message);
  return `<div class="toast">
    ${toastItem}
  </div>`;
};

export default class Toast extends AbstractView {
  constructor(message) {
    super();
    this._message = message;
  }

  getTemplate() {
    return createToastTemplate(this._message);
  }
}
