import SiteMenuView from "./view/site-menu.js";
import {generateWaypoint} from "./mock/waypoint.js";
import {generateSiteMenuItems} from "./mock/site-menu-items.js";
import TripPresenter from "./presenter/trip.js";
import FilterPresenter from "./presenter/filter.js";
import TripInfoPresenter from "./presenter/trip-info.js";
import WaypointsModel from "./model/waypoints.js";
import OffersModel from "./model/offers.js";
import DestinationsModel from "./model/destinations.js";
import FilterModel from "./model/filter.js";
import {render, RenderPosition} from "./utils/render.js";

const WAYPOINTS_COUNT = 2;
let waypoints = new Array(WAYPOINTS_COUNT).fill().map(generateWaypoint);
const menuItems = generateSiteMenuItems();
const message = `Click New Event to create your first point`;
const siteBodyElement = document.querySelector(`.page-body`);
const tripMainElement = siteBodyElement.querySelector(`.trip-main`);
const siteControlsElement = tripMainElement.querySelector(`.trip-controls`);
const waypointsModel = new WaypointsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();
const filterModel = new FilterModel();
const filterPresenter = new FilterPresenter(siteControlsElement, filterModel, waypointsModel);

for (const waypoint of waypoints) {
  waypoint.offers = offersModel.getOffers(waypoint.type.name, true);
  waypoint.destination = destinationsModel.getDestination(waypoint.destination.name);
}

waypointsModel.setWaypoints(waypoints);

render(siteControlsElement, new SiteMenuView(menuItems), RenderPosition.AFTERBEGIN);

filterPresenter.init();

if (waypoints.some(Boolean)) {
  const tripInfoPresenter = new TripInfoPresenter(tripMainElement, filterModel, waypointsModel, offersModel, destinationsModel);

  tripInfoPresenter.init();
}

const tripEventsElement = siteBodyElement.querySelector(`.trip-events`);
const tripPresenter = new TripPresenter(tripEventsElement, message, waypointsModel, offersModel, destinationsModel, filterModel);

tripPresenter.init();

const waypointAddButton = document.querySelector(`.trip-main__event-add-btn`);

waypointAddButton.addEventListener(`click`, (event) => {
  event.preventDefault();
  tripPresenter.createWaypoint();
});
