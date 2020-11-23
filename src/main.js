import {createTripInfoTemplate} from "./view/trip-info.js";
import {createSiteMenuTemplate} from "./view/site-menu.js";
import {createTripFiltersTemplate} from "./view/trip-filters.js";
import {createTripSortingTemplate} from "./view/trip-sorting.js";
import {createTripListTemplate} from "./view/trip-list.js";
import {createTripTemplate} from "./view/trip.js";
import {createTripFormTemplate} from "./view/trip-form.js";
import {createTripMsgTemplate} from "./view/trip-msg.js";

const TRIP_COUNT = 3;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteBodyElement = document.querySelector(`.page-body`);
const tripMainElement = siteBodyElement.querySelector(`.trip-main`);

render(tripMainElement, createTripInfoTemplate(), `afterbegin`);

const siteControlsElement = tripMainElement.querySelector(`.trip-controls`);

render(siteControlsElement, createSiteMenuTemplate(), `afterbegin`);
render(siteControlsElement, createTripFiltersTemplate(), `beforeend`);

const tripEventsElement = siteBodyElement.querySelector(`.trip-events`);

render(tripEventsElement, createTripSortingTemplate(), `beforeend`);
render(tripEventsElement, createTripListTemplate(), `beforeend`);

const tripListElement = tripEventsElement.querySelector(`.trip-events__list`);

render(tripListElement, createTripFormTemplate(), `afterbegin`);

for (let i = 0; i < TRIP_COUNT; i++) {
  render(tripListElement, createTripTemplate(), `beforeend`);
}

render(tripEventsElement, createTripMsgTemplate(), `beforeend`);
