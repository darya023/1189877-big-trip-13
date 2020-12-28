import Observer from "../utils/observer.js";
import {FilterType} from "../const.js";

export default class Filter extends Observer {
  constructor() {
    super();
    this._activeFilter = FilterType.EVERYTHING;
  }

  getFilter() {
    return this._activeFilter;
  }

  setFilter(updateType, updatedFilter) {
    this._activeFilter = updatedFilter;
    this._notify(updateType, updatedFilter);
  }
}
