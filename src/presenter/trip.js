import SortingView from "../view/sorting.js";
import TripView from "../view/trip.js";
import SiteMessageView from "../view/site-message.js";
import ToastView from "../view/toast.js";
import WaypointPresenter, {State as WaypointPresenterViewState} from "./waypoint.js";
import WaypointNewPresenter from "./waypoint-new.js";
import {SortingType, UpdateType, UserAction, FilterType} from "../const.js";
import {remove, render, RenderPosition} from "../utils/render.js";
import {sortByDate, sortByPrice, sortByTime} from "../utils/waypoint.js";

const SHOW_TIME = 5000;

export default class Trip {
  constructor(
      tripContainer,
      loadingMessage,
      emptyTripMessage,
      errorMessage,
      waypointsModel,
      offersModel,
      destinationsModel,
      filterModel,
      updateAddButton,
      getFilteredWaypoints,
      api,
      siteMenuComponent
  ) {
    this._tripContainer = tripContainer;
    this._loadingMessage = loadingMessage;
    this._emptyTripMessage = emptyTripMessage;
    this._errorMessage = errorMessage;
    this._waypointsModel = waypointsModel;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;
    this._filterModel = filterModel;
    this._updateAddButton = updateAddButton;
    this._getFilteredWaypoints = getFilteredWaypoints;
    this._api = api;
    this._siteMenuComponent = siteMenuComponent;

    this._currentSortingType = SortingType.DAY;
    this._isLoading = true;
    this._isError = false;

    this._tripComponent = new TripView();
    this._statsComponent = null;
    this._toastComponent = null;

    this._handleSortingTypeChange = this._handleSortingTypeChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._renderToast = this._renderToast.bind(this);

    this._waypointPresenter = new Map();
    this._waypointNewPresenter = new WaypointNewPresenter(this._tripComponent, this._handleViewAction, this._updateAddButton, this._renderToast);

    this._waypointsModel.addObserver(this._handleModelEvent);
    this._offersModel.addObserver(this._handleModelEvent);
    this._destinationsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._sortingItems = this._getSortingItems();
    render(this._tripContainer, this._tripComponent, RenderPosition.BEFOREEND);
    this._renderTrip();
  }

  createWaypoint() {
    this._waypointPresenter.forEach((presenter) => presenter.resetViewMode());
    this._currentSortingType = SortingType.DAY;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._waypointNewPresenter.init(this._offersModel, this._destinationsModel);
  }

  destroy(resetSortingType) {
    this._waypointNewPresenter.destroy();
    this._clearWaypoints();
    remove(this._sortingComponent);
    remove(this._siteMessageComponent);

    if (this._toastComponent !== null) {
      remove(this._toastComponent);
    }

    if (resetSortingType) {
      this._currentSortingType = SortingType.DAY;
    }
  }

  show() {
    this._tripContainer.classList.remove(`trip-events--hidden`);
    this.destroy(true);
    this._renderTrip();
    this.hidden = false;
  }

  hide() {
    this._tripContainer.classList.add(`trip-events--hidden`);
    this.hidden = true;
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

  _getSortedWaypoints(filteredWaypoints) {
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

  _handleModeChange() {
    this._waypointNewPresenter.destroy();
    this._waypointPresenter.forEach((presenter) => presenter.resetViewMode());
  }

  _handleSortingTypeChange(sortingType) {
    if (this._currentSortingType !== sortingType) {
      this._currentSortingType = sortingType;
      this.destroy();
      this._renderTrip();
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._waypointPresenter.get(data.id).init(data, this._offersModel, this._destinationsModel);
        break;
      case UpdateType.MINOR:
        this.destroy();
        this._renderTrip();
        break;
      case UpdateType.MAJOR:
        this.destroy(true);
        this._renderTrip();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._siteMessageComponent);
        this._renderTrip();
        break;
      case UpdateType.ERROR:
        this._isLoading = false;
        this._isError = true;
        remove(this._siteMessageComponent);
        this._renderTrip();
        break;
    }
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE:
        this._waypointPresenter.get(update.id).setViewState(WaypointPresenterViewState.SAVING);
        this._api.updateWaypoint(update)
          .then((waypoint) => {
            waypoint.offers = this._offersModel.getOffers(waypoint.type.name, true).map((waypointOffer) => {
              const offer = waypoint.offers.filter((currentOffers) => currentOffers.value === waypointOffer.value)[0];

              return Object.assign(
                  {},
                  waypointOffer,
                  {
                    checked: offer ? offer.checked : false
                  }
              );
            });
            this._waypointsModel.updateWaypoint(updateType, waypoint);
          })
          .catch(() => {
            this._waypointPresenter.get(update.id).setViewState(WaypointPresenterViewState.ABORTING);
          });
        break;
      case UserAction.ADD:
        this._waypointNewPresenter.setSaving();
        this._api.addWaypoint(update)
          .then((response) => {
            this._waypointsModel.addWaypoint(updateType, response);
          })
          .catch(() => {
            this._waypointNewPresenter.setAborting();
          });
        break;
      case UserAction.DELETE:
        this._waypointPresenter.get(update.id).setViewState(WaypointPresenterViewState.DELETING);
        this._api.deleteWaypoint(update)
          .then(() => {
            this._waypointsModel.deleteWaypoint(updateType, update);
          })
          .catch(() => {
            this._waypointPresenter.get(update.id).setViewState(WaypointPresenterViewState.ABORTING);
          });
        break;
    }
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
    const waypointPresenter = new WaypointPresenter(this._tripComponent, this._handleViewAction, this._handleModeChange, this._renderToast);

    waypointPresenter.init(waypoint, this._offersModel, this._destinationsModel);
    this._waypointPresenter.set(waypoint.id, waypointPresenter);
  }

  _renderWaypoints(waypoints) {
    waypoints.forEach((waypoint) => this._renderWaypoint(waypoint));
  }

  _renderMessage(emptyTrip) {
    if (this._isLoading) {
      this._siteMessageComponent = new SiteMessageView(this._loadingMessage);
      render(this._tripContainer, this._siteMessageComponent, RenderPosition.BEFOREEND);
    }
    if (this._isError) {
      this._siteMessageComponent = new SiteMessageView(this._errorMessage);
      render(this._tripContainer, this._siteMessageComponent, RenderPosition.BEFOREEND);
      return;
    }
    if (emptyTrip) {
      this._siteMessageComponent = new SiteMessageView(this._emptyTripMessage);
      render(this._tripContainer, this._siteMessageComponent, RenderPosition.BEFOREEND);
    }
  }

  _renderTrip() {
    if (this._isLoading) {
      this._renderMessage();
      return;
    }

    const filteredWaypoints = this._getFilteredWaypoints();
    const waypoints = this._getSortedWaypoints(filteredWaypoints);

    if (!waypoints.some(Boolean)) {
      this._renderMessage(true);
      return;
    }

    this._renderSorting();
    this._renderWaypoints(waypoints);
  }

  _renderToast(errorComponent, message) {
    if (this._toastComponent !== null) {
      remove(this._toastComponent);
    }

    this._toastComponent = new ToastView(message);
    render(errorComponent, this._toastComponent, RenderPosition.AFTER);

    setTimeout(remove, SHOW_TIME, this._toastComponent);
  }
}
