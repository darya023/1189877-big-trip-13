import AbstractView from "./abstract.js";

const createFilterItems = (filters, currentFilterType) => {
  const result = [];

  for (const filter of filters) {
    const elem = `<div class="trip-filters__filter">
      <input 
        id="filter-${filter.type}"
        class="trip-filters__filter-input
        visually-hidden"
        type="radio"
        name="trip-filter"
        value="${filter.type}"
        ${(filter.type === currentFilterType) ? ` checked` : ``}
        ${(filter.disable) ? ` disabled` : ``}
      >
      <label class="trip-filters__filter-label" for="filter-${filter.type}">
        ${filter.type}
      </label>
    </div>`;

    result.push(elem);
  }

  return result.join(``);
};

const createFilterTemplate = (filters, currentFilterType) => {
  const createdFilterItems = createFilterItems(filters, currentFilterType);

  return `<h2 class="visually-hidden">Filter events</h2>
  <form class="trip-filters" action="#" method="get">
    ${createdFilterItems}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;
};

export default class Filter extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilterType = currentFilterType;

    this._filterElements = this._getChildElements(`.trip-filters__filter-input`);

    this._filterTypeClickHandler = this._filterTypeClickHandler.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._filters, this._currentFilterType);
  }

  _getChildElements(selector) {
    return this.getElement().querySelectorAll(selector);
  }

  _filterTypeClickHandler(event) {
    this._callback.filterTypeChange(event.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this._filterElements.forEach((element) => {
      element.addEventListener(`click`, this._filterTypeClickHandler);
    });

  }

  removeFilterTypeChangeHandler() {
    this._filterElements.forEach((element) => {
      element.removeEventListener(`click`, this._filterTypeClickHandler);
    });
  }
}
