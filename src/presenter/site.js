import SiteMenuView from "../view/site-menu.js";
import AddButtonPresenter from "./add-button.js";
import TripPresenter from "./trip.js";
import TripInfoPresenter from "./trip-info.js";
import FilterPresenter from "./filter.js";
import {render, RenderPosition} from "../utils/render.js";
import {UpdatedItem} from "../const.js";


export default class Site {
  constructor(siteContainer, tripMainElement, siteControlsElement, tripEventsElement, message, menuItems, waypointsModel, offersModel, destinationsModel, filterModel) {
    this._siteContainer = siteContainer;
    this._tripMainElement = tripMainElement;
    this._siteControlsElement = siteControlsElement;
    this._tripEventsElement = tripEventsElement;
    this._message = message;
    this._menuItems = menuItems;
    this._waypointsModel = waypointsModel;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;
    this._filterModel = filterModel;
    this._waypoints = null;

    this._siteMenuComponent = new SiteMenuView(this._menuItems);

    this._tripInfoPresenter = new TripInfoPresenter(this._tripMainElement);
    this._tripPresenter = new TripPresenter(this._tripEventsElement, this._message, this._waypointsModel, this._offersModel, this._destinationsModel, this._filterModel);
    this._filterPresenter = new FilterPresenter(this._siteControlsElement, this._filterModel, this._waypointsModel);
    this._addButtonPresenter = new AddButtonPresenter(this._tripPresenter, this._tripMainElement);

    this._handleTripEvent = this._handleTripEvent.bind(this);

    this._tripPresenter.addObserver(this._handleTripEvent);
  }

  init() {
    this._waypoints = this._waypointsModel.getWaypoints();

    if (this._waypoints.some(Boolean)) {
      this._tripInfoPresenter.init(this._waypoints);
    }

    this._tripPresenter.init();
    this._filterPresenter.init();
    this._addButtonPresenter.init(true);

    render(this._siteControlsElement, this._siteMenuComponent, RenderPosition.AFTERBEGIN);
  }

  _handleTripEvent(updatedItem, update) {
    switch (updatedItem) {
      case UpdatedItem.TRIP_INFO:
        this._tripInfoPresenter.destroy();
        this._tripInfoPresenter.init(update);
        break;
      case UpdatedItem.ADD_BUTTON:
        this._addButtonPresenter.destroy();
        this._addButtonPresenter.init(update);
        break;
    }
  }
}
