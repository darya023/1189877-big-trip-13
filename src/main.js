import {generateSiteMenuItems} from "./mock/site-menu-items.js";
import SitePresenter from "./presenter/site.js";
import WaypointsModel from "./model/waypoints.js";
import OffersModel from "./model/offers.js";
import DestinationsModel from "./model/destinations.js";
import FilterModel from "./model/filter.js";
import Api from "./api.js";
import {UpdateType} from "./const.js";

const AUTHORIZATION = `Basic EJP6u7zkWffTwOB`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;
const menuItems = generateSiteMenuItems();
const emptyTripMessage = `Click New Event to create your first point`;
const loadingMessage = `Loading...`;
const errorMessage = `Error. Try again`;
const siteBodyElement = document.querySelector(`.page-body`);
const tripMainElement = siteBodyElement.querySelector(`.trip-main`);
const siteControlsElement = tripMainElement.querySelector(`.trip-controls`);
const tripEventsElement = siteBodyElement.querySelector(`.trip-events`);
const api = new Api(END_POINT, AUTHORIZATION);
const waypointsModel = new WaypointsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();
const filterModel = new FilterModel();

const setOffers = (waypoints, offers) => {
  offersModel.setOffers(offers);

  for (const waypoint of waypoints) {
    if (waypoint.offers.some(Boolean)) {
      waypoint.offers = offersModel.getOffers(waypoint.type.name, true).map((waypointOffer) => {
        const offer = waypoint.offers.filter((currentOffers) => currentOffers.value === waypointOffer.value)[0];

        return Object.assign(
            {},
            waypointOffer,
            {
              checked: offer ? offer.checked : false
            }
        );
      });
    }
  }

  return waypoints;
};

const setDestinations = (destinations) => {
  destinationsModel.setDestinations(destinations);
};

const setWaypoints = (waypoints) => {
  waypointsModel.setWaypoints(UpdateType.INIT, waypoints);
};

Promise
  .all([
    api.getWaypoints(),
    api.getOffers(),
    api.getDestinations(),
  ])
  .then(([waypoints, offers, destinations])=>{
    waypoints = setOffers(waypoints, offers);
    setDestinations(destinations);
    setWaypoints(waypoints);
  })
  .catch(() => {
    waypointsModel.setWaypoints(UpdateType.ERROR, []);
  });

const sitePresenter = new SitePresenter(siteBodyElement, tripMainElement, siteControlsElement, tripEventsElement, loadingMessage, emptyTripMessage, errorMessage, menuItems, waypointsModel, offersModel, destinationsModel, filterModel, api);

sitePresenter.init();
