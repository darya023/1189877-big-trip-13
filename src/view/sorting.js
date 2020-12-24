import AbstractView from "./abstract.js";
import {SortingType} from "../const.js";

const createSorting = (sortingItems, currentSortingType) => {
  let result = [];

  for (let i = 0; i < sortingItems.length; i++) {
    const elem = `<div class="trip-sort__item  trip-sort__item--${sortingItems[i].type}">
      <input 
        id="sort-${sortingItems[i].type}" 
        class="trip-sort__input  
        visually-hidden" 
        type="radio" 
        name="trip-sort" 
        value="sort-${sortingItems[i].type}"
        data-sortingType="${SortingType[sortingItems[i].type.toUpperCase()]}"
        ${(currentSortingType === SortingType[sortingItems[i].type.toUpperCase()]) ? ` checked` : ``}
        ${sortingItems[i].disabled ? `disabled` : ``}
      >
      <label class="trip-sort__btn" for="sort-${sortingItems[i].type}">
        ${sortingItems[i].name}
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
