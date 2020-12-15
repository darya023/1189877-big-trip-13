import SortingView from "../view/sorting.js";
import TripView from "../view/trip.js";
import SiteMessageView from "../view/site-message.js";
import WaypointPresenter from "./waypoint.js";
import {update} from "../utils/utils.js";
import {render, RenderPosition} from "../utils/render.js";

export default class Trip {
  constructor(tripContainer, sortingItems, message) {
    this._tripContainer = tripContainer;
    this._sortingItems = sortingItems;
    this._message = message;
    this._waypointPresenter = new Map();

    this._siteMessageComponent = new SiteMessageView(this._message);
    this._sortingComponent = new SortingView(this._sortingItems);
    this._tripComponent = new TripView();

    this._handleWaypointChange = this._handleWaypointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(waypoints) {
    this._waypoints = waypoints.slice();
    this._renderTrip();
  }

  _handleModeChange() {
    this._waypointPresenter.forEach((presenter) => presenter.resetViewMode());
  }

  _handleWaypointChange(updatedWaypoint) {
    this._waypoints = update(this._waypoints, updatedWaypoint);
    this._waypointPresenter.get(updatedWaypoint.id).init(updatedWaypoint);
  }

  _renderSorting() {
    render(this._tripContainer, this._sortingComponent, RenderPosition.BEFOREEND);
  }

  _renderWaypoint(waypoint) {
    const waypointPresenter = new WaypointPresenter(this._tripComponent, this._handleWaypointChange, this._handleModeChange);

    waypointPresenter.init(waypoint);
    this._waypointPresenter.set(waypoint.id, waypointPresenter);
  }

  _renderWaypoints() {
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
