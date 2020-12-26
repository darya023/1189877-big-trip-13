import SortingView from "../view/sorting.js";
import TripView from "../view/trip.js";
import SiteMessageView from "../view/site-message.js";
import WaypointPresenter from "./waypoint.js";
import WaypointNewPresenter from "./waypoint-new.js";
import {SortingType, UpdateType, UserAction, FilterType, UpdatedItem} from "../const.js";
import {remove, render, RenderPosition} from "../utils/render.js";
import {filter} from "../utils/filter.js";
import {sortByDate, sortByPrice, sortByTime} from "../utils/waypoint.js";
import Observer from "../utils/observer.js";

export default class Trip extends Observer {
  constructor(tripContainer, message, waypointsModel, offersModel, destinationsModel, filterModel) {
    super();
    this._tripContainer = tripContainer;
    this._message = message;
    this._waypointsModel = waypointsModel;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;
    this._filterModel = filterModel;
    this._currentSortingType = SortingType.DAY;
    this._waypointPresenter = new Map();
    this._waypoints = null;

    this._siteMessageComponent = new SiteMessageView(this._message);
    this._tripComponent = new TripView();

    this._handleSortingTypeChange = this._handleSortingTypeChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleWaypointNewEvent = this._handleWaypointNewEvent.bind(this);

    this._waypointNewPresenter = new WaypointNewPresenter(this._tripComponent, this._handleViewAction);

    this._waypointsModel.addObserver(this._handleModelEvent);
    this._offersModel.addObserver(this._handleModelEvent);
    this._destinationsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._waypointNewPresenter.addObserver(this._handleWaypointNewEvent);

  }

  init() {
    this._sortingItems = this._getSortingItems();
    render(this._tripContainer, this._tripComponent, RenderPosition.BEFOREEND);
    this._renderTrip();
  }

  createWaypoint() {
    this._currentSortingType = SortingType.DAY;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._waypointNewPresenter.init(this._offersModel, this._destinationsModel);
  }

  _getSortingItems() {
    return [
      {
        type: SortingType.DAY,
        name: `Day`,
        disabled: false,
      },
      {
        type: SortingType.EVENT,
        name: `Event`,
        disabled: true,
      },
      {
        type: SortingType.TIME,
        name: `Time`,
        disabled: false,
      },
      {
        type: SortingType.PRICE,
        name: `Price`,
        disabled: false,
      },
      {
        type: SortingType.OFFER,
        name: `Offers`,
        disabled: true,
      }
    ];
  }

  _getWaypoints() {
    const filterType = this._filterModel.getFilter();
    const waypoints = this._waypointsModel.getWaypoints();
    const filteredWaypoints = filter[filterType](waypoints);

    switch (this._currentSortingType) {
      case SortingType.DAY:
        return sortByDate(filteredWaypoints);
      case SortingType.TIME:
        return sortByTime(filteredWaypoints);
      case SortingType.PRICE:
        return sortByPrice(filteredWaypoints);
      default:
        throw new Error(`Sorting type not implemented: ` + this._currentSortingType);
    }
  }

  _clearWaypoints() {
    this._waypointPresenter.forEach((presenter) => presenter.destroy());
    this._waypointPresenter = new Map();
  }

  _clearTrip(resetSortingType) {
    this._waypointNewPresenter.destroy();
    this._clearWaypoints();
    remove(this._sortingComponent);
    remove(this._siteMessageComponent);

    if (resetSortingType) {
      this._currentSortingType = SortingType.DAY;
    }
  }

  _handleModeChange() {
    this._waypointNewPresenter.destroy();
    this._waypointPresenter.forEach((presenter) => presenter.resetViewMode());
  }

  _handleSortingTypeChange(sortingType) {
    if (this._currentSortingType !== sortingType) {
      this._currentSortingType = sortingType;
      this._clearTrip();
      this._renderTrip();
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._waypointPresenter.get(data.id).init(data, this._offersModel, this._destinationsModel);
        break;
      case UpdateType.MINOR:
        this._clearTrip();
        this._renderTrip();
        break;
      case UpdateType.MAJOR:
        this._clearTrip(true);
        this._renderTrip();
        break;
    }

    this._waypoints = this._getWaypoints();
    this._updateSiteState(UpdatedItem.TRIP_INFO, this._waypoints);
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE:
        this._waypointsModel.updateWaypoint(updateType, update);
        break;
      case UserAction.ADD:
        this._waypointsModel.addWaypoint(updateType, update);
        break;
      case UserAction.DELETE:
        this._waypointsModel.deleteWaypoint(updateType, update);
        break;
    }
  }

  _handleWaypointNewEvent(update) {
    this._updateSiteState(UpdatedItem.ADD_BUTTON, update);
  }

  _updateSiteState(updatedItem, update) {
    this._notify(updatedItem, update);
  }

  _renderSorting() {
    if (this._sortingComponent !== null) {
      this._sortingComponent = null;
    }

    this._sortingComponent = new SortingView(this._sortingItems, this._currentSortingType);
    this._sortingComponent.setSortingItemClickHandler(this._handleSortingTypeChange);
    render(this._tripContainer, this._sortingComponent, RenderPosition.AFTERBEGIN);
  }

  _renderWaypoint(waypoint) {
    const waypointPresenter = new WaypointPresenter(this._tripComponent, this._handleViewAction, this._handleModeChange);

    waypointPresenter.init(waypoint, this._offersModel, this._destinationsModel);
    this._waypointPresenter.set(waypoint.id, waypointPresenter);
  }

  _renderWaypoints(waypoints) {
    waypoints.forEach((waypoint) => this._renderWaypoint(waypoint));
  }

  _renderMessage() {
    render(this._tripContainer, this._siteMessageComponent, RenderPosition.BEFOREEND);
  }

  _renderTrip() {
    this._waypoints = this._getWaypoints();

    if (!this._waypoints.some(Boolean)) {
      this._renderMessage();
      return;
    }

    this._renderSorting();
    this._renderWaypoints(this._waypoints);
  }
}
