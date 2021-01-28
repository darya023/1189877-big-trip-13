import FilterView from "../view/filter.js";
import {filter} from "../utils/filter.js";
import {UpdateType, FilterType} from "../const.js";
import {replace, render, RenderPosition, remove} from "../utils/render.js";

export default class Filter {
  constructor(filterContainer, filterModel, waypointsModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._waypointsModel = waypointsModel;
    this._currentFilter = null;
    this._filterComponent = null;

    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();

    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilterView(filters, this._currentFilter);
    this.setHandlers();

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  setHandlers() {
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);
  }

  removeHandlers() {
    this._filterComponent.removeFilterTypeChangeHandler(this._handleFilterTypeChange);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._currentFilter !== filterType) {
      this._currentFilter = filterType;
      this._filterModel.setFilter(UpdateType.MAJOR, filterType);
    }
  }

  _getFilters() {
    const waypoints = this._waypointsModel.getWaypoints();

    return [
      {
        type: FilterType.EVERYTHING,
        name: FilterType.EVERYTHING,
        disable: false,
      },
      {
        type: FilterType.FUTURE,
        name: FilterType.FUTURE,
        disable: !filter[FilterType.FUTURE](waypoints).some(Boolean),
      },
      {
        type: FilterType.PAST,
        name: FilterType.PAST,
        disable: !filter[FilterType.PAST](waypoints).some(Boolean),
      },
    ];
  }
}
