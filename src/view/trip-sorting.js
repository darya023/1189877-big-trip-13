const createSorting = (sortingItems) => {
  let result = [];

  for (let i = 0; i < sortingItems.length; i++) {
    const elem = `<div class="trip-sort__item  trip-sort__item--${sortingItems[i].value}">
      <input 
        id="sort-${sortingItems[i].value}" 
        class="trip-sort__input  
        visually-hidden" 
        type="radio" 
        name="trip-sort" 
        value="sort-${sortingItems[i].value}"
        ${(i === 0) ? ` checked` : ``}
        ${sortingItems[i].disabled ? `disabled` : ``}
      >
      <label class="trip-sort__btn" for="sort-${sortingItems[i].value}">
        ${sortingItems[i].name}
      </label>
    </div>`;

    result.push(elem);
  }

  return result.join(``);
};

export const createTripSortingTemplate = (sortingItems) => {
  const createdSorting = createSorting(sortingItems);

  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${createdSorting}
  </form>`;
};
