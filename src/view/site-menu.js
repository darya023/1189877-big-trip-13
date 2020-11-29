const createMenuItems = (menuItems) => {
  let result = [];

  for (let i = 0; i < menuItems.length; i++) {
    const elem = `<a class="trip-tabs__btn${ (i === 0) ? ` trip-tabs__btn--active` : ``}" href="#">
      ${menuItems[i].name}
    </a>`;

    result.push(elem);
  }

  return result.join(``);
};

export const createSiteMenuTemplate = (menuItems) => {
  const createdMenuItems = createMenuItems(menuItems);

  return `<h2 class="visually-hidden">Switch trip view</h2>
  <nav class="trip-controls__trip-tabs  trip-tabs">
    ${createdMenuItems}
  </nav>`;
};
