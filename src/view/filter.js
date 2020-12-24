import AbstractView from "./abstract.js";

const createFilterItems = (filters, currentFulterType) => {
  let result = [];

  for (let i = 0; i < filters.length; i++) {
    const elem = `<div class="trip-filters__filter">
      <input 
        id="filter-${filters[i].type}"
        class="trip-filters__filter-input
        visually-hidden"
        type="radio"
        name="trip-filter"
        value="${filters[i].type}"
        ${filters[i].type === currentFulterType ? ` checked` : ``}
        ${filters[i].disable ? ` disabled` : ``}
      >
      <label class="trip-filters__filter-label" for="filter-${filters[i].type}">
        ${filters[i].type}
      </label>
    </div>`;

    result.push(elem);
  }

  return result.join(``);
};

const createFilterTemplate = (filters, currentFulterType) => {
  const createdFilterItems = createFilterItems(filters, currentFulterType);

  return `<h2 class="visually-hidden">Filter events</h2>
  <form class="trip-filters" action="#" method="get">
    ${createdFilterItems}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;
};

export default class Filter extends AbstractView {
  constructor(filters, currentFulterType) {
    super();
    this._filters = filters;
    this._currentFulterType = currentFulterType;
    this._filterTypeClickHandler = this._filterTypeClickHandler.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._filters, this._currentFulterType);
  }

  _getChildElements(selector) {
    return this.getElement().querySelectorAll(selector);
  }

  _filterTypeClickHandler(event) {
    this._callback.filterTypeChange(event.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    const filterElements = this._getChildElements(`.trip-filters__filter-input`);

    this._callback.filterTypeChange = callback;
    filterElements.forEach((element) => {
      element.addEventListener(`click`, this._filterTypeClickHandler);
    });

  }
}
