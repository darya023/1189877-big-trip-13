import AbstractView from "./abstract.js";

const createMenuItems = (menuItems) => {
  const result = [];

  for (let i = 0; i < menuItems.length; i++) {
    const elem = `<a class="trip-tabs__btn${ (menuItems[i].active) ? ` trip-tabs__btn--active` : ``}" href="#" value="${menuItems[i].name.toUpperCase()}">
      ${menuItems[i].name}
    </a>`;

    result.push(elem);
  }

  return result.join(``);
};

const createSiteMenuTemplate = (menuItems) => {
  const createdMenuItems = createMenuItems(menuItems);

  return `<h2 class="visually-hidden">Switch trip view</h2>
  <nav class="trip-controls__trip-tabs  trip-tabs">
    ${createdMenuItems}
  </nav>`;
};

export default class SiteMenu extends AbstractView {
  constructor(menuItems) {
    super();
    this._menuItems = menuItems;
    this._menuElements = this._getChildElements(`.trip-tabs__btn`);

    this._menuClickHandler = this._menuClickHandler.bind(this);

  }

  getTemplate() {
    return createSiteMenuTemplate(this._menuItems);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this._menuElements.forEach((item) => {
      item.addEventListener(`click`, this._menuClickHandler);
    });
  }

  _getChildElements(selector) {
    return this.getElement().querySelectorAll(selector);
  }

  _menuClickHandler(event) {
    const menuItem = event.target.attributes.value.value;

    event.preventDefault();
    this._callback.menuClick(menuItem);
  }
}
