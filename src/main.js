import {generateWaypoint} from "./mock/waypoint.js";
import {generateSiteMenuItems} from "./mock/site-menu-items.js";
import SitePresenter from "./presenter/site.js";
import WaypointsModel from "./model/waypoints.js";
import OffersModel from "./model/offers.js";
import DestinationsModel from "./model/destinations.js";
import FilterModel from "./model/filter.js";

const WAYPOINTS_COUNT = 3;
const waypoints = new Array(WAYPOINTS_COUNT).fill().map(generateWaypoint);
const menuItems = generateSiteMenuItems();
const message = `Click New Event to create your first point`;
const siteBodyElement = document.querySelector(`.page-body`);
const tripMainElement = siteBodyElement.querySelector(`.trip-main`);
const siteControlsElement = tripMainElement.querySelector(`.trip-controls`);
const tripEventsElement = siteBodyElement.querySelector(`.trip-events`);
const waypointsModel = new WaypointsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();
const filterModel = new FilterModel();

for (const waypoint of waypoints) {
  waypoint.offers = offersModel.getOffers(waypoint.type.name, true);
  waypoint.destination = destinationsModel.getDestination(waypoint.destination.name);
}

waypointsModel.setWaypoints(waypoints);

const sitePresenter = new SitePresenter(siteBodyElement, tripMainElement, siteControlsElement, tripEventsElement, message, menuItems, waypointsModel, offersModel, destinationsModel, filterModel);

sitePresenter.init();
