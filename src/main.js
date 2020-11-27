import {createTripInfoTemplate} from "./view/trip-info.js";
import {createSiteMenuTemplate} from "./view/site-menu.js";
import {createTripFiltersTemplate} from "./view/trip-filters.js";
import {createTripSortingTemplate} from "./view/trip-sorting.js";
import {createTripTemplate} from "./view/trip-list.js";
import {createWaypointTemplate} from "./view/trip.js";
import {generateWaypoint} from "./mock/trip.js";
import {createWaypointFormTemplate} from "./view/trip-form.js";
import {createSiteMsgTemplate} from "./view/trip-msg.js";
import {createWaypointOffersTemplate} from "./view/trip-offers.js";
import {createWaypointDestinationTemplate} from "./view/trip-destination.js";
import {generateFilters} from "./mock/trip-filters.js";
import {generateMenuItems} from "./mock/site-menu.js";
import {generateSortingItems} from "./mock/trip-sorting.js";

const WAYPOINTS_COUNT = 20;
const waypoints = new Array(WAYPOINTS_COUNT).fill().map(generateWaypoint);
waypoints.sort((a, b) => a.startDate - b.startDate);

const filters = generateFilters(waypoints);
const menuItems = generateMenuItems();
const sortingItems = generateSortingItems();

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteBodyElement = document.querySelector(`.page-body`);
const tripMainElement = siteBodyElement.querySelector(`.trip-main`);

render(tripMainElement, createTripInfoTemplate(waypoints), `afterbegin`);

const siteControlsElement = tripMainElement.querySelector(`.trip-controls`);

render(siteControlsElement, createSiteMenuTemplate(menuItems), `afterbegin`);
render(siteControlsElement, createTripFiltersTemplate(filters), `beforeend`);

const tripEventsElement = siteBodyElement.querySelector(`.trip-events`);

render(tripEventsElement, createTripSortingTemplate(sortingItems), `beforeend`);
render(tripEventsElement, createTripTemplate(waypoints), `beforeend`);

const tripListElement = tripEventsElement.querySelector(`.trip-events__list`);

if (!waypoints.some(Boolean)) {
  render(tripEventsElement, createSiteMsgTemplate(waypoints), `beforeend`);
}

render(tripListElement, createWaypointFormTemplate(waypoints[0]), `afterbegin`);

const tripDetails = tripListElement.querySelector(`.event__details`);

render(tripDetails, createWaypointOffersTemplate(waypoints[0]), `afterbegin`);
render(tripDetails, createWaypointDestinationTemplate(waypoints[0]), `beforeend`);

for (let i = 1; i < WAYPOINTS_COUNT; i++) {
  render(tripListElement, createWaypointTemplate(waypoints[i]), `beforeend`);
}

