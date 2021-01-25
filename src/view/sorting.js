import AbstractView from "./abstract.js";
import {SortingType} from "../const.js";

const createSorting = (sortingItems, currentSortingType) => {
  const result = [];

  for (const sortingItem of sortingItems) {
    const elem = `<div class="trip-sort__item  trip-sort__item--${sortingItem.type}">
      <input 
        id="sort-${sortingItem.type}" 
        class="trip-sort__input  
        visually-hidden" 
        type="radio" 
        name="trip-sort" 
        value="sort-${sortingItem.type}"
        data-sortingType="${SortingType[sortingItem.type.toUpperCase()]}"
        ${(currentSortingType === SortingType[sortingItem.type.toUpperCase()]) ? ` checked` : ``}
        ${(sortingItem.disabled) ? `disabled` : ``}
      >
      <label class="trip-sort__btn" for="sort-${sortingItem.type}">
        ${sortingItem.name}
      </label>
    </div>`;

    result.push(elem);
  }

  return result.join(``);
};

const createTripSortingTemplate = (sortingItems, currentSortingType) => {
  const createdSorting = createSorting(sortingItems, currentSortingType);

  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${createdSorting}
  </form>`;
};

export default class Sorting extends AbstractView {
  constructor(sortingItems, currentSortingType) {
    super();
    this._currentSortingType = currentSortingType;
    this._sortingItems = sortingItems;
    this._sortingItemClickHandler = this._sortingItemClickHandler.bind(this);
    this._sortingElements = this._getChildElements(`.trip-sort__input`);
  }

  getTemplate() {
    return createTripSortingTemplate(this._sortingItems, this._currentSortingType);
  }

  _getChildElements(selector) {
    return this.getElement().querySelectorAll(selector);
  }

  _sortingItemClickHandler(event) {
    this._callback.sortingItemClick(event.target.dataset.sortingtype);
  }

  setSortingItemClickHandler(callback) {
    this._callback.sortingItemClick = callback;
    this._sortingElements.forEach((item) => {
      item.addEventListener(`click`, this._sortingItemClickHandler);
    });
  }
}
