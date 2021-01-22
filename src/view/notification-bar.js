import AbstractView from "./abstract.js";

const createNotificationBarTemplate = (message) => {
  return `<div class="notification-bar">
    <div class="page-body__container page-body__container--without-line">
      <p class="notification-bar__text">${message}</p>
    </div>
  </div>`;
};

export default class NotificationBar extends AbstractView {
  constructor(message) {
    super();
    this._message = message;
  }

  getTemplate() {
    return createNotificationBarTemplate(this._message);
  }
}
