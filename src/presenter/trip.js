import SortingView from "../view/sorting.js";
import TripView from "../view/trip.js";
import SiteMessageView from "../view/site-message.js";
import WaypointPresenter from "./waypoint.js";
import {update} from "../utils/utils.js";
import {SortingType} from "../const.js";
import {render, RenderPosition} from "../utils/render.js";
import {sortByDate, sortByPrice, sortByTime} from "../utils/waypoint.js";

export default class Trip {
  constructor(tripContainer, sortingItems, message) {
    this._tripContainer = tripContainer;
    this._sortingItems = sortingItems;
    this._message = message;
    this._currentSortingType = SortingType.DAY;
    this._waypointPresenter = new Map();

    this._siteMessageComponent = new SiteMessageView(this._message);
    this._sortingComponent = new SortingView(this._sortingItems);
    this._tripComponent = new TripView();

    this._handleWaypointChange = this._handleWaypointChange.bind(this);
    this._handleSortingChange = this._handleSortingChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(waypoints) {
    this._waypoints = waypoints.slice();
    this._renderTrip();
  }

  _clearWaypoints() {
    this._waypointPresenter.forEach((presenter) => presenter.destroy());
    this._waypointPresenter = new Map();
  }

  _handleModeChange() {
    this._waypointPresenter.forEach((presenter) => presenter.resetViewMode());
  }

  _handleWaypointChange(updatedWaypoint) {
    this._waypoints = update(this._waypoints, updatedWaypoint);
    this._waypointPresenter.get(updatedWaypoint.id).init(updatedWaypoint);
  }

  _handleSortingChange(sortingType) {
    if (this._currentSortingType !== sortingType) {
      this._currentSortingType = sortingType;
      this._clearWaypoints();
      this._renderWaypoints();
    }
  }

  _sortingWaypoints() {
    switch (this._currentSortingType) {
      case SortingType.DAY:
        sortByDate(this._waypoints);
        break;
      case SortingType.TIME:
        sortByTime(this._waypoints);
        break;
      case SortingType.PRICE:
        sortByPrice(this._waypoints);
        break;
      default:
        sortByDate(this._waypoints);
    }
  }

  _renderSorting() {
    this._sortingComponent.setSortingItemClickHandler(this._handleSortingChange);
    render(this._tripContainer, this._sortingComponent, RenderPosition.BEFOREEND);
  }

  _renderWaypoint(waypoint) {
    const waypointPresenter = new WaypointPresenter(this._tripComponent, this._handleWaypointChange, this._handleModeChange);

    waypointPresenter.init(waypoint);
    this._waypointPresenter.set(waypoint.id, waypointPresenter);
  }

  _renderWaypoints() {
    this._sortingWaypoints();

    for (let i = 0; i < this._waypoints.length; i++) {
      this._renderWaypoint(this._waypoints[i]);
    }
  }

  _renderMessage() {
    render(this._tripContainer, this._siteMessageComponent, RenderPosition.BEFOREEND);
  }

  _renderTrip() {
    if (!this._waypoints.some(Boolean)) {
      this._renderMessage();
      return;
    }

    this._renderSorting();
    render(this._tripContainer, this._tripComponent, RenderPosition.BEFOREEND);
    this._renderWaypoints();
  }
}
