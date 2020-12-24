import TripInfoView from "../view/trip-info.js";
import {filter} from "../utils/filter.js";
import {replace, render, RenderPosition, remove} from "../utils/render.js";

export default class TripInfo {
  constructor(tripInfoContainer, filterModel, waypointsModel, offersModel, destinationsModel) {
    this._tripInfoContainer = tripInfoContainer;
    this._filterModel = filterModel;
    this._waypointsModel = waypointsModel;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;
    this._currentPrice = null;
    this._tripInfoComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._waypointsModel.addObserver(this._handleModelEvent);
    this._offersModel.addObserver(this._handleModelEvent);
    this._destinationsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();

    const waypoints = this._waypointsModel.getWaypoints();
    const filterType = this._filterModel.getFilter();
    const filteredWaypoints = filter[filterType](waypoints);
    const prevTripInfoComponent = this._tripInfoComponent;

    this._tripInfoComponent = new TripInfoView(filteredWaypoints);

    if (prevTripInfoComponent === null) {
      render(this._tripInfoContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this._tripInfoComponent, prevTripInfoComponent);
    remove(prevTripInfoComponent);
  }

  _handleModelEvent() {
    this.init();
  }
}
