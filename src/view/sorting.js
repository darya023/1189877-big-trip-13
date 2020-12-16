import AbstractView from "./abstract.js";
import {SortingType} from "../const.js";

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
        data-sortingType="${SortingType[sortingItems[i].value.toUpperCase()]}"
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

const createTripSortingTemplate = (sortingItems) => {
  const createdSorting = createSorting(sortingItems);

  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${createdSorting}
  </form>`;
};

export default class Sorting extends AbstractView {
  constructor(sortingItems) {
    super();
    this._sortingItems = sortingItems;
    this._sortingItemClickHandler = this._sortingItemClickHandler.bind(this);
    this._sortingElements = this._getChildElements(`.trip-sort__input`);
    this._sortingType = SortingType.DAY;
  }

  getTemplate() {
    return createTripSortingTemplate(this._sortingItems);
  }

  _getChildElements(selector) {
    return this.getElement().querySelectorAll(selector);
  }

  _sortingItemClickHandler(event) {
    this._sortingType = event.target.dataset.sortingtype.toUpperCase();
    this._callback.sortingItemClick(this._sortingType);
  }

  setSortingItemClickHandler(callback) {
    this._callback.sortingItemClick = callback;
    this._sortingElements.forEach((item) => {
      item.addEventListener(`click`, this._sortingItemClickHandler);
    });
  }
}
