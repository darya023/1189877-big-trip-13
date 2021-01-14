import SiteMenuView from "../view/site-menu.js";
import AddButtonPresenter from "./add-button.js";
import TripPresenter from "./trip.js";
import TripInfoPresenter from "./trip-info.js";
import FilterPresenter from "./filter.js";
import {render, RenderPosition} from "../utils/render.js";
import {filter} from "../utils/filter.js";
import {UpdateType} from "../const.js";

export default class Site {
  constructor(siteContainer, tripMainElement, siteControlsElement, tripEventsElement, loadingMessage, emptyTripMessage, errorMessage, menuItems, waypointsModel, offersModel, destinationsModel, filterModel, api) {
    this._siteContainer = siteContainer;
    this._tripMainElement = tripMainElement;
    this._siteControlsElement = siteControlsElement;
    this._tripEventsElement = tripEventsElement;
    this._loadingMessage = loadingMessage;
    this._emptyTripMessage = emptyTripMessage;
    this._errorMessage = errorMessage;
    this._menuItems = menuItems;
    this._waypointsModel = waypointsModel;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;
    this._filterModel = filterModel;
    this._api = api;
    this._waypoints = null;
    this._hasInitUpdateType = false;

    this._siteMenuComponent = new SiteMenuView(this._menuItems);

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._updateAddButton = this._updateAddButton.bind(this);
    this._getWaypoints = this._getWaypoints.bind(this);

    this._tripInfoPresenter = new TripInfoPresenter(this._tripMainElement);
    this._tripPresenter = new TripPresenter(this._tripEventsElement, this._loadingMessage, this._emptyTripMessage, this._errorMessage, this._waypointsModel, this._offersModel, this._destinationsModel, this._filterModel, this._updateAddButton, this._getWaypoints, this._api);
    this._filterPresenter = new FilterPresenter(this._siteControlsElement, this._filterModel, this._waypointsModel);
    this._addButtonPresenter = new AddButtonPresenter(this._tripPresenter, this._tripMainElement);

    this._waypointsModel.addObserver(this._handleModelEvent);
    this._offersModel.addObserver(this._handleModelEvent);
    this._destinationsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._waypoints = this._getWaypoints();

    // if (this._waypoints.some(Boolean)) {
    //   this._tripInfoPresenter.init(this._waypoints);
    // }

    this._filterPresenter.init();
    this._tripPresenter.init();
    this._addButtonPresenter.init();

    render(this._siteControlsElement, this._siteMenuComponent, RenderPosition.AFTERBEGIN);
  }

  _updateAddButton(isNotDisabled) {
    this._addButtonPresenter.destroy();
    this._addButtonPresenter.init(isNotDisabled);
  }

  _handleModelEvent(updateType) {
    this._waypoints = this._getWaypoints();
    this._filterPresenter.init();

    if (updateType === UpdateType.INIT) {
      this._hasInitUpdateType = true;
      this._updateAddButton();

      if (this._waypoints.some(Boolean)) {
        this._tripInfoPresenter.init(this._waypoints);
      }

      return;
    }

    if (updateType === UpdateType.ERROR) {
      this._updateAddButton();

      if (this._hasInitUpdateType) {
        this._tripInfoPresenter.destroy();
      }

      return;
    }

    this._updateAddButton(true);
    this._tripInfoPresenter.destroy();
    this._tripInfoPresenter.init(this._waypoints);
  }

  _getWaypoints() {
    const filterType = this._filterModel.getFilter();
    const waypoints = this._waypointsModel.getWaypoints();

    return filter[filterType](waypoints);
  }
}
