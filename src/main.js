import {generateSiteMenuItems} from "./utils/site-menu-items.js";
import SitePresenter from "./presenter/site.js";
import WaypointsModel from "./model/waypoints.js";
import OffersModel from "./model/offers.js";
import DestinationsModel from "./model/destinations.js";
import FilterModel from "./model/filter.js";
import Api from "./api/api.js";
import Store from "./api/store.js";
import Provider from "./api/provider.js";
import {UpdateType} from "./const.js";
import {isOnline} from "./utils/utils.js";

const AUTHORIZATION = `Basic EJP6u7zkWffTwOB`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;
const STORE_PREFIX = `big-trip-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const menuItems = generateSiteMenuItems();
const emptyTripMessage = `Click New Event to create your first point`;
const loadingMessage = `Loading...`;
const errorMessage = `Error. Try again`;
const siteBodyElement = document.querySelector(`.page-body`);
const tripMainElement = siteBodyElement.querySelector(`.trip-main`);
const siteControlsElement = tripMainElement.querySelector(`.trip-controls`);
const tripEventsElement = siteBodyElement.querySelector(`.trip-events`);

const tripContainerElement = tripEventsElement.parentElement;
const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

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
    apiWithProvider.getWaypoints(),
    apiWithProvider.getOffers(),
    apiWithProvider.getDestinations(),
  ])
  .then(([waypoints, offers, destinations])=>{
    waypoints = setOffers(waypoints, offers);
    setDestinations(destinations);
    setWaypoints(waypoints);
  })
  .catch(() => {
    waypointsModel.setWaypoints(UpdateType.ERROR, []);
  });

const sitePresenter = new SitePresenter(siteBodyElement, tripMainElement, siteControlsElement, tripEventsElement, tripContainerElement, loadingMessage, emptyTripMessage, errorMessage, menuItems, waypointsModel, offersModel, destinationsModel, filterModel, apiWithProvider);

sitePresenter.init();

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`./sw.js`);
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  apiWithProvider.sync();
  sitePresenter.online();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
  sitePresenter.offline();
});

if (!isOnline()) {
  sitePresenter.offline();
}
