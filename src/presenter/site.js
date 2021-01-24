import SiteMenuView from "../view/site-menu.js";
import StatsView from "../view/stats.js";
import NotificationBarView from "../view/notification-bar.js";
import AddButtonPresenter from "./add-button.js";
import TripPresenter from "./trip.js";
import TripInfoPresenter from "./trip-info.js";
import FilterPresenter from "./filter.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {filter} from "../utils/filter.js";
import {isOnline} from "../utils/utils.js";
import {UpdateType, MenuItem} from "../const.js";

export default class Site {
  constructor(
      siteContainer,
      tripMainElement,
      siteControlsElement,
      tripEventsElement,
      tripContainerElement,
      loadingMessage,
      emptyTripMessage,
      errorMessage,
      menuItems,
      waypointsModel,
      offersModel,
      destinationsModel,
      filterModel,
      api
  ) {
    this._siteContainer = siteContainer;
    this._tripMainElement = tripMainElement;
    this._siteControlsElement = siteControlsElement;
    this._tripEventsElement = tripEventsElement;
    this._tripContainerElement = tripContainerElement;
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

    this._siteMenuComponent = null;
    this._statsComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._updateAddButton = this._updateAddButton.bind(this);
    this._getWaypoints = this._getWaypoints.bind(this);
    this._handleAddButtonClick = this._handleAddButtonClick.bind(this);

    this._tripInfoPresenter = new TripInfoPresenter(this._tripMainElement);
    this._tripPresenter = new TripPresenter(
        this._tripEventsElement,
        this._loadingMessage,
        this._emptyTripMessage,
        this._errorMessage,
        this._waypointsModel,
        this._offersModel,
        this._destinationsModel,
        this._filterModel,
        this._updateAddButton,
        this._getWaypoints,
        this._api,
        this._siteMenuComponent
    );
    this._isAddButtonDisabled = false;

    this._filterPresenter = new FilterPresenter(this._siteControlsElement, this._filterModel, this._waypointsModel);
    this._addButtonPresenter = new AddButtonPresenter(this._tripPresenter, this._tripMainElement, this._handleAddButtonClick);

    this._waypointsModel.addObserver(this._handleModelEvent);
    this._offersModel.addObserver(this._handleModelEvent);
    this._destinationsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._waypoints = this._getWaypoints();

    this._filterPresenter.init();
    this._tripPresenter.init();
    this._addButtonPresenter.init(isOnline());

    this._statsComponent = new StatsView(this._waypointsModel.getWaypoints());
    this._statsComponent.hide();
    render(this._tripContainerElement, this._statsComponent, RenderPosition.BEFOREEND);

    this._getWaypoints = this._getWaypoints.bind(this);
    this._handleSiteMenuClick = this._handleSiteMenuClick.bind(this);

    this._renderMenu(MenuItem.TABLE);
  }

  online() {
    this._updateAddButton(!this._isAddButtonDisabled && isOnline());
    remove(this._notificationBarComponent);
  }

  offline() {
    const message = `Connection lost: offline mode`;

    this._renderNotificationBar(message);
    this._updateAddButton(isOnline());
  }

  _updateAddButton(isNotDisabled) {
    this._addButtonPresenter.destroy();
    this._addButtonPresenter.init(isNotDisabled);
  }

  _handleModelEvent(updateType) {
    this._waypoints = this._getWaypoints();
    this._filterPresenter.init();
    remove(this._statsComponent);
    this._isAddButtonDisabled = false;


    if (updateType === UpdateType.ERROR) {
      this._updateAddButton();

      return;
    }

    this._statsComponent = new StatsView(this._waypointsModel.getWaypoints());
    this._statsComponent.hide();
    render(this._tripContainerElement, this._statsComponent, RenderPosition.BEFOREEND);

    if (updateType === UpdateType.INIT) {
      this._updateAddButton(true && isOnline());

      if (this._waypoints.some(Boolean)) {
        this._tripInfoPresenter.init(this._waypoints);
      }

      return;
    }

    this._updateAddButton(isOnline());
    this._tripInfoPresenter.destroy();
    this._tripInfoPresenter.init(this._waypoints);
  }

  _handleSiteMenuClick(menuItem) {
    remove(this._siteMenuComponent);
    this._renderMenu(menuItem);

    switch (menuItem) {
      case MenuItem.TABLE:
        this._statsComponent.hide();
        this._tripPresenter.show();
        break;
      case MenuItem.STATS:
        this._statsComponent.show();
        this._tripPresenter.hide();
        break;
    }
  }

  _handleAddButtonClick() {
    this._isAddButtonDisabled = true;

    if (!isOnline()) {
      this._updateAddButton(true);

      return;
    }

    if (this._tripPresenter.hidden) {
      remove(this._siteMenuComponent);
      this._renderMenu(MenuItem.TABLE);
      this._statsComponent.hide();
      this._tripPresenter.show();
    }

    this._tripPresenter.createWaypoint();
    this._addButtonPresenter.destroy();
    this._addButtonPresenter.init(false);
  }

  _setMenuActiveItem(menuItem) {
    this._menuItems.forEach((item) => {
      if (item.name.toUpperCase() === menuItem) {
        item.active = true;

        return;
      }

      item.active = false;

      return;
    });
  }

  _renderMenu(menuItem) {
    this._setMenuActiveItem(menuItem);
    this._siteMenuComponent = new SiteMenuView(this._menuItems);
    this._siteMenuComponent.setMenuClickHandler(this._handleSiteMenuClick);
    render(this._siteControlsElement, this._siteMenuComponent, RenderPosition.AFTERBEGIN);
  }

  _renderNotificationBar(message) {
    this._notificationBarComponent = new NotificationBarView(message);
    render(this._siteContainer, this._notificationBarComponent, RenderPosition.AFTERBEGIN);
  }

  _getWaypoints() {
    const filterType = this._filterModel.getFilter();
    const waypoints = this._waypointsModel.getWaypoints();

    return filter[filterType](waypoints);
  }
}
