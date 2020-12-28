import AbstractView from "./abstract.js";

const createMenuItems = (menuItems) => {
  const result = [];

  for (let i = 0; i < menuItems.length; i++) {
    const elem = `<a class="trip-tabs__btn${ (i === 0) ? ` trip-tabs__btn--active` : ``}" href="#">
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
  }

  getTemplate() {
    return createSiteMenuTemplate(this._menuItems);
  }
}
